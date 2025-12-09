import { StatusCodes } from 'http-status-codes';

/**
 * Custom API error class that includes status code and optional details.
 */
export class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message: string): ApiError {
        return new ApiError(StatusCodes.BAD_REQUEST, message);
    }

    static notFound(message: string): ApiError {
        return new ApiError(StatusCodes.NOT_FOUND, message);
    }

    static unauthorized(message: string): ApiError {
        return new ApiError(StatusCodes.UNAUTHORIZED, message);
    }

    static forbidden(message: string): ApiError {
        return new ApiError(StatusCodes.FORBIDDEN, message);
    }

    static internal(message: string): ApiError {
        return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, message, false);
    }
}
