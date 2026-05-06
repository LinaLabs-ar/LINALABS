# LINALABS Console - Code Structure Documentation

## Overview

The LINALABS Console is a single-page HTML5 application (~826 lines) featuring:
- **Inline CSS**: ~531 lines (lines 7-538)
- **Inline JavaScript**: ~149 lines (lines 676-824)
- **Interactive Elements**: Logo glitch effect, 6 service cards, 6 capability items, interactive canvas showcase, mouse follower, parallax background particles
- **Technology Stack**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Responsive Design**: Mobile-first approach with 768px breakpoint

---

## 1. HTML Layout

### Document Structure

```
<!DOCTYPE html>
<html lang="es">
├── <head> (lines 3-539)
│   ├── Meta tags (charset, viewport)
│   ├── Title: "LinaLabs - Laboratorio Creativo Digital"
│   └── <style> inline CSS (531 lines)
└── <body> (lines 540-826)
    ├── <header> fixed navigation (lines 542-551)
    ├── <div class="mouse-follower"> (line 554)
    ├── <div class="parallax-bg"> interactive particles (line 557)
    ├── <section class="hero"> full-viewport hero (lines 560-572)
    ├── <section class="services"> 6 service cards (lines 575-613)
    ├── <section class="capabilities"> 6 capability items (lines 616-656)
    ├── <section class="showcase"> canvas animation (lines 659-664)
    ├── <footer> contact section (lines 667-674)
    └── <script> inline JavaScript (149 lines)
```

### Key Sections

#### Header (lines 542-551)
- **Role**: Fixed navigation bar (z-index: 1000)
- **Structure**:
  - `.logo` with glitch effect (data-text attribute)
  - `<nav>` with 3 smooth scroll links: Servicios, Capacidades, Contacto
  - Backdrop blur effect, semi-transparent background
- **CSS**: lines 74-126

#### Hero Section (lines 560-572)
- **Role**: Full-viewport landing hero with visual impact
- **Structure**:
  - `.hero-content` centered container (max-width: 1200px)
  - `.hero-title` with glitch effect and responsive font sizing
  - `.hero-subtitle` in neon cyan
  - Descriptive paragraph (18px, 60% opacity)
  - `.cta-button` "Agendar Consulta" with gradient and hover effects
  - `.scroll-indicator` bottom bouncing text
- **Visual Effects**: Floating radial gradients (::before, ::after pseudo-elements)
- **CSS**: lines 127-248

#### Services Section (lines 575-613)
- **Role**: Display 6 service offerings with icon + title + description
- **Layout**: CSS Grid with `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`
- **Cards**:
  1. ⚙️ Agentes IA
  2. 🎨 Diseño Gráfico
  3. 📱 Desarrollo Web
  4. ✨ Contenido IA
  5. 📊 Consultoría Digital
  6. 🎬 Video & Motion
- **Interactivity**: Hover effects (border color, shadow, translateY, icon scale/rotate)
- **CSS**: lines 250-328

#### Capabilities Section (lines 616-656)
- **Role**: Showcase 6 core capabilities with numbered items
- **Layout**: 2-column grid (768px breakpoint → 1 column)
- **Items**:
  1. Remoto & Global
  2. Experimentación Continua
  3. Multidisciplinario
  4. Resultados Medibles
  5. Iteración Rápida
  6. Potencia de IA
- **Interactivity**: Hover effects (background change, border color shift, padding increase)
- **CSS**: lines 330-389

#### Visual Showcase / Canvas (lines 659-664)
- **Role**: Interactive canvas for particle animations on mouse movement
- **Container**: `.canvas-container` (600px height on desktop, 400px on mobile)
- **Canvas ID**: `#showcase-canvas`
- **Features**: Grid background, mouse-tracking particles with gravity
- **CSS**: lines 390-411

#### Footer (lines 667-674)
- **Role**: Contact call-to-action section
- **Content**:
  - Prompt text "¿Listo para transformar tu negocio?"
  - `.footer-cta` email link (hello@linalabs.ar)
  - Copyright notice with disciplines
- **CSS**: lines 453-502

#### Mouse Follower (line 554)
- **Role**: Fixed custom cursor following mouse movement
- **Styling**: 40px circular div with cyan border and radial gradient
- **Visibility**: Initially hidden, activated on mousemove
- **CSS**: lines 413-436

