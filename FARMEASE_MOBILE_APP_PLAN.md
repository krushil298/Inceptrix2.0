# 🌾 FarmEase - Mobile App Development Plan
## "From Soil to Sale"

> **Team #1 — Jain University**
> | Member | Role |
> |---|---|
> | Krushil Uchadadia | Team Leader |
> | Vijyot Balyan | AI/ML Developer |
> | Archi Jain | Backend Developer |
> | Shirin Lohiya | Frontend Developer |
> | Aum Patel | UI/UX Designer |

---

## 📋 1. Project Summary (Extracted from PDF)

### Problem Statement
Indian farmers face critical challenges:
- **Government Schemes:** Unawareness of available support and benefits
- **Crop Planning:** Lack of reliable guidance for planting and harvesting
- **Soil Intelligence:** Insufficient knowledge about soil health and fertilizer needs
- **Disease Detection:** Difficulty identifying and preventing crop diseases early
- **Market Access:** Limited opportunities for fair pricing and direct sales

### Solution — FarmEase
An **AI-powered, all-in-one digital farming assistant** that simplifies crop planning, disease management, input selection, and market access.

### Unique Value Proposition
- **All-in-One Platform:** Integrates crop planning, disease control, and market access
- **Farmer-Friendly Design:** Multilingual, mobile-first, easy to use
- **Data-Driven Decisions:** Replaces guesswork with AI-actionable insights

---

## 🎯 2. Core Features Breakdown

### Feature 1: 🔐 Authentication & Onboarding
- Sign Up / Sign In (Phone OTP preferred for rural users)
- Language selection (Hindi, English, Kannada, Tamil, Telugu, etc.)
- Profile setup (farm location, land size, crop history)
- Onboarding tutorial walkthrough

### Feature 2: 🏠 FarmEase Dashboard
- Weather widget (current + 7-day forecast)
- Quick action cards (Disease Detection, Crop Recommendation, Marketplace)
- Active crop health status
- Government scheme notifications
- Seasonal farming tips carousel

### Feature 3: 🔬 AI Disease Detection
- Camera integration for crop image capture
- Image upload from gallery
- AI-powered disease identification with confidence score
- Treatment recommendations with product suggestions
- Disease history log per crop
- Offline mode for low-connectivity areas

### Feature 4: 🌱 Smart Crop Recommendation
- Input: Soil type, pH level, climate data, location
- ML model suggests best crops for the season
- Expected yield predictions
- Water & resource requirement estimates
- Historical crop performance data

### Feature 5: 🧪 Fertilizer Advisory
- Input: Soil nutrient details (N, P, K levels)
- AI predicts optimal fertilizer type & quantity
- Application schedule/calendar
- Cost optimization suggestions
- Integration with local fertilizer suppliers

### Feature 6: 🛒 Digital Marketplace
- **For Sellers (Farmers):**
  - List crops with photos, quantity, price
  - Order management dashboard
  - Payment tracking
- **For Buyers:**
  - Browse available crops by category/location
  - Cart & checkout flow
  - Delivery tracking
- **Platform Features:**
  - Fair price suggestions (based on mandi rates)
  - Rating & review system
  - In-app chat between buyer & seller

### Feature 7: 📚 E-Learning & Government Schemes
- Curated list of government schemes with eligibility checker
- Video tutorials on farming best practices
- Push notifications for new schemes & deadlines
- Step-by-step application guides

### Feature 8: 📊 Farm Analytics
- Crop yield tracking over seasons
- Expense & income tracker
- Profit/loss reports
- Soil health trends

---

## 🏗️ 3. App Architecture

