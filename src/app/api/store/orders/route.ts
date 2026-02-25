import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { sendStoreOrderEmail } from "@/lib/storeEmail";
import { CartLineItemInput, StoreOrderCustomer } from "@/types/store";

type OrderRequestBody = {
  customer?: StoreOrderCustomer;
  items?: CartLineItemInput[];
  notes?: string;
};

type NormalizedCartLine = {
  productId: string;
  quantity: number;
  size: string | null;
  color: string | null;
};

type StoreProductRow = {
  id: string;
  name: string;
  price_cents: number;
  currency: string;
  is_active: boolean;
  available_sizes: string[] | null;
  available_colors: string[] | null;
};

const MAX_ITEM_QUANTITY = 20;

function createOrderNumber() {
  const now = new Date();
  const yyyymmdd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const suffix = String(Math.floor(Math.random() * 9000) + 1000);
  return `IS-${yyyymmdd}-${suffix}`;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeOptionValue(value?: string | null) {
  const normalized = value?.trim() ?? "";
  return normalized.length > 0 ? normalized : null;
}

function normalizeCustomer(customer?: StoreOrderCustomer) {
  const name = customer?.name?.trim() ?? "";
  const email = customer?.email?.trim().toLowerCase() ?? "";
  const phone = customer?.phone?.trim() ?? "";
  const instagram = customer?.instagram?.trim() ?? "";

  if (name.length < 2) {
    return { error: "Customer name is required." };
  }

  if (!isValidEmail(email)) {
    return { error: "A valid customer email is required." };
  }

  return {
    value: {
      name,
      email,
      phone: phone || null,
      instagram: instagram || null,
    },
  };
}

function normalizeItems(items?: CartLineItemInput[]) {
  if (!items || items.length === 0) {
    return { error: "Cart is empty." };
  }

  const lines = new Map<string, NormalizedCartLine>();

  for (const item of items) {
    const productId = item.productId?.trim();
    const quantity = Number(item.quantity);
    const size = normalizeOptionValue(item.size);
    const color = normalizeOptionValue(item.color);

    if (!productId) {
      return { error: "Invalid product in cart." };
    }

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      quantity > MAX_ITEM_QUANTITY
    ) {
      return { error: `Invalid quantity for product ${productId}.` };
    }

    const key = `${productId}::${size ?? ""}::${color ?? ""}`;
    const existing = lines.get(key);
    const nextQuantity = (existing?.quantity ?? 0) + quantity;

    if (nextQuantity > MAX_ITEM_QUANTITY) {
      return {
        error: `Max quantity exceeded for ${productId} (${size ?? "sin talle"} / ${color ?? "sin color"}).`,
      };
    }

    lines.set(key, {
      productId,
      quantity: nextQuantity,
      size,
      color,
    });
  }

  return { value: Array.from(lines.values()) };
}

function hasOption(options: string[], value: string) {
  return options.some((option) => option.toLowerCase() === value.toLowerCase());
}

function normalizeOptionList(list: string[] | null | undefined) {
  return (list ?? []).map((value) => value.trim()).filter(Boolean);
}

function validateVariant(
  line: NormalizedCartLine,
  product: StoreProductRow
): string | null {
  const allowedSizes = normalizeOptionList(product.available_sizes);
  const allowedColors = normalizeOptionList(product.available_colors);

  if (allowedSizes.length > 0 && !line.size) {
    return `Size is required for ${product.name}.`;
  }

  if (allowedSizes.length === 0 && line.size) {
    return `${product.name} does not support size selection.`;
  }

  if (line.size && !hasOption(allowedSizes, line.size)) {
    return `Invalid size '${line.size}' for ${product.name}.`;
  }

  if (allowedColors.length === 0 && line.color) {
    return `${product.name} does not support color selection.`;
  }

  if (line.color && !hasOption(allowedColors, line.color)) {
    return `Invalid color '${line.color}' for ${product.name}.`;
  }

  return null;
}

