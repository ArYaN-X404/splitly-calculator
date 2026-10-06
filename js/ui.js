// js/ui.js
// Handles user interactions, DOM updates, and UI state

class SplitlyUI {
  constructor(initialState = {}) {
    this.state = {
      bill: 0,
      tipPercent: 15,
      isCustomTip: false,
      people: 1,
      roundUp: false,
      currency: "₹",
      ...initialState
    };

    this.cacheDOM();
    this.bindEvents();
    this.render();
  }

  cacheDOM() {
    this.themeToggleBtn = document.getElementById("themeToggleBtn");
    this.themeIcon = document.getElementById("themeIcon");
    this.currencySelect = document.getElementById("currencySelect");
    this.currencyPrefixes = document.querySelectorAll(".dynamic-currency");

    this.billInput = document.getElementById("billInput");
    this.billContainer = document.getElementById("billContainer");
    this.billError = document.getElementById("billError");

    this.tipChips = document.querySelectorAll(".tip-chip-btn");
    this.customTipInput = document.getElementById("customTipInput");
    this.customTipContainer = document.getElementById("customTipContainer");
    this.tipError = document.getElementById("tipError");
    this.tipSentiment = document.getElementById("tipSentiment");

    this.peopleInput = document.getElementById("peopleInput");
    this.stepperContainer = document.getElementById("stepperContainer");
    this.btnDecrement = document.getElementById("btnDecrement");
    this.btnIncrement = document.getElementById("btnIncrement");
    this.peopleError = document.getElementById("peopleError");

    this.roundUpToggle = document.getElementById("roundUpToggle");

    this.displayPerPersonTip = document.getElementById("displayPerPersonTip");
    this.displayPerPersonTotal = document.getElementById("displayPerPersonTotal");
    this.displayTotalTip = document.getElementById("displayTotalTip");
    this.displayTotalBill = document.getElementById("displayTotalBill");

    this.copySummaryBtn = document.getElementById("copySummaryBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.toast = document.getElementById("toastNotice");
    this.toastText = document.getElementById("toastText");
  }

  bindEvents() {
    if (this.billInput) {
      this.billInput.addEventListener("input", (e) => this.handleBillInput(e.target.value));
      this.billInput.addEventListener("paste", () => {
        setTimeout(() => this.handleBillInput(this.billInput.value), 0);
      });
    }

    if (this.tipChips) {
      this.tipChips.forEach((chip) => {
        chip.addEventListener("click", () => {
          const percent = parseFloat(chip.dataset.tip);
          this.selectTipPreset(percent, chip);
        });
      });
    }

    if (this.customTipInput) {
      this.customTipInput.addEventListener("input", (e) => this.handleCustomTip(e.target.value));
    }

    if (this.btnDecrement) {
      this.btnDecrement.addEventListener("click", () => this.adjustPeople(-1));
    }
    if (this.btnIncrement) {
      this.btnIncrement.addEventListener("click", () => this.adjustPeople(1));
    }
    if (this.peopleInput) {
      this.peopleInput.addEventListener("input", (e) => this.handlePeopleInput(e.target.value));
    }

    if (this.roundUpToggle) {
      this.roundUpToggle.addEventListener("change", (e) => {
        this.state.roundUp = e.target.checked;
        this.persistState();
        this.render();
      });
    }

    if (this.currencySelect) {
      this.currencySelect.addEventListener("change", (e) => {
        this.state.currency = e.target.value;
        this.updateCurrencySymbols();
        this.persistState();
        this.render();
      });
    }

    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
    }

    if (this.copySummaryBtn) {
      this.copySummaryBtn.addEventListener("click", () => this.copySummaryToClipboard());
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener("click", () => this.resetAll());
    }
  }

  handleBillInput(rawValue) {
    const { cleanString, numericValue, error } = SplitlyValidator.sanitizeDecimal(rawValue);

    if (this.billInput.value !== cleanString && (rawValue.includes("-") || /[^0-9.]/.test(rawValue))) {
      this.billInput.value = cleanString;
    }

    this.state.bill = numericValue;
    this.showError(this.billContainer, this.billError, error);
    this.render();
  }

  selectTipPreset(percent, targetChip) {
    this.state.tipPercent = percent;
    this.state.isCustomTip = false;
    this.customTipInput.value = "";
    this.customTipContainer.classList.remove("active");
    this.showError(this.customTipContainer, this.tipError, null);

    this.tipChips.forEach((btn) => btn.classList.remove("active"));
    if (targetChip) targetChip.classList.add("active");

    this.persistState();
    this.render();
  }

  handleCustomTip(rawValue) {
    this.tipChips.forEach((btn) => btn.classList.remove("active"));
    this.state.isCustomTip = true;
    this.customTipContainer.classList.add("active");

    const { cleanString, numericValue, error } = SplitlyValidator.sanitizeTipPercent(rawValue);

    if (this.customTipInput.value !== cleanString && (rawValue.includes("-") || /[^0-9.]/.test(rawValue))) {
      this.customTipInput.value = cleanString;
    }

    this.state.tipPercent = numericValue;
    this.showError(this.customTipContainer, this.tipError, error);
    this.persistState();
    this.render();
  }

  adjustPeople(delta) {
    let current = parseInt(this.state.people, 10) || 1;
    let next = Math.max(1, Math.min(100, current + delta));
    this.state.people = next;
    this.peopleInput.value = next;
    this.showError(this.stepperContainer, this.peopleError, null);
    this.persistState();
    this.render();
  }