```
┌─────────────────────────────────────────────────┐
│                  MOBILE APP                      │
│  (React Native / Flutter / Kotlin+Swift)         │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │   Auth    │ │Dashboard │ │  Disease         │ │
│  │  Module   │ │  Module  │ │  Detection       │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │   Crop   │ │Fertilizer│ │   Marketplace    │ │
│  │  Recomm. │ │ Advisory │ │     Module       │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│  ┌──────────┐ ┌──────────┐                      │
│  │E-Learning│ │ Analytics│                      │
│  │  Module  │ │  Module  │                      │
│  └──────────┘ └──────────┘                      │
│                                                  │
├─────────────────────────────────────────────────┤
│              API LAYER (REST / GraphQL)           │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌───────────────────────────────────────────┐   │
│  │           BACKEND SERVER                   │  │
│  │  ┌─────────┐ ┌────────┐ ┌──────────────┐ │  │
│  │  │Auth API │ │CRUD API│ │Payment API   │ │  │
│  │  └─────────┘ └────────┘ └──────────────┘ │  │
│  │  ┌─────────┐ ┌────────┐ ┌──────────────┐ │  │
│  │  │ML Model │ │Weather │ │Notification  │ │  │
│  │  │ Server  │ │  API   │ │   Service    │ │  │
│  │  └─────────┘ └────────┘ └──────────────┘ │  │
│  └───────────────────────────────────────────┘   │
│                                                  │
├─────────────────────────────────────────────────┤
│              DATABASE & STORAGE                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ MongoDB/ │ │ Firebase │ │   Cloud Storage  │ │
│  │PostgreSQL│ │  (Auth)  │ │  (Images/Models) │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 📱 4. Tech Stack Options

### 🔷 OPTION A: React Native (Recommended for your team)
> **Best if:** Your team already knows React/TypeScript (which they do per the PDF!)

| Layer | Technology | Why |
|---|---|---|
| **Mobile Framework** | React Native + Expo | Cross-platform (iOS + Android), leverages existing React/TS skills |
| **Language** | TypeScript | Type safety, already in your stack |
| **UI Library** | React Native Paper / NativeWind (Tailwind for RN) | Beautiful Material Design components |
| **Navigation** | React Navigation v6 | Industry standard for RN |
| **State Management** | Zustand or Redux Toolkit | Lightweight & powerful |
| **Backend** | Node.js + Express | Already in your stack |
| **Database** | MongoDB (Atlas) | Already in your stack, flexible schema |
| **Auth** | Firebase Auth | Phone OTP, Google sign-in, easy setup |
| **AI/ML Serving** | FastAPI (Python) | Serve TensorFlow/Scikit-learn models via REST |
| **Image Storage** | Firebase Storage / Cloudinary | Crop images for disease detection |
| **Push Notifications** | Firebase Cloud Messaging (FCM) | Free, reliable |
| **Maps/Location** | React Native Maps + Google Maps API | Farm location & marketplace |
| **Payments** | Razorpay SDK | UPI, cards — India-focused |
| **Deployment** | Vercel (API) + Railway/Render (ML) | Easy & affordable |

**✅ Pros:** Matches your existing skills, huge ecosystem, fast development, one codebase for iOS+Android
**⚠️ Cons:** Slightly lower performance than native for heavy animations

---

### 🔶 OPTION B: Flutter
> **Best if:** You want the best UI/UX experience with pixel-perfect designs

| Layer | Technology | Why |
|---|---|---|
| **Mobile Framework** | Flutter | Beautiful native-compiled apps |
| **Language** | Dart | Easy to learn, strong typing |
| **UI Library** | Material 3 (built-in) | Google's design system, gorgeous |
| **State Management** | Riverpod or BLoC | Robust state management |
| **Backend** | Node.js + Express (keep existing) | No change needed |
| **Database** | MongoDB Atlas / Supabase (PostgreSQL) | Flexible options |
| **Auth** | Firebase Auth | Same as Option A |
| **AI/ML Serving** | FastAPI (Python) | Same as Option A |
| **Camera/Image** | Flutter camera + image_picker | Excellent camera integration |
| **Maps** | Google Maps Flutter | Native Google Maps |
| **Payments** | Razorpay Flutter SDK | India-focused payments |

**✅ Pros:** Best UI performance, gorgeous animations, great camera support, single codebase
**⚠️ Cons:** Team needs to learn Dart (moderate learning curve), smaller ecosystem than RN

---

### 🟢 OPTION C: Native (Kotlin + Swift)
> **Best if:** You want maximum performance and native feel

| Layer | Technology | Why |
|---|---|---|
| **Android** | Kotlin + Jetpack Compose | Modern Android UI toolkit |
| **iOS** | Swift + SwiftUI | Modern iOS UI framework |
| **Backend** | Node.js + Express | Keep existing |
| **Database** | MongoDB Atlas | Keep existing |
| **AI/ML** | TensorFlow Lite (on-device) | Offline disease detection! |
| **Auth** | Firebase Auth | Same |

**✅ Pros:** Best performance, on-device ML possible, platform-specific features
**⚠️ Cons:** Two separate codebases, double the development effort, needs Kotlin + Swift expertise

---

### 🟣 OPTION D: Expo (React Native Simplified)
> **Best if:** You want the fastest possible development with the easiest setup

| Layer | Technology | Why |
|---|---|---|
| **Mobile Framework** | Expo (managed workflow) | Zero native config, OTA updates |
| **Language** | TypeScript | Already known |
| **UI** | Expo + Tamagui / Gluestack UI | Modern, fast UI libraries |
| **Camera** | expo-camera + expo-image-picker | Built-in, works out of the box |
| **Backend** | Node.js + Express | Keep existing |
| **Everything Else** | Same as Option A | — |

**✅ Pros:** Fastest to prototype, easy OTA updates, no Xcode/Android Studio needed initially
**⚠️ Cons:** Limited access to some native modules, slightly less flexible

---

## ⭐ CHOSEN STACK: **React Native + Expo (Option A)** ✅ CONFIRMED

**Why this was chosen:**
1. Your team already knows **React, TypeScript, and Tailwind CSS** — React Native is the smallest learning curve
2. Your backend is already **Node.js + Express + MongoDB** — no changes needed
3. **Expo** provides easy camera access for disease detection image capture
4. Single codebase means faster development for your team size
5. React Native handles **offline mode** well (important for rural connectivity)
6. Massive community support for any issues you encounter

### Final Tech Stack Summary:
| Layer | Technology |
|---|---|
| **Mobile** | React Native + Expo + TypeScript |
| **UI** | React Native Paper / NativeWind |
| **Navigation** | React Navigation v6 / Expo Router |
| **State** | Zustand |
| **Backend API** | Node.js + Express |
| **ML Server** | FastAPI (Python) |
| **Database** | MongoDB Atlas |
| **Auth** | Firebase Auth (Phone OTP) |
| **Storage** | Firebase Storage / Cloudinary |
| **Payments** | Razorpay |
| **Notifications** | Firebase Cloud Messaging |
| **Maps** | React Native Maps + Google Maps API |

---

## 📅 5. Development Phases & Timeline

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup (Expo/React Native + TypeScript)
- [ ] Design system & component library
- [ ] Navigation structure
- [ ] Authentication flow (Firebase Phone OTP)
- [ ] Basic dashboard layout

### Phase 2: Core AI Features (Week 3-5)
- [ ] Camera integration for disease detection
- [ ] Disease detection ML model API integration
- [ ] Crop recommendation module
- [ ] Fertilizer advisory module
- [ ] Backend API development for all ML endpoints

### Phase 3: Marketplace (Week 6-7)
- [ ] Product listing (create, read, update, delete)
- [ ] Search & filter functionality
- [ ] Cart & checkout flow
- [ ] Razorpay payment integration
- [ ] Order management

### Phase 4: Supporting Features (Week 8-9)
- [ ] Government schemes listing & eligibility
- [ ] E-learning content module
- [ ] Farm analytics dashboard
- [ ] Push notifications (FCM)
- [ ] Multi-language support (i18n)

### Phase 5: Polish & Launch (Week 10-11)
- [ ] Performance optimization
- [ ] Offline mode implementation
- [ ] UI/UX polish & animations
- [ ] Testing (unit + integration + E2E)
- [ ] Beta testing with real farmers
- [ ] App Store & Play Store submission

---

## 📂 6. Suggested Project Structure (React Native + Expo)

```
farmease-app/
├── app/                        # Expo Router screens
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/
│   │   ├── index.tsx           # Dashboard
│   │   ├── marketplace.tsx
│   │   ├── detect.tsx          # Disease Detection
│   │   └── profile.tsx
│   ├── crop-recommend.tsx
│   ├── fertilizer.tsx
│   ├── schemes.tsx
│   ├── analytics.tsx
│   └── _layout.tsx
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── dashboard/
│   │   ├── WeatherWidget.tsx
│   │   ├── QuickActions.tsx
│   │   └── CropStatus.tsx
│   ├── marketplace/
│   │   ├── ProductCard.tsx
│   │   ├── CartItem.tsx
│   │   └── CheckoutForm.tsx
│   └── detection/
│       ├── CameraView.tsx
│       ├── ResultCard.tsx
│       └── TreatmentSuggestion.tsx
├── services/
│   ├── api.ts                  # Axios/fetch config
│   ├── auth.ts                 # Firebase auth
│   ├── disease.ts              # Disease detection API
│   ├── crops.ts                # Crop recommendation API
│   ├── marketplace.ts          # Marketplace API
│   └── notifications.ts       # FCM setup
├── store/
│   ├── useAuthStore.ts         # Zustand auth store
│   ├── useCartStore.ts
│   └── useFarmStore.ts
├── hooks/
│   ├── useCamera.ts
│   ├── useLocation.ts
│   └── useWeather.ts
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   └── i18n.ts                 # Multi-language
├── assets/
│   ├── images/
│   ├── fonts/
│   └── animations/             # Lottie files
├── ml-backend/                 # Python ML server
│   ├── models/
│   │   ├── disease_model.h5
│   │   ├── crop_model.pkl
│   │   └── fertilizer_model.pkl
│   ├── routes/
│   │   ├── disease.py
│   │   ├── crop.py
│   │   └── fertilizer.py
│   ├── main.py                 # FastAPI entry point
│   └── requirements.txt
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── app.json                    # Expo config
├── package.json
└── tsconfig.json
```

---

## 🧠 7. AI/ML Model Details

| Model | Purpose | Input | Output | Framework |
|---|---|---|---|---|
| **Disease Detector** | Identify crop diseases from images | Crop leaf image (224x224) | Disease name + confidence + treatment | TensorFlow/Keras CNN |
| **Crop Recommender** | Suggest best crops | N, P, K, temp, humidity, pH, rainfall | Top 5 crop suggestions | Scikit-learn (Random Forest) |
| **Fertilizer Advisor** | Predict fertilizer needs | Soil type, crop, N, P, K levels | Fertilizer type + quantity | Scikit-learn (Decision Tree) |

### Datasets to Use:
- **Disease Detection:** PlantVillage dataset (54K images, 38 classes)
- **Crop Recommendation:** Indian crop dataset from Kaggle
- **Fertilizer:** Soil nutrient-fertilizer mapping dataset

---

## 🔌 8. Third-Party APIs & Services

| Service | Purpose | Cost |
|---|---|---|
| **OpenWeatherMap API** | Weather data for dashboard | Free tier (60 calls/min) |
| **Google Maps API** | Farm location & marketplace | Free tier (28K loads/month) |
| **Firebase Auth** | Phone OTP authentication | Free (10K verifications/month) |
| **Firebase Storage** | Image storage | Free (5GB) |
| **Razorpay** | Payment gateway (UPI, cards) | 2% per transaction |
| **Twilio (optional)** | SMS notifications | Pay per use |
| **data.gov.in API** | Government schemes data | Free |

---

## 🎨 9. UI/UX Design Guidelines

- **Color Palette:** Earthy greens (#2D6A4F, #40916C, #52B788), warm browns, cream backgrounds
- **Typography:** Clean, readable fonts (Poppins/Noto Sans — supports Indian languages)
- **Icons:** Agricultural-themed custom icons
- **Accessibility:** Large touch targets (48dp+), high contrast, voice input support
- **Offline First:** Cache critical data locally, sync when connected
- **Language Toggle:** Persistent, accessible from every screen

---

## 🚀 10. Next Steps — What to Do Right Now

1. **Choose your tech stack** from the options above (I recommend Option A or D)
2. **Set up the project** — I can scaffold the entire project for you
3. **Start with auth + dashboard** — the core user experience
4. **Parallelize work:**
   - Krushil + Shirin → Mobile app screens
   - Vijyot → ML model training & FastAPI server
   - Archi → Node.js backend APIs + MongoDB schemas
   - Aum → Figma designs → Component implementation

---

*Let me know which tech stack option you'd like to go with, and I'll start building immediately!* 🚀