export async function POST(request: NextRequest) {
  let body: OrderRequestBody;

  try {
    body = (await request.json()) as OrderRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const normalizedCustomer = normalizeCustomer(body.customer);
  if ("error" in normalizedCustomer) {
    return NextResponse.json({ error: normalizedCustomer.error }, { status: 400 });
  }

  const normalizedItems = normalizeItems(body.items);
  if ("error" in normalizedItems) {
    return NextResponse.json({ error: normalizedItems.error }, { status: 400 });
  }

  const itemLines = normalizedItems.value;
  const productIds = Array.from(new Set(itemLines.map((line) => line.productId)));

  const { data: products, error: productsError } = await supabaseServer
    .from("store_products")
    .select(
      "id, name, price_cents, currency, is_active, available_sizes, available_colors"
    )
    .in("id", productIds);

  if (productsError) {
    return NextResponse.json({ error: productsError.message }, { status: 500 });
  }

  const activeProducts = new Map<string, StoreProductRow>();
  for (const product of (products ?? []) as StoreProductRow[]) {
    if (product.is_active) {
      activeProducts.set(product.id, product);
    }
  }

  const missingProducts = productIds.filter((id) => !activeProducts.has(id));
  if (missingProducts.length > 0) {
    return NextResponse.json(
      { error: "Some products are unavailable.", details: missingProducts },
      { status: 400 }
    );
  }

  const currencies = new Set(
    Array.from(activeProducts.values()).map((product) => product.currency)
  );

  if (currencies.size !== 1) {
    return NextResponse.json(
      { error: "Store products must share one currency." },
      { status: 400 }
    );
  }

  const pricedLines: Array<{
    productId: string;
    name: string;
    unitPriceCents: number;
    quantity: number;
    subtotalCents: number;
    size: string | null;
    color: string | null;
  }> = [];

  for (const line of itemLines) {
    const product = activeProducts.get(line.productId)!;
    const variantError = validateVariant(line, product);

    if (variantError) {
      return NextResponse.json({ error: variantError }, { status: 400 });
    }

    pricedLines.push({
      productId: product.id,
      name: product.name,
      unitPriceCents: product.price_cents,
      quantity: line.quantity,
      subtotalCents: product.price_cents * line.quantity,
      size: line.size,
      color: line.color,
    });
  }

  const totalCents = pricedLines.reduce(
    (sum, line) => sum + line.subtotalCents,
    0
  );
  const currency = Array.from(currencies)[0];
  const orderNumber = createOrderNumber();
  const notes = body.notes?.trim() || null;

  const { data: createdOrder, error: createOrderError } = await supabaseServer
    .from("store_orders")
    .insert([
      {
        order_number: orderNumber,
        customer_name: normalizedCustomer.value.name,
        customer_email: normalizedCustomer.value.email,
        customer_phone: normalizedCustomer.value.phone,
        customer_instagram: normalizedCustomer.value.instagram,
        notes,
        status: "new",
        currency,
        subtotal_cents: totalCents,
      },
    ])
    .select("id, order_number, created_at")
    .single();

  if (createOrderError) {
    return NextResponse.json(
      { error: createOrderError.message },
      { status: 500 }
    );
  }

  const { error: insertItemsError } = await supabaseServer
    .from("store_order_items")
    .insert(
      pricedLines.map((line) => ({
        order_id: createdOrder.id,
        product_id: line.productId,
        product_name_snapshot: line.name,
        unit_price_cents: line.unitPriceCents,
        quantity: line.quantity,
        selected_size: line.size,
        selected_color: line.color,
        subtotal_cents: line.subtotalCents,
      }))
    );

  if (insertItemsError) {
    await supabaseServer.from("store_orders").delete().eq("id", createdOrder.id);
    return NextResponse.json(
      { error: insertItemsError.message },
      { status: 500 }
    );
  }

  const emailResult = await sendStoreOrderEmail({
    orderNumber: createdOrder.order_number,
    currency,
    totalCents,
    customer: {
      name: normalizedCustomer.value.name,
      email: normalizedCustomer.value.email,
      phone: normalizedCustomer.value.phone ?? undefined,
      instagram: normalizedCustomer.value.instagram ?? undefined,
    },
    notes,
    items: pricedLines,
  });

  return NextResponse.json(
    {
      success: true,
      orderId: createdOrder.id,
      orderNumber: createdOrder.order_number,
      emailSent: emailResult.sent,
      emailReason: emailResult.reason ?? null,
    },
    { status: 201 }
  );
}
