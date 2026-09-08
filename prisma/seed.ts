import { PrismaClient, Role, ContributorType, PaymentMethod, RecordStatus, TransactionType, SourceType, EventStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Chowkichiwadi Mandal database...');

  // 1. Seed Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
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
      monthlyTargetAmount: 200.00,
      openingBalance: 15000.00,
      showMonthlySummaryPublicly: true,
      showFestivalSummaryPublicly: true,
      showExpenseListPublicly: true,
      showMemberNamesPublicly: true,
      showContributorNamesPublicly: false,
    },
  });

  // 2. Seed Admin User
  const passwordHash = await bcrypt.hash('Admin@12345', 10);
  const adminUser = await prisma.adminUser.upsert({
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

  // 3. Seed Groups
  const normalGroup = await prisma.group.upsert({
    where: { code: 'NORMAL' },
    update: {},
    create: {
      name: 'Normal Group',
      nameMarathi: 'सामान्य ग्रुप',
      code: 'NORMAL',
      description: 'ग्रामस्थ सामान्य सदस्य गट',
      displayOrder: 1,
      isActive: true,
    },
  });

  const youthGroup = await prisma.group.upsert({
    where: { code: 'YOUTH' },
    update: {},
    create: {
      name: 'Youth Group',
      nameMarathi: 'युवा ग्रुप',
      code: 'YOUTH',
      description: 'ग्रामस्थ युवा सदस्य गट',
      displayOrder: 2,
      isActive: true,
    },
  });

  // 4. Seed Positions
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

  const createdPositions: Record<string, number> = {};
  for (const pos of positionsData) {
    const p = await prisma.position.create({
      data: {
        name: pos.name,
        nameMarathi: pos.nameMarathi,
        groupId: pos.groupId,
        displayOrder: pos.displayOrder,
        isActive: true,
      },
    });
    createdPositions[pos.name] = p.id;
  }

  // 5. Seed Expense Categories
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

  const createdCategories: Record<string, number> = {};
  for (const cat of expenseCategories) {
    const c = await prisma.expenseCategory.create({
      data: {
        name: cat.name,
        nameMarathi: cat.nameMarathi,
        displayOrder: cat.displayOrder,
        isActive: true,
      },
    });
    createdCategories[cat.name] = c.id;
  }

  // 6. Seed Sample Members
  const sampleMembers = [
    {
      fullName: 'Santosh Kadam',
      fullNameMarathi: 'संतोष कदम',
      groupId: normalGroup.id,
      positionId: createdPositions['President'],
      mobileNumber: '9822100001',
      joiningDate: new Date('2020-01-15'),
      bioMarathi: 'मंडळाचे ज्येष्ठ मार्गदर्शक व अध्यक्ष.',
      displayOrder: 1,
    },
    {
      fullName: 'Ramesh Patil',
      fullNameMarathi: 'रमेश पाटील',
      groupId: normalGroup.id,
      positionId: createdPositions['Vice President'],
      mobileNumber: '9822100002',
      joiningDate: new Date('2020-01-15'),
      bioMarathi: 'उपाध्यक्ष, मंडळ नियोजन व व्यवस्थापन.',
      displayOrder: 2,
    },
    {
      fullName: 'Sanjay Sawant',
      fullNameMarathi: 'संजय सावंत',
      groupId: normalGroup.id,
      positionId: createdPositions['Secretary'],
      mobileNumber: '9822100003',
      joiningDate: new Date('2020-02-01'),
      bioMarathi: 'सचिव, दस्तऐवजीकरण व पत्रव्यवहार.',
      displayOrder: 3,
    },
    {
      fullName: 'Anant Pawar',
      fullNameMarathi: 'अनंत पवार',
      groupId: normalGroup.id,
      positionId: createdPositions['Treasurer'],
      mobileNumber: '9822100004',
      joiningDate: new Date('2020-02-01'),
      bioMarathi: 'खजिनदार, हिशोब व आर्थिक नोंदणी.',
      displayOrder: 4,
    },
    {
      fullName: 'Sachin More',
      fullNameMarathi: 'सचिन मोरे',
      groupId: youthGroup.id,
      positionId: createdPositions['Youth President'],
      mobileNumber: '9822100005',
      joiningDate: new Date('2021-01-10'),
      bioMarathi: 'युवा अध्यक्ष, युवा उपक्रम व डिजिटल उपक्रम नेतृत्व.',
      displayOrder: 5,
    },
    {
      fullName: 'Mayur Kadam',
      fullNameMarathi: 'मयूर कदम',
      groupId: youthGroup.id,
      positionId: createdPositions['Youth Secretary'],
      mobileNumber: '9822100006',
      joiningDate: new Date('2021-01-10'),
      bioMarathi: 'युवा सचिव, उत्सव व स्वयंसेवक व्यवस्थापन.',
      displayOrder: 6,
    },
    {
      fullName: 'Prakash Chavan',
      fullNameMarathi: 'प्रकाश चव्हाण',
      groupId: normalGroup.id,
      positionId: createdPositions['Advisor'],
      mobileNumber: '9822100007',
      joiningDate: new Date('2020-01-15'),
      bioMarathi: 'सल्लागार, सामाजिक व अध्यात्मिक मार्गदर्शन.',
      displayOrder: 7,
    },
    {
      fullName: 'Vilas Jadhav',
      fullNameMarathi: 'विलास जाधव',
      groupId: youthGroup.id,
      positionId: createdPositions['Member'],
      mobileNumber: '9822100008',
      joiningDate: new Date('2022-03-01'),
      bioMarathi: 'सक्रिय युवा सदस्य.',
      displayOrder: 8,
    }
  ];

  const memberRecords = [];
  for (const m of sampleMembers) {
    const mem = await prisma.member.create({
      data: {
        fullName: m.fullName,
        fullNameMarathi: m.fullNameMarathi,
        groupId: m.groupId,
        positionId: m.positionId,
        mobileNumber: m.mobileNumber,
        joiningDate: m.joiningDate,
        bioMarathi: m.bioMarathi,
        displayOrder: m.displayOrder,
        isActive: true,
        isPublic: true,
      },
    });
    memberRecords.push(mem);
  }

  // 7. Seed Opening Balance Transaction
  await prisma.financialTransaction.create({
    data: {
      transactionType: TransactionType.INCOME,
      sourceType: SourceType.OPENING_BALANCE,
      amount: 15000.00,
      transactionDate: new Date('2026-01-01'),
      description: 'मंडळ सुरुवातीची शिल्लक (Opening Balance)',
      paymentMethod: PaymentMethod.CASH,
      status: RecordStatus.CONFIRMED,
      createdBy: adminUser.id,
    }
  });

  // 8. Seed Monthly Contributions (Current Year)
  const currentYear = 2026;
  for (let month = 1; month <= 8; month++) {
    for (const mem of memberRecords.slice(0, 6)) {
      const mc = await prisma.monthlyContribution.create({
        data: {
          memberId: mem.id,
          contributorName: mem.fullNameMarathi || mem.fullName,
          contributorType: ContributorType.MEMBER,
          groupId: mem.groupId,
          amount: 200.00,
          contributionMonth: month,
          contributionYear: currentYear,
          paymentDate: new Date(`${currentYear}-${String(month).padStart(2, '0')}-05`),
          paymentMethod: month % 2 === 0 ? PaymentMethod.UPI : PaymentMethod.CASH,
          receiptNumber: `MB-${currentYear}-${String(month).padStart(2, '0')}-${String(mem.id).padStart(4, '0')}`,
          status: RecordStatus.CONFIRMED,
          isPublic: true,
          createdBy: adminUser.id,
        }
      });

      // Create ledger transaction
      await prisma.financialTransaction.create({
        data: {
          transactionType: TransactionType.INCOME,
          sourceType: SourceType.MONTHLY_CONTRIBUTION,
          sourceId: mc.id,
          amount: 200.00,
          transactionDate: mc.paymentDate,
          description: `मासिक वर्गणी: ${mem.fullNameMarathi} (महिना ${month}/${currentYear})`,
          paymentMethod: mc.paymentMethod,
          status: RecordStatus.CONFIRMED,
          createdBy: adminUser.id,
        }
      });
    }
  }

  // 9. Seed Events
  const ganeshEvent = await prisma.event.create({
    data: {
      name: 'Shree Ganeshotsav 2026',
      nameMarathi: 'श्री गणेशोत्सव २०२६',
      description: 'Annual Ganesh festival celebration and Aarti program',
      descriptionMarathi: 'श्री गणेशोत्सव भव्य सोहळा, आरती, भजन आणि सांस्कृतिक कार्यक्रम.',
      eventDate: new Date('2026-09-14'),
      startDate: new Date('2026-09-14'),
      endDate: new Date('2026-09-24'),
      year: 2026,
      targetAmount: 50000.00,
      status: EventStatus.UPCOMING,
      isPublic: true,
    }
  });

  const saiEvent = await prisma.event.create({
    data: {
      name: 'Shree Sai Baba Palkhi Sohala 2026',
      nameMarathi: 'श्री साईबाबा पालखी सोहळा व महाप्रसाद २०२६',
      description: 'Sai Baba palkhi procession and Mahaprasad',
      descriptionMarathi: 'श्री साईबाबा पालखी सोहळा, महापूजा आणि गाव भोजन महाप्रसाद.',
      eventDate: new Date('2026-05-15'),
      startDate: new Date('2026-05-15'),
      endDate: new Date('2026-05-16'),
      year: 2026,
      targetAmount: 35000.00,
      status: EventStatus.COMPLETED,
      isPublic: true,
    }
  });

  // 10. Seed Festival Contributions for Completed Event
  const donors = [
    { name: 'संतोष कदम', amount: 2000.00, memberId: memberRecords[0].id },
    { name: 'रमेश पाटील', amount: 1500.00, memberId: memberRecords[1].id },
    { name: 'श्री. विठ्ठल सुर्वे (ग्रामस्थ - मुंबई)', amount: 5000.00, memberId: null, type: ContributorType.OUTSIDE_PERSON },
    { name: 'श्री. गजानन जोशी (दानशूर)', amount: 2500.00, memberId: null, type: ContributorType.OUTSIDE_PERSON },
  ];

  for (let i = 0; i < donors.length; i++) {
    const d = donors[i];
    const fc = await prisma.festivalContribution.create({
      data: {
        eventId: saiEvent.id,
        memberId: d.memberId,
        contributorName: d.name,
        contributorType: d.type || ContributorType.MEMBER,
        amount: d.amount,
        paymentDate: new Date('2026-05-10'),
        paymentMethod: PaymentMethod.UPI,
        receiptNumber: `FEST-2026-${String(i + 1).padStart(4, '0')}`,
        status: RecordStatus.CONFIRMED,
        isPublic: true,
        createdBy: adminUser.id,
      }
    });

    await prisma.financialTransaction.create({
      data: {
        transactionType: TransactionType.INCOME,
        sourceType: SourceType.FESTIVAL_CONTRIBUTION,
        sourceId: fc.id,
        amount: d.amount,
        transactionDate: fc.paymentDate,
        description: `उत्सव वर्गणी (${saiEvent.nameMarathi}): ${d.name}`,
        paymentMethod: fc.paymentMethod,
        status: RecordStatus.CONFIRMED,
        createdBy: adminUser.id,
      }
    });
  }

  // 11. Seed Expenses
  const sampleExpenses = [
    {
      categoryId: createdCategories['Religious Materials'],
      title: 'Puja Samagri for Palkhi',
      titleMarathi: 'पालखी सोहळा पूजा साहित्य व हार-फुले',
      amount: 3200.00,
      expenseDate: new Date('2026-05-14'),
      vendorName: 'श्री स्वामी पूजा भांडार',
      paymentMethod: PaymentMethod.CASH,
    },
    {
      categoryId: createdCategories['Prasad & Food'],
      title: 'Mahaprasad Groceries',
      titleMarathi: 'महाप्रसाद किराणा माल व धान्य',
      amount: 14500.00,
      expenseDate: new Date('2026-05-15'),
      vendorName: 'राणे ट्रेडर्स, खेड',
      paymentMethod: PaymentMethod.BANK_TRANSFER,
    },
    {
      categoryId: createdCategories['Sound System'],
      title: 'Sound System for Bhajan',
      titleMarathi: 'भजन व पालखी ध्वनी व्यवस्था',
      amount: 4000.00,
      expenseDate: new Date('2026-05-16'),
      vendorName: 'ओमकार साऊंड्स',
      paymentMethod: PaymentMethod.UPI,
    }
  ];

  for (const exp of sampleExpenses) {
    const createdExp = await prisma.expense.create({
      data: {
        categoryId: exp.categoryId,
        title: exp.title,
        titleMarathi: exp.titleMarathi,
        amount: exp.amount,
        expenseDate: exp.expenseDate,
        vendorName: exp.vendorName,
        paymentMethod: exp.paymentMethod,
        status: RecordStatus.CONFIRMED,
        isPublic: true,
        createdBy: adminUser.id,
      }
    });

    await prisma.financialTransaction.create({
      data: {
        transactionType: TransactionType.EXPENSE,
        sourceType: SourceType.EXPENSE,
        sourceId: createdExp.id,
        amount: exp.amount,
        transactionDate: exp.expenseDate,
        description: `खर्च: ${exp.titleMarathi} (${exp.vendorName})`,
        paymentMethod: exp.paymentMethod,
        status: RecordStatus.CONFIRMED,
        createdBy: adminUser.id,
      }
    });
  }

  // 12. Seed Meetings
  await prisma.meeting.create({
    data: {
      meetingTitle: 'Annual General Meeting 2026',
      meetingTitleMarathi: 'वार्षिक सर्वसाधारण ग्रामस्थ सभा २०२६',
      meetingDate: new Date('2026-06-07'),
      location: 'श्री साईबाबा मंदिर सभागृह, साखर चौकीचीवाडी',
      descriptionMarathi: 'वार्षिक जमा-खर्च आढावा आणि आगामी गणेशोत्सव नियोजन.',
      agendaMarathi: '१. मागील सभेचे इतिवृत्त वाचन\n२. वार्षिक जमा-खर्च सादर करणे\n३. श्री गणेशोत्सव २०२६ नियोजन व समिती स्थापना\n४. मंदिर परिसर स्वच्छता व दुरुस्ती',
      decisionsMarathi: '१. वार्षिक हिशोब सर्वानुमते मंजूर करण्यात आला.\n२. गणेशोत्सवासाठी युवा ग्रुपकडे व्यवस्थापनाची जबाबदारी देण्यात आली.\n३. वर्गणी संकलन दि. १५ ऑगस्टपासून सुरु करण्याचे ठरले.',
      attendanceCount: 42,
      isPublic: true,
      createdBy: adminUser.id,
    }
  });

  await prisma.meeting.create({
    data: {
      meetingTitle: 'Ganeshotsav Planning Meeting',
      meetingTitleMarathi: 'गणेशोत्सव पूर्वतयारी व नियोजन बैठक',
      meetingDate: new Date('2026-08-10'),
      location: 'साखर चौकीचीवाडी प्राथमिक शाळा प्रांगण',
      descriptionMarathi: 'गणेशोत्सवाची मंडप, डेकोरेशन व प्रसाद वाटप नियोजन बैठक.',
      agendaMarathi: '१. मंडप उभारणी तारीख निश्चिती\n२. वर्गणी पावती पुस्तके वाटप\n३. सांस्कृतिक कार्यक्रम वेळापत्रक',
      decisionsMarathi: '१. दि. १ सप्टेंबरपासून मंडप उभारणी सुरु करणे.\n२. सर्व सभासदांना पावती पुस्तके देण्यात आली.\n३. स्थानिक भजन मंडळांचे कार्यक्रम ठरवण्यात आले.',
      attendanceCount: 35,
      isPublic: true,
      createdBy: adminUser.id,
    }
  });

  // 13. Seed Initial Audit Log
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'SYSTEM_INITIALIZED',
      entityType: 'System',
      entityId: 1,
      newValues: JSON.stringify({ message: 'System database successfully seeded with initial mandal data' }),
      ipAddress: '127.0.0.1',
      userAgent: 'System Seeder',
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
