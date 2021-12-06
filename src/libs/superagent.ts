import superagent from 'superagent';

const { API_KEY } = process.env
const baseEndpoints = {
  oms: 'https://hjp1oxbsw6.execute-api.eu-central-1.amazonaws.com/prod'
}

type TEndpoint = keyof (typeof baseEndpoints);

/**
 * Make PUT call to given endpoint.
 * @param endpoint
 * @param path
 * @param body
 * @param [options]
 * @param [options.useAuth] - Where to use X-API-KEY in headers
 */
export const putRequest = async <T>(endpoint: TEndpoint, path: string, body: T, options = { useAuth: false }) => {
  // @ts-ignore
  const host = baseEndpoints[endpoint];
  const request = superagent.put(`${ host }/${path}`);

  request.set('Content-Type', 'application/json')
  if (options.useAuth) {
    request.set('X-API-KEY', API_KEY)
  }

  return request.send(body);
}
