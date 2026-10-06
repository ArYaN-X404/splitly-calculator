// js/calculator.js
// Pure math functions for tip, bill, and per-person split calculations

// Scaled integer rounding to avoid floating-point drift (e.g. 0.1 + 0.2)
function roundToTwoDecimals(num) {
  if (!Number.isFinite(num) || isNaN(num)) return 0;
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function calculateTipAmount(bill, tipPercent) {
  const safeBill = Math.max(0, Number(bill) || 0);
  const safePercent = Math.max(0, Number(tipPercent) || 0);
  return roundToTwoDecimals((safeBill * safePercent) / 100);
}

function calculateTotal(bill, tipAmount) {
  const safeBill = Math.max(0, Number(bill) || 0);
  const safeTip = Math.max(0, Number(tipAmount) || 0);
  return roundToTwoDecimals(safeBill + safeTip);
}

function calculatePerPerson(total, tipAmount, people, roundUp = false) {
  const safePeople = Math.max(1, Math.floor(Number(people) || 1));
  const safeTotal = Math.max(0, Number(total) || 0);
  const safeTip = Math.max(0, Number(tipAmount) || 0);

  let perPersonTip = roundToTwoDecimals(safeTip / safePeople);
  let perPersonTotal = roundToTwoDecimals(safeTotal / safePeople);
  let roundUpAdjustment = 0;

  if (roundUp && perPersonTotal > 0) {
    const ceiled = Math.ceil(perPersonTotal);
    roundUpAdjustment = roundToTwoDecimals(ceiled - perPersonTotal);
    perPersonTotal = ceiled;
  }

  return {
    perPersonTip,
    perPersonTotal,
    roundUpAdjustment
  };
}

function calculate(state) {
  const bill = Math.max(0, Number(state.bill) || 0);
  const tipPercent = Math.max(0, Number(state.tipPercent) || 0);
  const people = Math.max(1, Math.floor(Number(state.people) || 1));
  const roundUp = Boolean(state.roundUp);

  const tipAmount = calculateTipAmount(bill, tipPercent);
  const total = calculateTotal(bill, tipAmount);
  const { perPersonTip, perPersonTotal, roundUpAdjustment } = calculatePerPerson(
    total,
    tipAmount,
    people,
    roundUp
  );

  return {
    bill,
    tipPercent,
    people,
    tipAmount,
    total,
    perPersonTip,
    perPersonTotal,
    roundUpAdjustment
  };
}

function formatCurrencyValue(num) {
  if (!Number.isFinite(num) || isNaN(num)) return "0.00";
  return Number(num).toFixed(2);
}

function getTipSentiment(percent) {
  const p = Number(percent) || 0;
  if (p === 0) return { label: "Standard", emoji: "😐" };
  if (p < 10) return { label: "Fair", emoji: "🙂" };
  if (p <= 15) return { label: "Good", emoji: "😊" };
  if (p < 25) return { label: "Great!", emoji: "🤩" };
  return { label: "Generous", emoji: "🚀" };
}

const SplitlyCalculator = {
  roundToTwoDecimals,
  calculateTipAmount,
  calculateTotal,
  calculatePerPerson,
  calculate,
  formatCurrencyValue,
  getTipSentiment
};

if (typeof window !== 'undefined') {
  window.Splitly = window.Splitly || {};
  window.Splitly.calculator = SplitlyCalculator;
  window.SplitlyCalculator = SplitlyCalculator;
}

if (typeof module !== 'undefined') {
  module.exports = SplitlyCalculator;
}
