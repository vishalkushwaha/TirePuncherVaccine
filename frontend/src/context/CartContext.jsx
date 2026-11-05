import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('tpv_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [customerContact, setCustomerContact] = useState(() => {
    try {
      const saved = localStorage.getItem('tpv_customer_contact');
      return saved ? JSON.parse(saved) : { name: '', phone: '', email: '' };
    } catch (e) {
      return { name: '', phone: '', email: '' };
    }
  });

  // Unique session ID for abandoned cart recovery telemetry
  const [cartSessionId] = useState(() => {
    let sid = localStorage.getItem('tpv_cart_session_id');
    if (!sid) {
      sid = 'CS-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
      localStorage.setItem('tpv_cart_session_id', sid);
    }
    return sid;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tpv_cart', JSON.stringify(cartItems));
    } catch (e) {}

    // Abandoned Cart Telemetry (sync with backend in background)
    if (cartItems.length > 0) {
      const subtotal = cartItems.reduce((acc, item) => acc + (item.mrp * item.quantity), 0);
      api.recordAbandonedCart({
        cart_session_id: cartSessionId,
        customer_name: customerContact.name || null,
        phone: customerContact.phone || null,
        email: customerContact.email || null,
        items_json: JSON.stringify(cartItems),
        cart_value: subtotal,
        step_reached: 'Cart'
      });
    }
  }, [cartItems, cartSessionId, customerContact]);

  const addToCart = (product, quantity = 1, openDrawer = true) => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    setCartItems(prev => {
      const existing = prev.find(item => item.code === product.code);
      if (existing) {
        return prev.map(item =>
          item.code === product.code
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          code: product.code,
          name_en: product.name_en,
          name_hi: product.name_hi,
          mrp: product.mrp,
          image_url: product.image_url || '/assets/logo.png',
          tyre_type: product.tyre_type,
          pack_size: product.pack_size || '1 Litre',
          quantity: qty
        }
      ];
    });

    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const updateQuantity = (code, delta) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.code === code) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (code) => {
    setCartItems(prev => prev.filter(item => item.code !== code));
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('tpv_cart');
    } catch (e) {}
  };

  const saveContactForRecovery = (contactData) => {
    setCustomerContact(prev => {
      const next = { ...prev, ...contactData };
      try {
        localStorage.setItem('tpv_customer_contact', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.mrp * item.quantity), 0);

  const value = {
    cartItems,
    cartCount,
    cartSubtotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSessionId,
    customerContact,
    saveContactForRecovery
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

