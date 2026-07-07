/**
 * OrbitPay Marketing Landing Page
 * --------------------------------------------------------------------
 * Built collaboratively with the user over many iterations.
 * - Top "Pages" pill (top-left) opens the popped-up page menu
 * - Hero: "A Bank Built Around You" + "Around You." in rose/orange/pink gradient
 * - Trust strip: FDIC, NCUA, SOC 2, PCI DSS, 256-bit Encryption, 5.25% APY
 * - Three feature cards: Smart Insights, Advanced Security, Global Payments
 * - Three pricing tiers: Basic / Premium / Business
 * - Partners grid (Mastercard, Visa, NCUA, FDIC-Insured, Plaid, Coinbase, Wise, Apple Pay, Google Pay, SOC 2, ISO 27001, Stripe)
 * - Stats strip (2.4M+, $15B, 5.25%, 38 states, 18 branches, 4.9★)
 * - Inside OrbitPay photo grid (Capitol Mall lobby, lounge, engineering, operations)
 * - Credit Union Building / Our flagship branch card
 * - 9 branch locations (Sacramento, SF, LA, Seattle, Denver, Austin, Chicago, NYC + Frankfurt)
 * - 8 member testimonials
 * - About OrbitPay: leadership + mission
 * - Worldwide headquarters section (Sacramento, Frankfurt, Singapore, Dubai)
 * - Footer with logo, social links, navigation columns
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Star, ArrowRight, ArrowDownRight, Lock, Zap, Sparkles, Globe,
  Check, CheckCircle2, Shield, ShieldCheck, Heart, Building2,
  Mail, Phone, MapPin, Clock, Award, Users, TrendingUp,
  Twitter, Instagram, Linkedin, Play, Smartphone, Download,
} from 'lucide-react';

const LOGO = '/assets/logo/orbitpay-master-logo.svg';
const GLOBAL_VISION = '/images/orbitpay-global-vision.jpeg';
const FRANKFURT_HQ = '/images/orbitpay-frankfurt-hq.jpeg';
const OFFICE = '/images/orbitpay-office.jpeg';
const HERO_VIDEO = '/assets/videos/orbitpay-hero.mp4';

// ---------- DATA ----------

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Smart Insights',
    body: 'Real-time analytics, AI-driven spending insights, and goal tracking so every dollar works harder.',
    image: '/imgs/savings-growth-investment-concept.jpg',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: ShieldCheck,
    title: 'Advanced Security',
    body: 'Bank-grade encryption, biometric login, real-time fraud monitoring, and instant card freeze.',
    image: '/imgs/secure-mobile-banking-protection.jpg',
    gradient: 'from-rose-500 to-red-500',
  },
  {
    icon: Globe,
    title: 'Global Payments',
    body: 'Send and receive in 40+ currencies with the real exchange rate — no hidden fees, no borders.',
    image: '/imgs/premium-credit-card-payment-transaction.jpg',
    gradient: 'from-fuchsia-500 to-pink-500',
  },
];

const PRICING = [
  {
    name: 'Basic',
    price: 'Free',
    bullets: [
      'Zero monthly fees',
      'Essential banking features',
      '2-factor authentication',
      'Access to global payments',
    ],
    cta: 'Join Now',
    accent: false,
  },
  {
    name: 'Premium',
    price: '$9.99',
    cadence: '/month',
    bullets: [
      'Everything in Basic, plus:',
      'Priority customer support',
      'Higher withdrawal & transfer limits',
      'Fee-free global payments',
      'Virtual and physical debit cards',
      'Exclusive financial insights and tools',
    ],
    cta: 'Join Now',
    accent: true,
  },
  {
    name: 'Business',
    price: 'Custom',
    bullets: [
      'All Premium Plan features, plus:',
      'Dedicated account manager',
      'Payroll management',
      'Multi-user access',
      'API for seamless integration',
      'Advanced analytics to track',
      'Discounted international fees',
    ],
    cta: 'Join Now',
    accent: false,
  },
];

const PARTNERS = [
  { name: 'Mastercard', category: 'Network' },
  { name: 'Visa', category: 'Network' },
  { name: 'NCUA', category: 'Trust' },
  { name: 'FDIC-Insured', category: 'Trust' },
  { name: 'Plaid', category: 'Data' },
  { name: 'Coinbase', category: 'Crypto' },
  { name: 'Wise', category: 'FX' },
  { name: 'Apple Pay', category: 'Wallet' },
  { name: 'Google Pay', category: 'Wallet' },
  { name: 'SOC 2 Type II', category: 'Compliance' },
  { name: 'ISO 27001', category: 'Compliance' },
  { name: 'Stripe', category: 'Payments' },
];

const STATS = [
  { value: '2.4M+', label: 'Members served' },
  { value: '$15B', label: 'In member assets' },
  { value: '5.25%', label: 'APY on high-yield savings' },
  { value: '38', label: 'States covered' },
  { value: '18', label: 'Physical branches' },
  { value: '4.9 ★', label: 'App store rating' },
];

const BRANCHES = [
  { city: 'Sacramento, CA', address: '500 Capitol Mall, Suite 1800', hours: 'Mon–Fri 9am–5pm', phone: '1-916-555-0100' },
  { city: 'San Francisco, CA', address: '101 California Street, Floor 12', hours: 'Mon–Fri 9am–5pm', phone: '1-415-555-0101' },
  { city: 'Los Angeles, CA', address: '725 S Figueroa Street, Suite 2200', hours: 'Mon–Fri 9am–5pm', phone: '1-213-555-0102' },
  { city: 'Seattle, WA', address: '1201 3rd Avenue, Suite 2400', hours: 'Mon–Fri 9am–5pm', phone: '1-206-555-0103' },
  { city: 'Denver, CO', address: '1700 Lincoln Street, Floor 18', hours: 'Mon–Fri 9am–5pm', phone: '1-303-555-0104' },
  { city: 'Austin, TX', address: '300 W 6th Street, Suite 2100', hours: 'Mon–Fri 9am–5pm', phone: '1-512-555-0105' },
  { city: 'Chicago, IL', address: '200 E Randolph Street, Floor 60', hours: 'Mon–Fri 9am–5pm', phone: '1-312-555-0106' },
  { city: 'New York, NY', address: '1290 Avenue of the Americas', hours: 'Mon–Fri 8am–6pm', phone: '1-212-555-0107' },
];

const TESTIMONIALS = [
  {
    name: 'Maria Santos',
    role: 'Small Business Owner',
    text: 'OrbitPay transformed how I manage my business finances. The instant transfers save me hours every week. My cash flow has improved dramatically since switching.',
    avatar: 'https://i.pravatar.cc/150?u=maria',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Software Engineer',
    text: 'The AI insights helped me save $3,000 last year. Best banking experience I\'ve ever had. The financial planning tools are incredibly intuitive.',
    avatar: 'https://i.pravatar.cc/150?u=james',
    rating: 5,
  },
  {
    name: 'Aisha Okoro',
    role: 'Designer & Founder',
    text: 'Multi-currency support is a game-changer for my international clients. Highly recommend! Managing global payments has never been this seamless.',
    avatar: 'https://i.pravatar.cc/150?u=aisha',
    rating: 5,
  },
  {
    name: 'Eva Novak',
    role: 'Marketing Director',
    text: 'The mobile deposit is faster than my old bank\'s desktop version. I genuinely do not visit a branch anymore.',
    avatar: 'https://i.pravatar.cc/150?u=eva',
    rating: 5,
  },
  {
    name: 'Henrik Jansen',
    role: 'Founder, Northwind Logistics',
    text: 'Moving my operating account took a week. Same-day funding on card transactions meant we stopped carrying a 14-day float on $4M of monthly volume.',
    avatar: 'https://i.pravatar.cc/150?u=henrik',
    rating: 5,
  },
  {
    name: 'Aliyah Chen',
    role: 'Owner, Chen Family Restaurants',
    text: 'A real human answered my call on the second ring. That hasn\'t happened at any bank in 15 years.',
    avatar: 'https://i.pravatar.cc/150?u=aliyah',
    rating: 5,
  },
  {
    name: 'Devon Walker',
    role: 'Founder, Salt & Pine Studios',
    text: 'The mobile deposit is faster than my old bank\'s desktop version. I genuinely do not visit a branch anymore.',
    avatar: 'https://i.pravatar.cc/150?u=devon',
    rating: 5,
  },
  {
    name: 'Matteo Ricci',
    role: 'Architect',
    text: 'Their high-yield savings beat every other bank I researched. Earned more in interest in 6 months than I did all of last year.',
    avatar: 'https://i.pravatar.cc/150?u=matteo',
    rating: 5,
  },
];

const LEADERSHIP = [
  {
    name: 'Adaeze Okoro',
    role: 'Chief Executive Officer',
    bio: 'Joined as a teller in 2003, ran the digital product org, became CEO in 2021. Believes the best banking is the kind you don\'t have to think about.',
  },
  {
    name: 'Marcus Levin',
    role: 'Chief Technology Officer',
    bio: 'Built and ran the platform that processes 4M+ daily transactions. Spends weekends restoring a 1972 Triumph.',
  },
  {
    name: 'Yasmin Park',
    role: 'Chief Member Officer',
    bio: 'Oversees the human side: branches, support, member advisory. Believes every complaint is a roadmap for the next sprint.',
  },
  {
    name: 'Hassan Diallo',
    role: 'Chief Risk & Security Officer',
    bio: 'Former federal regulator. Holds the pen on the security model and the culture that protects it.',
  },
];

const TRUST_BADGES = [
  { label: 'FDIC Insured', desc: 'Up to $250,000' },
  { label: 'NCUA', desc: 'Federally Insured' },
  { label: 'SOC 2', desc: 'Type II Audited' },
  { label: 'PCI DSS', desc: 'Level 1 Compliant' },
  { label: '256-bit', desc: 'Encryption' },
  { label: '5.25% APY', desc: 'High-Yield Savings' },
];

// ---------- COMPONENTS ----------

function PagesPill({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed left-4 top-4 z-50 flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-sm font-semibold text-white shadow-lg transition hover:bg-neutral-800"
      aria-label="Open site menu"
    >
      <Star className="h-3.5 w-3.5 fill-current" />
      Pages
    </button>
  );
}

function PagesMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const pages = [
    { label: 'Personal', to: '/personal' },
    { label: 'Business', to: '/business' },
    { label: 'Cards', to: '/cards' },
    { label: 'Loans', to: '/loans' },
    { label: 'Investments', to: '/investments' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];
  return (
    <div className="fixed inset-0 z-[60] flex" role="dialog" aria-modal="true">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
        aria-label="Close menu"
      />
      <div className="relative ml-auto flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-neutral-900"
          aria-label="Close"
        >
          ✕
        </button>
        <div className="flex h-full">
          <div className="hidden w-32 shrink-0 items-center justify-center bg-gradient-to-b from-rose-500 via-orange-500 to-pink-500 md:flex">
            <h2
              className="select-none text-5xl font-black uppercase tracking-[0.4em] text-white"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              PAGES
            </h2>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-6 p-12">
            {pages.map((p) => (
              <Link
                key={p.to}
                to={p.to}
                onClick={onClose}
                className="text-2xl font-semibold text-neutral-900 hover:text-rose-600 md:text-4xl"
              >
                {p.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

function Hero({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <section className="relative overflow-hidden bg-[#F5F5F7] pb-20 pt-16">
      <PagesPill onClick={onOpenMenu} />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h1 className="font-serif text-4xl font-medium leading-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            A Bank Built Around{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #F43F5E 0%, #F97316 50%, #EC4899 100%)' }}
            >
              Around You.
            </span>
          </h1>
          <div className="mt-8 md:pt-8">
            <p className="mb-5 max-w-md text-sm leading-relaxed text-neutral-600">
              This modern, straightforward copy captures OrbitPay's forward-thinking approach to banking while maintaining simplicity.
            </p>
            <Link
              to="/personal"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm transition hover:border-neutral-400"
            >
              Learn More
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white">
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={HERO_VIDEO.replace(/\.mp4$/, '.jpg')}
              alt="OrbitPay mobile app"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = OFFICE;
              }}
            />
          </div>
          <div className="absolute -bottom-6 -right-6 flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-xl sm:flex-row sm:items-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white"
            >
              <Play className="h-3.5 w-3.5" /> App Store
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white"
            >
              <Play className="h-3.5 w-3.5" /> Google Play
            </a>
            <Link
              to="/onboard"
              className="inline-flex items-center gap-2 rounded-full border border-rose-500 px-4 py-2 text-xs font-semibold text-rose-600"
            >
              Open account <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-3 lg:grid-cols-6">
          {TRUST_BADGES.map((b) => (
            <div key={b.label}>
              <p className="text-base font-bold text-neutral-900">{b.label}</p>
              <p className="mt-1 text-xs text-neutral-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-rose-600">
            Why OrbitPay
          </span>
          <h2 className="font-serif text-3xl font-medium text-neutral-900 sm:text-4xl">
            A Bank Built Around You
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-3xl bg-white p-4 shadow-sm ring-1 ring-neutral-200/60"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <img
                  src={f.image}
                  alt={f.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-start gap-3 px-2">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-white`}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{f.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{f.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="bg-[#F5F5F7] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-rose-600">
            Simple, Transparent Pricing
          </span>
          <h2 className="font-serif text-3xl font-medium text-neutral-900 sm:text-4xl">
            Pick the plan that fits
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {PRICING.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl p-8 ${
                p.accent
                  ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-xl'
                  : 'bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/60'
              }`}
            >
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                {p.cadence && <span className="text-sm opacity-80">{p.cadence}</span>}
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                to="/onboard"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  p.accent
                    ? 'bg-white text-rose-600 hover:bg-neutral-100'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section className="bg-slate-950 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
            <Sparkles className="h-4 w-4" />
            Banking, better together
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Our Partners</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition hover:border-emerald-500/30 hover:bg-white/10"
            >
              <span className="text-sm font-semibold text-white">{p.name}</span>
              <span className="text-xs text-slate-500">{p.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="bg-slate-900 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-emerald-400 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsideOrbitPay() {
  const photos = [
    { src: '/imgs/orbitpay-v2/conference-room-1.png', label: 'Sacramento HQ', sub: '500 Capitol Mall' },
    { src: '/imgs/orbitpay-v2/conference-room-2.png', label: 'Conference floor', sub: 'Team room' },
    { src: '/imgs/orbitpay-v2/team-meeting-1.jpeg', label: 'Brand room', sub: 'Authentic corporate branding' },
    { src: '/imgs/orbitpay-v2/team-meeting-2.jpeg', label: 'OrbitPay Mobile APP', sub: 'iOS & Android' },
    { src: '/imgs/orbitpay-v2/lobby-1.png', label: 'Lobby', sub: 'Capitol Mall' },
    { src: '/imgs/orbitpay-v2/lobby-2.png', label: 'Lounge', sub: 'Member floor' },
    { src: '/imgs/orbitpay-v2/office-1.png', label: 'Open floor', sub: 'Engineering' },
    { src: '/imgs/orbitpay-v2/office-2.png', label: 'Operations', sub: 'Floor 8' },
  ];
  return (
    <section className="bg-[#F5F5F7] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-rose-600">
            Inside OrbitPay
          </span>
          <h2 className="font-serif text-3xl font-medium text-neutral-900 sm:text-4xl">
            Our flagship branch
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {photos.map((p, i) => (
            <motion.figure
              key={p.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-3xl"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={p.src}
                  alt={p.label}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <p className="text-sm font-semibold">{p.label}</p>
                <p className="text-xs text-white/80">{p.sub}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-rose-600">
            Loved by Members
          </span>
          <h2 className="font-serif text-3xl font-medium text-neutral-900 sm:text-4xl">
            Real members, real stories
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-3xl bg-[#F5F5F7] p-6"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-neutral-700">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full border-2 border-white object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function BranchesSection() {
  return (
    <section className="bg-[#F5F5F7] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-rose-600">
            Our Branches
          </span>
          <h2 className="font-serif text-3xl font-medium text-neutral-900 sm:text-4xl">
            From the Frankfurt operations center to the member portal on every device
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            9 branches across the U.S. and Europe
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {BRANCHES.map((b, i) => (
            <motion.div
              key={b.city}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-rose-300 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-neutral-900">{b.city}</p>
                  <p className="mt-1 text-sm text-neutral-600">{b.address}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
                    <Clock className="h-3 w-3" /> {b.hours}
                  </p>
                  <a
                    href={`tel:${b.phone}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-500"
                  >
                    <Phone className="h-3 w-3" /> {b.phone}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorldwideSection() {
  return (
    <section className="bg-gradient-to-b from-slate-950 via-emerald-950/30 to-slate-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
            <Globe className="h-4 w-4" />
            Global Presence
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">OrbitPay Finance Worldwide</h2>
          <p className="mt-2 text-base text-slate-400">
            Banking Without Borders — from the Frankfurt operations center to the member portal on every device.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl shadow-2xl shadow-emerald-500/20">
            <img src={GLOBAL_VISION} alt="OrbitPay Global Vision" className="h-full w-full object-cover" />
          </div>
          <div className="space-y-4">
            {[
              {
                title: 'Global Headquarters',
                city: 'Sacramento, California, USA',
                address: '500 Capitol Mall, Suite 1800, Sacramento, CA 95814, USA',
                gradient: 'from-emerald-500 to-teal-500',
              },
              {
                title: 'Europa Headquarters',
                city: 'Frankfurt, Germany',
                desc: 'Serving Europe, Middle East & Africa with dedicated financial services.',
                gradient: 'from-cyan-500 to-blue-500',
              },
              {
                title: 'Asia-Pacific HQ',
                city: 'Singapore',
                desc: 'Serving Greater China, Japan, South Korea, Southeast Asia & Oceania markets.',
                gradient: 'from-amber-500 to-orange-500',
              },
              {
                title: 'Arabian HQ',
                city: 'Dubai, UAE',
                desc: 'Serving GCC countries, Middle East & North Africa with Sharia-compliant banking.',
                gradient: 'from-purple-500 to-pink-500',
              },
            ].map((hq) => (
              <div key={hq.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${hq.gradient}`}>
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{hq.title}</p>
                    <p className="text-xs text-slate-400">{hq.city}</p>
                  </div>
                </div>
                {hq.address && <p className="mt-2 text-sm text-slate-400">{hq.address}</p>}
                {hq.desc && <p className="mt-2 text-sm text-slate-400">{hq.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="company" className="bg-[#0A0A0A] px-4 py-20 text-white sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              About OrbitPay
            </span>
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              A Credit Union Built on{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Trust &amp; Community
              </span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate-400">
              For over seven decades, OrbitPay Credit Union has been the financial partner of choice
              for millions of families and businesses. As a not-for-profit cooperative, we return
              profits to our members as better rates, lower fees, and reinvestment in our communities.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-400">
              Today, 2.4 million members trust us with their savings, investments, and dreams — and
              that trust is the foundation of everything we build.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <img src={OFFICE} alt="OrbitPay office" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {LEADERSHIP.map((p) => (
            <div key={p.name}>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-xl font-bold text-white">
                {p.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <p className="text-base font-bold text-white">{p.name}</p>
              <p className="mt-1 text-sm text-emerald-400">{p.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{p.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-center text-white sm:p-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to Experience the Future?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
              Join OrbitPay today and take control of your financial future with modern, seamless banking.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/onboard"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-emerald-600 hover:bg-emerald-50"
              >
                Open Free Account <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white hover:bg-white/20"
              >
                Schedule a Call
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-emerald-500/20 bg-slate-950 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <img src={LOGO} alt="OrbitPay Finance" className="mb-4 h-12 w-auto" />
            <p className="text-sm leading-relaxed text-slate-400">
              OrbitPay Finance — Banking Without Borders. Serving 2.4 million members worldwide with
              trusted financial services.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="#" aria-label="Twitter" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition hover:bg-emerald-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition hover:bg-emerald-600">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition hover:bg-emerald-600">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          {[
            { title: 'Products', links: ['Checking', 'Savings', 'Investments', 'Insurance', 'Credit Cards'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Blog', 'Partners'] },
            { title: 'Support', links: ['Help Center', 'Contact Us', 'FAQs', 'Security', 'Community'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclosures'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-semibold text-white">{col.title}</h4>
              <ul className="space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-slate-400 transition hover:text-emerald-400">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} OrbitPay Credit Union. All rights reserved. Federally insured by NCUA. Equal Opportunity Lender.</p>
          <p>support@orbitpaybank.online · (323) 892-7090</p>
        </div>
      </div>
    </footer>
  );
}

// ---------- MAIN PAGE ----------

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F5F7] text-neutral-900 antialiased">
      <PagesMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Hero onOpenMenu={() => setMenuOpen(true)} />
      <Features />
      <Pricing />
      <Partners />
      <Stats />
      <InsideOrbitPay />
      <TestimonialsSection />
      <BranchesSection />
      <WorldwideSection />
      <AboutSection />
      <CTA />
      <Footer />
    </div>
  );
}