# चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ --- Production-Ready Web Application Specification

## 1. Project Overview

Build a production-ready web application for:

**चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ, साखर चौकीचीवाडी (युवा ग्रुप)**

The organization has two member groups:

1.  **सामान्य / Normal Group**
2.  **युवा / Youth Group (युवा ग्रुप)**

The application will maintain the मंडळ's members, monthly वर्गणी,
festival/event वर्गणी, expenses, meetings, public information, and
related records in a **MySQL database**.

### Primary goals

-   Store all मंडळ data centrally in MySQL.
-   Provide a clean public website where visitors can view information
    in **Marathi**.
-   Provide a secure **English admin panel** for authorized
    administrators.
-   Maintain complete financial records with audit-friendly data.
-   Make monthly collection, festival collection, and expenses easy to
    manage.
-   Show useful financial summaries without exposing unnecessary private
    information.
-   Support member photographs and member positions/designations.
-   Maintain past meeting records.
-   Keep the architecture ready for future features such as online
    payments, notifications, Android app/API, reports, and multiple
    administrators.

------------------------------------------------------------------------

# 2. Technology Stack

## Backend

-   Node.js
-   Express.js
-   JavaScript or TypeScript (TypeScript preferred)
-   REST API architecture
-   MySQL 8+
-   Prisma ORM preferred
-   JWT-based authentication with secure HTTP-only cookies for admin
    sessions
-   bcrypt/argon2 for password hashing
-   Zod/Joi for request validation
-   Helmet
-   CORS
-   express-rate-limit
-   Pino/Winston for structured logging
-   Multer for controlled image uploads

## Frontend

Preferred:

-   React
-   Vite
-   Responsive design
-   Bootstrap 5 or Tailwind CSS

If implementing server-rendered pages instead, use a clean
Express-compatible architecture. React is preferred for maintainability.

## Product UI and Application Architecture Requirements

### Mobile-First Approach

The entire application must be designed **mobile-first**.

This applies to both:

1. Public Marathi website
2. English admin panel

The primary design target should be a modern smartphone screen. Desktop layouts should progressively enhance from the mobile layout rather than the other way around.

Requirements:

- Touch-friendly controls.
- Minimum comfortable tap targets.
- Sticky/mobile-friendly navigation where useful.
- Responsive cards and tables.
- Avoid wide tables that force awkward horizontal scrolling on mobile.
- Financial tables should have a mobile-friendly card/list representation where necessary.
- Forms must be easy to use with a phone.
- Images must be responsive and optimized.
- Admin dashboard must remain fully usable on mobile.
- Do not create separate mobile and desktop applications.

### Single Web Application

The public website and admin panel must be part of the **same web application/project**.

Recommended structure:

```text
/                  -> Public Marathi website
/members           -> Public members
/contributions     -> Public contribution information
/expenses          -> Public expenses
/meetings          -> Public meetings

/admin             -> English admin login/dashboard
/admin/dashboard
/admin/members
/admin/contributions
/admin/events
/admin/expenses
/admin/meetings
/admin/reports
/admin/settings
```

Use the same backend API and database for both.

Do NOT build two unrelated websites.

The application should have clear separation between:

```text
Public UI
Admin UI
Shared API
Shared MySQL database
```

Admin routes must always be protected by authentication and authorization.

### Design Direction

The visual style should be:

**Simple + Sweet + Traditional + Modern + Trustworthy**

Avoid an overly corporate SaaS look.

The website represents a local Hindu/community mandal, so the design should feel respectful and warm while still looking modern.

Do not use excessive gradients, animations, glassmorphism, complicated illustrations, or unnecessary decorative effects.

Prioritize:

- Clean typography
- Good spacing
- Simple cards
- Clear sections
- Strong readability
- Subtle traditional visual touches
- High-quality member/event photographs
- Fast loading

### Primary Brand Color — Hindu/Saffron Orange

Use a **Hindu/saffron orange** as the primary brand color throughout the application.

Recommended starting color:

```text
Primary: #F97316
```

The exact shade should be centralized in theme variables so it can easily be changed later.

Suggested theme:

```text
Primary: #F97316
Primary Dark: #C2410C
Primary Light: #FFF7ED
Background: #FFFBF7
Surface: #FFFFFF
Text: #1F2937
Muted Text: #6B7280
Border: #E5E7EB
Success: #16A34A
Danger: #DC2626
Warning: #D97706
```

Do not hard-code these values throughout components.

Use CSS variables/theme tokens.

Example:

```css
:root {
  --color-primary: #F97316;
  --color-primary-dark: #C2410C;
  --color-primary-light: #FFF7ED;
}
```

The primary orange should be used for:

- Logo accents
- Main buttons
- Active navigation
- Important headings/accent lines
- Links where appropriate
- Financial highlights
- Section icons
- Admin sidebar/header accents

Do not make the entire website orange. Use orange as an accent/primary action color and keep the overall interface light and clean.

### Light Theme

The public website should use a **light theme by default**.

Do not use dark mode as the primary design.

Recommended visual direction:

```text
Warm off-white background
White cards
Saffron/orange accents
Dark readable text
Subtle borders/shadows
```

Admin panel should also use the same light visual language and brand color.

Dark mode is not required for V1.

### Typography

Use a font that has excellent Devanagari support.

Recommended:

```text
Noto Sans Devanagari
```

For English admin UI, the same font family may be used for visual consistency.

Do not use decorative fonts for body content.

Headings can have slightly stronger weight but must remain highly readable.

### Public Mobile Navigation

On mobile, use a simple compact header:

```text
[Logo]  मंडळाचे नाव        [Menu]
```

The navigation drawer/menu should contain:

```text
मुख्यपृष्ठ
मंडळाबद्दल
सदस्य
मासिक वर्गणी
उत्सव वर्गणी
खर्च
सभा नोंद
छायाचित्रे
संपर्क
```

Keep navigation short and easy to understand.

### Admin Mobile Navigation

Admin should use a responsive sidebar:

Desktop:

```text
Sidebar
Dashboard
Members
Contributions
Events
Expenses
Meetings
Reports
Website
Settings
Audit Logs
```

Mobile:

```text
Top bar
[Menu] [Page title] [Profile]
```

Open the navigation as a drawer when the menu button is tapped.

### Public Home Page — Mobile Priority

The mobile homepage should prioritize:

