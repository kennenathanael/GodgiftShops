import { Resend } from "resend";
import { formatPrice } from "./utils";

type OrderNotificationItem = {
  productName: string;
  quantity: number;
  priceAtPurchase: number | string;
};

type OrderNotificationData = {
  orderId: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string | null;
  deliveryAddress: string;
  totalAmount: number | string;
  items: OrderNotificationItem[];
};

/**
 * Sends an email to the shop owner whenever a new order is placed.
 * Fails silently (logs only) so a broken email setup never blocks checkout.
 */
export async function sendOrderNotificationEmail(order: OrderNotificationData) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!apiKey || !notifyTo) {
    console.log("Email notification skipped: RESEND_API_KEY or ORDER_NOTIFICATION_EMAIL not set.");
    return;
  }

  try {
    const resend = new Resend(apiKey);

    const itemsHtml = order.items
      .map(
        (item) =>
          `<tr>
            <td style="padding:6px 0;border-bottom:1px solid #eee;">${item.productName}</td>
            <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
            <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right;">${formatPrice(item.priceAtPurchase)}</td>
          </tr>`
      )
      .join("");

    await resend.emails.send({
      from: "GodGiftShop <onboarding@resend.dev>",
      to: notifyTo,
      subject: `New order #${order.orderId} — ${formatPrice(order.totalAmount)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color:#7c3aed;">New order received</h2>
          <p><strong>Order #${order.orderId}</strong></p>
          <table style="width:100%; border-collapse:collapse; margin: 16px 0;">
            <thead>
              <tr>
                <th style="text-align:left; border-bottom:2px solid #7c3aed; padding-bottom:6px;">Product</th>
                <th style="text-align:center; border-bottom:2px solid #7c3aed; padding-bottom:6px;">Qty</th>
                <th style="text-align:right; border-bottom:2px solid #7c3aed; padding-bottom:6px;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p style="font-size:18px;"><strong>Total: ${formatPrice(order.totalAmount)}</strong></p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
          <p><strong>Customer:</strong> ${order.guestName}</p>
          <p><strong>Phone:</strong> ${order.guestPhone}</p>
          ${order.guestEmail ? `<p><strong>Email:</strong> ${order.guestEmail}</p>` : ""}
          <p><strong>Delivery address:</strong> ${order.deliveryAddress}</p>
          <p><strong>Payment:</strong> Cash on Delivery</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send order notification email:", err);
  }
}
