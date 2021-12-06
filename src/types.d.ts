import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult, SQSHandler, SQSEvent, SQSRecord as AWSSQSRecord } from 'aws-lambda';

declare type APIGatewayEventBody = APIGatewayProxyEvent['body'];
declare type APIGatewayResultBody = APIGatewayProxyResult['body'];
declare type SQSRecordBody = AWSSQSRecord['body'];

export type Handler = APIGatewayProxyHandler | SQSHandler;

/**
 * Interface for defining APIGateway handler event body.
 */
export interface HandlerAPIGatewayEvent<T> extends  APIGatewayProxyEvent {
  body: APIGatewayEventBody & T
}

/**
 * Interface for defining APIGateway handler response.
 */
export interface HandlerAPIGatewayResponse<T> extends APIGatewayProxyResult {
  statusCode: 200 | 400 | 500,
  body: APIGatewayResultBody & T
}

interface SQSRecord<T> extends AWSSQSRecord {
  body: SQSRecordBody & T
}

/**
 * Interface for defining SQS handler event body.
 */
export interface HandlerSQSEvent<T> extends  SQSEvent {
  Records: Array<SQSRecord<T>>
}
