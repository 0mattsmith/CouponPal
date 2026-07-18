// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockCoupons = {
  // UK Sites
  'sportsdirect.com': [
    { id: '1', code: 'JUSTDOIT20', description: '20% off your entire order', discountType: 'percentage', discountValue: 20, successRate: 95 },
    { id: '2', code: 'FREESHIP', description: 'Free delivery on orders over £50', discountType: 'fixed', discountValue: 10, successRate: 100 },
    { id: '3', code: 'SAVE50', description: '£50 off orders over £200', discountType: 'fixed', discountValue: 50, successRate: 80 },
  ],
  'argos.co.uk': [
    { id: '4', code: 'ARGOS10', description: '10% off selected electronics', discountType: 'percentage', discountValue: 10, successRate: 70 },
    { id: '5', code: 'TECH15', description: '£15 off tech orders', discountType: 'fixed', discountValue: 15, successRate: 90 },
  ],
  'johnlewis.com': [
    { id: '6', code: 'FURNITURE15', description: '15% off living room furniture', discountType: 'percentage', discountValue: 15, successRate: 85 }
  ],
  'tesco.com': [
    { id: '7', code: 'FRESHPRODUCE', description: '£10 off groceries over £100', discountType: 'fixed', discountValue: 10, successRate: 95 }
  ],
  // US Sites
  'nike.com': [
    { id: '8', code: 'JUSTDOIT20', description: '20% off your entire order', discountType: 'percentage', discountValue: 20, successRate: 95 },
    { id: '9', code: 'FREESHIP', description: 'Free shipping on orders over $50', discountType: 'fixed', discountValue: 10, successRate: 100 },
  ],
  'amazon.com': [
    { id: '10', code: 'AMZN10', description: '10% off selected electronics', discountType: 'percentage', discountValue: 10, successRate: 70 },
  ],
  'ikea.com': [
    { id: '11', code: 'FURNITURE15', description: '15% off living room furniture', discountType: 'percentage', discountValue: 15, successRate: 85 }
  ],
  'wholefoods.com': [
    { id: '12', code: 'FRESHPRODUCE', description: '$10 off groceries over $100', discountType: 'fixed', discountValue: 10, successRate: 95 }
  ],
  // DE Sites
  'amazon.de': [
    { id: '13', code: 'AMZN10DE', description: '10% off selected electronics', discountType: 'percentage', discountValue: 10, successRate: 70 },
  ],
  'mediamarkt.de': [
    { id: '14', code: 'TECH15', description: '€15 off tech orders', discountType: 'fixed', discountValue: 15, successRate: 90 },
  ],
  // FR Sites
  'amazon.fr': [
    { id: '15', code: 'AMZN10FR', description: '10% off selected electronics', discountType: 'percentage', discountValue: 10, successRate: 70 },
  ],
  'fnac.com': [
    { id: '16', code: 'LIVRE5', description: '€5 off books', discountType: 'fixed', discountValue: 5, successRate: 85 },
  ],
  // IT Sites
  'amazon.it': [
    { id: '17', code: 'AMZN10IT', description: '10% off selected electronics', discountType: 'percentage', discountValue: 10, successRate: 70 },
  ],
  'unieuro.it': [
    { id: '18', code: 'SCONTO20', description: '20% off appliances', discountType: 'percentage', discountValue: 20, successRate: 80 },
  ],
  // RU Sites
  'mvideo.ru': [
    { id: '19', code: 'TECH10RU', description: '10% off electronics', discountType: 'percentage', discountValue: 10, successRate: 75 },
  ],
  'hoff.ru': [
    { id: '20', code: 'HOFF500', description: '₽500 off furniture orders over ₽5000', discountType: 'fixed', discountValue: 500, successRate: 90 },
  ]
};

const genericCoupons = [
  { id: 'g1', code: 'WELCOME10', description: '10% off first purchase', discountType: 'percentage', discountValue: 10, successRate: 99 },
  { id: 'g2', code: 'SUMMER5', description: '£5 off your order', discountType: 'fixed', discountValue: 5, successRate: 85 },
];

