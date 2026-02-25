import { StoreOrderCustomer } from "@/types/store";

type StoreOrderEmailLine = {
  name: string;
  quantity: number;
  unitPriceCents: number;
  subtotalCents: number;
  size?: string | null;
  color?: string | null;
};

type SendStoreOrderEmailInput = {
  orderNumber: string;
  currency: string;
  totalCents: number;
  customer: StoreOrderCustomer;
  notes?: string | null;
  items: StoreOrderEmailLine[];
};

type StoreEmailResult = {
  sent: boolean;
  reason?: string;
  providerId?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatCurrency(amountCents: number, currency: string) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: currency || "USD",
  }).format(amountCents / 100);
}

export async function sendStoreOrderEmail(
  input: SendStoreOrderEmailInput
): Promise<StoreEmailResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.STORE_FROM_EMAIL;
  const adminEmails = (process.env.STORE_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (!resendApiKey) {
    return { sent: false, reason: "RESEND_API_KEY is missing" };
  }

  if (!fromEmail) {
    return { sent: false, reason: "STORE_FROM_EMAIL is missing" };
  }

  if (adminEmails.length === 0) {
    return { sent: false, reason: "STORE_ADMIN_EMAILS is missing" };
  }

  const linesHtml = input.items
    .map(
      (item) => {
        const variant = [
          item.size ? `Talle: ${escapeHtml(item.size)}` : "",
          item.color ? `Color: ${escapeHtml(item.color)}` : "",
        ]
          .filter(Boolean)
          .join(" | ");

        return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(item.name)}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${variant || "-"}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(item.unitPriceCents, input.currency)}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(item.subtotalCents, input.currency)}</td>
        </tr>
      `;
      }
    )
    .join("");

  const notesBlock = input.notes
    ? `<p><strong>Notas:</strong> ${escapeHtml(input.notes)}</p>`
    : "";

  const html = `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2>Nuevo pedido de tienda (${escapeHtml(input.orderNumber)})</h2>
      <p><strong>Cliente:</strong> ${escapeHtml(input.customer.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.customer.email)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(input.customer.phone ?? "-")}</p>
      <p><strong>Instagram:</strong> ${escapeHtml(input.customer.instagram ?? "-")}</p>
      ${notesBlock}
      <h3>Productos</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Producto</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Variante</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Precio unitario</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${linesHtml}</tbody>
      </table>
      <p style="margin-top: 16px;"><strong>Total:</strong> ${formatCurrency(input.totalCents, input.currency)}</p>
    </div>
  `;

  const textLines = input.items
    .map(
      (item) => {
        const variant = [item.size ? `Talle: ${item.size}` : "", item.color ? `Color: ${item.color}` : ""]
          .filter(Boolean)
          .join(" | ");

        return `- ${item.name}${variant ? ` [${variant}]` : ""} x${item.quantity} (${formatCurrency(item.subtotalCents, input.currency)})`;
      }
    )
    .join("\n");

  const text = [
    `Nuevo pedido de tienda: ${input.orderNumber}`,
    `Cliente: ${input.customer.name}`,
    `Email: ${input.customer.email}`,
    `Telefono: ${input.customer.phone ?? "-"}`,
    `Instagram: ${input.customer.instagram ?? "-"}`,
    input.notes ? `Notas: ${input.notes}` : "",
    "Productos:",
    textLines,
    `Total: ${formatCurrency(input.totalCents, input.currency)}`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: adminEmails,
      subject: `Nuevo pedido de tienda: ${input.orderNumber}`,
      html,
      text,
      reply_to: input.customer.email,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    return {
      sent: false,
      reason: `Resend API error ${response.status}: ${responseText}`,
    };
  }

  const body = (await response.json()) as { id?: string };
  return { sent: true, providerId: body.id };
}
