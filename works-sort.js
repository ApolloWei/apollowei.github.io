(function () {
  const grid = document.querySelector(".work-grid");
  const toggle = document.querySelector("[data-sort-toggle]");
  const menu = document.querySelector("[data-sort-menu]");
  if (!grid || !toggle || !menu) return;

  let currentSort = "";
  function currentLang() { return document.documentElement.lang === "en" ? "en" : "zh"; }
  function titleFor(card) {
    return currentLang() === "en" ? card.dataset.workTitleEn || card.textContent : card.dataset.workTitleZh || card.textContent;
  }
  function closeMenu() {
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }
  function cardList() {
    return Array.from(grid.querySelectorAll("[data-work-card]"));
  }
  function sortCards(mode) {
    const cards = cardList();
    if (mode === "time") {
      cards.sort((a, b) => Date.parse(b.dataset.workCreated || "") - Date.parse(a.dataset.workCreated || ""));
    }
    if (mode === "alpha") {
      cards.sort((a, b) => titleFor(a).localeCompare(titleFor(b), currentLang() === "zh" ? "zh-CN" : "en", { sensitivity: "base" }));
    }
    cards.forEach((card) => grid.appendChild(card));
  }
  function applySort(mode) {
    currentSort = mode || currentSort;
    if (!currentSort) return;
    sortCards(currentSort);
    if (window.apolloApplyWorkSearch) window.apolloApplyWorkSearch();
  }

  toggle.addEventListener("click", () => {
    const isOpening = menu.hidden;
    menu.hidden = !isOpening;
    toggle.setAttribute("aria-expanded", String(isOpening));
  });

  menu.querySelectorAll("[data-sort-option]").forEach((option) => {
    option.addEventListener("click", () => {
      applySort(option.dataset.sortOption);
      closeMenu();
    });
  });

  document.querySelectorAll("[data-sort-region]").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-sort-choice]")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => window.setTimeout(() => applySort(), 0));
  });

  window.apolloApplyWorkSort = applySort;
})();
