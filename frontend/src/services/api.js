const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('tpv_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Public
  getSettings: () => fetch(`${API_BASE}/settings`).then(r => r.json()),
  
  // Orders & Checkout
  createOrder: (data) => fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(async r => {
    if (!r.ok) throw new Error((await r.json()).detail || 'Failed to place order');
    return r.json();
  }),
  getOrderByNumber: (orderNumber) => fetch(`${API_BASE}/orders/${orderNumber}`).then(async r => {
    if (!r.ok) throw new Error((await r.json()).detail || 'Order not found');
    return r.json();
  }),

  // Abandoned Cart Telemetry
  recordAbandonedCart: (data) => fetch(`${API_BASE}/abandoned-carts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()).catch(() => {}),

  // Coupons
  validateCoupon: (code, cartValue) => fetch(`${API_BASE}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, cart_value: cartValue })
  }).then(r => r.json()),
  getProducts: () => fetch(`${API_BASE}/products`).then(r => r.json()),
  getProduct: (idOrCode) => fetch(`${API_BASE}/products/${idOrCode}`).then(r => r.json()),
  getCompareProducts: () => fetch(`${API_BASE}/products/compare`).then(r => r.json()),
  
  submitRetailQuote: (data) => fetch(`${API_BASE}/quotes/retail`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(async r => {
    if (!r.ok) throw new Error((await r.json()).detail || 'Failed to submit quote');
    return r.json();
  }),

  submitBulkQuote: (data) => fetch(`${API_BASE}/quotes/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(async r => {
    if (!r.ok) throw new Error((await r.json()).detail || 'Failed to submit bulk quote');
    return r.json();
  }),

  submitDistributorApp: (data) => fetch(`${API_BASE}/distributors/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(async r => {
    if (!r.ok) throw new Error((await r.json()).detail || 'Failed to submit application');
    return r.json();
  }),

  getDealers: (params = '') => fetch(`${API_BASE}/dealers${params}`).then(r => r.json()),
  
  getEvents: (limit) => fetch(`${API_BASE}/events${limit ? `?limit=${limit}` : ''}`).then(r => r.json()),
  getEvent: (slug) => fetch(`${API_BASE}/events/${slug}`).then(r => r.json()),

  getBlogPosts: (limit) => fetch(`${API_BASE}/blog${limit ? `?limit=${limit}` : ''}`).then(r => r.json()),
  getBlogPost: (slug) => fetch(`${API_BASE}/blog/${slug}`).then(r => r.json()),

  getGallery: () => fetch(`${API_BASE}/gallery`).then(r => r.json()),
  getTestimonials: (featured) => fetch(`${API_BASE}/testimonials${featured ? '?featured=true' : ''}`).then(r => r.json()),
  getFaqs: (category) => fetch(`${API_BASE}/faqs${category ? `?category=${category}` : ''}`).then(r => r.json()),
  getCertificates: () => fetch(`${API_BASE}/certificates`).then(r => r.json()),

  submitContact: (data) => fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(async r => {
    if (!r.ok) throw new Error((await r.json()).detail || 'Failed to send message');
    return r.json();
  }),

  search: (query) => fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`).then(r => r.json()),

  // Admin CMS Endpoints
  admin: {
    getStats: () => fetch(`${API_BASE}/quotes/stats`, { headers: getAuthHeaders() }).then(r => r.json()),

    // Account
    changePassword: (current_password, new_password) => fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ current_password, new_password })
    }).then(async r => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.detail || 'Failed to change password');
      return data;
    }),
    
    // Products
    getAllProducts: () => fetch(`${API_BASE}/products/all`, { headers: getAuthHeaders() }).then(r => r.json()),
    createProduct: (data) => fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    updateProduct: (id, data) => fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    deleteProduct: (id) => fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }),

    // Quotes
    getRetailQuotes: (status) => fetch(`${API_BASE}/quotes/retail${status ? `?status=${status}` : ''}`, { headers: getAuthHeaders() }).then(r => r.json()),
    updateRetailQuote: (id, data) => fetch(`${API_BASE}/quotes/retail/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),

    getBulkQuotes: (status) => fetch(`${API_BASE}/quotes/bulk${status ? `?status=${status}` : ''}`, { headers: getAuthHeaders() }).then(r => r.json()),
    updateBulkQuote: (id, data) => fetch(`${API_BASE}/quotes/bulk/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),

    // Distributors
    getDistributorApps: (status) => fetch(`${API_BASE}/distributors/applications${status ? `?status=${status}` : ''}`, { headers: getAuthHeaders() }).then(r => r.json()),
    updateDistributorApp: (id, data) => fetch(`${API_BASE}/distributors/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),

    // Dealers
    getAllDealers: () => fetch(`${API_BASE}/dealers/all`, { headers: getAuthHeaders() }).then(r => r.json()),
    createDealer: (data) => fetch(`${API_BASE}/dealers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    updateDealer: (id, data) => fetch(`${API_BASE}/dealers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    deleteDealer: (id) => fetch(`${API_BASE}/dealers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    }),

    // Content: Events, Blog, Gallery, Testimonials, FAQ, Certs, Messages
    getAllEvents: () => fetch(`${API_BASE}/events/all`, { headers: getAuthHeaders() }).then(r => r.json()),
    createEvent: (data) => fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    updateEvent: (id, data) => fetch(`${API_BASE}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    deleteEvent: (id) => fetch(`${API_BASE}/events/${id}`, { method: 'DELETE', headers: getAuthHeaders() }),

    getAllBlogPosts: () => fetch(`${API_BASE}/blog/all`, { headers: getAuthHeaders() }).then(r => r.json()),
    createBlogPost: (data) => fetch(`${API_BASE}/blog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    updateBlogPost: (id, data) => fetch(`${API_BASE}/blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    deleteBlogPost: (id) => fetch(`${API_BASE}/blog/${id}`, { method: 'DELETE', headers: getAuthHeaders() }),

    createGalleryAlbum: (data) => fetch(`${API_BASE}/gallery/albums`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    addGalleryPhoto: (data) => fetch(`${API_BASE}/gallery/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    deleteGalleryPhoto: (id) => fetch(`${API_BASE}/gallery/photos/${id}`, { method: 'DELETE', headers: getAuthHeaders() }),

    getAllTestimonials: () => fetch(`${API_BASE}/testimonials/all`, { headers: getAuthHeaders() }).then(r => r.json()),
    createTestimonial: (data) => fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    updateTestimonial: (id, data) => fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    deleteTestimonial: (id) => fetch(`${API_BASE}/testimonials/${id}`, { method: 'DELETE', headers: getAuthHeaders() }),

    getAllFaqs: () => fetch(`${API_BASE}/faqs/all`, { headers: getAuthHeaders() }).then(r => r.json()),
    createFaq: (data) => fetch(`${API_BASE}/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    updateFaq: (id, data) => fetch(`${API_BASE}/faqs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    deleteFaq: (id) => fetch(`${API_BASE}/faqs/${id}`, { method: 'DELETE', headers: getAuthHeaders() }),

    getAllCertificates: () => fetch(`${API_BASE}/certificates/all`, { headers: getAuthHeaders() }).then(r => r.json()),
    createCertificate: (data) => fetch(`${API_BASE}/certificates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    deleteCertificate: (id) => fetch(`${API_BASE}/certificates/${id}`, { method: 'DELETE', headers: getAuthHeaders() }),

    getContactMessages: () => fetch(`${API_BASE}/contact/messages`, { headers: getAuthHeaders() }).then(r => r.json()),
    updateContactMessage: (id, data) => fetch(`${API_BASE}/contact/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),

    // Settings
    updateSettings: (data) => fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),

    // E-Commerce Orders
    getOrders: (status, search) => {
      const params = new URLSearchParams();
      if (status) params.append('status_filter', status);
      if (search) params.append('search', search);
      return fetch(`${API_BASE}/orders?${params.toString()}`, { headers: getAuthHeaders() }).then(r => r.json());
    },
    updateOrder: (id, data) => fetch(`${API_BASE}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),

    // Abandoned Carts
    getAbandonedCarts: (status) => fetch(`${API_BASE}/abandoned-carts${status ? '?status_filter=' + status : ''}`, {
      headers: getAuthHeaders()
    }).then(r => r.json()),
    updateAbandonedCart: (id, data) => fetch(`${API_BASE}/abandoned-carts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),

    // Funnel & Business Analytics
    getFunnelAnalytics: () => fetch(`${API_BASE}/analytics/funnel`, { headers: getAuthHeaders() }).then(r => r.json()),

    // Centralized CRM Leads
    getCRMLeads: (source, status, search) => {
      const params = new URLSearchParams();
      if (source) params.append('source_filter', source);
      if (status) params.append('status_filter', status);
      if (search) params.append('search', search);
      return fetch(`${API_BASE}/crm/leads?${params.toString()}`, { headers: getAuthHeaders() }).then(r => r.json());
    },
    updateCRMLead: (sourceType, rawId, data) => fetch(`${API_BASE}/crm/leads/${sourceType}/${rawId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),

    // Users
    getUsers: () => fetch(`${API_BASE}/users`, { headers: getAuthHeaders() }).then(r => r.json()),
    createUser: (data) => fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    deleteUser: (id) => fetch(`${API_BASE}/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() }),
    setUserPassword: (id, new_password) => fetch(`${API_BASE}/users/${id}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ new_password })
    }).then(async r => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.detail || 'Failed to update password');
      return data;
    }),

    // Upload
    uploadFile: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      }).then(r => r.json());
    }
  }
};

