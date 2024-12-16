/* 
    Here we build a TCP server that prints out whatever data it receives from the client. 
    This will show us how data flows in and out.
    Why is this important? Because it demonstrates the raw building blocks before HTTP parsing. 
    This is the foundation of all network protocols. 
*/

import net from 'net';

// Create a TCP server
const server = net.createServer((socket) => {
    console.log('New connection established');
    // When data is received, print it out
    socket.on('data', (data) => {
        const dataReceived = data.toString();
        console.log(dataReceived);

        socket.write(`You said: ${dataReceived}`);
    });

    // Handle errors
    socket.on('error', (error) => {
        console.error('Error:', error);
    });
});

// Listen on port 8080
server.listen(8080, () => {
    console.log('TCP Server is running on port 8080');
});