export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
  isActive: boolean;
}

export interface Group {
  id: number;
  name: string;
  nameMarathi: string;
  code: 'NORMAL' | 'YOUTH';
  description?: string;
  displayOrder: number;
  isActive: boolean;
  _count?: {
    members?: number;
  };
}

export interface Position {
  id: number;
  name: string;
  nameMarathi: string;
  groupId?: number | null;
  displayOrder: number;
  isActive: boolean;
  group?: Group | null;
}

export interface Member {
  id: number;
  groupId: number;
  positionId?: number | null;
  fullName: string;
  fullNameMarathi?: string;
  photoUrl?: string | null;
  mobileNumber?: string | null;
  joiningDate?: string | null;
  bio?: string | null;
  bioMarathi?: string | null;
  displayOrder: number;
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  group?: Group;
  position?: Position | null;
}

export interface MonthlyContribution {
  id: number;
  memberId?: number | null;
  contributorName: string;
  contributorType: 'MEMBER' | 'OUTSIDE_PERSON';
  groupId?: number | null;
  amount: string | number;
  contributionMonth: number;
  contributionYear: number;
  paymentDate: string;
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
  receiptNumber?: string | null;
  notes?: string | null;
  status: 'DRAFT' | 'CONFIRMED' | 'VOIDED';
  isPublic: boolean;
  createdAt: string;
  member?: Member | null;
}

export interface Event {
  id: number;
  name: string;
  nameMarathi: string;
  description?: string | null;
  descriptionMarathi?: string | null;
  eventDate: string;
  startDate?: string | null;
  endDate?: string | null;
  year: number;
  targetAmount?: string | number | null;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  bannerUrl?: string | null;
  isPublic: boolean;
  totalCollected?: number;
  contributionsCount?: number;
  contributorsCount?: number;
}

export interface FestivalContribution {
  id: number;
  eventId: number;
  memberId?: number | null;
  contributorName: string;
  contributorType: 'MEMBER' | 'OUTSIDE_PERSON';
  amount: string | number;
  paymentDate: string;
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
  receiptNumber?: string | null;
  notes?: string | null;
  status: 'DRAFT' | 'CONFIRMED' | 'VOIDED';
  isPublic: boolean;
  createdAt: string;
  event?: Event;
  member?: Member | null;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  nameMarathi: string;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface Expense {
  id: number;
  categoryId: number;
  title: string;
  titleMarathi?: string | null;
  description?: string | null;
  amount: string | number;
  expenseDate: string;
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
  vendorName?: string | null;
  billNumber?: string | null;
  receiptUrl?: string | null;
  notes?: string | null;
  status: 'DRAFT' | 'CONFIRMED' | 'VOIDED';
  isPublic: boolean;
  category?: ExpenseCategory;
}

export interface Meeting {
  id: number;
  meetingTitle: string;
  meetingTitleMarathi: string;
  meetingDate: string;
  location: string;
  description?: string | null;
  descriptionMarathi?: string | null;
  agenda?: string | null;
  agendaMarathi?: string | null;
  decisions?: string | null;
  decisionsMarathi?: string | null;
  attendanceCount?: number | null;
  minutesFileUrl?: string | null;
  photos?: string | null;
  isPublic: boolean;
}

export interface SiteSettings {
  id: number;
  mandalName: string;
  mandalNameMarathi: string;
  regNumber: string;
  regNumberMarathi: string;
  address: string;
  addressMarathi: string;
  primaryPhone?: string | null;
  secondaryPhone?: string | null;
  email?: string | null;
  logoUrl?: string | null;
  mainImageUrl?: string | null;
  primaryColor: string;
  monthlyTargetAmount: string | number;
  openingBalance: string | number;
  showMonthlySummaryPublicly: boolean;
  showFestivalSummaryPublicly: boolean;
  showExpenseListPublicly: boolean;
  showMemberNamesPublicly: boolean;
  showContributorNamesPublicly: boolean;
}

export interface AuditLog {
  id: number;
  userId?: number | null;
  user?: AdminUser | null;
  action: string;
  entityType: string;
  entityId?: number | null;
  oldValues?: string | null;
  newValues?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}
