#!/usr/bin/env bash
# ============================================================
# OrbitPay - Setup Script
# Installs all dependencies for local development
# Usage: ./scripts/setup.sh
# ============================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

echo ""
echo "  ██████╗ ██████╗ ██████╗ ██╗████████╗██████╗  █████╗ ██╗   ██╗"
echo "  ██╔═══██╗██╔══██╗██╔══██╗██║╚══██╔══╝██╔══██╗██╔══██╗╚██╗ ██╔╝"
echo "  ██║   ██║██████╔╝██████╔╝██║   ██║   ██████╔╝███████║ ╚████╔╝ "
echo "  ██║   ██║██╔══██╗██╔══██╗██║   ██║   ██╔═══╝ ██╔══██║  ╚██╔╝  "
echo "  ╚██████╔╝██║  ██║██████╔╝██║   ██║   ██║     ██║  ██║   ██║   "
echo "   ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝   ╚═╝     ╚═╝  ╚═╝   ╚═╝   "
echo ""
echo "  iOS Setup Script"
echo ""

# ─── Check macOS ──────────────────────────────────────────
if [[ "$OSTYPE" != "darwin"* ]]; then
  error "iOS development requires macOS. Current OS: $OSTYPE"
fi
success "Running on macOS $(sw_vers -productVersion)"

# ─── Check Xcode ──────────────────────────────────────────
if ! command -v xcodebuild &>/dev/null; then
  error "Xcode not found. Install from: https://apps.apple.com/us/app/xcode/id497799835"
fi
XCODE_VERSION=$(xcodebuild -version 2>&1 | head -1)
success "Found $XCODE_VERSION"

# ─── Check Xcode Command Line Tools ───────────────────────
if ! xcode-select -p &>/dev/null; then
  warn "Installing Xcode Command Line Tools..."
  xcode-select --install
fi
success "Xcode Command Line Tools available"

# ─── Accept Xcode license ─────────────────────────────────
sudo xcodebuild -runFirstLaunch 2>/dev/null || true

# ─── Check Homebrew ───────────────────────────────────────
if ! command -v brew &>/dev/null; then
  warn "Homebrew not found, installing..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
success "Homebrew $(brew --version | head -1)"

# ─── Install Node.js (via nvm or brew) ────────────────────
if ! command -v node &>/dev/null; then
  if command -v nvm &>/dev/null; then
    nvm install 20
    nvm use 20
  else
    warn "Installing Node.js via Homebrew..."
    brew install node@20
    brew link node@20 --force
  fi
fi
NODE_VERSION=$(node --version)
success "Node.js $NODE_VERSION"

if ! command -v npm &>/dev/null; then
  error "npm not found. Reinstall Node.js"
fi
success "npm $(npm --version)"

# ─── Install yarn (optional but recommended) ──────────────
if ! command -v yarn &>/dev/null; then
  info "Installing Yarn..."
  npm install -g yarn
fi
success "Yarn $(yarn --version)"

# ─── Install Ruby (via rbenv or system) ───────────────────
if ! command -v rbenv &>/dev/null; then
  info "Installing rbenv..."
  brew install rbenv ruby-build
  echo 'eval "$(rbenv init -)"' >> ~/.zshrc
  eval "$(rbenv init -)"
fi

RUBY_VERSION="3.2.2"
if ! rbenv versions | grep -q "$RUBY_VERSION"; then
  info "Installing Ruby $RUBY_VERSION..."
  rbenv install "$RUBY_VERSION"
fi
rbenv local "$RUBY_VERSION" 2>/dev/null || true
success "Ruby $(ruby --version | awk '{print $2}')"

# ─── Install CocoaPods ────────────────────────────────────
if ! command -v pod &>/dev/null; then
  info "Installing CocoaPods..."
  gem install cocoapods
fi
success "CocoaPods $(pod --version)"

# ─── Install Fastlane ─────────────────────────────────────
if ! command -v fastlane &>/dev/null; then
  info "Installing Fastlane..."
  gem install fastlane
fi
success "Fastlane $(fastlane --version | head -1 | awk '{print $NF}')"

# ─── Install xcpretty ─────────────────────────────────────
if ! command -v xcpretty &>/dev/null; then
  info "Installing xcpretty..."
  gem install xcpretty
fi
success "xcpretty installed"

# ─── Install Node modules ─────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

info "Installing Node.js dependencies..."
cd "$PROJECT_DIR"
npm install --legacy-peer-deps
success "Node modules installed"

# ─── Install CocoaPods dependencies ───────────────────────
info "Installing CocoaPods dependencies..."
cd "$PROJECT_DIR/ios"
pod install --repo-update
success "CocoaPods dependencies installed"

# ─── Create .env file ─────────────────────────────────────
if [[ ! -f "$PROJECT_DIR/.env" ]]; then
  info "Creating .env file from template..."
  cat > "$PROJECT_DIR/.env" << 'ENV'
# OrbitPay Environment Variables
# Copy this file and fill in your values

# API
API_BASE_URL=https://8145kvozdhay.space.minimax.io

# Apple Developer (required for code signing)
APPLE_ID=your-apple-id@email.com
APPLE_TEAM_ID=XXXXXXXXXX
ITC_TEAM_ID=XXXXXXXXXX

# Fastlane Match (certificates)
MATCH_GIT_URL=https://github.com/your-org/orbitpay-certificates
MATCH_PASSWORD=your-match-encryption-password

# App Store Connect API
APP_STORE_CONNECT_API_KEY_ID=XXXXXXXXXX
APP_STORE_CONNECT_API_ISSUER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
APP_STORE_CONNECT_API_KEY_CONTENT=<base64-encoded-p8-file>

# Slack (optional)
SLACK_URL=https://hooks.slack.com/services/...
ENV
  success ".env file created — fill in your credentials"
fi

# ─── Success ──────────────────────────────────────────────
echo ""
success "========================================"
success " OrbitPay iOS setup complete!"
success "========================================"
echo ""
echo "  Next steps:"
echo ""
echo "  1. Start Metro bundler:"
echo "     npm start"
echo ""
echo "  2. Run on iOS simulator:"
echo "     npm run ios"
echo ""
echo "  3. Build development IPA:"
echo "     ./scripts/build-ipa.sh debug"
echo ""
echo "  4. Build release IPA:"
echo "     ./scripts/build-ipa.sh release"
echo ""
echo "  5. Upload to TestFlight:"
echo "     fastlane beta"
echo ""
