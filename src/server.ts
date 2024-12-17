/* 
    Combine TCP listening with HTTP parsing and responding.
    For simplicity, we will respond with a simple "Hello, World!" message for GET requests.
*/

import net from 'node:net';
import { parseRequest } from './requestParser';
import { buildHttpResponse } from './responseBuilder';


const handleRequest = (requestString: string) => {
    const request = parseRequest(requestString);
    if (!request) {
        // The request is malformed; return 400
        return buildHttpResponse({
            statusCode: 400,
            statusMessage: 'Bad Request',
            headers: {
                'Content-Type': 'text/plain',
                'Content-Length': '11'
            },
            body: 'Bad Request'
        });
    }

    // If the request is valid, route based on the path
    if (request.path === '/') {
        // Return Home
        const responseBody = 'Welcome to the Home Page!';
        return buildHttpResponse({
            statusCode: 200,
            statusMessage: 'OK',
            headers: {
                'Content-Type': 'text/plain',
                'Content-Length': responseBody.length.toString()
            },
            body: responseBody
        });
    } else if (request.path === '/api') {
        // Return some JSON response
        const responseData = { message: "Hello from the API" };
        const responseBody = JSON.stringify(responseData);
        return buildHttpResponse({
            statusCode: 200,
            statusMessage: 'OK',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': responseBody.length.toString()
            },
            body: responseBody
        });
    } else {
        // Return 404 for other routes
        const responseBody = 'Not Found';
        return buildHttpResponse({
            statusCode: 404,
            statusMessage: 'Not Found',
            headers: {
                'Content-Type': 'text/plain',
                'Content-Length': responseBody.length.toString()
            },
            body: responseBody
        });
    }
}

const createDataHandler = (socket: net.Socket, buffer: string): ((chunk: Buffer) => void) => {
    return (chunk: Buffer) => {
        const newBuffer = buffer.concat(chunk.toString());
        // Check if we have a full HTTP request, headers ends with \r\n\r\n
        if (newBuffer.includes('\r\n\r\n')) {
            const response = handleRequest(newBuffer);
            socket.write(response);
            socket.end();
        } else {
            // Not enough data to parse a request. Replace the current listener with one that remembers the latest state of the buffer
            socket.removeAllListeners('data');
            socket.on('data', createDataHandler(socket, newBuffer));
        }
    }
}

const server = net.createServer((socket) => {
    // Start with an empty buffer
    socket.on('data', createDataHandler(socket, ''));
});

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});



