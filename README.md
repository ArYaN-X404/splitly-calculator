# Splitly — Tip & Bill Splitter

A lightweight, zero-dependency tip and bill split calculator built with vanilla HTML, CSS, and JavaScript. Computes totals and per-person splits live as you type, with strict input sanitization, floating-point rounding fixes, and dark/light mode.

---

## Features

- **Live Calculations**: Recalculates immediately on the `input` event without needing a "Calculate" button.
- **Defensive Sanitization**: Blocks negative values, strips letters and invalid symbols, handles multiple decimals (`12.3.4` -> `12.34`), and truncates extra decimals (`10.999` -> `10.99`).
- **People Stepper & Typed Input**: Increase/decrease buttons plus direct integer input. Prevents zero or fractional diners.
- **Round-Up Option**: Toggle to round each person's total up to the nearest whole rupee/dollar.
- **Copy Summary**: Formats an itemized bill breakdown and copies it to the clipboard.
- **Theme & Preferences**: Dark and light modes with smooth transitions. Preserves theme, currency, and tip preferences in `localStorage`.
- **Currency Support**: Switch between ₹ (INR), $ (USD), € (EUR), and £ (GBP).
- **Tip Quality Feedback**: Subtle emoji indicator based on the selected tip percentage.

---

## Project Structure

```
tip-splitter/
├── index.html            # Semantic HTML layout
├── css/
│   ├── variables.css     # Colors, spacing, and theme variables
│   ├── base.css          # Reset, body styling, background noise
│   └── components.css    # Cards, buttons, inputs, responsive layout
├── js/
│   ├── calculator.js     # Pure math functions (no DOM logic)
│   ├── validator.js      # Input sanitization and limits
│   ├── ui.js             # Event listeners, state handling, DOM rendering
│   └── main.js           # Bootstraps the app on page load
├── assets/
│   └── noise.svg         # Background texture
├── docs/
│   ├── PRD.md            # Product Requirements Document
│   ├── TRD.md            # Technical Requirements Document
│   └── README.md
└── tests/
    ├── test-cases.md     # Test checklist and edge cases
    └── test-runner.html  # In-browser test runner
```

---

## Architecture

The project separates logic into three layers:

1. **Validator (`validator.js`)**:
   Cleans user input before it touches application state. Strips disallowed characters with regular expressions and enforces boundaries (e.g. capping tips at 100%, people at 100, bills at ₹9,999,999.99).

2. **Calculator (`calculator.js`)**:
   Pure functions with zero DOM dependencies. To eliminate JavaScript floating-point errors (such as `0.1 + 0.2 === 0.30000000000000004` and `1.005.toFixed(2) === "1.00"`), all figures are rounded using scaled integer math (`Math.round((n + Number.EPSILON) * 100) / 100`) before string formatting.

3. **UI Controller (`ui.js`)**:
   Maintains a single state object (`bill`, `tipPercent`, `people`, `roundUp`, `currency`), binds event listeners, triggers recalculation, and updates the DOM.

---

## How to Run

### 1. Open in Browser
Double-click `index.html` or `tip-splitter/index.html` to open it locally. No build tools or local servers required.

### 2. Run Automated Tests
Open `tests/test-runner.html` or `tip-splitter/tests/test-runner.html` in your browser. It runs 15 unit tests verifying calculations, sanitization, and edge cases.

---

## Edge Cases Handled

| Case | Input | Handling |
|---|---|---|
| Blank Bill | `""` | Treated as 0.00 without NaN |
| Negative Amount | `-500` | Negative sign stripped, warning displayed |
| Letters / Symbols | `100abc25` | Non-numeric characters stripped to `10025` |
| Multiple Dots | `12.3.4` | Kept only first dot (`12.34`) |
| Decimal Overflow | `10.999` | Truncated to 2 decimal places (`10.99`) |
| Zero Diners | `0` | Clamped to minimum 1 with alert |
| Decimal People | `2.5` | Floored to whole integer (`2`) |
| Custom Tip > 100 | `150` | Clamped to 100% with warning |
| Negative Tip | `-20` | Clamped to 0% |
