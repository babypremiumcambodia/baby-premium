"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  Truck,
  LogOut,
  Minus,
  Plus,
  QrCode,
  ScanBarcode,
  Search,
  Settings,
  Trash2,
  Upload,
  UserRound,
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

type Member = {
  id: string;
  name: string;
  phone: string;
  points: number;
};

type CustomerCart = {
  id: number;
  cart: CartItem[];
  scannedProducts: ScannedProduct[];
  selectedMember: Member | null;
};

const createCustomerCarts = (): CustomerCart[] =>
  Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    cart: [],
    scannedProducts: [],
    selectedMember: null,
  }));

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

const KHR_RATE = 4050;

type KhqrState = "idle" | "generating" | "waiting" | "paid" | "error";

type KhqrCreateResponse = {
  tranId: string;
  qrImage: string;
  qrString?: string;
  amount: number;
  currency: "USD" | "KHR";
  expiresAt?: string | null;
};

type KhqrStatusResponse = {
  paid: boolean;
  status: string;
  apv?: string | null;
  bankName?: string | null;
};

export default function PosPage() {
  const router = useRouter();
  const scanSequence = useRef(0);
  const cashUsdRef = useRef<HTMLInputElement>(null);
  const cashKhrRef = useRef<HTMLInputElement>(null);
  const khqrCompletedRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);

  const [search, setSearch] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  // TEST: automatically rotate the POS glass theme every 10 seconds.
  // Later change 10 * 1000 to 60 * 60 * 1000 for one hour.
  const posThemes = [
    { name: "Emerald", from: "rgba(4,120,87,0.78)", to: "rgba(52,211,153,0.62)", softFrom: "rgba(4,120,87,0.22)", softTo: "rgba(52,211,153,0.28)" },
    { name: "Sapphire", from: "rgba(29,78,216,0.78)", to: "rgba(56,189,248,0.62)", softFrom: "rgba(29,78,216,0.22)", softTo: "rgba(56,189,248,0.28)" },
    { name: "Violet", from: "rgba(109,40,217,0.78)", to: "rgba(192,132,252,0.62)", softFrom: "rgba(109,40,217,0.22)", softTo: "rgba(192,132,252,0.28)" },
    { name: "Ruby", from: "rgba(159,18,57,0.78)", to: "rgba(251,113,133,0.62)", softFrom: "rgba(159,18,57,0.22)", softTo: "rgba(251,113,133,0.28)" },
    { name: "Gold", from: "rgba(161,98,7,0.78)", to: "rgba(251,191,36,0.62)", softFrom: "rgba(161,98,7,0.22)", softTo: "rgba(251,191,36,0.28)" },
  ];
  const [themeIndex, setThemeIndex] = useState(0);
  const currentTheme = posThemes[themeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setThemeIndex((current) => (current + 1) % posThemes.length);
    }, 10 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const [showBackgroundSettings, setShowBackgroundSettings] = useState(false);

  const [uploadingBackground, setUploadingBackground] = useState(false);

  const [posBackground, setPosBackground] =
    useState<PosBackground>(defaultBackground);

  const [showCashPayment, setShowCashPayment] = useState(false);
  const [receivedUSD, setReceivedUSD] = useState("");
  const [receivedKHR, setReceivedKHR] = useState("");

  // F12 special-sale mode: arm before scanning, then edit the next scanned item
  const [specialSaleMode, setSpecialSaleMode] = useState(false);
  const [showSaleEdit, setShowSaleEdit] = useState(false);
  const [lastScannedProductId, setLastScannedProductId] = useState<number | null>(null);
  const [saleEditProductId, setSaleEditProductId] = useState<number | null>(null);
  const [saleEditQty, setSaleEditQty] = useState("1");
  const [saleEditPrice, setSaleEditPrice] = useState("0");
  const [saleEditDiscount, setSaleEditDiscount] = useState("0");

  const [showKhqrPayment, setShowKhqrPayment] = useState(false);
  const [khqrState, setKhqrState] = useState<KhqrState>("idle");
  const [khqrTranId, setKhqrTranId] = useState("");
  const [khqrQrImage, setKhqrQrImage] = useState("");
  const [khqrQrString, setKhqrQrString] = useState("");
  const [khqrError, setKhqrError] = useState("");
  const [khqrApprovalCode, setKhqrApprovalCode] = useState("");
  const [khqrBankName, setKhqrBankName] = useState("");

  const [showMemberModal, setShowMemberModal] = useState(false);

  // Delivery details for the current customer sale only.
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [isDelivery, setIsDelivery] = useState(false);
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("1.50");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [memberResults, setMemberResults] = useState<Member[]>([]);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberError, setMemberError] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // F4 multi-cart: up to 9 customers can be kept at the same time.
  const [customerCarts, setCustomerCarts] = useState<CustomerCart[]>(
    createCustomerCarts,
  );
  const [activeCartIndex, setActiveCartIndex] = useState(0);
  const [showCartSwitcher, setShowCartSwitcher] = useState(false);

  const [showNewMemberForm, setShowNewMemberForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberPhone, setNewMemberPhone] = useState("");

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
    function handlePosNavigationShortcuts(event: KeyboardEvent) {
      if (event.key === "F3") {
        event.preventDefault();

        if (
          !showCashPayment &&
          !showKhqrPayment &&
          !showCartSwitcher &&
          !showSaleEdit &&
          !showMemberModal &&
          !showBackgroundSettings
        ) {
          setShowProductSearch(true);
          setSearch("");
        }
        return;
      }

      if (event.key === "F4") {
        event.preventDefault();

        if (
          !showCashPayment &&
          !showKhqrPayment &&
          !showProductSearch &&
          !showSaleEdit &&
          !showMemberModal &&
          !showBackgroundSettings
        ) {
          setShowCartSwitcher(true);
        }
        return;
      }

      if (event.key === "Escape" && showProductSearch) {
        event.preventDefault();
        setShowProductSearch(false);
        setSearch("");
        return;
      }

      if (event.key === "Escape" && showCartSwitcher) {
        event.preventDefault();
        setShowCartSwitcher(false);
      }
    }

    window.addEventListener("keydown", handlePosNavigationShortcuts);

    return () => {
      window.removeEventListener("keydown", handlePosNavigationShortcuts);
    };
  }, [
    showProductSearch,
    showCartSwitcher,
    showCashPayment,
    showKhqrPayment,
    showSaleEdit,
    showMemberModal,
    showBackgroundSettings,
  ]);

  useEffect(() => {
    function handleSaleShortcuts(event: KeyboardEvent) {
      if (event.key === "F12") {
        event.preventDefault();

        if (
          !showCashPayment &&
          !showKhqrPayment &&
          !showProductSearch &&
          !showCartSwitcher &&
          !showSaleEdit &&
          !showMemberModal &&
          !showBackgroundSettings
        ) {
          setSpecialSaleMode((current) => !current);
        }
        return;
      }

      if (event.key === "F10") {
        event.preventDefault();

        if (
          !showCashPayment &&
          !showKhqrPayment &&
          !showProductSearch &&
          !showCartSwitcher &&
          !showSaleEdit &&
          !showMemberModal &&
          !showBackgroundSettings &&
          cart.length > 0
        ) {
          clearSale();
        }
        return;
      }

      if (event.key === "Escape" && showSaleEdit) {
        event.preventDefault();
        closeSaleEdit();
      }
    }

    window.addEventListener("keydown", handleSaleShortcuts);

    return () => {
      window.removeEventListener("keydown", handleSaleShortcuts);
    };
  }, [
    cart.length,
    showSaleEdit,
    showCashPayment,
    showKhqrPayment,
    showProductSearch,
    showCartSwitcher,
    showMemberModal,
    showBackgroundSettings,
  ]);

  useEffect(() => {
    function handleEnterToCash(event: KeyboardEvent) {
      if (event.key !== "Enter") return;

      const target = event.target as HTMLElement | null;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if (isTyping) return;

      if (
        cart.length > 0 &&
        !showCashPayment &&
        !showKhqrPayment &&
        !showProductSearch &&
        !showCartSwitcher &&
        !showSaleEdit &&
        !showMemberModal &&
        !showBackgroundSettings
      ) {
        event.preventDefault();
        openCashPayment();
      }
    }

    window.addEventListener("keydown", handleEnterToCash);

    return () => {
      window.removeEventListener("keydown", handleEnterToCash);
    };
  }, [
    cart.length,
    showCashPayment,
    showKhqrPayment,
    showProductSearch,
    showCartSwitcher,
    showMemberModal,
    showBackgroundSettings,
  ]);

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

  useEffect(() => {
    if (!showKhqrPayment || khqrState !== "waiting" || !khqrTranId) return;

    let stopped = false;

    async function checkKhqrStatus() {
      try {
        const response = await fetch(
          `/api/payments/khqr/status?tranId=${encodeURIComponent(khqrTranId)}`,
          { cache: "no-store" },
        );

        if (!response.ok) return;

        const result = (await response.json()) as KhqrStatusResponse;

        if (stopped || !result.paid) return;

        khqrCompletedRef.current = true;
        setKhqrApprovalCode(result.apv ?? "");
        setKhqrBankName(result.bankName ?? "");
        setKhqrState("paid");
      } catch {
        // Keep polling. A temporary network error should not close the QR.
      }
    }

    void checkKhqrStatus();
    const timer = window.setInterval(checkKhqrStatus, 2000);

    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [showKhqrPayment, khqrState, khqrTranId]);

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
      .slice(0, 50);
  }, [products, search]);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const productSubtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity * (1 - (item.discount ?? 0) / 100),
    0,
  );

  const deliveryFeeNumber = isDelivery ? Math.max(0, Number(deliveryFee) || 0) : 0;
  const subtotal = productSubtotal + deliveryFeeNumber;

  const totalKHR = Math.round(subtotal * KHR_RATE);
  const receivedUSDNumber = Number(receivedUSD) || 0;
  const receivedKHRNumber = Number(receivedKHR) || 0;
  const receivedKHRInUSD = receivedKHRNumber / KHR_RATE;
  const totalReceivedUSD = receivedUSDNumber + receivedKHRInUSD;
  const remainingUSD = Math.max(subtotal - totalReceivedUSD, 0);
  const remainingKHR = Math.round(remainingUSD * KHR_RATE);
  const changeUSD = Math.max(totalReceivedUSD - subtotal, 0);
  const changeKHR = Math.round(changeUSD * KHR_RATE);
  const hasEnoughCash = totalReceivedUSD + 0.000001 >= subtotal && subtotal > 0;
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
    setLastScannedProductId(product.id);
  }

  function addScannedProduct(product: Product) {
    addToCart(product);

    if (specialSaleMode && product.stock > 0) {
      openSaleEditForProduct(product);
    }
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

  function getCartSnapshot(index: number): CustomerCart {
    if (index === activeCartIndex) {
      return {
        id: index + 1,
        cart,
        scannedProducts,
        selectedMember,
      };
    }

    return customerCarts[index];
  }

  function switchCustomerCart(index: number) {
    if (index < 0 || index >= customerCarts.length) return;

    if (index === activeCartIndex) {
      setShowCartSwitcher(false);
      return;
    }

    const nextCart = customerCarts[index];

    setCustomerCarts((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === activeCartIndex
          ? {
              ...slot,
              cart,
              scannedProducts,
              selectedMember,
            }
          : slot,
      ),
    );

    setActiveCartIndex(index);
    setCart(nextCart.cart);
    setScannedProducts(nextCart.scannedProducts);
    setSelectedMember(nextCart.selectedMember);
    setSearch("");
    setSpecialSaleMode(false);
    setShowSaleEdit(false);
    setSaleEditProductId(null);
    setShowCartSwitcher(false);
  }

  function clearSale() {
    setCustomerCarts((current) =>
      current.map((slot, index) =>
        index === activeCartIndex
          ? {
              ...slot,
              cart: [],
              scannedProducts: [],
              selectedMember: null,
            }
          : slot,
      ),
    );

    setCart([]);
    setScannedProducts([]);
    setSearch("");
    setShowCashPayment(false);
    setReceivedUSD("");
    setReceivedKHR("");
    setShowKhqrPayment(false);
    setKhqrState("idle");
    setKhqrTranId("");
    setKhqrQrImage("");
    setKhqrQrString("");
    setKhqrError("");
    setKhqrApprovalCode("");
    setKhqrBankName("");
    setSelectedMember(null);
    setShowMemberModal(false);
    setShowDeliveryModal(false);
    setIsDelivery(false);
    setDeliveryName("");
    setDeliveryPhone("");
    setDeliveryAddress("");
    setDeliveryFee("1.50");
    setDeliveryNote("");
    setMemberSearch("");
    setMemberResults([]);
    setMemberError("");
    setShowNewMemberForm(false);
    setNewMemberName("");
    setNewMemberPhone("");
    setSpecialSaleMode(false);
    setShowSaleEdit(false);
    setLastScannedProductId(null);
    setSaleEditProductId(null);
    setSaleEditQty("1");
    setSaleEditPrice("0");
    setSaleEditDiscount("0");
    khqrCompletedRef.current = false;
  }

  function openSaleEditForProduct(product: Product) {
    // Wait until React has added/updated the cart item, then open the editor.
    window.setTimeout(() => {
      setSaleEditProductId(product.id);
      setSaleEditQty("1");
      setSaleEditPrice(product.price.toFixed(2));
      setSaleEditDiscount("0");
      setShowSaleEdit(true);
      setSpecialSaleMode(false);
    }, 0);
  }

  function closeSaleEdit() {
    setShowSaleEdit(false);
    setSaleEditProductId(null);
  }

  function saveSaleEdit() {
    if (saleEditProductId === null) return;

    const currentItem = cart.find((item) => item.id === saleEditProductId);
    if (!currentItem) {
      closeSaleEdit();
      return;
    }

    const quantity = Math.min(
      currentItem.stock,
      Math.max(1, Math.floor(Number(saleEditQty) || 1)),
    );
    const price = Math.max(0, Number(saleEditPrice) || 0);
    const discount = Math.min(100, Math.max(0, Number(saleEditDiscount) || 0));

    setCart((current) =>
      current.map((item) =>
        item.id === saleEditProductId
          ? {
              ...item,
              quantity,
              price,
              discount,
            }
          : item,
      ),
    );

    closeSaleEdit();
  }

  function openDeliveryModal() {
    if (cart.length === 0) return;
    setShowDeliveryModal(true);
  }

  function closeDeliveryModal() {
    setShowDeliveryModal(false);
  }

  function saveDelivery() {
    setIsDelivery(true);
    setShowDeliveryModal(false);
  }

  function removeDelivery() {
    setIsDelivery(false);
    setDeliveryName("");
    setDeliveryPhone("");
    setDeliveryAddress("");
    setDeliveryFee("1.50");
    setDeliveryNote("");
    setShowDeliveryModal(false);
  }

  function openMemberModal() {
    setShowMemberModal(true);
    setMemberError("");
    setShowNewMemberForm(false);
    setMemberSearch(selectedMember?.phone ?? "");
    setMemberResults(selectedMember ? [selectedMember] : []);
  }

  function closeMemberModal() {
    setShowMemberModal(false);
    setMemberError("");
    setShowNewMemberForm(false);
  }

  async function searchMembers() {
    const query = memberSearch.trim();

    if (!query) {
      setMemberResults([]);
      setMemberError("Enter a phone number or member name.");
      return;
    }

    setMemberLoading(true);
    setMemberError("");

    const safeQuery = query.replace(/[,%]/g, "");
    const { data, error } = await supabase
      .from("members")
      .select("id, name, phone, points")
      .or(`phone.ilike.%${safeQuery}%,name.ilike.%${safeQuery}%`)
      .order("name")
      .limit(20);

    setMemberLoading(false);

    if (error) {
      setMemberError(error.message);
      setMemberResults([]);
      return;
    }

    const normalizedMembers: Member[] = (data ?? []).map((member) => ({
      id: String(member.id),
      name: String(member.name),
      phone: String(member.phone),
      points: Number(member.points ?? 0),
    }));

    setMemberResults(normalizedMembers);

    if (normalizedMembers.length === 0) {
      setMemberError("No member found. You can create a new member.");
    }
  }

  async function createMember() {
    const name = newMemberName.trim();
    const phone = newMemberPhone.trim();

    if (!name || !phone) {
      setMemberError("Name and phone number are required.");
      return;
    }

    setMemberLoading(true);
    setMemberError("");

    const { data, error } = await supabase
      .from("members")
      .insert({ name, phone, points: 0 })
      .select("id, name, phone, points")
      .single();

    setMemberLoading(false);

    if (error) {
      if (error.code === "23505") {
        setMemberError("This phone number is already registered.");
      } else {
        setMemberError(error.message);
      }
      return;
    }

    const member: Member = {
      id: String(data.id),
      name: String(data.name),
      phone: String(data.phone),
      points: Number(data.points ?? 0),
    };

    setSelectedMember(member);
    setMemberResults([member]);
    setMemberSearch(phone);
    setNewMemberName("");
    setNewMemberPhone("");
    setShowNewMemberForm(false);
    setShowMemberModal(false);
  }

  async function openKhqrPayment() {
    if (cart.length === 0 || subtotal <= 0) return;

    khqrCompletedRef.current = false;
    setShowKhqrPayment(true);
    setKhqrState("generating");
    setKhqrTranId("");
    setKhqrQrImage("");
    setKhqrQrString("");
    setKhqrError("");
    setKhqrApprovalCode("");
    setKhqrBankName("");

    try {
      const response = await fetch("/api/payments/khqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(subtotal.toFixed(2)),
          currency: "USD",
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            discount: item.discount ?? 0,
          })),
        }),
      });

      const result = (await response.json()) as Partial<KhqrCreateResponse> & {
        error?: string;
      };

      if (!response.ok || !result.tranId || !result.qrImage) {
        throw new Error(result.error || "Could not generate KHQR.");
      }

      setKhqrTranId(result.tranId);
      setKhqrQrImage(result.qrImage);
      setKhqrQrString(result.qrString ?? "");
      setKhqrState("waiting");
    } catch (error) {
      setKhqrState("error");
      setKhqrError(
        error instanceof Error ? error.message : "Could not generate KHQR.",
      );
    }
  }

  function closeKhqrPayment() {
    if (khqrCompletedRef.current) {
      clearSale();
      return;
    }

    setShowKhqrPayment(false);
    setKhqrState("idle");
    setKhqrTranId("");
    setKhqrQrImage("");
    setKhqrQrString("");
    setKhqrError("");
  }

  function finishKhqrSale() {
    if (khqrState !== "paid") return;
    clearSale();
  }

  function openCashPayment() {
    if (cart.length === 0) return;

    setShowCashPayment(true);
    setReceivedUSD("");
    setReceivedKHR("");

    window.setTimeout(() => cashUsdRef.current?.focus(), 0);
  }

  function closeCashPayment() {
    setShowCashPayment(false);
    setReceivedUSD("");
    setReceivedKHR("");
  }

  function completeCashPayment() {
    if (!hasEnoughCash) return;

    const changeText =
      changeUSD > 0
        ? `$${changeUSD.toFixed(2)} / ${changeKHR.toLocaleString()} ៛`
        : "$0.00 / 0 ៛";

    alert(`Payment completed. Change: ${changeText}`);

    // This finishes the on-screen sale. Add your Supabase sales/receipt insert here
    // when your sales table schema is ready.
    clearSale();
  }

  function handleCashKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeCashPayment();
      return;
    }

    // Tab from Received USD directly to Received KHR.
    // Quick-cash buttons are removed from the keyboard tab order below.
    if (
      event.key === "Tab" &&
      event.currentTarget === cashUsdRef.current &&
      !event.shiftKey
    ) {
      event.preventDefault();
      cashKhrRef.current?.focus();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      completeCashPayment();
    }
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const searchText = search.trim().toLowerCase();

    // After scanning products, press Enter again on the empty search box to pay.
    if (!searchText) {
      if (cart.length > 0) openCashPayment();
      return;
    }

    const exactBarcodeProduct = products.find(
      (product) => product.barcode?.trim().toLowerCase() === searchText,
    );

    if (exactBarcodeProduct) {
      addScannedProduct(exactBarcodeProduct);
      setSearch("");
      return;
    }

    const exactNameProduct = products.find(
      (product) => product.name.trim().toLowerCase() === searchText,
    );

    if (exactNameProduct) {
      addScannedProduct(exactNameProduct);
      setSearch("");
      return;
    }

    if (filteredProducts.length === 1) {
      addScannedProduct(filteredProducts[0]);
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
        {/* Banner frame */}

        <section className="relative h-[190px] shrink-0 overflow-visible">
          {/* BannerSlider clipped inside the frame */}
          <div className="absolute inset-x-0 top-0 h-full overflow-hidden bg-slate-900">
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

            {/* Gentle dark glass overlay like the reference frame */}
            <div className="absolute inset-0 bg-slate-950/25" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.16),transparent_32%,transparent_72%,rgba(15,23,42,0.10))]" />

            {/* Brand content */}
            <div className="absolute inset-0 z-20 flex items-center px-10">
              <div className="flex items-center gap-5">
                

                <div className="text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)]">
                  <p className="font-khmer text-[28px] leading-7 text-white/80">
                    សូមស្វាគមន៍
                  </p>
                  <h1 className="text-[30px] font-bold leading-tight">Welcome</h1>
                  <p className="mt-1 text-lg font-medium text-white/90">
                    Baby Premium &amp; Essentials
                  </p>
                </div>
              </div>
            </div>

            {/* Sign out */}
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Sign out"
              title="Sign out"
              className="absolute right-6 top-1/2 z-30 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-black/15 text-white shadow-[0_8px_22px_rgba(15,23,42,0.18)] backdrop-blur-xl transition hover:bg-red-500/65"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Soft transparent gold frame / curve */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-[16px] z-40 h-[37px] overflow-visible">
            <svg
              className="h-full w-full translate-y-[2px] overflow-visible"
              viewBox="0 0 1440 38"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="bannerGoldFrame" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(196,163,86,0.88)" />
                  <stop offset="22%" stopColor="rgba(222,194,125,0.92)" />
                  <stop offset="50%" stopColor="rgba(255,235,185,0.98)" />
                  <stop offset="78%" stopColor="rgba(222,194,125,0.92)" />
                  <stop offset="100%" stopColor="rgba(196,163,86,0.88)" />
                </linearGradient>

                <linearGradient id="bannerGoldHighlight" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
                  <stop offset="50%" stopColor="rgba(255,250,225,0.82)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.32)" />
                </linearGradient>

                <filter id="bannerGoldSoftGlow" x="-5%" y="-100%" width="110%" height="300%">
                  <feGaussianBlur stdDeviation="2.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Main thick gold frame — blocks the banner underneath */}
              <path
                d="M 0 11 C 290 11, 455 31, 720 31 C 985 31, 1150 11, 1440 11"
                fill="none"
                stroke="url(#bannerGoldFrame)"
                strokeWidth="20"
                strokeLinecap="round"
                filter="url(#bannerGoldSoftGlow)"
              />

              {/* Fine glass highlight */}
              <path
                d="M 0 7 C 290 7, 455 27, 720 27 C 985 27, 1150 7, 1440 7"
                fill="none"
                stroke="url(#bannerGoldHighlight)"
                strokeWidth="20"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </section>

        {/* Scanned images and barcode search */}

        <section
          className="relative z-30 flex h-[115px] shrink-0 border-b border-white/70 bg-white/10 bg-no-repeat"
          style={
            posBackground.url
              ? {
                  backgroundImage: `linear-gradient(rgba(255,250,240,0.12), rgba(255,250,240,0.12)), url("${posBackground.url}")`,
                  backgroundSize: `100% 100%`,
                  backgroundPosition: `${posBackground.x}% ${posBackground.y}%`,
                }
              : undefined
          }
        >
          {/* Scanned images */}
