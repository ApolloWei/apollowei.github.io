(function () {
  const password = "12345";
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

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (input.value === password) {
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
