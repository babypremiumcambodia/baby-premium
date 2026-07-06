import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => boolean;
  increaseItem: (id: number) => boolean;
  decreaseItem: (id: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);

        if (existing && existing.quantity >= existing.stock) {
          return false;
        }

        set((state) => {
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });

        return true;
      },

      increaseItem: (id) => {
        const item = get().items.find((i) => i.id === id);

        if (!item || item.quantity >= item.stock) {
          return false;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }));

        return true;
      },

      decreaseItem: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.max(1, i.quantity - 1) }
              : i
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "baby-premium-cart",
    }
  )
);