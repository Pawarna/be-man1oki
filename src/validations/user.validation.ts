import { z } from 'zod';

export const setupAdminSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Nama minimal 3 karakter').max(100, 'Nama maksimal 100 karakter'),
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter').max(50, 'Password terlalu panjang'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(1, 'Password tidak boleh kosong'),
  }),
});