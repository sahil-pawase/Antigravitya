# Career Transformer — EdTech Platform

> **Tagline:** *Transform Your Skills. Build Your Career.*  
> **Specialization:** Production-Ready Data Analytics Education & Career Preparation (Excel, SQL, Power BI, Tableau, Python, Applied Statistics).

---

## 🌟 Executive Overview

**Career Transformer** is a full-stack, scalable, production-grade EdTech web application designed for high-intent learners (college students, freshers, working professionals, and career switchers) aiming for high-growth analytical positions.

Unlike superficial video tutorials or generic coaching institutes, Career Transformer emphasizes:
1. **Real Enterprise Datasets:** Solving authentic business problems (Retail margins, Telecom churn, Financial performance).
2. **6 Production GitHub Portfolio Projects:** Public repositories, clean data modeling schemas, and live interactive Power BI/Tableau dashboard links.
3. **Line-by-Line Qualitative Mentor Code Reviews:** Real practitioner feedback and numerical grading on student code.
4. **Structured 6-Stage Career Transformation:** Progression from spreadsheet logic to database querying, BI storytelling, Python EDA, mock technical whiteboarding drills, and verified credentialing.
5. **Anti-Fraud & Transparency Pledge:** Zero fake statistics, zero inflated guarantees, and authentic database-driven verified testimonials.

---

## 🛠️ Architecture & Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **Next.js 15+ (App Router)** | Server Components, dynamic streaming, and SEO optimization |
| **Language** | **TypeScript (Strict Mode)** | End-to-end type safety across database models and API payloads |
| **Styling & Design System** | **Tailwind CSS + Custom CSS Variables** | Deep Navy luxury theme (`#06101D`, `#081827`, `#397CFF`, `#41D8FF`) |
| **Database & ORM** | **Prisma ORM (SQLite / PostgreSQL)** | Normalized relational schema with cascade deletes and indexes |
| **Authentication & RBAC** | **JWT + HTTP-Only Cookies + Bcrypt** | Multi-role security (`STUDENT`, `INSTRUCTOR`, `ADMIN`) & Edge Middleware |
| **Payments** | **Razorpay Architecture** | Server-side order creation, HMAC-SHA256 signature verification & webhooks |
| **Validation** | **Zod** | Strict schema validation for registration, lead capture, and project grading |
| **Icons & Motion** | **Lucide React + Framer Motion** | Micro-interactions and icons |
| **Certificates** | **Cryptographic Verification Ledger** | Public verifiable credentials (`/verify/[certificateId]`) |

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js** v18.18+ or v20+
- **npm** v9+

### 2. Installation
```bash
# Navigate to the project root
cd career-transformer

# Install all dependencies
npm install
```

### 3. Environment Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

