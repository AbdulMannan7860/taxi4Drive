const nodemailer = require("nodemailer");

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransporter() {
  if (!hasSmtpConfig()) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function bookingHtml(booking, audience) {
  return `
    <div style="font-family:Arial,sans-serif;color:#071426;line-height:1.6">
      <h2 style="margin:0 0 12px">Taxi4Drive booking ${audience === "admin" ? "received" : "confirmation"}</h2>
      <p><strong>Reference:</strong> ${booking.reference}</p>
      <p><strong>Customer:</strong> ${booking.customerName}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Journey:</strong> ${booking.pickup} to ${booking.dropoff}</p>
      <p><strong>Date/time:</strong> ${booking.date} ${booking.time}</p>
      <p><strong>Vehicle:</strong> ${booking.vehicle}</p>
      <p><strong>Estimated fare:</strong> $${booking.estimatedFare}</p>
      <p><strong>Status:</strong> ${booking.status}</p>
    </div>
  `;
}

async function sendBookingEmails(booking) {
  const transporter = createTransporter();
  if (!transporter) {
    return { skipped: true };
  }

  const from = process.env.MAIL_FROM || "Taxi4Drive <book@taxi4drive.com.au>";
  const adminEmail = process.env.ADMIN_EMAIL || "book@taxi4drive.com.au";

  await Promise.all([
    transporter.sendMail({
      from,
      to: booking.email,
      subject: `Taxi4Drive booking received - ${booking.reference}`,
      html: bookingHtml(booking, "customer")
    }),
    transporter.sendMail({
      from,
      to: adminEmail,
      subject: `New booking - ${booking.reference}`,
      html: bookingHtml(booking, "admin")
    })
  ]);

  return { skipped: false };
}

module.exports = {
  sendBookingEmails
};
