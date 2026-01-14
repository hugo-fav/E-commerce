import { Resend } from "resend";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

export const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendOrderStatusEmail({
  to,
  name = "",
  reference = "",
  status = "",
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }
  const from = "Your Store <orders@e-commerce-two-nu-19.vercel.app>";

  const safeName = escapeHtml(name);
  const safeRef = escapeHtml(reference);
  const safeStatus = escapeHtml(status).toUpperCase();

  const html = `<div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2>Hello ${safeName},</h2>
      <p>Your order <strong>#${safeRef}</strong> has been updated.</p>
      <p><strong>Current status:</strong> <span style="color:#2563eb">${safeStatus}</span></p>
      <p>You can track your order anytime here:<br />
        <a href="${siteUrl}/orders/track/${encodeURIComponent(
    safeRef
  )}">Track Order</a>
      </p>
      <p>Thank you for shopping with us 💙</p>
    </div>`;

  const text = `Hello ${name},
Your order #${reference} is now ${status}.
Track: ${siteUrl}/orders/track/${encodeURIComponent(reference)}
Thank you for shopping with us.`;

  try {
    return await resend.emails.send({
      from,
      to,
      subject: `Order ${reference} is now ${status}`,
      html,
      text,
    });
  } catch (err) {
    console.error("sendOrderStatusEmail error:", err);
    throw err;
  }
}
