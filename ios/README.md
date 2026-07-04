# OrbitPay — iOS Mobile Banking Application

A production-ready React Native iOS banking application for the OrbitPay Credit Union Platform.

**Bundle ID:** `com.orbitpay.creditunion`
**Minimum iOS:** 15.1
**React Native:** 0.75.5

---

## Features

- Face ID / Touch ID biometric authentication
- Multi-account dashboard (checking, savings, joint)
- Real-time transaction history with category icons
- Multi-step fund transfers (internal / external / wire)
- Card management with freeze/unfreeze and virtual cards
- Bill pay with auto-pay scheduling
- KYC identity verification with document upload
- Push notifications with grouped feed
- Live support chat with quick replies
- Dark mode with glassmorphism design system
- Secure credential storage via iOS Keychain

---

## Prerequisites

| Tool       | Version   | Install                                     |
|------------|-----------|---------------------------------------------|
| macOS      | 13+       | Required for iOS development                |
| Xcode      | 15.x      | App Store or developer.apple.com            |
| Node.js    | 20.x      | https://nodejs.org or `brew install node@20`|
| npm        | 10.x      | Bundled with Node.js                        |
| CocoaPods  | 1.15+     | `sudo gem install cocoapods`                |
| Ruby       | 3.2+      | `brew install ruby` or rbenv                |
| Fastlane   | 2.220+    | `gem install fastlane`                      |

---

## Quick Start

### 1. Automated Setup

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This installs all dependencies automatically (Node, CocoaPods, Fastlane, etc.).

### 2. Manual Setup

```bash
# Install Node.js dependencies
npm install --legacy-peer-deps

# Install iOS native dependencies
cd ios && pod install && cd ..

# Start the Metro bundler
npm start
```

### 3. Run on iOS Simulator

```bash
# Default (iPhone 15 Pro)
npm run ios

# Specific simulator
npx react-native run-ios --simulator="iPhone 15 Pro Max"

# List available simulators
xcrun simctl list devices available
```

### 4. Run on Physical Device

```bash
# Connect iPhone via USB, then:
npx react-native run-ios --device "My iPhone"
```

---

## Building an IPA

### Option A: Build Script (Recommended)

```bash
# Debug IPA (development signing)
./scripts/build-ipa.sh debug

# Release IPA (App Store signing)
./scripts/build-ipa.sh release

# AdHoc IPA (beta distribution)
./scripts/build-ipa.sh adhoc
```

Output: `./build/OrbitPay.ipa`

### Option B: Fastlane

```bash
# Development IPA
fastlane build_dev

# Release IPA
fastlane build_release

# Upload to TestFlight
fastlane beta

# Submit to App Store
fastlane release
```

### Option C: Xcode GUI

1. Open `ios/OrbitPay.xcworkspace` in Xcode
2. Select **Product > Destination > Any iOS Device (arm64)**
3. Select **Product > Archive**
4. In the Organizer, click **Distribute App**
5. Choose distribution method (App Store / AdHoc / Enterprise)
6. Export IPA

### Option D: xcodebuild CLI

```bash
# Archive
xcodebuild archive \
  -workspace ios/OrbitPay.xcworkspace \
  -scheme OrbitPay \
  -configuration Release \
  -archivePath build/OrbitPay.xcarchive \
  -destination "generic/platform=iOS"

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/OrbitPay.xcarchive \
  -exportPath build/ \
  -exportOptionsPlist ExportOptions.plist
```

---

## Project Structure

```
ios/
├── src/
│   ├── App.tsx                         # Root component
│   ├── navigation/
│   │   └── AppNavigator.tsx            # Navigation stack + bottom tabs
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SplashScreen.tsx        # Animated splash
│   │   │   ├── OnboardingScreen.tsx    # 4-slide onboarding
│   │   │   ├── LoginScreen.tsx         # Login (email/member/phone)
│   │   │   └── BiometricScreen.tsx     # Face ID / Touch ID
│   │   ├── main/
│   │   │   ├── HomeScreen.tsx          # Dashboard
│   │   │   ├── TransferScreen.tsx      # Multi-step transfer
│   │   │   ├── AccountsScreen.tsx      # Account list
│   │   │   ├── CardsScreen.tsx         # Card carousel
│   │   │   └── BillsScreen.tsx         # Bills & payments
│   │   └── secondary/
│   │       ├── ProfileScreen.tsx       # Settings
│   │       ├── KycScreen.tsx           # Identity verification
│   │       ├── NotificationsScreen.tsx # Notification feed
│   │       ├── SupportScreen.tsx       # Live support chat
│   │       ├── TransactionDetailScreen.tsx
│   │       ├── AccountDetailScreen.tsx
│   │       ├── ChangePasswordScreen.tsx
│   │       └── LinkedAccountsScreen.tsx
│   ├── components/
│   │   ├── common/UIComponents.tsx     # Design system components
│   │   └── cards/AccountCard.tsx       # Account card
│   ├── services/
│   │   ├── apiClient.ts                # Axios + JWT refresh
│   │   ├── authService.ts              # Auth + Biometrics
│   │   ├── apiServices.ts              # All API calls
│   │   └── mockDataService.ts          # Demo data seeder
│   ├── store/
│   │   └── index.ts                    # Zustand store
│   ├── types/
│   │   └── index.ts                    # TypeScript types
│   └── utils/
│       ├── constants.ts                # Design tokens, endpoints
│       ├── formatters.ts               # Currency, date formatters
│       └── secureStorage.ts            # Keychain + AsyncStorage
├── ios/
│   ├── OrbitPay/
│   │   ├── AppDelegate.mm              # Native entry point
│   │   ├── AppDelegate.h
│   │   ├── main.m
│   │   ├── Info.plist                  # App permissions
│   │   ├── OrbitPay.entitlements       # Keychain, push, deep links
│   │   └── LaunchScreen.storyboard     # Launch screen
│   ├── OrbitPay.xcodeproj/
│   │   └── project.pbxproj             # Xcode project config
│   └── Podfile                         # CocoaPods config
├── fastlane/
│   ├── Fastfile                        # Build lanes
│   └── Appfile                         # App identifiers
├── scripts/
│   ├── setup.sh                        # Dev environment setup
│   └── build-ipa.sh                    # IPA build script
├── .github/
│   └── workflows/
│       └── ios-build.yml               # CI/CD pipeline
├── index.js                            # RN entry point
├── package.json
├── tsconfig.json
└── babel.config.js
```

