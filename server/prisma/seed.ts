import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Chowkichiwadi Mandal master database structures...');

  // 1. Seed Site Settings (only if not already created)
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        id: 1,
        mandalName: 'Chowkichiwadi Adhyatm Gramastha Mandal',
        mandalNameMarathi: 'चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ - साखर',
        regNumber: 'MH/013/2020/RATNA',
        regNumberMarathi: 'महाराष्ट्र/०१३/२०२०/रत्ना. (महाराष्ट्र राज्य)',
        address: 'Sakhar Chowkichiwadi, Tal. Khed, Dist. Ratnagiri',
        addressMarathi: 'साखर चौकीचीवाडी, ता. खेड, जि. रत्नागिरी',
        primaryPhone: '9876543210',
        secondaryPhone: '9123456780',
        email: 'contact@chowkichiwadi.org',
        logoUrl: '/uploads/branding/logo.jpeg',
        primaryColor: '#F97316',
        monthlyTargetAmount: 200.0,
        openingBalance: 121657.0,
        showMonthlySummaryPublicly: true,
        showFestivalSummaryPublicly: true,
        showExpenseListPublicly: true,
        showMemberNamesPublicly: true,
        showContributorNamesPublicly: false,
      },
    });
    console.log('Site settings created.');
  }

  // 2. Seed Admin User
  const passwordHash = await bcrypt.hash('Admin@12345', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@chowkichiwadi.org' },
    update: {},
    create: {
      name: 'महानिर्देशक (System Admin)',
      email: 'admin@chowkichiwadi.org',
      passwordHash: passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log('Admin user verified.');

  // 3. Seed Groups (Youth Group = 1, Normal Group = 2)
  const youthGroup = await prisma.group.upsert({
    where: { code: 'YOUTH' },
    update: { displayOrder: 1 },
    create: {
      name: 'Youth Group',
      nameMarathi: 'युवा मंडळ',
      code: 'YOUTH',
      description: 'ग्रामस्थ युवा सदस्य गट',
      displayOrder: 1,
      isActive: true,
    },
  });

  const normalGroup = await prisma.group.upsert({
    where: { code: 'NORMAL' },
    update: { displayOrder: 2 },
    create: {
      name: 'Normal Group',
      nameMarathi: 'सामान्य ग्रुप',
      code: 'NORMAL',
      description: 'ग्रामस्थ सामान्य सदस्य गट',
      displayOrder: 2,
      isActive: true,
    },
  });
  console.log('Groups verified.');

  // 4. Seed Master Positions
  const positionsData = [
    { name: 'President', nameMarathi: 'अध्यक्ष', groupId: normalGroup.id, displayOrder: 1 },
    { name: 'Vice President', nameMarathi: 'उपाध्यक्ष', groupId: normalGroup.id, displayOrder: 2 },
    { name: 'Secretary', nameMarathi: 'सचिव', groupId: normalGroup.id, displayOrder: 3 },
    { name: 'Joint Secretary', nameMarathi: 'सहसचिव', groupId: normalGroup.id, displayOrder: 4 },
    { name: 'Treasurer', nameMarathi: 'खजिनदार', groupId: normalGroup.id, displayOrder: 5 },
    { name: 'Youth President', nameMarathi: 'युवा अध्यक्ष', groupId: youthGroup.id, displayOrder: 6 },
    { name: 'Youth Secretary', nameMarathi: 'युवा सचिव', groupId: youthGroup.id, displayOrder: 7 },
    { name: 'Advisor', nameMarathi: 'सल्लागार', groupId: normalGroup.id, displayOrder: 8 },
    { name: 'Member', nameMarathi: 'सदस्य', groupId: null, displayOrder: 9 },
  ];

  for (const pos of positionsData) {
    const existing = await prisma.position.findFirst({
      where: { name: pos.name },
    });
    if (!existing) {
      await prisma.position.create({
        data: {
          name: pos.name,
          nameMarathi: pos.nameMarathi,
          groupId: pos.groupId,
          displayOrder: pos.displayOrder,
          isActive: true,
        },
      });
    }
  }
  console.log('Positions verified.');

  // 5. Seed Master Expense Categories
  const expenseCategories = [
    { name: 'Religious Materials', nameMarathi: 'धार्मिक साहित्य व पूजा साहित्य', displayOrder: 1 },
    { name: 'Decoration & Mandap', nameMarathi: 'सजावट व मंडप व्यवस्था', displayOrder: 2 },
    { name: 'Prasad & Food', nameMarathi: 'प्रसाद व अन्नदान', displayOrder: 3 },
    { name: 'Electricity & Lighting', nameMarathi: 'वीज व रोषणाई', displayOrder: 4 },
    { name: 'Sound System', nameMarathi: 'ध्वनी व्यवस्था (Sound System)', displayOrder: 5 },
    { name: 'Event & Cultural', nameMarathi: 'कार्यक्रम व सांस्कृतिक खर्च', displayOrder: 6 },
    { name: 'Travel & Transport', nameMarathi: 'प्रवास व वाहतूक', displayOrder: 7 },
    { name: 'Maintenance', nameMarathi: 'मंदिर व परिसर देखभाल', displayOrder: 8 },
    { name: 'Miscellaneous', nameMarathi: 'इतर किरकोळ खर्च', displayOrder: 9 },
  ];

  for (const cat of expenseCategories) {
    const existing = await prisma.expenseCategory.findFirst({
      where: { name: cat.name },
    });
    if (!existing) {
      await prisma.expenseCategory.create({
        data: {
          name: cat.name,
          nameMarathi: cat.nameMarathi,
          displayOrder: cat.displayOrder,
          isActive: true,
        },
      });
    }
  }
  console.log('Expense categories verified.');

  console.log('Master structures seeding completed successfully! No dummy data added.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
