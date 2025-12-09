import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler to catch errors and pass them to the error handler.
 * Eliminates the need for try-catch blocks in every controller function.
 *
 * @example
 * // Instead of:
 * export const getAll = async (req, res, next) => {
 *   try {
 *     const data = await service.findAll();
 *     res.json(data);
 *   } catch (error) {
 *     next(error);
 *   }
 * };
 *
 * // Use:
 * export const getAll = asyncHandler(async (req, res) => {
 *   const data = await service.findAll();
 *   res.json(data);
 * });
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
