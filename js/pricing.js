// ============================================
// SASH STUDIO - Pricing Logic
// Real-time price calculation
// ============================================

const PricingEngine = {
  // Default pricing configuration (can be overridden from database)
  config: {
    basePricePerSqm: 900,

    // Size multipliers - smaller windows cost more per sqm
    sizeMultipliers: [
      { maxSqm: 0.6, multiplier: 1.25 },
      { maxSqm: 1.0, multiplier: 1.0 },
      { maxSqm: 1.5, multiplier: 0.95 },
      { maxSqm: 2.0, multiplier: 0.9 },
      { maxSqm: 3.0, multiplier: 0.85 },
      { maxSqm: 999, multiplier: 0.8 }
    ],

    // Georgian bars pricing
    barPricing: {
      pricePerBar: 15,
      barsPerPattern: {
        '1over1': 0,
        '2over2': 4,    // 2 bars per sash x 2 sashes
        '4over4': 8,    // 4 bars per sash x 2 sashes
        '6over6': 10,   // 5 bars per sash x 2 sashes
        'custom': null
      }
    },

    // Glass options
    glassTypes: {
      'double': 0,
      'triple': 150,
      'passive': 250
    },

    // Glass finish
    glassFinish: {
      'clear': 0,
      'frosted': 80
    },

    // Glass specification
    glassSpec: {
      'toughened': 0,
      'laminated': 30  // per sqm
    },

    // Opening types
    openingTypes: {
      'both': 0,
      'bottom': -30,
      'fixed': -50
    },

    // Color surcharges
    colorSurcharges: {
      'white': 0,
      'cream': 0.05,
      'grey': 0.05,
      'black': 0.05,
      'green': 0.05,
      'oak': 0.20
    },

    // Security options
    security: {
      pas24: 0,       // Included
      keyLocks: 40
    },

    // Quantity discounts
    quantityDiscounts: [
      { minQty: 1, discount: 0 },
      { minQty: 6, discount: 0.05 },
      { minQty: 12, discount: 0.10 },
      { minQty: 24, discount: 0.15 }
    ],

    vatRate: 0.20
  },

  // Initialize and load config from database
  async init() {
    try {
      if (window.loadPricingConfig) {
        const dbConfig = await window.loadPricingConfig();
        if (dbConfig) {
          this.updateFromDatabase(dbConfig);
          console.log('Pricing config loaded from database');
        }
      }
    } catch (error) {
      console.warn('Using default pricing config:', error);
    }
  },

  // Update config from database values
  updateFromDatabase(dbConfig) {
    if (dbConfig.bar_price) {
      this.config.barPricing.pricePerBar = parseFloat(dbConfig.bar_price);
    }
    if (dbConfig.glass_triple_price) {
      this.config.glassTypes.triple = parseFloat(dbConfig.glass_triple_price);
    }
    if (dbConfig.glass_passive_price) {
      this.config.glassTypes.passive = parseFloat(dbConfig.glass_passive_price);
    }
    if (dbConfig.glass_frosted_price) {
      this.config.glassFinish.frosted = parseFloat(dbConfig.glass_frosted_price);
    }
    if (dbConfig.opening_bottom_price !== null) {
      this.config.openingTypes.bottom = -Math.abs(parseFloat(dbConfig.opening_bottom_price));
    }
    if (dbConfig.opening_fixed_price !== null) {
      this.config.openingTypes.fixed = -Math.abs(parseFloat(dbConfig.opening_fixed_price));
    }
  },

  // Get size multiplier based on square meters
  getSizeMultiplier(sqm) {
    for (const tier of this.config.sizeMultipliers) {
      if (sqm <= tier.maxSqm) {
        return tier.multiplier;
      }
    }
    return 0.8;
  },

  // Get quantity discount
  getQuantityDiscount(quantity) {
    let discount = 0;
    for (const tier of this.config.quantityDiscounts) {
      if (quantity >= tier.minQty) {
        discount = tier.discount;
      }
    }
    return discount;
  },

  // Calculate bars price
  calculateBarsPrice(style) {
    const barConfig = this.config.barPricing;
    const barCount = barConfig.barsPerPattern[style] || 0;
    return barCount * barConfig.pricePerBar;
  },

  // Main calculation function
  calculate(configuration) {
    const {
      width = 900,
      height = 1200,
      quantity = 1,
      style = '1over1',
      glassType = 'double',
      glassFinish = 'clear',
      color = 'white',
      opening = 'both',
      pas24 = false,
      laminated = false,
      keyLocks = false
    } = configuration;

    // Calculate area in square meters
    const sqm = (width / 1000) * (height / 1000);

    // 1. Base price with size multiplier
    const sizeMultiplier = this.getSizeMultiplier(sqm);
    const basePrice = this.config.basePricePerSqm * sqm * sizeMultiplier;

    // 2. Georgian bars
    const barsPrice = this.calculateBarsPrice(style);

    // 3. Glass type
    const glassTypePrice = this.config.glassTypes[glassType] || 0;

    // 4. Glass finish
    const glassFinishPrice = this.config.glassFinish[glassFinish] || 0;

    // 5. Laminated glass (per sqm)
    const laminatedPrice = laminated ? this.config.glassSpec.laminated * sqm : 0;

    // 6. Opening type
    const openingPrice = this.config.openingTypes[opening] || 0;

    // 7. Color surcharge
    const colorSurcharge = this.config.colorSurcharges[color] || 0;
    const colorPrice = basePrice * colorSurcharge;

    // 8. Security options
    const securityPrice = (keyLocks ? this.config.security.keyLocks : 0);

    // Calculate subtotal
    const optionsTotal = glassTypePrice + glassFinishPrice + laminatedPrice + openingPrice + securityPrice;
    const subtotal = basePrice + barsPrice + optionsTotal + colorPrice;

    // Apply quantity discount
    const discount = this.getQuantityDiscount(quantity);
    const discountAmount = subtotal * discount;
    const unitPrice = subtotal - discountAmount;

    // Total for all windows
    const totalPrice = unitPrice * quantity;

    // VAT
    const vatAmount = totalPrice * this.config.vatRate;
    const totalWithVat = totalPrice + vatAmount;

    return {
      // Individual prices
      basePrice: Math.round(basePrice * 100) / 100,
      barsPrice: barsPrice,
      glassPrice: glassTypePrice + glassFinishPrice + laminatedPrice,
      optionsPrice: openingPrice + securityPrice + colorPrice,

      // Totals
      subtotal: Math.round(subtotal * 100) / 100,
      discount: discount,
      discountAmount: Math.round(discountAmount * 100) / 100,
      unitPrice: Math.round(unitPrice * 100) / 100,
      totalPrice: Math.round(totalPrice * 100) / 100,
      vatAmount: Math.round(vatAmount * 100) / 100,
      totalWithVat: Math.round(totalWithVat * 100) / 100,

      // Meta
      sqm: Math.round(sqm * 100) / 100,
      sizeMultiplier: sizeMultiplier,
      quantity: quantity
    };
  },

  // Format price for display
  formatPrice(price, includeSymbol = true) {
    const formatted = Math.round(price).toLocaleString('en-GB');
    return includeSymbol ? `£${formatted}` : formatted;
  }
};

// Initialize pricing on load
document.addEventListener('DOMContentLoaded', () => {
  PricingEngine.init();
});

// Export
window.PricingEngine = PricingEngine;
