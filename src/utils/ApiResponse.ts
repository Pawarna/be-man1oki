import { Response } from 'express';

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: any = null,
  error: any = null
) => {
  const responsePayload: any = { success, message };
  if (data) responsePayload.data = data;
  if (error) responsePayload.error = error;

  return res.status(statusCode).json(responsePayload);
};