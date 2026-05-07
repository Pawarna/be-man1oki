import { Request, Response } from 'express';
import { GaleriService } from '../services/galeri.service';
import { StorageService } from '../services/storage.service';
import { catchAsync } from '../utils/catchAsync';

export const GaleriController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const { title, category, date } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'File gambar (url) wajib diupload' });
    }

    const uploadedUrl = await StorageService.uploadImage(req.file);
    const parsedDate = date ? new Date(date) : new Date();

    const data = await GaleriService.createGaleri({
      title,
      url: uploadedUrl,
      category,
      date: parsedDate
    });

    res.status(201).json(data);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const { title, category, date } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (category) updateData.category = category;
    if (date) updateData.date = new Date(date);

    if (req.file) {
      updateData.url = await StorageService.uploadImage(req.file);
    }

    const data = await GaleriService.updateGaleri(id, updateData);
    
    if (!data) {
      return res.status(404).json({ error: 'Galeri tidak ditemukan' });
    }

    res.status(200).json(data);
  }),

  list: catchAsync(async (req: Request, res: Response) => {
    const data = await GaleriService.getAllGaleri();
    res.status(200).json(data);
  }),

  detail: catchAsync(async (req: Request, res: Response) => {
    const data = await GaleriService.getGaleriById(parseInt(req.params.id as string));
    
    if (!data) {
      return res.status(404).json({ error: 'Galeri tidak ditemukan' });
    }

    res.status(200).json(data);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    await GaleriService.deleteGaleri(parseInt(req.params.id as string));
    res.status(204).send();
  })
};