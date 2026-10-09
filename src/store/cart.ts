import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "../types";

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setCoupon: (code: string | null) => void;
}

const initialState = { items: [], couponCode: null };

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      ...initialState,
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === product.id,
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                quantity: 1,
                unitPriceSnapshot: product.unitPrice,
                availability: product.availability,
                requiresPrescription: product.requiresPrescription,
              },
            ],
          };
        }),
      updateQuantity: (productId, delta) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      clearCart: () => set({ items: [], couponCode: null }),
      setCoupon: (code) => set({ couponCode: code }),
    }),
    {
      name: "oshudh-cart",
    },
  ),
);

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce(
    (sum, item) => sum + item.unitPriceSnapshot * item.quantity,
    0,
  );
}

export function getCartDiscount(subtotal: number, couponCode: string | null) {
  if (!couponCode) return 0;
  const code = couponCode.toUpperCase();
  if (code === "SAVE10") return Math.round((subtotal * 10) / 100);
  if (code === "WELCOME25") return Math.min(250, subtotal);
  return 0;
}

export function getCartDeliveryFee(subtotal: number) {
  return subtotal > 1500 ? 0 : 90;
}
