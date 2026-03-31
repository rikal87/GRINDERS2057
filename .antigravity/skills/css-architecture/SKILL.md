---
name: CSS Architecture
description: Strict guidelines for creating, refactoring, and modifying CSS files for Vue components to support responsive design. Applies when the user asks to change the UI or CSS layout.
---

# CSS Architecture Guidelines

The CyberPoker2077 project uses a strict **Triple-File CSS Architecture** to handle responsive UI across Desktop and Mobile devices.

When adding or modifying CSS for a component, you **MUST** adhere to the following rules:

## 1. Triple File Structure
Every UI component should have its styles divided into three separate files inside `src/styles/components/`:

- **Base Styles**: `{Component}.css`
  - Contains colors, typographies, borders, basic paddings, box-shadows, and generic properties.
  - E.g., `background: var(--neon-magenta);`

- **Desktop Layout**: `{Component}-layout-desktop.css`
  - Contains layout specific rules for larger screens: Grid/Flexbox setups, widths, heights, complex positioning.
  - Note: Try to preserve original desktop optimizations when refactoring.

- **Mobile Layout**: `{Component}-layout-mobile.css`
  - Contains mobile-specific overrides and media queries.
  - Used for stacking UI elements vertically, scaling down font sizes, or hiding non-essential elements on small screens.

## 2. No Inline/Scoped Styles
- Do not write complex or layout-altering CSS directly inside `<style scoped>` blocks in the `.vue` files. Keep the styles centralized in the `src/styles/components/` folder for maintainability.

## 3. Global Constants
- Always utilize variables defined in `global-layout.css` for consistent thematic colors (like the Cyberpunk neon magenta or cyan).
