"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  CreditCard,
  LogOut,
  Minus,
  Plus,
  QrCode,
  ScanBarcode,
  Search,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  brand: string | null;
  barcode: string | null;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
};

type CartItem = Product & {
  quantity: number;
};

const posBanners = [
  "/banners/banner-1.png",
  "/banners/banner-2.png",
  "/banners/banner-3.png",
  "/banners/banner-4.png",
];
export default function PosPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  const [currentBanner, setCurrentBanner] =
  useState(0);

  useEffect(() => {
    async function initializePos() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const {
        data: hasAccess,
        error: accessError,
      } = await supabase.rpc("is_pos_admin");

      if (accessError || !hasAccess) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, brand, barcode, description, price, stock, image"
        )
        .eq("active", true)
        .order("name");

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      setProducts(
        (data ?? []).map((product) => ({
          ...product,
          price: Number(product.price),
          stock: Number(product.stock),
        }))
      );

      setLoading(false);
    }

    initializePos();
  }, [router]);

  useEffect(() => {
  const timer = window.setInterval(() => {
    setCurrentBanner(
      (current) =>
        (current + 1) % posBanners.length
    );
  }, 5000);

  return () => {
    window.clearInterval(timer);
  };
}, []);

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return [];

    return products
      .filter((product) => {
        return (
          product.name
            .toLowerCase()
            .includes(searchText) ||
          (product.brand ?? "")
            .toLowerCase()
            .includes(searchText) ||
          (product.barcode ?? "")
            .toLowerCase()
            .includes(searchText)
        );
      })
      .slice(0, 8);
  }, [products, search]);

  const totalQuantity = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  }, [cart]);

  function addToCart(product: Product) {
    if (product.stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    const existingItem = cart.find(
      (item) => item.id === product.id
    );

    if (
      existingItem &&
      existingItem.quantity >= product.stock
    ) {
      alert(
        `Only ${product.stock} item(s) are available.`
      );
      return;
    }

    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function handleSearchSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const searchText = search.trim();

    if (!searchText) return;

    const barcodeProduct = products.find(
      (product) =>
        product.barcode?.trim() === searchText
    );

    if (barcodeProduct) {
      addToCart(barcodeProduct);
      setSearch("");
      return;
    }

    if (filteredProducts.length === 1) {
      addToCart(filteredProducts[0]);
      setSearch("");
      return;
    }

    alert("Product barcode was not found.");
  }

  function updateQuantity(
    productId: number,
    change: number
  ) {
    setCart((current) =>
      current
        .map((item) => {
          if (item.id !== productId) {
            return item;
          }

          const nextQuantity =
            item.quantity + change;

          if (nextQuantity > item.stock) {
            alert(
              `Only ${item.stock} item(s) are available.`
            );

            return item;
          }

          return {
            ...item,
            quantity: nextQuantity,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId: number) {
    setCart((current) =>
      current.filter(
        (item) => item.id !== productId
      )
    );
  }

  async function handleLogout() {
    const confirmed = window.confirm(
      "Do you want to sign out of the POS?"
    );

    if (!confirmed) return;

    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  function handlePayment(
    method: "Cash" | "KHQR" | "Card"
  ) {
    if (cart.length === 0) return;

    alert(
      `${method} payment will be connected next.`
    );
  }

  if (loading) {
    return (
      <main className="flex h-screen items-center justify-center bg-premium">
        <div className="text-center">
          <ScanBarcode className="mx-auto h-10 w-10 animate-pulse text-gold" />

          <p className="mt-3 text-gray-500">
            Loading POS…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-premium">
  <div className="flex h-full w-full flex-col overflow-hidden bg-white/20">
        {/* Banner */}
        {/* Large animated banner */}
<section className="relative h-[250px] shrink-0 overflow-hidden">
  {posBanners.map((banner, index) => (
    <img
      key={banner}
      src={banner}
      alt={`Baby Premium banner ${index + 1}`}
      className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
        index === currentBanner
          ? "scale-100 opacity-100"
          : "scale-[1.03] opacity-0"
      }`}
    />
  ))}

  <div className="absolute inset-0 bg-gradient-to-r from-[#17243b]/90 via-[#17243b]/55 to-transparent" />

  <div className="relative z-10 flex h-full items-center justify-between gap-6 px-10">
    <div className="flex items-center gap-6">
      <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-[28px] border border-white/70 bg-white/90 p-3 shadow-xl">
        <img
          src="/logo/baby-premium.png"
          alt="Baby Premium logo"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="text-white">
        <p className="font-khmer text-lg leading-8 text-white/80">
          {cart.length === 0
            ? "សូមស្វាគមន៍"
            : "សូមអរគុណ"}
        </p>

        <h1 className="text-4xl font-bold">
          {cart.length === 0
            ? "Welcome"
            : "Thank You"}
        </h1>

        <p className="mt-2 text-base text-white/75">
          Baby Premium & Essential
        </p>
      </div>
    </div>

    <button
      type="button"
      onClick={handleLogout}
      aria-label="Sign out"
      title="Sign out"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white/80 backdrop-blur-xl transition hover:bg-red-500/70 active:scale-95"
    >
      <LogOut className="h-5 w-5" />
    </button>
  </div>

  <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-black/15 px-3 py-2 backdrop-blur-xl">
    {posBanners.map((banner, index) => (
      <button
        key={banner}
        type="button"
        onClick={() => setCurrentBanner(index)}
        aria-label={`View banner ${index + 1}`}
        className={`h-2 rounded-full transition-all ${
          index === currentBanner
            ? "w-7 bg-white"
            : "w-2 bg-white/50"
        }`}
      />
    ))}
  </div>
</section>

        {/* Barcode and search */}
        <div className="relative z-30 shrink-0 border-b border-white/70 bg-white/40 p-3">
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto flex max-w-5xl items-center rounded-[20px] border border-white/80 bg-white/65 px-5 shadow-sm backdrop-blur-xl"
          >
            <Search className="h-5 w-5 shrink-0 text-gold" />

            <input
              autoFocus
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Scan barcode or search product…"
              className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-base outline-none"
            />

            <ScanBarcode className="h-6 w-6 shrink-0 text-gray-400" />
          </form>

          {search.trim() &&
            filteredProducts.length > 0 && (
              <div className="absolute left-1/2 top-[68px] z-50 max-h-[320px] w-[min(900px,90%)] -translate-x-1/2 overflow-y-auto rounded-[22px] border border-white/80 bg-[#fffaf0]/95 p-2 shadow-2xl backdrop-blur-2xl">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      addToCart(product);
                      setSearch("");
                    }}
                    className="flex w-full items-center gap-4 rounded-[16px] p-3 text-left transition hover:bg-white/80"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <ScanBarcode className="h-5 w-5 text-gray-300" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {product.barcode ||
                          `P-${product.id}`}
                      </p>
                    </div>

                    <p className="font-bold text-gold">
                      ${product.price.toFixed(2)}
                    </p>

                    <p className="w-20 text-right text-xs text-emerald-600">
                      {product.stock} left
                    </p>
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Scanned products */}
        <section className="flex min-h-0 flex-1 flex-col bg-white/30">
          <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead className="sticky top-0 z-20">
                <tr className="bg-[#17243b] text-left text-xs uppercase tracking-[0.08em] text-white">
                  <th className="w-[170px] px-5 py-3">
                    Barcode
                  </th>

                  <th className="px-5 py-3">
                    Description
                  </th>

                  <th className="w-[300px] px-5 py-3">
                    Product Details
                  </th>

                  <th className="w-[160px] px-5 py-3 text-center">
                    Quantity
                  </th>

                  <th className="w-[120px] px-5 py-3 text-right">
                    Price
                  </th>

                  <th className="w-[140px] px-5 py-3 text-right">
                    Amount
                  </th>

                  <th className="w-[60px] px-3 py-3" />
                </tr>
              </thead>

              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="h-[300px] px-6 text-center text-gray-400"
                    >
                      <ScanBarcode className="mx-auto h-12 w-12" />

                      <p className="mt-3 text-lg font-semibold">
                        Scan a product to begin
                      </p>

                      <p className="font-khmer mt-1 text-sm leading-7">
                        ស្កេនទំនិញដើម្បីចាប់ផ្តើម
                      </p>
                    </td>
                  </tr>
                ) : (
                  cart.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-white/80 ${
                        index % 2 === 0
                          ? "bg-white/45"
                          : "bg-white/20"
                      }`}
                    >
                      <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-gray-600">
                        {item.barcode ||
                          `P-${item.id}`}
                      </td>

                      <td className="px-5 py-3">
                        <p className="font-semibold text-slate-900">
                          {item.name}
                        </p>

                        {item.brand && (
                          <p className="mt-1 text-xs text-gray-500">
                            {item.brand}
                          </p>
                        )}
                      </td>

                      <td className="max-w-[300px] px-5 py-3">
                        <p className="line-clamp-2 text-xs leading-5 text-gray-500">
                          {item.description || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-3">
                        <div className="mx-auto flex w-fit items-center rounded-full border border-white/80 bg-white/70 shadow-sm">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                -1
                              )
                            }
                            className="p-2"
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="min-w-9 text-center font-bold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                1
                              )
                            }
                            className="p-2"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-3 text-right">
                        ${item.price.toFixed(2)}
                      </td>

                      <td className="px-5 py-3 text-right text-lg font-bold text-gold">
                        $
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}
                      </td>

                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          aria-label="Remove product"
                          className="text-red-400 transition hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Payment and total */}
        <footer className="flex shrink-0 items-center justify-between gap-6 bg-[#17243b] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() =>
                handlePayment("Cash")
              }
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold disabled:opacity-30"
            >
              <Banknote className="h-5 w-5" />
              Cash
            </button>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() =>
                handlePayment("KHQR")
              }
              className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-3 text-sm font-bold disabled:opacity-30"
            >
              <QrCode className="h-5 w-5" />
              KHQR
            </button>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() =>
                handlePayment("Card")
              }
              className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-bold disabled:opacity-30"
            >
              <CreditCard className="h-5 w-5" />
              Card
            </button>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => setCart([])}
                className="ml-2 text-sm font-semibold text-red-300 hover:text-red-200"
              >
                Clear Sale
              </button>
            )}
          </div>

          <div className="flex items-center gap-12">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-white/55">
                Items
              </p>

              <p className="mt-1 text-2xl font-bold">
                {totalQuantity}
              </p>
            </div>

            <div className="min-w-[220px] text-right">
              <p className="text-xs uppercase tracking-[0.14em] text-white/55">
                Total
              </p>

              <p className="mt-1 text-4xl font-bold text-[#e9d4a5]">
                ${subtotal.toFixed(2)}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}