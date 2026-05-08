import { eq, desc, ilike } from 'drizzle-orm';
import { db } from '../config/db';
import { pengumuman, kategoriPengumuman } from '../db/schema';

type CreatePengumumanPayload = {
  title: string;
  pdfUrl?: string | null;
  expiry: Date;
  priority?: 'high' | 'medium' | 'low';
  status?: 'active' | 'expired';
  category?: string | null;
  date?: Date;
};

export const PengumumanService = {
  createSlug(name: string) {
    return name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  },

  async createPengumuman(data: CreatePengumumanPayload) {
    let categoryId: number | null = null;

    if (data.category) {
      const [categoryResult] = await db
        .select()
        .from(kategoriPengumuman)
        .where(ilike(kategoriPengumuman.name, data.category));
      
      if (!categoryResult) {
        const [newCategory] = await db
          .insert(kategoriPengumuman)
          .values({
            name: data.category,
            slug: this.createSlug(data.category)
          })
          .returning();
        categoryId = newCategory?.id || null;
      } else {
        categoryId = categoryResult.id;
      }
    }

    const result = await db.insert(pengumuman).values({
      title: data.title,
      pdfUrl: data.pdfUrl || null,
      expiry: data.expiry,
      priority: data.priority || 'medium',
      status: data.status || 'active',
      categoryId,
      date: data.date || new Date()
    }).returning();

    return this.getPengumumanById(result[0].id);
  },

  async getAllPengumuman() {
    return await db
      .select({
        id: pengumuman.id,
        title: pengumuman.title,
        pdfUrl: pengumuman.pdfUrl,
        date: pengumuman.date,
        expiry: pengumuman.expiry,
        priority: pengumuman.priority,
        status: pengumuman.status,
        category: kategoriPengumuman.name,
      })
      .from(pengumuman)
      .leftJoin(kategoriPengumuman, eq(pengumuman.categoryId, kategoriPengumuman.id))
      .orderBy(desc(pengumuman.date));
  },

  async getPengumumanById(id: number) {
    const data = await db
      .select({
        id: pengumuman.id,
        title: pengumuman.title,
        pdfUrl: pengumuman.pdfUrl,
        date: pengumuman.date,
        expiry: pengumuman.expiry,
        priority: pengumuman.priority,
        status: pengumuman.status,
        category: kategoriPengumuman.name,
      })
      .from(pengumuman)
      .leftJoin(kategoriPengumuman, eq(pengumuman.categoryId, kategoriPengumuman.id))
      .where(eq(pengumuman.id, id));
      
    return data[0];
  },

  async updatePengumuman(id: number, data: Partial<CreatePengumumanPayload>) {
    const updateData: any = {};

    if (data.title) updateData.title = data.title;
    if (data.pdfUrl !== undefined) updateData.pdfUrl = data.pdfUrl;
    if (data.expiry) updateData.expiry = data.expiry;
    if (data.priority) updateData.priority = data.priority;
    if (data.status) updateData.status = data.status;
    if (data.date) updateData.date = data.date;

    if (data.category !== undefined) {
      if (data.category === null) {
        updateData.categoryId = null;
      } else {
        const [categoryResult] = await db
          .select()
          .from(kategoriPengumuman)
          .where(ilike(kategoriPengumuman.name, data.category));
        
        if (categoryResult) {
          updateData.categoryId = categoryResult.id;
        }
      }
    }

    await db.update(pengumuman).set(updateData).where(eq(pengumuman.id, id));
    return this.getPengumumanById(id);
  },

  async deletePengumuman(id: number) {
    const result = await db.delete(pengumuman).where(eq(pengumuman.id, id)).returning();
    return result[0];
  }
};