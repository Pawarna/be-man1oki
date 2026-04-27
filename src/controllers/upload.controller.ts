import { Request, Response } from 'express';
import { StorageService } from '../services/storage.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/ApiResponse';

export const UploadController = {
  uploadImage: catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      return sendResponse(res, 400, false, 'File gambar tidak ditemukan');
    }

    const imageUrl = await StorageService.uploadImage(req.file);
    sendResponse(res, 200, true, 'Gambar berhasil diupload', { url: imageUrl });
  })
};