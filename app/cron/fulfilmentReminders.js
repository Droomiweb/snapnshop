// Run with: node cron/fulfilmentReminders.js
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Simple Schema definition for the script
const OrderSchema = new mongoose.Schema({
  orderId: String,
  supplierStatus: String,
  createdAt: Date
});
const Order = mongoose.model('Order', OrderSchema);

async function checkStalledOrders() {
  console.log("Checking for stalled orders...");
  
  if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI missing");
      return;
  }

  await mongoose.connect(process.env.MONGODB_URI);

  // 1. Find orders pending > 24 hours
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const stalledOrders = await Order.find({
    supplierStatus: 'Pending',
    createdAt: { $lt: oneDayAgo }
  });

  if (stalledOrders.length > 0) {
      console.log(`⚠️  ALERT: ${stalledOrders.length} orders are pending for more than 24 hours!`);
      stalledOrders.forEach(o => {
          console.log(` - Order ${o.orderId} (${o.createdAt})`);
      });
      // In a real app, you would verify this with nodemailer here:
      // await sendEmail(process.env.ADMIN_EMAIL, "Urgent: Stalled Orders", body);
  } else {
      console.log("✅ All pending orders are fresh (<24h).");
  }

  // 2. Find placed orders with no tracking > 5 days
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  const noTrackingOrders = await Order.find({
      supplierStatus: 'Placed',
      updatedAt: { $lt: fiveDaysAgo }
  });

  if (noTrackingOrders.length > 0) {
      console.log(`⚠️  ALERT: ${noTrackingOrders.length} orders placed > 5 days ago have no tracking!`);
      // Trigger escalation email
  }

  console.log("Done.");
  process.exit();
}

checkStalledOrders();