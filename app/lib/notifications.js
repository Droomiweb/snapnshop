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
  // Guard clause for missing config
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn(`[Mock Email - Missing Config] To: ${to} | Subject: ${subject}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"SnapNShop Support" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email failed:", error);
  }
}

// Helper to get base URL safely
const getBaseUrl = () => process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const EMAIL_TEMPLATES = {
  ORDER_CONFIRMATION: (order) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Order Confirmed: ${order.orderId}</h1>
      <p>Hi ${order.customer.name},</p>
      <p>Thanks for your order! We have received your payment of <strong>${order.currency} ${order.amount}</strong>.</p>
      <p>We are currently processing it with our warehouse.</p>
      <p><strong>Expected Processing Time:</strong> 2-5 Business Days</p>
      <div style="padding: 15px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; margin: 20px 0;">
        <p style="margin:0; font-weight:bold; color: #166534;">Next Step: You will receive a tracking number as soon as it ships.</p>
      </div>
      <p><a href="${getBaseUrl()}/tracking?orderId=${order.orderId}" style="display:inline-block; background:#000; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px;">Track Status</a></p>
    </div>
  `,
  
  SHIPPING_UPDATE: (order) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Your Order Has Shipped! 🚚</h1>
      <p>Hi ${order.customer.name},</p>
      <p>Your order is on its way.</p>
      
      <div style="border:1px solid #ddd; padding:15px; border-radius:8px; background:#f9f9f9;">
        <h3>Tracking Details</h3>
        <p><strong>Courier:</strong> ${order.courier}</p>
        <p><strong>Tracking Number:</strong> <span style="font-family: monospace; font-size: 1.1em;">${order.trackingNumber}</span></p>
        <p><a href="${order.trackingUrl || `https://www.google.com/search?q=${order.trackingNumber}`}">Click here to Track</a></p>
      </div>
      
      <p>Estimated Delivery: 7-14 Days.</p>
    </div>
  `
};