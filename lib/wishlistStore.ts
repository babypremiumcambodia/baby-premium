import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistItem = {
  id: number;
};

type WishlistStore = {
  items: WishlistItem[];

  toggleItem: (id: number) => void;

  isFavorite: (id: number) => boolean;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (id) => {
        const exists = get().items.some((item) => item.id === id);

        if (exists) {
          set({
            items: get().items.filter((item) => item.id !== id),
          });
        } else {
          set({
            items: [...get().items, { id }],
          });
        }
      },

      isFavorite: (id) =>
        get().items.some((item) => item.id === id),
    }),
    {
      name: "baby-premium-wishlist",
    }
  )
);