```text
1. Mandal identity/photo
2. About the mandal
3. Groups / members
4. Latest financial summary
5. Latest festival/event
6. Recent meeting
7. Gallery
8. Contact
```

Do not place too many sections above the fold.

Use clear CTA/action buttons where useful.

### Mobile Financial Pages

Financial information must be especially easy to read on mobile.

Instead of forcing a large desktop accounting table onto a phone, use:

```text
महिना
एकूण जमा
एकूण खर्च
शिल्लक
```

as cards/summary blocks.

Detailed records can use compact responsive lists/cards.

Admin financial records may use tables on desktop and cards/stacked records on mobile.

### Mobile Forms

All admin forms must be optimized for touch input.

Examples:

```text
Member Name
[                    ]

Group
[ Select             ]

Position
[ Select             ]

Amount
[ ₹                  ]

Payment Date
[ Date               ]

Payment Method
[ Select             ]

[ Save ]
```

Use appropriate HTML input types:

```text
type="number"
type="date"
type="email"
type="tel"
```

where appropriate.

Avoid tiny controls.

### Public Cards

Use simple rounded cards with subtle shadows/borders.

Member:

```text
┌─────────────────────┐
│       PHOTO         │
│                     │
│ सदस्याचे नाव        │
│ अध्यक्ष             │
└─────────────────────┘
```

Event:

```text
┌─────────────────────┐
│ Event Image         │
│ उत्सवाचे नाव        │
│ तारीख               │
│ वर्गणी: ₹XX,XXX     │
└─────────────────────┘
```

Avoid excessive card decoration.

### Admin UI Design

The admin panel must visually belong to the same mandal website.

Use:

- Same saffron/orange primary color
- Same typography
- Same logo
- Same light theme
- Same spacing principles

However, admin pages should be more information-dense than public pages.

Admin should feel like a practical management system, not a separate SaaS product.

### Responsive Breakpoints

Use standard responsive breakpoints, but do not design exclusively around fixed device sizes.

At minimum:

```text
Mobile: < 768px
Tablet: 768px–1023px
Desktop: >= 1024px
```

Components should naturally adapt between widths.

### Logo / Branding

The mandal logo/image should be configurable from Admin > Website Settings.

Do not hard-code a logo path.

Use:

```text
Mandal Name
Mandal Logo
Mandal Main Image
Primary Color
```

as configurable website settings.

If no logo exists, create a clean text-based fallback using the mandal name.

---

## Deployment

Application must be deployable on:

-   Linux VPS
-   Nginx reverse proxy
-   Node.js process managed by PM2 or systemd
-   MySQL 8+
-   HTTPS using Let's Encrypt

The application must work correctly on desktop, tablet, and mobile, with **mobile-first design as the primary implementation strategy**.

The public website and admin panel are deployed as one web application and use the same backend/API and MySQL database.

------------------------------------------------------------------------

# 3. Language Requirements

## Public Website

The public-facing website must be **Marathi-first / Marathi-only**.

Examples:

-   मंडळाबद्दल
-   सदस्य
-   वर्गणी
-   उत्सव वर्गणी
-   खर्च
-   सभा नोंद
-   संपर्क
-   युवा ग्रुप
-   सामान्य ग्रुप

Do not expose English technical/database terminology on the public
website.

## Admin Panel

The admin panel should be **English**.

Examples:

-   Dashboard
-   Members
-   Monthly Contributions
-   Festival Contributions
-   Expenses
-   Meetings
-   Groups
-   Settings
-   Reports
-   Admin Users
-   Audit Logs

The database may use English table/column names.

------------------------------------------------------------------------

# 4. User Roles

Implement role-based access control.

## ADMIN

Full access:

-   Dashboard
-   Members
-   Groups
-   Monthly contributions
-   Festival contributions
-   Expenses
-   Meetings
-   Public website content
-   Images
-   Admin users
-   Reports
-   Audit logs
-   Settings

## EDITOR (optional but recommended)

Can manage:

-   Members
-   Contributions
-   Festival contributions
-   Expenses
-   Meetings
-   Public content

Cannot:

-   Manage administrators
-   Change critical system settings
-   Delete audit logs

If the project needs only one administrator initially, keep the database
and authorization architecture ready for multiple admins.

------------------------------------------------------------------------

# 5. Public Website Structure

Create a modern, trustworthy, simple community-organization website.

The public website must be **mobile-first**, use a **light theme**, and use **Hindu/saffron orange as the primary accent color**.

The design should be simple, warm, respectful, and community-oriented rather than looking like a generic corporate SaaS website.

## Public routes

``` text
/
 /mandal
 /members
 /members/:id
 /monthly-contributions
 /festival-contributions
 /expenses
 /meetings
 /contact
```

The exact URL names may be English internally, but all visible UI text
should be Marathi.

------------------------------------------------------------------------

# 6. Home / Mandal Information Page

The home page should prominently display:

-   मंडळ logo/image
-   मंडळाचे पूर्ण नाव
-   मंडळाचा फोटो / मुख्य प्रतिमा
-   छोटा परिचय
-   स्थापना वर्ष, if available
-   गाव/ठिकाण
-   सामान्य ग्रुप आणि युवा ग्रुप information
-   प्रमुख उद्दिष्टे
-   प्रमुख उपक्रम
-   संपर्क information, if configured
-   latest meeting
-   latest festival/event
-   financial summary, if administrators enable public visibility

Do not hard-code these values.

Store editable public content in database.

------------------------------------------------------------------------

# 7. Member Management

The organization has two groups.

## Group values

``` text
NORMAL
YOUTH
```

Display names:

``` text
NORMAL -> सामान्य ग्रुप
YOUTH  -> युवा ग्रुप
```

Each member should have:

-   Full name
-   Photo
-   Group
-   Position/designation
-   Mobile number (private by default)
-   Joining date
-   Active/inactive status
-   Display order
-   Short bio (optional)
-   Public visibility
-   Created date
-   Updated date

## Position examples

Do not hard-code positions.

Admin can create/edit positions such as:

-   अध्यक्ष
-   उपाध्यक्ष
-   सचिव
-   सहसचिव
-   खजिनदार
-   सदस्य
-   युवा अध्यक्ष
-   युवा सचिव

The public member page should show:

### सामान्य ग्रुप

Member photo cards:

``` text
[Photo]
Member Name
Position
```

### युवा ग्रुप

Member photo cards:

``` text
[Photo]
Member Name
Position
```

Use responsive cards.

