(function () {
  const passwordHash = "6d1addcabf07b9fccc26c02cf907dffa8a127f0fe6b1e4ea12eabe5964946c58";
  const passwordSalt = "apollo-portfolio-2026";
  const accessKey = "apolloAccessGrantedV2";
  const legacyAccessKey = "apolloAccessGranted";
  const redirectKey = "apolloRedirectAfterLogin";
  const homePage = "hall.html";
  const gatePage = "index.html";
  const accessMaxAge = 12 * 60 * 60 * 1000;

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const hash = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  async function passwordMatches(value, expectedHash) {
    return sha256(passwordSalt + ":" + value).then((hash) => hash === expectedHash).catch(() => false);
  }

  async function sessionProof(issuedAt) {
    return sha256(passwordSalt + ":access-session:" + passwordHash + ":" + issuedAt);
  }

  function clearLegacyAccess() {
    try { window.sessionStorage.removeItem(legacyAccessKey); } catch (error) {}
  }

  async function isGranted() {
    clearLegacyAccess();
    try {
      const raw = window.sessionStorage.getItem(accessKey);
      if (!raw) return false;
      const session = JSON.parse(raw);
      const issuedAt = Number(session.issuedAt);
      if (!issuedAt || Date.now() - issuedAt > accessMaxAge) {
        window.sessionStorage.removeItem(accessKey);
        return false;
      }
      return session.proof === await sessionProof(issuedAt);
    } catch (error) {
      try { window.sessionStorage.removeItem(accessKey); } catch (removeError) {}
      return false;
    }
  }

  async function setGranted() {
    const issuedAt = Date.now();
    const proof = await sessionProof(issuedAt);
    try {
      window.sessionStorage.setItem(accessKey, JSON.stringify({ issuedAt, proof }));
      clearLegacyAccess();
    } catch (error) {
      return null;
    }
    return true;
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

  async function protectPage() {
    if (!window.APOLLO_PROTECTED) return;
    if (await isGranted()) {
      document.documentElement.classList.remove("auth-locked");
      return;
    }
    saveRedirect();
    window.location.replace(gateUrl());
  }

  async function initGate() {
    const form = document.querySelector("[data-password-form]");
    const input = document.querySelector("[data-password-input]");
    const error = document.querySelector("[data-password-error]");
    if (!form || !input) return;

    if (await isGranted()) {
      window.location.replace(homePage);
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (await passwordMatches(input.value, passwordHash)) {
        await setGranted();
        window.location.href = takeRedirect() || homePage;
        return;
      }

      input.value = "";
      input.focus();
      if (error) error.hidden = false;
    });
  }

  protectPage();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGate);
  } else {
    initGate();
  }
})();
