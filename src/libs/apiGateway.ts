import { HandlerAPIGatewayResponse } from '@root/types';

/**
 * Lib function to format handler response.
 * @param statusCode
 * @param response<T>
 * @returns HandlerAPIGatewayResponse<T>
 */
export const formatJSONResponse = <T>(statusCode: 200 | 400 | 500, response): HandlerAPIGatewayResponse<T> => {
  const formattedBody = typeof response === 'object' ? JSON.stringify(response) : response;

  return {
    statusCode,
    body: formattedBody
  }
}