<div className="relative z-50 min-w-0 flex-1 overflow-hidden">
  {scannedProducts.length > 0 && (
    <div className="relative flex h-full items-center gap-3 overflow-hidden px-5">
      {scannedProducts.map((product) => (
        <div
          key={product.scanId}
          title={product.name}
          className="scanned-product-enter relative flex h-[90px] w-[90px] shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-white/80 bg-white/55 shadow-[0_12px_30px_rgba(23,36,59,0.18),inset_0_1px_2px_rgba(255,255,255,0.95)] backdrop-blur-[24px]"
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="relative z-10 h-[95px] w-[95px] object-contain p-1 drop-shadow-[0_7px_10px_rgba(23,36,59,0.18)]"
            />
          ) : (
            <ScanBarcode className="relative z-10 h-10 w-10 text-gray-400" />
          )}

          {/* Glass front */}
          <div className="pointer-events-none absolute inset-0 z-20 rounded-[24px] bg-white/[0.06] shadow-[inset_0_1px_2px_rgba(255,255,255,0.95)]" />
        </div>
      ))}
    </div>
  )}
</div>

          {/* Barcode search is hidden on the main POS. Press F3 to open Product Search. */}

          <button
            type="button"
            onClick={() => setShowBackgroundSettings(true)}
            aria-label="Background settings"
            title="Background settings"
            className="absolute bottom-3 right-5 z-[90] flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-transparent text-emerald-600 shadow-sm backdrop-blur-xl transition active:scale-95"
          >
            <Settings className="h-4 w-4" />
          </button>
        </section>
        <div className="relative z-40 h-[20px] shrink-0 border-y border-emerald-200/60 bg-transparent shadow-[0_5px_16px_rgba(5,150,105,0.12),inset_0_1px_1px_rgba(255,255,255,0.70)] backdrop-blur-[24px] backdrop-saturate-[180%]" style={{ background: `linear-gradient(135deg, ${currentTheme.softFrom}, ${currentTheme.softTo})` }} />

        {/* Sale table */}

