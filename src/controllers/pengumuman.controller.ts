import { Request, Response } from 'express';
import { PengumumanService } from '../services/pengumuman.service';
import { StorageService } from '../services/storage.service';
import { catchAsync } from '../utils/catchAsync';

export const PengumumanController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const { title, expiry, priority, status, category, date } = req.body;
    let pdfUrl = null;

    if (req.file) {
      pdfUrl = await StorageService.uploadImage(req.file);
    }

    const payload = {
      title,
      pdfUrl,
      expiry: new Date(expiry),
      priority: priority || 'medium',
      status: status || 'active',
      category,
      date: date ? new Date(date) : new Date()
    };

    const data = await PengumumanService.createPengumuman(payload);
    res.status(201).json(data);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const { title, expiry, priority, status, category, date } = req.body;
    
    const payload: any = {};
    if (title) payload.title = title;
    if (expiry) payload.expiry = new Date(expiry);
    if (priority) payload.priority = priority;
    if (status) payload.status = status;
    if (category) payload.category = category;
    if (date) payload.date = new Date(date);

    if (req.file) {
      payload.pdfUrl = await StorageService.uploadImage(req.file);
    }

    const data = await PengumumanService.updatePengumuman(id, payload);
    
    if (!data) {
      return res.status(404).json({ error: 'Pengumuman tidak ditemukan' });
    }

    res.status(200).json(data);
  }),

  list: catchAsync(async (req: Request, res: Response) => {
    const data = await PengumumanService.getAllPengumuman();
    res.status(200).json(data);
  }),

  detail: catchAsync(async (req: Request, res: Response) => {
    const data = await PengumumanService.getPengumumanById(parseInt(req.params.id as string));
    
    if (!data) {
      return res.status(404).json({ error: 'Pengumuman tidak ditemukan' });
    }

    res.status(200).json(data);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await PengumumanService.deletePengumuman(parseInt(req.params.id as string));
    res.status(204).send();
  })
};