  handlePeopleInput(rawValue) {
    const { cleanString, numericValue, error } = SplitlyValidator.sanitizePeople(rawValue);

    if (this.peopleInput.value !== cleanString && /[^0-9]/.test(rawValue)) {
      this.peopleInput.value = cleanString;
    }

    this.state.people = numericValue;
    this.showError(this.stepperContainer, this.peopleError, error);
    this.persistState();
    this.render();
  }

  showError(container, errorEl, message) {
    if (!container || !errorEl) return;
    if (message) {
      container.classList.add("has-error");
      const span = errorEl.querySelector("span");
      if (span) span.textContent = message;
      errorEl.classList.add("active");
    } else {
      container.classList.remove("has-error");
      errorEl.classList.remove("active");
    }
  }

  updateCurrencySymbols() {
    if (this.currencyPrefixes) {
      this.currencyPrefixes.forEach((el) => {
        el.textContent = this.state.currency;
      });
    }
  }

  render() {
    const results = SplitlyCalculator.calculate(this.state);

    if (this.tipSentiment) {
      const sentiment = SplitlyCalculator.getTipSentiment(this.state.tipPercent);
      this.tipSentiment.textContent = `${sentiment.emoji} ${this.state.tipPercent}% ${sentiment.label}`;
    }

    if (this.btnDecrement) {
      this.btnDecrement.disabled = this.state.people <= 1;
    }

    if (this.displayPerPersonTip) this.animateValue(this.displayPerPersonTip, results.perPersonTip);
    if (this.displayPerPersonTotal) this.animateValue(this.displayPerPersonTotal, results.perPersonTotal);
    if (this.displayTotalTip) this.animateValue(this.displayTotalTip, results.tipAmount);
    if (this.displayTotalBill) this.animateValue(this.displayTotalBill, results.total);
  }

  animateValue(element, targetNum) {
    if (!element) return;
    const formatted = SplitlyCalculator.formatCurrencyValue(targetNum);
    if (element.textContent !== formatted) {
      element.textContent = formatted;
      element.classList.remove("pulse");
      void element.offsetWidth;
      element.classList.add("pulse");
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("splitly_theme", nextTheme);

    if (this.themeIcon) {
      this.themeIcon.innerHTML = nextTheme === "dark" 
        ? `<path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z"></path>`
        : `<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>`;
    }
  }

  async copySummaryToClipboard() {
    const results = SplitlyCalculator.calculate(this.state);
    const sym = this.state.currency;

    const summaryText = 
`Splitly - Bill Summary
----------------------
Bill Amount:    ${sym} ${SplitlyCalculator.formatCurrencyValue(results.bill)}
Tip Percentage: ${results.tipPercent}%
Total Tip:      ${sym} ${SplitlyCalculator.formatCurrencyValue(results.tipAmount)}
Total Bill:     ${sym} ${SplitlyCalculator.formatCurrencyValue(results.total)}
Split Across:   ${results.people} ${results.people === 1 ? 'person' : 'people'}
${this.state.roundUp ? '(Round-Up Applied)\n' : ''}----------------------
Per Person:     ${sym} ${SplitlyCalculator.formatCurrencyValue(results.perPersonTotal)}
Tip / Person:   ${sym} ${SplitlyCalculator.formatCurrencyValue(results.perPersonTip)}
----------------------`;

    try {
      await navigator.clipboard.writeText(summaryText);
      this.showToast("Receipt copied to clipboard!");
      
      if (this.copySummaryBtn) {
        const originalHTML = this.copySummaryBtn.innerHTML;
        this.copySummaryBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `;
        setTimeout(() => {
          this.copySummaryBtn.innerHTML = originalHTML;
        }, 2000);
      }
    } catch {
      this.showToast("Could not copy automatically");
    }
  }

  showToast(message) {
    if (!this.toast || !this.toastText) return;
    this.toastText.textContent = message;
    this.toast.classList.add("show");
    setTimeout(() => {
      this.toast.classList.remove("show");
    }, 2500);
  }

  resetAll() {
    this.state = {
      bill: 0,
      tipPercent: 15,
      isCustomTip: false,
      people: 1,
      roundUp: false,
      currency: this.state.currency
    };

    if (this.billInput) this.billInput.value = "";
    if (this.customTipInput) this.customTipInput.value = "";
    if (this.customTipContainer) this.customTipContainer.classList.remove("active");
    if (this.peopleInput) this.peopleInput.value = "1";
    if (this.roundUpToggle) this.roundUpToggle.checked = false;

    if (this.tipChips) {
      this.tipChips.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.tip === "15");
      });
    }

    this.showError(this.billContainer, this.billError, null);
    this.showError(this.customTipContainer, this.tipError, null);
    this.showError(this.stepperContainer, this.peopleError, null);

    this.persistState();
    this.render();
    this.showToast("Reset to defaults");
  }

  persistState() {
    try {
      localStorage.setItem("splitly_state", JSON.stringify({
        tipPercent: this.state.tipPercent,
        people: this.state.people,
        roundUp: this.state.roundUp,
        currency: this.state.currency
      }));
    } catch (e) {
      // Ignore if localStorage unavailable
    }
  }
}

if (typeof window !== 'undefined') {
  window.SplitlyUI = SplitlyUI;
  window.Splitly = window.Splitly || {};
  window.Splitly.SplitlyUI = SplitlyUI;
}

if (typeof module !== 'undefined') {
  module.exports = SplitlyUI;
}
