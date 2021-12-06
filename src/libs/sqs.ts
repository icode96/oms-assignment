import { SQS } from 'aws-sdk';
import {SendMessageRequest} from "aws-sdk/clients/sqs";

let client: SQS = null

/**
 * Function to get SQSClient instance.
 */
const getClient = () => {
  if (client === null) {
    client = new SQS();
  }

  return client;
};

/**
 * Function to enqueue for give queue.
 * @param queueUrl
 * @param messageBody - Message content to be enqueued
 * @param [options]
 * @param [options.messageAttributes] - SQS Message attributes
 * @param [options.delaySeconds] - SQS delay to send message in seconds
 */
export const sendMessage = (queueUrl: string, messageBody, options: SendMessageOptions = {}) => {
  const { messageAttributes = {}, delaySeconds = 0 } = options;
  const formattedMessageBody = typeof messageBody === 'object' ? JSON.stringify(messageBody) : messageBody;

  return getClient().sendMessage({
    QueueUrl: queueUrl,
    MessageBody: formattedMessageBody,
    MessageAttributes: messageAttributes,
    DelaySeconds:delaySeconds
  }).promise();
}

/**
 * Function to batch enqueue for give queue.
 * @param queueUrl
 * @param messageEntries
 */
export const sendMessageBatch = (queueUrl: string, messageEntries) => {
  return getClient().sendMessageBatch({
    QueueUrl: queueUrl,
    Entries: messageEntries
  }).promise();
}


interface SendMessageOptions {
  messageAttributes?: SendMessageRequest['MessageAttributes']
  delaySeconds?: SendMessageRequest['DelaySeconds']
}

