import {
  Table,
  MenuItem,
  Order,
  InventoryItem,
  Reservation,
  StaffMember,
  ChatMessage,
  RestaurantSettings,
  PaymentReceipt
} from '../types';

export const initialTables: Table[] = [
  { id: 1, name: 'Table 1', section: 'Main Hall', capacity: 2, status: 'Free' },
  { id: 2, name: 'Table 2', section: 'Main Hall', capacity: 2, status: 'Occupied', guestsCount: 2, serverName: 'Yonas', orderId: 'ORD-101', timeSeated: '19:15', notes: 'Anniversary couple' },
  { id: 3, name: 'Table 3', section: 'Main Hall', capacity: 4, status: 'Occupied', guestsCount: 3, serverName: 'Meron', orderId: 'ORD-102', timeSeated: '19:30' },
  { id: 4, name: 'Table 4', section: 'Main Hall', capacity: 4, status: 'Free' },
  { id: 5, name: 'Table 5', section: 'Main Hall', capacity: 6, status: 'Occupied', guestsCount: 5, serverName: 'Yonas', orderId: 'ORD-103', timeSeated: '18:45', notes: 'VIP Diplomatic table' },
  { id: 6, name: 'Table 6', section: 'Main Hall', capacity: 4, status: 'Reserved', guestsCount: 4, notes: 'Reserved for 20:30 (John Doe)' },
  { id: 7, name: 'Table 7', section: 'Main Hall', capacity: 2, status: 'Dirty', notes: 'Needs wiping' },
  { id: 8, name: 'Table 8', section: 'Main Hall', capacity: 2, status: 'Free' },
  { id: 9, name: 'Terrace 1', section: 'Terrace', capacity: 4, status: 'Occupied', guestsCount: 4, serverName: 'Meron', orderId: 'ORD-104', timeSeated: '19:10' },
  { id: 10, name: 'Terrace 2', section: 'Terrace', capacity: 4, status: 'Free' },
  { id: 11, name: 'Terrace 3', section: 'Terrace', capacity: 6, status: 'Free' },
  { id: 12, name: 'Terrace 4', section: 'Terrace', capacity: 2, status: 'Reserved', guestsCount: 2, notes: 'Reserved @ 20:00' },
  { id: 13, name: 'VIP 1', section: 'VIP Lounge', capacity: 8, status: 'Occupied', guestsCount: 7, serverName: 'Yonas', orderId: 'ORD-105', timeSeated: '18:30', notes: 'Corporate dinner' },
  { id: 14, name: 'VIP 2', section: 'VIP Lounge', capacity: 10, status: 'Free' },
  { id: 15, name: 'VIP 3', section: 'VIP Lounge', capacity: 6, status: 'Free' },
  { id: 16, name: 'Bar 1', section: 'Bar Area', capacity: 2, status: 'Occupied', guestsCount: 1, serverName: 'Chaltu', orderId: 'ORD-106', timeSeated: '19:40' },
  { id: 17, name: 'Bar 2', section: 'Bar Area', capacity: 2, status: 'Free' },
  { id: 18, name: 'Bar 3', section: 'Bar Area', capacity: 2, status: 'Free' },
  { id: 19, name: 'Bar 4', section: 'Bar Area', capacity: 2, status: 'Dirty' },
  { id: 20, name: 'Garden 1', section: 'Terrace', capacity: 6, status: 'Free' },
];

