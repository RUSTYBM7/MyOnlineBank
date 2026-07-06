# OrbitPay Credit Union - Enterprise Digital Banking Platform

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-059669?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-059669?style=for-the-badge" alt="License">
</p>

<p align="center">
  <img src="https://img.shields.io/github/deployments/RUSTYBM7/MyOnlineBank/Production?style=for-the-badge" alt="Vercel Deployment">
  <img src="https://img.shields.io/github/workflow/status/RUSTYBM7/MyOnlineBank/CI/CD?style=for-the-badge" alt="CI/CD">
  <img src="https://img.shields.io/website?url=https%3A%2F%2Fmyonlinebank.vercel.app&style=for-the-badge" alt="Website Status">
</p>

---

## Overview

**OrbitPay Credit Union** is an enterprise-grade 2030 digital banking platform built with modern web technologies. It delivers a premium, green glass UI experience with comprehensive financial services. The platform includes both a **Member Portal** for customers and a comprehensive **Admin Portal** for secure operations management.

### Key Features

#### Member Portal
- **Multi-Currency Accounts** - USD, EUR, GBP, and BTC support
- **Instant Transfers** - Internal, external, wire, and crypto transfers
- **Virtual & Physical Cards** - Manageable debit cards with spending controls
- **Bill Pay** - Pay bills with automatic scheduling
- **Loan Management** - Apply and track personal, home, auto, and business loans
- **AI Financial Assistant** - Smart insights and recommendations
- **KYC Verification** - Secure identity verification process
- **Real-time Notifications** - Stay updated on all account activity
- **PWA Support** - Installable on mobile devices
- **Dark/Light Mode** - Premium green glass design system

#### Admin Portal
- **Executive Dashboard** - KPIs, Charts, Activity feeds
- **Member Management** - Full CRUD, Suspend/Reactivate, Notes
- **Account Operations** - Freeze, Unfreeze, Close, Configure fees
- **KYC Review Center** - Document verification, Risk scoring, Approve/Reject
- **Loan Management** - Applications, Underwriting, Repayment tracking
- **Card Operations** - Issue, Block, Replace, PIN reset, Limits
- **Transaction Center** - Reconciliation, Chargebacks, Disputes
- **Fraud & Risk Monitoring** - Alerts, AML, Velocity monitoring
- **Branch Management** - Multi-branch support with performance tracking
- **Employee Management** - Staff accounts, Roles, Permissions, Activity logs
- **Financial Oversight** - Revenue, Expenses, Profit & Loss
- **Compliance Center** - AML reviews, Audit preparation, Policy management
- **Audit Logging** - Complete action tracking, Immutable logs
- **System Settings** - Branding, Security policies, Notifications
- **Help Desk** - Ticket management, Escalation workflows

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript 5.9 |
| Build Tool | Vite 7.3 |
| Styling | TailwindCSS 3.4, Radix UI |
| Animations | Framer Motion 12 |
| State | Zustand 5 |
| Routing | React Router 7 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + TOTP MFA |
| Icons | Lucide React |
| Charts | Recharts |

## Project Structure

```
MyOnlineBank/
├── src/                      # Member Portal Source
│   ├── components/           # React components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── admin/           # Admin components
│   │   └── branding/        # Brand components
│   ├── store/               # Zustand state management
│   ├── lib/                 # Utilities and Supabase client
│   ├── types/               # TypeScript definitions
│   └── pages/               # Route pages
├── admin-portal/             # Admin Portal (Separate Build)
│   ├── src/
│   │   ├── components/      # Admin components
│   │   ├── pages/           # Admin pages
│   │   ├── store/           # Admin state
│   │   └── lib/             # Supabase, MFA utilities
│   └── supabase/            # Database schema
├── supabase/                 # Shared database schema
└── .github/                 # CI/CD workflows
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+ or npm 9+
- Supabase account (optional for demo mode)

### Installation

```bash
# Clone the repository
git clone https://github.com/RUSTYBM7/MyOnlineBank.git
cd MyOnlineBank

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
```

### Configuration

Edit `.env.local` with your Supabase credentials. **Only the public anon key belongs
in the browser — NEVER put the service-role key in a frontend env file:**

```env
# Browser-safe (Vite exposes these to the client bundle)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Server-only — for Supabase Edge Functions / a Node backend, NEVER the browser
# SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### Development

```bash
# Run member portal
pnpm dev

# Run admin portal (separate terminal)
cd admin-portal && pnpm dev
```

### Build

```bash
# Build member portal
pnpm build

# Build admin portal
cd admin-portal && pnpm build
```

## 🔐 Demo Credentials

### Member Portal
- **Email**: john.smith@email.com
- **Password**: demo123

### Admin Portal
- **Email**: admin@orbitpay.com
- **Password**: admin123
- **MFA Code**: Any 6-digit code (demo mode)

## 🔒 Security Features

- **Authentication**: Email/Password with MFA support (TOTP)
- **Session Management**: Auto-refresh tokens, Session timeout
- **Audit Logging**: All admin actions logged
- **Role-Based Access**: Granular permissions per module
- **Row Level Security**: Supabase RLS policies
- **Security Headers**: X-Frame-Options, CSP, etc.
- **Input Validation**: Zod schemas

## Database Setup

1. Create a new Supabase project at https://supabase.com
2. Run the schema from `supabase/schema.sql` in the SQL Editor
3. Enable Row Level Security (RLS) on all tables
4. Configure authentication settings in Supabase Dashboard

## Deployment

### Vercel (Recommended)

**Member Portal:**
1. Connect your GitHub repository to Vercel
2. Set root directory to `/`
3. Add environment variables in Vercel dashboard
4. Deploy automatically with CI/CD

**Admin Portal:**
1. Create a new Vercel project
2. Set root directory to `admin-portal`
3. Add environment variables
4. Deploy at `/admin` path or subdomain

### Environment Variables

**Member Portal (.env.local)**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://api.orbitpay.com
```

**Admin Portal (admin-portal/.env.local)**

Admin-side queries can use a more privileged anon key (e.g. one scoped to
authenticated admins with admin RLS policies) but **must not** include the
service-role key. The service-role key bypasses Row Level Security and would
expose every row in the database to anyone with browser devtools open.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key   # use a key whose RLS policies enforce admin-only access
# SUPABASE_SERVICE_ROLE_KEY=...        # SERVER-ONLY — never put this in a frontend .env
```

## GitHub Actions

The repository includes automated CI/CD workflows:
- **Lint**: Code quality checks
- **Build**: Production builds
- **Test**: Unit and integration tests
- **Deploy**: Automatic Vercel deployment on merge to `main`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Email**: support@orbitpay.com
- **Phone**: 1-800-ORBITPAY (672-4892)
- **Website**: https://myonlinebank.vercel.app
- **Admin Portal**: https://admin.myonlinebank.vercel.app

---

Built with security, scalability, and enterprise-grade quality in mind.

**© 2024 OrbitPay Credit Union. All rights reserved.**
