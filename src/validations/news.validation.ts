import { z } from 'zod';

export const newsSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Judul minimal 5 karakter').max(255),
    // FormData mengirimkan object/JSON sebagai string
    content: z.string().min(5, 'Konten tidak boleh kosong'), 
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    categoryId: z.string().optional().nullable(),
  }),
});

// Schema untuk update (semua field opsional)
export const updateNewsSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(255).optional(),
    content: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    categoryId: z.string().optional().nullable(),
  }),
});