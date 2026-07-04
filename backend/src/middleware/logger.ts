import morgan from 'morgan';
import { logger } from '../utils/logger';
import { Request, Response } from 'express';

const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export const httpLogger = morgan(
  ':remote-addr - :method :url :status :res[content-length] - :response-time ms',
  {
    stream,
    skip: (req: Request, res: Response) => {
      // Skip health check logs in production
      if (process.env.NODE_ENV === 'production' && req.url === '/health') {
        return true;
      }
      return false;
    },
  }
);

export const requestIdMiddleware = (
  req: Request & { requestId?: string },
  _res: Response,
  next: () => void
): void => {
  req.requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  next();
};
