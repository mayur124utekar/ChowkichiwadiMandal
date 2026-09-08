import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const isVercel = Boolean(process.env.VERCEL);
const uploadBaseDir = isVercel
  ? path.join('/tmp', 'uploads')
  : path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');

// Ensure upload subdirectories exist safely without crashing on read-only environments
try {
  ['members', 'receipts', 'meetings', 'branding'].forEach((sub) => {
    const dir = path.join(uploadBaseDir, sub);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
} catch (err) {
  console.warn('Upload directory creation skipped (read-only filesystem):', err);
}

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    let folder = 'members';
    if (req.originalUrl.includes('/expenses') || req.originalUrl.includes('/contributions')) {
      folder = 'receipts';
    } else if (req.originalUrl.includes('/meetings')) {
      folder = 'meetings';
    } else if (req.originalUrl.includes('/settings') || req.originalUrl.includes('/branding')) {
      folder = 'branding';
    }
    cb(null, path.join(uploadBaseDir, folder));
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const allowedDocMimes = ['application/pdf'];

  if (file.fieldname === 'minutesFile') {
    if (allowedDocMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for meeting minutes!'));
    }
  } else {
    if (allowedImageMimes.includes(file.mimetype) || (file.mimetype === 'application/pdf' && file.fieldname === 'receipt')) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP image or PDF files are allowed!'));
    }
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: (parseInt(process.env.MAX_UPLOAD_SIZE_MB || '5', 10)) * 1024 * 1024,
  },
  fileFilter,
});
