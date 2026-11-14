# Implementation Plan: Chef's Table Gulshan 2 Digital Experience

**Feature**: `001-chefs-table-gulshan`
**Architecture**: Single Page Application with React 18/19, Vite, Tailwind CSS, Lucide Icons, and Motion Graphics Canvas/Spring Physics.

## Tech Stack & Dependencies
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS with custom culinary theme (Charcoal `#121417`, Warm Gold `#D4AF37`, Forest Emerald `#1B3B2B`, Terracotta `#D35400`, Cream `#F9F6F0`)
- **Animation & Motion**: Motion graphics custom canvas engine (fluid culinary loop, ambient embers & steam), CSS spring-curve micro-interactions, responsive parallax.
- **Icons**: Lucide React
- **Build & Dev Tool**: Vite

## Project File Structure
```
/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/
│   │   ├── stallsData.js          # 12 signature stalls with authentic menus & pricing
│   │   ├── seatingZones.js        # 4 zones (Atrium, Skylight, Family, Lounge)
│   │   ├── reviewsData.js         # Customer ratings & reviews
│   │   └── promotionsData.js      # Platter deals & combos
│   ├── components/
│   │   ├── Navbar.jsx             # Sticky translucent navigation with tray indicator
│   │   ├── HeroMotion.jsx         # Motion graphics hero with animated steam, canvas, and call-to-action
│   │   ├── LiveCrowdIndicator.jsx # Live crowd status (seat availability, peak tracker)
│   │   ├── StallExplorer.jsx      # Filterable stalls with cuisine tags & modals
│   │   ├── StallDetailModal.jsx   # Deep-dive stall view with non-overlapping menu items
│   │   ├── SeatingMap.jsx         # Interactive 600-seat floor plan explorer
│   │   ├── UnifiedTray.jsx        # Multi-stall cart drawer with checkout simulation
│   │   ├── ReservationModal.jsx   # Table booking modal with confirmation
│   │   ├── LocationSection.jsx    # Google Maps link, Unimart parking guide, hours
│   │   ├── ReviewsSection.jsx     # Customer feedback & ratings
│   │   ├── MotionCulinaryLoop.jsx # HTML5 Canvas ambient culinary particle & loop engine
│   │   └── Footer.jsx             # Unimart Gulshan 2 contact, delivery partners, social
└── specs/
    └── 001-chefs-table-gulshan/
        ├── spec.md
        ├── plan.md
        └── tasks.md
```

## Motion Graphics Specification
- Ambient culinary particle loop simulating steaming woks, sizzling grills, and gold accents.
- Seamless loop duration: 4.5s cycle with cubic-bezier spring curves (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- 60 FPS requestAnimationFrame with hardware acceleration.
- Subtle cursor-following or scroll-driven parallax for atmospheric depth.
