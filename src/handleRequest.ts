import { parseRequest } from './requestParser';
import { routes, handleStaticFiles, isImagePath } from './routes';

interface HttpResponse {
  statusCode: number;
  statusMessage: string;
  headers: Record<string, string>;
  body: string | Buffer;
}

export function handleHTTPRequest(rawRequest: string = ''): HttpResponse {
  const request = parseRequest(rawRequest);

  if (!request) {
    const errorBody = 'Bad Request';
    return {
      statusCode: 400,
      statusMessage: 'Bad Request',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': errorBody.length.toString(),
      },
      body: errorBody,
    };
  }

  const { method, path } = request;
  const methodRoutes = routes[method.toUpperCase()];

  if (!methodRoutes) {
    // Method not implemented
    const errorBody = 'Method Not Allowed';
    return {
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': errorBody.length.toString(),
      },
      body: errorBody,
    };
  }

  if (isImagePath(request.path)) {
    return handleStaticFiles(request);
  }

  const routeHandler = methodRoutes[path];
  if (!routeHandler) {
    // No route found for this path
    const errorBody = 'Not Found';
    return {
      statusCode: 404,
      statusMessage: 'Not Found',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': errorBody.length.toString(),
      },
      body: errorBody,
    };
  }

  // Route found, call the handler
  const responseConfig = routeHandler(request);
  return responseConfig;
}
