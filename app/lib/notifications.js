import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASS || 'pass',
  },
});

export async function sendEmail({ to, subject, html }) {
  if (!process.env.SMTP_HOST) {
    console.log(`[Mock Email] To: ${to} | Subject: ${subject}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"SnapNShop" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email failed:", error);
  }
}

export const EMAIL_TEMPLATES = {
  ORDER_CONFIRMATION: (order) => `
    <h1>Order Confirmed: ${order.orderId}</h1>
    <p>Hi ${order.customer.name},</p>
    <p>Thanks for your order! We are currently processing it with our warehouse.</p>
    <p><strong>Expected Processing Time:</strong> 2-5 Business Days</p>
    <p>You will receive another email with your tracking number as soon as it ships.</p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/tracking?orderId=${order.orderId}">Track Status Here</a>
  `,
  
  SHIPPING_UPDATE: (order) => `
    <h1>Good News! Your Order Has Shipped</h1>
    <p>Hi ${order.customer.name},</p>
    <p>Your order for the <strong>Wireless Mini Chopper</strong> is on its way.</p>
    
    <div style="border:1px solid #ddd; padding:15px; border-radius:8px; background:#f9f9f9;">
      <h3>Tracking Info</h3>
      <p><strong>Courier:</strong> ${order.courier}</p>
      <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
      <p><a href="${order.trackingUrl || '#'}">Click to Track</a></p>
    </div>
    
    <p>Estimated Delivery: 7-14 Days.</p>
  `
};