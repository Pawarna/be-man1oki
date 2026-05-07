import { z } from 'zod';

export const pengumumanSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Judul minimal 5 karakter').max(255),
    content: z.string().min(5, 'Konten tidak boleh kosong'),
    expiry: z.string().min(1, 'Tanggal kadaluarsa harus diisi'),
    priority: z.enum(['high', 'medium', 'low']).default('medium'),
    status: z.enum(['active', 'expired']).default('active'),
    categoryId: z.string().optional().nullable(), // Berubah jadi string karena FormData
  }),
});

export const updatePengumumanSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(255).optional(),
    content: z.string().optional(),
    expiry: z.string().optional(),
    priority: z.enum(['high', 'medium', 'low']).optional(),
    status: z.enum(['active', 'expired']).optional(),
    categoryId: z.string().optional().nullable(),
  }),
});