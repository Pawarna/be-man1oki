import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/ApiResponse';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Menyembunyikan detail error di production untuk keamanan
  const errorDetail = process.env.NODE_ENV === 'development' ? err : undefined;

  sendResponse(res, statusCode, false, message, null, errorDetail);
};