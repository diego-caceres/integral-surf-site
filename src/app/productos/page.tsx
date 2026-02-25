"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { StoreProduct } from "@/types/store";

type CartItem = {
  productId: string;
  quantity: number;
  size: string | null;
  color: string | null;
};

type ProductSelection = {
  size: string;
  color: string;
};

type CheckoutForm = {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  notes: string;
};

type SubmitFeedback = {
  tone: "success" | "warning" | "error";
  message: string;
};

const CART_STORAGE_KEY = "integralsurf-store-cart-v1";

const INITIAL_FORM: CheckoutForm = {
  name: "",
  email: "",
  phone: "",
  instagram: "",
  notes: "",
};

function formatCurrency(amountCents: number, currency: string) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: currency || "USD",
  }).format(amountCents / 100);
}

function normalizeOptions(values: string[] | null | undefined) {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}

function normalizeOptionValue(value: string | null | undefined) {
  const normalized = (value ?? "").trim();
  return normalized.length > 0 ? normalized : null;
}

function hasOption(options: string[], value: string) {
  return options.some((option) => option.toLowerCase() === value.toLowerCase());
}

function isSameVariant(a: CartItem, b: CartItem) {
  return (
    a.productId === b.productId &&
    (a.size ?? "") === (b.size ?? "") &&
    (a.color ?? "") === (b.color ?? "")
  );
}

function mergeCartLines(lines: CartItem[]) {
  const merged: CartItem[] = [];

  for (const line of lines) {
    const existingIndex = merged.findIndex((item) => isSameVariant(item, line));
    if (existingIndex < 0) {
      merged.push({ ...line });
      continue;
    }

    merged[existingIndex] = {
      ...merged[existingIndex],
      quantity: merged[existingIndex].quantity + line.quantity,
    };
  }

  return merged.filter((line) => line.quantity > 0);
}

