import { ParsedRequest } from "./requestParser";

function handleHome() {
    const body = 'Welcome to the Home Page!';
    return {
        statusCode: 200,
        statusMessage: 'OK',
        headers: {
            'Content-Type': 'text/plain',
            'Content-Length': body.length.toString()
        },
        body
    };
}

function handleApiGet() {
    const responseData = { message: "Hello from the API" };
    const responseBody = JSON.stringify(responseData);
    return {
        statusCode: 200,
        statusMessage: 'OK',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': responseBody.length.toString()
        },
        body: responseBody
    };
}

function handleApiPost(request: ParsedRequest) {
    const contentType = request.headers['content-type'] || '';
    let parsedBody;

    if (contentType.includes('application/json')) {
    try {
        parsedBody = JSON.parse(request.body);
        } catch (err) {
        const errorBody = 'Invalid JSON';
        return {
            statusCode: 400,
            statusMessage: 'Bad Request',
            headers: {
                'Content-Type': 'text/plain',
            'Content-Length': errorBody.length.toString()
        },
        body: errorBody
        };
    }
    } else {
        parsedBody = request.body;
    }

    const responseData = {
        received: parsedBody,
        message: "Data received successfully"
    };
    const responseBody = JSON.stringify(responseData);
    return {
        statusCode: 200,
        statusMessage: 'OK',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': responseBody.length.toString()
        },
        body: responseBody
    };
}

type RequestHandler = (req: ParsedRequest) => {
    statusCode: number;
    statusMessage?: string;
    headers?: Record<string, string>;
    body?: string;
};

const routes: Record<string, Record<string, RequestHandler>> = {
    GET: {
        '/': handleHome,
        '/api': handleApiGet
    },
    POST: {
        '/api': handleApiPost
    },
    // Add PUT, DELETE, etc.:
    // PUT: { ... },
    // DELETE: { ... },
};

export default routes;