import { sql } from 'drizzle-orm';
import { db } from '../config/db';
import { news, galeri, kegiatan, pengumuman } from '../db/schema';

export const DashboardService = {
  async getStats() {
    const [newsCount] = await db.select({ count: sql<number>`count(*)` }).from(news);
    const [galeriCount] = await db.select({ count: sql<number>`count(*)` }).from(galeri);
    const [kegiatanCount] = await db.select({ count: sql<number>`count(*)` }).from(kegiatan);
    const [pengumumanCount] = await db.select({ count: sql<number>`count(*)` }).from(pengumuman);

    // Get counts by status for news
    const newsStatusStats = await db.select({
      status: news.status,
      count: sql<number>`count(*)`
    }).from(news).groupBy(news.status);

    return {
      totals: {
        berita: Number(newsCount.count),
        galeri: Number(galeriCount.count),
        kegiatan: Number(kegiatanCount.count),
        pengumuman: Number(pengumumanCount.count),
      },
      newsStatus: newsStatusStats,
    };
  },

  async getRecentActivities() {
    const latestNews = await db.select().from(news).orderBy(sql`${news.createdAt} DESC`).limit(5);
    const latestPengumuman = await db.select().from(pengumuman).orderBy(sql`${pengumuman.date} DESC`).limit(5);
    
    return {
      latestNews,
      latestPengumuman
    };
  }
};
