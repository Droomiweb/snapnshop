import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  if (!process.env.SMTP_USER) return;

  try {
    // 1. Send to Customer
    await transporter.sendMail({
      from: `"SnapNShop" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });

    // 2. Send Copy to Admin (You)
    // Only if it's an order confirmation or critical alert
    if (subject.includes('Order Confirmed') || subject.includes('Urgent')) {
        await transporter.sendMail({
            from: `"System Bot" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL, // Add ADMIN_EMAIL to your .env
            subject: `[ADMIN ALERT] ${subject}`,
            html: `<p>New Order on Store!</p>${html}`,
        });
    }
    
    console.log(`Email sent to ${to} and Admin`);
  } catch (error) {
    console.error("Email failed:", error);
  }
}

const getBaseUrl = () => process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const EMAIL_TEMPLATES = {
  ORDER_CONFIRMATION: (order) => `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
      <h2>Order Confirmed: ${order.orderId}</h2>
      <p>Store: <strong>${order.storeId}</strong></p>
      <p>Amount: ₹${order.amount}</p>
      <h3>Shipping To:</h3>
      <p>${order.customer.name}<br/>${order.customer.address}, ${order.customer.city}<br/>Ph: ${order.customer.phone}</p>
      <p><a href="${getBaseUrl()}/tracking?orderId=${order.orderId}">Track Order</a></p>
    </div>
  `,
  SHIPPING_UPDATE: (order) => `
    <div>
      <h2>Your Order Has Shipped!</h2>
      <p>Courier: ${order.courier}</p>
      <p>Tracking: ${order.trackingNumber}</p>
    </div>
  `
};