------------------------------------------------------------------------

# 8. Member Privacy

Do NOT publicly expose member mobile numbers unless the administrator
explicitly enables public visibility.

Recommended:

``` text
mobile_number = private
```

Admin can see the mobile number.

Public site should only display:

-   Name
-   Photo
-   Position

Optionally allow a public contact button without revealing the number.

------------------------------------------------------------------------

# 9. Monthly Vargani / वर्गणी

Every member may have a monthly contribution target of:

**₹200 per month**

Do not hard-code ₹200 into business logic.

Store a configurable monthly contribution amount in settings.

Default:

``` text
monthly_contribution_amount = 200
currency = INR
```

## Important requirement

Monthly contribution can be paid by:

1.  Mandal member
2.  Person outside the mandal

Therefore the contribution model must support both.

### Contributor types

``` text
MEMBER
OUTSIDE_PERSON
```

------------------------------------------------------------------------

# 10. Monthly Contribution Database Design

Suggested table:

``` text
monthly_contributions
```

Fields:

``` text
id
member_id nullable
contributor_name
contributor_type
group_id nullable
amount
contribution_month
payment_date
payment_method
receipt_number nullable
notes nullable
is_public
created_by
created_at
updated_at
```

### Rules

If contributor type is MEMBER:

-   member_id should normally be required.

If contributor type is OUTSIDE_PERSON:

-   member_id remains NULL.
-   contributor_name is required.

The system must support partial payments if needed.

Example:

Monthly target = ₹200

Payment:

-   ₹100 on one date
-   ₹100 later

The system should calculate:

``` text
Monthly Expected
Monthly Collected
Monthly Pending
```

Do not assume one payment per member per month.

------------------------------------------------------------------------

# 11. Monthly Contribution Dashboard

Admin should be able to select:

``` text
Year
Month
Group
```

Display:

  Metric               Meaning
  -------------------- -----------------------------------------
  Expected             Expected collection from active members
  Collected            Total received
  Pending              Expected - Collected
  Outside Collection   Contributions from non-members
  Total Collection     Member + outside contributions

For each member:

``` text
Member
Group
Expected
Paid
Pending
Status
```

Status:

``` text
PAID
PARTIAL
PENDING
OVERPAID
```

Use configurable rules.

------------------------------------------------------------------------

# 12. Monthly Contribution Public Page

Public website may show monthly financial information.

Recommended display:

``` text
मासिक वर्गणी

महिना: ऑगस्ट २०२६

एकूण जमा: ₹XX,XXX
```

Do not expose private contributor details unless explicitly marked
public.

Admin setting:

``` text
show_monthly_financial_summary_publicly
```

Default:

``` text
true
```

Detailed member-wise payment status should be private by default.

------------------------------------------------------------------------

# 13. Festival / Event Vargani

Festival contribution is different from monthly contribution.

Examples:

-   गणेशोत्सव
-   नवरात्र
-   यात्रा
-   ग्रामोत्सव
-   धार्मिक कार्यक्रम
-   इतर मंडळाचे कार्यक्रम

Create an `events` table.

Fields:

``` text
id
name
name_marathi
description
description_marathi
event_date
start_date nullable
end_date nullable
year
target_amount nullable
status
is_public
created_at
updated_at
```

------------------------------------------------------------------------

# 14. Festival Contribution Records

Create:

``` text
festival_contributions
```

Fields:

``` text
id
event_id
member_id nullable
contributor_name
contributor_type
amount
payment_date
payment_method
receipt_number nullable
notes nullable
is_public
created_by
created_at
updated_at
```

This must support:

-   Existing members
-   Youth members
-   Normal members
-   Outside donors/contributors

------------------------------------------------------------------------

# 15. Festival Collection Page

Admin dashboard:

``` text
Event
Target
Total Collection
Number of Contributors
Member Collection
Outside Collection
Pending / Remaining
```

Public page:

``` text
उत्सव वर्गणी

उत्सवाचे नाव
दिनांक
एकूण वर्गणी
```

Contributor names should only be displayed if explicitly marked public.

------------------------------------------------------------------------

# 16. Expenses

Create an expense management system.

Each expense should have:

``` text
id
expense_category_id
title
description
amount
expense_date
payment_method
vendor_name nullable
bill_number nullable
receipt_image nullable
notes nullable
is_public
created_by
created_at
updated_at
```

## Expense categories

Do not hard-code.

Admin can create:

-   धार्मिक साहित्य
-   सजावट
-   प्रसाद
-   वीज
-   ध्वनी व्यवस्था
-   कार्यक्रम खर्च
-   प्रवास
-   देखभाल
-   इतर

------------------------------------------------------------------------

# 17. Expense Page

Admin can filter:

``` text
From Date
To Date
Category
Year
Month
```

Display:

``` text
Total Expenses
Category-wise Expenses
Recent Expenses
```

Public page can display:

``` text
खर्च

दिनांक
खर्चाचे कारण
रक्कम
```

Sensitive documents/receipt images should not automatically be public.

Use:

``` text
is_public
```

for expense visibility.

------------------------------------------------------------------------

# 18. Financial Dashboard

Admin dashboard must provide a clear financial overview.

For selected period:

``` text
Total Monthly Contributions
Total Festival Contributions
Other Contributions
Total Income
Total Expenses
Net Balance
```

Formula:

``` text
Total Income =
Monthly Contributions
+ Festival Contributions
+ Other Contributions

Net Balance =
Opening Balance
+ Total Income
- Total Expenses
```

The system must support an opening balance.

Create:

``` text
financial_settings
```

or a proper ledger/opening-balance model.

Do NOT calculate current balance only from the current month.

------------------------------------------------------------------------

# 19. Recommended Ledger Architecture

For production reliability, use a transaction/ledger approach rather
than relying only on summary fields.

Create a financial transaction table:

``` text
financial_transactions
```

Fields:

``` text
id
transaction_type
source_type
source_id nullable
amount
transaction_date
description
payment_method nullable
created_by
created_at
```

Transaction types:

``` text
INCOME
EXPENSE
```

Source types:

``` text
MONTHLY_CONTRIBUTION
FESTIVAL_CONTRIBUTION
OTHER_INCOME
EXPENSE
OPENING_BALANCE
```

This allows future reporting and reconciliation.

The original contribution/expense tables remain the detailed source
records.

Every confirmed financial record should generate the corresponding
ledger entry.

