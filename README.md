# node-http-server-from-scratch
=======
# HTTP Server

This is a simple HTTP server implementation in Node.js. It listens for incoming connections on a specified port and handles HTTP requests by parsing the request headers and body, processing the request, and then sending a response back to the client.

## Features

- Handles GET requests by responding with a simple "Hello, World!" message.
- Supports basic HTTP/1.1 protocol.
- Handles partial HTTP requests by accumulating data until a complete request is received.

## Usage

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Run `npm run build && npm start` to build and start the server.
4. Curl the server: `curl http://localhost:8080`.

## Testing the server

```
curl http://localhost:8080

telnet localhost 3000 and manually type the request:

```

Copy the following code and press enter twice to send the request:

```
GET / HTTP/1.1
Host: localhost
```

## Testing different methods
- GET
`curl http://localhost:8080/` you should get a 200 response with a body of "Welcome to the Home Page!"
- GET /api
`curl http://localhost:8080/api` you should get a 200 response with a body of "Hello from the API"

- POST /
`curl -X POST -H "Content-Type: application/json" -d '{"user":"Alice"}' http://localhost:8080/api` you should get a 200 response with a json body of {"received":{"user":"Alice"},"message":"Data received successfully"}

- PUT /api and DELETE
`curl -X PUT http://localhost:8080/api` you should get a "Method not allowed" response since PUT and DELETE are not supported



## Refinements and Best Practices

### Code Organization:

We keep parsing logic separate from server logic, and use interfaces and types in TypeScript for clarity.

### Error Handling:

If request parsing fails, return a 400 Bad Request.We are making sure to always close sockets to avoid memory leaks.

### Routing

We are using a simple if else statement to handle routing.
