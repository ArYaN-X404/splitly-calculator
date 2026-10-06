# Technical Requirements Document (TRD)

## Project: Splitly — Tip & Bill Splitter
**Stack:** HTML5, CSS3, ES6+ JavaScript  
**Architecture:** Decoupled Model-View (Pure Math Engine + DOM Controller)  

---

## 1. System Architecture

The application separates calculation logic from DOM presentation:

```
┌────────────────────────────────────────────────────────┐
│                   Browser DOM Layer                    │
│   (index.html, base.css, components.css, variables.css) │
└───────────────────────────▲────────────────────────────┘
                            │ User Input / Click Events
                            ▼
┌────────────────────────────────────────────────────────┐
│                      ui.js                             │
│     (Event Listeners, UI State Cache, DOM Renderer)     │
└──────────────┬───────────────────────────▲─────────────┘
               │                           │ Calculated Values
               │ Raw Strings               │
               ▼                           │
┌──────────────────────────────┐           │
│         validator.js         │           │
│ (Regex, Clamping, Sanitizer) │           │
└──────────────┬───────────────┘           │
               │ Sanitized Numbers         │
               ▼                           │
┌──────────────────────────────────────────┴─────────────┐
│                     calculator.js                      │
│        (Pure Math Functions, Integer Rounding)         │
└────────────────────────────────────────────────────────┘
```

### Module Responsibilities:
1. **`calculator.js`**: Contains pure math functions with zero DOM access. Takes numeric inputs and returns calculated totals.
2. **`validator.js`**: Sanitizes user inputs, strips non-numeric characters, clamps values, and prevents division by zero.
3. **`ui.js`**: Coordinates DOM events, passes inputs through validator and calculator, and renders formatted numbers to the screen.
4. **`main.js`**: Loads stored preferences from `localStorage` and initializes the application.

---

## 2. Core Formulas

```
tipAmount      = bill * (tipPercent / 100)
total          = bill + tipAmount
perPersonTip   = tipAmount / people
perPersonTotal = total / people
```

If the round-up toggle is active, `perPersonTotal` is rounded up using `Math.ceil()`.

---

## 3. Handling Floating Point Precision

In JavaScript, binary floating-point representation can cause small rounding errors (e.g. `0.1 + 0.2 === 0.30000000000000004`).

To prevent precision issues:
```javascript
function roundToTwoDecimals(num) {
  if (!Number.isFinite(num) || isNaN(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
```
All numbers are rounded to exact integer cents/paise before being formatted with `.toFixed(2)` for display.

---

## 4. Input Sanitization Rules

| Condition | Handling |
|---|---|
| Empty Field | Treated as 0, displayed as 0.00 |
| Negative Number (`-50`) | Stripped of `-`, clamped to 0, warning shown |
| Letters / Symbols (`100abc`) | Stripped with regex `/[^0-9.]/g` |
| Multiple Decimals (`12.3.4`) | Keeps only the first decimal point (`12.34`) |
| Decimal Overflow (`10.999`) | Truncated to 2 decimal places (`10.99`) |
| Zero Diners (`0`) | Clamped to minimum 1 with alert |
| Decimal People (`2.5`) | Floored to integer (`2`) |
| Custom Tip > 100 | Clamped to 100% with warning |
| Negative Custom Tip | Clamped to 0% |
| Division by Zero | Denominator guarded to always be >= 1 |