Use database transactions to keep detail records and ledger entries
consistent.

------------------------------------------------------------------------

# 20. Payment Methods

Do not hard-code only cash.

Create configurable payment methods.

Initial values:

``` text
CASH
UPI
BANK_TRANSFER
CHEQUE
OTHER
```

Future-ready:

``` text
ONLINE_PAYMENT
```

------------------------------------------------------------------------

# 21. Receipts

Each financial collection should support an optional receipt number.

Format example:

``` text
MB-2026-000001
```

The exact format should be configurable.

Receipt numbers must be unique.

Do not reuse receipt numbers after deletion.

Prefer soft deletion for financial records.

------------------------------------------------------------------------

# 22. Past Meeting Records

Create meeting management.

Public route:

``` text
/meetings
```

Admin fields:

``` text
id
meeting_title
meeting_title_marathi
meeting_date
location
description
description_marathi
agenda
agenda_marathi
decisions
decisions_marathi
attendance_count nullable
minutes_file nullable
photos nullable
is_public
created_by
created_at
updated_at
```

The meeting page should display:

-   Meeting title
-   Date
-   Location
-   Agenda
-   Important decisions
-   Attendance
-   Photos/documents if public

------------------------------------------------------------------------

# 23. Meeting Minutes

Support uploading meeting minutes as PDF.

Rules:

-   Allowed types: PDF only for minutes.
-   Validate MIME type.
-   Validate file size.
-   Store outside the application source code.
-   Generate safe unique filenames.
-   Never trust the original filename.

------------------------------------------------------------------------

# 24. Image Management

Support:

-   Mandal main image
-   Member photos
-   Meeting photos
-   Event photos
-   Gallery images

Use image validation.

Recommended:

-   JPEG
-   PNG
-   WebP

Recommended max upload size:

``` text
5 MB per image
```

Generate optimized thumbnails.

Never trust file extensions alone.

------------------------------------------------------------------------

# 25. Admin Dashboard

The admin panel is part of the same web application as the public website and should be accessible under `/admin`.

Dashboard should show:

### Current month

``` text
Monthly Expected
Monthly Collected
Monthly Pending
```

### Current year

``` text
Monthly Collection
Festival Collection
Other Income
Total Expenses
Net Balance
```

### Members

``` text
Total Members
Normal Group
Youth Group
Active Members
Inactive Members
```

### Recent activity

Show:

-   Latest contribution
-   Latest expense
-   Latest meeting
-   Latest event

------------------------------------------------------------------------

# 26. Admin Navigation

Use:

``` text
Dashboard

Members
  - All Members
  - Add Member
  - Groups
  - Positions

Contributions
  - Monthly Contributions
  - Festival Contributions
  - Events

Expenses
  - Expenses
  - Categories

Meetings

Financial Reports

Public Website
  - Mandal Information
  - Homepage
  - Gallery
  - Contact

Settings
  - General
  - Contribution Settings
  - Payment Methods
  - Public Visibility

Admin Users

Audit Logs
```

------------------------------------------------------------------------

# 27. Admin CRUD Requirements

Every major entity must support:

-   Create
-   Read
-   Update
-   Soft Delete where appropriate
-   Search
-   Filtering
-   Pagination
-   Sorting

Financial records should generally NOT be hard deleted.

Use:

``` text
deleted_at
deleted_by
deletion_reason
```

------------------------------------------------------------------------

# 28. Audit Logs

Create:

``` text
audit_logs
```

Fields:

``` text
id
user_id
action
entity_type
entity_id
old_values JSON nullable
new_values JSON nullable
ip_address nullable
user_agent nullable
created_at
```

Track:

-   Login
-   Logout
-   Create
-   Update
-   Delete/restore
-   Financial record changes
-   Settings changes
-   Admin user changes

Never allow normal admins to modify/delete audit logs.

------------------------------------------------------------------------

# 29. Authentication

Admin login:

``` text
POST /api/auth/login
```

Requirements:

-   Password hashing using Argon2id or bcrypt.
-   HTTP-only secure cookie/session or short-lived JWT + secure refresh
    strategy.
-   Rate limit login endpoint.
-   Account lockout/backoff after repeated failures.
-   CSRF protection if cookie-based authentication is used.
-   Password reset architecture should be future-ready.
-   Never store plaintext passwords.
-   Never log passwords or authentication tokens.

------------------------------------------------------------------------

# 30. API Structure

Use versioned API:

``` text
/api/v1
```

Examples:

``` text
/api/v1/auth
/api/v1/members
/api/v1/groups
/api/v1/positions
/api/v1/monthly-contributions
/api/v1/events
/api/v1/festival-contributions
/api/v1/expenses
/api/v1/expense-categories
/api/v1/meetings
/api/v1/reports
/api/v1/settings
/api/v1/audit-logs
```

Public APIs:

``` text
/api/v1/public/mandal
/api/v1/public/members
/api/v1/public/monthly-summary
/api/v1/public/events
/api/v1/public/festival-contributions
/api/v1/public/expenses
/api/v1/public/meetings
```

Do not expose admin APIs publicly without authentication and
authorization.

------------------------------------------------------------------------

# 31. API Response Standard

Use a consistent response structure.

Success:

``` json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

Error:

``` json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": []
  }
}
```

Never expose stack traces in production.

------------------------------------------------------------------------

# 32. Database Schema

Recommended core tables:

``` text
admin_users
groups
positions
members
monthly_contributions
events
festival_contributions
expense_categories
expenses
financial_transactions
meetings
media
site_settings
audit_logs
```

Optional:

``` text
admin_sessions
password_reset_tokens
notification_settings
```

------------------------------------------------------------------------

# 33. Groups Table

``` text
groups
------
id
name
name_marathi
code
description
display_order
is_active
created_at
updated_at
```

Seed:

``` text
NORMAL | सामान्य ग्रुप
YOUTH  | युवा ग्रुप
```

------------------------------------------------------------------------

# 34. Positions Table

``` text
positions
---------
id
name
name_marathi
group_id nullable
display_order
is_active
created_at
updated_at
```

A position can optionally be restricted to a group.

------------------------------------------------------------------------

# 35. Members Table

``` text
members
-------
id
group_id
position_id nullable
full_name
full_name_marathi nullable
photo_media_id nullable
mobile_number nullable
joining_date nullable
bio nullable
bio_marathi nullable
display_order
is_active
is_public
created_at
updated_at
deleted_at nullable
deleted_by nullable
```

Use UTF-8 / `utf8mb4` everywhere.

------------------------------------------------------------------------

# 36. Important Database Constraints

Implement:

-   Foreign keys
-   Appropriate indexes
-   Unique receipt numbers
-   Unique admin usernames/emails
-   Check amount \> 0 where supported
-   Valid group relationships
-   Soft-delete-safe queries

Recommended indexes:

``` text
members(group_id)
members(is_active)
members(is_public)

