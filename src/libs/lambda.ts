import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"

/**
 * Middleware to JSON parse SQS event record - body;
 */
const sqsBodyParser = () => {
  const process = (request) => {
    const { Records: records } = request.event;

    records.map(data => {
      // TODO: Validate
      data.body = JSON.parse(data.body)
    });
  }

  return {
    before: process
  };
}

/**
 * Handler Request Body Parser
 * @param handler
 */
export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser())
}

/**
 * Handler SQS Record-Body Parser
 * @param handler
 */
export const middyfySQS = (handler) => {
  return middy(handler).use(sqsBodyParser())
}
