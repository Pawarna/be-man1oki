import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/ApiResponse';

export const AuthController = {
  login: catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const session = await AuthService.login(email, password);
    
    sendResponse(res, 200, true, 'Login berhasil!', {
      accessToken: session?.access_token,
      user: session?.user,
    });
  })
};