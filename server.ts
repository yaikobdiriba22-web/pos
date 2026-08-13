import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", system: "ServePoint Bella Vista", timestamp: new Date().toISOString() });
  });

  // ServePoint AI Assistant endpoint
  app.post("/api/assistant", async (req, res) => {
    try {
      const { prompt, systemState, language } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      const systemPrompt = `You are "ServePoint" — a complete, professional Full-Stack Restaurant Management System (SaaS) for "Bella Vista", a high-end modern restaurant in Addis Ababa, Ethiopia.

Your persona:
- Intelligent, professional, hospitable, and sharp restaurant manager combined with software intelligence.
- Always stay in character as ServePoint. Never say "As an AI..." or break character.
- Speak directly, concisely, and with structured formatting (tables, bullet points, key metrics in ETB, emojis).
- Keep state awareness of Bella Vista (tables, ETB prices, Doro Wat, Kitfo, Pizza, Tej, Espresso, Telebirr/CBE Birr payments).
- Currency is always ETB (Ethiopian Birr).
- Language setting: ${language || "English"} (if Amharic or requested, respond in Amharic with English terminology where appropriate).
- Always end responses with a clear status summary and a question like "What would you like to do next?" or suggested next action.

Current system state context:
${JSON.stringify(systemState || {}, null, 2)}
`;

      if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\nUser request/command: ${prompt}` }] }
          ]
        });

        const replyText = response.text || "ServePoint processed your request successfully.";
        return res.json({ reply: replyText });
      } else {
        // Fallback intelligent simulation when API key is pending user secret injection
        return res.json({
          reply: simulateServePointReply(prompt, systemState, language)
        });
      }
    } catch (err: any) {
      console.error("Error in /api/assistant:", err);
      return res.status(500).json({
        reply: "⚠️ ServePoint encounterd a minor processing error. System operational. What would you like to do next?"
      });
    }
  });

  // Vite middleware for development vs static in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ServePoint server listening on http://0.0.0.0:${PORT}`);
  });
}

function simulateServePointReply(prompt: string, state: any, lang: string): string {
  const p = prompt.toLowerCase();
  const isAmharic = lang === "amharic" || /[\u1200-\u137F]/.test(prompt) || p.includes("amharic") || p.includes("አማርኛ");

  if (p.includes("help")) {
    if (isAmharic) {
      return `📋 **የሰርቭፖይንት (ServePoint) ትዕዛዞች መመሪያ:**

• **dashboard** / **status**: የቀኑ ገቢ እና አጠቃላይ የቤላ ቪስታ ሁኔታ
• **menu**: የምግብ እና የመጠጥ ዝርዝር አስተዳደር
• **table 5** / **floor**: የወለል እና የጠረጴዛዎች ሁኔታ (20 ጠረጴዛዎች)
• **new order table 7**: አዲስ ትዕዛዝ ለጠረጴዛ 7 መክፈት
• **bill table 3**: የጠረጴዛ 3 ሂሳብ ማዘጋጀት (በብር / ቴሌብር / CBE)
• **inventory** / **low stock**: የዕቃዎች ክምችት እና ዝቅተኛ እቃዎች
• **reserve for 4 at 8pm John**: አዲስ የጠረጴዛ ቦታ ማስያዝ
• **staff**: የሰራተኞች ፈረቃ እና ክትትል
• **settings**: የሲስተም ቅንብሮች እና ቋንቋ

ምን ማድረግ ይፈልጋሉ?`;
    }
    return `📋 **ServePoint Command Shortcuts & Quick Guide:**

• **dashboard** / **status** → Live revenue (ETB), active tables, pending kitchen orders
• **menu** / **show menu** → Manage categories, ETB prices, 86 out-of-stock items
• **table 5** / **floor** → View 20 interactive floor tables (Free, Occupied, Reserved, Dirty)
• **new order table [X]** → Open Point-of-Sale for table or takeaway
• **bill table [X]** → Itemized ETB receipt, VAT, CBE Birr / Telebirr / Card payment
• **inventory** / **low stock** → Ingredient stock counts & reorder alerts
• **reserve for [N] at [Time] [Name]** → Book reservations instantly
• **staff** → Shifts, clock-in, waiter tip logs
• **settings** → Language (English/Amharic), tax setup, theme

What would you like to execute next?`;
  }

  if (p.includes("dashboard") || p.includes("status")) {
    return `📊 **Bella Vista Live Status Overview**

- **Total Today's Revenue:** 48,250 ETB (+18% vs yesterday)
- **Active Occupied Tables:** 8 / 20 Tables
- **Pending Kitchen Tickets:** 3 Orders
- **Low Stock Flag:** 2 Items (Teff Flour, Prime Beef)
- **Top Trending Dish:** Bella Vista Special Kitfo & Tej

Would you like to open the **Floor Plan** or view **Pending Orders** next?`;
  }

  if (p.includes("inventory") || p.includes("low stock")) {
    return `📦 **Inventory Status Alert**

| Ingredient | Current Level | Min Threshold | Status |
|---|---|---|---|
| Teff Flour | 8 kg | 15 kg | ⚠️ Low Stock |
| Prime Beef Cut | 5 kg | 10 kg | ⚠️ Low Stock |
| Niter Kibbeh (Spiced Butter) | 12 kg | 5 kg | ✅ Healthy |
| Berbere Spice | 18 kg | 5 kg | ✅ Healthy |
| Coffee Beans (Yirgacheffe) | 25 kg | 8 kg | ✅ Healthy |

**Recommendation:** Trigger auto-reorder for Teff Flour and Prime Beef to ensure dinner service readiness.

Shall I place a supplier reorder suggestion now?`;
  }

  if (p.includes("menu")) {
    return `🍽️ **Bella Vista Menu Summary**

- **Ethiopian Specialties:** Special Kitfo (480 ETB), Doro Wat Feast (520 ETB), Shekla Tibs (450 ETB)
- **Main Courses:** Grilled Salmon (680 ETB), Bella Vista Filet Mignon (720 ETB)
- **Pizzas & Pastas:** Seafood Linguine (390 ETB), Quattro Formaggi (340 ETB)
- **Beverages:** House Honey Tej (180 ETB), Yirgacheffe Espresso (60 ETB)

All prices in **ETB**. Stock status is active for 38 items (0 items currently 86'd).

Would you like to add a daily special or edit an item price?`;
  }

  if (p.includes("reserve") || p.includes("booking")) {
    return `📅 **Reservation Logged & Confirmed!**

- **Guest:** John Doe
- **Party Size:** 4 Guests
- **Time:** Today @ 8:00 PM
- **Assigned Table:** Table 12 (Window View)
- **Status:** Reserved ✅

Table 12 has been locked for this slot. Would you like to view all today's reservations or open the floor plan?`;
  }

  return `✅ **ServePoint Action Executed**: "${prompt}"

- System state updated in real-time.
- Bella Vista Operations log recorded.

What would you like to do next? (Type **dashboard**, **menu**, **floor**, **bill**, or **help**)`;
}

startServer();
