import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { Role } from '@prisma/client';

import * as authController from '../controllers/auth.controller.js';
import * as publicController from '../controllers/public.controller.js';
import * as memberController from '../controllers/member.controller.js';
import * as contributionController from '../controllers/contribution.controller.js';
import * as eventController from '../controllers/event.controller.js';
import * as expenseController from '../controllers/expense.controller.js';
import * as meetingController from '../controllers/meeting.controller.js';
import * as reportController from '../controllers/report.controller.js';
import * as settingsController from '../controllers/settings.controller.js';
import * as auditController from '../controllers/audit.controller.js';

export const apiRouter = Router();

// ----------------- Public Endpoints -----------------
apiRouter.get('/public/mandal', publicController.getPublicMandalInfo);
apiRouter.get('/public/members', publicController.getPublicMembers);
apiRouter.get('/public/monthly-summary', publicController.getPublicFinancialSummary);
apiRouter.get('/public/events', publicController.getPublicEvents);
apiRouter.get('/public/expenses', publicController.getPublicExpenses);
apiRouter.get('/public/meetings', publicController.getPublicMeetings);

// ----------------- Auth Endpoints -----------------
apiRouter.post('/auth/login', authController.login);
apiRouter.post('/auth/logout', requireAuth, authController.logout);
apiRouter.get('/auth/me', requireAuth, authController.getMe);
apiRouter.post('/auth/change-password', requireAuth, authController.changePassword);

// ----------------- Protected Endpoints -----------------

// Members
apiRouter.get('/members/meta', requireAuth, memberController.getGroupsAndPositions);
apiRouter.get('/members', requireAuth, memberController.getMembers);
apiRouter.get('/members/:id', requireAuth, memberController.getMemberById);
apiRouter.post('/members', requireAuth, upload.single('photo'), memberController.createMember);
apiRouter.patch('/members/:id', requireAuth, upload.single('photo'), memberController.updateMember);
apiRouter.delete('/members/:id', requireAuth, memberController.deleteMember);

// Contributions (Monthly & Festival)
apiRouter.get('/contributions/monthly', requireAuth, contributionController.getMonthlyContributions);
apiRouter.post('/contributions/monthly', requireAuth, contributionController.createMonthlyContribution);
apiRouter.post('/contributions/monthly/:id/void', requireAuth, contributionController.voidMonthlyContribution);

apiRouter.get('/contributions/festival', requireAuth, contributionController.getFestivalContributions);
apiRouter.post('/contributions/festival', requireAuth, contributionController.createFestivalContribution);
apiRouter.post('/contributions/festival/:id/void', requireAuth, contributionController.voidFestivalContribution);

// Events
apiRouter.get('/events', requireAuth, eventController.getEvents);
apiRouter.get('/events/:id', requireAuth, eventController.getEventById);
apiRouter.post('/events', requireAuth, eventController.createEvent);
apiRouter.patch('/events/:id', requireAuth, eventController.updateEvent);

// Expenses
apiRouter.get('/expenses/categories', requireAuth, expenseController.getExpenseCategories);
apiRouter.get('/expenses', requireAuth, expenseController.getExpenses);
apiRouter.post('/expenses', requireAuth, upload.single('receipt'), expenseController.createExpense);
apiRouter.post('/expenses/:id/void', requireAuth, expenseController.voidExpense);

// Meetings
apiRouter.get('/meetings', requireAuth, meetingController.getMeetings);
apiRouter.post('/meetings', requireAuth, upload.single('minutesFile'), meetingController.createMeeting);
apiRouter.patch('/meetings/:id', requireAuth, upload.single('minutesFile'), meetingController.updateMeeting);
apiRouter.delete('/meetings/:id', requireAuth, meetingController.deleteMeeting);

// Reports
apiRouter.get('/reports/dashboard', requireAuth, reportController.getDashboardStats);
apiRouter.get('/reports/financial-summary', requireAuth, reportController.getFinancialSummaryReport);
apiRouter.get('/reports/monthly-matrix', requireAuth, reportController.getMonthlyMatrix);

// Settings
apiRouter.get('/settings', settingsController.getSettings);
apiRouter.patch('/settings', requireAuth, requireRole([Role.ADMIN]), upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'mainImage', maxCount: 1 },
]), settingsController.updateSettings);

// Audit Logs
apiRouter.get('/audit-logs', requireAuth, requireRole([Role.ADMIN]), auditController.getAuditLogs);
