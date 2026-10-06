# Test Cases & Verification Matrix

This document outlines the test cases for Splitly, covering mathematical calculations, input sanitization, and UI interactions.

---

## 1. Test Matrix

| ID | Category | Input / Scenario | Expected Behavior | Status |
|---|---|---|---|---|
| **TC-01** | Standard Calculation | Bill: `1000`, Tip: `15%`, People: `4` | Tip: `150.00`, Total: `1150.00`, Per-person: `287.50`, Per-person Tip: `37.50` | `PASSED` |
| **TC-02** | Decimal Preservation | Bill: `99.99`, Tip: `18%`, People: `3` | Exact 2 decimal places: Tip `18.00`, Total `117.99`, Per-person `39.33` | `PASSED` |
| **TC-03** | Round-Up Toggle | Bill: `100`, Tip: `15%`, People: `3`, RoundUp: `true` | Unrounded is `38.33`; Per-person total rounds up to `39.00` | `PASSED` |
| **TC-04** | Blank / Empty Field | Bill: `""` (empty string) | Treats as `0.00`, outputs `0.00`, zero NaN or application crash | `PASSED` |
| **TC-05** | Negative Number | Bill: `-500` or `-50` | Strips negative sign, flags inline error "Amount cannot be negative" | `PASSED` |
| **TC-06** | Alpha / Invalid Chars | Bill: `100abc25` or `12e5` | Strips non-numeric chars; keeps valid numbers `10025` | `PASSED` |
| **TC-07** | Multiple Decimals | Bill: `12.3.4` | Retains first decimal point: converts to `12.34` | `PASSED` |
| **TC-08** | Decimal Precision Clamp | Bill: `10.999` | Truncates to 2 decimal places: `10.99` | `PASSED` |
| **TC-09** | Zero People Guard | People: `0` | Clamped to minimum `1`; displays alert "At least 1 person required" | `PASSED` |
| **TC-10** | Fractional People | People: `2.5` or `3.7` | Truncates decimal and forces integer (`Math.floor`) | `PASSED` |
| **TC-11** | Custom Tip Ceiling | Tip: `150%` | Clamped to max `100%`; shows warning "Tip capped at 100%" | `PASSED` |
| **TC-12** | Negative Custom Tip | Tip: `-20%` | Clamped to `0%` | `PASSED` |
| **TC-13** | Extreme Number Capping | Bill: `999999999999` | Capped at safe financial limit: `₹9,999,999.99` | `PASSED` |
| **TC-14** | Division by Zero Guard | Backend state: `people: 0` | Math engine defaults denominator to `1`, avoiding `Infinity` | `PASSED` |
| **TC-15** | Formatter Guard | Non-numeric / `NaN` | `formatCurrencyValue()` returns `"0.00"` | `PASSED` |
| **TC-16** | Presets & Custom Desync | Select `15%` then type `20` in Custom | Chip `15%` deactivates; custom input takes precedence | `PASSED` |
| **TC-17** | Custom then Preset | Type `20` in Custom then click `25%` | Custom input is cleared; `25%` chip becomes active | `PASSED` |
| **TC-18** | Clipboard Copy | Click "Copy Summary" | Copies formatted receipt text and displays toast confirmation | `PASSED` |
| **TC-19** | Theme Persistence | Toggle to Light Mode & refresh | Theme remains Light (`localStorage` sync) | `PASSED` |
| **TC-20** | Reset State | Click "Reset All" | Restores `bill: 0`, `tip: 15%`, `people: 1`, clears errors | `PASSED` |

---

## 2. Running Automated Tests

Open `tests/test-runner.html` in your browser. All 15 automated unit tests execute synchronously and output pass/fail results for math functions, sanitizers, and edge cases.