---

## Environment Configuration

Create a `.env` file (or copy from `.env.example`):

```env
# API
API_BASE_URL=https://8145kvozdhay.space.minimax.io

# Apple Developer
APPLE_ID=developer@yourcompany.com
APPLE_TEAM_ID=XXXXXXXXXX
ITC_TEAM_ID=XXXXXXXXXX

# Fastlane Match (certificates repo)
MATCH_GIT_URL=https://github.com/your-org/certs-repo
MATCH_PASSWORD=your-encryption-password

# App Store Connect API
APP_STORE_CONNECT_API_KEY_ID=XXXXXXXXXX
APP_STORE_CONNECT_API_ISSUER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
APP_STORE_CONNECT_API_KEY_CONTENT=<base64-p8-content>
```

---

## Code Signing

### Development (Simulator + Personal Device)

For simulator testing, no code signing is required.

For personal device:
1. Open Xcode > Preferences > Accounts
2. Add your Apple ID
3. Select the **OrbitPay** target > Signing & Capabilities
4. Enable **Automatically manage signing**
5. Select your Personal Team

### Distribution (TestFlight / App Store)

Uses **Fastlane Match** to sync certificates across the team:

```bash
# Initialize Match (first time)
fastlane match init

# Download/create certificates
fastlane certs_dev       # Development
fastlane certs_release   # App Store distribution
```

Required secrets for CI (GitHub Actions > Settings > Secrets):
- `APPLE_ID`
- `APPLE_TEAM_ID`
- `ITC_TEAM_ID`
- `MATCH_GIT_URL`
- `MATCH_PASSWORD`
- `APP_STORE_CONNECT_API_KEY_ID`
- `APP_STORE_CONNECT_API_ISSUER_ID`
- `APP_STORE_CONNECT_API_KEY_CONTENT`

---

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ios-build.yml`):

| Trigger          | Job                    | Description                  |
|------------------|------------------------|------------------------------|
| PR / develop     | `lint`                 | TypeScript + ESLint checks   |
| PR / develop     | `test`                 | Jest unit tests              |
| develop push     | `build-debug`          | Simulator build validation   |
| main push        | `deploy-testflight`    | Build + TestFlight upload    |
| Tag `v*.*.*`     | `deploy-appstore`      | App Store submission         |

---

## Design System

### Color Palette

```typescript
Primary (Emerald): #10B981  →  #059669  →  #047857
Teal:              #14B8A6  →  #0D9488  →  #0F766E
Cyan:              #06B6D4  →  #0891B2  →  #0E7490
```

### Component Library (`src/components/common/UIComponents.tsx`)

- `GlassCard` — frosted glass surface (light/dark)
- `GradientButton` — primary CTA (sm/md/lg sizes)
- `OutlineButton` — secondary action
- `InputField` — form input with validation
- `StatusBadge` — auto-colored status indicator
- `PillTabs` — segmented control
- `EmptyState` — empty state placeholder
- `SkeletonBox` — loading skeleton

---

## API Integration

Base URL: `https://8145kvozdhay.space.minimax.io`

Authentication: JWT Bearer tokens stored in iOS Keychain via `react-native-keychain`.

Automatic token refresh on 401 responses via request queue pattern in `src/services/apiClient.ts`.

**Demo mode:** When API is unavailable, the app falls back to mock data seeded by `MockDataService.seed()`. All screens are fully functional offline.

---

## Troubleshooting

### Metro bundler port conflict
```bash
npx react-native start --port 8082
```

### CocoaPods install fails
```bash
cd ios
pod repo update
pod install --repo-update --clean-install
```

### Build error: "No signing certificate found"
```bash
# For simulator builds (skip signing)
xcodebuild ... CODE_SIGNING_ALLOWED=NO

# For device builds
# Ensure your Apple ID is added in Xcode > Preferences > Accounts
```

### Hermes engine issues
```bash
cd ios && pod install
npm start -- --reset-cache
```

### Simulator not found
```bash
xcrun simctl list devices available | grep iPhone
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### Keychain access errors (simulator)
The simulator does not support `react-native-keychain` biometrics fully. Run on a physical device for complete testing of biometric authentication.

---

## Available npm Scripts

```bash
npm start              # Start Metro bundler
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
npm test               # Jest unit tests
npm run lint           # ESLint
npm run build:ios      # Build release .app
npm run build:ipa      # Build release IPA (requires signing)
npm run pods           # Install CocoaPods
```

---

## Security Notes

- All credentials stored in iOS Keychain (hardware-encrypted)
- Biometric authentication via `react-native-biometrics`
- Certificate pinning can be added in `apiClient.ts`
- HTTPS enforced (NSAppTransportSecurity configured)
- JWT tokens expire in 1 hour; auto-refreshed silently
- No credentials stored in AsyncStorage or logs

---

## License

Copyright 2024 OrbitPay Credit Union. All rights reserved.

---

*Built with React Native 0.75.5 · Designed for iOS 15.1+*
