import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

/**
 * Global error handler middleware
 * Handles Zod validation errors, Prisma errors, and general errors
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err.message || err);

    // Zod validation error handling
    if (err instanceof ZodError) {
        const validationErrors = err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));

        res.status(400).json({
            success: false,
            message: 'Validation failed',
            error: {
                code: 400,
                type: 'VALIDATION_ERROR',
                details: validationErrors,
            },
        });
        return;
    }

    // Prisma known request error handling
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002': // Unique constraint violation
                const target = err.meta?.['target'] as string[] | undefined;
                const field = target?.[0] || 'field';
                res.status(409).json({
                    success: false,
                    message: `${field} already exists`,
                    error: {
                        code: 409,
                        type: 'DUPLICATE_ENTRY',
                        details: `A record with this ${field} already exists.`,
                    },
                });
                return;

            case 'P2003': // Foreign key constraint violation
                res.status(400).json({
                    success: false,
                    message: 'Referenced record not found',
                    error: {
                        code: 400,
                        type: 'FOREIGN_KEY_ERROR',
                        details: 'The referenced record does not exist.',
                    },
                });
                return;

            case 'P2025': // Record not found
                res.status(404).json({
                    success: false,
                    message: 'Record not found',
                    error: {
                        code: 404,
                        type: 'NOT_FOUND',
                        details: 'The requested record was not found.',
                    },
                });
                return;

            default:
                res.status(400).json({
                    success: false,
                    message: 'Database operation failed',
                    error: {
                        code: 400,
                        type: 'DATABASE_ERROR',
                        details: err.message,
                    },
                });
                return;
        }
    }

    // Prisma connection error handling
    if (
        err instanceof Prisma.PrismaClientInitializationError ||
        err.message?.includes("Can't reach database server")
    ) {
        res.status(500).json({
            success: false,
            message: 'Database connection error',
            error: {
                code: 500,
                type: 'DATABASE_CONNECTION_ERROR',
                details: 'Could not connect to the database.',
            },
        });
        return;
    }

    // Default fallback
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: {
            code: 500,
            type: 'SERVER_ERROR',
            details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
        },
    });
};
