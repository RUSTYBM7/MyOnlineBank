#!/usr/bin/env bash
# ============================================================
# OrbitPay - Build IPA Script
# Usage:
#   ./scripts/build-ipa.sh [debug|release|adhoc]
#   ./scripts/build-ipa.sh release
# ============================================================
set -euo pipefail

# ─── Colors ───────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# ─── Variables ────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
IOS_DIR="$PROJECT_DIR/ios"
BUILD_DIR="$PROJECT_DIR/build"
BUILD_TYPE="${1:-release}"

WORKSPACE="$IOS_DIR/OrbitPay.xcworkspace"
SCHEME="OrbitPay"
CONFIGURATION="Release"
EXPORT_METHOD="app-store"
OUTPUT_NAME="OrbitPay.ipa"

# ─── Validate build type ──────────────────────────────────
case "$BUILD_TYPE" in
  debug)
    CONFIGURATION="Debug"
    EXPORT_METHOD="development"
    OUTPUT_NAME="OrbitPay-Debug.ipa"
    ;;
  release)
    CONFIGURATION="Release"
    EXPORT_METHOD="app-store"
    OUTPUT_NAME="OrbitPay.ipa"
    ;;
  adhoc)
    CONFIGURATION="Release"
    EXPORT_METHOD="ad-hoc"
    OUTPUT_NAME="OrbitPay-AdHoc.ipa"
    ;;
  *)
    error "Unknown build type: $BUILD_TYPE. Use: debug | release | adhoc"
    ;;
esac

info "Building OrbitPay ($CONFIGURATION / $EXPORT_METHOD)"
info "Output: $BUILD_DIR/$OUTPUT_NAME"
echo ""

# ─── Preflight checks ─────────────────────────────────────
command -v xcodebuild &>/dev/null || error "xcodebuild not found. Install Xcode from the App Store."
command -v node       &>/dev/null || error "Node.js not found. Install from https://nodejs.org"

if [[ ! -d "$IOS_DIR" ]]; then
  error "ios/ directory not found at $IOS_DIR"
fi

# ─── Install dependencies ─────────────────────────────────
info "Installing Node dependencies..."
cd "$PROJECT_DIR"
npm install --legacy-peer-deps
success "Node dependencies installed"

# ─── Install CocoaPods ────────────────────────────────────
if ! command -v pod &>/dev/null; then
  warn "CocoaPods not found, installing..."
  sudo gem install cocoapods
fi

info "Installing CocoaPods dependencies..."
cd "$IOS_DIR"
pod install --repo-update
success "CocoaPods installed"

# ─── Create build directory ───────────────────────────────
mkdir -p "$BUILD_DIR"

# ─── Archive ──────────────────────────────────────────────
ARCHIVE_PATH="$BUILD_DIR/OrbitPay.xcarchive"

info "Archiving with xcodebuild..."
xcodebuild archive \
  -workspace   "$WORKSPACE" \
  -scheme      "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -archivePath "$ARCHIVE_PATH" \
  -destination "generic/platform=iOS" \
  CODE_SIGN_STYLE=Automatic \
  DEVELOPMENT_TEAM="${APPLE_TEAM_ID:-}" \
  | xcpretty --color || \
xcodebuild archive \
  -workspace   "$WORKSPACE" \
  -scheme      "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -archivePath "$ARCHIVE_PATH" \
  -destination "generic/platform=iOS" \
  CODE_SIGN_STYLE=Automatic \
  DEVELOPMENT_TEAM="${APPLE_TEAM_ID:-}"

success "Archive created at $ARCHIVE_PATH"

# ─── Export IPA ───────────────────────────────────────────
EXPORT_OPTIONS_PLIST="$BUILD_DIR/ExportOptions.plist"

cat > "$EXPORT_OPTIONS_PLIST" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>${EXPORT_METHOD}</string>
    <key>teamID</key>
    <string>${APPLE_TEAM_ID:-}</string>
    <key>compileBitcode</key>
    <false/>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>uploadSymbols</key>
    <true/>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
PLIST

info "Exporting IPA..."
xcodebuild -exportArchive \
  -archivePath     "$ARCHIVE_PATH" \
  -exportPath      "$BUILD_DIR" \
  -exportOptionsPlist "$EXPORT_OPTIONS_PLIST" \
  | xcpretty --color 2>/dev/null || \
xcodebuild -exportArchive \
  -archivePath     "$ARCHIVE_PATH" \
  -exportPath      "$BUILD_DIR" \
  -exportOptionsPlist "$EXPORT_OPTIONS_PLIST"

# ─── Rename output ────────────────────────────────────────
if [[ -f "$BUILD_DIR/OrbitPay.ipa" && "$OUTPUT_NAME" != "OrbitPay.ipa" ]]; then
  mv "$BUILD_DIR/OrbitPay.ipa" "$BUILD_DIR/$OUTPUT_NAME"
fi

# ─── Success ──────────────────────────────────────────────
echo ""
success "======================================"
success " IPA built successfully!"
success " Location: $BUILD_DIR/$OUTPUT_NAME"
success " Size: $(du -sh "$BUILD_DIR/$OUTPUT_NAME" | cut -f1)"
success "======================================"
echo ""
info "Next steps:"
echo "  • Install on device:  cfgutil install-app $BUILD_DIR/$OUTPUT_NAME"
echo "  • Upload to TestFlight: fastlane beta"
echo "  • Distribute via Diawi: open https://www.diawi.com and upload the IPA"
