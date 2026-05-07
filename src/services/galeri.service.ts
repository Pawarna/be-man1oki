import { eq, desc, ilike } from 'drizzle-orm';
import { db } from '../config/db';
import { galeri, kategoriGaleri } from '../db/schema';

type CreateGaleriPayload = {
  title: string;
  url: string;
  category?: string | null;
  date?: Date;
};

export const GaleriService = {
  createSlug(name: string) {
    return name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  },

  async createGaleri(data: CreateGaleriPayload) {
    let categoryId: number | null = null;

    if (data.category) {
      const [categoryResult] = await db
        .select()
        .from(kategoriGaleri)
        .where(ilike(kategoriGaleri.name, data.category));
      
      if (!categoryResult) {
        const [newCategory] = await db
          .insert(kategoriGaleri)
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

    const result = await db.insert(galeri).values({
      title: data.title,
      url: data.url,
      categoryId,
      date: data.date || new Date()
    }).returning();

    return this.getGaleriById(result[0].id);
  },

  async getAllGaleri() {
    const data = await db
      .select({
        id: galeri.id,
        title: galeri.title,
        url: galeri.url,
        date: galeri.date,
        category: kategoriGaleri.name,
      })
      .from(galeri)
      .leftJoin(kategoriGaleri, eq(galeri.categoryId, kategoriGaleri.id))
      .orderBy(desc(galeri.date));
      
    return data;
  },

  async getGaleriById(id: number) {
    const data = await db
      .select({
        id: galeri.id,
        title: galeri.title,
        url: galeri.url,
        date: galeri.date,
        category: kategoriGaleri.name,
      })
      .from(galeri)
      .leftJoin(kategoriGaleri, eq(galeri.categoryId, kategoriGaleri.id))
      .where(eq(galeri.id, id));
      
    return data[0];
  },

  async updateGaleri(id: number, data: Partial<CreateGaleriPayload>) {
    const updateData: any = {};

    if (data.title) updateData.title = data.title;
    if (data.url) updateData.url = data.url;
    if (data.date) updateData.date = data.date;

    if (data.category !== undefined) {
      if (data.category === null) {
        updateData.categoryId = null;
      } else {
        const [categoryResult] = await db
          .select()
          .from(kategoriGaleri)
          .where(ilike(kategoriGaleri.name, data.category));
        
        if (categoryResult) {
          updateData.categoryId = categoryResult.id;
        }
      }
    }

    await db.update(galeri).set(updateData).where(eq(galeri.id, id));
    return this.getGaleriById(id);
  },

  async deleteGaleri(id: number) {
    const result = await db.delete(galeri).where(eq(galeri.id, id)).returning();
    return result[0];
  }
};