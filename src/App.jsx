import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroMotion from './components/HeroMotion';
import LiveCrowdIndicator from './components/LiveCrowdIndicator';
import StallExplorer from './components/StallExplorer';
import StallDetailModal from './components/StallDetailModal';
import SeatingMap from './components/SeatingMap';
import UnifiedTray from './components/UnifiedTray';
import ReservationModal from './components/ReservationModal';
import LocationSection from './components/LocationSection';
import ReviewsSection from './components/ReviewsSection';
import Footer from './components/Footer';
import AdminPortal from './components/admin/AdminPortal';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [selectedStall, setSelectedStall] = useState(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [reservationZone, setReservationZone] = useState('Garden Atrium');
  
  // Dedicated Separate Admin Portal State (Driven by URL hash or stealth hotkey)
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#admin';
    }
    return false;
  });

  // Stealth Access Listeners: URL Hash, Hotkeys, and 5-Tap Crest Gesture
  useEffect(() => {
    // 1. Hash change listener (#admin)
    const handleHashChange = () => {
      setIsAdminOpen(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);

    // 2. Keyboard shortcut: Ctrl + Shift + A or Cmd + Shift + A
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (window.location.hash === '#admin' || isAdminOpen) {
          window.location.hash = '';
          setIsAdminOpen(false);
        } else {
          window.location.hash = 'admin';
          setIsAdminOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 3. Custom stealth event from footer 5-tap crest
    const handleStealthEvent = () => {
      window.location.hash = 'admin';
      setIsAdminOpen(true);
    };
    window.addEventListener('radhuni_open_admin', handleStealthEvent);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('radhuni_open_admin', handleStealthEvent);
    };
  }, [isAdminOpen]);

  // Handle exiting admin mode cleanly
  const handleExitAdmin = () => {
    window.location.hash = '';
    setIsAdminOpen(false);
  };

  // If in Admin Mode, render the dedicated Full-Screen Admin Operations Portal
  if (isAdminOpen) {
    return <AdminPortal onExitAdmin={handleExitAdmin} />;
  }

  // Map of added item IDs for instant checkmark on buttons
  const addedItemsMap = cartItems.reduce((acc, item) => {
    acc[item.id] = true;
    return acc;
  }, {});

  // Add item to Unified Tray with safety limits
  const handleAddToCart = (dish, stallName) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === dish.id);
      if (existing) {
        return prevItems.map((i) =>
          i.id === dish.id ? { ...i, quantity: Math.min(50, i.quantity + 1) } : i
        );
      }
      return [...prevItems, { ...dish, stallName, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    const safeQty = Number(newQuantity) || 0;
    if (safeQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    const clampedQty = Math.min(50, Math.max(1, Math.floor(safeQty)));
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: clampedQty } : i))
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenReservationWithZone = (zoneName) => {
    setReservationZone(zoneName);
    setIsReservationOpen(true);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const trayItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const traySubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const trayTotal = Math.round(traySubtotal * 1.05);

  return (
    <div className="min-h-screen bg-culinary-dark text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden w-full max-w-full">
      {/* Sticky Navbar */}
      <Navbar
        trayItemsCount={trayItemsCount}
        trayTotal={trayTotal}
        onOpenTray={() => setIsTrayOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      <main className="flex-1">
        {/* Motion Graphics Hero */}
        <HeroMotion
          onExploreStalls={() => scrollToSection('stalls')}
          onOpenSeating={() => scrollToSection('seating')}
          onOpenReservation={() => setIsReservationOpen(true)}
        />

        {/* Live Crowd & Occupancy Telemetry */}
        <LiveCrowdIndicator
          onOpenReservation={() => setIsReservationOpen(true)}
        />

        {/* 12+ Signature Stalls Explorer & Menu Showcase */}
        <StallExplorer
          onSelectStall={(stall) => setSelectedStall(stall)}
          onAddToCart={handleAddToCart}
          addedItemsMap={addedItemsMap}
        />

        {/* 600+ Seating Map & Dining Zones */}
        <SeatingMap
          onSelectZoneForReservation={handleOpenReservationWithZone}
        />

        {/* Location, Direction, Parking & Delivery */}
        <LocationSection />

        {/* Verified Reviews & Ratings */}
        <ReviewsSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenTray={() => setIsTrayOpen(true)}
      />

      {/* Modals & Drawers */}
      <StallDetailModal
        stall={selectedStall}
        onClose={() => setSelectedStall(null)}
        onAddToCart={handleAddToCart}
        addedItemsMap={addedItemsMap}
      />

      <UnifiedTray
        isOpen={isTrayOpen}
        onClose={() => setIsTrayOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {isReservationOpen && (
        <ReservationModal
          isOpen={isReservationOpen}
          onClose={() => setIsReservationOpen(false)}
          initialZone={reservationZone}
        />
      )}
    </div>
  );
}
