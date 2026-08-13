export type ModuleType = 
  | 'dashboard'
  | 'menu'
  | 'floor'
  | 'pos'
  | 'bills'
  | 'inventory'
  | 'reservations'
  | 'staff'
  | 'messages'
  | 'settings';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Manager' | 'Head Chef' | 'Waiter' | 'Cashier';
  avatar: string;
  pin?: string;
}

export type TableStatus = 'Free' | 'Occupied' | 'Reserved' | 'Dirty';

export interface Table {
  id: number;
  name: string; // e.g. "Table 1", "VIP 1", "Terrace 3"
  section: 'Main Hall' | 'Terrace' | 'VIP Lounge' | 'Bar Area';
  capacity: number;
  status: TableStatus;
  guestsCount?: number;
  serverName?: string;
  orderId?: string;
  timeSeated?: string;
  notes?: string;
}

export type MenuCategory = 
  | 'Ethiopian Specialties'
  | 'Starters & Salads'
  | 'Mains & Grill'
  | 'Pizzas & Pastas'
  | 'Beverages & Tej'
  | 'Desserts';

export type StockStatus = 'In Stock' | 'Low Stock' | '86 Out of Stock';

export interface MenuItem {
  id: string;
  name: string;
  nameAmharic: string;
  category: MenuCategory;
  priceETB: number;
  description: string;
  stockStatus: StockStatus;
  stockCount: number;
  isDailySpecial?: boolean;
  preparationTimeMinutes: number;
  tags?: string[];
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  priceETB: number;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'Pending' | 'Kitchen Preparing' | 'Ready' | 'Served' | 'Paid' | 'Cancelled';

export interface Order {
  id: string;
  type: 'Dine-in' | 'Takeaway' | 'Delivery';
  tableId?: number;
  tableName?: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotalETB: number;
  vatETB: number;
  serviceChargeETB: number;
  discountETB: number;
  grandTotalETB: number;
  timestamp: string;
  serverName: string;
  notes?: string;
}

export type PaymentMethod = 'Cash' | 'Card' | 'Telebirr' | 'CBE Birr' | 'Chapa';

export interface PaymentReceipt {
  id: string;
  orderId: string;
  tableName: string;
  items: OrderItem[];
  subtotalETB: number;
  vatETB: number;
  serviceChargeETB: number;
  discountETB: number;
  grandTotalETB: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  timestamp: string;
  cashierName: string;
  customerName?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  nameAmharic: string;
  quantity: number;
  unit: 'kg' | 'L' | 'pcs' | 'bottles' | 'packs';
  minThreshold: number;
  costPerUnitETB: number;
  status: 'Healthy' | 'Low Stock' | 'Critical';
  supplier: string;
  lastRestocked: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  phone: string;
  date: string;
  time: string;
  guestsCount: number;
  tableId?: number;
  notes?: string;
  status: 'Confirmed' | 'Arrived' | 'Completed' | 'Cancelled';
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Manager' | 'Head Chef' | 'Sous Chef' | 'Head Waiter' | 'Waiter' | 'Barista';
  shift: 'Morning' | 'Evening' | 'Full Day';
  isClockedIn: boolean;
  clockInTime?: string;
  totalTipsETB: number;
  rating: number;
  phone: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  channel: 'General' | 'Kitchen KDS' | 'Front of House' | 'ServePoint AI Manager';
  timestamp: string;
  isAi?: boolean;
}

export interface RestaurantSettings {
  restaurantName: string;
  location: string;
  currency: string;
  vatRate: number; // percentage e.g. 15
  serviceChargeRate: number; // percentage e.g. 10
  language: 'en' | 'am';
  theme: 'dark' | 'light' | 'slate';
  notifications: {
    push: boolean;
    email: boolean;
    soundAlerts: boolean;
  };
}
