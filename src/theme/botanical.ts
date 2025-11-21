/**
 * Natural History Design System
 *
 * Aesthetic inspired by 19th-century scientific illustration:
 * Darwin's field notebooks, Linnaeus's botanical drafts, museum archives.
 *
 * Throughline: Technology revealing nature
 * - Historical anchor: hand-drawn discovery (Darwin sketches)
 * - Modern clarity: computational diagrams (phylogenetic trees)
 * - Connection: draftsmanship → algorithms
 */

// Core palette: aged paper and ink
export const colors = {
  // Paper tones (aged parchment, natural fibers)
  paper: {
    pristine: '#faf8f3',     // Fresh vellum
    aged: '#f4efe1',         // 50-year-old notebook
    weathered: '#e8dcc8',    // 150-year-old field notes
    stained: '#ddd0b8',      // Water marks, foxing
    shadow: '#d4c5a8',       // Creased, handled edges
  },

  // Ink tones (sepia, brown ink, faded black)
  ink: {
    fresh: '#2d1f14',        // Fresh iron gall ink
    brown: '#3d2817',        // Brown ink (common in field notes)
    faded: '#5a4230',        // 100-year fade
    light: '#6b5444',        // Diluted, sketch lines
    wash: '#8b7355',         // Ink wash for shading
  },

  // Accent ink colors (botanical illustration tradition)
  botanical: {
    vermillion: '#c84f31',   // Red oxide (specimen labels)
    indigo: '#3d5a7f',       // Blue ink (annotations)
    verdigris: '#4a6b5a',    // Green copper (plant stems)
    ochre: '#d4915e',        // Yellow earth (pollen, stamens)
  },

  // Modern data visualization (clean, but warm)
  data: {
    primary: '#3d2817',      // Dark brown (primary lines)
    secondary: '#6b5444',    // Medium (secondary branches)
    tertiary: '#8b7355',     // Light (tertiary connections)
    highlight: '#c84f31',    // Vermillion (selected/active)
  },

  // Typography
  text: {
    primary: '#2d1f14',      // Fresh ink (headings, labels)
    secondary: '#3d2817',    // Brown ink (body text)
    tertiary: '#5a4230',     // Faded (metadata, notes)
    muted: '#8b7355',        // Very faded (hints)
  },

  // Interaction states (subtle, museum-quality)
  interactive: {
    hover: '#c84f31',        // Vermillion highlight
    active: '#d4915e',       // Ochre selection
    focus: '#3d5a7f',        // Indigo focus ring
  },
};

// Spacing (based on traditional margins and line spacing)
export const spacing = {
  xs: '0.25rem',    // 4px - tight annotation spacing
  sm: '0.5rem',     // 8px - line spacing
  md: '1rem',       // 16px - paragraph spacing
  lg: '1.5rem',     // 24px - section margins
  xl: '2.5rem',     // 40px - page margins
  xxl: '4rem',      // 64px - title spacing
};

// Border radius (minimal, architectural)
export const radius = {
  none: '0',
  subtle: '2px',
  soft: '4px',
  rounded: '8px',
};

// Typography (monospace for data, serif for titles)
export const typography = {
  fontFamily: {
    mono: '"Fira Code", "JetBrains Mono", "Courier New", monospace',
    serif: 'Georgia, "Times New Roman", serif',
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  sizes: {
    xs: '0.75rem',    // 12px - annotations
    sm: '0.875rem',   // 14px - labels
    base: '1rem',     // 16px - body
    lg: '1.25rem',    // 20px - headings
    xl: '1.75rem',    // 28px - section titles
    xxl: '2.5rem',    // 40px - page title
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
  },
};

// Animation timings (subtle, considered)
export const timing = {
  instant: '100ms',
  quick: '200ms',
  smooth: '350ms',
  transition: '500ms',
};

// Generate depth-based ink gradient (lighter with depth, like phylogenetic trees)
export const getInkGradient = (depth: number, maxDepth: number): string => {
  const progress = depth / Math.max(maxDepth, 1);

  // Fresh ink → Light wash
  const inkScale = [
    '#2d1f14', // fresh ink (root)
    '#3d2817', // brown
    '#4a3828', // fading
    '#5a4230', // faded
    '#6b5444', // light
    '#8b7355', // wash
  ];

  const index = Math.floor(progress * (inkScale.length - 1));
  return inkScale[Math.min(index, inkScale.length - 1)];
};

// Generate botanical accent colors for categories (like colored specimen labels)
export const getBotanicalAccent = (category: number): string => {
  const palette = [
    '#c84f31', // vermillion
    '#3d5a7f', // indigo
    '#4a6b5a', // verdigris
    '#d4915e', // ochre
    '#a85050', // rust
    '#7a9b8e', // lichen
  ];

  return palette[category % palette.length];
};

// SVG filter for paper texture (subtle noise like fiber and foxing)
export const paperTextureFilter = `
  <filter id="paper-texture">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.8"
      numOctaves="4"
      seed="123"
    />
    <feColorMatrix type="saturate" values="0.1"/>
    <feComponentTransfer>
      <feFuncA type="discrete" tableValues="0 0 0 1"/>
    </feComponentTransfer>
    <feBlend mode="multiply" in="SourceGraphic" result="texture"/>
    <feGaussianBlur in="texture" stdDeviation="0.5"/>
  </filter>
`;

// SVG filter for ink bleed effect (slight feathering on aged paper)
export const inkBleedFilter = `
  <filter id="ink-bleed">
    <feGaussianBlur in="SourceGraphic" stdDeviation="0.3"/>
    <feComponentTransfer>
      <feFuncA type="linear" slope="1.2"/>
    </feComponentTransfer>
  </filter>
`;