#### Parallax Background (line 557)
- **Role**: Fixed background with 50 floating particles for depth effect
- **Features**: Responds to scroll (translateY with 0.5 parallax factor)
- **CSS**: lines 438-451

---

## 2. CSS Architecture

### CSS Variables (lines 14-25)

```css
:root {
    --primary-black: #000000;
    --primary-white: #ffffff;
    --neon-green: #00ff00;
    --neon-blue: #0080ff;
    --neon-red: #ff0040;
    --neon-magenta: #ff00ff;
    --neon-cyan: #00ffff;
    --pastel-pink: #ffb3d9;
    --pastel-violet: #d4a5ff;
    --pastel-green: #a8ff80;
}
```

### Color Palette

| Variable | Hex | Usage |
|----------|-----|-------|
| --primary-black | #000000 | Body background, button text |
| --primary-white | #ffffff | Default text color |
| --neon-green | #00ff00 | Accents, service icons, CTA gradient |
| --neon-blue | #0080ff | Accents, glyphs |
| --neon-red | #ff0040 | Glitch effect, animations |
| --neon-magenta | #ff00ff | Accents, hover effects, glitch |
| --neon-cyan | #00ffff | Primary accent, nav hover, borders |
| --pastel-pink | #ffb3d9 | Unused in current version |
| --pastel-violet | #d4a5ff | Unused in current version |
| --pastel-green | #a8ff80 | Unused in current version |

### Key Animation Definitions

#### glitch-anim-1 (lines 36-42)
- **Duration**: 0.3s
- **Timing**: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- **Effect**: Distorts clip-path at 0%, 20%, 40%, 60%, 100% with random transforms
- **Colors**: Red (::before) and cyan (::after) layers
- **Applied to**: `.glitch::before`, `.glitch::after` (infinite, reverse on ::after)

#### float (lines 162-165)
- **Duration**: 6s-8s (configurable per element)
- **Effect**: Vertical and horizontal translation (-30px Y, +20px X)
- **Applied to**: Hero pseudo-elements, parallax particles

#### bounce (lines 245-248)
- **Duration**: 2s infinite
- **Effect**: Vertical translateY with opacity fade (0 to -10px)
- **Applied to**: `.scroll-indicator`

### Key Classes & Their Purposes

| Class | Purpose | Lines |
|-------|---------|-------|
| `.glitch` | Text distortion effect with pseudo-element clipping | 44-71 |
| `header` | Fixed navigation bar with glassmorphism | 74-86 |
| `.logo` | Brand identifier with glitch trigger | 88-94 |
| `nav` | Horizontal menu with animated underline | 96-125 |
| `.hero` | Full-viewport landing section with gradients | 128-136 |
| `.hero-content` | Centered content container | 167-173 |
| `.hero-title` | Responsive glitch headline (clamp) | 175-182 |
| `.cta-button` | Primary action button with gradient shift | 193-230 |
| `.service-card` | Hoverable service item with shine effect | 273-314 |
| `.capabilities-grid` | 2-column responsive grid | 338-352 |
| `.capability-item` | Numbered capability item with left border | 354-366 |
| `.canvas-container` | Canvas wrapper with grid aesthetic | 398-405 |
| `.mouse-follower` | Custom cursor circle (fixed, pointer-events: none) | 414-436 |
| `.parallax-bg` | Fixed background particle container | 439-446 |
| `footer` | Contact section with gradient background | 454-459 |

### Responsive Breakpoints

#### Mobile (max-width: 768px) - lines 505-537

| Component | Change |
|-----------|--------|
| `header` | flex-direction: column, gap: 20px, padding: 15px 20px |
| `nav` | gap: 20px, font-size: 12px |
| `.hero-title` | font-size: 36px (down from clamp) |
| `.section-title` | font-size: 32px |
| `.services` | padding: 60px 20px, gap: 20px |
| `.capabilities` | padding: 60px 20px |
| `.capabilities-grid` | grid-template-columns: 1fr (down from 2 columns) |
| `.canvas-container` | height: 400px (down from 600px) |

### Hover & Interactive States

