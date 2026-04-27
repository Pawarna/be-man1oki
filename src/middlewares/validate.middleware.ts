import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod'; // Tambahkan ZodIssue
import { sendResponse } from '../utils/ApiResponse';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        // Berikan tipe data eksplisit (ZodIssue) pada parameter err
        const errorMessages = error.issues.map((err: ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        // Return untuk menghentikan eksekusi
        return sendResponse(res, 400, false, 'Validation Error', null, errorMessages);
      }
      
      next(error);
    }
  };
};