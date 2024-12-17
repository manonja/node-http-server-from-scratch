/* 
    Combine TCP listening with HTTP parsing and responding.
    For simplicity, we will respond with a simple "Hello, World!" message for GET requests.
*/

import net from 'node:net';
import { handleRequest } from './handleRequest';


const createDataHandler = (socket: net.Socket, buffer: string, handleRequest: (requestString: string) => string): ((chunk: Buffer) => void) => {
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
            socket.on('data', createDataHandler(socket, newBuffer, handleRequest));
        }
    }
}

const server = net.createServer((socket) => {
    // Start with an empty buffer
    socket.on('data', createDataHandler(socket, '', handleRequest));
});

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});



