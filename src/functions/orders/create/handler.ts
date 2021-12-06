import { Handler, HandlerAPIGatewayEvent, HandlerAPIGatewayResponse } from '@root/types';
import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { sendMessage } from '@libs/sqs';
import { Order } from '../types'

const { SQS_ORDER_PROCESS_QUEUE } = process.env;

/**
 * Handler function to make order
 * @param {HandlerAPIGatewayEvent} event
 */
const handle: Handler = async (event: HandlerAPIGatewayEvent<Order>): Promise<HandlerAPIGatewayResponse<Order>> => {
  try {
    const { body } = event;
    await sendMessage(SQS_ORDER_PROCESS_QUEUE, body);
    return formatJSONResponse<Order>(200, { status: 'processing', message: 'Thank you! Your order is being processed.' });
  } catch (error) {
    console.log(error)
    return formatJSONResponse<Order>(500, { status: 'error', message: 'Something went wrong while processing the order' });
  }
};

export default middyfy(handle);
