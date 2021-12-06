import { Handler, HandlerSQSEvent } from '@root/types';
import { middyfySQS } from '@libs/lambda';
import { putRequest } from '@libs/superagent';
import { sendMessage } from '@libs/sqs';
import { Order } from '../types'

const { SQS_ORDER_PROCESS_QUEUE } = process.env;

/**
 * Handler function to place an order
 * @param {HandlerSQSEvent} event
 */
const handle: Handler = async (event: HandlerSQSEvent<Order>): Promise<void> => {
  try {
    const { Records: records } = event;

    const orderPromises = records.map(({ body: order }) => putRequest(
      'oms', `orders/${order.OrderId}`, order, { useAuth: true }
    ));
    const placedOrders = await Promise.allSettled(orderPromises); // [{ status: 'rejected', value: <X> }, { status: 'fulfilled', value: <X> }]

    // - Find rejected orders.
    const rejectedOrders = [];
    placedOrders.forEach(({ status }, index) => {
      if (status === 'rejected') {
        rejectedOrders.push(records[index]);
      }
    });

    // - Re-submit rejected orders to the order processing queue.
    const rejectedOrderPromises = rejectedOrders.map(order => sendMessage(SQS_ORDER_PROCESS_QUEUE, order, { delaySeconds: 10 }))
    await Promise.all(rejectedOrderPromises);
  } catch (error) {
    console.error('handler errors', error)
    // TODO: Handle push data to deadletter queue
  }
};

export default middyfySQS(handle);
