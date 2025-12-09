import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

/**
 * Validation middleware factory using Zod schemas.
 * Validates request body, params, and/or query against provided schemas.
 * Does NOT mutate req.query/params directly to avoid Express 5 getter issues.
 */
export const validate = (schema: {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
}) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }
            if (schema.params) {
                // Store validated params in req.body if needed, but don't mutate req.params
                const validatedParams = await schema.params.parseAsync(req.params);
                // Merge validated params into a custom property
                (req as any).validatedParams = validatedParams;
            }
            if (schema.query) {
                // Validate but don't try to reassign req.query (read-only in Express 5)
                const validatedQuery = await schema.query.parseAsync(req.query);
                // Store in custom property
                (req as any).validatedQuery = validatedQuery;
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const issues = error.issues || [];
                const errors = issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));

                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'Validation failed',
                    errors,
                });
                return;
            }
            next(error);
        }
    };
};
