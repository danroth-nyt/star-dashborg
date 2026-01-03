---
name: Visual Boost Oracle Grid
overview: Create a visual Boost Oracle component that displays a grid of 20 icon images, with a roll button that randomly selects and highlights one icon with a glowing backlight effect. Integrates into Core Oracles as an accordion.
todos:
  - id: create-boost-component
    content: Create VisualBoostOracle.jsx component with grid layout and roll functionality
    status: pending
  - id: integrate-core-oracles
    content: Replace Visual Oracle accordion in CoreOraclesTab with new component
    status: pending
  - id: add-highlight-styles
    content: Add CSS animations for icon selection glow and pulse effects
    status: pending
---

# Visual Boost Oracle Grid Component

## Overview

Create an interactive visual oracle that displays the 20 Boost Oracle icons in a grid. When rolled, one icon is randomly selected and highlighted with a glowing backlight effect, matching the retro-CRT aesthetic.

---

## Image Setup (User Action Required)

You will need to:

1. Cut out each of the 20 icons from the source image
2. Save as PNG files with transparent backgrounds
3. Place in `public/images/boost/` folder with naming convention:

   - `boost-01.png` through `boost-20.png`

Recommended size: ~80x80px or ~100x100px per icon

---

## Component Design

### New File: `src/components/oracles/VisualBoostOracle.jsx`

**Layout:**

- 4-column grid on desktop (`sm:grid-cols-4`)
- 5-column grid on larger screens for authentic 4x5 layout
- 2-column grid on mobile for touch-friendly sizing

**Features:**

- All 20 icons displayed with numbers
- Central "ROLL d20" button
- Selected icon gets cyan glow backlight effect + scale animation
- Text interpretation shown below the grid after roll
- Roll history integration via OracleHistoryContext

**Visual States:**

```
[Unselected] - Dimmed, grayscale or low opacity
[Selected]   - Full color, cyan glow, slight scale up, pulsing border
```

---

## Implementation Details

### Grid Structure

```jsx
<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
  {boostIcons.map((icon, index) => (
    <BoostIcon 
      key={index}
      number={index + 1}
      imageSrc={`/images/boost/boost-${String(index + 1).padStart(2, '0')}.png`}
      label={icon.label}
      isSelected={selectedIndex === index}
    />
  ))}
</div>
```

### Selection Animation

- Use CSS transition for smooth highlight
- Apply `glow-cyan` class + `scale-105` on selected
- Add subtle pulse animation on selection
- Dim non-selected icons with `opacity-40`

### Data Structure

Leverage existing `visualOracles.boost` array from [`src/data/oracles.js`](src/data/oracles.js) for text labels.

---

## Integration

**File:** [`src/components/oracles/OracleCompendium.jsx`](src/components/oracles/OracleCompendium.jsx) - CoreOraclesTab

**Change:** Replace the existing "Visual Oracle / Boost (d20)" accordion content:

- Remove the `OracleTable` component
- Add the new `VisualBoostOracle` component

---

## Mobile Responsiveness

| Breakpoint | Columns | Icon Size |

|------------|---------|-----------|

| < 640px    | 2       | ~70px     |

| >= 640px   | 4       | ~80px     |

| >= 1024px  | 5       | ~90px     |

Touch targets will be adequately sized (minimum 44px) for mobile use.

---

## Files to Create/Modify

1. **Create:** `src/components/oracles/VisualBoostOracle.jsx` - New component
2. **Modify:** [`src/components/oracles/OracleCompendium.jsx`](src/components/oracles/OracleCompendium.jsx) - Replace accordion content
3. **Create:** `public/images/boost/` folder + 20 PNG images (user action)