export default function Productos() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productSelections, setProductSelections] = useState<
    Record<string, ProductSelection>
  >({});
  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<SubmitFeedback | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCart) {
      return;
    }

    try {
      const parsed = JSON.parse(savedCart) as CartItem[];
      if (Array.isArray(parsed)) {
        setCart(
          mergeCartLines(
            parsed
              .map((item) => ({
                productId: (item.productId ?? "").trim(),
                quantity: Number(item.quantity),
                size: normalizeOptionValue(item.size),
                color: normalizeOptionValue(item.color),
              }))
              .filter(
                (item) =>
                  item.productId &&
                  Number.isInteger(item.quantity) &&
                  item.quantity > 0
              )
          )
        );
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/store/products");
        const data = (await response.json()) as StoreProduct[] | { error: string };

        if (!response.ok) {
          throw new Error(
            "error" in data ? data.error : "No se pudo cargar la tienda."
          );
        }

        setProducts(data as StoreProduct[]);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error ? fetchError.message : "Error desconocido."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setProductSelections((previous) => {
      const next = { ...previous };

      for (const product of products) {
        if (!next[product.id]) {
          next[product.id] = { size: "", color: "" };
        }
      }

      return next;
    });
  }, [products]);

  const cartItems = useMemo(() => {
    return cart
      .map((line, index) => {
        const product = products.find((item) => item.id === line.productId);
        if (!product || line.quantity <= 0) {
          return null;
        }

        return {
          line,
          lineIndex: index,
          key: `${line.productId}::${line.size ?? ""}::${line.color ?? ""}`,
          product,
          subtotalCents: product.price_cents * line.quantity,
        };
      })
      .filter(Boolean) as Array<{
      line: CartItem;
      lineIndex: number;
      key: string;
      product: StoreProduct;
      subtotalCents: number;
    }>;
  }, [cart, products]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.line.quantity, 0),
    [cartItems]
  );

  const totalCents = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.subtotalCents, 0),
    [cartItems]
  );

  const currency = cartItems[0]?.product.currency || products[0]?.currency || "USD";

  const updateProductSelection = (
    productId: string,
    key: keyof ProductSelection,
    value: string
  ) => {
    setProductSelections((previous) => ({
      ...previous,
      [productId]: {
        ...(previous[productId] ?? { size: "", color: "" }),
        [key]: value,
      },
    }));
  };

  const addToCart = (product: StoreProduct) => {
    setFeedback(null);

    const sizeOptions = normalizeOptions(product.available_sizes);
    const colorOptions = normalizeOptions(product.available_colors);
    const selected = productSelections[product.id] ?? { size: "", color: "" };
    const size = normalizeOptionValue(selected.size);
    const color = normalizeOptionValue(selected.color);

    if (sizeOptions.length > 0 && !size) {
      setFeedback({
        tone: "error",
        message: `Seleccioná un talle para ${product.name}.`,
      });
      return;
    }

    if (size && !hasOption(sizeOptions, size)) {
      setFeedback({
        tone: "error",
        message: `El talle seleccionado no es válido para ${product.name}.`,
      });
      return;
    }

    if (color && colorOptions.length === 0) {
      setFeedback({
        tone: "error",
        message: `${product.name} no tiene colores configurados.`,
      });
      return;
    }

    if (color && !hasOption(colorOptions, color)) {
      setFeedback({
        tone: "error",
        message: `El color seleccionado no es válido para ${product.name}.`,
      });
      return;
    }

    const variant: CartItem = {
      productId: product.id,
      quantity: 1,
      size,
      color,
    };

    setCart((previous) => {
      const index = previous.findIndex((item) => isSameVariant(item, variant));
      if (index < 0) {
        return [...previous, variant];
      }

      return previous.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  };

  const changeQuantity = (lineIndex: number, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      setCart((previous) => previous.filter((_, index) => index !== lineIndex));
      return;
    }

    setCart((previous) =>
      previous.map((line, index) =>
        index === lineIndex ? { ...line, quantity: nextQuantity } : line
      )
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (cartItems.length === 0) {
      setFeedback({
        tone: "error",
        message: "Agregá productos al carrito antes de enviar.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/store/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            instagram: form.instagram,
          },
          notes: form.notes,
          items: cartItems.map((item) => ({
            productId: item.line.productId,
            quantity: item.line.quantity,
            size: item.line.size,
            color: item.line.color,
          })),
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        orderNumber?: string;
        emailSent?: boolean;
        emailReason?: string | null;
      };

      if (!response.ok) {
        throw new Error(data.error || "No se pudo crear el pedido.");
      }

      setCart([]);
      setForm(INITIAL_FORM);

      if (data.emailSent) {
        setFeedback({
          tone: "success",
          message: `Pedido ${data.orderNumber} enviado. El equipo te va a contactar pronto.`,
        });
      } else {
        setFeedback({
          tone: "warning",
          message: `Pedido ${data.orderNumber} guardado, pero el email falló. Te contactaremos igualmente.`,
        });
      }
    } catch (submitError) {
      setFeedback({
        tone: "error",
        message:
          submitError instanceof Error
            ? submitError.message
            : "No se pudo enviar el pedido.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-5 py-10 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-[Eckmannpsych] text-primary">
          Tienda Integral Surf
        </h1>
        <p className="mt-3 text-lg text-textPrimary max-w-2xl">
          Remeras, gorros y accesorios para apoyar los próximos viajes. Armá tu
          carrito y enviá el pedido. Te contactamos por mail o WhatsApp.
        </p>

        {feedback && (
          <div
            className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
              feedback.tone === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : feedback.tone === "warning"
                  ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                  : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div>
            {isLoading && (
              <div className="rounded-xl border border-dashed border-primary/30 p-8 text-center">
                Cargando productos...
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                {error}
              </div>
            )}

            {!isLoading && !error && products.length === 0 && (
              <div className="rounded-xl border border-dashed border-primary/30 p-8 text-center">
                Todavía no hay productos cargados.
              </div>
            )}

            {!isLoading && !error && products.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {products.map((product) => {
                  const sizeOptions = normalizeOptions(product.available_sizes);
                  const colorOptions = normalizeOptions(product.available_colors);
                  const selection = productSelections[product.id] ?? {
                    size: "",
                    color: "",
                  };

                  return (
                    <article
                      key={product.id}
                      className="rounded-xl border border-primary/15 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-4 h-44 rounded-lg bg-[#f7f2ea] overflow-hidden">
                        {product.image_url ? (
                          <div
                            className="h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${product.image_url})` }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-sm text-primary/60">
                            Sin imagen
                          </div>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-primary">{product.name}</h2>
                      {product.description && (
                        <p className="mt-2 text-sm text-textPrimary">{product.description}</p>
                      )}

                      {sizeOptions.length > 0 && (
                        <div className="mt-3">
                          <label className="mb-1 block text-xs font-semibold uppercase text-primary/80">
                            Talle
                          </label>
                          <select
                            value={selection.size}
                            onChange={(event) =>
                              updateProductSelection(
                                product.id,
                                "size",
                                event.target.value
                              )
                            }
                            className="w-full rounded-md border border-primary/20 px-3 py-2 text-sm"
                          >
                            <option value="">Elegí talle</option>
                            {sizeOptions.map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {colorOptions.length > 0 && (
                        <div className="mt-3">
                          <label className="mb-1 block text-xs font-semibold uppercase text-primary/80">
                            Color (opcional)
                          </label>
                          <select
                            value={selection.color}
                            onChange={(event) =>
                              updateProductSelection(
                                product.id,
                                "color",
                                event.target.value
                              )
                            }
                            className="w-full rounded-md border border-primary/20 px-3 py-2 text-sm"
                          >
                            <option value="">Sin preferencia</option>
                            {colorOptions.map((color) => (
                              <option key={color} value={color}>
                                {color}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <p className="mt-3 text-lg font-bold text-primary">
                        {formatCurrency(product.price_cents, product.currency)}
                      </p>
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        Agregar al carrito
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="rounded-xl border border-primary/20 bg-white p-5 shadow-sm h-fit sticky top-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary">Carrito</h2>
              <span className="text-sm text-textPrimary">{cartCount} items</span>
            </div>

            {cartItems.length === 0 ? (
              <p className="mt-4 text-sm text-textPrimary">
                Todavía no agregaste productos.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {cartItems.map((item) => (
                  <li key={item.key} className="rounded-lg border border-primary/10 p-3">
                    <p className="font-medium text-primary">{item.product.name}</p>
                    {(item.line.size || item.line.color) && (
                      <p className="text-xs text-textPrimary mt-0.5">
                        {item.line.size ? `Talle: ${item.line.size}` : ""}
                        {item.line.size && item.line.color ? " | " : ""}
                        {item.line.color ? `Color: ${item.line.color}` : ""}
                      </p>
                    )}
                    <p className="text-sm text-textPrimary">
                      {formatCurrency(item.product.price_cents, item.product.currency)} c/u
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(item.lineIndex, item.line.quantity - 1)
                          }
                          className="h-7 w-7 rounded border border-primary/30 text-primary"
                        >
                          -
                        </button>
                        <span className="min-w-6 text-center">{item.line.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(item.lineIndex, item.line.quantity + 1)
                          }
                          className="h-7 w-7 rounded border border-primary/30 text-primary"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-primary">
                        {formatCurrency(item.subtotalCents, item.product.currency)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 border-t border-primary/15 pt-4">
              <p className="flex items-center justify-between font-semibold text-primary">
                <span>Total</span>
                <span>{formatCurrency(totalCents, currency)}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <input
                required
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, name: event.target.value }))
                }
                placeholder="Nombre completo"
                className="w-full rounded-md border border-primary/20 px-3 py-2 text-sm"
              />
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, email: event.target.value }))
                }
                placeholder="Email"
                className="w-full rounded-md border border-primary/20 px-3 py-2 text-sm"
              />
              <input
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, phone: event.target.value }))
                }
                placeholder="WhatsApp / Teléfono"
                className="w-full rounded-md border border-primary/20 px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={form.instagram}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    instagram: event.target.value,
                  }))
                }
                placeholder="Instagram (opcional)"
                className="w-full rounded-md border border-primary/20 px-3 py-2 text-sm"
              />
              <textarea
                value={form.notes}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, notes: event.target.value }))
                }
                placeholder="Notas del pedido (talle, color, etc.)"
                rows={3}
                className="w-full rounded-md border border-primary/20 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isSubmitting ? "Enviando..." : "Enviar pedido"}
              </button>
            </form>
          </aside>
        </div>
      </div>
    </section>
  );
}
