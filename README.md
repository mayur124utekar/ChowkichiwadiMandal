# चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ, साखर (युवा मंडळ)
### Production Web Application & Community Financial Management Platform

> **नोंदणी क्र.**: महाराष्ट्र/०१३/२०२०/रत्ना. (महाराष्ट्र राज्य)  
> **पत्ता**: साखर चौकीचीवाडी, ता. खेड, जि. रत्नागिरी  
> **बोधवाक्य**: ॥ श्री साईबाबा प्रसन्न ॥

---

## 🌟 Overview

A full-stack, production-grade web application built specifically for **चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ, साखर चौकीचीवाडी (युवा मंडळ)**. The application serves two core experiences:

1. **सार्वजनिक मराठी पोर्टल (Public Marathi Portal)**:
   - High-performance, mobile-first Devanagari typography (`Noto Sans Devanagari`).
   - Saffron orange brand design (`#F97316`) representing traditional Maharashtrian mandal heritage.
   - Live Mandal identity, committee member photo directory (सामान्य & युवा गट), monthly contribution summaries, festival events, public expense transparency, past meeting records, photo gallery, and contact forms.
   - Privacy-safe: Member phone numbers, administrative notes, and internal records are strictly protected and never exposed to the public.

2. **प्रशासक नियंत्रण कक्ष (English Admin Management Panel - `/admin`)**:
   - Secure role-based authentication (`ADMIN`, `EDITOR`) with HTTP-only cookies and bcrypt hashing.
   - Member management with photo upload, groups & dynamic positions.
   - **Monthly Contributions (मासिक वर्गणी)**: Fast recording of ₹200 payments (or configurable target amount) for members & outside donors with receipt tracking.
   - **Festival Contributions (उत्सव वर्गणी)**: Multi-event budgeting and donor tracking.
   - **Expenses Management (खर्च)**: Categorized tracking with vendor bills & receipt attachments.
   - **Double-Entry Financial Ledger**: Automatic atomic posting to `financial_transactions` with status lifecycle (`CONFIRMED`, `VOIDED`).
   - **12-Month Member Contribution Grid**: Month-by-month payment matrix (M1 - M12) with one-click print reports.
   - **Immutable Audit Logs**: Cryptographically logged administrative actions.

---

## 🚀 Technology Stack

- **Backend**: Node.js, Express, TypeScript, Prisma ORM, MySQL 8+ (`utf8mb4`), Zod, Multer, Helmet, CORS, Cookie Parser.
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Google Fonts (`Noto Sans Devanagari` & `Inter`).
- **Database**: Cloud MySQL Database (`db_a95759_chowkichiwadi` on `mysql9001.site4now.net`).

---

## 🔑 Default Administrator Login

| Property | Value |
| :--- | :--- |
| **Admin Panel URL** | `http://localhost:5173/admin/login` |
| **Email** | `admin@chowkichiwadi.org` |
| **Password** | `Admin@12345` |
| **Role** | System Administrator (`ADMIN`) |

*(Password can be updated from Admin Panel -> Settings / Auth)*

---

## 🛠️ Quick Start & Running Locally

### 1. Prerequisites
- Node.js `v20+` or `v22+`
- npm `v10+`

### 2. Start Backend Server
```bash
cd server
npm install
npm run dev
```
*Server starts on `http://localhost:5000` (API: `http://localhost:5000/api/v1`)*

### 3. Start Frontend Client
```bash
cd client
npm install
npm run dev
```
*Frontend opens on `http://localhost:5173`*

---

## 📦 Production Build

```bash
# Build both server and client
npm run build

# Start production server
npm start
```

---

## 🗄️ Database Commands

```bash
# Push Prisma schema to MySQL
cd server
npx prisma db push

# Run Database Seeder
npm run prisma:seed
```

---

## 🏛️ Official Organization Details

- **Mandal Name**: चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ - साखर
- **Registration**: महाराष्ट्र/०१३/२०२०/रत्ना.
- **Location**: साखर चौकीचीवाडी, ता. खेड, जि. रत्नागिरी
- **Logo**: `uploads/branding/logo.jpeg`
