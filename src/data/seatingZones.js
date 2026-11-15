export const seatingZones = [
  {
    id: 'garden-atrium',
    name: 'Garden Atrium',
    subtitle: 'Botanical greenery, natural daylight & tranquil communal benches',
    capacity: 180,
    currentOccupancy: 64, // 64% full
    status: 'Lively',
    statusColor: 'emerald',
    features: ['Natural Daylight', 'Living Plant Walls', 'Communal Oak Tables', 'Stroller Friendly'],
    idealFor: 'Casual lunch, couples, weekend family dining',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    ambientSound: 'Gentle murmur & fountain acoustics'
  },
  {
    id: 'skylight-core',
    name: 'Central Skylight & Live Kitchens',
    subtitle: 'The bustling heart of Radhuni Table surrounding wok & grill fires',
    capacity: 220,
    currentOccupancy: 82, // 82% full
    status: 'High Energy',
    statusColor: 'amber',
    features: ['Live Flame Views', 'Rapid Self-Service Access', 'Panoramic Hall View', 'Centrally Air-Conditioned'],
    idealFor: 'Foodies eager to watch chefs toss woks and grill kebabs',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    ambientSound: 'Sizzling woks & upbeat modern jazz'
  },
  {
    id: 'family-booths',
    name: 'Family & Executive Booths',
    subtitle: 'Semi-private cushioned leather seating with acoustic baffles',
    capacity: 120,
    currentOccupancy: 45, // 45% full
    status: 'Relaxed & Calm',
    statusColor: 'emerald',
    features: ['Plush Velvet/Leather Seating', 'Acoustic Panels', 'High Chairs Available', 'Dedicated Service Call'],
    idealFor: 'Large families, corporate team lunches, celebratory dinners',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    ambientSound: 'Quiet conversation & discreet lounge music'
  },
  {
    id: 'espresso-lounge',
    name: 'Emerald Cafe & Espresso Lounge',
    subtitle: 'Adjacent to Emerald Bakery & Club Gelato with workstations',
    capacity: 80,
    currentOccupancy: 50, // 50% full
    status: 'Cozy & Focused',
    statusColor: 'blue',
    features: ['High-Speed Wi-Fi', 'Universal Power Outlets', 'Artisanal Coffee Bar', 'Comfortable Armchairs'],
    idealFor: 'Remote work, casual business meetings, afternoon coffee & pastries',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
    ambientSound: 'Espresso steam & soft lo-fi acoustics'
  }
];

export const liveCrowdStats = {
  totalCapacity: 600,
  currentlySeated: 384,
  occupancyPercentage: 64,
  averageWaitTime: '0-5 mins',
  peakHoursToday: '1:30 PM - 3:00 PM & 8:00 PM - 10:30 PM',
  todayStatus: 'Open • Vibrant Ambiance'
};