monthly_contributions(member_id)
monthly_contributions(contribution_month)
monthly_contributions(payment_date)

festival_contributions(event_id)
festival_contributions(payment_date)

expenses(expense_date)
expenses(expense_category_id)

financial_transactions(transaction_date)
financial_transactions(transaction_type)

meetings(meeting_date)
```

------------------------------------------------------------------------

# 37. Money Handling

Never use JavaScript floating-point numbers for financial calculations.

Use:

``` text
DECIMAL(12,2)
```

in MySQL.

Amounts must be represented as decimal values.

Example:

``` text
200.00
1500.00
```

Avoid:

``` text
FLOAT
DOUBLE
```

for money.

------------------------------------------------------------------------

# 38. Date Handling

Store dates consistently.

For financial records:

``` text
DATE
```

For timestamps:

``` text
DATETIME
```

The application timezone should be configurable.

Default timezone:

``` text
Asia/Kolkata
```

Do not rely blindly on server timezone.

------------------------------------------------------------------------

# 39. Monthly Contribution Logic

A member's expected amount should be calculated based on:

``` text
active member
x
monthly contribution amount
x
eligible months
```

Do not create thousands of unnecessary records just to represent
"pending" payments unless required.

Pending can be calculated from expected minus actual payments.

However, if the organization needs monthly status snapshots, a separate
monthly obligation table can be introduced:

``` text
monthly_contribution_obligations
```

This is preferred for a mature implementation.

Suggested fields:

``` text
id
member_id
year
month
expected_amount
paid_amount
status
created_at
updated_at
```

Unique constraint:

``` text
(member_id, year, month)
```

------------------------------------------------------------------------

# 40. Handling Member Changes

If a member changes group:

-   Historical contribution records must remain unchanged.
-   New contributions use the member's current group unless explicitly
    overridden.
-   Reports must preserve historical data.

Never rewrite old financial records because a member changed group.

------------------------------------------------------------------------

# 41. Handling Member Inactivation

When a member becomes inactive:

-   Keep historical records.
-   Do not include them in future expected monthly contributions.
-   Continue showing historical payments in reports.

Use:

``` text
is_active = false
```

rather than deleting the member.

------------------------------------------------------------------------

# 42. Financial Corrections

Do not silently overwrite financial history.

For corrections:

-   Update with audit log, or
-   Prefer reversal + corrected transaction for finalized financial
    records.

Recommended lifecycle:

``` text
DRAFT
CONFIRMED
VOIDED
```

Only confirmed transactions affect financial reports.

------------------------------------------------------------------------

# 43. Public Financial Transparency

Create settings:

``` text
public_show_monthly_summary
public_show_festival_summary
public_show_expense_list
public_show_member_names
public_show_contributor_names
```

Defaults:

``` text
monthly summary = ON
festival summary = ON
expense list = ON
member names = ON
contributor names = OFF
```

The administrator can change these settings.

------------------------------------------------------------------------

# 44. Marathi UI

Use proper Unicode.

Database:

``` text
utf8mb4
utf8mb4_unicode_ci
```

Frontend must correctly render Devanagari.

Use a high-quality Devanagari web font.

Recommended:

``` text
Noto Sans Devanagari
```

Do not convert Marathi text into images.

------------------------------------------------------------------------

# 45. Marathi Public Navigation

Suggested:

``` text
मुख्यपृष्ठ
मंडळाबद्दल
सदस्य
मासिक वर्गणी
उत्सव वर्गणी
खर्च
सभा नोंद
छायाचित्रे
संपर्क
```

Footer:

``` text
© चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ
साखर चौकीचीवाडी
```

Do not invent village/location information beyond what the administrator
enters.

------------------------------------------------------------------------

# 46. Public Member UI

Desktop:

-   3--5 cards per row depending on screen size.

Tablet:

-   2--3 cards.

Mobile:

-   2 cards where readable, otherwise 1--2.

Member card:

``` text
[PHOTO]

नाव
पद
```

Use lazy loading for images.

------------------------------------------------------------------------

# 47. Public Financial UI

Do not make the website look like an accounting application.

Use simple cards:

``` text
एकूण जमा
एकूण खर्च
शिल्लक
```

Then tables/lists for details.

Use Marathi currency formatting:

``` text
₹ 1,00,000
```

Use Indian number formatting.

------------------------------------------------------------------------

# 48. Reports

Admin reports:

## Monthly Collection Report

Filters:

``` text
Year
Month
Group
Member
```

Export:

``` text
CSV
Excel
PDF (optional)
```

## Festival Collection Report

Filters:

``` text
Event
Year
Contributor Type
Group
```

## Expense Report

Filters:

``` text
Date range
Category
Payment method
```

## Annual Financial Report

Show:

``` text
Opening Balance
Monthly Contributions
Festival Contributions
Other Income
Total Income
Expenses
Closing Balance
```

Formula:

``` text
Closing Balance =
Opening Balance
+ Total Income
- Total Expenses
```

------------------------------------------------------------------------

# 49. Dashboard Charts

Use charts only where useful.

Recommended:

-   Monthly collection by month
-   Monthly expenses by month
-   Income vs expense
-   Group-wise contribution
-   Festival collection

Do not overuse charts.

------------------------------------------------------------------------

# 50. Search and Filtering

Members:

``` text
Search name
Group
Position
Active/inactive
```

Contributions:

``` text
Month
Year
Member
Group
Contributor type
Payment method
```

Expenses:

``` text
Date
Category
Payment method
```

Meetings:

``` text
Year
Date
Search title
```

------------------------------------------------------------------------

# 51. Pagination

Do not load unlimited database rows.

Default:

``` text
20 or 25 records per page
```

Allow:

``` text
25
50
100
```

for admin lists.

------------------------------------------------------------------------

# 52. File Storage

Do not store large binary images directly inside MySQL unless there is a
strong reason.

Preferred:

``` text
MySQL -> metadata
Filesystem/Object Storage -> actual files
```

Example:

``` text
/uploads/members/
/uploads/events/
/uploads/meetings/
/uploads/receipts/
```

For future scalability, abstract storage behind a service so it can
later use S3-compatible storage.

------------------------------------------------------------------------

# 53. Image Processing

When uploading member photos:

1.  Validate MIME.
2.  Validate file size.
3.  Decode image.
4.  Strip unnecessary metadata.
5.  Resize large dimensions.
6.  Generate WebP/JPEG optimized version.
7.  Generate thumbnail.
8.  Save safe generated filename.

Never trust user-provided filename.

------------------------------------------------------------------------

# 54. Security Requirements

Must implement:

-   Helmet
-   Rate limiting
-   Input validation
-   SQL injection protection via ORM/parameterized queries
-   XSS protection
-   CSRF protection where applicable
-   Secure cookies
-   Authentication middleware
-   Authorization middleware
-   File upload validation
-   Request body size limits
-   CORS allowlist
-   Secure HTTP headers
-   Password hashing
-   Audit logs
-   Production error handling
-   No secrets in source code

------------------------------------------------------------------------

# 55. Environment Variables

Create:

``` text
.env
.env.example
```

Example:

``` env
NODE_ENV=production
PORT=3000

DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/mandal_db

JWT_SECRET=CHANGE_ME
SESSION_SECRET=CHANGE_ME

APP_URL=https://example.com
API_URL=https://example.com/api

UPLOAD_DIR=./uploads

MAX_UPLOAD_SIZE_MB=5

TZ=Asia/Kolkata
```

Never commit `.env`.

------------------------------------------------------------------------

# 56. Project Structure

Recommended:

``` text
mandal-management/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── jobs/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
├── uploads/
├── backups/
├── .env.example
├── .gitignore
├── README.md
└── docker-compose.yml
```

------------------------------------------------------------------------

# 57. Recommended Backend Architecture

Use:

``` text
Route
  ↓
Authentication / Authorization
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Repository / Prisma
  ↓
MySQL
```

Business logic must NOT be placed directly inside route files.

Financial calculations should live in services.

------------------------------------------------------------------------

# 58. Database Transactions

Use database transactions for operations such as:

### Record contribution

``` text
Create contribution
+
Create financial transaction
+
Create audit log
```

All must succeed or all must roll back.

### Record expense

``` text
Create expense
+
Create financial transaction
+
Create audit log
```

Use MySQL transaction isolation appropriate for the operation.

------------------------------------------------------------------------

# 59. Prevent Double Financial Posting

A confirmed financial source record must not create duplicate ledger
entries.

Use a unique relationship between:

``` text
source_type
source_id
```

where appropriate.

Before creating a ledger entry, verify that one does not already exist.

------------------------------------------------------------------------

# 60. Admin Confirmation

For financial records, provide:

``` text
Save Draft
Confirm Payment
Void
```

Only confirmed records affect public financial summaries and final
reports.

If the project is intentionally kept simpler, creation can directly
confirm the transaction, but the service layer should still support a
status field.

------------------------------------------------------------------------

# 61. Backup Strategy

Production deployment must have automated MySQL backups.

Recommended:

``` text
Daily backup
Weekly backup retention
Monthly backup retention
```

At minimum:

``` text
mysqldump
```

Store backups outside the primary application directory/server when
possible.

Document restore procedure in README.

------------------------------------------------------------------------

# 62. Logging

Use structured logs.

Log:

-   Request ID
-   HTTP method
-   Route
-   Response status
-   Duration
-   User ID when authenticated
-   Error details

Do NOT log:

-   Passwords
-   Tokens
-   Sensitive personal information
-   Full payment credentials

------------------------------------------------------------------------

# 63. Error Handling

Create centralized Express error middleware.

Production response:

``` json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Something went wrong"
  }
}
```

Development may include stack trace.

Production must not.

------------------------------------------------------------------------

# 64. Validation

Validate all input server-side.

Examples:

``` text
amount > 0
date valid
member exists
event exists
group exists
position exists
receipt number unique
```

Never trust frontend validation alone.

------------------------------------------------------------------------

# 65. API Authorization

Public endpoints:

``` text
GET only
```

Admin endpoints:

``` text
GET
POST
PUT/PATCH
DELETE/restore
```

depending on permission.

Never depend on frontend route hiding for security.

------------------------------------------------------------------------

# 66. SEO

The public website should be SEO-friendly.

Implement:

-   Semantic HTML
-   Proper title
-   Meta description
-   Open Graph metadata
-   Canonical URL
-   Sitemap
-   robots.txt
-   Fast page loading
-   Mobile-friendly layout
-   Marathi content rendered as actual HTML text
-   Descriptive image alt text

Suggested homepage title:

``` text
चौकीचीवाडी अध्यात्म ग्रामस्थ मंडळ | साखर चौकीचीवाडी
```

The actual title should be editable through admin settings.

------------------------------------------------------------------------

# 67. Accessibility

Implement:

-   Proper heading hierarchy
-   Keyboard navigation
-   Accessible buttons
-   Labels for inputs
-   Alt text
-   Sufficient contrast
-   Focus states
-   Responsive text
-   Screen-reader-friendly tables

------------------------------------------------------------------------

# 68. Public Website Performance

Implement:

-   Image lazy loading
-   Responsive images
-   WebP where possible
-   Pagination
-   API caching where safe
-   Compression
-   Gzip/Brotli through Nginx
-   Avoid unnecessary JavaScript

Public pages should remain fast on mobile networks.

------------------------------------------------------------------------

# 69. Admin UX

Admin UI should be practical rather than decorative.

Every data-entry screen should have:

-   Clear form labels
-   Required field indicator
-   Validation messages
-   Save
-   Cancel
-   Confirmation for destructive actions
-   Success/error toast
-   Loading state
-   Empty state

For financial forms:

``` text
Amount
Date
Contributor
Payment method
Receipt number
Notes
```

should be easy to enter quickly.

------------------------------------------------------------------------

# 70. Confirmation Dialogs

For destructive actions:

``` text
Are you sure you want to delete this member?
```

For financial voiding:

``` text
Are you sure you want to void this transaction?
This action will be recorded in the audit log.
```

Do not use browser `confirm()` for the production UI; use a proper
modal.

------------------------------------------------------------------------

# 71. Public Data Safety

Never expose:

-   Admin usernames
-   Admin emails
-   Password hashes
-   Audit logs
-   Internal IDs unnecessarily
-   Private mobile numbers
-   Private notes
-   Receipt documents marked private

Public API should explicitly select allowed fields rather than returning
entire database objects.

------------------------------------------------------------------------

# 72. Seed Data

Create seed script containing:

Groups:

``` text
सामान्य ग्रुप
युवा ग्रुप
```

Payment methods:

``` text
Cash
UPI
Bank Transfer
Cheque
Other
```

Basic expense categories.

Initial admin should be created through an environment-controlled
bootstrap command or secure setup flow.

Do not ship a hard-coded production password.

------------------------------------------------------------------------

# 73. Admin Initial Setup

Create command such as:

``` bash
npm run admin:create
```

Prompt for:

``` text
Name
Email/Username
Password
```

Hash password before storing.

------------------------------------------------------------------------

# 74. Testing Requirements

Implement tests for critical functionality.

## Unit tests

Test:

-   Monthly contribution calculations
-   Pending calculations
-   Festival totals
-   Expense totals
-   Net balance
-   Status calculation
-   Permission checks

## Integration tests

Test:

-   Login
-   Member creation
-   Monthly contribution creation
-   Festival contribution creation
-   Expense creation
-   Ledger posting
-   Meeting creation
-   Public API access
-   Unauthorized admin access

## Critical financial test

For any financial transaction:

``` text
Detailed record exists
AND
Ledger entry exists
AND
Both refer to the same amount
```

------------------------------------------------------------------------

# 75. Example Monthly Calculation

Assume:

``` text
Active members = 50
Monthly amount = ₹200
```

Expected:

``` text
50 × ₹200 = ₹10,000
```

If received:

``` text
₹8,400
```

Pending:

``` text
₹1,600
```

If an outside person contributes:

``` text
₹500
```

Then:

``` text
Member collection = ₹8,400
Outside collection = ₹500
Total collection = ₹8,900
```

Outside contributions must NOT increase member expected amount.

------------------------------------------------------------------------

# 76. Example Financial Calculation

Suppose:

``` text
Opening Balance = ₹20,000
Monthly Contributions = ₹40,000
Festival Contributions = ₹25,000
Other Income = ₹5,000
Expenses = ₹30,000
```

Then:

``` text
Total Income = ₹70,000

