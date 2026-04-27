import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/ApiResponse';

export const UserController = {
  // Lihat betapa bersihnya ini tanpa try-catch dan tanpa if-else validasi manual!
  setupAdmin: catchAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    
    const newAdmin = await UserService.createAdmin({ name, email, password });
    
    sendResponse(res, 201, true, 'Admin berhasil dibuat!', newAdmin);
  }),

  getDashboard: catchAsync(async (req: Request, res: Response) => {
    // Karena sudah melewati middleware requireAuth, req.user PASTI ada isinya
    const user = req.user;

    // Di sini kamu bisa menambahkan logika untuk mengambil statistik dari database
    // (Misal: jumlah berita, jumlah siswa, dll)
    const dashboardStats = {
      totalNews: 15,
      totalStudents: 320,
      recentActivity: "Server running stable"
    };

    sendResponse(res, 200, true, 'Selamat datang di Dashboard Admin', {
      adminProfile: user,
      stats: dashboardStats
    });
    })
};

