import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/glass';
import { useStore } from '@/store';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Hash,
  Printer,
  Receipt,
  Share2,
  User
} from 'lucide-react';;

// Mock receipt data
const mockReceipt = {
  id: 'RCP-2026-001847',
  date: 'January 15, 2026',
  time: '2:34 PM EST',
  type: 'Transfer Sent',
  status: 'Completed',
  amount: 2500.00,
  currency: 'USD',
  from: {
    accountType: 'Checking',
    accountLast4: '4892',
    name: 'John Anderson'
  },
  to: {
    bank: 'Chase Bank',
    accountType: 'Savings',
    accountLast4: '7631',
    routingNumber: '021000021',
    name: 'Sarah Mitchell'
  },
  reference: 'Family Support - January',
  transactionId: 'TXN-8475629384',
  fee: 0.00
};

export default function ReceiptScreen() {
  const navigate = useNavigate();
  const { user } = useStore();

  const generatePDFReceipt = () => {
    // Generate HTML receipt for download
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OrbitPay Receipt - ${mockReceipt.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', -apple-system, sans-serif; padding: 40px; background: #fff; }
    .container { max-width: 400px; margin: 0 auto; }
    .header { text-align: center; padding-bottom: 24px; border-bottom: 2px dashed #e5e7eb; }
    .logo { display: flex; align-items: center; justify-content: center; gap: 8px; }
    .logo-icon { width: 48px; height: 48px; background: linear-gradient(135deg, #059669, #10B981); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .logo-text { font-size: 24px; font-weight: 700; color: #0A0A0A; }
    .logo-text span { color: #059669; }
    .brand { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .status { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #dcfce7; color: #166534; border-radius: 20px; font-size: 14px; font-weight: 600; margin-top: 16px; }
    .amount-section { text-align: center; padding: 32px 0; }
    .amount-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
    .amount { font-size: 36px; font-weight: 700; color: #059669; margin-top: 8px; }
    .currency { font-size: 14px; color: #6b7280; }
    .details { padding: 24px 0; border-top: 1px dashed #e5e7eb; border-bottom: 1px dashed #e5e7eb; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; }
    .label { color: #6b7280; font-size: 14px; }
    .value { color: #0A0A0A; font-size: 14px; font-weight: 500; }
    .section-title { font-size: 11px; color: #059669; text-transform: uppercase; letter-spacing: 1px; margin: 16px 0 8px; font-weight: 600; }
    .footer { text-align: center; padding-top: 24px; margin-top: 24px; border-top: 2px dashed #e5e7eb; }
    .footer p { font-size: 12px; color: #6b7280; }
    .footer .brand-name { font-size: 14px; font-weight: 600; color: #0A0A0A; }
    .footer .contact { margin-top: 8px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <div class="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20" stroke="white" stroke-width="2"/></svg>
        </div>
        <span class="logo-text">Orbit<span>Pay</span></span>
      </div>
      <p class="brand">Credit Union</p>
      <div class="status">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
        ${mockReceipt.status}
      </div>
    </div>

    <div class="amount-section">
      <p class="amount-label">Amount Transferred</p>
      <p class="amount">$${mockReceipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
      <p class="currency">${mockReceipt.currency}</p>
    </div>

    <div class="details">
      <p class="section-title">From</p>
      <div class="row">
        <span class="label">Account</span>
        <span class="value">${mockReceipt.from.accountType} ••••${mockReceipt.from.accountLast4}</span>
      </div>
      <div class="row">
        <span class="label">Name</span>
        <span class="value">${mockReceipt.from.name}</span>
      </div>

      <p class="section-title">To</p>
      <div class="row">
        <span class="label">Bank</span>
        <span class="value">${mockReceipt.to.bank}</span>
      </div>
      <div class="row">
        <span class="label">Account</span>
        <span class="value">${mockReceipt.to.accountType} ••••${mockReceipt.to.accountLast4}</span>
      </div>
      <div class="row">
        <span class="label">Routing</span>
        <span class="value">${mockReceipt.to.routingNumber}</span>
      </div>
      <div class="row">
        <span class="label">Name</span>
        <span class="value">${mockReceipt.to.name}</span>
      </div>

      <p class="section-title">Transaction Details</p>
      <div class="row">
        <span class="label">Reference</span>
        <span class="value">${mockReceipt.reference}</span>
      </div>
      <div class="row">
        <span class="label">Transaction ID</span>
        <span class="value" style="font-family: monospace;">${mockReceipt.transactionId}</span>
      </div>
      <div class="row">
        <span class="label">Receipt Number</span>
        <span class="value" style="font-family: monospace;">${mockReceipt.id}</span>
      </div>
      <div class="row">
        <span class="label">Date & Time</span>
        <span class="value">${mockReceipt.date} at ${mockReceipt.time}</span>
      </div>
      <div class="row">
        <span class="label">Transfer Fee</span>
        <span class="value">$${mockReceipt.fee.toFixed(2)}</span>
      </div>
    </div>

    <div class="footer">
      <p class="brand-name">OrbitPay Credit Union</p>
      <p class="contact">Member-First Digital Banking</p>
      <p class="contact">www.orbitpay.com | 1-800-ORBITPAY</p>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OrbitPay_Receipt_${mockReceipt.id.replace(/-/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>OrbitPay Receipt - ${mockReceipt.id}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 40px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; }
            .logo span { color: #059669; }
            .divider { border-top: 1px dashed #ccc; margin: 15px 0; }
            .row { display: flex; justify-content: space-between; margin: 8px 0; }
            .label { color: #666; }
            .value { font-weight: 500; }
            .amount { font-size: 28px; font-weight: bold; text-align: center; margin: 20px 0; color: #059669; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Orbit<span>Pay</span></div>
            <p>Credit Union</p>
            <p style="margin-top: 10px;"><strong>${mockReceipt.status}</strong></p>
          </div>
          <div class="amount">$${mockReceipt.amount.toLocaleString()}</div>
          <div class="divider"></div>
          <div class="row"><span class="label">From:</span><span class="value">${mockReceipt.from.name} (****${mockReceipt.from.accountLast4})</span></div>
          <div class="row"><span class="label">To:</span><span class="value">${mockReceipt.to.name} (****${mockReceipt.to.accountLast4})</span></div>
          <div class="row"><span class="label">Bank:</span><span class="value">${mockReceipt.to.bank}</span></div>
          <div class="divider"></div>
          <div class="row"><span class="label">Reference:</span><span class="value">${mockReceipt.reference}</span></div>
          <div class="row"><span class="label">Transaction ID:</span><span class="value">${mockReceipt.transactionId}</span></div>
          <div class="row"><span class="label">Receipt:</span><span class="value">${mockReceipt.id}</span></div>
          <div class="row"><span class="label">Date:</span><span class="value">${mockReceipt.date}</span></div>
          <div class="footer">
            <p>OrbitPay Credit Union | www.orbitpay.com | 1-800-ORBITPAY</p>
            <p>Thank you for banking with us!</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'OrbitPay Receipt',
      text: `Transfer of $${mockReceipt.amount.toLocaleString()} to ${mockReceipt.to.name} - Transaction ${mockReceipt.transactionId}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error - fallback to download
        generatePDFReceipt();
      }
    } else {
      // Fallback for browsers without share API
      generatePDFReceipt();
    }
  };

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-6 h-6 text-emerald-800" />
        </button>
        <div>
          <h1 className="text-2xl font-medium text-emerald-800">Receipt</h1>
          <p className="text-sm text-emerald-800/50">Transaction confirmation</p>
        </div>
      </div>

      {/* Success Banner */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card-high p-6 text-center bg-gradient-to-b from-emerald-50/80 to-teal-50/80"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <p className="text-lg font-semibold text-emerald-800 mb-1">{mockReceipt.status}</p>
        <p className="text-sm text-emerald-800/50">{mockReceipt.type}</p>
      </motion.div>

      {/* Amount Card */}
      <GlassCard intensity="high" className="p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-40 bg-[#A8E6CF]/50 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <p className="text-sm text-emerald-800/50 mb-2">Amount Transferred</p>
          <p className="text-4xl font-bold text-emerald-800">
            ${mockReceipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-emerald-800/40 mt-1">{mockReceipt.currency}</p>
        </div>
      </GlassCard>

      {/* Transaction Details */}
      <GlassCard className="p-5 space-y-4" intensity="medium">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100/30">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-800/60 uppercase tracking-wider">From</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-emerald-800/50">Account</span>
            <span className="text-sm text-emerald-800 font-medium">{mockReceipt.from.accountType} ••••{mockReceipt.from.accountLast4}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-emerald-800/50">Name</span>
            <span className="text-sm text-emerald-800 font-medium">{mockReceipt.from.name}</span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-emerald-600 text-xs">↓</span>
          </div>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-emerald-100/30">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-800/60 uppercase tracking-wider">To</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-emerald-800/50">Bank</span>
            <span className="text-sm text-emerald-800 font-medium">{mockReceipt.to.bank}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-emerald-800/50">Account</span>
            <span className="text-sm text-emerald-800 font-medium">{mockReceipt.to.accountType} ••••{mockReceipt.to.accountLast4}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-emerald-800/50">Routing</span>
            <span className="text-sm text-emerald-800 font-medium">{mockReceipt.to.routingNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-emerald-800/50">Name</span>
            <span className="text-sm text-emerald-800 font-medium">{mockReceipt.to.name}</span>
          </div>
        </div>
      </GlassCard>

      {/* Reference & Metadata */}
      <GlassCard className="p-4 space-y-3" intensity="medium">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-800/60 uppercase tracking-wider">Details</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-emerald-800/50">Reference</span>
          <span className="text-sm text-emerald-800 font-medium">{mockReceipt.reference}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-emerald-800/50">Transaction ID</span>
          <span className="text-sm text-emerald-800 font-mono">{mockReceipt.transactionId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-emerald-800/50">Receipt Number</span>
          <span className="text-sm text-emerald-800 font-mono">{mockReceipt.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-emerald-800/50">Date & Time</span>
          <span className="text-sm text-emerald-800 font-medium">{mockReceipt.date} at {mockReceipt.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-emerald-800/50">Transfer Fee</span>
          <span className="text-sm text-emerald-800 font-medium">${mockReceipt.fee.toFixed(2)}</span>
        </div>
      </GlassCard>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="glass-card p-4 text-center hover:bg-white/30 transition-colors"
        >
          <Share2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
          <p className="text-xs text-emerald-800">Share</p>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={generatePDFReceipt}
          className="glass-card p-4 text-center hover:bg-white/30 transition-colors"
        >
          <Download className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
          <p className="text-xs text-emerald-800">Download</p>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className="glass-card p-4 text-center hover:bg-white/30 transition-colors"
        >
          <Printer className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
          <p className="text-xs text-emerald-800">Print</p>
        </motion.button>
      </div>

      {/* Footer with Logo */}
      <div className="text-center pt-4">
        <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-semibold text-emerald-800">OrbitPay Credit Union</p>
        <p className="text-xs text-emerald-800/40 mt-1">Member-First Digital Banking</p>
        <p className="text-xs text-emerald-800/30 mt-2">www.orbitpay.com | 1-800-ORBITPAY</p>
      </div>
    </div>
  );
}
