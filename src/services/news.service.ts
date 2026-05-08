import { eq, desc, and, ilike, or, sql } from 'drizzle-orm';
import { db } from '../config/db';
import { news, kategoriBerita, users } from '../db/schema';

// 1. Sesuaikan Payload dengan Skema Baru
type CreateNewsPayload = {
  title: string;
  content: any;
  excerpt: string;
  image: string;
  status?: 'draft' | 'published' | 'archived';
  category?: string | null;
  author?: string;
  date?: Date;
};

export const NewsService = {
  // Helper membuat slug
  createSlug(title: string) {
    return title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  },

  async createNews(data: CreateNewsPayload) {
    let baseSlug = this.createSlug(data.title);
    let slug = baseSlug;

    // Cek duplikasi slug
    const existing = await db.select().from(news).where(eq(news.slug, slug));
    if (existing.length > 0) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    // Resolve category (can be name or ID)
    let categoryId: number | null = null;
    if (data.category) {
      const isNumeric = /^\d+$/.test(data.category);
      
      if (isNumeric) {
        categoryId = parseInt(data.category);
      } else {
        const [categoryResult] = await db
          .select()
          .from(kategoriBerita)
          .where(ilike(kategoriBerita.name, data.category));
        
        if (!categoryResult) {
          // Create category if not exists
          const [newCategory] = await db
            .insert(kategoriBerita)
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
    }

    // Resolve author (can be name or ID/UUID)
    let authorId: string | null = null;
    
    if (data.author) {
      // Try to find by name first
      const [authorResult] = await db
        .select()
        .from(users)
        .where(ilike(users.name, data.author));
      
      if (authorResult) {
        authorId = authorResult.id;
      } else {
        // Check if it's a valid UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(data.author)) {
          authorId = data.author;
        }
      }
    }

    // Fallback: If still no authorId, get the first available user
    if (!authorId) {
      const [fallbackUser] = await db.select().from(users).limit(1);
      if (fallbackUser) {
        authorId = fallbackUser.id;
      } else {
        throw new Error('Penulis tidak ditemukan dan tidak ada user terdaftar di sistem.');
      }
    }

    // Insert data
    const result = await db.insert(news).values({
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      image: data.image,
      status: data.status || 'draft',
      date: data.date || new Date(),
      authorId,
      categoryId
    }).returning();

    return result[0];
  },

  async getNewsById(id: number) {
    const data = await db
      .select({
        id: news.id,
        title: news.title,
        category: kategoriBerita.name,
        date: news.date,
        status: news.status,
        author: users.name,
        content: news.content,
        excerpt: news.excerpt,
        image: news.image,
      })
      .from(news)
      .leftJoin(kategoriBerita, eq(news.categoryId, kategoriBerita.id))
      .leftJoin(users, eq(news.authorId, users.id))
      .where(eq(news.id, id));

    return data[0];
  },

  async getNewsBySlug(slug: string) {
    const data = await db
      .select({
        id: news.id,
        title: news.title,
        category: kategoriBerita.name,
        date: news.date,
        status: news.status,
        author: users.name,
        content: news.content,
        excerpt: news.excerpt,
        image: news.image,
      })
      .from(news)
      .leftJoin(kategoriBerita, eq(news.categoryId, kategoriBerita.id))
      .leftJoin(users, eq(news.authorId, users.id))
      .where(eq(news.slug, slug));

    return data[0];
  },

  async updateNews(id: number, data: Partial<CreateNewsPayload>) {
    const updateData: any = {};

    if (data.title) {
      updateData.title = data.title;
      updateData.slug = this.createSlug(data.title);
    }
    if (data.content) updateData.content = data.content;
    if (data.excerpt) updateData.excerpt = data.excerpt;
    if (data.image) updateData.image = data.image;
    if (data.status) updateData.status = data.status;
    if (data.date) updateData.date = data.date;

    // Handle category
    if (data.category !== undefined) {
      if (data.category === null) {
        updateData.categoryId = null;
      } else {
        const isNumeric = /^\d+$/.test(data.category);
        if (isNumeric) {
          updateData.categoryId = parseInt(data.category);
        } else {
          const [categoryResult] = await db
            .select()
            .from(kategoriBerita)
            .where(ilike(kategoriBerita.name, data.category));
          
          if (categoryResult) {
            updateData.categoryId = categoryResult.id;
          }
        }
      }
    }

    // Handle author
    if (data.author) {
      const [authorResult] = await db
        .select()
        .from(users)
        .where(ilike(users.name, data.author));
      
      if (authorResult) {
        updateData.authorId = authorResult.id;
      } else {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(data.author)) {
          updateData.authorId = data.author;
        }
      }
    }

    const result = await db.update(news).set(updateData).where(eq(news.id, id)).returning();
    return result[0];
  },

  async deleteNews(id: number) {
    const result = await db.delete(news).where(eq(news.id, id)).returning();
    return result[0];
  },

  async getAllNews(params: { page: number; perPage: number; q?: string; status?: string }) {
    const { page, perPage, q, status } = params;
    const offset = (page - 1) * perPage;

    const conditions = [];
    
    if (status) {
      conditions.push(eq(news.status, status as any));
    }
    
    if (q) {
      conditions.push(
        or(
          ilike(news.title, `%${q}%`),
          ilike(news.excerpt, `%${q}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(news)
      .where(whereClause);
    
    const total = Number(totalResult.count);

    const data = await db
      .select({
        id: news.id,
        title: news.title,
        category: kategoriBerita.name,
        date: news.date,
        status: news.status,
        author: users.name,
        content: news.content,
        excerpt: news.excerpt,
        image: news.image,
      })
      .from(news)
      .leftJoin(kategoriBerita, eq(news.categoryId, kategoriBerita.id))
      .leftJoin(users, eq(news.authorId, users.id))
      .where(whereClause)
      .orderBy(desc(news.date))
      .limit(perPage)
      .offset(offset);

    return {
      items: data,
      total,
      page,
      perPage
    };
  },
};