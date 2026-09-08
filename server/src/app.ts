import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/error.js';

export const app = express();
app.disable('x-powered-by');

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
    hidePoweredBy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later' } },
});
app.use('/api/v1/auth/login', authLimiter);
app.use('/v1/auth/login', authLimiter);
app.use('/auth/login', authLimiter);

// Robust upload directory resolution
const isVercel = Boolean(process.env.VERCEL);
const uploadBaseDir = isVercel
  ? path.join('/tmp', 'uploads')
  : fs.existsSync(path.resolve(process.cwd(), 'uploads'))
  ? path.resolve(process.cwd(), 'uploads')
  : path.resolve(process.cwd(), '../uploads');

if (fs.existsSync(uploadBaseDir)) {
  app.use('/uploads', express.static(uploadBaseDir));
}

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date(), app: 'चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ' });
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date(), app: 'चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ API' });
});

// Mount API router across all common Vercel rewrite patterns
app.use('/api/v1', apiRouter);
app.use('/v1', apiRouter);
app.use('/api', apiRouter);
app.use('/', apiRouter);

// SPA Static Build serving for standalone server only (NOT inside Vercel serverless lambda)
if (!process.env.VERCEL) {
  const clientDistDir = fs.existsSync(path.resolve(process.cwd(), 'client/dist'))
    ? path.resolve(process.cwd(), 'client/dist')
    : path.resolve(process.cwd(), '../client/dist');

  if (fs.existsSync(clientDistDir)) {
    app.use(express.static(clientDistDir));

    app.get('*', (req, res, next) => {
      if (
        req.path.startsWith('/api') || 
        req.path.startsWith('/uploads') || 
        req.path.startsWith('/v1') ||
        req.path.startsWith('/auth') ||
        req.path.startsWith('/public')
      ) {
        return next();
      }
      res.sendFile(path.join(clientDistDir, 'index.html'));
    });
  }
}

// Centralized error handler
app.use(errorHandler);

export default app;

