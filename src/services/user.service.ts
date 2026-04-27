import { db } from '../config/db';
import { users } from '../db/schema';
import { supabaseAdmin } from '../config/supabase';

export const UserService = {
  async createAdmin(data: { name: string; email: string; password: string }) {
    // 1. Daftarkan kredensial ke Supabase Auth (Otomatis di-hash & aman)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Auto-confirm karena ini admin setup
      user_metadata: { name: data.name }
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error('Gagal membuat user di Supabase Auth');

    // 2. Simpan data profil (Role & Name) ke tabel public.users kita via Drizzle
    const profile = await db.insert(users).values({
      id: authData.user.id, // Sinkronisasi UUID
      name: data.name,
      email: data.email,
      role: 'admin' // Hardcode role sebagai admin untuk endpoint setup ini
    }).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt
    });

    return profile[0];
  }
};