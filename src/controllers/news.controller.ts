import { Request, Response } from 'express';
import { NewsService } from '../services/news.service';
import { StorageService } from '../services/storage.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/ApiResponse';

export const NewsController = {
  create: catchAsync(async (req: Request, res: Response) => {
    let { title, content, status, categoryId } = req.body;
    const authorId = req.user.id;

    // 1. Wajibkan file thumbnail saat create
    if (!req.file) {
      return sendResponse(res, 400, false, 'File thumbnail wajib diupload');
    }

    // 2. Upload thumbnail ke Storage
    const thumbnailUrl = await StorageService.uploadImage(req.file);

    // 3. Parse data dari string ke tipe aslinya
    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
    const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : null;

    // 4. Simpan ke database
    const data = await NewsService.createNews({
      title,
      content: parsedContent,
      thumbnail: thumbnailUrl,
      status,
      categoryId: parsedCategoryId,
      authorId
    });

    sendResponse(res, 201, true, 'Berita berhasil diterbitkan', data);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string );
    let { title, content, status, categoryId } = req.body;

    const updateData: any = { title, status };

    // Jika admin mengupload thumbnail baru
    if (req.file) {
      updateData.thumbnail = await StorageService.uploadImage(req.file);
    }

    // Parse data jika ikut dikirim
    if (content) {
      updateData.content = typeof content === 'string' ? JSON.parse(content) : content;
    }
    if (categoryId !== undefined) {
      updateData.categoryId = categoryId ? parseInt(categoryId, 10) : null;
    }

    const data = await NewsService.updateNews(id, updateData);
    sendResponse(res, 200, true, 'Berita berhasil diperbarui', data);
  }),

  list: catchAsync(async (req: Request, res: Response) => {
    const data = await NewsService.getAllNews();
    sendResponse(res, 200, true, 'Daftar berita berhasil diambil', data);
  }),

  detail: catchAsync(async (req: Request, res: Response) => {
    const data = await NewsService.getNewsBySlug(req.params.slug as string);
    if (!data) return sendResponse(res, 404, false, 'Berita tidak ditemukan');
    
    sendResponse(res, 200, true, 'Detail berita berhasil diambil', data);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    await NewsService.deleteNews(id);
    
    sendResponse(res, 200, true, 'Berita berhasil dihapus');
  })
};