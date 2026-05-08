import { z } from 'zod';

export const newsSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Judul minimal 5 karakter').max(255),
    content: z.any().refine(val => !!val, 'Konten tidak boleh kosong'),
    excerpt: z.string().min(5, 'Ringkasan wajib diisi').max(500),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    categoryId: z.string().optional().nullable(),
  }),
});

export const updateNewsSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(255).optional(),
    content: z.any().optional(),
    excerpt: z.string().min(5).max(500).optional(), // <-- TAMBAHAN
    status: z.enum(['draft', 'published', 'archived']).optional(),
    categoryId: z.string().optional().nullable(),
  }),
});

export const getNewsQuerySchema = z.object({
  query: z.object({
    q: z.string().optional(),
    status: z.enum(['published', 'draft', 'archived']).optional(),
    // Terima string dari query URL, lalu ubah jadi angka. Default: page 1, perPage 10
    page: z.string().regex(/^\d+$/).transform(Number).default(1),
    perPage: z.string().regex(/^\d+$/).transform(Number).default(10),
  }),
});