# Radhuni Table — Kazir Dewri, Chattogram
### Chattogram’s Flagship Gourmet Food Hall & Culinary Experience

[![Live Demo](https://img.shields.io/badge/Live%20Demo-radhunitable.pages.dev-success?style=for-the-badge&logo=cloudflare)](https://radhunitable.pages.dev)
[![Deployment](https://img.shields.io/badge/Cloudflare%20Pages-Live%20Global%20Edge-F38020?style=for-the-badge&logo=cloudflare)](https://radhunitable.pages.dev)
[![React](https://img.shields.io/badge/React%2018-Tailwind%20CSS-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🌐 Live Website

- **Primary Live URL:** [https://radhunitable.pages.dev](https://radhunitable.pages.dev)
- **Alternate Edge URL:** [https://radhuni-table.pages.dev](https://radhuni-table.pages.dev)
- **Physical Flagship:** Abdullah Bhaban, Kazir Dewri, Chattogram 4000, Bangladesh

---

## 🍽️ About The Project

**Radhuni Table** is Chattogram’s premier upscale multi-cuisine food hall located at the heart of Kazir Dewri (Abdullah Bhaban). Spanning 600+ communal dining seats and 12+ curated culinary stalls, this web platform delivers an immersive, luxury dining experience with zero-lag 60 FPS client performance, interactive stall exploration, real-time crowd telemetry, and a stealth executive administration suite.

---

## ✨ Key Features & Architecture

### 1. 🏪 12+ Signature Specialty Stalls & Interactive Menus
- **Darbar** — Royal Awadhi & Dum Biryani
- **Turkish Fiesta** — Charcoal Grills & Mezze
- **Madchef X** — Smashed Wagyu Burgers
- **Pizza Guy** — Stone-Fired Sourdough
- **Hakka Chattogram** — Indo-Chinese Wok & Dim Sum
- **Club Gelato** — Artisanal Italian Gelato
- *And 6 more curated culinary concepts.*
- In-place price adjustments, dietary filtering (Halal, Vegetarian, Chef Special), spiciness indicators, and sold-out badges.

### 2. 👥 Real-Time Hall Occupancy & Crowd Telemetry
- Real-time seat density gauge (Green: Calm, Amber: Buzzing, Red: Peak).
- Current seated guest tracker (600+ seat capacity).
- Live wait-time estimator dynamically powered by the reactive state engine.

### 3. 🗺️ 600+ Dining Floor Map & Seating Zones
- Visual spatial layout across 4 dining zones:
  - **Garden Atrium** (Lush greenery, natural skylights)
  - **The Grand Piazza** (Communal center, live open kitchens)
  - **Family & Executive Booths** (Private acoustically-treated booths)
  - **Mezzanine Skyline Lounge** (Panoramic elevated overlook)

### 4. 🛒 Unified Tray (Multi-Stall Aggregated Ordering)
- Single universal cart aggregating items from distinct culinary stalls.
- Live subtotal, service calculation, and smooth quantity management.

### 5. 📅 Instant Table Reservation Engine
- Intuitive booking flow with date, time, guest count, and dining zone preferences.
- Anti-bot security filters and rate-limiting safeguards.

### 6. 🛡️ Stealth Executive Admin Operations Suite (`#admin`)
- Accessible strictly via secret URL hash (`#admin`), hotkey (`Ctrl + Shift + A`), or 5-consecutive taps on the footer logo; zero visible public links.
- 7 comprehensive management modules:
  1. **Dashboard Overview** — Total bookings, live occupancy, active stalls.
  2. **Live Crowd Telemetry** — Adjust hall density %, wait times, and atmosphere status.
  3. **Stalls & Signature Menus** — In-place dish pricing (BDT ৳), "Sold Out" toggling, and new dish additions.
  4. **Reservations Ledger** — Filter bookings, update guest status (*Confirmed*, *Seated*, *Cancelled*), manual reservations, and one-click **CSV spreadsheet export**.
  5. **Diner Reviews Moderation** — Manage customer feedback.
  6. **Operating Hours & Info** — Update contact details and operating schedule.
  7. **Security & Passcode** — SHA-256 hashed master key management.

---

## 🛠️ Tech Stack

- **Framework:** React 18 (Vite Bundler)
- **Styling:** Tailwind CSS (Culinary Dark & Warm Gold Design System)
- **Typography:** Playfair Display & Plus Jakarta Sans
- **Icons:** Lucide React (100% Vector SVG Icons, Zero Emojis)
- **Animation & Canvas:** HTML5 Canvas Culinary Particle Simulation & CSS Hardware Acceleration
- **Deployment & Hosting:** Cloudflare Pages (Global Edge Network)

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/karvionlabs/radhuni-table.git

# 2. Navigate to directory
cd radhuni-table

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build production bundle with optimized assets
npm run build

# Preview production build locally
npm run preview
```

### Cloudflare Pages Deployment

```bash
npx wrangler pages deploy dist --project-name=radhunitable --branch=master
```

---

## 🔒 Security & Privacy

- Full CSP (Content Security Policy) and strict frame options.
- No public exposure of the administrative portal.
- Rate-limiting protection and honeypot traps on guest submission forms.

---

## 👨‍💻 Author & Maintainer

- **Organization:** [Karvion Labs](https://github.com/karvionlabs)
- **Lead Developer:** **Abdullah Karif Shahjada**
- **Contact:** [abdullahshahjada12@gmail.com](mailto:abdullahshahjada12@gmail.com)

---

© 2026 Radhuni Table Chattogram. Developed with passion by Karvion Labs.
