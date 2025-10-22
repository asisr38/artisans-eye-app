# Theme System Documentation

## Overview
The Artisan's Eye uses a centralized theme system that provides a unified dark color scheme with futuristic/old-school visual treatments. The theme is designed to be easily customizable and maintainable.

## Color Palette

### Primary Colors
- **Background Primary**: `#0D0D10` - Main page background
- **Background Secondary**: `#1A1A1F` - Card backgrounds  
- **Background Tertiary**: `#25252A` - Elevated surfaces

### Text Colors
- **Primary Text**: `#E4E4E8` - Main content text
- **Secondary Text**: `#8A8A9B` - Supporting text
- **Tertiary Text**: `#5A5A6B` - Muted text
- **Accent Text**: `#FFAB1E` - Highlighted text

### Accent Colors
- **Primary Accent**: `#FFAB1E` - Main brand color
- **Secondary Accent**: `#FFB74D` - Lighter accent
- **Tertiary Accent**: `#FF8F00` - Darker accent

## Typography

### Font Family
- **Primary**: Inter (Google Fonts) - Modern, clean sans-serif
- **Monospace**: JetBrains Mono - For code and technical content

### Font Sizes
- **Base**: 16px (increased from default for better readability)
- **Headings**: Clear hierarchy from h1 (36px) to h4 (20px)

## Design Tokens

### Spacing
- Consistent spacing scale from 4px to 64px
- Increased white space for minimalist feel

### Border Radius
- **Uniform**: 8px for cards, buttons, and tags
- **Small**: 4px for smaller elements
- **Large**: 12px for modals and overlays

### Shadows
- **Soft shadows**: Subtle depth without heavy borders
- **Glassmorphism**: Special shadow for frosted glass effects

## Component Styles

### Cards
- Soft shadows instead of heavy borders
- Hover animations (scale 1.03)
- Increased padding for breathing room
- Consistent rounded corners

### Buttons
- Gradient backgrounds for primary buttons
- Smooth hover transitions
- Subtle lift effect on hover

### Glassmorphism
- Semi-transparent backgrounds
- Backdrop blur effects
- Subtle borders
- Used for modals and overlays

## Heritage Elements

### Fabric Texture
- Subtle repeating pattern at 5% opacity
- Applied to header for handcrafted feel
- References traditional thangka scrolls

## Usage

### CSS Variables
All theme values are available as CSS custom properties:
```css
background-color: var(--color-background-primary);
color: var(--color-text-primary);
```

### Utility Classes
Pre-built utility classes for common patterns:
```html
<div class="card">Card content</div>
<button class="btn-primary">Primary button</button>
<div class="glass">Glassmorphism panel</div>
```

### Theme Object
JavaScript theme object available for programmatic use:
```typescript
import { theme } from '@/lib/theme';
const primaryColor = theme.colors.accent.primary;
```

## Customization

To modify the theme:
1. Update values in `/lib/theme.ts`
2. CSS variables will automatically update
3. All components will reflect changes

## Future Enhancements
- Light/dark theme variants
- Theme switching capability
- Additional heritage textures
- Extended color palettes
