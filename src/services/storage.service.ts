import { supabaseAdmin } from '../config/supabase';

// Ambil nama bucket dari .env (Fallback ke 'images' jika lupa di-set)
const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'images';

export const StorageService = {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME) // Menggunakan variabel
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new Error(`Gagal upload gambar: ${error.message}`);

    // Dapatkan Public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(BUCKET_NAME) // Menggunakan variabel
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }
};