Closing Balance =
₹20,000
+ ₹70,000
- ₹30,000

= ₹60,000
```

All financial calculations must be performed server-side.

------------------------------------------------------------------------

# 77. Public Home Page Suggested Layout

``` text
------------------------------------------------
Header
Logo + मंडळाचे नाव
Navigation
------------------------------------------------

Hero
मंडळाचे मुख्य छायाचित्र
मंडळाचे नाव
छोटा परिचय

------------------------------------------------

मंडळाबद्दल
संक्षिप्त माहिती

------------------------------------------------

आमचे सदस्य
सामान्य ग्रुप | युवा ग्रुप

------------------------------------------------

आर्थिक माहिती
एकूण जमा | एकूण खर्च | शिल्लक

------------------------------------------------

अलीकडील सभा

------------------------------------------------

उत्सव / कार्यक्रम

------------------------------------------------

छायाचित्रे

------------------------------------------------

Footer
```

------------------------------------------------------------------------

# 78. Admin Dashboard Suggested Layout

``` text
Sidebar

Dashboard
Members
Contributions
Events
Expenses
Meetings
Reports
Website
Settings
Audit Logs

Main:

[Members] [This Month Collection] [Expenses] [Balance]

Monthly Collection Chart

Income vs Expense

Recent Contributions

Recent Expenses

