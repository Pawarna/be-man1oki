import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import userRoutes from '../src/routes/user.routes';
import newsRoutes from '../src/routes/news.routes'; // Buka saat CRUD berita siap
import categoryRoutes from '../src/routes/category.routes'; // Buka saat CRUD kategori siap

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
app.use('/api/users', userRoutes);

// Semua rute terkait berita (buka nanti)
app.use('/api/news', newsRoutes);
app.use('/api/categories', categoryRoutes)



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