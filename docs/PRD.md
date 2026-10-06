# Product Requirements Document (PRD)

## Project: Splitly — Tip & Bill Splitter
**Status:** Complete  
**Stack:** HTML5, CSS3, Vanilla ES6+ JavaScript  

---

## 1. Problem Statement
Splitting restaurant bills with tip is error-prone when calculated manually. Diners often struggle with uneven totals, percentage tipping, and deciding who owes what.

**Splitly** provides a clean, responsive web calculator that computes tip and per-person cost live on every keystroke.

---

## 2. Target Users
- Friends and groups dining out.
- Students splitting food, groceries, or shared expenses.
- Anyone needing a quick, accurate bill split without manual calculation.

---

## 3. Goals
- Instant live results with zero calculate-button delay.
- Clean input sanitization preventing invalid values or crashes.
- Responsive design with dark/light mode and clipboard export.

---

## 4. Functional Requirements

| ID | Feature | Priority | Description |
|---|---|---|---|
| **F1** | Bill amount input | Must | Numeric input with currency symbol |
| **F2** | Preset tip buttons (5%, 10%, 15%, 20%, 25%) | Must | Quick selection chips with active highlight |
| **F3** | Custom tip input | Must | Overrides presets, clamped between 0% and 100% |
| **F4** | Number of people | Must | Stepper buttons (− / +) plus typed entry (min 1) |
| **F5** | Live outputs | Must | Tip amount, total, per-person tip, per-person total |
| **F6** | Currency formatting | Must | All figures formatted to 2 decimal places (`.toFixed(2)`) |
| **F7** | Inline validation | Must | Clean warnings for negative inputs, 0 diners, or invalid characters |
| **F8** | Reset button | Must | Resets all fields back to defaults |
| **F9** | Dark/light theme toggle | Should | Theme switch saved in `localStorage` |
| **F10** | Round-up per person | Should | Ceils each person's total to the nearest whole integer |
| **F11** | Copy summary | Could | Formats bill receipt and copies to clipboard |
| **F12** | Local storage persistence | Could | Remembers theme, currency, and tip preferences |
| **F13** | Currency selector | Could | Select between ₹ (INR), $, €, and £ |
| **F14** | Tip quality indicator | Could | Emoji pill providing feedback based on percentage |

---

## 5. Non-Functional Requirements
- **No external dependencies**: Pure vanilla web standards.
- **Responsive**: Adapts cleanly from 320px mobile screens to desktop.
- **Accessible**: Semantic markup, ARIA live labels, and clear keyboard focus rings.
- **Offline**: Functions completely offline without a backend server.
