import { Request, Response } from 'express';
import { KegiatanService } from '../services/kegiatan.service';
import { StorageService } from '../services/storage.service';
import { catchAsync } from '../utils/catchAsync';

export const KegiatanController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const { name, description, schedule, coordinator, status } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'File gambar (image) wajib diupload' });
    }

    const imageUrl = await StorageService.uploadImage(req.file);

    const data = await KegiatanService.createKegiatan({
      name,
      image: imageUrl,
      description,
      schedule,
      coordinator,
      status: status || 'active'
    });

    res.status(201).json(data);
  }),

  list: catchAsync(async (req: Request, res: Response) => {
    const data = await KegiatanService.getAllKegiatan();
    res.status(200).json(data);
  }),

  detail: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const data = await KegiatanService.getKegiatanById(id);
    
    if (!data) {
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan' });
    }

    res.status(200).json(data);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const { name, description, schedule, coordinator, status } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (schedule) updateData.schedule = schedule;
    if (coordinator) updateData.coordinator = coordinator;
    if (status) updateData.status = status;

    if (req.file) {
      updateData.image = await StorageService.uploadImage(req.file);
    }

    const data = await KegiatanService.updateKegiatan(id, updateData);
    
    if (!data) {
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan' });
    }

    res.status(200).json(data);
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    await KegiatanService.deleteKegiatan(id);
    res.status(204).send();
  })
};
