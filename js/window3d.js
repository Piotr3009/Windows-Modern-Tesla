// ============================================
// SASH STUDIO - 3D Window (Three.js)
// Warm Elegant Theme with Premium Materials
// ============================================

const Window3D = {
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  windowGroup: null,
  glazingBars: null,
  materials: {},
  isInitialized: false,

  // Frame colors (hex values for Three.js)
  frameColors: {
    white: 0xFFFFFF,
    cream: 0xFFF8E7,
    grey: 0x383E42,
    black: 0x1D1D1F,
    green: 0x2D5A3D,
    oak: 0x8B6914
  },

  // Hardware colors
  hardwareColors: {
    brass: 0xD4A84B,
    chrome: 0xC0C0C0,
    satin: 0xA8A8A8,
    black: 0x1D1D1F,
    bronze: 0x8B5A2B
  },

  // Initialize the 3D scene
  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('Window3D: Container not found');
      return false;
    }

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
      console.warn('Window3D: Three.js not loaded');
      return false;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create Scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent background

    // Create Camera
    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    // Create Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);

    // Create Orbit Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.enableZoom = false;
      this.controls.enablePan = false;
      this.controls.minPolarAngle = Math.PI / 3;
      this.controls.maxPolarAngle = Math.PI / 1.8;
      this.controls.minAzimuthAngle = -Math.PI / 6;
      this.controls.maxAzimuthAngle = Math.PI / 6;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.3;
    }

    // Setup lighting (warm elegant theme)
    this.setupLighting();

    // Create the window model
    this.createWindowModel();

    // Start animation loop
    this.animate();

    // Handle window resize
    window.addEventListener('resize', () => this.onResize(container));

    this.isInitialized = true;
    console.log('Window3D: Initialized with Warm Elegant theme');

    return true;
  },

  // Setup scene lighting - Warm Elegant Theme
  setupLighting() {
    // Warm ambient light (creamy/beige tone)
    const ambient = new THREE.AmbientLight(0xFFF5EB, 0.5);
    this.scene.add(ambient);

    // Key light (warm, from top-right-front)
    const keyLight = new THREE.DirectionalLight(0xFFFAF0, 1.0);
    keyLight.position.set(3, 4, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    this.scene.add(keyLight);

    // Fill light (warm, softer from left)
    const fillLight = new THREE.DirectionalLight(0xF5F2ED, 0.4);
    fillLight.position.set(-3, 2, 3);
    this.scene.add(fillLight);

    // Rim light (subtle British Racing Green for elegant accent)
    const rimLight = new THREE.DirectionalLight(0x2D4739, 0.2);
    rimLight.position.set(0, 2, -5);
    this.scene.add(rimLight);

    // Bottom fill (prevents harsh shadows)
    const bottomFill = new THREE.DirectionalLight(0xFAF8F5, 0.2);
    bottomFill.position.set(0, -3, 2);
    this.scene.add(bottomFill);
  },

  // Create the 3D window model
  createWindowModel() {
    this.windowGroup = new THREE.Group();

    // Create materials with warm tones
    this.materials.frame = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.25,
      metalness: 0.0
    });

    this.materials.glass = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 0.95,
      thickness: 0.5,
      envMapIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.3
    });

    this.materials.hardware = new THREE.MeshStandardMaterial({
      color: 0xD4A84B,
      roughness: 0.2,
      metalness: 0.9
    });

    // Window dimensions (normalized for display)
    const frameWidth = 1.8;
    const frameHeight = 2.4;
    const frameDepth = 0.15;
    const frameThickness = 0.08;

    // === OUTER FRAME ===

    // Top rail
    const topRailGeom = new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth);
    const topRail = new THREE.Mesh(topRailGeom, this.materials.frame);
    topRail.position.y = frameHeight / 2 - frameThickness / 2;
    topRail.castShadow = true;
    this.windowGroup.add(topRail);

    // Bottom rail
    const bottomRail = new THREE.Mesh(topRailGeom, this.materials.frame);
    bottomRail.position.y = -frameHeight / 2 + frameThickness / 2;
    bottomRail.castShadow = true;
    this.windowGroup.add(bottomRail);

    // Left stile
    const stileGeom = new THREE.BoxGeometry(frameThickness, frameHeight, frameDepth);
    const leftStile = new THREE.Mesh(stileGeom, this.materials.frame);
    leftStile.position.x = -frameWidth / 2 + frameThickness / 2;
    leftStile.castShadow = true;
    this.windowGroup.add(leftStile);

    // Right stile
    const rightStile = new THREE.Mesh(stileGeom, this.materials.frame);
    rightStile.position.x = frameWidth / 2 - frameThickness / 2;
    rightStile.castShadow = true;
    this.windowGroup.add(rightStile);

    // === SASHES ===
    const sashWidth = frameWidth - frameThickness * 2;
    const sashHeight = (frameHeight - frameThickness * 2) / 2;
    const sashThickness = 0.05;
    const sashRailThickness = 0.04;

    // Upper sash group
    this.upperSash = new THREE.Group();
    this.upperSash.position.y = sashHeight / 2;
    this.upperSash.position.z = 0.02;

    // Upper sash rails
    const sashTopRailGeom = new THREE.BoxGeometry(sashWidth, sashRailThickness, sashThickness);
    const upperSashTop = new THREE.Mesh(sashTopRailGeom, this.materials.frame);
    upperSashTop.position.y = sashHeight / 2 - sashRailThickness / 2;
    this.upperSash.add(upperSashTop);

    const upperSashBottom = new THREE.Mesh(sashTopRailGeom, this.materials.frame);
    upperSashBottom.position.y = -sashHeight / 2 + sashRailThickness / 2;
    this.upperSash.add(upperSashBottom);

    const sashStileGeom = new THREE.BoxGeometry(sashRailThickness, sashHeight, sashThickness);
    const upperSashLeft = new THREE.Mesh(sashStileGeom, this.materials.frame);
    upperSashLeft.position.x = -sashWidth / 2 + sashRailThickness / 2;
    this.upperSash.add(upperSashLeft);

    const upperSashRight = new THREE.Mesh(sashStileGeom, this.materials.frame);
    upperSashRight.position.x = sashWidth / 2 - sashRailThickness / 2;
    this.upperSash.add(upperSashRight);

    // Upper glass
    const glassWidth = sashWidth - sashRailThickness * 2;
    const glassHeight = sashHeight - sashRailThickness * 2;
    const upperGlassGeom = new THREE.PlaneGeometry(glassWidth, glassHeight);
    const upperGlass = new THREE.Mesh(upperGlassGeom, this.materials.glass);
    this.upperSash.add(upperGlass);

    this.windowGroup.add(this.upperSash);

    // Lower sash group
    this.lowerSash = new THREE.Group();
    this.lowerSash.position.y = -sashHeight / 2;
    this.lowerSash.position.z = 0.04;

    // Lower sash rails
    const lowerSashTop = new THREE.Mesh(sashTopRailGeom, this.materials.frame);
    lowerSashTop.position.y = sashHeight / 2 - sashRailThickness / 2;
    this.lowerSash.add(lowerSashTop);

    const lowerSashBottom = new THREE.Mesh(sashTopRailGeom, this.materials.frame);
    lowerSashBottom.position.y = -sashHeight / 2 + sashRailThickness / 2;
    this.lowerSash.add(lowerSashBottom);

    const lowerSashLeft = new THREE.Mesh(sashStileGeom, this.materials.frame);
    lowerSashLeft.position.x = -sashWidth / 2 + sashRailThickness / 2;
    this.lowerSash.add(lowerSashLeft);

    const lowerSashRight = new THREE.Mesh(sashStileGeom, this.materials.frame);
    lowerSashRight.position.x = sashWidth / 2 - sashRailThickness / 2;
    this.lowerSash.add(lowerSashRight);

    // Lower glass
    const lowerGlass = new THREE.Mesh(upperGlassGeom, this.materials.glass);
    this.lowerSash.add(lowerGlass);

    this.windowGroup.add(this.lowerSash);

    // === MEETING RAIL ===
    const meetingRailGeom = new THREE.BoxGeometry(frameWidth - frameThickness * 1.5, 0.05, 0.08);
    const meetingRail = new THREE.Mesh(meetingRailGeom, this.materials.frame);
    meetingRail.position.z = 0.05;
    meetingRail.castShadow = true;
    this.windowGroup.add(meetingRail);

    // === HARDWARE (Lock) ===
    const lockBaseGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.025, 16);
    const lockBase = new THREE.Mesh(lockBaseGeom, this.materials.hardware);
    lockBase.rotation.x = Math.PI / 2;
    lockBase.position.z = 0.09;
    this.windowGroup.add(lockBase);

    const lockHandleGeom = new THREE.BoxGeometry(0.08, 0.015, 0.015);
    const lockHandle = new THREE.Mesh(lockHandleGeom, this.materials.hardware);
    lockHandle.position.z = 0.105;
    this.windowGroup.add(lockHandle);

    // === GLAZING BARS GROUP ===
    this.glazingBars = new THREE.Group();
    this.windowGroup.add(this.glazingBars);

    // Create default glazing bars (1over1 = no bars)
    this.createGlazingBars('1over1');

    // Position and rotate window slightly
    this.windowGroup.rotation.y = -0.15;
    this.windowGroup.rotation.x = 0.05;

    this.scene.add(this.windowGroup);
  },

  // Create glazing bars based on style
  createGlazingBars(style) {
    // Clear existing bars
    while(this.glazingBars.children.length > 0) {
      this.glazingBars.remove(this.glazingBars.children[0]);
    }

    const patterns = {
      '1over1': { h: 0, v: 0 },
      '2over2': { h: 0, v: 1 },
      '4over4': { h: 1, v: 1 },
      '6over6': { h: 2, v: 2 }
    };

    const pattern = patterns[style] || patterns['1over1'];

    if (pattern.h === 0 && pattern.v === 0) {
      return; // No bars for 1over1
    }

    const barThickness = 0.018;
    const barDepth = 0.025;

    const sashWidth = 1.64;
    const sashHeight = 1.04;

    // Create bars for both sashes
    const sashPositions = [
      { y: 0.58, z: 0.02 },  // Upper sash
      { y: -0.58, z: 0.04 }  // Lower sash
    ];

    sashPositions.forEach(sashPos => {
      // Vertical bars
      for (let i = 1; i <= pattern.v; i++) {
        const x = (sashWidth / (pattern.v + 1)) * i - sashWidth / 2;
        const barGeom = new THREE.BoxGeometry(barThickness, sashHeight - 0.08, barDepth);
        const bar = new THREE.Mesh(barGeom, this.materials.frame);
        bar.position.set(x, sashPos.y, sashPos.z);
        this.glazingBars.add(bar);
      }

      // Horizontal bars
      for (let i = 1; i <= pattern.h; i++) {
        const y = (sashHeight / (pattern.h + 1)) * i - sashHeight / 2;
        const barGeom = new THREE.BoxGeometry(sashWidth - 0.08, barThickness, barDepth);
        const bar = new THREE.Mesh(barGeom, this.materials.frame);
        bar.position.set(0, sashPos.y + y, sashPos.z);
        this.glazingBars.add(bar);
      }
    });
  },

  // === PUBLIC METHODS (called by configurator) ===

  setFrameColor(colorName) {
    const color = this.frameColors[colorName];
    if (color !== undefined && this.materials.frame) {
      this.materials.frame.color.setHex(color);
      this.pulseWindow();
    }
  },

  setHardwareColor(colorName) {
    const color = this.hardwareColors[colorName];
    if (color !== undefined && this.materials.hardware) {
      this.materials.hardware.color.setHex(color);
    }
  },

  setStyle(style) {
    this.createGlazingBars(style);
    this.pulseWindow();
  },

  setGlassFinish(finish) {
    if (!this.materials.glass) return;

    if (finish === 'frosted') {
      this.materials.glass.transmission = 0.7;
      this.materials.glass.roughness = 0.3;
      this.materials.glass.opacity = 0.5;
    } else {
      this.materials.glass.transmission = 0.95;
      this.materials.glass.roughness = 0;
      this.materials.glass.opacity = 0.3;
    }
  },

  // Pulse animation for option changes
  pulseWindow() {
    if (!this.windowGroup) return;

    const startScale = 1;
    const pulseScale = 1.02;
    const duration = 200;
    const startTime = Date.now();

    const animatePulse = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);

      let scale;
      if (progress < 0.5) {
        scale = startScale + (pulseScale - startScale) * (eased * 2);
      } else {
        scale = pulseScale - (pulseScale - startScale) * ((eased - 0.5) * 2);
      }

      this.windowGroup.scale.set(scale, scale, scale);

      if (progress < 1) {
        requestAnimationFrame(animatePulse);
      }
    };

    animatePulse();
  },

  // Animation loop
  animate() {
    requestAnimationFrame(() => this.animate());

    // Subtle floating animation
    if (this.windowGroup) {
      this.windowGroup.position.y = Math.sin(Date.now() * 0.001) * 0.015;
    }

    // Update controls
    if (this.controls) {
      this.controls.update();
    }

    // Render scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  },

  // Handle window resize
  onResize(container) {
    if (!container || !this.camera || !this.renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  },

  // Reset camera to default view
  resetView() {
    if (this.camera) {
      this.camera.position.set(0, 0, 5);
      this.camera.lookAt(0, 0, 0);
    }
    if (this.controls) {
      this.controls.reset();
    }
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure container is properly sized
  setTimeout(() => {
    Window3D.init('window3d-container');
  }, 100);
});

// Export for global access
window.Window3D = Window3D;
