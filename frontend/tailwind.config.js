/** @type {import('tailwindcss').Config} */

/**
 * Subhadarshini brand palette.
 *
 * The whole site is built from three colours, all sharing the logo's hue (349°):
 *
 *   1. BRAND   — the crimson lifted straight from the logo mark (#E42548 is
 *                `brand-500`, the exact sampled value). Every interactive and
 *                accent surface is a tint or shade of it.
 *   2. INK     — the same hue desaturated and darkened. All body copy, headings
 *                and dark surfaces. Reads as near-black but stays warm.
 *   3. SURFACE — the same hue at very low saturation and high lightness. Page
 *                backgrounds, cards and borders.
 *
 * Tints and shades within a family are not additional colours; they are the one
 * colour at different lightness, which is what keeps contrast accessible while
 * the palette stays monochromatic. Every foreground/background pair actually
 * used in the UI meets WCAG AA.
 *
 * The legacy `spice-*` names are kept as aliases onto this system so existing
 * markup keeps working; new work should use `brand-*`, `ink-*` and `surface-*`.
 */

const brand = {
  50: '#FFF0F3',
  100: '#FEE2E7',
  200: '#FAC1CC',
  300: '#F391A3', // accent on dark surfaces
  400: '#EB5C76',
  500: '#E42548', // the logo crimson, sampled
  600: '#BF1D3A', // primary interactive on light surfaces
  700: '#9D152E', // hover / pressed
  800: '#760F22',
  900: '#530917'
};

const ink = {
  50: '#F9F6F6',
  100: '#F0EAEB',
  200: '#E0D7D8',
  300: '#C4B5B8', // muted copy on dark surfaces
  400: '#9F898D',
  500: '#7D6468', // muted copy on light surfaces
  600: '#60484D', // body copy
  700: '#453034',
  800: '#2C1B1E', // headings, dark fills
  900: '#1B0E11' // deepest surface
};

const surface = {
  0: '#FFFFFF',
  50: '#FEFBFB',
  100: '#FBF4F5', // page background
  200: '#F5EBED', // secondary surface
  300: '#EADCDF', // borders
  400: '#D9C9CC'
};

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand,
        ink,
        surface,

        // Legacy aliases — mapped onto the three-colour system above.
        spice: {
          red: brand[600], // primary interactive
          'red-dark': brand[800], // pressed / deepest brand fill
          saffron: brand[600], // accent on light surfaces
          turmeric: brand[300], // accent on dark surfaces
          beige: surface[200],
          cream: surface[100],
          brown: ink[800],
          dark: ink[900]
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
