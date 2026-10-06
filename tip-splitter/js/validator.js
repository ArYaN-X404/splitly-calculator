// js/validator.js
// Input sanitization and validation logic

const MAX_BILL_LIMIT = 9999999.99;
const MAX_PEOPLE_LIMIT = 100;
const MAX_TIP_PERCENT = 100;

function sanitizeDecimal(rawInput) {
  if (rawInput === null || rawInput === undefined) {
    return { cleanString: "", numericValue: 0, error: null };
  }

  let str = String(rawInput).trim();
  let error = null;

  if (str.includes("-")) {
    error = "Amount cannot be negative";
    str = str.replace(/-/g, "");
  }

  const stripped = str.replace(/[^0-9.]/g, "");
  if (stripped.length < str.length && !error) {
    error = "Only numbers and decimals allowed";
  }
  str = stripped;

  const parts = str.split(".");
  if (parts.length > 2) {
    str = parts[0] + "." + parts.slice(1).join("");
    error = "Multiple decimal points adjusted";
  }

  if (str.includes(".")) {
    const [whole, decimal] = str.split(".");
    if (decimal && decimal.length > 2) {
      str = `${whole}.${decimal.slice(0, 2)}`;
      error = "Limited to 2 decimal places";
    }
  }

  if (str === "" || str === ".") {
    return { cleanString: str === "." ? "0." : "", numericValue: 0, error };
  }

  let numericValue = parseFloat(str);
  if (!Number.isFinite(numericValue) || isNaN(numericValue)) {
    return { cleanString: "", numericValue: 0, error: "Please enter a valid number" };
  }

  if (numericValue > MAX_BILL_LIMIT) {
    numericValue = MAX_BILL_LIMIT;
    str = String(MAX_BILL_LIMIT);
    error = `Max limit is ₹${MAX_BILL_LIMIT.toLocaleString()}`;
  }

  return { cleanString: str, numericValue, error };
}

function sanitizePeople(rawInput) {
  if (rawInput === null || rawInput === undefined || String(rawInput).trim() === "") {
    return { cleanString: "", numericValue: 1, error: "At least 1 person required" };
  }

  let str = String(rawInput).trim();
  let error = null;

  if (str.includes(".")) {
    const parsed = parseFloat(str);
    if (Number.isFinite(parsed)) {
      str = String(Math.floor(parsed));
      error = "Number of people must be a whole number";
    }
  }

  if (/[^0-9]/.test(str)) {
    str = str.replace(/[^0-9]/g, "");
    if (!error) error = "Only whole numbers allowed";
  }

  let val = parseInt(str, 10);
  if (isNaN(val) || val <= 0) {
    return { cleanString: "1", numericValue: 1, error: "At least 1 person required" };
  }

  if (val > MAX_PEOPLE_LIMIT) {
    val = MAX_PEOPLE_LIMIT;
    str = String(MAX_PEOPLE_LIMIT);
    error = `Max limit is ${MAX_PEOPLE_LIMIT} people`;
  }

  return { cleanString: String(val), numericValue: val, error };
}

function sanitizeTipPercent(rawInput) {
  if (rawInput === null || rawInput === undefined || String(rawInput).trim() === "") {
    return { cleanString: "", numericValue: 0, error: null };
  }

  const rawStr = String(rawInput).trim();
  const isNegative = rawStr.includes("-");

  let { cleanString, numericValue, error } = sanitizeDecimal(rawInput);

  if (isNegative || numericValue < 0) {
    numericValue = 0;
    cleanString = "0";
    error = "Tip cannot be negative";
  } else if (numericValue > MAX_TIP_PERCENT) {
    numericValue = MAX_TIP_PERCENT;
    cleanString = String(MAX_TIP_PERCENT);
    error = "Tip capped at 100%";
  }

  return { cleanString, numericValue, error };
}

const SplitlyValidator = {
  MAX_BILL_LIMIT,
  MAX_PEOPLE_LIMIT,
  MAX_TIP_PERCENT,
  sanitizeDecimal,
  sanitizePeople,
  sanitizeTipPercent
};

if (typeof window !== 'undefined') {
  window.Splitly = window.Splitly || {};
  window.Splitly.validator = SplitlyValidator;
  window.SplitlyValidator = SplitlyValidator;
}

if (typeof module !== 'undefined') {
  module.exports = SplitlyValidator;
}
