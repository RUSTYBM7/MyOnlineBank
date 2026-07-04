# OrbitPay Credit Union - Enterprise Digital Banking Platform

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-059669?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
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

**OrbitPay Credit Union** is an enterprise-grade 2030 digital banking platform built with modern web technologies. It delivers a premium, green glass UI experience with comprehensive financial services.

### Key Features

- **Multi-Currency Accounts** - USD, EUR, GBP, and BTC support
- **Instant Transfers** - Internal, external, wire, and crypto transfers
- **Virtual & Physical Cards** - Manageable debit cards with spending controls
- **Bill Pay** - Pay bills with automatic scheduling
- **Loan Management** - Apply and track personal, home, auto, and business loans
- **AI Financial Assistant** - Smart insights and recommendations
- **KYC Verification** - Secure identity verification process
- **Real-time Notifications** - Stay updated on all account activity

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 7 |
| Styling | TailwindCSS 4 |
| Animations | Framer Motion |
| State | Zustand |
| Routing | React Router 6 |
| Icons | Lucide React |
| Modal | Radix UI Dialog |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/RUSTYBM7/MyOnlineBank.git
cd MyOnlineBank

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically with CI/CD

### GitHub Actions

The repository includes automated CI/CD:
- **Lint**: Code quality checks
- **Build**: Production builds
- **Test**: Unit and integration tests
- **Deploy**: Automatic Vercel deployment on merge to `main`

## Environment Variables

```env
VITE_API_URL=https://api.orbitpay.com
VITE_APP_NAME=OrbitPay
VITE_APP_VERSION=1.0.0
VITE_GA_ID=G-MOBILE_APP_CONFIG
```

## Security

- Never commit secrets to version control
- Use environment variables for all sensitive data
- Enable 2FA for GitHub and Vercel
- Regular dependency updates via Dependabot

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

---

Built with security and scalability in mind.
