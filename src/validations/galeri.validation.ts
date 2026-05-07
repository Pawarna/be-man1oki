import { z } from 'zod';

export const galeriSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Judul minimal 3 karakter').max(255),
    categoryId: z.string().optional().nullable(), // Diterima sebagai string dari FormData
    date: z.string().optional(), // Opsional, jika frontend mengirim tanggal spesifik
  }),
});

export const updateGaleriSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255).optional(),
    categoryId: z.string().optional().nullable(),
    date: z.string().optional(),
  }),
});