export const initialMenuItems: MenuItem[] = [
  {
    id: 'm1',
    name: 'Bella Vista Special Kitfo',
    nameAmharic: 'ቤላ ቪስታ ልዩ ክትፎ',
    category: 'Ethiopian Specialties',
    priceETB: 580,
    description: 'Finely minced prime beef seasoned with Niter Kibbeh, Mitmita, served with Ayib cottage cheese & Gomen.',
    stockStatus: 'In Stock',
    stockCount: 25,
    isDailySpecial: true,
    preparationTimeMinutes: 15,
    tags: ['Signature', 'Spicy', 'Popular']
  },
  {
    id: 'm2',
    name: 'Doro Wat Royal Feast',
    nameAmharic: 'የዶሮ ወጥ ድግስ',
    category: 'Ethiopian Specialties',
    priceETB: 640,
    description: 'Slow-cooked organic chicken stew simmered in rich Berbere sauce with boiled egg & 100% Teff Injera.',
    stockStatus: 'In Stock',
    stockCount: 18,
    isDailySpecial: true,
    preparationTimeMinutes: 20,
    tags: ['Traditional', 'Must-Try']
  },
  {
    id: 'm3',
    name: 'Bella Vista Special Shekla Tibs',
    nameAmharic: 'የሸክላ ጥብስ',
    category: 'Ethiopian Specialties',
    priceETB: 520,
    description: 'Sizzling prime beef cubes sauteed with onions, rosemary, jalapenos, served on a clay pot dish.',
    stockStatus: 'In Stock',
    stockCount: 30,
    isDailySpecial: false,
    preparationTimeMinutes: 15,
    tags: ['Sizzling', 'Favorites']
  },
  {
    id: 'm4',
    name: 'Yebeg Beyaynetu (Combo Platter)',
    nameAmharic: 'የበየነቱ ክምችት',
    category: 'Ethiopian Specialties',
    priceETB: 480,
    description: 'Assorted lentils, shiro, gomen, kik alicha, and spicy lamb tibs arranged on fresh Injera.',
    stockStatus: 'In Stock',
    stockCount: 40,
    isDailySpecial: false,
    preparationTimeMinutes: 12,
    tags: ['Platter', 'Sharing']
  },
  {
    id: 'm5',
    name: 'Filet Mignon Bella Vista',
    nameAmharic: 'ፊሌ ሚኞን ቤላ ቪስታ',
    category: 'Mains & Grill',
    priceETB: 780,
    description: 'Tender beef tenderloin grilled to perfection, served with truffle mash and peppercorn reduction sauce.',
    stockStatus: 'Low Stock',
    stockCount: 5,
    isDailySpecial: false,
    preparationTimeMinutes: 25,
    tags: ['Chef Special', 'Gourmet']
  },
  {
    id: 'm6',
    name: 'Grilled Red Sea Salmon',
    nameAmharic: 'የተጠበሰ ሳልሞን አሳ',
    category: 'Mains & Grill',
    priceETB: 850,
    description: 'Pan-seared salmon fillet over buttered asparagus and lemon caper drizzle.',
    stockStatus: 'In Stock',
    stockCount: 12,
    isDailySpecial: false,
    preparationTimeMinutes: 20,
    tags: ['Seafood']
  },
  {
    id: 'm7',
    name: 'Bella Vista Quattro Formaggi Pizza',
    nameAmharic: 'ቤላ ቪስታ አራት ቺዝ ፒዛ',
    category: 'Pizzas & Pastas',
    priceETB: 420,
    description: 'Wood-fired sourdough base topped with Mozzarella, Gorgonzola, Parmesan, and Ayib twist.',
    stockStatus: 'In Stock',
    stockCount: 35,
    isDailySpecial: false,
    preparationTimeMinutes: 14,
    tags: ['Vegetarian', 'Wood-fired']
  },
  {
    id: 'm8',
    name: 'Seafood Linguine Marinara',
    nameAmharic: 'ሊንጉዊኒ ፓስታ በባህር ምግብ',
    category: 'Pizzas & Pastas',
    priceETB: 460,
    description: 'Fresh homemade pasta tossed with shrimp, calamari, white wine, garlic, and rich tomato coulis.',
    stockStatus: 'In Stock',
    stockCount: 22,
    isDailySpecial: false,
    preparationTimeMinutes: 18,
    tags: ['Pasta']
  },
  {
    id: 'm9',
    name: 'House Special Honey Tej (750ml)',
    nameAmharic: 'የቤት ውስጥ ማር ጠጅ',
    category: 'Beverages & Tej',
    priceETB: 280,
    description: 'Authentic fermented Ethiopian honey wine brewed with pure Gesho and raw highland honey.',
    stockStatus: 'In Stock',
    stockCount: 50,
    isDailySpecial: true,
    preparationTimeMinutes: 2,
    tags: ['Authentic Drink']
  },
  {
    id: 'm10',
    name: 'Yirgacheffe Single-Origin Espresso',
    nameAmharic: 'ይርጋጨፌ ቡና ኤስፕሬሶ',
    category: 'Beverages & Tej',
    priceETB: 80,
    description: 'Freshly roasted Ethiopian Arabica coffee with floral notes and rich crema.',
    stockStatus: 'In Stock',
    stockCount: 100,
    isDailySpecial: false,
    preparationTimeMinutes: 3,
    tags: ['Coffee']
  },
  {
    id: 'm11',
    name: 'Highland Spris Juice (Avocado-Mango-Papaya)',
    nameAmharic: 'ስፕሪስ ጭማቂ (አቮካዶ፣ ማንጎ፣ ፓፓያ)',
    category: 'Beverages & Tej',
    priceETB: 120,
    description: 'Layered fresh fruit puree with a squeeze of lime and honey drizzle.',
    stockStatus: 'In Stock',
    stockCount: 45,
    isDailySpecial: false,
    preparationTimeMinutes: 5,
    tags: ['Fresh Juice']
  },
  {
    id: 'm12',
    name: 'Bella Vista Coffee Tiramisu',
    nameAmharic: 'ቤላ ቪስታ ቲራሚሱ',
    category: 'Desserts',
    priceETB: 240,
    description: 'Classic Italian tiramisu infused with Yirgacheffe espresso and mascarpone cream.',
    stockStatus: 'In Stock',
    stockCount: 15,
    isDailySpecial: false,
    preparationTimeMinutes: 5,
    tags: ['Dessert']
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-101',
    type: 'Dine-in',
    tableId: 2,
    tableName: 'Table 2',
    items: [
      { id: 'oi1', menuItemId: 'm1', name: 'Bella Vista Special Kitfo', priceETB: 580, quantity: 1, notes: 'Medium rare, extra Ayib' },
      { id: 'oi2', menuItemId: 'm9', name: 'House Special Honey Tej', priceETB: 280, quantity: 1 }
    ],
    status: 'Served',
    subtotalETB: 860,
    vatETB: 129,
    serviceChargeETB: 86,
    discountETB: 0,
    grandTotalETB: 1075,
    timestamp: '19:20',
    serverName: 'Yonas'
  },
  {
    id: 'ORD-102',
    type: 'Dine-in',
    tableId: 3,
    tableName: 'Table 3',
    items: [
      { id: 'oi3', menuItemId: 'm2', name: 'Doro Wat Royal Feast', priceETB: 640, quantity: 1 },
      { id: 'oi4', menuItemId: 'm3', name: 'Bella Vista Special Shekla Tibs', priceETB: 520, quantity: 1 },
      { id: 'oi5', menuItemId: 'm11', name: 'Highland Spris Juice', priceETB: 120, quantity: 2 }
    ],
    status: 'Kitchen Preparing',
    subtotalETB: 1400,
    vatETB: 210,
    serviceChargeETB: 140,
    discountETB: 0,
    grandTotalETB: 1750,
    timestamp: '19:35',
    serverName: 'Meron'
  },
  {
    id: 'ORD-103',
    type: 'Dine-in',
    tableId: 5,
    tableName: 'Table 5',
    items: [
      { id: 'oi6', menuItemId: 'm5', name: 'Filet Mignon Bella Vista', priceETB: 780, quantity: 2 },
      { id: 'oi7', menuItemId: 'm6', name: 'Grilled Red Sea Salmon', priceETB: 850, quantity: 1 },
      { id: 'oi8', menuItemId: 'm9', name: 'House Special Honey Tej', priceETB: 280, quantity: 2 }
    ],
    status: 'Kitchen Preparing',
    subtotalETB: 2970,
    vatETB: 445.5,
    serviceChargeETB: 297,
    discountETB: 100,
    grandTotalETB: 3612.5,
    timestamp: '18:50',
    serverName: 'Yonas'
  },
  {
    id: 'ORD-104',
    type: 'Dine-in',
    tableId: 9,
    tableName: 'Terrace 1',
    items: [
      { id: 'oi9', menuItemId: 'm7', name: 'Bella Vista Quattro Formaggi Pizza', priceETB: 420, quantity: 2 },
      { id: 'oi10', menuItemId: 'm8', name: 'Seafood Linguine Marinara', priceETB: 460, quantity: 1 },
      { id: 'oi11', menuItemId: 'm10', name: 'Yirgacheffe Single-Origin Espresso', priceETB: 80, quantity: 3 }
    ],
    status: 'Ready',
    subtotalETB: 1540,
    vatETB: 231,
    serviceChargeETB: 154,
    discountETB: 0,
    grandTotalETB: 1925,
    timestamp: '19:15',
    serverName: 'Meron'
  }
];

