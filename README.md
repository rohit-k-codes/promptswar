# Explore City
> **Less Survival Mode. More Adventure.**

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-cyan.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-emerald.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20RLS-3ECF8E.svg)](https://supabase.com)
[![Google Maps](https://img.shields.io/badge/Google%20Maps-Places%20%26%20Routes-4285F4.svg)](https://cloud.google.com/maps-platform)
[![Gemini AI](https://img.shields.io/badge/Gemini%20API-gemini--3.8--flash-8E24AA.svg)](https://ai.google.dev/)

---

## 🌟 Overview & Product Goal

**Explore City** is a production-minded, responsive urban intelligence and exploration platform designed to help people stop merely surviving the city and start genuinely enjoying it. By uniting verified geospatial discovery, transparent crowd-sourced municipal condition reports, real-time weather adaptations, and Gemini 3.8 Flash neural itinerary synthesis, Explore City transforms urban navigation into an evidence-based adventure.

---

## ✨ Core Features

1. **Interactive City Map Explorer**:
   - Categorized discovery across Dining, Heritage Sites, Sights, Stays, and Artisanal Cafes.
   - Live filters by vibe, rating, and keyword search.
   - Sourced and timestamped place detail drawer with verified Google Places ratings, hours, and safety metrics.

2. **AI Urban Adventure Planner (Gemini 3.8 Flash)**:
   - Dynamic itinerary synthesis based on budget tier (`Budget $`, `Standard $$`, `Premium $$$$`, `Free Spirit`), duration (2 to 12 hours), mobility preferences, and live weather.
   - Produces structured schedules with step durations, transparent neighborhood safety tips, and estimated costs.
   - Offline and local synthesis fallback ensuring uninterrupted demo availability.

3. **Google Places & Routes Integration**:
   - Google Places Platform integration for authentic place data, ratings, photos, and opening hours.
   - Traffic-aware travel estimates (Routes API / Directions) supporting Walking, Cycling (protected track awareness), Transit, and Driving with congestion multipliers.

4. **Weather-Calibrated Recommendations**:
   - Live meteorological indicators: Temperature (C/F), outdoor exploration score (0-100%), precipitation probability, and UV index.
   - Adapts trip recommendations dynamically (e.g. suggests indoor heritage galleries during rain, scenic hill vistas during golden hour).

5. **Citizen Reports & Civic Participation**:
   - Multi-modal incident submission: Text, photographic preview, and voice dictation via the **Web Speech API**.
   - Categories: Broken streetlights, road potholes, transit delays, crowd surges, festival pop-ups, and heritage access tips.
   - Algorithmic duplicate detection: Automatically clusters reports submitted within 200m sharing the same category.

6. **Evidence-Based Safety & Place Comparison Matrix**:
   - Side-by-side comparison of 2-3 locations with dynamic badges (*Top Rated*, *Safest*, *Most Walkable*, *Top Accessible*).
   - Clear distinction across:
     - 🏛️ **Official Google Places**
     - 👥 **Verified Community Reports**
     - ⏳ **Pending Moderation Reports**
     - 🧪 **Simulated Demo Data**

7. **Admin Moderation Desk & City Insights**:
   - Role-Based Access Control (RBAC): `explorer`, `moderator`, and `admin`.
   - Review incoming queue, one-click Approve (awards +15 reputation points to citizen), Reject, or Mark Resolved.
   - City incident category analytics and real-time resolution metrics.

8. **User Profiles & Saved Pocket**:
   - Reputation points and explorer badge progression (*Rookie Explorer* → *Pathfinder* → *City Scout* → *Urban Legend* → *Civic Architect*).
   - Saved bookmarks and custom AI itineraries.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Vite 8, Lucide React Icons |
| **Database & Auth** | Supabase Cloud PostgreSQL, Row-Level Security (RLS), Supabase Auth |
| **Media Storage** | Supabase Storage (citizen report photos and audio) |
| **Serverless Edge** | Supabase Edge Functions (`Deno`) for privileged API endpoints |
| **Geospatial & Mapping** | Google Maps JavaScript API, Places API (New), Routes API |
| **AI Intelligence** | Gemini 3.8 Flash (`@google/genai` SDK) |
| **Speech-to-Text** | Web Speech API (`webkitSpeechRecognition`) |

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js >= 20.x or 24.x LTS
- npm >= 10.x

### 1. Clone & Install
```bash
git clone https://github.com/your-username/explore-city.git
cd explore-city
npm install
```

### 2. Configure Environment Variables
Copy the example configuration:
```bash
cp .env.example .env
```
Fill in your credentials or run directly with default demo keys:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_WEATHER_API_KEY=your-weather-api-key
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Run Tests & Build Production Bundle
```bash
# Run unit & algorithmic tests
npm test

# Build production bundle with TypeScript validation
npm run build
```

---

## 🗄️ Database Schema & Migrations

Explore City includes full version-controlled database migrations with strict Row Level Security (RLS) located in:
- [`supabase/migrations/20261009000000_explore_city_schema.sql`](supabase/migrations/20261009000000_explore_city_schema.sql)
- [`supabase/seed.sql`](supabase/seed.sql)

### Tables
- `profiles`: User roles (`explorer`, `moderator`, `admin`), badges, and reputation scores.
- `citizen_reports`: Geotagged civic reports with coordinates, status (`pending`, `approved`, `rejected`), confidence scores, and audio transcripts.
- `report_votes`: Community upvotes and verification checks.
- `saved_places`: User bookmarks with custom notes.
- `itineraries`: Saved AI itineraries with step-by-step timetable schedules.
- `place_metrics`: Sourced and timestamped comparison metrics.

---

## 🛡️ Edge Functions

Serverless Edge Functions in `supabase/functions/`:
- `gemini-trip-planner`: Secure server-side Gemini 3.8 Flash generation of structured itineraries.
- `analyze-citizen-report`: AI-powered severity suggestion, duplicate similarity, and safety summarization.

---

## 👥 Personas & Demo RBAC

For rapid hackathon demonstration, click the profile avatar in the upper right navigation to switch between test personas:
1. **Elena Rostova** (`explorer`): Can explore, save itineraries, bookmark places, and submit citizen reports.
2. **Marcus Vance** (`moderator`): Can access the Admin Desk, approve/reject reports, and resolve issues.
3. **Aria Chen** (`admin`): Full civic administrative privileges and analytics audit oversight.

---

## 📄 License
This project is licensed under the MIT License.
