import { useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { seedData } from '@/services/mockData';
import LandingPage from '@/pages/LandingPage';
import UserApp from '@/pages/UserApp';
import AdminApp from '@/pages/admin/AdminApp';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import NotFound from '@/pages/NotFound';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingScreen from '@/components/LoadingScreen';

function App() {
  useEffect(() => {
    try {
      seedData();
    } catch (e) {
      // Seed failures shouldn't block the app
    }

    // Set meta tags dynamically
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<SignIn />} />
          <Route path="/app/*" element={<UserApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
