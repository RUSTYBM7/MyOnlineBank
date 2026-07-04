import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';

  // Log the error
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.path} - ${err.message}`, {
      error: err.message,
      stack: err.stack,
      statusCode,
      userId: req.user?.userId,
      adminId: req.admin?.adminId,
      ip: req.ip,
    });
  } else {
    logger.warn(`[${req.method}] ${req.path} - ${err.message}`, {
      error: err.message,
      statusCode,
      userId: req.user?.userId,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
    code: err.code,
    ...(isDev && { stack: err.stack, details: err.details }),
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
    code: 'NOT_FOUND',
  });
}

export function createError(message: string, statusCode: number, code?: string): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
}
