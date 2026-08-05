"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  Settings,
  Trash2,
  Upload,
  X,
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
  discount: number;
};

type ScannedProduct = Product & {
  scanId: string;
};

type PosBackground = {
  url: string;
  size: number;
  x: number;
  y: number;
};

const banners = [
  "/banners/banner-1.png",
  "/banners/banner-2.png",
  "/banners/banner-3.png",
  "/banners/banner-4.png",
];

const defaultBackground: PosBackground = {
  url: "",
  size: 100,
  x: 50,
  y: 50,
};

export default function PosPage() {
  const router = useRouter();
  const scanSequence = useRef(0);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);

  const [search, setSearch] = useState("");
  const [currentBanner, setCurrentBanner] = useState(0);

  const [showBackgroundSettings, setShowBackgroundSettings] = useState(false);

  const [uploadingBackground, setUploadingBackground] = useState(false);

  const [posBackground, setPosBackground] =
    useState<PosBackground>(defaultBackground);

  useEffect(() => {
    let active = true;

    async function initializePos() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data: hasAccess, error: accessError } =
        await supabase.rpc("is_pos_admin");

      if (accessError || !hasAccess) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("id, name, brand, barcode, description, price, stock, image")
        .eq("active", true)
        .order("name");

      if (!active) return;

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const normalizedProducts: Product[] = (data ?? []).map((product) => ({
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
      }));

      setProducts(normalizedProducts);
      setLoading(false);
    }

    initializePos();

    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentBanner((current) => (current + 1) % banners.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedSettings = localStorage.getItem("baby-premium-pos-background");

    if (!savedSettings) return;

    try {
      const parsedSettings = JSON.parse(savedSettings) as PosBackground;

      setPosBackground({
        ...defaultBackground,
        ...parsedSettings,
      });
    } catch {
      localStorage.removeItem("baby-premium-pos-background");
    }
  }, []);

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return [];

    return products
      .filter((product) => {
        const name = product.name.toLowerCase();
        const brand = product.brand?.toLowerCase() ?? "";
        const barcode = product.barcode?.toLowerCase() ?? "";

        return (
          name.includes(searchText) ||
          brand.includes(searchText) ||
          barcode.includes(searchText)
        );
      })
      .slice(0, 10);
  }, [products, search]);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity * (1 - (item.discount ?? 0) / 100),
    0,
  );
  function recordScannedProduct(product: Product) {
    setScannedProducts((current) => {
      const alreadyDisplayed = current.some((item) => item.id === product.id);

      if (alreadyDisplayed) {
        return current;
      }

      scanSequence.current += 1;

      const scannedProduct: ScannedProduct = {
        ...product,
        scanId: `${Date.now()}-${scanSequence.current}`,
      };

      return [scannedProduct, ...current].slice(0, 10);
    });
  }

  function addToCart(product: Product) {
    if (product.stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem && existingItem.quantity >= product.stock) {
      alert(`Only ${product.stock} item(s) are available.`);
      return;
    }

    setCart((current) => {
      const currentItem = current.find((item) => item.id === product.id);

      if (currentItem) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
          discount: 0,
        },
      ];
    });

    recordScannedProduct(product);
  }

  function increaseQuantity(item: CartItem) {
    if (item.quantity >= item.stock) {
      alert(`Only ${item.stock} item(s) are available.`);
      return;
    }

    setCart((current) =>
      current.map((cartItem) =>
        cartItem.id === item.id
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            }
          : cartItem,
      ),
    );
  }

  function updateDiscount(productId: number, value: number) {
    const discount = Math.min(100, Math.max(0, value || 0));

    setCart((current) =>
      current.map((item) =>
        item.id === productId
          ? {
              ...item,
              discount,
            }
          : item,
      ),
    );
  }

  function decreaseQuantity(item: CartItem) {
    if (item.quantity <= 1) {
      removeFromCart(item.id);
      return;
    }

    setCart((current) =>
      current.map((cartItem) =>
        cartItem.id === item.id
          ? {
              ...cartItem,
              quantity: cartItem.quantity - 1,
            }
          : cartItem,
      ),
    );
  }

  function removeFromCart(productId: number) {
    setCart((current) => current.filter((item) => item.id !== productId));

    setScannedProducts((current) =>
      current.filter((item) => item.id !== productId),
    );
  }

  function clearSale() {
    setCart([]);
    setScannedProducts([]);
    setSearch("");
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const searchText = search.trim().toLowerCase();

    if (!searchText) return;

    const exactBarcodeProduct = products.find(
      (product) => product.barcode?.trim().toLowerCase() === searchText,
    );

    if (exactBarcodeProduct) {
      addToCart(exactBarcodeProduct);
      setSearch("");
      return;
    }

    const exactNameProduct = products.find(
      (product) => product.name.trim().toLowerCase() === searchText,
    );

    if (exactNameProduct) {
      addToCart(exactNameProduct);
      setSearch("");
      return;
    }

    if (filteredProducts.length === 1) {
      addToCart(filteredProducts[0]);
      setSearch("");
      return;
    }

    if (filteredProducts.length === 0) {
      alert("Product not found.");
    }
  }

  function updateBackground(changes: Partial<PosBackground>) {
    setPosBackground((current) => {
      const updated = {
        ...current,
        ...changes,
      };

      localStorage.setItem(
        "baby-premium-pos-background",
        JSON.stringify(updated),
      );

      return updated;
    });
  }

  async function handleBackgroundUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Please use an image smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    setUploadingBackground(true);

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Could not read the image."));
          }
        };

        reader.onerror = () => {
          reject(reader.error ?? new Error("Could not read the image."));
        };

        reader.readAsDataURL(file);
      });

      updateBackground({
        url: dataUrl,
        size: 100,
        x: 50,
        y: 50,
      });
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Could not save the background.",
      );
    } finally {
      setUploadingBackground(false);
      event.target.value = "";
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-premium">
        <p className="text-gray-500">Loading POS…</p>
      </main>
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-premium">
      <div className="flex h-full w-full flex-col overflow-hidden bg-white/20">
        {/* Banner */}

        <section className="relative h-[250px] shrink-0 overflow-hidden bg-slate-900">
          {banners.map((banner, index) => (
            <img
              key={banner}
              src={banner}
              alt={`POS banner ${index + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                index === currentBanner ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          <div className="absolute inset-0 bg-slate-950/45" />

          <div className="absolute inset-0 flex items-center px-10">
            <div className="flex items-center gap-6">
              <div className="flex h-[130px] w-[130px] shrink-0 items-center justify-center overflow-hidden rounded-[26px] border border-white/70 bg-white/90 p-3 shadow-xl">
                <img
                  src="/logo/baby-premium.png"
                  alt="Baby Premium"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="text-white">
                <p className="font-khmer text-xl leading-8 text-white/80">
                  សូមស្វាគមន៍
                </p>

                <h1 className="mt-1 text-4xl font-bold">Welcome</h1>

                <p className="mt-3 text-lg text-white/80">
                  Baby Premium & Essential
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className="absolute bottom-5 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-xl transition hover:bg-red-500/70"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </section>
        <div className="relative z-40 h-[12px] shrink-0 border-y border-white/60 bg-white/15 shadow-[0_5px_16px_rgba(23,36,59,0.08),inset_0_1px_1px_rgba(255,255,255,0.90)] backdrop-blur-[24px] backdrop-saturate-[180%]" />

        {/* Scanned images and barcode search */}

        <section
          className="relative z-30 flex h-[155px] shrink-0 border-b border-white/70 bg-white/10 bg-no-repeat"
          style={
            posBackground.url
              ? {
                  backgroundImage: `linear-gradient(rgba(255,250,240,0.12), rgba(255,250,240,0.12)), url("${posBackground.url}")`,
                  backgroundSize: `auto ${posBackground.size}%`,
                  backgroundPosition: `${posBackground.x}% ${posBackground.y}%`,
                }
              : undefined
          }
        >
          {/* Scanned images */}

          <div className="relative z-50 min-w-0 flex-1 overflow-hidden">
            {scannedProducts.length > 0 && (
              <div className="flex h-full items-center gap-3 overflow-x-auto px-5 py-3">
                {scannedProducts.map((product) => (
                  <div
                    key={product.scanId}
                    title={product.name}
                    className="scanned-product-enter relative flex h-[130px] w-[130px] shrink-0 items-center justify-center overflow-hidden rounded-[26px] border border-white/80 bg-white/55 p-2 shadow-[0_12px_30px_rgba(23,36,59,0.18),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-[24px]"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="relative z-10 h-full w-full object-contain p-2 drop-shadow-[0_7px_10px_rgba(23,36,59,0.18)]"
                      />
                    ) : (
                      <ScanBarcode className="relative z-10 h-10 w-10 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Barcode search */}

          <div className="relative z-40 flex w-[430px] shrink-0 items-start border-l border-white/40 bg-transparent px-5 pt-3">
            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full items-center rounded-[20px] border border-white/60 bg-white/15 px-4 shadow-sm backdrop-blur-md"
            >
              <Search className="h-5 w-5 shrink-0 text-gold" />

              <input
                autoFocus
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Barcode or product name…"
                className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-slate-500"
              />

              <ScanBarcode className="h-6 w-6 shrink-0 text-gray-500" />
            </form>

            {search.trim() && filteredProducts.length > 0 && (
              <div className="absolute right-4 top-[70px] z-[100] max-h-[320px] w-[420px] overflow-y-auto rounded-[22px] border border-white/80 bg-[#fffaf0]/95 p-2 shadow-2xl backdrop-blur-2xl">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      addToCart(product);
                      setSearch("");
                    }}
                    className="flex w-full items-center gap-3 rounded-[16px] p-3 text-left transition hover:bg-white/80"
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
                      <p className="truncate text-sm font-semibold">
                        {product.name}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-gray-500">
                        {product.barcode || `P-${product.id}`}
                      </p>
                    </div>

                    <p className="shrink-0 font-bold text-gold">
                      ${product.price.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowBackgroundSettings(true)}
            aria-label="Background settings"
            title="Background settings"
            className="absolute bottom-3 right-5 z-[90] flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/35 text-slate-600 shadow-sm backdrop-blur-xl transition active:scale-95"
          >
            <Settings className="h-4 w-4" />
          </button>
        </section>
        <div className="relative z-40 h-[12px] shrink-0 border-y border-white/60 bg-white/15 shadow-[0_5px_16px_rgba(23,36,59,0.08),inset_0_1px_1px_rgba(255,255,255,0.90)] backdrop-blur-[24px] backdrop-saturate-[180%]" />

        {/* Sale table */}

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white/45">
          {/* Bilingual table header */}

          <div className="grid shrink-0 grid-cols-[180px_2fr_2fr_90px_110px_100px_120px_50px] divide-x divide-white/25 border-y border-white/25 bg-[#17243b] px-5 py-3 text-white">
            <div>
              <p className="font-khmer text-sm font-semibold leading-6">
                លេខកូដ
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/75">
                Barcode
              </p>
            </div>

            <div>
              <p className="font-khmer text-sm font-semibold leading-6">
                ពិពណ៌នា
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/75">
                Description
              </p>
            </div>

            <div>
              <p className="font-khmer text-sm font-semibold leading-6">
                ព័ត៌មានលម្អិត
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/75">
                Product Details
              </p>
            </div>

            <div className="text-center">
              <p className="font-khmer text-sm font-semibold leading-6">
                បញ្ចុះតម្លៃ
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/75">
                Discount
              </p>
            </div>

            <div className="text-center">
              <p className="font-khmer text-sm font-semibold leading-6">
                ចំនួន
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/75">
                Qty
              </p>
            </div>

            <div className="text-right">
              <p className="font-khmer text-sm font-semibold leading-6">
                តម្លៃ
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/75">
                Price
              </p>
            </div>

            <div className="text-right">
              <p className="font-khmer text-sm font-semibold leading-6">សរុប</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/75">
                Amount
              </p>
            </div>

            <span />
          </div>

          {/* Product rows */}

          <div className="min-h-0 flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-400">
                <div className="text-center">
                  <ScanBarcode className="mx-auto h-10 w-10" />

                  <p className="mt-3 font-semibold">Scan a product to begin</p>

                  <p className="font-khmer mt-1 text-sm leading-7">
                    ស្កេនទំនិញដើម្បីចាប់ផ្តើម
                  </p>
                </div>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[180px_2fr_2fr_90px_110px_100px_120px_50px] items-center divide-x divide-slate-300/60 border-x border-b border-slate-300/60 bg-white/20 px-5 py-3"
                >
                  <p className="truncate font-mono text-xs text-gray-500">
                    {item.barcode || `P-${item.id}`}
                  </p>

                  <div className="min-w-0">
                    <p className="truncate font-semibold">{item.name}</p>

                    {item.brand && (
                      <p className="truncate text-xs text-gray-500">
                        {item.brand}
                      </p>
                    )}
                  </div>

                  <p className="line-clamp-2 pr-5 text-sm text-gray-500">
                    {item.description || "—"}
                  </p>

                  {/* Add Discount column here */}

                  <div className="flex items-center justify-center px-2">
                    <div className="flex w-[82px] items-center rounded-full border border-white/80 bg-white/55 px-2 shadow-sm backdrop-blur-xl">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={item.discount ?? 0}
                        onChange={(event) =>
                          updateDiscount(item.id, Number(event.target.value))
                        }
                        className="min-w-0 flex-1 bg-transparent py-2 text-center text-sm font-bold outline-none"
                      />

                      <span className="text-xs font-semibold text-gray-500">
                        %
                      </span>
                    </div>
                  </div>

                  {/* Quantity */}

                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/60"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="min-w-8 text-center font-bold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/60"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-right font-semibold">
                    ${item.price.toFixed(2)}
                  </p>

                  <p className="text-right text-lg font-bold text-gold">
                    $
                    {(
                      item.price *
                      item.quantity *
                      (1 - (item.discount ?? 0) / 100)
                    ).toFixed(2)}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Total and payment */}

        <footer className="flex h-[110px] shrink-0 items-center justify-between bg-[#17243b] px-8 text-white">
          {/* Payment buttons — left */}

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => alert("Cash payment will be added next.")}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 font-semibold disabled:opacity-40"
            >
              <Banknote className="h-5 w-5" />
              Cash
            </button>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => alert("KHQR payment will be added next.")}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 font-semibold disabled:opacity-40"
            >
              <QrCode className="h-5 w-5" />
              KHQR
            </button>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => alert("Card payment will be added next.")}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 font-semibold disabled:opacity-40"
            >
              <CreditCard className="h-5 w-5" />
              Card
            </button>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={clearSale}
              className="rounded-full border border-red-300/30 bg-red-500/15 px-5 py-3 font-semibold text-red-200 disabled:opacity-40"
            >
              Clear
            </button>
          </div>

          {/* Quantity and total — right */}

          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="font-khmer text-xs leading-5 text-white/60">
                ចំនួនសរុប
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">
                Qty
              </p>

              <p className="mt-1 text-3xl font-bold">{itemCount}</p>
            </div>

            <div className="h-14 w-px bg-white/20" />

            <div className="min-w-[180px] text-right">
              <p className="font-khmer text-xs leading-5 text-white/60">
                តម្លៃសរុប
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">
                Total
              </p>

              <p className="mt-1 text-4xl font-bold text-[#f8d98c]">
                ${subtotal.toFixed(2)}
              </p>
            </div>
          </div>
        </footer>
      </div>
      {/* Background settings */}

      {showBackgroundSettings && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/35 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-white/80 bg-[#fffaf0]/95 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">POS Background</h2>

              <button
                type="button"
                onClick={() => setShowBackgroundSettings(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-semibold text-white">
              <Upload className="h-5 w-5" />

              {uploadingBackground ? "Uploading…" : "Upload Picture"}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploadingBackground}
                onChange={handleBackgroundUpload}
                className="hidden"
              />
            </label>

            {posBackground.url && (
              <>
                <div
                  className="mt-5 h-[120px] rounded-[20px] border border-white/80 bg-white/30 bg-no-repeat"
                  style={{
                    backgroundImage: `url("${posBackground.url}")`,
                    backgroundSize: `auto ${posBackground.size}%`,
                    backgroundPosition: `${posBackground.x}% ${posBackground.y}%`,
                  }}
                />

                <label className="mt-5 block text-sm font-semibold">
                  Image size: {posBackground.size}%
                </label>

                <input
                  type="range"
                  min="20"
                  max="300"
                  value={posBackground.size}
                  onChange={(event) =>
                    updateBackground({
                      size: Number(event.target.value),
                    })
                  }
                  className="mt-2 w-full"
                />

                <label className="mt-4 block text-sm font-semibold">
                  Left/Right
                </label>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={posBackground.x}
                  onChange={(event) =>
                    updateBackground({
                      x: Number(event.target.value),
                    })
                  }
                  className="mt-2 w-full"
                />

                <label className="mt-4 block text-sm font-semibold">
                  Up/Down
                </label>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={posBackground.y}
                  onChange={(event) =>
                    updateBackground({
                      y: Number(event.target.value),
                    })
                  }
                  className="mt-2 w-full"
                />

                <button
                  type="button"
                  onClick={() =>
                    updateBackground({
                      size: 100,
                      x: 50,
                      y: 50,
                    })
                  }
                  className="mt-5 w-full rounded-full border border-gold/30 py-3 font-semibold text-gold"
                >
                  Reset Position
                </button>

                <button
                  type="button"
                  onClick={() => updateBackground(defaultBackground)}
                  className="mt-3 w-full py-2 text-sm font-semibold text-red-500"
                >
                  Remove Background
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
