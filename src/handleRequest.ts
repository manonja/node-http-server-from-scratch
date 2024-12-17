import { parseRequest } from "./requestParser";
import { buildHttpResponse } from "./responseBuilder";
import routes from "./routes";

export function handleRequest(requestString: string) {
    const request = parseRequest(requestString);
    
    if (!request) {
        const errorBody = "Bad Request";
        return buildHttpResponse({
            statusCode: 400,
            statusMessage: "Bad Request",
            headers: {
                "Content-Type": "text/plain",
                "Content-Length": errorBody.length.toString(),
            },
            body: errorBody,
    });
    }

const { method, path } = request;
const methodRoutes = routes[method.toUpperCase()];

if (!methodRoutes) {
    // Method not implemented
    const errorBody = "Method Not Allowed";
    return buildHttpResponse({
        statusCode: 405,
        statusMessage: "Method Not Allowed",
        headers: {
            "Content-Type": "text/plain",
            "Content-Length": errorBody.length.toString(),
        },
        body: errorBody,
    });
}

const routeHandler = methodRoutes[path];
if (!routeHandler) {
    // No route found for this path
    const errorBody = "Not Found";
    return buildHttpResponse({
        statusCode: 404,
        statusMessage: "Not Found",
        headers: {
            "Content-Type": "text/plain",
        "Content-Length": errorBody.length.toString(),
    },
    body: errorBody,
    });
}

  // Route found, call the handler
const responseConfig = routeHandler(request);
return buildHttpResponse(responseConfig);
}
