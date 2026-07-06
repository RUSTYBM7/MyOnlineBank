import { useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { seedData } from '@/services/mockData';
import LandingPage from '@/pages/LandingPage';
import BrightLandingPage from '@/pages/BrightLandingPage';
import UserApp from '@/pages/UserApp';
import AdminApp from '@/pages/admin/AdminApp';
import NotFound from '@/pages/NotFound';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingScreen from '@/components/LoadingScreen';
import PublicLayout from '@/components/public/PublicLayout';
// Public sub-pages
import PersonalBankingPage from '@/pages/public/PersonalBankingPage';
import BusinessBankingPage from '@/pages/public/BusinessBankingPage';
import LoansPage from '@/pages/public/LoansPage';
import CreditCardsPage from '@/pages/public/CreditCardsPage';
import InvestmentsPage from '@/pages/public/InvestmentsPage';
import DigitalBankingPage from '@/pages/public/DigitalBankingPage';
import SecurityCenterPage from '@/pages/public/SecurityCenterPage';
import EducationPage from '@/pages/public/EducationPage';
import AboutPage from '@/pages/public/AboutPage';
import RatesPage from '@/pages/public/RatesPage';
import FeesPage from '@/pages/public/FeesPage';
import FAQPage from '@/pages/public/FAQPage';
import ContactPage from '@/pages/public/ContactPage';
import CareersPage from '@/pages/public/CareersPage';
import NewsPage from '@/pages/public/NewsPage';
import AccessibilityPage from '@/pages/public/AccessibilityPage';
import PrivacyPage from '@/pages/public/PrivacyPage';
import TermsPage from '@/pages/public/TermsPage';
import CookiesPage from '@/pages/public/CookiesPage';

// Auth pages
import AuthHubPage from '@/pages/auth/AuthHubPage';
import SignInPage from '@/pages/auth/SignInPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import ForgotUsernamePage from '@/pages/auth/ForgotUsernamePage';
import RecoverMembershipPage from '@/pages/auth/RecoverMembershipPage';
import RecoverOnlineIdPage from '@/pages/auth/RecoverOnlineIdPage';
import UnlockAccountPage from '@/pages/auth/UnlockAccountPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import VerifyPhonePage from '@/pages/auth/VerifyPhonePage';
import VerifyAuthenticatorPage from '@/pages/auth/VerifyAuthenticatorPage';
import MfaSetupPage from '@/pages/auth/MfaSetupPage';
import PasskeySetupPage from '@/pages/auth/PasskeySetupPage';
import TrustedDevicesPage from '@/pages/auth/TrustedDevicesPage';
import LoginHistoryPage from '@/pages/auth/LoginHistoryPage';
import SecurityAlertsPage from '@/pages/auth/SecurityAlertsPage';
import RecoveryCodesPage from '@/pages/auth/RecoveryCodesPage';
import SecurityQuestionsPage from '@/pages/auth/SecurityQuestionsPage';
import LockedAccountPage from '@/pages/auth/LockedAccountPage';
import LogoutConfirmPage from '@/pages/auth/LogoutConfirmPage';

// Enrollment + onboarding
import EnrollHubPage from '@/pages/enroll/EnrollHubPage';
import EnrollProductPage from '@/pages/enroll/EnrollProductPage';
import CardServicesPage from '@/pages/enroll/CardServicesPage';
import OnboardWizard from '@/components/onboard/OnboardWizard';

// Applicant dashboard
import ApplicantDashboardPage from '@/pages/applicant/ApplicantDashboardPage';

// Support pages
import ChatSupportPage from '@/pages/support/ChatSupportPage';
import AISupportPage from '@/pages/support/AISupportPage';
import TicketSupportPage from '@/pages/support/TicketSupportPage';
import IntegrationsPage from '@/pages/public/IntegrationsPage';

function App() {
  useEffect(() => {
    try {
      seedData();
    } catch (e) {
      // Seed failures shouldn't block the app
    }

    document.title = 'OrbitPay Credit Union — Banking at your orbit';
    const setMeta = (name: string, content: string) => {
      let m = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!m) { m = document.createElement('meta'); m.name = name; document.head.appendChild(m); }
      m.content = content;
    };
    const setOg = (property: string, content: string) => {
      let m = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!m) { m = document.createElement('meta'); m.setAttribute('property', property); document.head.appendChild(m); }
      m.content = content;
    };
    setMeta('description', 'OrbitPay Credit Union — Multi-currency banking, instant global transfers, AI-powered money management.');
    setMeta('theme-color', '#10b981');
    setMeta('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
    setOg('og:title', 'OrbitPay Credit Union');
    setOg('og:description', 'Banking that moves at your orbit.');
    setOg('og:type', 'website');
    setOg('og:url', 'https://orbitpaybank.online');
    setOg('og:image', 'https://orbitpaybank.online/og-image.png');
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Home (Velobank-style template) wrapped in PublicLayout for footer */}
          <Route path="/" element={<PublicLayout><BrightLandingPage /></PublicLayout>} />
          <Route path="/landing-old" element={<LandingPage />} />

          {/* Auth — old routes now redirect to the new auth ecosystem */}
          <Route path="/login" element={<Navigate to="/auth/sign-in" replace />} />
          <Route path="/signup" element={<Navigate to="/auth/sign-up" replace />} />
          <Route path="/sign-in" element={<Navigate to="/auth/sign-in" replace />} />
          <Route path="/sign-up" element={<Navigate to="/auth/sign-up" replace />} />
          <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />

          {/* Member app */}
          <Route path="/app/*" element={<UserApp />} />

          {/* Admin */}
          <Route path="/admin/*" element={<AdminApp />} />

          {/* Public sub-pages — all wrapped in PublicLayout for consistent nav + footer */}
          <Route path="/personal" element={<PublicLayout><PersonalBankingPage /></PublicLayout>} />
          <Route path="/business" element={<PublicLayout><BusinessBankingPage /></PublicLayout>} />
          <Route path="/loans" element={<PublicLayout><LoansPage /></PublicLayout>} />
          <Route path="/cards" element={<PublicLayout><CreditCardsPage /></PublicLayout>} />
          <Route path="/investments" element={<PublicLayout><InvestmentsPage /></PublicLayout>} />
          <Route path="/digital" element={<PublicLayout><DigitalBankingPage /></PublicLayout>} />
          <Route path="/security" element={<PublicLayout><SecurityCenterPage /></PublicLayout>} />
          <Route path="/education" element={<PublicLayout><EducationPage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/rates" element={<PublicLayout><RatesPage /></PublicLayout>} />
          <Route path="/fees" element={<PublicLayout><FeesPage /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/careers" element={<PublicLayout><CareersPage /></PublicLayout>} />
          <Route path="/news" element={<PublicLayout><NewsPage /></PublicLayout>} />
          <Route path="/accessibility" element={<PublicLayout><AccessibilityPage /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
          <Route path="/cookies" element={<PublicLayout><CookiesPage /></PublicLayout>} />

          {/* Auth suite — full public auth ecosystem */}
          <Route path="/auth" element={<AuthHubPage />} />
          <Route path="/auth/sign-in" element={<SignInPage />} />
          <Route path="/auth/sign-up" element={<SignUpPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/forgot-username" element={<ForgotUsernamePage />} />
          <Route path="/auth/recover-membership" element={<RecoverMembershipPage />} />
          <Route path="/auth/recover-online-id" element={<RecoverOnlineIdPage />} />
          <Route path="/auth/unlock-account" element={<UnlockAccountPage />} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/verify-phone" element={<VerifyPhonePage />} />
          <Route path="/auth/verify-authenticator" element={<VerifyAuthenticatorPage />} />
          <Route path="/auth/mfa-setup" element={<MfaSetupPage />} />
          <Route path="/auth/passkey-setup" element={<PasskeySetupPage />} />
          <Route path="/auth/trusted-devices" element={<TrustedDevicesPage />} />
          <Route path="/auth/login-history" element={<LoginHistoryPage />} />
          <Route path="/auth/security-alerts" element={<SecurityAlertsPage />} />
          <Route path="/auth/recovery-codes" element={<RecoveryCodesPage />} />
          <Route path="/auth/security-questions" element={<SecurityQuestionsPage />} />
          <Route path="/auth/locked-account" element={<LockedAccountPage />} />
          <Route path="/auth/logout-confirmation" element={<LogoutConfirmPage />} />

          {/* Enrollment + onboarding wizard */}
          <Route path="/enroll" element={<EnrollHubPage />} />
          <Route path="/enroll/:productId" element={<EnrollProductPage />} />
          <Route path="/enroll/cards/services" element={<CardServicesPage />} />
          <Route path="/onboard" element={<OnboardWizard />} />

          {/* Applicant dashboard */}
          <Route path="/applicant" element={<ApplicantDashboardPage />} />
          <Route path="/applicant/dashboard" element={<ApplicantDashboardPage />} />

          {/* Support pages */}
          <Route path="/support/chat" element={<ChatSupportPage />} />
          <Route path="/support/ai" element={<AISupportPage />} />
          <Route path="/support/ticket" element={<TicketSupportPage />} />
          <Route path="/support" element={<ChatSupportPage />} />

          {/* Integrations */}
          <Route path="/integrations" element={<IntegrationsPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