export const mockCategoriesByRegion = {
  EN: [
    {
      name: 'Sports & Outdoors',
      sites: ['sportsdirect.com', 'jdsports.co.uk', 'sweatybetty.com']
    },
    {
      name: 'Home & Furniture',
      sites: ['johnlewis.com', 'dunelm.com', 'habitat.co.uk']
    },
    {
      name: 'Groceries',
      sites: ['tesco.com', 'sainsburys.co.uk', 'waitrose.com']
    },
    {
      name: 'Electronics',
      sites: ['currys.co.uk', 'argos.co.uk', 'ao.com']
    }
  ],
  US: [
    {
      name: 'Sports & Outdoors',
      sites: ['nike.com', 'adidas.com', 'underarmour.com']
    },
    {
      name: 'Home & Furniture',
      sites: ['ikea.com', 'wayfair.com', 'homedepot.com']
    },
    {
      name: 'Groceries',
      sites: ['wholefoods.com', 'instacart.com', 'kroger.com']
    },
    {
      name: 'Electronics',
      sites: ['amazon.com', 'bestbuy.com', 'newegg.com']
    }
  ],
  DE: [
    {
      name: 'Sports & Outdoors',
      sites: ['adidas.de', 'puma.de', 'decathlon.de']
    },
    {
      name: 'Home & Furniture',
      sites: ['ikea.de', 'otto.de', 'wayfair.de']
    },
    {
      name: 'Groceries',
      sites: ['rewe.de', 'aldi-sued.de', 'edeka.de']
    },
    {
      name: 'Electronics',
      sites: ['mediamarkt.de', 'saturn.de', 'amazon.de']
    }
  ],
  FR: [
    {
      name: 'Sports & Outdoors',
      sites: ['decathlon.fr', 'go-sport.com', 'nike.com/fr']
    },
    {
      name: 'Home & Furniture',
      sites: ['ikea.fr', 'maisonsdumonde.com', 'conforama.fr']
    },
    {
      name: 'Groceries',
      sites: ['carrefour.fr', 'auchan.fr', 'leclerc.fr']
    },
    {
      name: 'Electronics',
      sites: ['fnac.com', 'darty.com', 'amazon.fr']
    }
  ],
  IT: [
    {
      name: 'Sports & Outdoors',
      sites: ['decathlon.it', 'cisalfasport.it', 'nencinisport.it']
    },
    {
      name: 'Home & Furniture',
      sites: ['ikea.it', 'mondoconvenienza.it', 'leroymerlin.it']
    },
    {
      name: 'Groceries',
      sites: ['esselunga.it', 'conad.it', 'coop.it']
    },
    {
      name: 'Electronics',
      sites: ['unieuro.it', 'mediaworld.it', 'amazon.it']
    }
  ],
  RU: [
    {
      name: 'Sports & Outdoors',
      sites: ['sportmaster.ru', 'decathlon.ru', 'kant.ru']
    },
    {
      name: 'Home & Furniture',
      sites: ['hoff.ru', 'leroymerlin.ru', 'ikea.ru']
    },
    {
      name: 'Groceries',
      sites: ['lenta.com', 'vprok.ru', 'vkusvill.ru']
    },
    {
      name: 'Electronics',
      sites: ['mvideo.ru', 'dns-shop.ru', 'citilink.ru']
    }
  ]
};

/**
 * Fetches mock coupons for a given domain.
 * @param {string} domain 
 * @returns {Promise<Array>} Array of coupon objects
 */
export const fetchCoupons = async (domain) => {
  await delay(1500); // simulate 1.5s network request
  
  const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  
  if (mockCoupons[cleanDomain]) {
    return mockCoupons[cleanDomain];
  }
  
  // Return generic coupons if specific domain not found
  return genericCoupons.map(c => ({...c, id: Math.random().toString(36).substring(7)}));
};

/**
 * Calculates potential savings for a coupon based on an estimated cart value
 * @param {Object} coupon 
 * @param {number} estimatedCartValue 
 * @returns {number} Estimated savings in dollars
 */
export const calculateSavings = (coupon, estimatedCartValue = 100) => {
  if (coupon.discountType === 'percentage') {
    return (coupon.discountValue / 100) * estimatedCartValue;
  }
  return coupon.discountValue; // Fixed amount
};

/**
 * Fetches full store details including coupons, stats, and mock comments.
 * @param {string} domain 
 * @returns {Promise<Object>} Store details object
 */
export const fetchStoreDetails = async (domain) => {
  const coupons = await fetchCoupons(domain);
  
  // Generate some mock comments based on the coupons
  const mockComments = coupons.map(c => ({
    id: Math.random().toString(36).substring(7),
    user: `User${Math.floor(Math.random() * 1000)}`,
    text: c.successRate > 80 ? 'Worked perfectly, saved me a lot!' : 'Did not work for my items.',
    timestamp: new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString(),
    couponCode: c.code
  }));

  // Average success rate
  const avgSuccessRate = coupons.reduce((acc, c) => acc + c.successRate, 0) / (coupons.length || 1);

  return {
    domain,
    coupons,
    stats: {
      averageSuccessRate: Math.round(avgSuccessRate),
      lastUsed: 'Just now',
      totalActiveCodes: coupons.length
    },
    comments: mockComments
  };
};
