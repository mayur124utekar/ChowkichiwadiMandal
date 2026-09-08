import multer from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

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