Upcoming/Recent Meetings
```

------------------------------------------------------------------------

# 79. Important Business Rules

1.  ₹200 is configurable, not hard-coded.
2.  Both groups must be supported.
3.  Members can contribute monthly.
4.  Non-members can contribute.
5.  Festival contributions are separate from monthly contributions.
6.  Expenses are separate financial records.
7.  Every confirmed financial record must be reflected in the ledger.
8.  Historical financial records must not change when member
    group/position changes.
9.  Inactive members remain in historical reports.
10. Financial records should not be permanently deleted.
11. Public/private visibility must be configurable.
12. Mobile numbers must remain private by default.
13. Marathi is the public language.
14. English is the admin language.
15. All money must use DECIMAL, never FLOAT/DOUBLE.
16. All database text must support Marathi using utf8mb4.
17. All important changes must be auditable.
18. Public API must expose only explicitly approved fields.

------------------------------------------------------------------------

# 80. Future-Ready Features

Design the architecture so the following can be added later without
major rewrites:

-   Android app
-   Online payment gateway
-   UPI payment links
-   Automatic payment receipts
-   WhatsApp/SMS notifications
-   Email notifications
-   Member login
-   Member self-service
-   Digital ID cards
-   QR-based contribution receipts
-   Online meeting attendance
-   Event registration
-   Multiple mandals
-   Cloud object storage
-   Multi-language public website
-   Advanced accounting
-   Role-specific permissions

Do NOT implement these unless requested. Only keep the architecture
extensible.

------------------------------------------------------------------------

# 81. Recommended REST Endpoints

## Auth

``` text
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
POST   /api/v1/auth/change-password
```

## Members

``` text
GET    /api/v1/members
GET    /api/v1/members/:id
POST   /api/v1/members
PATCH  /api/v1/members/:id
DELETE /api/v1/members/:id
POST   /api/v1/members/:id/restore
```

## Groups

``` text
GET    /api/v1/groups
POST   /api/v1/groups
PATCH  /api/v1/groups/:id
```

## Positions

``` text
GET    /api/v1/positions
POST   /api/v1/positions
PATCH  /api/v1/positions/:id
```

## Monthly Contributions

``` text
GET    /api/v1/monthly-contributions
POST   /api/v1/monthly-contributions
GET    /api/v1/monthly-contributions/:id
PATCH  /api/v1/monthly-contributions/:id
POST   /api/v1/monthly-contributions/:id/confirm
POST   /api/v1/monthly-contributions/:id/void
```

## Events

``` text
GET    /api/v1/events
POST   /api/v1/events
GET    /api/v1/events/:id
PATCH  /api/v1/events/:id
```

## Festival Contributions

``` text
GET    /api/v1/festival-contributions
POST   /api/v1/festival-contributions
PATCH  /api/v1/festival-contributions/:id
POST   /api/v1/festival-contributions/:id/confirm
POST   /api/v1/festival-contributions/:id/void
```

## Expenses

``` text
GET    /api/v1/expenses
POST   /api/v1/expenses
GET    /api/v1/expenses/:id
PATCH  /api/v1/expenses/:id
POST   /api/v1/expenses/:id/confirm
POST   /api/v1/expenses/:id/void
```

## Meetings

``` text
GET    /api/v1/meetings
POST   /api/v1/meetings
GET    /api/v1/meetings/:id
PATCH  /api/v1/meetings/:id
DELETE /api/v1/meetings/:id
```

## Reports

``` text
GET /api/v1/reports/dashboard
GET /api/v1/reports/monthly-contributions
GET /api/v1/reports/festival-contributions
GET /api/v1/reports/expenses
GET /api/v1/reports/financial-summary
```

------------------------------------------------------------------------

# 82. Public API Endpoints

``` text
GET /api/v1/public/mandal
GET /api/v1/public/members
GET /api/v1/public/members/:id
GET /api/v1/public/monthly-summary
GET /api/v1/public/events
GET /api/v1/public/events/:id
GET /api/v1/public/festival-contributions
GET /api/v1/public/expenses
GET /api/v1/public/meetings
GET /api/v1/public/gallery
```

Public APIs should support pagination and caching where appropriate.

------------------------------------------------------------------------

# 83. Database Migration Requirements

Use Prisma migrations.

Never manually edit production database schema without a migration.

Commands:

``` bash
npx prisma migrate dev
npx prisma migrate deploy
npx prisma generate
```

Production deployment must run migrations safely.

------------------------------------------------------------------------

# 84. Docker Development Setup

Provide optional:

``` text
docker-compose.yml
```

Services:

``` text
mysql
backend
frontend
```

For production, Nginx should sit in front of the application.

------------------------------------------------------------------------

# 85. Environment Separation

Support:

``` text
development
test
production
```

Never use production credentials in development.

------------------------------------------------------------------------

# 86. Definition of Done

The project is complete only when:

### Database

-   [ ] All core tables implemented.
-   [ ] Foreign keys implemented.
-   [ ] Indexes implemented.
-   [ ] Migrations working.
-   [ ] Seed data working.
-   [ ] Marathi UTF-8 tested.

### Backend

-   [ ] REST API implemented.
-   [ ] Authentication implemented.
-   [ ] Authorization implemented.
-   [ ] Validation implemented.
-   [ ] Error handling implemented.
-   [ ] Financial transaction consistency implemented.
-   [ ] Audit logging implemented.
-   [ ] File upload security implemented.

### Admin

-   [ ] Login works.
-   [ ] Dashboard works.
-   [ ] Members CRUD works.
-   [ ] Group/position management works.
-   [ ] Monthly contributions work.
-   [ ] Festival contributions work.
-   [ ] Expenses work.
-   [ ] Meetings work.
-   [ ] Reports work.
-   [ ] Settings work.
-   [ ] Audit logs work.

### Public website

-   [ ] Marathi UI.
-   [ ] Mandal information.
-   [ ] Member list with photos and positions.
-   [ ] Normal and Youth group separation.
-   [ ] Monthly contribution summary.
-   [ ] Festival contribution summary.
-   [ ] Expense list.
-   [ ] Meeting history.
-   [ ] Gallery.
-   [ ] Responsive mobile UI.
-   [ ] SEO metadata.
-   [ ] Accessibility basics.

### Production

-   [ ] HTTPS ready.
-   [ ] Environment variables.
-   [ ] Secure cookies/auth.
-   [ ] Rate limiting.
-   [ ] CORS.
-   [ ] Security headers.
-   [ ] Logging.
-   [ ] Backup documentation.
-   [ ] Error monitoring hooks.
-   [ ] No secrets committed.
-   [ ] No debug mode in production.

------------------------------------------------------------------------

# 87. Implementation Instructions for Codex

Build this as a **real production application**, not a demo.

Before coding:

1.  Inspect the repository.
2.  If an existing Node/Express/MySQL project exists, preserve useful
    existing architecture.
3.  Do not unnecessarily rewrite working code.
4.  Identify whether frontend already exists.
5.  Create/modify database schema using migrations.
6.  Create seed data.
7.  Implement backend services first.
8.  Implement authentication and authorization.
9.  Implement financial transaction consistency.
10. Implement admin UI.
11. Implement public Marathi UI.
12. Add tests.
13. Add deployment documentation.
14. Run lint/build/test commands.
15. Fix all errors before finishing.

------------------------------------------------------------------------

# 88. Coding Quality Requirements

Use:

-   Clear naming
-   Small reusable services
-   Centralized validation
-   Centralized error handling
-   Reusable pagination
-   Reusable API response helpers
-   Reusable permission middleware
-   Reusable file upload service
-   Reusable financial transaction service

Avoid:

-   Duplicate business logic
-   Hard-coded ₹200
-   Hard-coded member groups in frontend
-   Hard-coded positions
-   Direct SQL string concatenation
-   Secrets in code
-   Returning entire database records to public API
-   Permanent deletion of financial records
-   Business logic inside React components
-   Business logic inside route handlers

------------------------------------------------------------------------

# 89. UX Priority

The most important admin workflow is:

``` text
Select member
→ Select month
→ Enter amount
→ Select payment method
→ Save/Confirm
```

Festival workflow:

``` text
Select event
→ Enter contributor
→ Enter amount
→ Payment method
→ Save/Confirm
```

Expense workflow:

``` text
Select category
→ Enter reason
→ Enter amount
→ Date
→ Payment method
→ Upload receipt if available
→ Save/Confirm
```

Make these workflows extremely fast for mobile and desktop admin use.

------------------------------------------------------------------------

# 90. Final Architecture Principle

Treat this system as a **small community financial + membership
management platform**, not just a website.

The public website is the presentation layer.

The admin panel is the management layer.

MySQL is the source of truth.

The financial ledger is the accounting consistency layer.

Audit logs provide accountability.

The architecture must allow future Android/mobile clients to consume the
same `/api/v1` backend.

Most importantly:

**Do not lose historical financial data.**

**Do not expose private member information publicly.**

**Do not hard-code business rules that administrators may need to
change.**

**Do not allow financial detail records and ledger records to become
inconsistent.**

Build the first version cleanly enough that it can remain in production
for years.
