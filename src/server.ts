/* 
    Combine TCP listening with HTTP parsing and responding.
    For simplicity, we will respond with a simple "Hello, World!" message for GET requests.
*/

import net from 'node:net';
import { handleHTTPRequest } from './handleRequest';
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, ...metadata }) => {
      let msg = `${timestamp} [${level}] : ${message}`;
      if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
      }
      return msg;
    }),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.json(),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.json(),
    }),
  ],
});

const createDataHandler = (
  socket: net.Socket,
  handleRequest: (rawRequest: string) => {
    statusCode: number;
    statusMessage: string;
    headers: Record<string, string>;
    body: string | Buffer;
  },
): ((chunk: Buffer) => void) => {
  let buffer = '';
  
  return (chunk: Buffer) => {
    buffer += chunk.toString();
    if (buffer.includes('\r\n\r\n')) {
      const response = handleRequest(buffer);
      if (socket.writable) {
        socket.write(formatHttpResponse(response));
        socket.end();
      } else {
        logger.error('Socket is not writable, skipping response');
      }
    }
  };
};

function formatHttpResponse(response: {
  statusCode: number;
  statusMessage: string;
  headers: Record<string, string>;
  body: string | Buffer;
}): Buffer {
  const headerString = `HTTP/1.1 ${response.statusCode} ${response.statusMessage}\r\n${Object.entries(
    response.headers,
  )
    .map(([key, value]) => `${key}: ${value}`)
    .join('\r\n')}\r\n\r\n`;

  if (Buffer.isBuffer(response.body)) {
    return Buffer.concat([Buffer.from(headerString), response.body]);
  }
  return Buffer.from(headerString + response.body);
}

const server = net.createServer((socket) => {
  socket.on('data', createDataHandler(socket, handleHTTPRequest));
});

server.listen(8080, () => {
  logger.info('Server is running on port 8080');
});
