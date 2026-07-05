import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Cards from './pages/Cards';
import Loans from './pages/Loans';
import KYC from './pages/KYC';
import Fraud from './pages/Fraud';
import Branches from './pages/Branches';
import Employees from './pages/Employees';
import Financial from './pages/Financial';
import Marketing from './pages/Marketing';
import CMS from './pages/CMS';
import Compliance from './pages/Compliance';
import Audit from './pages/Audit';
import Reports from './pages/Reports';
import Support from './pages/Support';
import Documents from './pages/Documents';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Communications from './pages/Communications';
import Verification from './pages/Verification';
import Statements from './pages/Statements';
import Investments from './pages/Investments';
import Impersonation from './pages/Impersonation';
import AIAssistant from './pages/AIAssistant';
import Automation from './pages/Automation';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="cards" element={<Cards />} />
        <Route path="loans" element={<Loans />} />
        <Route path="kyc" element={<KYC />} />
        <Route path="fraud" element={<Fraud />} />
        <Route path="branches" element={<Branches />} />
        <Route path="employees" element={<Employees />} />
        <Route path="financial" element={<Financial />} />
        <Route path="marketing" element={<Marketing />} />
        <Route path="cms" element={<CMS />} />
        <Route path="compliance" element={<Compliance />} />
        <Route path="audit" element={<Audit />} />
        <Route path="reports" element={<Reports />} />
        <Route path="support" element={<Support />} />
        <Route path="documents" element={<Documents />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="communications" element={<Communications />} />
        <Route path="verification" element={<Verification />} />
        <Route path="statements" element={<Statements />} />
        <Route path="investments" element={<Investments />} />
        <Route path="impersonation" element={<Impersonation />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="automation" element={<Automation />} />
      </Route>
    </Routes>
  );
}

export default App;