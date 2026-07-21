(function () {
  const passwordHash = "6d1addcabf07b9fccc26c02cf907dffa8a127f0fe6b1e4ea12eabe5964946c58";
  const passwordSalt = "apollo-portfolio-2026";
  const accessKey = "apolloAccessGranted";
  const redirectKey = "apolloRedirectAfterLogin";
  const homePage = "hall.html";
  const gatePage = "index.html";

  function isGranted() {
    try {
      return window.sessionStorage.getItem(accessKey) === "true";
    } catch (error) {
      return false;
    }
  }

  function setGranted() {
    try {
      window.sessionStorage.setItem(accessKey, "true");
    } catch (error) {
      return null;
    }
    return true;
  }

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const hash = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function passwordMatches(value, expectedHash) {
    return sha256(passwordSalt + ":" + value).then((hash) => hash === expectedHash).catch(() => false);
  }

  function saveRedirect() {
    try {
      window.sessionStorage.setItem(redirectKey, window.location.href);
    } catch (error) {
      return null;
    }
    return true;
  }

  function takeRedirect() {
    try {
      const redirect = window.sessionStorage.getItem(redirectKey);
      window.sessionStorage.removeItem(redirectKey);
      return redirect;
    } catch (error) {
      return null;
    }
  }

  function gateUrl() {
    const path = window.location.pathname;
    const isWorkPage = path.includes("/work/");
    return isWorkPage ? "../" + gatePage : gatePage;
  }

  if (window.APOLLO_PROTECTED && !isGranted()) {
    saveRedirect();
    window.location.replace(gateUrl());
    return;
  }

  function initGate() {
    const form = document.querySelector("[data-password-form]");
    const input = document.querySelector("[data-password-input]");
    const error = document.querySelector("[data-password-error]");
    if (!form || !input) return;

    if (isGranted()) {
      window.location.replace(homePage);
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (await passwordMatches(input.value, passwordHash)) {
        setGranted();
        window.location.href = takeRedirect() || homePage;
        return;
      }

      input.value = "";
      input.focus();
      if (error) error.hidden = false;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGate);
  } else {
    initGate();
  }
})();
