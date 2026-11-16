# Feature Specification: Invisible Admin Control Panel

**Feature Directory**: `specs/002-hidden-admin-control`  
**Created**: 2026-11-16  
**Status**: Ready for Planning / Implementation  

## 1. Executive Summary & Value Proposition
The owner of Radhuni Table Chattogram requires a completely invisible administrative control console ("Stealth CMS") to manage live restaurant operations—including stall availability, menu item pricing/sold-out status, hall occupancy metrics, reservation rosters, and verified diner reviews—without requiring code recompilation or revealing admin controls to ordinary diners and public visitors.

## 2. Key Actors & Access Model
- **Sole System Owner**: Authenticated operator with secret hotkey access (`Ctrl + Shift + A` on desktop, or a 5-tap gesture on the brand footer emblem on mobile) and Master Passcode authentication.
- **Public Diners**: General website visitors who see zero traces, routes, buttons, or indicators of administrative capabilities.

## 3. Core Functional Requirements
- **FR-01: Invisible Gateway**: The admin console must not be discoverable via UI buttons, links, or public DOM tags. Triggered strictly via keyboard combination (`Ctrl + Shift + A` / `Cmd + Shift + A`) or 5-consecutive taps on the footer brand crest.
- **FR-02: Zero-Emoji Luxury UI/UX**: The entire panel must feature clean, high-contrast typography (`Playfair Display` headers and `Plus Jakarta Sans` data tables), authentic vector icons (Lucide), and dark-gold luxury branding matching the restaurant's aesthetic.
- **FR-03: Real-Time Hall Telemetry Control**: Operator can adjust live crowd parameters:
  - Occupancy percentage (0% - 100%)
  - Currently seated guests count
  - Average wait time estimation
  - Operational status badge (e.g., Lively, Peak Rush, Relaxed)
- **FR-04: Stall & Menu Management**:
  - Toggle stall status (Open / High Rush / Closed for Private Event)
  - Toggle dish availability (In Stock / Sold Out)
  - Adjust dish pricing in Bangladeshi Taka (৳)
  - Edit or add featured chef specialties
- **FR-05: Live Reservation Ledger**:
  - View real-time table reservation inquiries submitted through the modal
  - Filter by date, zone, and status (Pending, Confirmed, Seated, Cancelled)
  - One-click export to CSV for floor managers
- **FR-06: Verified Review Moderation**:
  - View user-submitted direct reviews
  - Pin, approve, or hide reviews from the public feed
- **FR-07: Persistent Reactive Store with Fail-Safe Reset**:
  - All changes persist locally across browser sessions via `localStorage` with reactive state synchronization
  - "Restore Factory Defaults" button to safely reset all modifications back to initial source data

## 4. Non-Functional Requirements & Security
- **NFR-01: Brute-Force & Session Protection**: Passcode verification with rate limiting (3 failed attempts locks out for 60 seconds). Session auto-terminates upon panel close or browser reload.
- **NFR-02: Zero Performance Impact**: Admin assets load conditionally or cleanly unmount when closed, maintaining butter-smooth 60 FPS for general visitors.
- **NFR-03: Offline & Local Resiliency**: Operates seamlessly client-side without external dependencies or data exfiltration.

## 5. Success Criteria
- [x] Invisible entry verified: No visible admin links anywhere in DOM navigation.
- [x] Passcode verification with safe session management.
- [x] Instant live updates: Modifying a stall or crowd count immediately updates the front-facing UI without full page refresh.
- [x] Zero emojis throughout the administrative interface.
