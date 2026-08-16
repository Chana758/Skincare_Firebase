// functions/src/reports/dailySalesSummary.js
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

/**
 * Scheduled function: runs once daily at 23:55 (Phnom Penh time) and
 * writes a rollup document to reports/{YYYY-MM-DD} summarizing that
 * day's paid/completed orders — so ReportsAdmin.jsx can read cheap
 * pre-aggregated docs instead of scanning the whole orders collection.
 */
exports.dailySalesSummary = onSchedule(
  { schedule: "55 23 * * *", timeZone: "Asia/Phnom_Penh" },
  async () => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const snap = await db
        .collection("orders")
        .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(startOfDay))
        .get();

      let revenue = 0;
      let orderCount = 0;
      let itemsSold = 0;
      const productTally = {};

      snap.forEach((doc) => {
        const o = doc.data();
        
        // Filter เฉพาะ status ที่สำเร็จ (paid, completed, delivered) ឬถ้าไม่มี status ถือว่าเอาหมด
        const status = (o.status || "completed").toLowerCase();
        if (status === "cancelled" || status === "pending") return;

        // รองรับทั้ง field `total`, `totalAmount` និង `amount`
        const orderTotal = o.total || o.totalAmount || o.amount || 0;
        revenue += orderTotal;
        orderCount += 1;

        // រាប់ចំនួនទំនិញ (รองรับทั้ง items ឬ cartItems)
        const itemsList = o.items || o.cartItems || [];
        itemsList.forEach((item) => {
          const itemQty = item.qty || item.quantity || 1;
          const itemName = item.name || item.title || "Unknown Product";
          
          itemsSold += itemQty;
          productTally[itemName] = (productTally[itemName] || 0) + itemQty;
        });
      });

      const topProducts = Object.entries(productTally)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, qty]) => ({ name, qty }));

      const dateKey = startOfDay.toISOString().slice(0, 10); // YYYY-MM-DD

      await db.doc(`reports/${dateKey}`).set({
        date: dateKey,
        revenue,
        orderCount,
        itemsSold,
        topProducts,
        generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Daily summary for ${dateKey}: $${revenue.toFixed(2)} across ${orderCount} orders`);
    } catch (error) {
      console.error("Error generating daily sales summary:", error);
    }
  }
);