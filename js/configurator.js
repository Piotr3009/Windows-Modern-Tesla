// ============================================
// SASH STUDIO - Configurator Controller
// Tesla-Style Main configurator logic and UI interactions
// ============================================

const Configurator = {
  // Current configuration state
  config: {
    width: 900,
    height: 1200,
    quantity: 1,
    style: '1over1',
    glassType: 'double',
    glassFinish: 'clear',
    color: 'white',
    hardware: 'brass',
    opening: 'both',
    pas24: false,
    laminated: false,
    keyLocks: false
  },

  // Color names for display
  colorNames: {
    white: 'Pure White',
    cream: 'Cream',
    grey: 'Anthracite Grey',
    black: 'Black',
    green: 'Heritage Green',
    oak: 'Natural Oak'
  },

  // Style names for display
  styleNames: {
    '1over1': '1 over 1',
    '2over2': '2 over 2',
    '4over4': '4 over 4',
    '6over6': '6 over 6'
  },

  // Initialize configurator
  init() {
    console.log('Initializing Tesla-style configurator...');

    // Wait for other modules to load
    setTimeout(() => {
      this.bindEvents();
      this.updateSliderFill();
      this.updatePrice();
      this.updateSummary();
    }, 100);
  },

  // Bind all event listeners
  bindEvents() {
    // Size sliders
    const widthSlider = document.getElementById('widthSlider');
    const heightSlider = document.getElementById('heightSlider');

    if (widthSlider) {
      widthSlider.addEventListener('input', (e) => this.handleSizeChange('width', e.target.value));
    }

    if (heightSlider) {
      heightSlider.addEventListener('input', (e) => this.handleSizeChange('height', e.target.value));
    }

    // Quantity buttons
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');

    if (qtyMinus) {
      qtyMinus.addEventListener('click', () => this.handleQuantityChange(-1));
    }

    if (qtyPlus) {
      qtyPlus.addEventListener('click', () => this.handleQuantityChange(1));
    }

    // Style options
    document.querySelectorAll('.style-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const style = e.currentTarget.dataset.style;
        this.handleStyleChange(style);
      });
    });

    // Glass type options (radio buttons)
    document.querySelectorAll('.radio-option[data-glass]').forEach(option => {
      option.addEventListener('click', (e) => {
        const glass = e.currentTarget.dataset.glass;
        this.handleGlassChange(glass);
      });
    });

    // Glass finish options (clear/frosted buttons)
    document.querySelectorAll('.finish-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const finish = e.currentTarget.dataset.finish;
        this.handleGlassFinishChange(finish);
      });
    });

    // Color options (button swatches)
    document.querySelectorAll('.color-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const color = e.currentTarget.dataset.color;
        this.handleColorChange(color);
      });
    });

    // Hardware options (button swatches)
    document.querySelectorAll('.hardware-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const hardware = e.currentTarget.dataset.hardware;
        this.handleHardwareChange(hardware);
      });
    });

    // Opening type options (radio buttons)
    document.querySelectorAll('.radio-option[data-opening]').forEach(option => {
      option.addEventListener('click', (e) => {
        const opening = e.currentTarget.dataset.opening;
        this.handleOpeningChange(opening);
      });
    });

    // Security toggles
    const pas24Toggle = document.getElementById('pas24Toggle');
    const laminatedToggle = document.getElementById('laminatedToggle');
    const keyLocksToggle = document.getElementById('keyLocksToggle');

    if (pas24Toggle) {
      pas24Toggle.addEventListener('change', (e) => {
        this.config.pas24 = e.target.checked;
        this.updatePrice();
      });
    }

    if (laminatedToggle) {
      laminatedToggle.addEventListener('change', (e) => {
        this.config.laminated = e.target.checked;
        this.updatePrice();
      });
    }

    if (keyLocksToggle) {
      keyLocksToggle.addEventListener('change', (e) => {
        this.config.keyLocks = e.target.checked;
        this.updatePrice();
      });
    }

    // View controls
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        // Could add view switching logic here
      });
    });

    // Get Quote button
    const quoteBtn = document.getElementById('getQuoteBtn');
    if (quoteBtn) {
      quoteBtn.addEventListener('click', () => this.handleGetQuote());
    }

    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.handleLogin());
    }
  },

  // Update slider fill (visual progress with gold accent)
  updateSliderFill() {
    const sliders = document.querySelectorAll('.range-slider');
    sliders.forEach(slider => {
      const updateFill = () => {
        const min = slider.min || 0;
        const max = slider.max || 100;
        const value = slider.value;
        const percent = ((value - min) / (max - min)) * 100;
        slider.style.background = `linear-gradient(to right, #C9A227 0%, #C9A227 ${percent}%, #1A1A1D ${percent}%, #1A1A1D 100%)`;
      };
      updateFill();
      slider.addEventListener('input', updateFill);
    });
  },

  // Handle size changes
  handleSizeChange(dimension, value) {
    value = parseInt(value);
    this.config[dimension] = value;

    // Update display
    const displayEl = document.getElementById(`${dimension}Value`);
    if (displayEl) {
      displayEl.textContent = `${value}mm`;
    }

    // Update visualizer
    if (window.WindowVisualizer) {
      window.WindowVisualizer.setDimensions(this.config.width, this.config.height);
    }

    this.updatePrice();
    this.updateSummary();
  },

  // Handle quantity changes
  handleQuantityChange(delta) {
    const newQty = Math.max(1, Math.min(100, this.config.quantity + delta));
    this.config.quantity = newQty;

    const qtyValue = document.getElementById('qtyValue');
    if (qtyValue) {
      qtyValue.textContent = newQty;
    }

    // Update minus button state
    const qtyMinus = document.getElementById('qtyMinus');
    if (qtyMinus) {
      qtyMinus.disabled = newQty <= 1;
    }

    this.updatePrice();
    this.updateSummary();
  },

  // Handle style changes
  handleStyleChange(style) {
    this.config.style = style;

    // Update UI
    document.querySelectorAll('.style-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.style === style);
    });

    // Update 3D window
    if (window.Window3D && window.Window3D.isInitialized) {
      window.Window3D.setStyle(style);
    }

    // Update SVG visualizer (fallback)
    if (window.WindowVisualizer) {
      window.WindowVisualizer.setStyle(style);
      window.WindowVisualizer.animateChange();
    }

    this.updatePrice();
    this.updateSummary();
  },

  // Handle glass type changes
  handleGlassChange(glass) {
    this.config.glassType = glass;

    // Update UI - handle radio options
    document.querySelectorAll('.radio-option[data-glass]').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.glass === glass);
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = opt.dataset.glass === glass;
      }
    });

    this.updatePrice();
  },

  // Handle glass finish changes
  handleGlassFinishChange(finish) {
    this.config.glassFinish = finish;

    // Update UI - finish options
    document.querySelectorAll('.finish-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.finish === finish);
    });

    // Update 3D window
    if (window.Window3D && window.Window3D.isInitialized) {
      window.Window3D.setGlassFinish(finish);
    }

    // Update SVG visualizer (fallback)
    if (window.WindowVisualizer) {
      window.WindowVisualizer.setGlassFinish(finish);
    }

    this.updatePrice();
  },

  // Handle color changes
  handleColorChange(color) {
    this.config.color = color;

    // Update UI - color options
    document.querySelectorAll('.color-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.color === color);
    });

    // Update color name display
    const colorNameEl = document.getElementById('colorName');
    if (colorNameEl) {
      colorNameEl.textContent = this.colorNames[color] || color;
    }

    // Update 3D window
    if (window.Window3D && window.Window3D.isInitialized) {
      window.Window3D.setFrameColor(color);
    }

    // Update SVG visualizer (fallback)
    if (window.WindowVisualizer) {
      window.WindowVisualizer.setColor(color);
      window.WindowVisualizer.animateChange();
    }

    this.updatePrice();
    this.updateSummary();
  },

  // Handle hardware changes
  handleHardwareChange(hardware) {
    this.config.hardware = hardware;

    // Update UI - hardware options
    document.querySelectorAll('.hardware-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.hardware === hardware);
    });

    // Update 3D window
    if (window.Window3D && window.Window3D.isInitialized) {
      window.Window3D.setHardwareColor(hardware);
    }

    // Update SVG visualizer (fallback)
    if (window.WindowVisualizer) {
      window.WindowVisualizer.setHardware(hardware);
    }
  },

  // Handle opening type changes
  handleOpeningChange(opening) {
    this.config.opening = opening;

    // Update UI - handle radio options
    document.querySelectorAll('.radio-option[data-opening]').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.opening === opening);
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = opt.dataset.opening === opening;
      }
    });

    this.updatePrice();
  },

  // Update price display
  updatePrice() {
    if (!window.PricingEngine) {
      console.warn('PricingEngine not loaded');
      return;
    }

    const pricing = window.PricingEngine.calculate(this.config);

    // Update price elements with animation
    this.animatePriceUpdate('basePrice', pricing.basePrice);
    this.animatePriceUpdate('glassPrice', pricing.glassPrice);
    this.animatePriceUpdate('optionsPrice', pricing.optionsPrice + pricing.barsPrice);

    // Update total with special animation
    const totalEl = document.getElementById('totalPrice');
    if (totalEl) {
      const newTotal = window.PricingEngine.formatPrice(pricing.unitPrice);
      const currentTotal = totalEl.textContent;

      if (newTotal !== currentTotal) {
        totalEl.classList.add('updating');
        totalEl.textContent = newTotal;

        setTimeout(() => {
          totalEl.classList.remove('updating');
        }, 400);
      }
    }

    // Store current pricing
    this.currentPricing = pricing;
  },

  // Animate price element update
  animatePriceUpdate(elementId, value) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const formatted = window.PricingEngine.formatPrice(value);
    if (el.textContent !== formatted) {
      el.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
      el.style.opacity = '0.5';
      el.style.transform = 'translateY(-2px)';

      setTimeout(() => {
        el.textContent = formatted;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 150);
    }
  },

  // Update configuration summary
  updateSummary() {
    const summaryEl = document.getElementById('configSummary');
    if (!summaryEl) return;

    const summary = `${this.config.width} x ${this.config.height}mm • ${this.styleNames[this.config.style]} • ${this.colorNames[this.config.color]}`;
    summaryEl.textContent = summary;
  },

  // Handle Get Quote button
  async handleGetQuote() {
    const user = window.getCurrentUser ? await window.getCurrentUser() : null;

    if (!user) {
      // Show login prompt
      this.showLoginModal();
      return;
    }

    // Save estimate
    await this.saveEstimate();
  },

  // Show login modal
  showLoginModal() {
    // Simple alert for now - could be replaced with a proper modal
    const email = prompt('Please enter your email to receive a quote:');

    if (email && this.validateEmail(email)) {
      alert(`Thank you! We'll send your quote for the ${this.config.width}x${this.config.height}mm ${this.styleNames[this.config.style]} window to ${email}`);
      this.saveEstimateAnonymous(email);
    } else if (email) {
      alert('Please enter a valid email address.');
    }
  },

  // Handle login button
  handleLogin() {
    // Simple prompt for demo
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');

    if (email && password) {
      window.signIn(email, password).then(result => {
        if (result.error) {
          alert('Login failed: ' + result.error.message);
        } else {
          alert('Logged in successfully!');
          document.getElementById('loginBtn').textContent = 'Account';
        }
      });
    }
  },

  // Validate email
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  // Save estimate for logged in user
  async saveEstimate() {
    const estimateData = {
      configuration: this.config,
      pricing: this.currentPricing,
      status: 'draft'
    };

    const result = await window.saveEstimate(estimateData);

    if (result.error) {
      alert('Error saving estimate. Please try again.');
    } else {
      alert('Quote saved! Check your dashboard for details.');
    }
  },

  // Save estimate for anonymous user
  async saveEstimateAnonymous(email) {
    if (!window.supabaseClient) return;

    try {
      await window.supabaseClient
        .from('quote_requests')
        .insert([{
          email: email,
          configuration: this.config,
          pricing: this.currentPricing,
          created_at: new Date().toISOString()
        }]);

      console.log('Anonymous quote saved');
    } catch (error) {
      console.error('Error saving anonymous quote:', error);
    }
  },

  // Get current configuration
  getConfig() {
    return { ...this.config };
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Configurator.init();
});

// Export
window.Configurator = Configurator;
