import React, { useState } from 'react';
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

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [selectedStall, setSelectedStall] = useState(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [reservationZone, setReservationZone] = useState('Garden Atrium');

  // Map of added item IDs for instant checkmark on buttons
  const addedItemsMap = cartItems.reduce((acc, item) => {
    acc[item.id] = true;
    return acc;
  }, {});

  // Add item to Unified Tray
  const handleAddToCart = (dish, stallName) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === dish.id);
      if (existing) {
        return prevItems.map((i) =>
          i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...dish, stallName, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
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
    <div className="min-h-screen bg-culinary-dark text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
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

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        initialZone={reservationZone}
      />
    </div>
  );
}
