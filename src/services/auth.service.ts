import { supabase } from '../config/supabase';

export const AuthService = {
  async login(email: string, password: string) {
    // Supabase otomatis memverifikasi password dan mengembalikan session (berisi token JWT)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data.session; // Ini berisi access_token yang akan dipakai di Frontend
  }
};