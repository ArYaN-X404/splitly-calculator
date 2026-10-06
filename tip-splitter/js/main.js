// js/main.js
// Initialize Splitly app on page load

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('splitly_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  let savedState = {};
  try {
    const rawState = localStorage.getItem('splitly_state');
    if (rawState) {
      savedState = JSON.parse(rawState);
    }
  } catch (e) {
    // Ignore invalid JSON in localStorage
  }

  window.splitlyApp = new SplitlyUI(savedState);
});
