# Boost Oracle Icon Extraction

## Source
- **Original:** Star Borg Rulebook, Page 20 - "BOOST ORACLE"
- **Source Image:** `boost-oracle-original.png` (place original scan here)
- **Date Extracted:** 2026-01-03

## Specifications
- **Grid:** 4 columns × 5 rows = 20 icons
- **Output Format:** PNG with transparency
- **Naming Convention:** `icon_01.png` through `icon_20.png`
- **Output Size:** ~80-100px per icon
- **Color:** Cyan line art on transparent background

## Icon Mapping

| # | Icon Description | Interpretation |
|---|------------------|----------------|
| 1 | Star / Compass | Direction, Navigation |
| 2 | Skull | Death, Danger |
| 3 | Blaster | Attack, Conflict |
| 4 | Planet | World, Environment |
| 5 | Atom | Science, Energy |
| 6 | Cloaked Figure | Hidden, Secret |
| 7 | Monster Face | Beast, Wild |
| 8 | Arrow Up | Rise, Ascent |
| 9 | Remote/Device | Control, Signal |
| 10 | Bot/Droid Face | Tech, AI |
| 11 | Planet with Stars | World, Stellar |
| 12 | TIE Fighter | Enemy, Empire |
| 13 | Hand | Stop, Help |
| 14 | Spiral | Confusion, Hypnosis |
| 15 | Card/Document | Chance, Gamble |
| 16 | Boot | Kick, Travel |
| 17 | Mushrooms | Nature, Growth |
| 18 | Trash Container | Container, Loot |
| 19 | Radar/Scan | Search, Scan |
| 20 | Saber | Weapon, Power |

## Extraction Method

**Manual Process:**
1. Opened source rulebook page in image editor
2. Isolated the BOOST ORACLE grid section
3. Used crop tool to extract each icon individually
4. Removed background to create transparency
5. Saved as PNG with naming convention icon_01 through icon_20
6. Maintained aspect ratio and cyan color from original

## Usage

Icons are used in the Visual Boost Oracle component:
- **Component:** `src/components/oracles/VisualBoostOracle.jsx`
- **Grid Layout:** Responsive 2/4/5 column grid
- **Interaction:** Click to roll d20, selected icon highlights with cyan glow
- **Animation:** Slot machine cycling effect before revealing result

## Notes

- Icons maintain the retro-CRT aesthetic of the game
- Cyan color (#00f0ff) matches the app's accent-cyan theme
- Transparent backgrounds allow for flexible styling
- All 20 icons correspond to the Visual Oracle table in game rules