export const initialInventory: InventoryItem[] = [
  {
    id: 'inv1',
    name: '100% Organic Teff Flour',
    nameAmharic: 'የጤፍ ዱቄት',
    quantity: 8,
    unit: 'kg',
    minThreshold: 20,
    costPerUnitETB: 120,
    status: 'Low Stock',
    supplier: 'Debre Zeit Grain Corp',
    lastRestocked: '2026-07-25'
  },
  {
    id: 'inv2',
    name: 'Prime Beef Cut (Tenderloin & Ribeye)',
    nameAmharic: 'የበሬ ሥጋ (ፊሌ እና ሪብአይ)',
    quantity: 6,
    unit: 'kg',
    minThreshold: 15,
    costPerUnitETB: 650,
    status: 'Low Stock',
    supplier: 'Modjo Abattoir Enterprise',
    lastRestocked: '2026-07-27'
  },
  {
    id: 'inv3',
    name: 'Highland Niter Kibbeh (Spiced Butter)',
    nameAmharic: 'የሀበሻ ንጥር ቅቤ',
    quantity: 18,
    unit: 'kg',
    minThreshold: 8,
    costPerUnitETB: 800,
    status: 'Healthy',
    supplier: 'Sululta Dairy Farmers',
    lastRestocked: '2026-07-28'
  },
  {
    id: 'inv4',
    name: 'Aromatic Berbere Spice',
    nameAmharic: 'በርበሬ',
    quantity: 25,
    unit: 'kg',
    minThreshold: 10,
    costPerUnitETB: 350,
    status: 'Healthy',
    supplier: 'Mertule Maryam Spices',
    lastRestocked: '2026-07-20'
  },
  {
    id: 'inv5',
    name: 'Yirgacheffe Arabica Coffee Beans',
    nameAmharic: 'የይርጋጨፌ ቡና እህል',
    quantity: 35,
    unit: 'kg',
    minThreshold: 12,
    costPerUnitETB: 450,
    status: 'Healthy',
    supplier: 'Gedeo Coffee Cooperative',
    lastRestocked: '2026-07-26'
  },
  {
    id: 'inv6',
    name: 'Raw Highland Honey (For Tej)',
    nameAmharic: 'ንጹህ የወይን ማር',
    quantity: 40,
    unit: 'L',
    minThreshold: 15,
    costPerUnitETB: 320,
    status: 'Healthy',
    supplier: 'Gojjam Honey Traders',
    lastRestocked: '2026-07-22'
  }
];

