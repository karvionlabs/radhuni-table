// Authentic Radhuni Table Kazir Dewri stalls and non-duplicating menus
export const stallsData = [
  {
    id: 'darbar',
    name: 'Darbar',
    tagline: 'Royal Mughlai & Awadhi Curries',
    category: 'Mughlai & Indian',
    stallNumber: 'Stall 01',
    rating: 4.8,
    reviewsCount: 342,
    prepTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80',
    description: 'Mastering slow-cooked Nawabi gravies, clay-oven tandoor kebabs, and aromatic dum biryanis spiced with saffron, cardamom, and pure ghee.',
    specialty: 'Murgh Makhani & Garlic Naan Platter',
    badge: 'Guest Favorite',
    menu: [
      {
        id: 'd-1',
        name: 'Old Delhi Butter Chicken (Murgh Makhani)',
        price: 520,
        description: 'Tender tandoori chicken simmered in a velvety tomato-cashew reduction, finished with fenugreek and cultured butter.',
        dietary: ['Halal', 'Chef Special'],
        spiciness: 1,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'd-2',
        name: 'Awadhi Mutton Dum Biryani',
        price: 680,
        description: 'Prime goat meat sealed in dough handi with aged Basmati rice, rose water, and saffron milk.',
        dietary: ['Halal', 'Chef Special'],
        spiciness: 2,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'd-3',
        name: 'Silk Road Reshmi Kebab',
        price: 490,
        description: 'Minced chicken marinated in cream, cashew paste, and white pepper, char-grilled on clay skewers.',
        dietary: ['Halal'],
        spiciness: 1,
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
        popular: false
      },
      {
        id: 'd-4',
        name: 'Garlic & Coriander Butter Naan',
        price: 120,
        description: 'Crisp puffed clay-oven flatbread brushed with garlic butter and fresh cilantro.',
        dietary: ['Vegetarian', 'Halal'],
        spiciness: 0,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
        popular: true
      }
    ]
  },
  {
    id: 'turkish-fiesta',
    name: 'Turkish Fiesta',
    tagline: 'Anatolian Charcoal Grills & Mezze',
    category: 'Middle Eastern',
    stallNumber: 'Stall 04',
    rating: 4.7,
    reviewsCount: 289,
    prepTime: '12-18 min',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    description: 'Direct from Istanbul to Chattogram: smoky shish kebabs grilled over imported lump charcoal, wrapped in fresh lavash with garlic toum and sumac onions.',
    specialty: 'Sultan Mixed Kebab Platter',
    badge: 'Trending',
    menu: [
      {
        id: 'tf-1',
        name: 'Sultan Grand Grill Platter',
        price: 890,
        description: 'Combination of Adana lamb kebab, chicken shish, grilled peppers, sumac salad, and warm Turkish pita with garlic toum.',
        dietary: ['Halal', 'Chef Special'],
        spiciness: 2,
        image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'tf-2',
        name: 'Smoked Chicken Shish Lavash Wrap',
        price: 440,
        description: 'Tender marinated chicken breast char-grilled and wrapped with crisp pickles, mint yogurt, and Aleppo chili.',
        dietary: ['Halal'],
        spiciness: 1,
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'tf-3',
        name: 'Creamy Hummus & Warm Pita',
        price: 320,
        description: 'Silky whipped chickpeas, tahini, extra virgin olive oil, and toasted pine nuts with fresh bread.',
        dietary: ['Vegan', 'Vegetarian', 'Halal'],
        spiciness: 0,
        image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=600&q=80',
        popular: false
      }
    ]
  },
  {
    id: 'madchef-x',
    name: 'Madchef X',
    tagline: 'Artisanal Smashed Gourmet Burgers',
    category: 'Burgers & Fries',
    stallNumber: 'Stall 08',
    rating: 4.9,
    reviewsCount: 512,
    prepTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    description: 'Chattogram’s favorite smash burgers made from 100% freshly ground prime beef, butter-toasted brioche buns, and house-made mad sauce.',
    specialty: 'The Truffle Smashed Double',
    badge: 'Crowd Favorite',
    menu: [
      {
        id: 'm-1',
        name: 'The Truffle Double Smashed',
        price: 540,
        description: 'Two crispy-edged prime beef patties, double Monterey Jack cheese, caramelized balsamic onions, and white truffle aioli.',
        dietary: ['Halal', 'Chef Special'],
        spiciness: 1,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'm-2',
        name: 'Smoky Chipotle Chicken Crisp',
        price: 460,
        description: 'Buttermilk soaked fried chicken thigh, spicy chipotle slaw, sweet gherkins, and smoked cheese sauce.',
        dietary: ['Halal'],
        spiciness: 2,
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'm-3',
        name: 'Mad Animal Fries',
        price: 290,
        description: 'Crisp skin-on crinkle fries drenched in melted cheddar, diced jalapeños, grilled onions, and secret spread.',
        dietary: ['Vegetarian', 'Halal'],
        spiciness: 2,
        image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
        popular: true
      }
    ]
  },
  {
    id: 'pizza-guy',
    name: 'Pizza Guy',
    tagline: 'Neapolitan Sourdough & Stone-Deck Pies',
    category: 'Italian & Pizza',
    stallNumber: 'Stall 11',
    rating: 4.8,
    reviewsCount: 310,
    prepTime: '15-20 min',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=1200&q=80',
    description: '72-hour naturally fermented sourdough crust baked at blistering heat on stone hearths. San Marzano tomatoes, fresh mozzarella fior di latte.',
    specialty: 'Spicy Diavola & Burrata Pie',
    badge: 'Stone Oven',
    menu: [
      {
        id: 'p-1',
        name: 'Bufala Margherita & Fresh Basil (12")',
        price: 650,
        description: 'San Marzano D.O.P sauce, melted buffalo mozzarella, cold-pressed olive oil, and fresh garden basil leaves.',
        dietary: ['Vegetarian', 'Halal'],
        spiciness: 0,
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'p-2',
        name: 'Tuscan Truffle Pepperoni (12")',
        price: 790,
        description: 'Cured beef pepperoni, roasted portobello mushrooms, whole mozzarella, and black truffle drizzle.',
        dietary: ['Halal', 'Chef Special'],
        spiciness: 1,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'p-3',
        name: 'Cheesy Garlic Sourdough Knots',
        price: 280,
        description: 'Hand-tied sourdough knots drenched in garlic butter, parmesan, and oregano served with marinara dip.',
        dietary: ['Vegetarian'],
        spiciness: 0,
        image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80',
        popular: false
      }
    ]
  },
  {
    id: 'hakka-dhaka',
    name: 'Hakka Dhaka',
    tagline: 'Szechuan Flame & Indo-Chinese Wok',
    category: 'Asian & Wok',
    stallNumber: 'Stall 06',
    rating: 4.8,
    reviewsCount: 420,
    prepTime: '12-16 min',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1200&q=80',
    description: 'High-heat wok hei infused noodles, sizzling chili garlic prawns, and legendary Mongolian beef curated for the quintessential Bengali Chinese palate.',
    specialty: 'Crispy Mongolian Beef Bowl',
    badge: 'High Heat Wok',
    menu: [
      {
        id: 'hd-1',
        name: 'Sizzling Mongolian Glazed Beef',
        price: 580,
        description: 'Tender beef strips tossed in caramelized dark soy, scallions, dry red chilies, and roasted sesame seeds.',
        dietary: ['Halal', 'Chef Special'],
        spiciness: 2,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'hd-2',
        name: 'Classic Hakka Chili Chicken Gravy',
        price: 480,
        description: 'Crisp chicken bites tossed with bell peppers, green chilies, shallots, and spicy soy-vinegar glaze.',
        dietary: ['Halal'],
        spiciness: 3,
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'hd-3',
        name: 'Smoky Egg & Scallion Fried Rice',
        price: 290,
        description: 'Wok-charred jasmine rice with scrambled farm eggs, spring onions, and garlic butter.',
        dietary: ['Halal'],
        spiciness: 1,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
        popular: false
      }
    ]
  },
  {
    id: 'dos-locos',
    name: 'Dos Locos',
    tagline: 'Baja Street Tacos & Cheesy Quesadillas',
    category: 'Mexican & Cantina',
    stallNumber: 'Stall 14',
    rating: 4.7,
    reviewsCount: 215,
    prepTime: '10-14 min',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=1200&q=80',
    description: 'Vibrant Latin-American street food bursting with fresh lime, crushed avocado guacamole, fire-roasted salsa, and slow-braised meats.',
    specialty: 'Birria Beef Tacos with Consomé',
    badge: 'Street Cantina',
    menu: [
      {
        id: 'dl-1',
        name: 'Birria Pulled Beef Tacos (Trio)',
        price: 520,
        description: 'Crisp dipped corn tortillas filled with melting cheese, 8-hour braised beef, fresh cilantro, onions, and rich dipping consomé.',
        dietary: ['Halal', 'Chef Special'],
        spiciness: 2,
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'dl-2',
        name: 'Loaded Smoky Chicken Quesadilla',
        price: 430,
        description: 'Flour tortilla packed with grilled chipotle chicken, Oaxaca cheese, and jalapeños served with crema and pico de gallo.',
        dietary: ['Halal'],
        spiciness: 1,
        image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'dl-3',
        name: 'House Tortilla Chips & Guacamole',
        price: 280,
        description: 'Freshly fried corn tortilla chips with hand-mashed Hass avocado, lime, and serrano chili.',
        dietary: ['Vegan', 'Gluten-Free'],
        spiciness: 1,
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
        popular: false
      }
    ]
  },
  {
    id: 'taste-of-lanka',
    name: 'Taste of Lanka',
    tagline: 'Ceylon Coconut Curries & Kottu Roti',
    category: 'South Asian',
    stallNumber: 'Stall 16',
    rating: 4.8,
    reviewsCount: 195,
    prepTime: '14-18 min',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80',
    description: 'Bringing authentic Sri Lankan coastal flavours with roasted black curry powders, grated coconut pol sambol, and theatrical rhythmic kottu.',
    specialty: 'Colombo Chicken Kottu Roti',
    badge: 'Exotic Spice',
    menu: [
      {
        id: 'tl-1',
        name: 'Signature Chicken Kottu Roti',
        price: 480,
        description: 'Flaky flatbread chopped on iron griddles with shredded spiced chicken, eggs, curry leaves, and rich gravy.',
        dietary: ['Halal', 'Chef Special'],
        spiciness: 3,
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'tl-2',
        name: 'Ceylon Black Pepper Prawn Noodles',
        price: 540,
        description: 'Tossed egg noodles with juicy bay prawns, coconut shavings, crushed black pepper, and wok greens.',
        dietary: ['Halal'],
        spiciness: 2,
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
        popular: true
      }
    ]
  },
  {
    id: 'el-dorado',
    name: 'El Dorado',
    tagline: 'Coastal Seafood & Golden Batter',
    category: 'Seafood',
    stallNumber: 'Stall 18',
    rating: 4.7,
    reviewsCount: 230,
    prepTime: '12-16 min',
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    description: 'Crisp golden sea fish fillets, butter-garlic giant prawns, and savory ocean platters freshly fried to order.',
    specialty: 'English Fish & Handcut Chips',
    badge: 'Fresh Catch',
    menu: [
      {
        id: 'ed-1',
        name: 'Atlantic Golden Fish & Chips',
        price: 590,
        description: 'Crispy golden batter red snapper fillet, thick hand-cut steak fries, house tartar sauce, and crushed peas.',
        dietary: ['Halal', 'Chef Special'],
        spiciness: 0,
        image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'ed-2',
        name: 'Garlic Butter Jumbo Tiger Prawns',
        price: 760,
        description: 'Pan-seared Bay of Bengal tiger prawns in lemon herb butter served over saffron pilaf.',
        dietary: ['Halal', 'Gluten-Free'],
        spiciness: 1,
        image: 'https://images.unsplash.com/photo-1559742811-822863be4889?auto=format&fit=crop&w=600&q=80',
        popular: true
      }
    ]
  },
  {
    id: 'greens-seeds',
    name: 'Greens & Seeds',
    tagline: 'Organic Power Bowls & Cold-Pressed Elixirs',
    category: 'Healthy & Vegan',
    stallNumber: 'Stall 02',
    rating: 4.9,
    reviewsCount: 180,
    prepTime: '8-12 min',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    description: 'Nutrient-dense clean eating. Organic hydroponic greens, protein bowls, grilled tofu, and cold-pressed botanical wellness tonics.',
    specialty: 'Mediterranean Quinoa Glow Bowl',
    badge: 'Clean Eating',
    menu: [
      {
        id: 'gs-1',
        name: 'Grilled Salmon & Avocado Quinoa Bowl',
        price: 640,
        description: 'Wild salmon fillet, tricolor quinoa, Hass avocado, edamame, cherry tomatoes, and tahini-ginger dressing.',
        dietary: ['Halal', 'Gluten-Free', 'Chef Special'],
        spiciness: 0,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'gs-2',
        name: 'Green Goddess Detox Cold-Press',
        price: 260,
        description: 'Cold-pressed green apple, organic cucumber, celery, baby spinach, ginger, and Meyer lemon.',
        dietary: ['Vegan', 'Gluten-Free'],
        spiciness: 0,
        image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
        popular: true
      }
    ]
  },
  {
    id: 'emerald-bakery',
    name: 'Emerald Bakery & Cafe',
    tagline: 'Artisanal Viennoiserie & Third-Wave Coffee',
    category: 'Bakery & Coffee',
    stallNumber: 'Stall 20',
    rating: 4.9,
    reviewsCount: 390,
    prepTime: '5-8 min',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80',
    description: 'French viennoiserie baked fresh every morning with Normandy butter, paired with specialty single-origin Ethiopian and Colombian espresso beans.',
    specialty: 'Almond Croissant & Spanish Latte',
    badge: 'Artisan Cafe',
    menu: [
      {
        id: 'eb-1',
        name: 'Double-Baked Frangipane Almond Croissant',
        price: 280,
        description: 'Pure butter laminated pastry filled with silky almond cream and topped with roasted sliced almonds.',
        dietary: ['Vegetarian'],
        spiciness: 0,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'eb-2',
        name: 'Signature Iced Spanish Latte',
        price: 290,
        description: 'Double shot of rich espresso layered with condensed milk and whole milk over crystal ice cubes.',
        dietary: ['Vegetarian'],
        spiciness: 0,
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'eb-3',
        name: 'Ceremonial Japanese Matcha Latte',
        price: 340,
        description: 'Whisked Uji ceremonial grade green tea matcha with warm oat milk and organic blossom honey.',
        dietary: ['Vegetarian'],
        spiciness: 0,
        image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
        popular: false
      }
    ]
  },
  {
    id: 'club-gelato',
    name: 'Club Gelato',
    tagline: 'Handmade Italian Gelato & Sorbets',
    category: 'Desserts & Gelato',
    stallNumber: 'Stall 22',
    rating: 4.9,
    reviewsCount: 360,
    prepTime: '3-5 min',
    image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=1200&q=80',
    description: 'Churned daily in small batches with imported Sicilian pistachios, Madagascan vanilla pods, and 70% Valrhona dark chocolate.',
    specialty: 'Bronte Pistachio & Wild Berry Sorbet',
    badge: 'Sweet Finish',
    menu: [
      {
        id: 'cg-1',
        name: 'Sicilian Bronte Pistachio Cup',
        price: 250,
        description: 'Velvety authentic Italian gelato with roasted D.O.P Bronte pistachios and crunchy brittle.',
        dietary: ['Vegetarian', 'Gluten-Free', 'Chef Special'],
        spiciness: 0,
        image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'cg-2',
        name: '70% Valrhona Dark Belgian Chocolate',
        price: 250,
        description: 'Decadent deep cocoa gelato crafted with premium melted dark chocolate shavings.',
        dietary: ['Vegetarian', 'Gluten-Free'],
        spiciness: 0,
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80',
        popular: true
      }
    ]
  },
  {
    id: 'crisp-tenders',
    name: 'Crisp',
    tagline: 'Southern Buttermilk Fried Chicken & Waffles',
    category: 'Burgers & Fries',
    stallNumber: 'Stall 10',
    rating: 4.8,
    reviewsCount: 245,
    prepTime: '10-15 min',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80',
    description: '24-hour buttermilk-marinated whole chicken tenders fried to a shattered-glass crunch, glazed in Nashville hot honey or garlic parmesan.',
    specialty: 'Nashville Hot Honey Tender Box',
    badge: 'Ultra Crisp',
    menu: [
      {
        id: 'c-1',
        name: 'Nashville Hot Honey Crispy Box (4 pcs)',
        price: 450,
        description: 'Jumbo golden chicken tenders drenched in hot honey butter, crinkle fries, house pickles, and garlic comeback dip.',
        dietary: ['Halal', 'Chef Special'],
        spiciness: 2,
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
        popular: true
      },
      {
        id: 'c-2',
        name: 'Crispy Tender & Belgian Waffle Stack',
        price: 520,
        description: 'Buttermilk tenders served atop warm pearl-sugar Belgian waffles with maple syrup and whipped butter.',
        dietary: ['Halal'],
        spiciness: 1,
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
        popular: true
      }
    ]
  }
];

export const cuisineCategories = [
  'All Cuisines',
  'Mughlai & Indian',
  'Middle Eastern',
  'Burgers & Fries',
  'Italian & Pizza',
  'Asian & Wok',
  'Mexican & Cantina',
  'Seafood',
  'Healthy & Vegan',
  'Bakery & Coffee',
  'Desserts & Gelato'
];
