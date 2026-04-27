import multer from 'multer';

// Menggunakan memory storage karena kita akan melempar buffer-nya langsung ke Supabase
const storage = multer.memoryStorage();
export const upload = multer({ storage });