export const initialReservations: Reservation[] = [
  {
    id: 'res-1',
    guestName: 'H.E. Ambassador Samuel',
    phone: '+251 91 123 4567',
    date: '2026-07-29',
    time: '20:00',
    guestsCount: 4,
    tableId: 6,
    notes: 'Quiet table preferred, VIP service requested',
    status: 'Confirmed'
  },
  {
    id: 'res-2',
    guestName: 'Bethlehem Tilahun',
    phone: '+251 92 234 5678',
    date: '2026-07-29',
    time: '20:30',
    guestsCount: 2,
    tableId: 12,
    notes: 'Terrace candle-lit table for birthday',
    status: 'Confirmed'
  },
  {
    id: 'res-3',
    guestName: 'Dr. Tedros M.',
    phone: '+251 93 345 6789',
    date: '2026-07-30',
    time: '19:30',
    guestsCount: 8,
    tableId: 14,
    notes: 'Needs gluten-free options',
    status: 'Confirmed'
  }
];

export const initialStaff: StaffMember[] = [
  { id: 'stf-1', name: 'Abebe Bikila', role: 'Manager', shift: 'Full Day', isClockedIn: true, clockInTime: '08:00', totalTipsETB: 1200, rating: 4.9, phone: '+251 91 111 2233' },
  { id: 'stf-2', name: 'Tigist Assefa', role: 'Head Chef', shift: 'Evening', isClockedIn: true, clockInTime: '16:00', totalTipsETB: 2400, rating: 5.0, phone: '+251 91 222 3344' },
  { id: 'stf-3', name: 'Yonas Tadesse', role: 'Head Waiter', shift: 'Evening', isClockedIn: true, clockInTime: '16:30', totalTipsETB: 1850, rating: 4.8, phone: '+251 91 333 4455' },
  { id: 'stf-4', name: 'Meron Hailu', role: 'Waiter', shift: 'Evening', isClockedIn: true, clockInTime: '17:00', totalTipsETB: 1420, rating: 4.7, phone: '+251 91 444 5566' },
  { id: 'stf-5', name: 'Chaltu Kebede', role: 'Barista', shift: 'Evening', isClockedIn: true, clockInTime: '15:30', totalTipsETB: 980, rating: 4.9, phone: '+251 91 555 6677' },
  { id: 'stf-6', name: 'Dawit Yohannes', role: 'Sous Chef', shift: 'Morning', isClockedIn: false, totalTipsETB: 1100, rating: 4.6, phone: '+251 91 666 7788' }
];

