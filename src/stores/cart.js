import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items.find(
        (item) => item.productId === product.id
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            weight: product.weight,
            quantity,
            checked: true,
            cartId: product.cartId,
          },
        ],
      };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      ),
    })),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),

  toggleItem: (productId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId
          ? { ...item, checked: !item.checked }
          : item
      ),
    })),

  toggleAll: (checked) =>
    set((state) => ({
      items: state.items.map((item) => ({ ...item, checked })),
    })),

  removeSelected: () =>
    set((state) => ({
      items: state.items.filter((item) => !item.checked),
    })),

  clear: () => set({ items: [] }),

  getSummary: () => {
    const items = get().items;
    const selected = items.filter((i) => i.checked);

    const productAmount = selected.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const qty = typeof item.quantity === 'number' ? item.quantity : 1;
      return sum + price * qty;
    }, 0);

    const shippingFee = 0;
    const totalAmount = productAmount;

    return {
      productAmount,
      shippingFee,
      totalAmount,
      selectedCount: selected.length,
      totalCount: items.length,
    };
  },
}));