#### Service Card Hover
- Border color: rgba(0, 255, 255, 0.2) → var(--neon-cyan)
- Box-shadow: 0 0 30px rgba(0, 255, 255, 0.3)
- Transform: translateY(-10px)
- Shine effect: left transition 0% → 100%
- Icon: color green → magenta, scale 1 → 1.2, rotate 0deg → 10deg

#### CTA Button Hover
- Background shift via ::before pseudo-element (magenta/red gradient)
- Box-shadow: 0 0 50px rgba(255, 0, 255, 0.6)
- Transform: scale(1.05)

#### Navigation Link Hover
- Underline animation: width 0 → 100%
- Gradient: green → cyan → magenta

#### Footer CTA Hover
- Background fill (left: -100% → 0)
- Color: cyan → black

---

## 3. JavaScript Architecture

### Overall Pattern
- **ES6+ Vanilla JS** (no frameworks)
- **requestAnimationFrame** for smooth 60 FPS animations
- **Event listeners** for interactivity
- **Classes** (CanvasParticle) for particle physics

### 3.1 Mouse Follower System (lines 677-697)

**Purpose**: Smooth custom cursor that trails mouse movement with easing.

**Key Details**:
- Easing factor: 0.1 (creates smooth lag effect)
- Offset: -20px (centers 40px div on cursor)
- Triggered on mousemove, class added for visibility

---

### 3.2 Parallax Background Particles (lines 699-725)

**Purpose**: Create depth and visual interest with floating background particles that move with scroll.

**Key Details**:
- 50 particles, 1-4px diameter
- Colors: 4 neon colors at 10% opacity
- Animation duration: 5-15s random via float keyframe
- Scroll factor: 0.5× (moves slower than page scroll for depth)

---

### 3.3 Canvas Animation System (lines 727-805)

**CanvasParticle Class** (lines 739-762):
- Constructor: x, y, vx, vy, color, life (starts at 1)
- update(): Applies velocity, adds gravity (0.1), decreases life by 0.01
- draw(): Renders 3px circles with alpha based on life

**Particle Physics**:
- Initial velocity: (±1.5 px/frame in X, ±1.5 px/frame in Y)
- Gravity acceleration: +0.1 px/frame² in Y direction
- Lifespan: 100 frames (at 0.01 life decrease per frame)
- Radius: 3px circles

**Canvas Features**:
- Grid background: 50px cells, cyan lines at 5% opacity
- Responsive sizing on window resize
- Particle emission on mousemove (within canvas bounds)
- Dead particle cleanup (auto-remove when life <= 0)

---

### 3.4 Navigation & Smooth Scroll (lines 807-816)

**Purpose**: Smooth anchor link navigation to page sections.

**Affected Links**:
- Header: #servicios, #capacidades, #contacto
- Footer: mailto link (email, not smooth scroll)

**Behavior**: Native browser smooth scroll with 'start' alignment (top of viewport).

---

### 3.5 CTA Button Interaction (lines 818-823)

**Purpose**: Placeholder interaction for primary call-to-action.

**Current State**: Alert popup with Spanish text explaining this is a demo.
**Future**: Should redirect to contact form or integrate with form service.

---

## 4. Event Listeners Table

| Event Type | Target(s) | Handler | Purpose | Frequency |
|------------|-----------|---------|---------|-----------|
| mousemove | document | updateMouseFollower() | Track cursor position | Every pixel moved (~60 FPS) |
| mousemove | document | emit canvas particles | Create particles on hover | Every pixel within canvas |
| scroll | window | parallaxBg transform | Offset background by scroll depth | On every scroll pixel |
| resize | window | resizeCanvas() | Adapt canvas to viewport | On window resize |
| click | nav a[href^="#"] | scrollIntoView() | Smooth scroll to section | On link click |
| click | .cta-button | alert() | Show demo message | On button click |

---

## 5. Animation Engine

### Coordination of CSS & Canvas Animations

#### CSS Animations (Global)
- **glitch-anim-1**: Logo text distortion (0.3s, infinite)
- **float**: Hero gradients and parallax particles (6-15s random, infinite)
- **bounce**: Scroll indicator pulse (2s, infinite)