### 4. Database Setup & Seeding
Push the Prisma relational schema and seed the database with curriculum, demo accounts, sample projects, and verified reviews:
```bash
# Push database schema to SQLite (or PostgreSQL)
npx prisma db push

# Populate full curriculum, 6 modules, 6 projects, leads, and demo accounts
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Access Credentials

For testing the platform, use the **1-Click Demo Login** switchers on the `/login` page or use the credentials below:

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Admin** | `admin@careertransformer.in` | `AdminPassword123!` | Executive Overview, Lead CRM, Student Management, Project Grading, Payment Audits |
| **Instructor** | `instructor@careertransformer.in` | `InstructorPassword123!` | Course Content, Project Evaluation Queue, Assignment Grading |
| **Student** | `student@careertransformer.in` | `StudentPassword123!` | Course Player, Project Workbench, Assignment Submissions, Certificate Issuance |

---

## 📂 Project Structure

```
career-transformer/
├── app/
│   ├── layout.tsx                     # Root layout with fonts, metadata, JSON-LD schema
│   ├── page.tsx                       # Conversion-focused homepage
│   ├── about/page.tsx                 # About Us, Mission, Philosophy & Faculty
│   ├── courses/
│   │   ├── page.tsx                   # Course catalog redirect
│   │   └── [slug]/page.tsx            # Data Analytics Career Program detail page
│   ├── projects/page.tsx              # Portfolio Projects Gallery & specifications
│   ├── pricing/page.tsx               # Transparent tuition tiers & EMI options
│   ├── contact/page.tsx               # Inquiry form, location, and WhatsApp trigger
│   ├── verify/[certificateId]/page.tsx # Public tamper-proof Certificate Verification
│   ├── login/page.tsx                 # Unified Login with 1-Click Demo Switchers
│   ├── register/page.tsx              # Student Registration with background validation
│   ├── forgot-password/page.tsx       # Password recovery flow
│   │
│   ├── dashboard/                     # Student Portal (Protected)
│   │   ├── layout.tsx                 # Student Sidebar & Header
│   │   ├── page.tsx                   # Real-time progress, next up lab, deadlines
│   │   ├── courses/                   # Enrolled programs list
│   │   │   └── [courseId]/page.tsx    # Interactive video player, docs & completion sync
│   │   ├── projects/page.tsx          # Project workbench (GitHub URL submission & scores)
│   │   ├── assignments/page.tsx       # Module capstone submission & grades
│   │   ├── certificates/page.tsx      # Certificate issuance & verification links
│   │   └── profile/page.tsx           # Profile editor & goal tracker
│   │
│   ├── admin/                         # Admin Management Suite (Protected: ADMIN)
│   │   ├── layout.tsx                 # Admin Sidebar
│   │   ├── page.tsx                   # Platform KPI metrics, revenue, and queue preview
│   │   ├── leads/page.tsx             # Lead CRM (NEW, CONTACTED, QUALIFIED, ENROLLED, LOST)
│   │   ├── students/page.tsx          # Student Directory & Account suspension toggles
│   │   ├── courses/page.tsx           # Course & module management
│   │   ├── projects/page.tsx          # Project grading queue (Score & line-by-line feedback)
│   │   ├── assignments/page.tsx       # Assignment grading queue
│   │   ├── payments/page.tsx          # Razorpay transaction ledger
│   │   ├── enrollments/page.tsx       # Cohort enrollment rosters
│   │   ├── certificates/page.tsx      # Issued certificate records
│   │   └── testimonials/page.tsx      # Verified student feedback management
│   │
│   └── api/                           # API Route Handlers
│       ├── auth/register/route.ts     # User registration with bcrypt hashing
│       ├── auth/login/route.ts        # Credential authentication & session cookie
│       ├── auth/logout/route.ts       # Session clearing
│       ├── auth/me/route.ts           # Active user verification
│       ├── leads/route.ts             # Public demo booking endpoint
│       ├── razorpay/order/route.ts    # Secure server order creation
│       ├── razorpay/verify/route.ts   # HMAC-SHA256 signature verification & enrollment
│       ├── razorpay/webhook/route.ts  # Async payment notifications
│       ├── progress/toggle/route.ts   # Real-time lesson completion persistence
│       ├── submissions/project/route.ts # Student project submission
│       ├── submissions/assignment/route.ts # Student assignment submission
│       └── admin/                     # Admin operations & grading endpoints
│
├── components/
│   ├── ui/                            # Button, Badge, Card, Input, Textarea, Select, Modal
│   ├── navbar/                        # AnnouncementBar & responsive Navbar
│   ├── footer/                        # Complete brand Footer
│   ├── hero/                          # Animated conversion hero
│   ├── courses/                       # Featured program card & Curriculum accordion
│   ├── projects/                      # Project showcase cards
│   ├── pricing/                       # Pricing tier cards & guarantee
│   ├── testimonials/                  # Verified reviews grid
│   ├── leads/                         # "Book Free Demo" modal & LeadForm
│   ├── checkout/                      # Razorpay Enrollment checkout button
│   ├── dashboard/                     # CoursePlayerClient, ProjectsClient, AssignmentsClient
│   └── admin/                         # AdminLeadsClient, AdminStudentsClient, ProjectReviewClient
│
├── lib/
│   ├── db.ts                          # Prisma Client singleton
│   ├── auth.ts                        # JWT session management & RBAC helpers
│   ├── razorpay.ts                    # Razorpay SDK initialization & cryptographic verifier
│   ├── email.ts                       # Transactional email dispatcher (Resend/mock)
│   ├── validations.ts                 # Zod validation schemas
│   └── utils.ts                       # Formatting helpers (₹ INR currency, dates)
│
├── prisma/
│   ├── schema.prisma                  # Normalized relational database schema
│   └── seed.ts                        # Production seed data (6 modules, 6 projects, demo users)
│
├── middleware.ts                      # Edge route protection for /dashboard and /admin
├── .env.example                       # Environment variables template
└── README.md
```

---

## 🔒 Security & Payment Verification Rules

1. **Server-Side Price Validation:** The client NEVER submits or dictates course prices. The server looks up the exact tuition from the database.
2. **Cryptographic Signature Verification:** Razorpay payments are verified using HMAC-SHA256 (`crypto.createHmac("sha256", secret)`).
3. **No Plaintext Passwords:** Passwords are encrypted with `bcryptjs` (salt rounds: 10).
4. **HTTP-Only Cookies:** Auth tokens are stored in `HttpOnly`, `SameSite=Lax` cookies, preventing XSS token theft.
5. **Role-Based Access Control (RBAC):** Next.js Edge Middleware restricts `/admin/*` solely to verified `ADMIN` users.

---

## 🧪 Automated Testing

Run the automated test suite verifying validations, bcrypt hashing, and HMAC-SHA256 signature cryptography:
```bash
npx tsx scripts/verify-logic.ts
```

---

## 📦 Production Deployment

The project is fully compatible with **Vercel**, **Railway**, **Render**, or any Node.js container runtime.

```bash
# Build for production
npm run build

# Start production server
npm start
```
