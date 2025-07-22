# Game Design Document (GDD) - TownBuilder

## Overview

**Game Title:** TownBuilder  
**Engine:** Wonderland Engine  
**Developer:** Sorskoot  
**Genre:** Strategy/Survival  
**Objective:** Gather resources, build a town, and survive as long as possible.  

This project started as a one-day experiment and has potential for further development. The game focuses on resource management, town-building, and survival mechanics.

---

## Core Concepts

1. **Hexagonal Tiles:**  
   The game world is built on a grid of hexagonal tiles, allowing for unique gameplay mechanics and strategic placement of buildings and resources.

2. **Orthographic Camera:**  
   The game uses an orthographic camera to provide a clear, top-down view of the game world, enhancing visibility and precision for building placement.

3. **Building Placement:**  
   Players can place buildings on hexagonal tiles to expand their town and unlock new functionalities.

4. **Resource Gathering:**  
   AI-controlled units gather resources such as wood, stone, and food, which are essential for building and survival.

5. **Defensive Structures:**  
   Players can construct defenses to protect their town from periodic enemy attacks.

6. **Combat and Survival:**  
   Survive waves of enemy attacks by strategically managing resources and building defenses.

---

## Gameplay Mechanics

### Resource Management

- **Resources:** Wood, stone, food, and other materials.
- **Gathering:** AI units automatically gather resources from designated tiles.
- **Storage:** Resources are stored in buildings with limited capacity.

### Building System

- **Placement:** Buildings can only be placed on specific hexagonal tiles.
- **Types of Buildings:**
  - Resource buildings (e.g., lumber mills, quarries).
  - Defensive structures (e.g., walls, towers).
  - Utility buildings (e.g., storage, housing).

### AI Behavior

- **Resource Gathering AI:** Units automatically seek and gather resources.
- **Enemy AI:** Periodic waves of enemies attack the town, requiring defensive strategies.

### Combat

- **Defensive Structures:** Towers and walls can be built to fend off enemies.
- **Combat Units:** Optional AI-controlled units to assist in defense.

---

## Visual and Audio Design

### Art Style

- **Assets:** Free assets from Kay or Kenny (initially). Paid assets may be considered for future expansions.
- **Style:** Low-poly, colorful, and visually distinct for clarity.

### Camera

- **Type:** Orthographic camera for a clear, top-down view.
- **Controls:** Smooth panning and zooming for better navigation.

### Audio

- **Background Music:** Relaxing and immersive.
- **Sound Effects:** Feedback for resource gathering, building placement, and combat.

---

## Technical Details

### Engine Features

- **Hexagonal Grid System:** Custom implementation for tile-based gameplay.
- **AI Systems:** Resource gathering and enemy behavior.
- **Camera System:** Orthographic projection with smooth controls.

### Performance Considerations

- Optimize AI and rendering for large-scale towns.
- Avoid creating unnecessary objects in update loops.

---

## Future Considerations

- **Multiplayer Mode:** Cooperative or competitive gameplay.
- **Expanded Resource Types:** Introduce advanced resources for complex buildings.
- **Dynamic Events:** Random events like natural disasters or resource bonuses.
- **Paid Assets:** Upgrade visuals with premium asset packs.

---

## Assets

- **Source:** Free packs from Kay or Kenny.
- **Future Plans:** Consider paid assets for additional buildings, units, and environmental details.

---

## Conclusion

TownBuilder is a strategy/survival game that combines resource management, town-building, and combat mechanics. With its unique hexagonal grid system and orthographic camera, it offers a fresh take on the genre. The game is currently in its early stages, with potential for significant expansion.