<section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white/45">
  {/* Table header */}

  <div className="grid shrink-0 grid-cols-[180px_2fr_2fr_90px_110px_100px_120px_50px] divide-x divide-white/30 border-y border-emerald-200/60 bg-transparent px-5 py-3 text-white shadow-[0_8px_24px_rgba(5,150,105,0.20),inset_0_1px_2px_rgba(255,255,255,0.65)] backdrop-blur-[24px] backdrop-saturate-[180%]" style={{ background: `linear-gradient(135deg, ${currentTheme.from}, ${currentTheme.to})` }}>
    {/* Barcode */}

    <div className="flex flex-col justify-center gap-0 px-0">
      <p className="font-khmer whitespace-nowrap text-[18px] leading-none">
        លេខកូដ
      </p>

      <p className="mt-0.5 whitespace-nowrap text-[18px] font-bold leading-none">
        Barcode
      </p>
    </div>

    {/* Description */}

    <div className="flex flex-col justify-center gap-0 px-2">
      <p className="font-khmer whitespace-nowrap text-[18px] leading-none">
        ពិពណ៌នា
      </p>

      <p className="mt-0.5 whitespace-nowrap text-[18px] font-bold leading-none">
        Description
      </p>
    </div>

    {/* Product details */}

    <div className="flex flex-col justify-center gap-0 px-2">
      <p className="font-khmer whitespace-nowrap text-[18px] leading-none">
        ព័ត៌មានលម្អិត
      </p>

      <p className="mt-0.5 whitespace-nowrap text-[18px] font-bold leading-none">
        Product Details
      </p>
    </div>

    {/* Discount */}

    <div className="flex flex-col items-center justify-center gap-0 px-0 text-center">
      <p className="font-khmer whitespace-nowrap text-[18px] leading-none">
        បញ្ចុះតម្លៃ
      </p>

      <p className="mt-0.5 whitespace-nowrap text-[18px] font-bold leading-none">
        Discount
      </p>
    </div>

    {/* Quantity */}

    <div className="flex flex-col items-center justify-center gap-0 px-0 text-center">
      <p className="font-khmer whitespace-nowrap text-[18px] leading-none">
        ចំនួន
      </p>

      <p className="mt-0.5 whitespace-nowrap text-[18px] font-bold leading-none">
        Qty
      </p>
    </div>

    {/* Price */}

    <div className="flex flex-col items-center justify-center gap-0 px-0 text-center">
      <p className="font-khmer whitespace-nowrap text-[18px] leading-none">
        តម្លៃ
      </p>

      <p className="mt-0.5 whitespace-nowrap text-[18px] font-bold leading-none">
        Price
      </p>
    </div>

    {/* Amount */}

    <div className="flex flex-col items-center justify-center gap-0 px-0 text-center">
      <p className="font-khmer whitespace-nowrap text-[18px] leading-none">
        សរុប
      </p>

      <p className="mt-0.5 whitespace-nowrap text-[18px] font-bold leading-none">
        Amount
      </p>
    </div>

    {/* /ete column */}

    <div />
  </div>

  {/* Product rows */}

  <div className="min-h-0 flex-1 overflow-y-auto">
    {cart.length === 0 ? null : (
      cart.map((item) => {
        const discountedAmount =
          item.price *
          item.quantity *
          (1 - (item.discount ?? 0) / 100);

        return (
          <div
            key={item.id}
            className="grid grid-cols-[180px_2fr_2fr_90px_110px_100px_120px_50px] items-center divide-x divide-slate-300/60 border-x border-b border-slate-300/60 bg-white/20 px-5 py-1 text-[12px]"
          >
            {/* Barcode */}

            <div className="min-w-0 pr-2">
              <p className="truncate font-mono text-xs text-gray-500">
                {item.barcode || `P-${item.id}`}
              </p>
            </div>

            {/* Description */}

            <div className="min-w-0 px-2">
              <p className="truncate text-[13px] font-semibold text-slate-900">
                {item.name}
              </p>

              {item.brand && (
                <p className="mt-1 truncate text-[11px] text-gray-500">
                  {item.brand}
                </p>
              )}
            </div>

            {/* Product details */}

            <div className="min-w-0 px-2">
              <p className="line-clamp-2 text-[12px] leading-5 text-gray-500">
                {item.description || "—"}
              </p>
            </div>

            {/* Discount */}
<div className="flex items-center justify-center">
  <input
    type="number"
    min="0"
    max="100"
    step="1"
    value={item.discount ?? 0}
    onChange={(event) =>
      updateDiscount(
        item.id,
        Number(event.target.value)
      )
    }
    className="w-[48px] bg-transparent text-right text-[13px] font-bold text-emerald-700 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
  />

  <span className="ml-1 text-[11px] font-semibold text-emerald-600">
    %
  </span>
</div>

            {/* Quantity */}

            <div className="flex items-center justify-center gap-1 px-1">
              <button
                type="button"
                onClick={() => decreaseQuantity(item)}
                aria-label={`Decrease ${item.name}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/60"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <span className="min-w-6 text-center text-sm font-bold">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => increaseQuantity(item)}
                aria-label={`Increase ${item.name}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/60"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Price */}

            <div className="flex items-center justify-center px-1 text-center">
              <p className="font-semibold">
                ${item.price.toFixed(2)}
              </p>
            </div>

            {/* Amount */}

            <div className="flex items-center justify-center px-1 text-center">
              <p className="text-base font-bold text-gold">
                ${discountedAmount.toFixed(2)}
              </p>
            </div>

            {/* Delete */}

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                aria-label={`Remove ${item.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })
    )}

    {isDelivery && (
      <div className="grid grid-cols-[180px_2fr_2fr_90px_110px_100px_120px_50px] items-center divide-x divide-slate-300/60 border-x border-b border-slate-300/60 bg-white/20 px-5 py-2 text-[12px]">
        {/* Delivery code */}
        <div className="min-w-0 pr-2">
          <p className="truncate font-mono text-xs font-bold text-emerald-600">
            DELIVERY
          </p>
        </div>

        {/* Delivery description */}
        <div className="min-w-0 px-2">
          <p className="truncate text-[13px] font-semibold text-slate-900">
            Delivery
          </p>
          {(deliveryName || deliveryPhone) && (
            <p className="mt-1 truncate text-[11px] text-gray-500">
              {[deliveryName, deliveryPhone].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {/* Delivery details */}
        <div className="min-w-0 px-2">
          <p className="line-clamp-2 text-[12px] leading-5 text-gray-500">
            {deliveryAddress || deliveryNote || "Delivery service"}
          </p>
        </div>

        {/* Discount */}
        <div className="flex items-center justify-center text-[13px] font-bold text-slate-400">
          —
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-center text-sm font-bold">
          1
        </div>

        {/* Price */}
        <div className="flex items-center justify-center px-1 text-center">
          <p className="font-semibold">${deliveryFeeNumber.toFixed(2)}</p>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-center px-1 text-center">
          <p className="text-base font-bold text-gold">
            ${deliveryFeeNumber.toFixed(2)}
          </p>
        </div>

        {/* Delete delivery */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={removeDelivery}
            aria-label="Remove delivery"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    )}
  </div>
</section>

        {/* Total and payment */}
        <div className="h-[110px] shrink-0">
        <footer className="flex h-[90px] items-center justify-between border-y border-emerald-200/60 bg-transparent px-8 text-white shadow-[0_8px_24px_rgba(5,150,105,0.20),inset_0_1px_2px_rgba(255,255,255,0.65)] backdrop-blur-[24px] backdrop-saturate-[180%]" style={{ background: `linear-gradient(135deg, ${currentTheme.from}, ${currentTheme.to})` }}>
          {/* Payment buttons — left */}

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={openCashPayment}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 font-semibold disabled:opacity-40"
            >
              <Banknote className="h-5 w-5" />
              Cash
            </button>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => void openKhqrPayment()}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 font-semibold disabled:opacity-40"
            >
              <QrCode className="h-5 w-5" />
              KHQR
            </button>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={openDeliveryModal}
              className={`flex items-center gap-2 rounded-full border px-5 py-3 font-semibold transition disabled:opacity-40 ${
                isDelivery
                  ? "border-white/50 bg-white/25 text-white"
                  : "border-white/20 bg-white/10 text-white"
              }`}
            >
              <Truck className="h-5 w-5" />
              Delivery
            </button>

            <button
              type="button"
              onClick={openMemberModal}
              className={`flex items-center gap-2 rounded-full border px-5 py-3 font-semibold transition ${
                selectedMember
                  ? "border-white/50 bg-white/25 text-white"
                  : "border-white/20 bg-white/10 text-white"
              }`}
            >
              <UserRound className="h-5 w-5" />
              Member
              {selectedMember && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                  {selectedMember.points.toLocaleString()} pts
                </span>
              )}
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
              <p className="font-khmer text-xs leading-5 text-white">
                ចំនួនសរុប
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                Qty
              </p>

              <p className="mt-1 text-3xl font-bold">{itemCount}</p>
            </div>

            <div className="h-14 w-px bg-white/20" />

            <div className="min-w-[180px] text-right">
              <p className="font-khmer text-xs leading-5 text-white">
                តម្លៃសរុប
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                Total
              </p>

                <p className="mt-1 text-4xl font-extrabold text-[#b3263e]">
                {subtotal === 0 ? ".00" : `$${subtotal.toFixed(2)}`}
              </p>
            </div>
          </div>
        </footer>

        {/* Mini glass — bottom of Total and payment */}
        <div className="relative z-40 h-[20px] border-y border-emerald-200/60 bg-transparent shadow-[0_5px_16px_rgba(5,150,105,0.12),inset_0_1px_1px_rgba(255,255,255,0.70)] backdrop-blur-[24px] backdrop-saturate-[180%]" style={{ background: `linear-gradient(135deg, ${currentTheme.softFrom}, ${currentTheme.softTo})` }} />
        </div>
      </div>

{/* F12 Special Sale status */}
{specialSaleMode && !showSaleEdit && (
  <div className="fixed right-3 top-3 z-[310] rounded-full border border-white/25 bg-white/[0.08] px-5 py-3 text-sm font-black text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),0_6px_20px_rgba(15,23,42,0.04)] backdrop-blur-[20px] backdrop-saturate-[180%]">
    F12 SPECIAL MODE ON
  </div>
)}

{/* F12 Special Sale — edit the next scanned item for this sale only */}
{showSaleEdit && saleEditProductId !== null && (
  <div
    className="fixed inset-0 z-[320] flex items-center justify-center bg-slate-950/25 p-6 backdrop-blur-[3px]"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeSaleEdit();
    }}
  >
    <form
      onSubmit={(event) => {
        event.preventDefault();
        saveSaleEdit();
      }}
      className="w-full max-w-[520px] overflow-hidden rounded-[30px] border border-white/80 bg-[#fffaf0]/95 shadow-[0_30px_90px_rgba(15,23,42,0.30)] backdrop-blur-[30px]"
    >
      <div className="flex items-center justify-between border-b border-emerald-200/60 bg-[linear-gradient(135deg,rgba(4,120,87,0.90),rgba(52,211,153,0.72))] px-7 py-5 text-white">
        <div>
          <p className="font-khmer text-sm text-white/75">កែសម្រួលការលក់</p>
          <h2 className="mt-1 text-2xl font-bold">Edit Sale Item</h2>
        </div>

        <button
          type="button"
          onClick={closeSaleEdit}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 transition hover:bg-white/25"
          aria-label="Close sale item edit"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-7">
        {(() => {
          const item = cart.find((cartItem) => cartItem.id === saleEditProductId);
          if (!item) return null;

          return (
            <>
              <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50/55 px-5 py-4">
                <p className="truncate text-lg font-bold text-slate-800">{item.name}</p>
                <p className="mt-1 font-mono text-xs text-slate-400">
                  {item.barcode || `P-${item.id}`}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  Available stock: {item.stock}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.10em] text-slate-500">
                    Qty
                  </label>
                  <input
                    autoFocus
                    type="number"
                    min="1"
                    max={item.stock}
                    step="1"
                    value={saleEditQty}
                    onChange={(event) => setSaleEditQty(event.target.value)}
                    className="h-[58px] w-full rounded-2xl border-2 border-emerald-200 bg-white px-4 text-center text-xl font-black text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.10em] text-slate-500">
                    Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={saleEditPrice}
                      onChange={(event) => setSaleEditPrice(event.target.value)}
                      className="h-[58px] w-full rounded-2xl border-2 border-emerald-200 bg-white px-4 pr-9 text-right text-xl font-black text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.10em] text-slate-500">
                    Discount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={saleEditDiscount}
                      onChange={(event) => setSaleEditDiscount(event.target.value)}
                      className="h-[58px] w-full rounded-2xl border-2 border-emerald-200 bg-white px-4 pr-9 text-right text-xl font-black text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-[130px_1fr] gap-3">
                <button
                  type="button"
                  onClick={closeSaleEdit}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-2xl bg-emerald-600 px-5 py-3.5 text-lg font-bold text-white shadow-md transition hover:bg-emerald-700"
                >
                  Save Changes
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-slate-400">
                F12 Special Sale · Enter save · Esc close · This sale only
              </p>
            </>
          );
        })()}
      </div>
    </form>
  </div>
)}

{/* F4 Multi-Cart — 9 customer carts */}
{showCartSwitcher && (
  <div
    className="fixed inset-0 z-[310] flex items-center justify-center bg-slate-950/25 p-6 backdrop-blur-[3px]"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        setShowCartSwitcher(false);
      }
    }}
  >
    <div className="w-full max-w-[900px] overflow-hidden rounded-[30px] border border-white/80 bg-[#fffaf0]/95 shadow-[0_30px_90px_rgba(15,23,42,0.30)] backdrop-blur-[30px]">
      <div
        className="flex items-center justify-between border-b border-white/40 px-7 py-5 text-white"
        style={{
          backgroundImage: `linear-gradient(135deg, ${currentTheme.from}, ${currentTheme.to})`,
        }}
      >
        <div>
          <p className="font-khmer text-sm text-white/80">កន្ត្រកអតិថិជន</p>
          <h2 className="mt-1 text-2xl font-bold">Customer Carts</h2>
          <p className="mt-1 text-xs font-semibold text-white/75">
            F4 · Keep up to 9 customers at the same time
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCartSwitcher(false)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 transition hover:bg-white/25"
          aria-label="Close carts"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 p-6">
        {customerCarts.map((slot, index) => {
          const snapshot = getCartSnapshot(index);
          const slotItemCount = snapshot.cart.reduce(
            (total, item) => total + item.quantity,
            0,
          );
          const slotTotal = snapshot.cart.reduce(
            (total, item) =>
              total +
              item.price *
                item.quantity *
                (1 - (item.discount ?? 0) / 100),
            0,
          );
          const isActive = index === activeCartIndex;
          const isEmpty = snapshot.cart.length === 0;

          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => switchCustomerCart(index)}
              className={`relative min-h-[150px] rounded-[24px] border p-5 text-left transition ${
                isActive
                  ? "border-[#d2ad55] bg-white shadow-[0_14px_34px_rgba(184,137,50,0.18)] ring-2 ring-[#d2ad55]/30"
                  : isEmpty
                    ? "border-slate-200/80 bg-white/45 hover:border-emerald-200 hover:bg-white/70"
                    : "border-emerald-200/80 bg-white/75 shadow-sm hover:border-emerald-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    Cart {slot.id}
                  </p>
                  <p className="mt-2 text-xl font-black text-slate-800">
                    {isEmpty ? "Empty" : `${slotItemCount} item${slotItemCount === 1 ? "" : "s"}`}
                  </p>
                </div>

                {isActive && (
                  <span className="rounded-full bg-[#b88932]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#9a6a13]">
                    Current
                  </span>
                )}
              </div>

              {!isEmpty && (
                <>
                  <p className="mt-4 text-2xl font-black text-[#b3263e]">
                    ${slotTotal.toFixed(2)}
                  </p>
                  <p className="mt-2 truncate text-xs font-semibold text-slate-500">
                    {snapshot.selectedMember
                      ? snapshot.selectedMember.name
                      : "Walk-in customer"}
                  </p>
                </>
              )}
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-200/70 bg-white/55 px-6 py-4 text-center text-xs font-semibold text-slate-400">
        F3 Search · F4 Carts · F10 Clear Current Cart · F12 Special Sale · Esc Close
      </div>
    </div>
  </div>
)}

{/* F3 Product Search */}
{showProductSearch && (
  <div
    className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/25 p-6 backdrop-blur-[3px]"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        setShowProductSearch(false);
        setSearch("");
      }
    }}
  >
    <div className="flex h-[620px] w-full max-w-[1050px] flex-col overflow-hidden rounded-[30px] border border-white/80 bg-[#fffaf0]/95 shadow-[0_30px_90px_rgba(15,23,42,0.30)] backdrop-blur-[30px]">

      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-emerald-200/60 bg-[linear-gradient(135deg,rgba(4,120,87,0.92),rgba(52,211,153,0.78))] px-8 py-5 text-white">
        <div>
          <p className="font-khmer text-sm text-white/75">
            ស្វែងរកទំនិញ
          </p>

          <h2 className="text-2xl font-bold">
            Product Search
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowProductSearch(false);
            setSearch("");
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 transition hover:bg-white/25"
          aria-label="Close product search"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Search */}
      <div className="shrink-0 border-b border-slate-200/70 bg-white/65 px-8 py-5">
        <form
          onSubmit={(event) => event.preventDefault()}
          className="mx-auto flex max-w-[900px] items-center rounded-[22px] border border-emerald-200/80 bg-white/80 px-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl"
        >
          <Search className="h-6 w-6 shrink-0 text-emerald-600" />

          <input
            autoFocus
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Barcode, product name or brand..."
            className="min-w-0 flex-1 bg-transparent px-4 py-4 text-base outline-none placeholder:text-slate-400"
          />

          <ScanBarcode className="h-6 w-6 shrink-0 text-slate-400" />
        </form>

        <p className="mx-auto mt-2 max-w-[900px] text-xs text-slate-400">
          F3 Product Search · ESC Close
        </p>
      </div>

      {/* Product list */}
      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto max-w-[980px]">
          {!search.trim() ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="text-center text-slate-400">
                <Search className="mx-auto h-12 w-12" />

                <p className="mt-4 text-lg font-bold text-slate-500">
                  Search for a product
                </p>

                <p className="mt-1 text-sm">
                  Enter barcode, name or brand
                </p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="text-center text-slate-400">
                <ScanBarcode className="mx-auto h-12 w-12" />

                <p className="mt-4 text-lg font-bold text-slate-500">
                  Product not found
                </p>

                <p className="mt-1 text-sm">
                  Try another barcode or product name
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    addScannedProduct(product);
                    setSearch("");
                    setShowProductSearch(false);
                  }}
                  className="flex w-full items-center gap-5 rounded-[22px] border border-white/80 bg-white/70 p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.07)] backdrop-blur-xl transition hover:border-emerald-300 hover:bg-emerald-50/70"
                >
                  <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-slate-100 bg-white">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <ScanBarcode className="h-8 w-8 text-slate-300" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-slate-800">
                      {product.name}
                    </p>

                    {product.brand && (
                      <p className="mt-1 truncate text-sm font-semibold text-slate-500">
                        {product.brand}
                      </p>
                    )}

                    <p className="mt-2 font-mono text-xs text-slate-400">
                      {product.barcode || `P-${product.id}`}
                    </p>
                  </div>

                  <div className="w-[90px] shrink-0 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Stock
                    </p>

                    <p
                      className={`mt-1 text-lg font-bold ${
                        product.stock > 0
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                    >
                      {product.stock}
                    </p>
                  </div>

                  <div className="w-[120px] shrink-0 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Price
                    </p>

                    <p className="mt-1 text-2xl font-black text-[#b88932]">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
      
{/* Delivery */}
      {showDeliveryModal && (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-slate-950/35 p-5 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDeliveryModal();
          }}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              saveDelivery();
            }}
            className="w-full max-w-[560px] overflow-hidden rounded-[28px] border border-emerald-200/70 bg-[#fffaf0]/95 shadow-[0_30px_80px_rgba(15,23,42,0.28)] backdrop-blur-[30px]"
          >
            <div className="flex items-center justify-between bg-[linear-gradient(135deg,rgba(4,120,87,0.90),rgba(52,211,153,0.78))] px-7 py-5 text-white">
              <div>
                <p className="font-khmer text-sm text-white/80">ការដឹកជញ្ជូន</p>
                <h2 className="mt-1 text-2xl font-bold">Delivery</h2>
                <p className="mt-1 text-sm text-white/75">ព័ត៌មានដឹកជញ្ជូនសម្រាប់ការលក់នេះ · Delivery details for this sale</p>
              </div>
              <button type="button" onClick={closeDeliveryModal} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-7">
              <div className="grid grid-cols-2 gap-4">
                <input value={deliveryName} onChange={(e) => setDeliveryName(e.target.value)} placeholder="ឈ្មោះអតិថិជន / Customer name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400" />
                <input value={deliveryPhone} onChange={(e) => setDeliveryPhone(e.target.value)} placeholder="លេខទូរស័ព្ទ / Phone number" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400" />
              </div>
              <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="អាសយដ្ឋានដឹកជញ្ជូន / Delivery address" rows={3} className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400" />
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">ថ្លៃដឹកជញ្ជូន / Delivery Fee (USD)</label>
                <input type="number" min="0" step="0.01" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} placeholder="1.50" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg font-bold outline-none focus:border-emerald-400" />
              </div>
              <textarea value={deliveryNote} onChange={(e) => setDeliveryNote(e.target.value)} placeholder="កំណត់ចំណាំ / Note (optional)" rows={2} className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-400" />

              <div className="flex gap-3 pt-2">
                {isDelivery && (
                  <button type="button" onClick={removeDelivery} className="rounded-full border border-red-200 px-5 py-3 font-semibold text-red-500">លុប / Remove</button>
                )}
                <button type="button" onClick={closeDeliveryModal} className="ml-auto rounded-full border border-slate-200 px-5 py-3 font-semibold text-slate-600">បោះបង់ / Cancel</button>
                <button type="submit" className="rounded-full bg-emerald-600 px-6 py-3 font-bold text-white">រក្សាទុក / Save Delivery</button>
              </div>
            </div>
          </form>
        </div>
      )}

{/* Member */}
      {showMemberModal && (
        <div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-slate-950/35 p-5 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeMemberModal();
          }}
        >
          <div className="w-full max-w-[560px] overflow-hidden rounded-[28px] border border-emerald-200/70 bg-[#fffaf0]/95 shadow-[0_30px_80px_rgba(15,23,42,0.28)] backdrop-blur-[30px]">
            <div className="bg-[linear-gradient(135deg,rgba(4,120,87,0.90),rgba(52,211,153,0.78))] px-7 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-khmer text-sm text-white/80">សមាជិក</p>
                  <h2 className="mt-1 text-2xl font-bold">Member</h2>
                  <p className="mt-1 text-sm text-white/75">ស្វែងរកតាមលេខទូរស័ព្ទ ឬឈ្មោះ · Search by phone number or name</p>
                </div>

                <button
                  type="button"
                  onClick={closeMemberModal}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 hover:bg-white/25"
                  aria-label="Close member"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void searchMembers();
                }}
                className="flex gap-3"
              >
                <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-emerald-200 bg-white px-4 shadow-sm">
                  <Search className="h-5 w-5 shrink-0 text-emerald-600" />
                  <input
                    autoFocus
                    type="text"
                    value={memberSearch}
                    onChange={(event) => setMemberSearch(event.target.value)}
                    placeholder="លេខទូរស័ព្ទ ឬឈ្មោះសមាជិក / Phone or member name"
                    className="min-w-0 flex-1 bg-transparent px-3 py-3.5 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={memberLoading}
                  className="rounded-2xl bg-emerald-600 px-5 font-bold text-white disabled:opacity-50"
                >
                  {memberLoading ? "កំពុងស្វែងរក…" : "ស្វែងរក / Search"}
                </button>
              </form>

              {memberError && (
                <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                  {memberError}
                </div>
              )}

              {memberResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {memberResults.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => {
                        setSelectedMember(member);
                        setShowMemberModal(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                        selectedMember?.id === member.id
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/40"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-slate-800">{member.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{member.phone}</p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">ពិន្ទុ / Points</p>
                        <p className="mt-1 text-xl font-black text-emerald-700">
                          {member.points.toLocaleString()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedMember && (
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">សមាជិកដែលបានជ្រើស / Selected member</p>
                    <p className="mt-1 font-bold text-slate-800">{selectedMember.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMember(null);
                      setMemberResults([]);
                      setMemberSearch("");
                    }}
                    className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-500"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="mt-5 border-t border-slate-200 pt-5">
                {!showNewMemberForm ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewMemberForm(true);
                      setMemberError("");
                      if (memberSearch.trim()) setNewMemberPhone(memberSearch.trim());
                    }}
                    className="w-full rounded-2xl border border-emerald-200 bg-white py-3.5 font-bold text-emerald-700 hover:bg-emerald-50"
                  >
                    + សមាជិកថ្មី / New Member
                  </button>
                ) : (
                  <div className="space-y-3 rounded-2xl border border-emerald-200 bg-white p-4">
                    <h3 className="font-bold text-slate-800">សមាជិកថ្មី / New Member</h3>
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(event) => setNewMemberName(event.target.value)}
                      placeholder="ឈ្មោះអតិថិជន / Customer name"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
                    />
                    <input
                      type="tel"
                      value={newMemberPhone}
                      onChange={(event) => setNewMemberPhone(event.target.value)}
                      placeholder="លេខទូរស័ព្ទ / Phone number"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewMemberForm(false);
                          setNewMemberName("");
                          setNewMemberPhone("");
                        }}
                        className="rounded-xl border border-slate-200 py-3 font-bold text-slate-600"
                      >
                        បោះបង់ / Cancel
                      </button>
                      <button
                        type="button"
                        disabled={memberLoading}
                        onClick={() => void createMember()}
                        className="rounded-xl bg-emerald-600 py-3 font-bold text-white disabled:opacity-50"
                      >
                        បង្កើត / Create
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KHQR payment */}
      {showKhqrPayment && (
        <div
          className="fixed inset-0 z-[270] flex items-center justify-center bg-slate-950/40 p-5 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && khqrState !== "paid") {
              closeKhqrPayment();
            }
          }}
        >
          <div className="w-full max-w-[520px] overflow-hidden rounded-[30px] border border-emerald-200/70 bg-white/95 shadow-[0_30px_90px_rgba(15,23,42,0.32)] backdrop-blur-[30px]">
            <div className="bg-[linear-gradient(135deg,rgba(4,120,87,0.92),rgba(52,211,153,0.80))] px-7 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-khmer text-sm text-white/75">ការទូទាត់តាម KHQR</p>
                  <h2 className="mt-1 text-2xl font-bold">KHQR Payment</h2>
                </div>

                <button
                  type="button"
                  onClick={closeKhqrPayment}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 transition hover:bg-white/25"
                  aria-label="Close KHQR payment"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-7">
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-400">Total</p>
                <p className="mt-1 text-4xl font-black text-emerald-700">${subtotal.toFixed(2)}</p>
                <p className="mt-1 text-sm font-semibold text-slate-400">{totalKHR.toLocaleString()} ៛</p>
              </div>

              <div className="mt-5 flex min-h-[310px] items-center justify-center rounded-[26px] border border-emerald-100 bg-emerald-50/45 p-5">
                {khqrState === "generating" && (
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
                    <p className="mt-4 font-bold text-slate-700">Generating KHQR…</p>
                  </div>
                )}

                {khqrState === "waiting" && khqrQrImage && (
                  <div className="text-center">
                    <div className="mx-auto w-fit rounded-[22px] border border-white bg-white p-3 shadow-lg">
                      <img
                        src={khqrQrImage}
                        alt={`KHQR payment ${khqrTranId}`}
                        className="h-[240px] w-[240px] object-contain"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-2 text-emerald-700">
                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                      <span className="font-bold">Waiting for payment…</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      Scan with ABA or another KHQR-supported banking app
                    </p>
                    {khqrTranId && (
                      <p className="mt-2 font-mono text-[11px] text-slate-400">Ref: {khqrTranId}</p>
                    )}
                  </div>
                )}

                {khqrState === "paid" && (
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl font-black text-emerald-700">
                      ✓
                    </div>
                    <h3 className="mt-4 text-2xl font-black text-emerald-700">Payment Successful</h3>
                    <p className="mt-2 text-slate-500">${subtotal.toFixed(2)} received by KHQR</p>
                    {khqrBankName && <p className="mt-1 text-sm font-semibold text-slate-500">{khqrBankName}</p>}
                    {khqrApprovalCode && (
                      <p className="mt-1 font-mono text-xs text-slate-400">Approval: {khqrApprovalCode}</p>
                    )}
                  </div>
                )}

                {khqrState === "error" && (
                  <div className="w-full text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl font-black text-red-500">!</div>
                    <h3 className="mt-4 text-lg font-bold text-slate-800">KHQR could not be generated</h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-red-500">{khqrError}</p>
                    <button
                      type="button"
                      onClick={() => void openKhqrPayment()}
                      className="mt-5 rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>

              {khqrState === "waiting" && (
                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs leading-5 text-slate-400">
                  The POS will verify the transaction with the server before marking this sale as paid.
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-3">
                {khqrState === "paid" ? (
                  <button
                    type="button"
                    onClick={finishKhqrSale}
                    className="rounded-2xl bg-emerald-600 px-5 py-4 text-lg font-bold text-white shadow-md hover:bg-emerald-700"
                  >
                    Done / New Sale
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={closeKhqrPayment}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {khqrQrString && (
                <input type="hidden" value={khqrQrString} readOnly aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cash payment */}
{showCashPayment && (
  <div
    className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/35 p-5 backdrop-blur-sm"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeCashPayment();
    }}
  >
    <div className="w-full max-w-[620px] overflow-hidden rounded-[30px] border border-emerald-200/70 bg-white/95 shadow-[0_30px_90px_rgba(15,23,42,0.30)] backdrop-blur-[30px]">

      {/* Header */}
      <div className="bg-[linear-gradient(135deg,rgba(4,120,87,0.90),rgba(52,211,153,0.78))] px-7 py-3 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-khmer text-sm text-white/75">
              ការទូទាត់សាច់ប្រាក់
            </p>

            <h2 className="mt-0.5 text-xl font-bold">
              Cash Payment
            </h2>
          </div>

          <button
            type="button"
            onClick={closeCashPayment}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/15 transition hover:bg-white/25"
            aria-label="Close cash payment"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-7 py-4">

        {/* Total */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-3">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="font-khmer text-xs text-slate-500">
                តម្លៃសរុប
              </p>

              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Total Amount
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-black text-emerald-700">
                ${subtotal.toFixed(2)}
              </p>

              <p className="mt-0.5 text-xs font-bold text-slate-400">
                {totalKHR.toLocaleString()} ៛
              </p>
            </div>
          </div>
        </div>

        {/* Received USD + KHR */}
        <div className="mt-3 grid grid-cols-2 gap-3">

          {/* USD */}
          <div>
            <div className="mb-1.5">
              <p className="font-khmer text-xs text-slate-500">
                ប្រាក់ទទួល ដុល្លារ
              </p>

              <label className="text-xs font-bold uppercase tracking-[0.10em] text-slate-500">
                Received USD
              </label>
            </div>

            <div className="relative">
              <input
                ref={cashUsdRef}
                type="number"
                min="0"
                step="0.01"
                value={receivedUSD}
                onChange={(event) => setReceivedUSD(event.target.value)}
                onKeyDown={handleCashKeyDown}
                placeholder="0.00"
                className="h-[54px] w-full rounded-2xl border-2 border-emerald-200 bg-white px-4 pr-12 text-right text-xl font-black text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                $
              </span>
            </div>

            <div className="mt-1.5 grid grid-cols-4 gap-1.5">
              {[10, 20, 50, 100].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  tabIndex={-1}
                  onClick={() => {
                    setReceivedUSD((current) =>
                      String((Number(current) || 0) + amount)
                    );

                    window.setTimeout(
                      () => cashKhrRef.current?.focus(),
                      0
                    );
                  }}
                  className="rounded-xl border border-emerald-100 bg-emerald-50 px-2 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          {/* KHR */}
          <div>
            <div className="mb-1.5">
              <p className="font-khmer text-xs text-slate-500">
                ប្រាក់ទទួល រៀល
              </p>

              <label className="text-xs font-bold uppercase tracking-[0.10em] text-slate-500">
                Received KHR
              </label>
            </div>

            <div className="relative">
              <input
                ref={cashKhrRef}
                type="number"
                min="0"
                step="100"
                value={receivedKHR}
                onChange={(event) => setReceivedKHR(event.target.value)}
                onKeyDown={handleCashKeyDown}
                placeholder="0"
                className="h-[54px] w-full rounded-2xl border-2 border-emerald-200 bg-white px-4 pr-12 text-right text-xl font-black text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ៛
              </span>
            </div>

            <div className="mt-1.5 grid grid-cols-4 gap-1.5">
              {[10000, 20000, 50000, 100000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  tabIndex={-1}
                  onClick={() => {
                    setReceivedKHR((current) =>
                      String((Number(current) || 0) + amount)
                    );

                    window.setTimeout(
                      () => cashKhrRef.current?.focus(),
                      0
                    );
                  }}
                  className="rounded-xl border border-emerald-100 bg-emerald-50 px-1 py-1.5 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-100"
                >
                  {amount.toLocaleString()}៛
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Remaining */}
        <div className="mt-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 px-4 py-2">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="font-khmer text-xs text-slate-500">
                ប្រាក់នៅខ្វះ
              </p>

              <p className="text-xs font-bold uppercase tracking-[0.10em] text-slate-600">
                Remaining
              </p>
            </div>

            <div className="text-right">
              <p
                className={`text-xl font-black ${
                  hasEnoughCash
                    ? "text-emerald-700"
                    : "text-amber-600"
                }`}
              >
                ${remainingUSD.toFixed(2)}
              </p>

              <p
                className={`text-xs font-bold ${
                  hasEnoughCash
                    ? "text-emerald-600"
                    : "text-amber-500"
                }`}
              >
                {remainingKHR.toLocaleString()} ៛
              </p>
            </div>
          </div>

          {!hasEnoughCash && remainingKHR > 0 && (
            <button
              type="button"
              onClick={() => {
                setReceivedKHR(
                  String(
                    Math.max(
                      0,
                      Math.round(
                        (subtotal - receivedUSDNumber) * KHR_RATE
                      )
                    )
                  )
                );

                window.setTimeout(
                  () => cashKhrRef.current?.focus(),
                  0
                );
              }}
              className="mt-2 w-full rounded-xl border border-amber-200 bg-white/70 px-4 py-2 text-xs font-bold text-amber-700 transition hover:bg-white"
            >
              Pay remaining{" "}
              {Math.max(
                0,
                Math.round(
                  (subtotal - receivedUSDNumber) * KHR_RATE
                )
              ).toLocaleString()}
              ៛
            </button>
          )}
        </div>

        {/* Change */}
        <div className="mt-3 border-t border-emerald-100 pt-3">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="font-khmer text-xs text-slate-500">
                ប្រាក់អាប់
              </p>

              <p className="text-sm font-bold uppercase tracking-[0.10em] text-slate-600">
                Change
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-black text-emerald-700">
                ${changeUSD.toFixed(2)}
              </p>

              <p className="mt-0.5 text-xs font-bold text-emerald-600">
                {changeKHR.toLocaleString()} ៛
              </p>
            </div>
          </div>
        </div>

        {/* Exchange info */}
        <div className="mt-3 rounded-xl bg-slate-50 px-4 py-2 text-center text-[11px] font-medium text-slate-400">
          Received total ≈ ${totalReceivedUSD.toFixed(2)}
          {" • "}
          Exchange rate: $1 = {KHR_RATE.toLocaleString()} ៛
        </div>

        {/* Buttons */}
        <div className="mt-3 grid grid-cols-[140px_1fr] gap-3">
          <button
            type="button"
            onClick={closeCashPayment}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!hasEnoughCash}
            onClick={completeCashPayment}
            className="rounded-2xl bg-emerald-600 px-5 py-3 text-base font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            Confirm Payment
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-slate-400">
          Enter USD and/or KHR • Press Enter to confirm • Esc to cancel
        </p>
      </div>
    </div>
  </div>
)}
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
