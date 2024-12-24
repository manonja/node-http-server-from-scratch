/* 
    Once we have a parsed request, we can build the response.
    We therefore need to build a valid HTTP response string.
*/

export interface HttpResponseOptions {
  statusCode: number;
  statusMessage?: string;
  headers?: Record<string, string>;
  body?: string;
}

export function buildHttpResponse(options: HttpResponseOptions): string {
  const { statusCode = 200, statusMessage = 'OK', headers = {}, body = '' } = options;

  const headerLines = Object.entries(headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\r\n');

  // Note: \r\n separates lines in HTTP
  return `HTTP/1.1 ${statusCode} ${statusMessage}\r\n` + `${headerLines}\r\n` + `\r\n` + `${body}`;
}
