(function () {
  const MIN_VISIBLE_MS = 520;
  let loader = null;
  let shownAt = 0;
  let hideTimer = 0;

  function ensureLoader() {
    if (loader || !document.body) return loader;
    loader = document.createElement("div");
    loader.className = "page-loader";
    loader.hidden = true;
    loader.setAttribute("role", "status");
    loader.setAttribute("aria-live", "polite");
    loader.setAttribute("aria-label", "Loading");
    loader.innerHTML = '<div class="page-loader-box"><svg class="page-loader-spinner" viewBox="0 0 52 52" aria-hidden="true" focusable="false"><circle cx="26" cy="26" r="20"></circle></svg></div>';
    document.body.appendChild(loader);
    return loader;
  }

  function show() {
    const node = ensureLoader();
    if (!node) return;
    window.clearTimeout(hideTimer);
    shownAt = Date.now();
    node.hidden = false;
    document.documentElement.classList.add("is-page-loading");
    window.requestAnimationFrame(() => {
      node.classList.add("is-visible");
    });
  }

  function hide() {
    if (!loader) return;
    const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt));
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      loader.classList.remove("is-visible");
      document.documentElement.classList.remove("is-page-loading");
      window.setTimeout(() => {
        if (!loader.classList.contains("is-visible")) loader.hidden = true;
      }, 220);
    }, remaining);
  }

  function isPlainLeftClick(event) {
    return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  }

  function shouldShowForLink(link, event) {
    if (!link || event.defaultPrevented || !isPlainLeftClick(event)) return false;
    if (link.target && link.target !== "_self") return false;
    if (link.hasAttribute("download")) return false;

    const rawHref = link.getAttribute("href") || "";
    if (!rawHref || rawHref.startsWith("#")) return false;
    if (/^(mailto:|tel:|javascript:)/i.test(rawHref)) return false;

    const url = new URL(rawHref, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return false;
    return true;
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest ? event.target.closest("a[href]") : null;
    if (shouldShowForLink(link, event)) show();
  });

  window.addEventListener("pageshow", hide);
  window.addEventListener("pagehide", hide);

  window.apolloLoader = { show, hide };
})();
