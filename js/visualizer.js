// ============================================
// SASH STUDIO - Window Visualizer
// Isometric Pseudo-3D SVG Window Rendering
// Tesla-style premium visualization
// ============================================

const WindowVisualizer = {
  // SVG container reference
  container: null,
  svg: null,

  // Current state
  state: {
    width: 900,
    height: 1200,
    style: '1over1',
    color: 'white',
    glassFinish: 'clear',
    hardware: 'brass'
  },

  // Color configurations with light/dark variants for 3D effect
  colors: {
    white: { front: '#FFFFFF', side: '#E8E8E8', edge: '#F5F5F5', dark: '#D0D0D0' },
    cream: { front: '#FFF8E7', side: '#EDE5D6', edge: '#FFF5DC', dark: '#D9CFC0' },
    grey: { front: '#383E42', side: '#282D30', edge: '#454B50', dark: '#1F2325' },
    black: { front: '#1D1D1F', side: '#0D0D0F', edge: '#2A2A2C', dark: '#000000' },
    green: { front: '#2D5A3D', side: '#1E4229', edge: '#3A6B4C', dark: '#15301D' },
    oak: { front: '#8B6914', side: '#6B5010', edge: '#A57B1A', dark: '#4A3A0C' }
  },

  // Hardware color configurations
  hardwareColors: {
    brass: { main: '#D4A84B', highlight: '#E8C066', shadow: '#B08A3A' },
    chrome: { main: '#C0C0C0', highlight: '#E0E0E0', shadow: '#909090' },
    satin: { main: '#A8A8A8', highlight: '#C8C8C8', shadow: '#808080' },
    black: { main: '#1D1D1F', highlight: '#3A3A3C', shadow: '#000000' },
    bronze: { main: '#8B5A2B', highlight: '#A97040', shadow: '#6B4520' }
  },

  // Initialize visualizer
  init() {
    this.container = document.getElementById('windowPreview');
    if (!this.container) {
      console.error('Window preview container not found');
      return;
    }

    // Generate the initial SVG
    this.render();
    console.log('Window visualizer initialized with isometric 3D view');
  },

  // Main render function - generates the entire SVG
  render() {
    const colorScheme = this.colors[this.state.color] || this.colors.white;
    const hardwareScheme = this.hardwareColors[this.state.hardware] || this.hardwareColors.brass;
    const isLightColor = ['white', 'cream'].includes(this.state.color);

    // SVG dimensions for isometric view
    const svgWidth = 420;
    const svgHeight = 520;
    const depth = 60; // 3D depth offset

    // Main window dimensions in SVG units
    const windowWidth = 280;
    const windowHeight = 380;
    const frameThickness = 12;
    const sashFrameThickness = 8;
    const meetingRailHeight = 18;

    // Starting positions
    const startX = 40;
    const startY = 60;

    const svg = `
      <svg id="windowSVG" viewBox="0 0 ${svgWidth} ${svgHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" class="window-svg">
        <defs>
          <!-- Glass gradient -->
          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#E8F4FD;stop-opacity:1"/>
            <stop offset="50%" style="stop-color:#D4E8F7;stop-opacity:1"/>
            <stop offset="100%" style="stop-color:#C5DCF0;stop-opacity:1"/>
          </linearGradient>

          <!-- Frosted glass gradient -->
          <linearGradient id="frostedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#F0F4F8;stop-opacity:1"/>
            <stop offset="100%" style="stop-color:#E4E8EC;stop-opacity:1"/>
          </linearGradient>

          <!-- Glass reflection gradient -->
          <linearGradient id="reflectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(255,255,255,0.6)"/>
            <stop offset="100%" style="stop-color:rgba(255,255,255,0)"/>
          </linearGradient>

          <!-- Drop shadow filter -->
          <filter id="dropShadow" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="8" dy="15" stdDeviation="15" flood-color="#000" flood-opacity="0.15"/>
          </filter>

          <!-- Inner shadow for depth -->
          <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feComponentTransfer in="SourceAlpha">
              <feFuncA type="table" tableValues="1 0"/>
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feFlood flood-color="#000" flood-opacity="0.2" result="color"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feComposite in2="SourceAlpha" operator="in"/>
            <feMerge>
              <feMergeNode in="SourceGraphic"/>
              <feMergeNode/>
            </feMerge>
          </filter>

          <!-- Frosted pattern -->
          <pattern id="frostedPattern" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="rgba(255,255,255,0.4)"/>
            <circle cx="1" cy="1" r="0.5" fill="rgba(200,200,200,0.3)"/>
            <circle cx="3" cy="3" r="0.5" fill="rgba(200,200,200,0.2)"/>
          </pattern>

          <!-- Hardware metallic gradient -->
          <linearGradient id="hardwareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${hardwareScheme.highlight}"/>
            <stop offset="50%" style="stop-color:${hardwareScheme.main}"/>
            <stop offset="100%" style="stop-color:${hardwareScheme.shadow}"/>
          </linearGradient>

          <!-- Top edge highlight -->
          <linearGradient id="topHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${colorScheme.edge}"/>
            <stop offset="100%" style="stop-color:${colorScheme.front}"/>
          </linearGradient>

          <!-- Side shadow gradient -->
          <linearGradient id="sideGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${colorScheme.side}"/>
            <stop offset="100%" style="stop-color:${colorScheme.dark}"/>
          </linearGradient>
        </defs>

        <g filter="url(#dropShadow)" class="window-group">
          <!-- ============ BOX FRAME - SIDE (3D Depth) ============ -->
          <!-- Top side depth -->
          <polygon
            class="frame-side frame-element"
            points="${startX + windowWidth},${startY}
                    ${startX + windowWidth + depth},${startY - depth/2}
                    ${startX + depth},${startY - depth/2}
                    ${startX},${startY}"
            fill="url(#sideGradient)"
          />

          <!-- Right side depth -->
          <polygon
            class="frame-side frame-element"
            points="${startX + windowWidth},${startY}
                    ${startX + windowWidth + depth},${startY - depth/2}
                    ${startX + windowWidth + depth},${startY + windowHeight - depth/2}
                    ${startX + windowWidth},${startY + windowHeight}"
            fill="url(#sideGradient)"
          />

          <!-- Top-right corner edge highlight -->
          <line
            x1="${startX + windowWidth}" y1="${startY}"
            x2="${startX + windowWidth + depth}" y2="${startY - depth/2}"
            stroke="${colorScheme.edge}" stroke-width="1" opacity="0.5"
          />

          <!-- ============ BOX FRAME - FRONT ============ -->
          <rect
            class="frame-front frame-element"
            x="${startX}" y="${startY}"
            width="${windowWidth}" height="${windowHeight}"
            rx="3"
            fill="${colorScheme.front}"
          />

          <!-- Frame inner border for depth -->
          <rect
            x="${startX}" y="${startY}"
            width="${windowWidth}" height="${windowHeight}"
            rx="3"
            fill="none"
            stroke="${isLightColor ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'}"
            stroke-width="1"
          />

          <!-- Top edge highlight strip -->
          <rect
            class="frame-element"
            x="${startX}" y="${startY}"
            width="${windowWidth}" height="4"
            rx="3"
            fill="url(#topHighlight)"
          />

          <!-- ============ UPPER SASH AREA ============ -->
          <!-- Glass background -->
          <rect
            class="glass-element"
            id="upperGlass"
            x="${startX + frameThickness}"
            y="${startY + frameThickness}"
            width="${windowWidth - frameThickness * 2}"
            height="${(windowHeight - meetingRailHeight) / 2 - frameThickness}"
            fill="${this.state.glassFinish === 'frosted' ? 'url(#frostedGradient)' : 'url(#glassGradient)'}"
          />

          <!-- Glass reflection upper -->
          <polygon
            class="glass-reflection"
            points="${startX + frameThickness + 5},${startY + frameThickness + 5}
                    ${startX + frameThickness + 60},${startY + frameThickness + 5}
                    ${startX + frameThickness + 5},${startY + frameThickness + 70}"
            fill="url(#reflectionGradient)"
          />

          <!-- Upper sash frame -->
          <rect
            class="sash-frame frame-element"
            id="upperSashFrame"
            x="${startX + frameThickness}"
            y="${startY + frameThickness}"
            width="${windowWidth - frameThickness * 2}"
            height="${(windowHeight - meetingRailHeight) / 2 - frameThickness}"
            fill="none"
            stroke="${colorScheme.front}"
            stroke-width="${sashFrameThickness}"
          />

          <!-- Upper sash inner shadow -->
          <rect
            x="${startX + frameThickness + sashFrameThickness/2}"
            y="${startY + frameThickness + sashFrameThickness/2}"
            width="${windowWidth - frameThickness * 2 - sashFrameThickness}"
            height="${(windowHeight - meetingRailHeight) / 2 - frameThickness - sashFrameThickness}"
            fill="none"
            stroke="${isLightColor ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}"
            stroke-width="1"
          />

          <!-- Upper glazing bars container -->
          <g id="upperBars" class="glazing-bars" stroke="${colorScheme.front}" stroke-width="5" stroke-linecap="round">
            ${this.generateBars('upper', startX, startY, windowWidth, windowHeight, frameThickness, meetingRailHeight, sashFrameThickness)}
          </g>

          <!-- ============ MEETING RAIL (3D Effect) ============ -->
          <!-- Meeting rail shadow -->
          <rect
            x="${startX + frameThickness - 2}"
            y="${startY + (windowHeight - meetingRailHeight) / 2 + 3}"
            width="${windowWidth - frameThickness * 2 + 4}"
            height="${meetingRailHeight}"
            fill="${isLightColor ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.2)'}"
            rx="1"
          />

          <!-- Meeting rail main body -->
          <rect
            class="meeting-rail frame-element"
            id="meetingRail"
            x="${startX + frameThickness - 2}"
            y="${startY + (windowHeight - meetingRailHeight) / 2}"
            width="${windowWidth - frameThickness * 2 + 4}"
            height="${meetingRailHeight}"
            fill="${colorScheme.front}"
            rx="1"
          />

          <!-- Meeting rail top highlight -->
          <rect
            class="frame-element"
            x="${startX + frameThickness - 2}"
            y="${startY + (windowHeight - meetingRailHeight) / 2}"
            width="${windowWidth - frameThickness * 2 + 4}"
            height="3"
            fill="${colorScheme.edge}"
            rx="1"
          />

          <!-- Meeting rail bottom edge -->
          <rect
            x="${startX + frameThickness - 2}"
            y="${startY + (windowHeight - meetingRailHeight) / 2 + meetingRailHeight - 2}"
            width="${windowWidth - frameThickness * 2 + 4}"
            height="2"
            fill="${colorScheme.dark}"
            rx="1"
          />

          <!-- ============ LOWER SASH AREA ============ -->
          <!-- Glass background -->
          <rect
            class="glass-element"
            id="lowerGlass"
            x="${startX + frameThickness}"
            y="${startY + (windowHeight + meetingRailHeight) / 2}"
            width="${windowWidth - frameThickness * 2}"
            height="${(windowHeight - meetingRailHeight) / 2 - frameThickness}"
            fill="${this.state.glassFinish === 'frosted' ? 'url(#frostedGradient)' : 'url(#glassGradient)'}"
          />

          <!-- Glass reflection lower -->
          <polygon
            class="glass-reflection"
            points="${startX + frameThickness + 5},${startY + (windowHeight + meetingRailHeight) / 2 + 5}
                    ${startX + frameThickness + 50},${startY + (windowHeight + meetingRailHeight) / 2 + 5}
                    ${startX + frameThickness + 5},${startY + (windowHeight + meetingRailHeight) / 2 + 55}"
            fill="url(#reflectionGradient)"
          />

          <!-- Lower sash frame -->
          <rect
            class="sash-frame frame-element"
            id="lowerSashFrame"
            x="${startX + frameThickness}"
            y="${startY + (windowHeight + meetingRailHeight) / 2}"
            width="${windowWidth - frameThickness * 2}"
            height="${(windowHeight - meetingRailHeight) / 2 - frameThickness}"
            fill="none"
            stroke="${colorScheme.front}"
            stroke-width="${sashFrameThickness}"
          />

          <!-- Lower sash inner shadow -->
          <rect
            x="${startX + frameThickness + sashFrameThickness/2}"
            y="${startY + (windowHeight + meetingRailHeight) / 2 + sashFrameThickness/2}"
            width="${windowWidth - frameThickness * 2 - sashFrameThickness}"
            height="${(windowHeight - meetingRailHeight) / 2 - frameThickness - sashFrameThickness}"
            fill="none"
            stroke="${isLightColor ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}"
            stroke-width="1"
          />

          <!-- Lower glazing bars container -->
          <g id="lowerBars" class="glazing-bars" stroke="${colorScheme.front}" stroke-width="5" stroke-linecap="round">
            ${this.generateBars('lower', startX, startY, windowWidth, windowHeight, frameThickness, meetingRailHeight, sashFrameThickness)}
          </g>

          <!-- ============ HARDWARE - SASH LOCK ============ -->
          <g class="hardware-group" transform="translate(${startX + windowWidth/2}, ${startY + windowHeight/2})">
            <!-- Lock base shadow -->
            <ellipse cx="2" cy="4" rx="14" ry="8" fill="rgba(0,0,0,0.2)"/>

            <!-- Lock base -->
            <ellipse
              class="hardware-element"
              id="lockBase"
              cx="0" cy="0" rx="12" ry="7"
              fill="url(#hardwareGradient)"
            />

            <!-- Lock highlight -->
            <ellipse
              cx="0" cy="-2" rx="8" ry="3"
              fill="${hardwareScheme.highlight}"
              opacity="0.6"
            />

            <!-- Lock keyhole -->
            <ellipse cx="0" cy="1" rx="3" ry="2" fill="${hardwareScheme.shadow}"/>
          </g>

          <!-- ============ SASH LIFTS (handles) ============ -->
          <!-- Lower sash lift -->
          <g class="hardware-group" transform="translate(${startX + windowWidth/2}, ${startY + windowHeight - frameThickness - 25})">
            <rect x="-20" y="-3" width="40" height="6" rx="3" fill="url(#hardwareGradient)" class="hardware-element"/>
            <rect x="-18" y="-2" width="36" height="2" rx="1" fill="${hardwareScheme.highlight}" opacity="0.5"/>
          </g>

          <!-- ============ FROSTED OVERLAY (conditional) ============ -->
          <rect
            id="frostedOverlay"
            x="${startX + frameThickness + sashFrameThickness/2}"
            y="${startY + frameThickness + sashFrameThickness/2}"
            width="${windowWidth - frameThickness * 2 - sashFrameThickness}"
            height="${windowHeight - frameThickness * 2 - sashFrameThickness}"
            fill="url(#frostedPattern)"
            opacity="${this.state.glassFinish === 'frosted' ? '0.4' : '0'}"
            style="pointer-events:none; transition: opacity 0.5s ease;"
          />
        </g>
      </svg>
    `;

    this.container.innerHTML = svg;
    this.svg = document.getElementById('windowSVG');

    // Add floating animation
    this.addFloatingAnimation();
  },

  // Generate glazing bars based on style
  generateBars(position, startX, startY, windowWidth, windowHeight, frameThickness, meetingRailHeight, sashFrameThickness) {
    const style = this.state.style;
    let bars = '';

    const sashWidth = windowWidth - frameThickness * 2 - sashFrameThickness;
    const sashHeight = (windowHeight - meetingRailHeight) / 2 - frameThickness - sashFrameThickness;

    const sashX = startX + frameThickness + sashFrameThickness / 2;
    const upperSashY = startY + frameThickness + sashFrameThickness / 2;
    const lowerSashY = startY + (windowHeight + meetingRailHeight) / 2 + sashFrameThickness / 2;

    const baseY = position === 'upper' ? upperSashY : lowerSashY;

    switch (style) {
      case '2over2':
        // 1 vertical bar
        bars = `
          <line x1="${sashX + sashWidth/2}" y1="${baseY}" x2="${sashX + sashWidth/2}" y2="${baseY + sashHeight}" class="glazing-bar"/>
        `;
        break;

      case '4over4':
        // 1 vertical + 1 horizontal
        bars = `
          <line x1="${sashX + sashWidth/2}" y1="${baseY}" x2="${sashX + sashWidth/2}" y2="${baseY + sashHeight}" class="glazing-bar"/>
          <line x1="${sashX}" y1="${baseY + sashHeight/2}" x2="${sashX + sashWidth}" y2="${baseY + sashHeight/2}" class="glazing-bar"/>
        `;
        break;

      case '6over6':
        // 2 vertical + 2 horizontal (Georgian style)
        const v1 = sashX + sashWidth / 3;
        const v2 = sashX + (sashWidth * 2) / 3;
        const h1 = baseY + sashHeight / 3;
        const h2 = baseY + (sashHeight * 2) / 3;

        bars = `
          <line x1="${v1}" y1="${baseY}" x2="${v1}" y2="${baseY + sashHeight}" class="glazing-bar"/>
          <line x1="${v2}" y1="${baseY}" x2="${v2}" y2="${baseY + sashHeight}" class="glazing-bar"/>
          <line x1="${sashX}" y1="${h1}" x2="${sashX + sashWidth}" y2="${h1}" class="glazing-bar"/>
          <line x1="${sashX}" y1="${h2}" x2="${sashX + sashWidth}" y2="${h2}" class="glazing-bar"/>
        `;
        break;

      case '1over1':
      default:
        // No bars
        bars = '';
        break;
    }

    return bars;
  },

  // Add subtle floating animation
  addFloatingAnimation() {
    if (this.svg) {
      this.svg.style.animation = 'windowFloat 4s ease-in-out infinite';
    }
  },

  // Update frame color with smooth transition
  setColor(colorKey) {
    this.state.color = colorKey;
    this.render();
    this.animateChange();
  },

  // Update glazing bar pattern
  setStyle(style) {
    this.state.style = style;
    this.render();
    this.animateChange();
  },

  // Update glass finish (clear/frosted)
  setGlassFinish(finish) {
    this.state.glassFinish = finish;

    const overlay = document.getElementById('frostedOverlay');
    const upperGlass = document.getElementById('upperGlass');
    const lowerGlass = document.getElementById('lowerGlass');

    if (overlay) {
      overlay.style.transition = 'opacity 0.5s ease';
      overlay.setAttribute('opacity', finish === 'frosted' ? '0.4' : '0');
    }

    if (upperGlass && lowerGlass) {
      const gradientId = finish === 'frosted' ? 'url(#frostedGradient)' : 'url(#glassGradient)';
      upperGlass.setAttribute('fill', gradientId);
      lowerGlass.setAttribute('fill', gradientId);
    }
  },

  // Update hardware color
  setHardware(hardwareKey) {
    this.state.hardware = hardwareKey;
    this.render();
  },

  // Update window dimensions (visual feedback)
  setDimensions(width, height) {
    this.state.width = width;
    this.state.height = height;

    // Update dimension labels
    const widthLabel = document.getElementById('widthLabel');
    const heightLabel = document.getElementById('heightLabel');

    if (widthLabel) widthLabel.textContent = `${width}mm`;
    if (heightLabel) heightLabel.textContent = `${height}mm`;

    // Scale the SVG based on proportions
    if (this.svg) {
      const baseWidth = 900;
      const baseHeight = 1200;
      const scaleX = width / baseWidth;
      const scaleY = height / baseHeight;
      const scale = Math.min(1.15, Math.max(0.75, (scaleX + scaleY) / 2));

      this.svg.style.transition = 'transform 0.4s ease-out';
      this.svg.style.transform = `scale(${scale})`;
    }
  },

  // Animate on option change
  animateChange() {
    if (this.svg) {
      this.svg.classList.add('option-selected');
      setTimeout(() => {
        this.svg.classList.remove('option-selected');
      }, 400);
    }
  },

  // Get current state
  getState() {
    return { ...this.state };
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  WindowVisualizer.init();
});

// Export
window.WindowVisualizer = WindowVisualizer;
