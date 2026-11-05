import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const ShopConfigContext = createContext();

export function ShopConfigProvider({ children }) {
  const [settings, setSettings] = useState({
    business_mode: 'quotation',
    ecommerce_enabled: 'false',
    allow_add_to_cart: 'false',
    allow_buy_now: 'false',
    allow_guest_checkout: 'false',
    allow_customer_registration: 'false',
    enable_cod: 'false',
    enable_online_payment: 'false',
    enable_coupons: 'false',
    enable_abandoned_cart_tracking: 'true',
    enable_order_tracking: 'true',
    enable_returns_refunds: 'false',
    free_shipping_threshold: '1999',
    default_shipping_fee: '99',
    support_phone: '+91 74130 59364',
    dispatch_warehouse: 'Rani Bazar, Industrial Area, Bikaner, Rajasthan'
  });
  const [loading, setLoading] = useState(true);

  const loadConfig = () => {
    api.getSettings()
      .then(data => {
        if (data && typeof data === 'object') {
          setSettings(prev => ({ ...prev, ...data }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const businessMode = settings.business_mode || 'hybrid';
  const isMasterEcommerce = settings.ecommerce_enabled === 'true';

  // Derived Business Rules
  // Mode A: Quotation Only -> e-commerce is OFF
  // Mode B: Complete E-commerce -> e-commerce is ON, full shopping
  // Mode C: Hybrid -> retail e-commerce is ON, wholesale quotation is ON
  const isEcommerceEnabled = isMasterEcommerce && (businessMode === 'ecommerce' || businessMode === 'hybrid');
  const isQuotationEnabled = businessMode === 'quotation' || businessMode === 'hybrid';
  const isHybridMode = businessMode === 'hybrid';

  const allowAddToCart = isEcommerceEnabled && settings.allow_add_to_cart === 'true';
  const allowBuyNow = isEcommerceEnabled && settings.allow_buy_now === 'true';
  const allowGuestCheckout = settings.allow_guest_checkout === 'true';
  const enableCod = settings.enable_cod === 'true';
  const enableOnlinePayment = settings.enable_online_payment === 'true';
  const enableCoupons = settings.enable_coupons === 'true';
  const freeShippingThreshold = parseFloat(settings.free_shipping_threshold || '1999');
  const defaultShippingFee = parseFloat(settings.default_shipping_fee || '99');

  const value = {
    settings,
    loading,
    refreshConfig: loadConfig,
    businessMode,
    isEcommerceEnabled,
    isQuotationEnabled,
    isHybridMode,
    allowAddToCart,
    allowBuyNow,
    allowGuestCheckout,
    enableCod,
    enableOnlinePayment,
    enableCoupons,
    freeShippingThreshold,
    defaultShippingFee,
    supportPhone: settings.support_phone || '+91 74130 59364',
    dispatchWarehouse: settings.dispatch_warehouse || 'Rani Bazar, Bikaner'
  };

  return (
    <ShopConfigContext.Provider value={value}>
      {children}
    </ShopConfigContext.Provider>
  );
}

export function useShopConfig() {
  const ctx = useContext(ShopConfigContext);
  if (!ctx) throw new Error('useShopConfig must be used within ShopConfigProvider');
  return ctx;
}

