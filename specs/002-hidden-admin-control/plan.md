# Implementation Plan: Invisible Admin Control Panel

**Feature Directory**: `specs/002-hidden-admin-control`  
**Spec Reference**: `specs/002-hidden-admin-control/spec.md`  
**Status**: Approved & Ready for Execution  

## 1. Technical Architecture & State Strategy

```
[ User Interaction ] 
      │
      ├── Public Diners: Normal Browsing (No Admin Footprint)
      └── Admin: Secret Trigger (Ctrl + Shift + A / 5-Tap Crest)
              │
              ▼
    [ Auth Modal Gateway ] ─── Passcode Validation (Hash Check + Lockout)
              │ (On Success)
              ▼
    [ HiddenAdminModal.jsx ] ─── Reactive State Provider & UI Manager
              │
              ├── Tab 1: Hall Operations (Occupancy, Seated, Wait Times)
              ├── Tab 2: Stalls & Menus (Availability, Pricing, Sold Out)
              ├── Tab 3: Reservations Ledger (Review, Filter, CSV Export)
              ├── Tab 4: Diner Reviews (Approve, Pin, Moderate)
              └── Tab 5: System & Reset (Factory Restore, Audit Log)
              │
              ▼
    [ Persistent Local Store ] ─── Reactive Event Dispatcher (CustomEvents / Hooks)
              │
              ▼
    [ Live Front-Facing UI ] ─── Instant UI Re-render without Page Reload
```

## 2. Component Design
- `src/components/admin/HiddenAdminModal.jsx`: Full-screen or high-contrast drawer console styled with gold borders, dark charcoal glassmorphism, responsive data tables, and Lucide icons (no emojis).
- `src/hooks/useRestaurantStore.js`: Unified custom React hook managing operational state (stalls, crowd, reservations, reviews) backed by `localStorage` with fail-safe fallbacks.

## 3. Security Implementation
- Master Passcode default: Configured with SHA-256 hash or secure salted token.
- Passcode attempt throttle: 3 attempts max before 60-second cooldown.
- Zero public exposure: No router path `/admin` or `/dashboard`; purely client-side modal controlled via listener.
