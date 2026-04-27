import { pgTable, serial, varchar, text, timestamp, pgEnum, uuid, jsonb, integer } from 'drizzle-orm/pg-core';

// Enum Role User
export const roleEnum = pgEnum('role', ['admin', 'teacher', 'student']);

// Enum Status Artikel
export const statusEnum = pgEnum('status_artikel', ['draft', 'published', 'archived']);

// Tabel Users (Tetap UUID dari Supabase Auth)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull(), 
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: roleEnum('role').default('student').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tabel Kategori Baru
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
});

// Tabel Berita Diperbarui
export const news = pgTable('news', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: jsonb('content').notNull(), // Menyimpan Tiptap JSON
  thumbnail: text('thumbnail').notNull(), // Menyimpan URL Supabase Storage
  status: statusEnum('status').default('draft').notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(), // Relasi ke Users
  categoryId: integer('category_id').references(() => categories.id), // Nullable
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});