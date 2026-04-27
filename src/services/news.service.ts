import { eq, desc } from 'drizzle-orm';
import { db } from '../config/db';
import { news, users, categories } from '../db/schema';

// Definisi tipe data payload untuk pembuatan berita
type CreateNewsPayload = {
  title: string;
  content: any; // Menerima JSON Object dari Tiptap
  thumbnail: string;
  status: 'draft' | 'published' | 'archived';
  authorId: string; // UUID dari Supabase Auth
  categoryId?: number | null;
};

// Definisi tipe data untuk update (semua field bersifat opsional)
type UpdateNewsPayload = Partial<Omit<CreateNewsPayload, 'authorId'>>;

export const NewsService = {
  /**
   * Helper untuk membuat slug URL yang SEO friendly
   * Contoh: "Lomba Koding 2026" -> "lomba-koding-2026"
   */
  createSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '') // Hapus karakter non-alphanumeric
      .replace(/ +/g, '-');    // Ubah spasi menjadi strip
  },

  /**
   * Insert berita baru ke database
   */
  async createNews(data: CreateNewsPayload) {
    // Tambahkan timestamp di akhir slug agar selalu unik (menghindari error unique constraint)
    const slug = `${this.createSlug(data.title)}-${Date.now()}`;
    
    const result = await db.insert(news).values({
      ...data,
      slug,
    }).returning();
    
    return result[0];
  },

  /**
   * Mengambil semua daftar berita beserta nama penulis dan nama kategorinya
   */
  async getAllNews() {
    return await db
      .select({
        id: news.id,
        title: news.title,
        slug: news.slug,
        thumbnail: news.thumbnail,
        status: news.status,
        createdAt: news.createdAt,
        // Ambil data dari tabel berelasi
        author: {
          id: users.id,
          name: users.name,
        },
        category: {
          id: categories.id,
          name: categories.name,
        }
      })
      .from(news)
      // Left join ke tabel users berdasarkan authorId
      .leftJoin(users, eq(news.authorId, users.id))
      // Left join ke tabel categories berdasarkan categoryId
      .leftJoin(categories, eq(news.categoryId, categories.id))
      // Urutkan dari yang paling baru
      .orderBy(desc(news.createdAt));
  },

  /**
   * Mengambil detail spesifik satu berita (termasuk konten JSON Tiptap-nya)
   */
  async getNewsBySlug(slug: string) {
    const result = await db
      .select({
        id: news.id,
        title: news.title,
        slug: news.slug,
        content: news.content, // Konten JSON Tiptap dimuat di sini
        thumbnail: news.thumbnail,
        status: news.status,
        createdAt: news.createdAt,
        updatedAt: news.updatedAt,
        author: {
          id: users.id,
          name: users.name,
        },
        category: {
          id: categories.id,
          name: categories.name,
        }
      })
      .from(news)
      .leftJoin(users, eq(news.authorId, users.id))
      .leftJoin(categories, eq(news.categoryId, categories.id))
      .where(eq(news.slug, slug));
      
    return result[0];
  },

  /**
   * Memperbarui data berita berdasarkan ID
   */
  async updateNews(id: number, data: UpdateNewsPayload) {
    // Jika title diubah, kita bisa memilih untuk membuat slug baru atau membiarkan slug lama.
    // Best practice SEO adalah membiarkan slug lama, namun jika ingin diubah, uncomment di bawah ini:
    // let newSlug;
    // if (data.title) newSlug = `${this.createSlug(data.title)}-${Date.now()}`;

    const result = await db
      .update(news)
      .set({ 
        ...data, 
        // slug: newSlug || undefined,
        updatedAt: new Date() 
      })
      .where(eq(news.id, id))
      .returning();
      
    return result[0];
  },

  /**
   * Menghapus berita berdasarkan ID
   */
  async deleteNews(id: number) {
    const result = await db
      .delete(news)
      .where(eq(news.id, id))
      .returning();
      
    return result[0];
  }
};