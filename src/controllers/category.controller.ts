import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/ApiResponse';

export const CategoryController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const { name } = req.body;
    const data = await CategoryService.createCategory(name);
    sendResponse(res, 201, true, 'Kategori berhasil ditambahkan', data);
  }),

  list: catchAsync(async (req: Request, res: Response) => {
    const data = await CategoryService.getAllCategories();
    sendResponse(res, 200, true, 'Daftar kategori berhasil diambil', data);
  }),

  detail: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const data = await CategoryService.getCategoryById(id);
    if (!data) return sendResponse(res, 404, false, 'Kategori tidak ditemukan');
    
    sendResponse(res, 200, true, 'Detail kategori berhasil diambil', data);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const { name } = req.body;
    
    const data = await CategoryService.updateCategory(id, name);
    if (!data) return sendResponse(res, 404, false, 'Kategori tidak ditemukan');

    sendResponse(res, 200, true, 'Kategori berhasil diperbarui', data);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    
    // Catatan: Jika kategori ini sedang dipakai oleh berita, 
    // PostgreSQL mungkin akan menolak penghapusan karena foreign key constraint.
    // Jika itu terjadi, error akan ditangkap oleh catchAsync.
    await CategoryService.deleteCategory(id);
    
    sendResponse(res, 200, true, 'Kategori berhasil dihapus');
  })
};