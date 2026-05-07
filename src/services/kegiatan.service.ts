import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { kegiatan } from '../db/schema';

type CreateKegiatanPayload = {
  name: string;
  image: string;
  description: string;
  schedule: string;
  coordinator: string;
  status?: 'active' | 'inactive';
};

export const KegiatanService = {
  async createKegiatan(data: CreateKegiatanPayload) {
    const result = await db.insert(kegiatan).values(data).returning();
    return result[0];
  },

  async getAllKegiatan() {
    const result = await db.select().from(kegiatan);
    return result;
  },

  async getKegiatanById(id: number) {
    const result = await db.select().from(kegiatan).where(eq(kegiatan.id, id));
    return result[0];
  },

  async updateKegiatan(id: number, data: Partial<CreateKegiatanPayload>) {
    const result = await db.update(kegiatan).set(data).where(eq(kegiatan.id, id)).returning();
    return result[0];
  },

  async deleteKegiatan(id: number) {
    const result = await db.delete(kegiatan).where(eq(kegiatan.id, id)).returning();
    return result[0];
  }
};
