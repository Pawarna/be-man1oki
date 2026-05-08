import { pgTable, serial, varchar, text, timestamp, pgEnum, uuid, jsonb, integer } from 'drizzle-orm/pg-core';

// ==========================================
// 📌 ENUMERATIONS 
// ==========================================
export const roleEnum = pgEnum('role', ['admin', 'teacher', 'student']);
export const statusArtikelEnum = pgEnum('status_artikel', ['draft', 'published', 'archived']);
export const statusKegiatanEnum = pgEnum('status_kegiatan', ['active', 'inactive']);
export const priorityEnum = pgEnum('priority', ['high', 'medium', 'low']);
export const statusPengumumanEnum = pgEnum('status_pengumuman', ['active', 'expired']);

// ==========================================
// 📌 TABEL USERS
// ==========================================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull(), 
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: roleEnum('role').default('student').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 📌 TABEL KATEGORI (DIPISAHKAN)
// ==========================================
export const kategoriBerita = pgTable('kategori_berita', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
});

export const kategoriGaleri = pgTable('kategori_galeri', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
});

export const kategoriPengumuman = pgTable('kategori_pengumuman', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
});


// ==========================================
// 📌 1. TABEL BERITA
// ==========================================
export const news = pgTable('news', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: jsonb('content').notNull(), 
  excerpt: text('excerpt').notNull(),
  image: text('image').notNull(), // Akan diisi URL Supabase hasil Multer
  status: statusArtikelEnum('status').default('draft').notNull(),
  date: timestamp('date').defaultNow().notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  categoryId: integer('category_id').references(() => kategoriBerita.id), // Relasi ke Kategori Berita
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// 📌 2. TABEL GALERI
// ==========================================
export const galeri = pgTable('galeri', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  url: text('url').notNull(), // Akan diisi URL Supabase hasil Multer
  categoryId: integer('category_id').references(() => kategoriGaleri.id), // Relasi ke Kategori Galeri
  date: timestamp('date').defaultNow().notNull(),
});

// ==========================================
// 📌 3. TABEL KEGIATAN
// ==========================================
export const kegiatan = pgTable('kegiatan', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  image: text('image').notNull(),
  description: text('description').notNull(),
  schedule: varchar('schedule', { length: 255 }).notNull(),
  coordinator: varchar('coordinator', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull().default('Umum'),
  status: statusKegiatanEnum('status').default('active').notNull(),
});

// ==========================================
// 📌 4. TABEL PENGUMUMAN
// ==========================================
export const pengumuman = pgTable('pengumuman', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  pdfUrl: text('pdf_url'), // URL PDF pengumuman
  date: timestamp('date').defaultNow().notNull(),
  expiry: timestamp('expiry').notNull(),
  priority: priorityEnum('priority').default('medium').notNull(),
  status: statusPengumumanEnum('status').default('active').notNull(),
  categoryId: integer('category_id').references(() => kategoriPengumuman.id),
});