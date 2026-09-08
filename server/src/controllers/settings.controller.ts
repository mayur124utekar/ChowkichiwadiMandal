import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';
import { logAuditAction } from '../services/audit.service.js';
import { StorageService } from '../services/storage.service.js';

const settingsSchema = z.object({
  mandalName: z.string().min(2),
  mandalNameMarathi: z.string().min(2),
  regNumber: z.string().min(2),
  regNumberMarathi: z.string().min(2),
  address: z.string().min(2),
  addressMarathi: z.string().min(2),
  primaryPhone: z.string().optional().nullable(),
  secondaryPhone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  primaryColor: z.string().default('#F97316'),
  monthlyTargetAmount: z.coerce.number().positive(),
  openingBalance: z.coerce.number().nonnegative(),
  showMonthlySummaryPublicly: z.coerce.boolean(),
  showFestivalSummaryPublicly: z.coerce.boolean(),
  showExpenseListPublicly: z.coerce.boolean(),
  showMemberNamesPublicly: z.coerce.boolean(),
  showContributorNamesPublicly: z.coerce.boolean(),
});

export async function getSettings(req: Request, res: Response) {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: {} });
    }
    return sendSuccess(res, settings);
  } catch (error) {
    return sendError(res, 'Failed to fetch site settings', 500);
  }
}

export async function updateSettings(req: AuthRequest, res: Response) {
  try {
    const data = settingsSchema.partial().parse(req.body);
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: {} });
    }

    let logoUrl = settings.logoUrl;
    let mainImageUrl = settings.mainImageUrl;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (files?.logo?.[0]) {
      logoUrl = await StorageService.uploadFile(files.logo[0], 'branding');
    }
    if (files?.mainImage?.[0]) {
      mainImageUrl = await StorageService.uploadFile(files.mainImage[0], 'branding');
    }

    const updated = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        ...data,
        logoUrl,
        mainImageUrl,
      },
    });

    await logAuditAction(req, 'UPDATE_SETTINGS', 'SiteSettings', settings.id, settings, updated);
    return sendSuccess(res, updated, 'Settings updated successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, 'Validation error', 400, 'VALIDATION_ERROR', error.errors);
    }
    return sendError(res, 'Failed to update settings', 500);
  }
}
