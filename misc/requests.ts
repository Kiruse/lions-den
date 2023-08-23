import { getToken } from '../stores/user';
import { getCosmosLinkURL } from './helpers';

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /**
   * The API to use. If specified, the URL will be treated as relative to the API's underlying root.
   * For example, `{ api: 'cosmos-link', url: 'v1/login' }` will be sent to `https://cosmos.link/api/v1/login`.
   */
  api?: 'cosmos-link';
  url: string;
  type?: 'text' | 'json';
  /**
   * What kind of response we expect from the server. Defaults to 'json'.
   * - If 'text', the response will be parsed as text.
   * - If 'json', the response will be parsed as JSON.
   * - If 'response', the response will be returned as-is, bypassing additional parsing (including error handling).
   */
  expects?: 'text' | 'json' | 'response';
  /** The response body, if any. Invalid for GET requests. */
  body?: any;
}

export default async function request({
  method,
  api,
  url,
  type,
  expects,
  body,
}: RequestOptions) {
  if (api === 'cosmos-link') url = getCosmosLinkURL(`api/${url}`);

  const extraHeaders: any = {};
  const token = await getToken();
  if (token) extraHeaders['Authorization'] = `Bearer ${token}`;

  console.debug(`[request] ${method} ${url}`);

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': type === 'json' ? 'application/json' : 'text/plain',
      ...extraHeaders,
    },
    body,
  });

  if (expects === 'response') return response;
  if (!response.ok) {
    // always expects text (error message, if any)
    const msg = await response.text();
    console.error(`[request] ${method} ${url} failed: ${response.status} ${response.statusText} - ${msg || '(no body)'}`);
    throw new RequestError(response, msg || response.statusText);
  } else {
    switch (response.headers.get('Content-Type') || response.headers.get('content-type')) {
      case 'application/json':
        if (expects && expects !== 'json') throw Error(`Expected ${expects} response, got JSON`);
        return await response.json();
      default:
      case 'text/plain':
        if (expects && expects !== 'text') throw Error(`Expected ${expects} response, got text`);
        return await response.text();
    }
  }
}

request.get = (url: string, options: Omit<RequestOptions, 'method' | 'url' | 'body'> = {}) =>
  request({ ...options, method: 'GET', url });

request.post = (url: string, options: Omit<RequestOptions, 'method' | 'url'> = {}) =>
  request({ ...options, method: 'POST', url });

request.put = (url: string, options: Omit<RequestOptions, 'method' | 'url'> = {}) =>
  request({ ...options, method: 'PUT', url });

request.delete = (url: string, options: Omit<RequestOptions, 'method' | 'url'> = {}) =>
  request({ ...options, method: 'DELETE', url });

export class RequestError extends Error {
  constructor(public response: Response, message?: string) {
    super(message || response.statusText);
    this.name = `RequestError ${response.status}`;
  }
}
