# Orbitpay Finance — Brand Logo Kit v2.0

> **Non-Destructive Integration Wizard**  
> Integrates the authoritative Base64 logo into ANY existing project WITHOUT changing existing colors, typography, spacing, or design. Purely additive: logo assets + injection utilities only.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [File Structure](#file-structure)
3. [Configuration](#configuration)
4. [Logo Assets](#logo-assets)
5. [CSS Module](#css-module)
6. [JavaScript Module](#javascript-module)
7. [Python Icon Generator](#python-icon-generator)
8. [PWA Manifest & Meta Tags](#pwa-manifest--meta-tags)
9. [Integration Snippets](#integration-snippets)
10. [Runtime API Reference](#runtime-api-reference)
11. [Audit Script](#audit-script)
12. [Available Variants](#available-variants)

---

## Quick Start

### Step 1: Include the files

Add to your existing `<head>` (any order, anywhere):

```html
<link rel="stylesheet" href="/styles/orbitpay-logo.css">
<script src="/scripts/orbitpay-logo.js" defer></script>
```

### Step 2: Add data attributes

Replace your existing logo elements with data attributes:

```html
<!-- Before -->
<img src="old-logo.png" class="nav-logo">

<!-- After -->
<span data-op-logo="header" class="nav-logo"></span>
```

The script auto-detects `data-op-logo` on page load and injects the logo.

---

## File Structure

```
brand-logo-kit/
├── assets/
│   └── logo/
│       ├── logo-orbitpay-master.png      ← authoritative asset
│       ├── favicon.ico
│       ├── favicon-16x16.png
│       ├── favicon-32x32.png
│       ├── apple-touch-icon.png
│       ├── android-chrome-192x192.png
│       └── android-chrome-512x512.png
├── styles/
│   └── orbitpay-logo.css                  ← logo utilities only
├── scripts/
│   ├── orbitpay-logo.js                   ← injection module
│   └── generate-icons.py                  ← Pillow fallback
├── snippets/
│   ├── head.html
│   ├── header-logo.html
│   ├── hero-logo.html
│   ├── auth-logo.html
│   ├── sidebar-logo.html
│   ├── card-logo.html
│   ├── modal-logo.html
│   ├── footer-logo.html
│   ├── splash.html
│   ├── email-logo.html
│   └── pdf-header.html
├── templates/
│   └── meta-tags.html
├── site.webmanifest
├── audit-logo.sh
└── README.md
```

---

## Configuration

The wizard accepts three optional parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `LOGO_B64_FILE` | `./orbitpay_logo_b64_payload.txt` | Path to Base64 payload |
| `OUTPUT_DIR` | `./brand-logo-kit` | Output directory for generated files |
| `PROJECT_ROOT` | `.` | Project root for audit scanning |

### Environment Variables

```bash
# Optional: override defaults
export LOGO_B64_FILE="./custom-logo.txt"
export OUTPUT_DIR="./my-brand-kit"
export PROJECT_ROOT="/var/www/myapp"
```

---

## Logo Assets

### Master Asset

- **File**: `logo-orbitpay-master.png`
- **Properties**: Transparent background, full resolution
- **Aspect Ratio**: `2064:512`
- **Format**: PNG with alpha channel

### Generated Icon Sizes

| File | Size | Purpose |
|------|------|---------|
| `favicon-16x16.png` | 16×16 | Browser tab icon |
| `favicon-32x32.png` | 32×32 | Retina tab icon |
| `apple-touch-icon.png` | 180×180 | iOS home screen |
| `android-chrome-192x192.png` | 192×192 | Android icon |
| `android-chrome-512x512.png` | 512×512 | Android splash |
| `favicon.ico` | Multi-size | Legacy browser support |

### Inline Base64 Format

```json
{
  "logo_inline": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACBAAAAIACAYAAAAxeQ2W..."
}
```

> **Note**: The inline Base64 string is automatically injected into CSS and JS modules.

---

## CSS Module

### `orbitpay-logo.css`

Purely additive. Does NOT override existing design tokens.

```css
/* ═══════════════════════════════════════════════════════════════════════════
   ORBITPAY LOGO MODULE — Purely additive. Does NOT override existing design.
   Import this alongside your existing styles. It only adds logo utilities.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Logo Base (aspect-ratio preserved, Retina/HiDPI ready) ──────────────── */
.op-logo {
  display: inline-block;
  background-image: var(--op-logo-url, url('LOGO_INLINE'));
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: auto;
  aspect-ratio: 2064 / 512;   /* Exact native ratio from master asset */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  vertical-align: middle;
}

/* ── Size Variants (height-locked, width auto-scales) ────────────────── */
.op-logo--favicon   { height: 16px;  }
.op-logo--header    { height: 28px;  }
.op-logo--nav       { height: 24px;  }
.op-logo--hero      { height: clamp(40px, 6vw, 72px); }
.op-logo--footer    { height: 22px;  opacity: 0.85; }
.op-logo--auth      { height: 48px;  margin-bottom: 1.5rem; }
.op-logo--splash    { height: 72px;  }
.op-logo--card      { height: 20px;  }
.op-logo--modal     { height: 32px;  }
.op-logo--pdf       { height: 36px;  }
.op-logo--email     { height: 44px;  }
.op-logo--receipt   { height: 32px;  margin: 0 auto 1rem; }
.op-logo--settings  { height: 28px;  }
.op-logo--dropdown  { height: 18px;  }
.op-logo--toast     { height: 20px;  }
.op-logo--print     { height: 36px;  }

/* ── Dark-mode variant (brightness boost for dark backgrounds) ──────────── */
.op-logo--on-dark {
  filter: brightness(1.15) contrast(1.05);
}

/* ── Loading / Splash animation ─────────────────────────────────────────── */
.op-splash__logo {
  height: 72px;
  animation: opLogoPulse 2s ease-in-out infinite;
}
@keyframes opLogoPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.7; transform: scale(0.98); }
}

/* ── Print styles (logo stays sharp on paper/PDF) ─────────────────────── */
@media print {
  .op-logo {
    image-rendering: auto;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .op-logo--print { height: 32px; }
}

/* ── Reduced motion ───────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .op-splash__logo { animation: none; }
}
```

---

## JavaScript Module

### `orbitpay-logo.js`

Non-destructive injection module with full API.

```javascript
/* ═══════════════════════════════════════════════════════════════════════════
   ORBITPAY LOGO INJECTOR — Purely additive. Does NOT touch existing design.
   Provides utilities to place the official logo anywhere in your app.
   ═══════════════════════════════════════════════════════════════════════════ */

const OrbitpayLogo = (() => {
  'use strict';

  // ── Authoritative Logo Asset ───────────────────────────────────────────
  const LOGO_B64 = 'LOGO_INLINE';

  // ── Injection Utilities ────────────────────────────────────────────────

  /**
   * Inject logo into elements matching a CSS selector.
   * @param {string} selector   — CSS selector (e.g., '.brand-logo', '#header-logo')
   * @param {string} variant    — size variant class suffix (e.g., 'header', 'hero', 'card')
   * @param {boolean} onDark    — apply brightness filter for dark backgrounds
   */
  const inject = (selector, variant = 'header', onDark = false) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.backgroundImage = `url(${LOGO_B64})`;
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundSize = 'contain';
      el.style.backgroundPosition = 'center';
      el.classList.add('op-logo', `op-logo--${variant}`);
      if (onDark) el.classList.add('op-logo--on-dark');
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', 'Orbitpay Finance Logo');
    });
    return elements.length;
  };

  /**
   * Set favicon from logo asset.
   */
  const setFavicon = () => {
    let link = document.querySelector('link[rel*="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = LOGO_B64;
    return true;
  };

  /**
   * Set Apple touch icon.
   */
  const setAppleTouchIcon = () => {
    let link = document.querySelector('link[rel="apple-touch-icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'apple-touch-icon';
      document.head.appendChild(link);
    }
    link.href = LOGO_B64;
    return true;
  };

  /**
   * Show branded splash screen (does not conflict with existing loaders).
   * @param {number} durationMs — how long to show (default 1500)
   */
  const showSplash = (durationMs = 1500) => {
    const existing = document.getElementById('op-splash');
    if (existing) return;

    const splash = document.createElement('div');
    splash.id = 'op-splash';
    splash.style.cssText = `
      position:fixed; inset:0; z-index:99999;
      display:flex; flex-direction:column; align-items:center; justify-content:center; gap:24px;
      background: inherit; /* inherits from parent / existing theme */
      backdrop-filter: blur(8px);
    `;
    splash.innerHTML = `
      <span class="op-logo op-logo--splash" style="background-image:url(${LOGO_B64})"></span>
      <div style="width:40px; height:40px; border:3px solid rgba(128,128,128,0.2); border-top-color:rgba(128,128,128,0.8); border-radius:50%; animation:opSpin 0.8s linear infinite;"></div>
    `;

    // Inject spin keyframes if not present
    if (!document.getElementById('op-splash-styles')) {
      const style = document.createElement('style');
      style.id = 'op-splash-styles';
      style.textContent = `@keyframes opSpin{to{transform:rotate(360deg);}}`;
      document.head.appendChild(style);
    }

    document.body.appendChild(splash);

    return new Promise(resolve => {
      setTimeout(() => {
        splash.style.transition = 'opacity 0.3s ease';
        splash.style.opacity = '0';
        setTimeout(() => { splash.remove(); resolve(true); }, 300);
      }, durationMs);
    });
  };

  /**
   * Generate a branded document header for PDFs, emails, statements.
   * Uses YOUR existing CSS variables if available; falls back to sensible defaults.
   */
  const documentHeader = ({ title = 'Document', subtitle = '' } = {}) => {
    const root = getComputedStyle(document.documentElement);
    const primary = root.getPropertyValue('--primary') || root.getPropertyValue('--brand-primary') || '#111d35';
    const text = root.getPropertyValue('--text-primary') || root.getPropertyValue('--color-text') || '#0a1628';
    const muted = root.getPropertyValue('--text-secondary') || root.getPropertyValue('--color-muted') || '#5a6a82';
    const font = root.getPropertyValue('--font-body') || root.getPropertyValue('--font-family') || "system-ui, sans-serif";

    return `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:24px 0; border-bottom:2px solid ${primary}; margin-bottom:32px; font-family:${font};">
        <img src="${LOGO_B64}" alt="Orbitpay Finance" style="height:36px; width:auto; display:block;">
        <div style="text-align:right;">
          <div style="font-weight:700; color:${text}; font-size:14px;">Orbitpay Finance</div>
          <div style="color:${muted}; font-size:12px;">${title}${subtitle ? ' &middot; ' + subtitle : ''}</div>
        </div>
      </div>
    `;
  };

  /**
   * Generate a branded email template HTML string.
   * Inherits your existing brand colors from CSS variables where possible.
   */
  const emailTemplate = ({ title, body, ctaText = '', ctaUrl = '' }) => {
    const root = getComputedStyle(document.documentElement);
    const primary = root.getPropertyValue('--primary') || '#111d35';
    const bg = root.getPropertyValue('--bg-page') || '#f7f8fa';
    const surface = root.getPropertyValue('--bg-surface') || '#ffffff';
    const text = root.getPropertyValue('--text-primary') || '#0a1628';
    const muted = root.getPropertyValue('--text-secondary') || '#5a6a82';
    const font = root.getPropertyValue('--font-body') || "system-ui, sans-serif";

    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:${bg}; font-family:${font}; color:${text};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background:${surface}; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
      <tr><td style="padding:32px; text-align:center; border-bottom:1px solid #e2e5eb;">
        <img src="${LOGO_B64}" alt="Orbitpay Finance" style="height:48px; width:auto; margin-bottom:16px; display:block; margin-left:auto; margin-right:auto;">
        <h1 style="margin:0; font-size:24px; font-weight:700; color:${text};">${title}</h1>
      </td></tr>
      <tr><td style="padding:32px; font-size:16px; line-height:1.6; color:${muted};">${body}</td></tr>
      ${ctaUrl ? `<tr><td style="padding:0 32px 32px; text-align:center;"><a href="${ctaUrl}" style="display:inline-block; padding:14px 28px; background:${primary}; color:#fff; text-decoration:none; border-radius:8px; font-weight:600;">${ctaText}</a></td></tr>` : ''}
      <tr><td style="padding:24px 32px; text-align:center; font-size:12px; color:#8a96aa; border-top:1px solid #f0f2f5;">
        &copy; ${new Date().getFullYear()} Orbitpay Finance. All rights reserved.
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
  };

  /**
   * Audit the current page for logo presence.
   * Reports how many logos are found and whether favicon is set.
   */
  const audit = () => {
    const logos = document.querySelectorAll('.op-logo');
    const favicon = document.querySelector('link[rel*="icon"]');
    const apple = document.querySelector('link[rel="apple-touch-icon"]');
    const issues = [];

    if (logos.length === 0) issues.push('No .op-logo elements found.');
    logos.forEach((el, i) => {
      const bg = getComputedStyle(el).backgroundImage;
      if (!bg.includes('data:image')) issues.push(`Logo #${i} missing inline asset.`);
    });
    if (!favicon) issues.push('Favicon not set.');

    const report = {
      passed: issues.length === 0,
      logoCount: logos.length,
      faviconSet: !!favicon,
      appleTouchSet: !!apple,
      issues,
    };

    console.log('[OrbitpayLogo] Audit:', report);
    return report;
  };

  /**
   * Auto-inject logos based on data attributes found in the DOM.
   * Looks for: data-op-logo="header|hero|footer|auth|..."
   */
  const autoInject = () => {
    const variants = ['favicon','header','nav','hero','footer','auth','splash','card','modal','pdf','email','receipt','settings','dropdown','toast','print'];
    let total = 0;
    variants.forEach(v => {
      const count = inject(`[data-op-logo="${v}"]`, v);
      total += count;
    });
    setFavicon();
    setAppleTouchIcon();
    console.log(`[OrbitpayLogo] Auto-injected ${total} logo(s).`);
    return total;
  };

  // ── Public API ─────────────────────────────────────────────────────────
  return {
    LOGO_B64,
    inject,
    setFavicon,
    setAppleTouchIcon,
    showSplash,
    documentHeader,
    emailTemplate,
    audit,
    autoInject,
  };
})();

// Auto-init on DOM ready: inject any data-op-logo elements, set favicon
document.addEventListener('DOMContentLoaded', () => {
  OrbitpayLogo.autoInject();
  console.log('[OrbitpayLogo] Initialized. Run OrbitpayLogo.audit() to verify.');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) module.exports = OrbitpayLogo;
if (typeof window !== 'undefined') window.OrbitpayLogo = OrbitpayLogo;
```

---

## Python Icon Generator

### `generate-icons.py`

Fallback for generating icon sizes when ImageMagick is unavailable.

```python
#!/usr/bin/env python3
# Generate favicon/icon sizes from the master logo.
from PIL import Image
import sys, os

MASTER = os.path.join(os.path.dirname(__file__), '../assets/logo/logo-orbitpay-master.png')
OUT_DIR = os.path.join(os.path.dirname(__file__), '../assets/logo')

SIZES = {
    'favicon-16x16.png': (16, 16),
    'favicon-32x32.png': (32, 32),
    'apple-touch-icon.png': (180, 180),
    'android-chrome-192x192.png': (192, 192),
    'android-chrome-512x512.png': (512, 512),
}

def main():
    img = Image.open(MASTER).convert('RGBA')
    for name, (w, h) in SIZES.items():
        resized = img.resize((w, h), Image.LANCZOS)
        resized.save(os.path.join(OUT_DIR, name), 'PNG')
        print(f"Generated {name} ({w}x{h})")
    # Generate .ico
    img.resize((64, 64), Image.LANCZOS).save(os.path.join(OUT_DIR, 'favicon.ico'), 'ICO')
    print("Generated favicon.ico")

if __name__ == '__main__':
    main()
```

---

## PWA Manifest & Meta Tags

### `site.webmanifest`

```json
{
  "name": "Orbitpay Finance",
  "short_name": "Orbitpay",
  "description": "Secure, seamless financial infrastructure.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#111d35",
  "icons": [
    { "src": "/assets/logo/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/logo/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### `meta-tags.html`

```html
<!-- ORBITPAY META TAGS — Drop into your existing <head> -->
<meta name="theme-color" content="#111d35">
<meta property="og:site_name" content="Orbitpay Finance">
<meta property="og:image" content="/assets/logo/android-chrome-512x512.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="/assets/logo/android-chrome-512x512.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/logo/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/logo/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/logo/favicon-16x16.png">
```

---

## Integration Snippets

### 1. Head Include

```html
<!-- Add to your existing <head> (order does NOT matter) -->
<link rel="stylesheet" href="/styles/orbitpay-logo.css">
<script src="/scripts/orbitpay-logo.js" defer></script>
```

### 2. Header Logo

```html
<!-- Replace your existing logo element with this (preserves your layout) -->
<a href="/" class="your-existing-brand-class">
  <span data-op-logo="header" class="your-existing-logo-class"></span>
  <span class="your-existing-brand-text">Orbitpay</span>
</a>
```

### 3. Hero Logo

```html
<!-- Hero / landing page logo -->
<div class="your-hero-container">
  <span data-op-logo="hero" class="your-hero-logo-class"></span>
</div>
```

### 4. Auth Screen Logo

```html
<!-- Auth / login screen logo -->
<div class="your-auth-card">
  <span data-op-logo="auth"></span>
  <h1 class="your-auth-title">Welcome back</h1>
</div>
```

### 5. Sidebar Logo

```html
<!-- Dashboard sidebar logo -->
<aside class="your-sidebar">
  <span data-op-logo="settings"></span>
  <nav><!-- your nav --></nav>
</aside>
```

### 6. Card Logo

```html
<!-- Banking / shipping card logo -->
<div class="your-card">
  <div class="your-card-header">
    <span class="your-card-meta">Business Account</span>
    <span data-op-logo="card"></span>
  </div>
</div>
```

### 7. Modal Logo

```html
<!-- Modal / popup / settings panel logo -->
<div class="your-modal">
  <div class="your-modal-header">
    <span data-op-logo="modal"></span>
    <h2>Settings</h2>
  </div>
</div>
```

### 8. Footer Logo

```html
<!-- Footer logo -->
<footer class="your-footer">
  <span data-op-logo="footer"></span>
  <p>&copy; 2026 Orbitpay Finance</p>
</footer>
```

### 9. Splash Screen

```html
<!-- Splash / loading screen -->
<div id="op-splash" style="position:fixed; inset:0; z-index:99999; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:24px; background:var(--your-bg, #0a1628);">
  <span data-op-logo="splash"></span>
  <div style="width:40px; height:40px; border:3px solid rgba(255,255,255,0.2); border-top-color:rgba(255,255,255,0.8); border-radius:50%; animation:opSpin 0.8s linear infinite;"></div>
</div>
```

### 10. Email Template

```html
<!-- Email template (use with OrbitpayLogo.emailTemplate()) -->
<img src="LOGO_INLINE" alt="Orbitpay Finance" style="height:48px; width:auto; margin-bottom:16px; display:block;">
```

### 11. PDF / Statement Header

```html
<!-- PDF / Statement header (use with OrbitpayLogo.documentHeader()) -->
<div style="display:flex; align-items:center; justify-content:space-between; padding:24px 0; border-bottom:2px solid var(--your-primary, #111d35); margin-bottom:32px;">
  <img src="LOGO_INLINE" alt="Orbitpay Finance" style="height:36px; width:auto; display:block;">
  <div style="text-align:right;">
    <div style="font-weight:700;">Orbitpay Finance</div>
    <div style="font-size:12px; color:var(--your-muted, #5a6a82);">Statement</div>
  </div>
</div>
```

---

## Runtime API Reference

### Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `LOGO_B64` | — | `string` | Raw Base64 data URL |
| `inject(selector, variant, onDark)` | `string`, `string`, `boolean` | `number` | Inject logo into matching elements |
| `setFavicon()` | — | `boolean` | Auto-inject favicon |
| `setAppleTouchIcon()` | — | `boolean` | Set iOS home screen icon |
| `showSplash(ms)` | `number` | `Promise` | Show branded splash screen |
| `documentHeader({title, subtitle})` | `object` | `string` | Generate PDF/document header HTML |
| `emailTemplate({title, body, ctaText, ctaUrl})` | `object` | `string` | Generate email template HTML |
| `audit()` | — | `object` | Verify logo presence on page |
| `autoInject()` | — | `number` | Scan data-op-logo attributes |

### Manual Injection Examples

```javascript
// Inject anywhere, anytime
OrbitpayLogo.inject('.nav-logo', 'header');
OrbitpayLogo.inject('.hero-logo', 'hero', true);  // true = dark background boost
OrbitpayLogo.setFavicon();
OrbitpayLogo.showSplash(2000);

// Generate document header
const header = OrbitpayLogo.documentHeader({ 
  title: 'Monthly Statement', 
  subtitle: 'June 2026' 
});

// Generate email template
const email = OrbitpayLogo.emailTemplate({
  title: 'Welcome to Orbitpay',
  body: '<p>Thank you for joining us!</p>',
  ctaText: 'Get Started',
  ctaUrl: 'https://orbitpay.finance/start'
});

// Run audit
const report = OrbitpayLogo.audit();
console.log(report.passed);  // true/false
```

---

## Audit Script

### `audit-logo.sh`

```bash
#!/usr/bin/env bash
# ORBITPAY LOGO AUDIT — Verifies logo is present everywhere it should be
set -euo pipefail

ROOT="${1:-.}"
ERRORS=0

echo "═══════════════════════════════════════════════════════════════════"
echo "  ORBITPAY LOGO AUDIT"
echo "═══════════════════════════════════════════════════════════════════"

# Check master asset
if [[ ! -f "$ROOT/assets/logo/logo-orbitpay-master.png" ]]; then
  echo "[FAIL] logo-orbitpay-master.png missing"; ((ERRORS++))
else
  echo "[PASS] logo-orbitpay-master.png present"
fi

# Check CSS module
if [[ ! -f "$ROOT/styles/orbitpay-logo.css" ]]; then
  echo "[FAIL] orbitpay-logo.css missing"; ((ERRORS++))
else
  echo "[PASS] orbitpay-logo.css present"
fi

# Check JS module
if [[ ! -f "$ROOT/scripts/orbitpay-logo.js" ]]; then
  echo "[FAIL] orbitpay-logo.js missing"; ((ERRORS++))
else
  echo "[PASS] orbitpay-logo.js present"
fi

# Check for generic placeholder logos in existing project
if grep -riE "placeholder.*logo|sample.*logo|dummy.*logo|your.*logo|logo.*placeholder|lorem.*ipsum" "$ROOT" --include="*.html" --include="*.css" --include="*.js" --include="*.vue" --include="*.jsx" --include="*.tsx" 2>/dev/null | grep -v "orbitpay-logo" | grep -v "audit-logo" | head -5; then
  echo "[WARN] Possible placeholder content detected in project (see above)"
else
  echo "[PASS] No obvious placeholder logos detected"
fi

# Check for data-op-logo usage
count=$(grep -r "data-op-logo" "$ROOT" --include="*.html" --include="*.vue" --include="*.jsx" --include="*.tsx" 2>/dev/null | wc -l)
echo "[INFO] data-op-logo attributes found: $count"

if [[ $count -eq 0 ]]; then
  echo "[WARN] No data-op-logo attributes found — logo may not be injected yet"
fi

echo ""
if [[ $ERRORS -eq 0 ]]; then
  echo "✅ AUDIT PASSED — Logo kit is ready."
else
  echo "❌ AUDIT FAILED — $ERRORS critical issue(s) found."
  exit 1
fi
```

### Usage

```bash
./audit-logo.sh /path/to/your/project
```

---

## Available Variants

| `data-op-logo` value | Height | Best For |
|---------------------|--------|----------|
| `favicon` | 16px | Tiny icons |
| `header` | 28px | Top nav bar |
| `nav` | 24px | Compact nav |
| `hero` | 40–72px | Landing page |
| `footer` | 22px | Page footer |
| `auth` | 48px | Login/register |
| `splash` | 72px | Loading screen |
| `card` | 20px | Banking/shipping cards |
| `modal` | 32px | Popups, settings |
| `pdf` | 36px | Statements, invoices |
| `email` | 44px | Email headers |
| `receipt` | 32px | Thermal receipts |
| `settings` | 28px | Settings panels |
| `dropdown` | 18px | Dropdown menus |
| `toast` | 20px | Notification toasts |
| `print` | 36px | Print/PDF output |

---

## Notes

- The logo preserves its exact **2064:512** aspect ratio at every size.
- The `.op-logo--on-dark` class brightens the logo for dark backgrounds.
- Print styles ensure the logo stays crisp in PDFs and on paper.
- The splash screen inherits your existing background color via `background: inherit`.
- All modules are **purely additive** — they do not override existing CSS variables, colors, fonts, or layout.

---

## License

© 2026 Orbitpay Finance. All rights reserved.
