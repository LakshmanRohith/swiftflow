// path: server/src/utils/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  // Default to a 500 server error
  let statusCode = 500;
  let message = 'An unexpected error occurred';

  // Check for specific error types if needed
  if (err.message === 'User with this email already exists') {
    statusCode = 409; // Conflict
    message = err.message;
  }
  
  // Add more specific error checks here as your app grows

  res.status(statusCode).json({
    message,
    // Optionally include stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
