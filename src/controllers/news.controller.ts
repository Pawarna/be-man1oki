import { Request, Response } from 'express';
import { NewsService } from '../services/news.service';
import { StorageService } from '../services/storage.service';
import { catchAsync } from '../utils/catchAsync';

export const NewsController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const { title, content, excerpt, status, category, author, date } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'File gambar (image) wajib diupload' });
    }

    const imageUrl = await StorageService.uploadImage(req.file);
    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;

    const data = await NewsService.createNews({
      title,
      content: parsedContent,
      excerpt,
      image: imageUrl,
      status: status || 'draft',
      category,
      author,
      date: date ? new Date(date) : new Date()
    });

    res.status(201).json(data);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const { title, content, excerpt, status, category, author, date } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (excerpt) updateData.excerpt = excerpt;
    if (status) updateData.status = status;
    if (category) updateData.category = category;
    if (author) updateData.author = author;
    if (date) updateData.date = new Date(date);

    if (req.file) {
      updateData.image = await StorageService.uploadImage(req.file);
    }

    if (content) {
      updateData.content = typeof content === 'string' ? JSON.parse(content) : content;
    }

    const data = await NewsService.updateNews(id, updateData);
    
    if (!data) {
      return res.status(404).json({ error: 'Berita tidak ditemukan' });
    }

    res.status(200).json(data);
  }),

  list: catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 10;
    const q = req.query.q as string;
    const status = req.query.status as string;

    const result = await NewsService.getAllNews({ page, perPage, q, status });
    res.status(200).json(result);
  }),

  detail: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const data = await NewsService.getNewsById(id);
    
    if (!data) {
      return res.status(404).json({ error: 'Berita tidak ditemukan' });
    }

    res.status(200).json(data);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    await NewsService.deleteNews(id);
    res.status(204).send();
  })
};