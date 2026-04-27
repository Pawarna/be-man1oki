import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { sendResponse } from '../utils/ApiResponse';

// Agar TypeScript tidak marah saat kita menyisipkan 'user' ke dalam Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ambil token dari header "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendResponse(res, 401, false, 'Akses ditolak: Token tidak ditemukan');
    }

    const token = authHeader.split(' ')[1];

    // Verifikasi token menggunakan Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return sendResponse(res, 401, false, 'Akses ditolak: Token tidak valid atau kedaluwarsa');
    }

    // Jika valid, simpan data user ke request untuk dipakai di controller berikutnya
    req.user = user;
    next();
    
  } catch (error) {
    next(error);
  }
};