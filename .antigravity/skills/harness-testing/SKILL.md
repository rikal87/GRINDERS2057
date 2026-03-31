---
name: Harness Testing
description: Rules and guidelines for creating, managing, and running test files in the CyberPoker2077 project. Use this skill whenever the user asks to write a test, verify logic, or simulate a scenario.
---

# Testing Guidelines

When the user asks you to create a test script to verify logic or simulate a poker scenario, you **MUST** follow these rules:

## 1. File Location Rule
- **NEVER** create temporary test files (e.g., `test_logic.js`, `test.js`, `simulate.js`) in the root directory (`d:\github-repository\CyberPoker2077\`).
- **ALWAYS** place your test scripts inside the `harness/` directory or its appropriate subdirectories (e.g., `harness/scenarios/`, `harness/temp_tests/`).

## 2. Examples
- If you are creating a simple one-off verification script, use `harness/temp_tests/[descriptive_name].js`.
- If you are creating a reusable scenario, use `harness/scenarios/[scenario_name].js`.

## 3. Why?
The `harness` directory is the standard location for all testing and verification in this project. Keeping the root directory clean is a priority.

## 4. Referencing Data
When writing tests that need to import logic from the engine, adjust your imports knowing that your script is inside `harness/temp_tests/` or `harness/scenarios/`.

Example Import:
```javascript
import { PotManager } from '../../src/logic/PotManager.js';
// or
import { getProbabilisticAction } from '../../src/logic/aiEngine.v2.js';
```
