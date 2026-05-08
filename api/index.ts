import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import userRoutes from '../src/routes/user.routes';
import beritaRoutes from '../src/routes/news.routes';
import galeriRoutes from '../src/routes/galeri.routes';
import kegiatanRoutes from '../src/routes/kegiatan.routes';
import pengumumanRoutes from '../src/routes/pengumuman.routes';
import dashboardRoutes from '../src/routes/dashboard.routes';

// Import Global Error Handler
import { globalErrorHandler } from '../src/middlewares/error.middleware';

// Load environment variables
dotenv.config();

const app = express();

// ==========================================
// 1. GLOBAL MIDDLEWARES
// ==========================================
app.use(cors()); // Izinkan frontend mengakses API ini
app.use(express.json()); // Parsing payload JSON (Penting untuk Tiptap & form data)
app.use(express.urlencoded({ extended: true })); 

// ==========================================
// 2. HEALTH CHECK ENDPOINT
// ==========================================
// Berguna untuk mengecek apakah server Vercel menyala atau tidak
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'School API Backend is running perfectly! 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==========================================
// 3. REGISTER ROUTES
// ==========================================
// Semua rute terkait user (termasuk setup admin)
app.use('/api/auth', userRoutes);

// Semua rute terkait berita (admin panel)
app.use('/api/berita', beritaRoutes);
app.use('/api/galeri', galeriRoutes);
app.use('/api/kegiatan', kegiatanRoutes);
app.use('/api/pengumuman', pengumumanRoutes);
app.use('/api/dashboard', dashboardRoutes);



// GLOBAL ERROR HANDLER (Wajib berada di urutan paling bawah setelah semua routes)
app.use(globalErrorHandler);


// ==========================================
// 5. EXPORT & LISTENER
// ==========================================

// Wajib untuk deployment di Vercel (Serverless Function)
export default app;

// Listener untuk Development Lokal
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Server berjalan lokal di port: ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}/api`);
    console.log(`=========================================`);
  });
}