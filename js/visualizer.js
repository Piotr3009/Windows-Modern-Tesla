// ============================================
// SASH STUDIO - Window Visualizer
// Dynamic SVG window rendering
// ============================================

const WindowVisualizer = {
  // SVG element references
  elements: {
    svg: null,
    frameOuter: null,
    upperSashFrame: null,
    lowerSashFrame: null,
    meetingRail: null,
    upperBars: null,
    lowerBars: null,
    hardwareLock: null,
    frostedOverlay: null,
    upperSashBg: null,
    lowerSashBg: null
  },

  // Current state
  state: {
    width: 900,
    height: 1200,
    style: '1over1',
    color: '#FFFFFF',
    glassFinish: 'clear',
    hardwareColor: '#D4A84B'
  },

  // Color mapping
  colors: {
    white: '#FFFFFF',
    cream: '#FFF8E7',
    grey: '#383E42',
    black: '#1D1D1F',
    green: '#2D5A3D',
    oak: '#8B6914'
  },

  // Hardware colors
  hardwareColors: {
    brass: '#D4A84B',
    chrome: '#C0C0C0',
    satin: '#A8A8A8',
    black: '#1D1D1F',
    bronze: '#8B5A2B'
  },

  // Initialize visualizer
  init() {
    this.elements.svg = document.getElementById('windowSVG');
    this.elements.frameOuter = document.getElementById('frameOuter');
    this.elements.upperSashFrame = document.getElementById('upperSashFrame');
    this.elements.lowerSashFrame = document.getElementById('lowerSashFrame');
    this.elements.meetingRail = document.getElementById('meetingRail');
    this.elements.upperBars = document.getElementById('upperBars');
    this.elements.lowerBars = document.getElementById('lowerBars');
    this.elements.hardwareLock = document.getElementById('hardwareLock');
    this.elements.frostedOverlay = document.getElementById('frostedOverlay');
    this.elements.upperSashBg = document.getElementById('upperSashBg');
    this.elements.lowerSashBg = document.getElementById('lowerSashBg');

    // Set initial state
    this.updateBars(this.state.style);

    console.log('Window visualizer initialized');
  },

  // Update frame color
  setColor(colorKey) {
    const color = this.colors[colorKey] || this.colors.white;
    this.state.color = color;

    // Animate color transition
    const elements = [
      this.elements.frameOuter,
      this.elements.upperSashFrame,
      this.elements.lowerSashFrame,
      this.elements.meetingRail
    ];

    elements.forEach(el => {
      if (el) {
        el.style.transition = 'fill 0.5s ease, stroke 0.5s ease';
        if (el.id === 'frameOuter') {
          el.setAttribute('fill', color);
          el.setAttribute('stroke', color);
        } else {
          el.setAttribute('stroke', color);
          if (el.id === 'meetingRail') {
            el.setAttribute('fill', color);
          }
        }
      }
    });

    // Update bars color
    if (this.elements.upperBars) {
      this.elements.upperBars.setAttribute('stroke', color);
    }
    if (this.elements.lowerBars) {
      this.elements.lowerBars.setAttribute('stroke', color);
    }
  },

  // Update glazing bar pattern
  setStyle(style) {
    this.state.style = style;
    this.updateBars(style);
  },

  // Generate bars SVG for a specific pattern
  updateBars(style) {
    const upperBars = this.elements.upperBars;
    const lowerBars = this.elements.lowerBars;

    if (!upperBars || !lowerBars) return;

    // Clear existing bars
    upperBars.innerHTML = '';
    lowerBars.innerHTML = '';

    // SVG coordinates
    const upperY1 = 32, upperY2 = 200;
    const lowerY1 = 200, lowerY2 = 368;
    const x1 = 32, x2 = 268;

    const createLine = (x1, y1, x2, y2) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      return line;
    };

    switch (style) {
      case '1over1':
        // No bars, just meeting rail
        break;

      case '2over2':
        // Upper sash - 1 vertical bar
        upperBars.appendChild(createLine(150, upperY1, 150, upperY2));
        // Lower sash - 1 vertical bar
        lowerBars.appendChild(createLine(150, lowerY1, 150, lowerY2));
        break;

      case '4over4':
        // Upper sash - 1 vertical, 1 horizontal
        upperBars.appendChild(createLine(150, upperY1, 150, upperY2));
        upperBars.appendChild(createLine(x1, 116, x2, 116)); // middle
        // Lower sash - 1 vertical, 1 horizontal
        lowerBars.appendChild(createLine(150, lowerY1, 150, lowerY2));
        lowerBars.appendChild(createLine(x1, 284, x2, 284)); // middle
        break;

      case '6over6':
        // Upper sash - 2 vertical, 2 horizontal
        upperBars.appendChild(createLine(111, upperY1, 111, upperY2));
        upperBars.appendChild(createLine(189, upperY1, 189, upperY2));
        upperBars.appendChild(createLine(x1, 88, x2, 88));
        upperBars.appendChild(createLine(x1, 144, x2, 144));
        // Lower sash - 2 vertical, 2 horizontal
        lowerBars.appendChild(createLine(111, lowerY1, 111, lowerY2));
        lowerBars.appendChild(createLine(189, lowerY1, 189, lowerY2));
        lowerBars.appendChild(createLine(x1, 256, x2, 256));
        lowerBars.appendChild(createLine(x1, 312, x2, 312));
        break;
    }

    // Apply current color to new bars
    upperBars.setAttribute('stroke', this.state.color);
    lowerBars.setAttribute('stroke', this.state.color);

    // Add animation
    const allBars = [...upperBars.children, ...lowerBars.children];
    allBars.forEach((bar, index) => {
      bar.style.opacity = '0';
      bar.style.transition = `opacity 0.3s ease ${index * 0.05}s`;
      setTimeout(() => {
        bar.style.opacity = '1';
      }, 50);
    });
  },

  // Update glass finish (clear/frosted)
  setGlassFinish(finish) {
    this.state.glassFinish = finish;
    const overlay = this.elements.frostedOverlay;

    if (overlay) {
      overlay.style.transition = 'opacity 0.5s ease';
      overlay.setAttribute('opacity', finish === 'frosted' ? '0.6' : '0');
    }

    // Also update background color slightly for frosted
    const glassBg = finish === 'frosted' ? '#F0F4F8' : '#E8F4FD';
    if (this.elements.upperSashBg) {
      this.elements.upperSashBg.style.transition = 'fill 0.5s ease';
      this.elements.upperSashBg.setAttribute('fill', glassBg);
    }
    if (this.elements.lowerSashBg) {
      this.elements.lowerSashBg.style.transition = 'fill 0.5s ease';
      this.elements.lowerSashBg.setAttribute('fill', glassBg);
    }
  },

  // Update hardware color
  setHardware(hardwareKey) {
    const color = this.hardwareColors[hardwareKey] || this.hardwareColors.brass;
    this.state.hardwareColor = color;

    if (this.elements.hardwareLock) {
      this.elements.hardwareLock.style.transition = 'fill 0.3s ease';
      this.elements.hardwareLock.setAttribute('fill', color);
    }
  },

  // Update window dimensions (visual scale only)
  setDimensions(width, height) {
    this.state.width = width;
    this.state.height = height;

    // Calculate aspect ratio for visual representation
    const baseWidth = 300;
    const baseHeight = 400;
    const aspectRatio = width / height;
    const baseAspect = baseWidth / baseHeight;

    let scale, translateY;

    if (aspectRatio > baseAspect) {
      // Window is wider than base
      scale = Math.min(1.2, Math.max(0.7, width / 900));
    } else {
      // Window is taller than base
      scale = Math.min(1.2, Math.max(0.7, height / 1200));
    }

    // Apply transform with animation
    if (this.elements.svg) {
      this.elements.svg.style.transition = 'transform 0.4s ease-out';
      this.elements.svg.style.transform = `scale(${scale})`;
    }

    // Update dimension labels
    const widthLabel = document.getElementById('widthLabel');
    const heightLabel = document.getElementById('heightLabel');

    if (widthLabel) widthLabel.textContent = `${width}mm`;
    if (heightLabel) heightLabel.textContent = `${height}mm`;
  },

  // Get current state
  getState() {
    return { ...this.state };
  },

  // Animate on option change
  animateChange() {
    if (this.elements.svg) {
      this.elements.svg.classList.add('option-selected');
      setTimeout(() => {
        this.elements.svg.classList.remove('option-selected');
      }, 300);
    }
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  WindowVisualizer.init();
});

// Export
window.WindowVisualizer = WindowVisualizer;
