import { put } from '@vercel/blob';
import path from 'path';
import fs from 'fs';

export class StorageService {
  /**
   * Uploads a file buffer either to Vercel Blob (if token exists) or to local disk storage
   */
  static async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    const pathname = `${folder}/${filename}`;

    // 1. Try Vercel Blob Storage if token is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(pathname, file.buffer, {
          access: 'public',
          contentType: file.mimetype,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        return blob.url;
      } catch (error: any) {
        // If the store is configured as private, upload with private access
        if (error?.message?.includes('private store')) {
          try {
            const privateBlob = await put(pathname, file.buffer, {
              access: 'private',
              contentType: file.mimetype,
              token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            return privateBlob.downloadUrl || privateBlob.url;
          } catch (pErr) {
            console.error('Private blob upload failed:', pErr);
          }
        }
        console.error('Vercel Blob upload failed, falling back to local/tmp disk:', error);
      }
    }

    // 2. Fallback to Local Disk / Tmp Storage
    const isVercel = Boolean(process.env.VERCEL);
    const uploadBaseDir = isVercel
      ? path.join('/tmp', 'uploads')
      : path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');

    const targetDir = path.join(uploadBaseDir, folder);
    if (!fs.existsSync(targetDir)) {
      try {
        fs.mkdirSync(targetDir, { recursive: true });
      } catch (err) {
        console.warn('Could not create directory on disk:', err);
      }
    }

    const filePath = path.join(targetDir, filename);
    try {
      fs.writeFileSync(filePath, file.buffer);
    } catch (err) {
      console.error('Failed writing file to disk:', err);
    }

    return `/uploads/${folder}/${filename}`;
  }
}
