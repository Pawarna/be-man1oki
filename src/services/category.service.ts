import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { categories } from '../db/schema';

export const CategoryService = {
  // Helper untuk membuat slug: "Kegiatan Siswa" -> "kegiatan-siswa"
  createSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  },

  async createCategory(name: string) {
    // Generate slug dasar
    let baseSlug = this.createSlug(name);
    let slug = baseSlug;
    
    // Opsional: Cek apakah slug sudah ada (untuk mencegah error unique constraint)
    const existing = await db.select().from(categories).where(eq(categories.slug, slug));
    if (existing.length > 0) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    const result = await db.insert(categories).values({
      name,
      slug,
    }).returning();
    
    return result[0];
  },

  async getAllCategories() {
    return await db.select().from(categories).orderBy(categories.name);
  },

  async getCategoryById(id: number) {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  },

  async updateCategory(id: number, name: string) {
    const slug = this.createSlug(name); // Update slug jika nama berubah

    const result = await db
      .update(categories)
      .set({ name, slug })
      .where(eq(categories.id, id))
      .returning();
      
    return result[0];
  },

  async deleteCategory(id: number) {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result[0];
  }
};