# Sash Studio - Modern Tesla-Style Window Configurator

A premium, minimalist window configurator inspired by Tesla's car configurator design philosophy. Built for a London-based timber sash window company targeting young professionals, builders, and architects.

## Features

### Tesla-Inspired Design
- **Clean, minimal interface** - Product-centered design with white/light grey backgrounds
- **Window "floating" in space** - No room context, pure product focus
- **Real-time price updates** - Animated price changes as options are selected
- **Micro-interactions** - Subtle animations for premium feel

### Window Configurator
- **Dynamic SVG Visualization** - Window preview updates instantly with:
  - Frame color changes (White, Cream, Grey, Black, Green, Oak)
  - Glazing bar patterns (1 over 1, 2 over 2, 4 over 4, 6 over 6)
  - Glass finish (Clear, Frosted)
  - Hardware colors (Brass, Chrome, Satin, Black, Bronze)

- **Size Configuration**
  - Width: 400mm - 1500mm
  - Height: 600mm - 2400mm
  - Visual scaling to reflect dimensions

- **Options**
  - Glass types: Double, Triple, Passive House
  - Opening types: Both sashes, Bottom only, Fixed
  - Security: PAS24, Laminated glass, Key-operated locks

### Pricing Engine
- Base price per square meter with size multipliers
- Georgian bars pricing
- Glass and finish options
- Quantity discounts (5% for 6+, 10% for 12+, 15% for 24+)
- Real-time calculation with animated updates

### Supabase Integration
- Connected to existing Supabase database
- Load pricing configuration from database
- Save estimates and quotes
- User authentication support

## Pages

1. **index.html** - Landing page with hero, features, testimonials
2. **configurator.html** - Main Tesla-style window configurator
3. **about.html** - Company story and values
4. **contact.html** - Contact form and information

## Tech Stack

- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Styling**: CSS Custom Properties, Flexbox, Grid
- **Database**: Supabase (PostgreSQL)
- **Fonts**: Inter (Google Fonts)
- **No frameworks** - Lightweight, fast-loading

## File Structure

```
/
├── index.html              # Landing page
├── configurator.html       # Main configurator
├── about.html              # About page
├── contact.html            # Contact page
├── css/
│   ├── main.css           # Global styles
│   ├── configurator.css   # Configurator styles
│   └── animations.css     # Animation definitions
├── js/
│   ├── supabase-config.js # Supabase client setup
│   ├── pricing.js         # Pricing calculation engine
│   ├── visualizer.js      # SVG window rendering
│   ├── configurator.js    # Main configurator logic
│   └── animations.js      # Animation controller
└── img/
    ├── window/            # Window assets (placeholder)
    └── icons/             # Icon assets
```

## Design Tokens

```css
--bg-primary: #FFFFFF;
--bg-secondary: #F5F5F7;
--text-primary: #1D1D1F;
--text-secondary: #86868B;
--accent: #0066CC;
--success: #34C759;
--border: #D2D2D7;
```

## Supabase Tables Used

- `pricing_config` - Pricing configuration
- `estimates` - Saved quotes
- `customers` - User accounts
- `quote_requests` - Anonymous quote requests

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Getting Started

1. Clone the repository
2. Open `index.html` in a browser
3. Or use a local server: `python -m http.server 8000`

## Credits

- Design inspiration: Tesla car configurator
- Icons: Custom SVG
- Fonts: Inter by Rasmus Andersson

---

**Brand**: Sash Studio
**Location**: London, UK
**Target**: Young professionals, builders, architects
