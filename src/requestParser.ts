/* 
    Here we parse the HTTP request and return the response.
    This is the foundation of all HTTP servers.

    Example of raw HTTP request for a GET request:
    GET /path HTTP/1.1
    Host: localhost:3000
    User-Agent: curl/7.64.1
    Accept: * / *

    [Body starts here, if any]
*/

import { logger } from "./server";


export interface ParsedRequest {
    headers: Record<string, string>;
    body?: string | Buffer;
    method: string;
    path: string;
    httpVersion: string;
}


export function parseRequest(rawData: string): ParsedRequest {
    // Read the data until we find a blank line, which separates the header from the body
    const [requestHeaders, body= ''] = rawData.split('\r\n\r\n');

    const headersLines = requestHeaders.split('\r\n');
    if (headersLines.length === 0) {
        throw new Error('Invalid request');
    }

    // Extract the request line 
    const requestLine = headersLines.shift();
    if (!requestLine) {
        throw new Error('Invalid request');
    }

    const [method, path, httpVersion] = requestLine.split(' ');

    // Extract headers line by line
    const headers: Record<string, string> = {};
    for (const line of headersLines) {
        const [key, ...rest] = line.split(':');
        if (!key) continue;
        headers[key.trim().toLowerCase()] = rest.join(':').trim();
    }

    logger.info('Parsed request', {
        method,
        path,
        httpVersion,
        headers,
        body
    });

    return {
        method,
        path,
        httpVersion,
        headers,
        body,
    };
}