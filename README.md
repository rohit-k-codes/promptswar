# Explore City — Pune Edition
> **Less Survival Mode. More Adventure.**
> Launch City: Pune, Maharashtra, India (18.5204° N, 73.8567° E)

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-cyan.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-emerald.svg)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Map-Leaflet%20%2B%20OpenStreetMap-10b981.svg)](https://leafletjs.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20API-gemini--3.8--flash-8E24AA.svg)](https://ai.google.dev/)
[![Zero Paid APIs](https://img.shields.io/badge/Zero%20Paid%20APIs-Single%20Gemini%20Key-amber.svg)](#)

---

## 🌟 Overview & Architecture

**Explore City — Pune Edition** is a production-quality urban discovery and civic intelligence platform built to help citizens and travelers stop merely surviving city life and start enjoying it through local Pune discoveries, Peshwa heritage, iconic food corridors, and practical urban insights.

### 🔑 Single Gemini API Key Architecture
- **Zero Paid APIs Required**: The only external credential required is `GEMINI_API_KEY`.
- **Backend-Only Security**: `GEMINI_API_KEY` stays exclusively on the Express backend (`server/`). It is never exposed in client bundles or `VITE_` variables.
- **Keyless Mapping**: Uses **Leaflet** with **OpenStreetMap** tiles. No Google Maps JavaScript API keys required.
- **Keyless Meteorology**: Uses **Open-Meteo** free meteorological data and Pune climatological models. No Weather API keys required.
- **No Database**: All database dependencies (Supabase clients, migrations, external cloud databases) have been removed. Uses versioned browser `localStorage` for private, local-first persistence.
- **Ethical AI & Grounding**: Distinguishes grounded knowledge from AI suggestions and unverified user reports. Citizen reports remain strictly local to the user's browser.

---

## ✨ Features

### 1. 🗺️ Google-Maps-Free Keyless Map Experience (Leaflet + OpenStreetMap)
- Interactive map centered on Pune (`18.5204, 73.8567`) with pan, zoom, and OpenStreetMap attribution.
- Synchronized map markers and sidebar list view for 12 authentic Pune landmarks.
- Markers appear only when reliable coordinates exist.
- Clickable popups with place details, ratings, OpenStreetMap links, and external Google Maps directions links.
- Graceful offline banner if map tiles are slow or offline.

### 2. 🏛️ Pune City Exploration & Discovery Dashboard
- Authentic curated places: Shaniwar Wada, Aga Khan Palace, Goodluck Cafe, Vaishali, Pataleshwar Cave Temple, The Ritz-Carlton, Vohuman Cafe, Osho Teerth Park, Bedekar Misal, Kayani Bakery, Raja Dinkar Kelkar Museum, and Conrad Pune.
- Category filters: Heritage & Forts, Iconic Cafes & Bakeries, Maharashtrian Restaurants, Parks & Zen Gardens, Luxury Stays.
- Natural-language keyword search matching tags, addresses, and cultural notes.

### 3. 🤖 Multilingual "Explore City Assistant" (AI Voice & Chat)
- Accessible floating assistant button on bottom-right of the screen.
- Supported languages:
  1. **English** (`en-IN`)
  2. **Hindi** (`hi-IN`) — स्वाभाविक हिंदी में वार्तालाप
  3. **Marathi** (`mr-IN`) — अस्खलित मराठीत स्थानिक पुणेरी संवाद
- **Voice Input**: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) with mic toggle, listening indicator, and editable transcripts before sending.
- **Voice Output**: Browser-native `speechSynthesis` (`SpeechSynthesisUtterance`) with Speak, Stop, and Mute controls. Autoplay is OFF by default.
- **Application Actions**: Assistant can automatically navigate tabs, filter place categories, search Pune spots, and open citizen report drafts.

### 4. 🧭 Personalized Adventure Planner (INR Budget)
- Calibrated for Indian Rupees (₹500, ₹1,500, ₹3,500, or custom INR budget).
- Custom exploration duration (2 to 12 hours), travel style, and accessibility needs.
- Structured itinerary with stop duration, cost estimate in INR, local Pune navigation tips, and transparent safety advice.
- Explicit user confirmation modal before saving itineraries to local browser storage.

### 5. ⚖️ Place Comparison Matrix
- Side-by-side comparison of 2–3 destinations with objective metrics: ratings, price level, safety index, walkability, and cleanliness.
- Missing metrics explicitly displayed as "Not available" without hallucinated statistics.

### 6. 🛡️ Citizen Reports & Local Watch
- Log localized street hazards (potholes, waterlogging, streetlights) with category, description, and coordinates.
- Gemini AI summarization and severity classification with user confirmation.
- Strictly local to the user's browser: never claimed to be shared with municipal authorities or other users without consent.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Vite 8, Lucide Icons | Responsive glassmorphism interface |
| **Backend** | Express 5, Node.js (ESM), CORS, Dotenv | Secure Gemini proxy with rate limiting & timeouts |
| **AI Model** | Google Gemini 3.8 Flash (`@google/genai` SDK) | Fast multimodal planning and multilingual chat |
| **Mapping** | Leaflet 1.9 + OpenStreetMap | Free, keyless interactive map |
| **Weather** | Open-Meteo API + Pune Climatological Model | Free keyless meteorological feed |
| **Voice** | Browser Web Speech API (`SpeechRecognition` & `speechSynthesis`) | Browser-native voice input and audio response |
| **Storage** | Versioned browser `localStorage` (`storageService.ts`) | Zero database dependency |

---

## 🚀 Quick Start & Setup

### Prerequisites
- Node.js >= 20.x or 24.x LTS
- npm >= 10.x
- Single Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
Create a `.env` file in the project root:
```env
# Only ONE API key required
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-3.8-flash
PORT=3001
```

*(Note: `.env` is excluded from Git in `.gitignore` to protect your secret key).*

### 3. Run Backend API Server
```bash
npm run server
```
Server starts on `http://localhost:3001`.

### 4. Run Frontend (Vite)
In another terminal:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Testing & Verification

Run the full test suite (18 tests covering Haversine distance, duplicate detection, confidence scoring, badges, and all 14 Express API endpoints including multilingual chat):

```bash
npm test
```

Build the production bundle:
```bash
npm run build
```

---

## 📜 API Endpoints Summary

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health` | `GET` | Health check and Pune edition status |
| `/api/config-status` | `GET` | Configuration flags (safely hides secrets) |
| `/api/places/search` | `GET` | Search and filter Pune places |
| `/api/places/details` | `GET` | Retrieve single place details |
| `/api/routes/compute` | `POST` | Calculate travel route & Google Maps directions |
| `/api/weather/current` | `GET` | Live Pune weather via Open-Meteo |
| `/api/weather/forecast`| `GET` | Multi-day Pune forecast |
| `/api/ai/plan` | `POST` | Generate INR adventure itinerary with Gemini |
| `/api/ai/analyze-report`| `POST` | Analyze citizen report locally |
| `/api/ai/chat` | `POST` | Multilingual assistant (English, Hindi, Marathi) |

---

## 🔒 Security & Privacy Commitments
- `GEMINI_API_KEY` is strictly confined to the backend server.
- No database credentials, connection strings, or cloud storage credentials exist in the codebase.
- Citizen reports remain local to the user's browser.
- Transparent attribution for OpenStreetMap and Google Maps directions links.
- Respects eligible Gemini free tier limits with rate limiting and local synthesizers when quotas are reached.

---

© 2026 Explore City · Pune Edition · Single Gemini API Key Architecture