#### Canvas Animations (JavaScript-driven)
- **Grid**: Redrawn every frame at 50px intervals
- **Particles**: Updated via CanvasParticle.update() and .draw()
- **Life fade**: Alpha decreases 0.01 per frame, removes at 0

#### RequestAnimationFrame Usage
1. **updateMouseFollower()**: Runs every frame, interpolates cursor position
2. **animateCanvas()**: Runs every frame, redraws grid + particles

### Transform-Based Optimizations (GPU Acceleration)

| Operation | Method | GPU Accelerated |
|-----------|--------|-----------------|
| Mouse follower position | `style.left`, `style.top` | No (non-transform properties) |
| Parallax background | `transform: translateY()` | Yes |
| Service card hover | `transform: translateY(-10px)` | Yes |
| CTA button hover | `transform: scale(1.05)` | Yes |
| Icon rotation | `transform: rotate(10deg)` | Yes |
| Canvas particles | 2D canvas API (software) | No |

**Note**: Mouse follower and canvas particles use non-GPU-accelerated methods, representing potential performance bottlenecks.

---

## 6. Performance Notes

### Current Optimizations

1. **Single-file deployment** (~826 lines)
   - No external CSS or JS loads
   - Inline stylesheet avoids HTTP request
   - Faster initial render

2. **CSS transforms for movement**
   - Parallax background uses `transform: translateY()`
   - GPU-accelerated on modern browsers
   - Smooth 60 FPS on capable devices

3. **RequestAnimationFrame**
   - Mouse follower synced to browser refresh rate
   - Canvas animation frames matched to vsync
   - Avoids janky setInterval timing

4. **CSS containment via clip-path**
   - Glitch effect uses clip-path clipping
   - Pseudo-element layers reduce DOM node count

5. **Lazy particle removal**
   - Dead canvas particles spliced from array immediately
   - Prevents memory leak of expired particles

### Potential Bottlenecks

1. **Glitch animation (0.3s infinite)**
   - clip-path is not GPU-accelerated on all browsers (Safari/Firefox older versions)
   - Affects every .glitch element (logo, hero title) continuously
   - **Impact**: Low (small text area, optimized in modern browsers)

2. **Canvas grid redraw (every frame)**
   - 50 grid lines drawn repeatedly (12 + 12 lines per frame)
   - Could be offscreen buffer or static grid image
   - **Impact**: Medium (60 FPS on modern devices, noticeable on older hardware)

3. **Scroll listener + parallax**
   - Every scroll pixel triggers DOM transform
   - No throttle/debounce (fires on every scroll event)
   - **Impact**: Low-Medium (requestAnimationFrame in effect, but parallax transform on every scroll)

4. **Mouse follower with 0.1 easing**
   - Every mousemove recalculates, every frame interpolates
   - Style updates on every frame (non-transform properties)
   - **Impact**: Low (40px element, limited paint area)

5. **Canvas particle emission**
   - No particle limit (unbounded growth possible)
   - Particles auto-remove at life=0, but sustained mouse movement grows array
   - **Impact**: Medium if user hovers canvas for extended time

### Future Optimization Ideas

1. **Canvas Grid**
   - Pre-render grid to offscreen canvas or use SVG pattern
   - Reduce per-frame draw calls by 24+ operations

2. **Mouse Follower Transform**
   - Change from `style.left/top` to `transform: translate()`
   - Enable GPU acceleration, reduce repaints

3. **Scroll Throttle**
   - Add requestAnimationFrame check or debounce to parallax listener
   - Reduce transform calculations on rapid scrolling

4. **Particle Pooling**
   - Reuse particle objects instead of creating/splicing
   - Reduce garbage collection pressure

5. **Glitch Effect Optimization**
   - Use CSS @supports to detect clip-path support
   - Fallback to text-shadow or opacity for unsupported browsers

6. **Code Splitting (Future)**
   - Separate interactive modules (mouse, canvas, parallax) for conditional loading
   - Currently single file works, but separate bundles allow selective disabling

---

## 7. Component Boundaries

### Header & Navigation
- **DOM**: `<header>`, `<nav>`, `.logo` (lines 542-551)
- **Role**: Fixed global navigation with brand identifier
- **Styling**: position: fixed, z-index: 1000, glassmorphism backdrop blur
- **Interactivity**: Nav links trigger smooth scroll via anchor behavior
- **CSS Lines**: 74-126

