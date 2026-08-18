(function () {
  const STORAGE_KEY = "apolloThemePreference";
  const DARK_QUERY = "(prefers-color-scheme: dark)";
  const media = window.matchMedia ? window.matchMedia(DARK_QUERY) : null;

  function getStoredTheme() {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return value === "dark" || value === "light" ? value : "";
    } catch (error) {
      return "";
    }
  }

  function getSystemTheme() {
    return media && media.matches ? "dark" : "light";
  }

  function getCurrentLanguage() {
    return document.documentElement.lang === "en" ? "en" : "zh";
  }

  function getLabels(nextTheme) {
    const isEnglish = getCurrentLanguage() === "en";
    if (nextTheme === "dark") {
      return isEnglish ? "Switch to dark mode" : "切换到深色模式";
    }
    return isEnglish ? "Switch to light mode" : "切换到浅色模式";
  }

  function updateButtons(theme) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-label", getLabels(nextTheme));
      button.setAttribute("title", getLabels(nextTheme));
      button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      const icon = button.querySelector("[data-theme-icon]");
      if (icon) {
        icon.textContent = theme === "dark" ? "L" : "D";
      }
    });
  }

  function applyTheme(theme, shouldStore) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    if (shouldStore) {
      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch (error) {
        // Theme switching still works for the current page when storage is unavailable.
      }
    }
    updateButtons(theme);
  }

  function resolveTheme() {
    return getStoredTheme() || getSystemTheme();
  }

  function bindThemeButtons() {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      if (button.dataset.themeBound) {
        return;
      }
      button.dataset.themeBound = "true";
      button.addEventListener("click", () => {
        const currentTheme = document.documentElement.dataset.theme || resolveTheme();
        applyTheme(currentTheme === "dark" ? "light" : "dark", true);
      });
    });
    updateButtons(document.documentElement.dataset.theme || resolveTheme());
  }

  applyTheme(resolveTheme(), false);

  if (media) {
    const onSystemChange = () => {
      if (!getStoredTheme()) {
        applyTheme(getSystemTheme(), false);
      }
    };
    if (media.addEventListener) {
      media.addEventListener("change", onSystemChange);
    } else if (media.addListener) {
      media.addListener(onSystemChange);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindThemeButtons();
    const languageObserver = new MutationObserver(() => {
      updateButtons(document.documentElement.dataset.theme || resolveTheme());
    });
    languageObserver.observe(document.documentElement, {
      attributeFilter: ["lang"]
    });
  });
})();
