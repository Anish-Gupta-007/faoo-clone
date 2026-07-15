import api from '@/lib/axios';

export interface ShopifyProductWithMeta {
  id: string
  title: string
  handle: string
  tags: string[]
  description: string
  isAvailable?: boolean
  focusImages: string[]
  focusTitles: string[]
  irlImages: string[]
  irlHandles: string[]
  fitType?: string
  sizeChartUrl?: string
  sizeChart2Url?: string
  supportsAllSizes?: boolean
  productVideo?: string
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
  }
  images: { edges: { node: { url: string; altText: string | null } }[] }
  variants: {
    edges?: {
      node: {
        id: string
        title: string
        availableForSale: boolean
        quantityAvailable?: number
        stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock'
        price: { amount: string; currencyCode: string }
      }
    }[]
  } | any[]
}


export interface ShopifyAnnouncement {
  id: string
  text: string
  couponCode: string | null
  active: boolean
}

export interface ShopifyBlog {
  handle: string
  type: string
  [key: string]: any // For dynamic metafield keys like title, content, image, etc.
}

export const shopifyService = {
  // --- COLLECTIONS ---
  getCollections: async (limit: number = 50) => {
    const res = await api.get(`/shop/collections?limit=${limit}`);
    return res.data;
  },

  getCollectionByHandle: async (handle: string) => {
    const res = await api.get(`/shop/collections/${handle}`);
    return res.data;
  },

  // --- PRODUCTS ---
  getProducts: async (limit: number = 20) => {
    const res = await api.get(`/shop/products?limit=${limit}`);
    return res.data;
  },

  getProductByHandle: async (handle: string) => {
    const res = await api.get(`/shop/products/${handle}`);
    return res.data;
  },

  // --- BLOGS ---
  getBlogs: async (limit: number = 20) => {
    const res = await api.get(`/shop/blogs?limit=${limit}`);
    return res.data;
  },

  getBlogByHandle: async (handle: string) => {
    const res = await api.get(`/shop/blogs/${handle}`);
    return res.data;
  },

  // --- CART ---
  createCart: async (lines: { merchandiseId: string; quantity: number }[]) => {
    const res = await api.post('/shop/cart/create', { lines });
    return res.data;
  },

  getCart: async (cartId: string) => {
    const res = await api.get(`/shop/cart/${encodeURIComponent(cartId)}`);
    return res.data;
  },

  addToCart: async (cartId: string, lines: { merchandiseId: string; quantity: number }[]) => {
    const res = await api.post(`/shop/cart/${encodeURIComponent(cartId)}/add`, { lines });
    return res.data;
  },

  removeFromCart: async (cartId: string, lineIds: string[]) => {
    const res = await api.delete(`/shop/cart/${encodeURIComponent(cartId)}/remove`, { data: { lineIds } });
    return res.data;
  },

  updateCartLine: async (cartId: string, lines: { id: string; quantity: number }[]) => {
    const res = await api.put(`/shop/cart/${encodeURIComponent(cartId)}/update`, { lines });
    return res.data;
  },

  // --- ORDERS ---
  getOrders: async (limit: number = 20) => {
    const res = await api.get(`/shop/orders?limit=${limit}`);
    return res.data;
  },

  getOrderById: async (id: string) => {
    const res = await api.get(`/shop/orders/${id}`);
    return res.data;
  },

  // --- RETURNS ---
  createReturn: async (orderId: string, lineItems: any[]) => {
    const res = await api.post('/shop/returns', { orderId, lineItems });
    return res.data;
  },

  getReturnById: async (returnId: string) => {
    const res = await api.get(`/shop/returns/${returnId}`);
    return res.data;
  },

  // --- ANNOUNCEMENTS ---
  getAnnouncements: async () => {
    const res = await api.get('/shop/announcements');
    return res.data;
  },

  // --- HOMEPAGE VIDEOS ---
  getHomepageVideos: async () => {
    const res = await api.get('/shop/homepage-videos');
    return res.data;
  },

  // --- DISCOUNTS ---
  applyDiscountCode: async (cartId: string, discountCode: string) => {
    const res = await api.post(`/shop/cart/${encodeURIComponent(cartId)}/discount`, { discountCode });
    return res.data;
  }
};