### Service Cards
- **DOM**: `.services` grid container, 6× `.service-card` (lines 575-613)
- **Grid Layout**: auto-fit, minmax(280px, 1fr), 3 columns on desktop
- **Interactivity**: 
  - Hover: border glow, shadow, translateY, icon scale + rotate
  - Shine effect: left translate 0-100%
- **CSS Lines**: 250-328
- **Interaction**: No modal or navigation (static display)

### Capabilities Section
- **DOM**: `.capabilities` container, `.capabilities-grid` (2 columns), 6× `.capability-item` (lines 616-656)
- **Layout**: 2-column grid, 1-column mobile (768px breakpoint)
- **Styling**: 
  - Left border (4px) with color/animation on hover
  - Large number background (opacity 0.2)
  - Dark background, hover background shift
- **CSS Lines**: 330-389
- **Interaction**: Hover effect (padding shift, border color change)

### Canvas Showcase
- **DOM**: `.showcase` section, `.canvas-container`, `<canvas>` (lines 659-664)
- **Dimensions**: 600px height (400px mobile)
- **Interactivity**: 
  - Mouse movement emits particles
  - Particles fall with gravity
  - Grid background static
- **Canvas Lines**: 728-805
- **Features**: Responsive resizing, bounds checking

### Mouse Follower
- **DOM**: `.mouse-follower` fixed div (line 554)
- **Dimensions**: 40px × 40px circle
- **Positioning**: fixed, pointer-events: none, z-index: 9999
- **State**: Hidden by default, activated on first mousemove
- **Animation**: Smooth lag via 0.1 easing factor
- **CSS Lines**: 414-436
- **JS Lines**: 677-697

### Parallax Background
- **DOM**: `.parallax-bg` fixed div (line 557), contains 50× `.particle` (dynamically added)
- **Positioning**: fixed, z-index: -1 (behind content)
- **Particles**: 
  - Size: 1-4px random
  - Position: random 0-100% XY
  - Color: 4 neon colors at 10% opacity
  - Animation: float 5-15s infinite
- **Scroll Effect**: translateY(scrollY × 0.5) for depth parallax
- **CSS Lines**: 438-451
- **JS Lines**: 699-725

### Footer
- **DOM**: `<footer>` section (lines 667-674)
- **Content**: 
  - `.footer-text`: "¿Listo para transformar tu negocio?"
  - `.footer-cta`: mailto link to hello@linalabs.ar
  - Copyright/disciplines text
- **Styling**: Gradient background, border-top cyan, centered text
- **Interactivity**: Email link + hover state (color invert via fill)
- **CSS Lines**: 453-502

---

## 8. Accessibility & SEO Considerations

### Current State
- Semantic HTML (header, nav, section, footer)
- alt text for emoji icons (rendered as Unicode, not images)
- Color contrast: white text on black background (WCAG AAA)
- Meta viewport for mobile responsiveness
- No aria-labels for interactive elements
- No focus states for keyboard navigation
- Canvas content not accessible to screen readers

### Recommendations
- Add `aria-label` to mouse follower (cosmetic element, can be hidden from A11y)
- Define focus states for nav links and buttons
- Provide text alternative for canvas particle system
- Consider aria-live region for parallax indicator

---

## File References

| Component | File | Lines |
|-----------|------|-------|
| HTML Markup | index.html | 2-826 |
| CSS Variables | index.html | 14-25 |
| Animations | index.html | 36-42, 162-165, 245-248 |
| Header Styles | index.html | 74-126 |
| Hero Styles | index.html | 127-248 |
| Services Styles | index.html | 250-328 |
| Capabilities Styles | index.html | 330-389 |
| Canvas Styles | index.html | 390-411 |
| Mouse Follower JS | index.html | 677-697 |
| Parallax Particles JS | index.html | 699-725 |
| Canvas Animation JS | index.html | 727-805 |
| Navigation JS | index.html | 807-816 |
| Button Handler JS | index.html | 818-823 |
| Mobile Responsive | index.html | 505-537 |

---

**Documentation Generated**: 2026-05-06
**Status**: Complete
**Ready for**: Code Review, Future Optimization, Team Reference
