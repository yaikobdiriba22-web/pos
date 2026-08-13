/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ModuleType,
  Table,
  MenuItem,
  Order,
  InventoryItem,
  Reservation,
  StaffMember,
  ChatMessage,
  PaymentReceipt,
  RestaurantSettings
} from './types';
import {
  initialTables,
  initialMenuItems,
  initialOrders,
  initialInventory,
  initialReservations,
  initialStaff,
  initialChatMessages,
  initialPaidReceipts,
  initialSettings
} from './data/initialData';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardModule } from './components/DashboardModule';
import { MenuModule } from './components/MenuModule';
import { FloorPlanModule } from './components/FloorPlanModule';
import { PosModule } from './components/PosModule';
import { BillsPaymentsModule } from './components/BillsPaymentsModule';
import { InventoryModule } from './components/InventoryModule';
import { ReservationsModule } from './components/ReservationsModule';
import { StaffModule } from './components/StaffModule';
import { MessagesModule } from './components/MessagesModule';
import { SettingsModule } from './components/SettingsModule';
import { CommandAssistantModal } from './components/CommandAssistantModal';

import { LoginPage } from './components/LoginPage';
import { User } from './types';

export default function App() {
  // Global State
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'u1',
    name: 'Abebe Bikila',
    email: 'abebe@bellavista.et',
    role: 'Manager',
    avatar: '👨‍💼'
  });
  const [currentModule, setCurrentModule] = useState<ModuleType>('dashboard');
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(initialPaidReceipts);
  const [settings, setSettings] = useState<RestaurantSettings>(initialSettings);

  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<number | undefined>(2);

  const isAmharic = settings.language === 'am';

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAssistantOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Quick stats
  const lowStockCount = inventory.filter(
    (i) => i.status === 'Low Stock' || i.status === 'Critical'
  ).length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'Paid').length;
  const reservationsCount = reservations.filter((r) => r.status === 'Confirmed').length;

  const handleQuickUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  // ServePoint Assistant Command Handler
  const handleExecuteCommand = async (commandText: string): Promise<string> => {
    const p = commandText.toLowerCase().trim();

    // Module Switch Shortcuts
    if (p === 'dashboard' || p === 'status') {
      setCurrentModule('dashboard');
      return `📊 Switched to **Dashboard**. Total Today Revenue: ${orders
        .reduce((sum, o) => sum + o.grandTotalETB, 48250)
        .toLocaleString()} ETB. What would you like to do next?`;
    }

    if (p.includes('menu') || p.includes('show menu')) {
      setCurrentModule('menu');
      return `🍽️ Switched to **Menu & Dishes**. ${menuItems.length} active culinary items available. What would you like to edit or 86 next?`;
    }

    if (p.includes('table') || p.includes('floor')) {
      const match = p.match(/table\s*(\d+)/i);
      if (match && match[1]) {
        const tableNum = parseInt(match[1], 10);
        setSelectedTableForOrder(tableNum);
        setCurrentModule('floor');
        return `📍 Navigated to **Floor Plan** highlighting **Table ${tableNum}**. Status: ${
          tables.find((t) => t.id === tableNum)?.status || 'Free'
        }. What would you like to do next?`;
      }
      setCurrentModule('floor');
      return `📍 Opened **Floor Plan**. 20 tables loaded. What would you like to do next?`;
    }

    if (p.includes('new order') || p.includes('order')) {
      const match = p.match(/table\s*(\d+)/i);
      if (match && match[1]) {
        const tableNum = parseInt(match[1], 10);
        setSelectedTableForOrder(tableNum);
      }
      setCurrentModule('pos');
      return `🛒 Opened **Point-of-Sale (POS Matrix)**. Build items and send ticket to Kitchen KDS. What would you like to order?`;
    }

    if (p.includes('bill')) {
      const match = p.match(/table\s*(\d+)/i);
      if (match && match[1]) {
        const tableNum = parseInt(match[1], 10);
        setSelectedTableForOrder(tableNum);
      }
      setCurrentModule('bills');
      return `🧾 Opened **Bills & Payments**. Ready to settle order with Cash, Telebirr, CBE Birr or Card. What would you like to do next?`;
    }

    if (p.includes('inventory') || p.includes('low stock')) {
      setCurrentModule('inventory');
      return `📦 Opened **Inventory**. Low Stock Alert: ${lowStockCount} items flagged (Teff Flour, Prime Beef). What would you like to reorder?`;
    }

    if (p.includes('reserve') || p.includes('booking')) {
      setCurrentModule('reservations');
      return `📅 Opened **Reservations**. ${reservationsCount} confirmed bookings tonight. What would you like to do next?`;
    }

    if (p.includes('staff')) {
      setCurrentModule('staff');
      return `👥 Switched to **Staff Roster**. ${
        staff.filter((s) => s.isClockedIn).length
      } staff currently clocked in. What would you like to do next?`;
    }

    if (p.includes('settings')) {
      setCurrentModule('settings');
      return `⚙️ Opened **Settings**. Language, Tax Rates, Theme & Security loaded. What would you like to adjust?`;
    }

    if (p.includes('amharic') || p.includes('አማርኛ')) {
      setSettings((prev) => ({ ...prev, language: 'am' }));
      return `ቋንቋው ወደ **አማርኛ** ተቀይሯል። የቤላ ቪስታ ሲስተም ዝግጁ ነው። ምን ማድረግ ይፈልጋሉ?`;
    }

    if (p.includes('english')) {
      setSettings((prev) => ({ ...prev, language: 'en' }));
      return `Language switched to **English**. ServePoint ready. What would you like to do next?`;
    }

    // Call server express assistant endpoint
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: commandText,
          systemState: {
            totalRevenueETB: 48250,
            activeTablesCount: tables.filter((t) => t.status === 'Occupied').length,
            pendingOrdersCount: activeOrdersCount,
            lowStockCount,
            currentModule
          },
          language: settings.language
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.reply;
      }
    } catch (err) {
      console.error('API assistant call error:', err);
    }

    return `✅ Command processed: "${commandText}". ServePoint state updated. What would you like to do next?`;
  };

  if (!currentUser) {
    return (
      <LoginPage
        onLogin={(user) => setCurrentUser(user)}
        isAmharic={isAmharic}
        onToggleLanguage={() =>
          setSettings((prev) => ({
            ...prev,
            language: prev.language === 'am' ? 'en' : 'am'
          }))
        }
      />
    );
  }

  return (
    <div className="min-h-screen font-sans bg-[#F8FAFC] text-slate-800 flex flex-col antialiased">
      {/* Top Navigation */}
      <Navbar
        currentModule={currentModule}
        setCurrentModule={setCurrentModule}
        settings={settings}
        setSettings={setSettings}
        onOpenCommandAssistant={() => setIsAssistantOpen(true)}
        lowStockCount={lowStockCount}
        pendingOrdersCount={activeOrdersCount}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentModule={currentModule}
          setCurrentModule={setCurrentModule}
          isAmharic={isAmharic}
          lowStockCount={lowStockCount}
          activeOrdersCount={activeOrdersCount}
          reservationsCount={reservationsCount}
          currentUser={currentUser}
        />

        {/* Dynamic Module Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {currentModule === 'dashboard' && (
            <DashboardModule
              orders={orders}
              tables={tables}
              inventory={inventory}
              staff={staff}
              isAmharic={isAmharic}
              setCurrentModule={setCurrentModule}
              onQuickUpdateOrderStatus={handleQuickUpdateOrderStatus}
              currentUser={currentUser}
            />
          )}

          {currentModule === 'menu' && (
            <MenuModule
              menuItems={menuItems}
              setMenuItems={setMenuItems}
              isAmharic={isAmharic}
            />
          )}

          {currentModule === 'floor' && (
            <FloorPlanModule
              tables={tables}
              setTables={setTables}
              orders={orders}
              isAmharic={isAmharic}
              setCurrentModule={setCurrentModule}
              setSelectedTableForOrder={setSelectedTableForOrder}
            />
          )}

          {currentModule === 'pos' && (
            <PosModule
              menuItems={menuItems}
              tables={tables}
              orders={orders}
              setOrders={setOrders}
              isAmharic={isAmharic}
              setCurrentModule={setCurrentModule}
              selectedTableForOrder={selectedTableForOrder}
              setSelectedTableForOrder={setSelectedTableForOrder}
            />
          )}

          {currentModule === 'bills' && (
            <BillsPaymentsModule
              orders={orders}
              receipts={receipts}
              setReceipts={setReceipts}
              setOrders={setOrders}
              isAmharic={isAmharic}
              selectedTableForOrder={selectedTableForOrder}
            />
          )}

          {currentModule === 'inventory' && (
            <InventoryModule
              inventory={inventory}
              setInventory={setInventory}
              isAmharic={isAmharic}
            />
          )}

          {currentModule === 'reservations' && (
            <ReservationsModule
              reservations={reservations}
              setReservations={setReservations}
              tables={tables}
              setTables={setTables}
              isAmharic={isAmharic}
              setCurrentModule={setCurrentModule}
            />
          )}

          {currentModule === 'staff' && (
            <StaffModule
              staff={staff}
              setStaff={setStaff}
              isAmharic={isAmharic}
              currentUser={currentUser}
            />
          )}

          {currentModule === 'messages' && (
            <MessagesModule
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
              isAmharic={isAmharic}
              onSendToAiAssistant={handleExecuteCommand}
            />
          )}

          {currentModule === 'settings' && (
            <SettingsModule
              settings={settings}
              setSettings={setSettings}
              isAmharic={isAmharic}
              currentUser={currentUser}
            />
          )}
        </main>
      </div>

      {/* Floating Command Console Modal */}
      <CommandAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onExecuteCommand={handleExecuteCommand}
        setCurrentModule={setCurrentModule}
        isAmharic={isAmharic}
      />
    </div>
  );
}
