# Tasks: Chef's Table Gulshan 2 Digital Experience

**Input**: Design documents from `/specs/001-chefs-table-gulshan/`
**Prerequisites**: `spec.md`, `plan.md`

## Phase 1: Setup (Shared Infrastructure)
- [X] T001 Initialize React + Vite project structure with dependencies (`package.json`, `vite.config.js`, `tailwind.config.js`)
- [X] T002 [P] Configure Tailwind CSS with culinary color palette and font typography
- [X] T003 [P] Create base CSS animations and spring-curve utility classes in `src/index.css`

## Phase 2: Foundational (Data Models & Core Assets)
- [X] T004 Create `src/data/stallsData.js` with 12 authentic Chef's Table Gulshan 2 food stalls and complete non-overlapping menus
- [X] T005 [P] Create `src/data/seatingZones.js` covering 4 seating zones, live capacity, and ambiance metrics
- [X] T006 [P] Create `src/data/reviewsData.js` with verified Google Maps dining reviews and ratings
- [X] T007 [P] Create state management for Unified Tray / Cart and Active Filters in `src/App.jsx`

## Phase 3: User Story 1 - Interactive Stall Discovery & Menu Exploration (P1)
- [X] T008 [P] [US1] Build `src/components/StallExplorer.jsx` with category tabs and animated stall cards
- [X] T009 [US1] Build `src/components/StallDetailModal.jsx` displaying chef backstory, menu items, dietary tags, and add-to-tray actions
- [X] T010 [US1] Connect stall search and category filters with instant reactive rendering

## Phase 4: User Story 2 - Motion Graphics Culinary Hero & Atmospheric Experience (P1)
- [X] T011 [P] [US2] Implement `src/components/MotionCulinaryLoop.jsx` using HTML5 Canvas for 60fps steam, embers, and culinary ambient loops
- [X] T012 [US2] Build `src/components/HeroMotion.jsx` featuring dynamic typography, live badges, CTA buttons with spring curves, and stats counter
- [X] T013 [US2] Implement scroll-triggered reveal animations and interactive hover effects across components

## Phase 5: User Story 3 - Unified Multi-Stall Tray Ordering & Checkout Simulation (P2)
- [X] T014 [P] [US3] Implement `src/components/UnifiedTray.jsx` persistent drawer showing multi-stall grouping, subtotal, VAT, and quantity adjustments
- [X] T015 [US3] Build simulated checkout flow with bKash/Nagad/Card payment options and animated order ticket modal

## Phase 6: User Story 4 - Live Dining Zone Availability & Table Reservation (P2)
- [X] T016 [P] [US4] Build `src/components/LiveCrowdIndicator.jsx` showing real-time food hall capacity, peak hours, and vibe level
- [X] T017 [US4] Build `src/components/SeatingMap.jsx` interactive visual floor plan representing 600+ seats across 4 zones
- [X] T018 [US4] Implement `src/components/ReservationModal.jsx` with form validation, confirmation codes, and calendar export

## Phase 7: User Story 5 - Location, Hours, Reviews & Direct Google Maps Integration (P3)
- [X] T019 [P] [US5] Build `src/components/LocationSection.jsx` featuring the verified Google Maps link (`https://maps.app.goo.gl/hRYZ4iKM5BJ1Xf3x5`), Unimart Level 2 directions, parking guidance, and operating hours
- [X] T020 [US5] Build `src/components/ReviewsSection.jsx` with rating breakdown, Google reviews filter, and user review submission modal
- [X] T021 [US5] Build `src/components/Navbar.jsx` and `src/components/Footer.jsx` with quick navigation, social links, and delivery partner shortcuts

## Phase 8: Polish, Testing & Production Verification
- [X] T022 Ensure full mobile and desktop responsive layout with smooth touch gestures
- [X] T023 Run Vite build and verify zero console errors, clean bundle, and 60fps animation performance
- [X] T024 Validate all user stories and acceptance criteria against the feature specification