export const initialChatMessages: ChatMessage[] = [
  { id: 'cm-1', sender: 'Abebe (Manager)', text: 'Good evening team! Dinner service is officially open. We have 3 VIP reservations tonight.', channel: 'General', timestamp: '18:00' },
  { id: 'cm-2', sender: 'Tigist (Head Chef)', text: 'Kitchen prep is 100% ready. Note that Teff Flour is down to 8kg, please place supplier order.', channel: 'Kitchen KDS', timestamp: '18:15' },
  { id: 'cm-3', sender: 'Yonas (Head Waiter)', text: 'Table 5 diplomatic party has arrived. Serving Tej apperitif.', channel: 'Front of House', timestamp: '18:48' },
  { id: 'cm-4', sender: 'ServePoint AI Manager', text: '👋 Welcome to ServePoint – Bella Vista Restaurant Management System!\nI’m your complete restaurant brain (Full-Stack ready).\n\nHow can I help you today? (Type **help** for all commands)', channel: 'ServePoint AI Manager', timestamp: '19:00', isAi: true }
];

export const initialPaidReceipts: PaymentReceipt[] = [
  {
    id: 'RCP-991',
    orderId: 'ORD-099',
    tableName: 'Table 4',
    items: [
      { id: 'rcp1', menuItemId: 'm3', name: 'Bella Vista Special Shekla Tibs', priceETB: 520, quantity: 2 },
      { id: 'rcp2', menuItemId: 'm9', name: 'House Special Honey Tej', priceETB: 280, quantity: 2 }
    ],
    subtotalETB: 1600,
    vatETB: 240,
    serviceChargeETB: 160,
    discountETB: 0,
    grandTotalETB: 2000,
    paymentMethod: 'Telebirr',
    paymentReference: 'TLB-883920192',
    timestamp: '18:15',
    cashierName: 'Abebe Bikila',
    customerName: 'Kassahun Alemayehu'
  },
  {
    id: 'RCP-992',
    orderId: 'ORD-100',
    tableName: 'Terrace 2',
    items: [
      { id: 'rcp3', menuItemId: 'm4', name: 'Yebeg Beyaynetu Combo', priceETB: 480, quantity: 3 },
      { id: 'rcp4', menuItemId: 'm10', name: 'Yirgacheffe Espresso', priceETB: 80, quantity: 3 }
    ],
    subtotalETB: 1680,
    vatETB: 252,
    serviceChargeETB: 168,
    discountETB: 100,
    grandTotalETB: 2000,
    paymentMethod: 'CBE Birr',
    paymentReference: 'CBE-77281938',
    timestamp: '18:40',
    cashierName: 'Abebe Bikila',
    customerName: 'Helina Kebede'
  }
];

export const initialSettings: RestaurantSettings = {
  restaurantName: 'Bella Vista Restaurant',
  location: 'Bole Road, Near Friendship Mall, Addis Ababa, Ethiopia',
  currency: 'ETB',
  vatRate: 15,
  serviceChargeRate: 10,
  language: 'en',
  theme: 'dark',
  notifications: {
    push: true,
    email: true,
    soundAlerts: true
  }
};
