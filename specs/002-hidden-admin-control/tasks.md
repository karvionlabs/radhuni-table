# Implementation Tasks: Invisible Admin Control Panel

- [ ] Task 1: Create `src/services/storageService.js` for persistent storage, default fallback hydration, and event synchronization
- [ ] Task 2: Build `src/components/admin/HiddenAdminModal.jsx` featuring:
  - Auth dialog with secure passcode entry & attempt lockout
  - Zero-emoji luxury dark-gold UI with tabbed sections (Crowd, Stalls, Reservations, Reviews, Settings)
  - Live data editing (toggle stall availability, update dish price, toggle sold out)
  - Reservation ledger management with CSV export
  - Review moderation controls
  - Reset to factory defaults button
- [ ] Task 3: Wire secret global hotkey listener (`Ctrl+Shift+A` / `Cmd+Shift+A`) and secret footer emblem 5-tap gesture
- [ ] Task 4: Connect live UI components (`LiveCrowdIndicator`, `StallExplorer`, `ReservationModal`, `ReviewsSection`) to read from the reactive operational store
- [ ] Task 5: Build and verify end-to-end functionality
