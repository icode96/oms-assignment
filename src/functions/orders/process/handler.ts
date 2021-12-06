import { v1 as uuidv1 } from 'uuid';
import csvtojson from 'csvtojson';
import { Handler } from '@root/types';
import { getObject } from '@libs/s3';
import { sendMessageBatch } from '@libs/sqs';


const { STORAGE_ORDER_CSV, SQS_ORDER_PROCESS_QUEUE } = process.env;

/**
 * Function to get base order template.
 * @param orderId
 * @returns { OrderId, TotalPrice, OrderLines }
 */
const getOrderTemplate = (orderId) => {
  return {
    OrderId: orderId,
    TotalPrice: 0,
    OrderLines: []
  }
}

/**
 * Function to read CSV files from S3.
 * @param fileNames
 */
const readFiles = async (fileNames: Array<string>) => {
  const getObjectPromises = fileNames.map(async key => {
    const resource = await getObject(STORAGE_ORDER_CSV, key, { toStream: true });
    // @ts-ignore
    return csvtojson().fromStream(resource);
  });

  const resolvers = await Promise.allSettled(getObjectPromises);

  const results = [];
  resolvers
    .filter(resolver => resolver.status === 'fulfilled')
    // @ts-ignore
    .forEach(orderLines => results.push(...orderLines.value));

  return results;
}

/**
 * Handler function to place an order
 */
const handle: Handler = async (): Promise<void> => {
  try {
    // - Read order lines from S3 files
    const orderLines = await readFiles(['export-1.csv', 'export-2.csv', 'export-3.csv']);

    // - Grouping and processing orders
    const orders = {};
    orderLines.forEach((orderLine) => {
      const { orderId, itemId, price, quantity } = orderLine;
      const processingOrder = orders[orderId] || getOrderTemplate(orderId);

      const orderLineTotal = Number(price) * Number(quantity);
      processingOrder.TotalPrice += orderLineTotal;
      processingOrder.OrderLines.push({
        ItemId: itemId,
        Quantity: quantity,
        PricePerItem: price,
        TotalPrice: orderLineTotal
      });

      orders[orderId] = processingOrder;
    });

    // - Mapping order chunks
    const orderEntries = Object.entries(orders);
    const orderBatches = orderEntries.reduce((orderBatch, current, index) => {
      const chunkIndex = Math.floor(index / 10)

      if(!orderBatch[chunkIndex]) {
        orderBatch[chunkIndex] = [] // start a new chunk
      }

      const order = current[1];
      orderBatch[chunkIndex].push({
        Id: uuidv1(),
        MessageBody: JSON.stringify(order),
        MessageAttributes: {},
        DelaySeconds: 5
      });

      return orderBatch
    }, [])

    for (let batch of orderBatches) {
      await sendMessageBatch(SQS_ORDER_PROCESS_QUEUE, batch)
    }
  } catch (error) {
    console.error('error', error)
  }
};

export default handle;
