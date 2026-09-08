import { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, message = 'Operation completed successfully', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export function sendError(res: Response, message = 'Internal server error', statusCode = 500, code = 'INTERNAL_ERROR', details: any = null) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
}
