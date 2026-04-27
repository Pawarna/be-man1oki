import { z } from 'zod';

export const categorySchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, 'Nama kategori minimal 2 karakter')
      .max(100, 'Nama kategori maksimal 100 karakter'),
  }),
});