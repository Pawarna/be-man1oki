import * as dotenv from 'dotenv';
dotenv.config();
import { supabaseAdmin } from '../config/supabase';
import { db } from '../config/db';
import { users } from './schema';


const seedAdmin = async () => {
  console.log('--- Memulai Proses Seeding Admin ---');

  const adminData = {
    name: 'Super Admin Sekolah',
    email: 'admin@sekolah.com',
    password: 'password123', // Silakan ganti dengan yang lebih kuat
  };

  try {
    // 1. Buat User di Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminData.email,
      password: adminData.password,
      email_confirm: true,
      user_metadata: { name: adminData.name }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  Email admin sudah terdaftar di Supabase Auth.');
        return;
      }
      throw authError;
    }

    if (!authData.user) throw new Error('Gagal mendapatkan data user dari Auth');

    // 2. Masukkan ke tabel public.users menggunakan Drizzle
    await db.insert(users).values({
      id: authData.user.id,
      name: adminData.name,
      email: adminData.email,
      role: 'admin',
    });

    console.log('✅ Berhasil membuat user admin!');
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`🔑 Password: ${adminData.password}`);
    
  } catch (error: any) {
    console.error('❌ Terjadi kesalahan saat seeding:', error);
  } finally {
    console.log('--- Proses Selesai ---');
    process.exit();
  }
};

seedAdmin();