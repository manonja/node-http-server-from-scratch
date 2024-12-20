import { ParsedRequest } from "./requestParser";

import { readFileSync } from 'fs';
import { extname, join } from 'path';
import { logger } from './server';

const MIME_TYPES: Record<string, string> = {
    '.html': 'text/html',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
};

function isImagePath(path: string): boolean {
    return path.startsWith('/images/');
}

function handleHome() {
    // Read the existing index.html file
    const filePath = join(__dirname, '../public/index.html');
    const body = readFileSync(filePath, 'utf8');

    return {
        statusCode: 200,
        statusMessage: 'OK',
        headers: {
            'Content-Type': MIME_TYPES['.html'],
            'Content-Length': body.length.toString()
        },
        body
    };

}

function handleStaticFiles(request: ParsedRequest) {
    logger.info('Starting static file request', {
        path: request.path,
        method: request.method,
        headers: request.headers
    });

    try {
        // Extract the file path from the URL
        const fileName = request.path.split('/').pop() || '';
        logger.debug('Parsed filename', { fileName });

        // Add .jpg extension if no extension exists
        const fileNameWithExt = fileName.includes('.') ? fileName : `${fileName}.jpg`;
        logger.debug('Using filename', { fileNameWithExt });
        
        // Construct the full file path
        const filePath = join(__dirname, '../public/images', fileNameWithExt);
        logger.debug('Attempting to read file', { filePath });

        // Read the file
        const file_data = readFileSync(filePath);
        
        // Always use image/jpeg for our case since we know all files are JPGs
        const contentType = 'image/jpeg';
        
        return {
            statusCode: 200,
            statusMessage: 'OK',
            headers: {
                'Content-Type': contentType,
                'Content-Length': file_data.length.toString()
            },
            body: file_data
        };
    } catch (error) {
        const errorBody = 'File not found';
        return {
            statusCode: 404,
            statusMessage: 'Not Found',
            headers: {
                'Content-Type': 'text/plain',
                'Content-Length': errorBody.length.toString()
            },
            body: errorBody
        };
    }
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
        parsedBody = JSON.parse(request.body?.toString() || '{}');
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
    statusMessage: string;
    headers: {
        'Content-Type': string;
        'Content-Length': string;
    };
    body: string | Buffer;
};

const routes: Record<string, Record<string, RequestHandler>> = {
    GET: {
        '/': handleHome,
        '/api': handleApiGet
    },
    POST: {
        '/api': handleApiPost
    }
};

export { routes, isImagePath, handleStaticFiles };