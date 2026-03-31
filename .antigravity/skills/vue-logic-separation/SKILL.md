---
name: Vue & Logic Separation
description: Rules for maintaining architectural boundaries between Vue components (UI rendering) and Game/Poker Logic. Applies when making new features or refactoring codebase.
---

# Vue & Logic Separation Guidelines

The CyberPoker2077 project enforces a strict boundary between UI rendering and business logic to remain scalable. When instructed to add a new feature or modify an existing Vue component, you **MUST** follow these rules:

## 1. Vue Files are Exclusively for UI Features
- Components in `src/components/*.vue` must **ONLY** handle DOM rendering, reactive variable bindings, styling, animations, or user interactions.
- **NEVER** write raw poker rules, heavy logic calculations, math, or logic definitions directly inside a `<script setup>` tag.

## 2. Business Logic Belongs in `src/logic/`
- All calculations, game states, object manipulations, economy handling (buying, selling), and AI decision algorithms must live inside **pure JS files** under `src/logic/`.
- Examples of standard game-state holders: 
   - `store.js` (Global state management)
   - `gameEngine.js` (Poker state handling)

## 3. Communication Flow
- **Data Fetching:** Vue components read reactive variables from files like `store.js`.
- **User Actions:** When a user clicks a button, the Vue component should trigger an exported function imported from the `logic` folder. This pure-logic function modifies state and triggers reactivity.
