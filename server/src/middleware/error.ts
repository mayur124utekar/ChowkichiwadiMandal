import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[Unhandled Error]:', err);

  if (err instanceof ZodError) {
    return sendError(res, 'Validation error', 400, 'VALIDATION_ERROR', err.errors);
  }

  if (err.name === 'MulterError') {
    return sendError(res, `Upload error: ${err.message}`, 400, 'UPLOAD_ERROR');
  }

  const message = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred' 
    : (err.message || 'Internal server error');

  return sendError(res, message, err.statusCode || 500, err.code || 'INTERNAL_SERVER_ERROR');
}
