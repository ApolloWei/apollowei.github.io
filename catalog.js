(function () {
  const regionLabels = {
    "asia": { zh: "亚洲作品", en: "Asia Works" },
    "europe": { zh: "欧洲作品", en: "Europe Works" },
    "north-america": { zh: "北美作品", en: "North America Works" },
    "south-america": { zh: "南美作品", en: "South America Works" },
    "africa": { zh: "非洲作品", en: "Africa Works" },
    "oceania": { zh: "大洋洲作品", en: "Oceania Works" }
  };
  let works = [];
  function currentLang() { return document.documentElement.lang === "en" ? "en" : "zh"; }
  function text(value) { return typeof value === "string" ? value : value && (value[currentLang()] || value.zh || value.en) || ""; }
  function ensurePanel(region) {
    const existing = document.querySelector("#region-" + region);
    if (existing) return existing;
    const lists = document.querySelector(".region-lists");
    if (!lists) return null;
    const label = regionLabels[region] || { zh: region, en: region };
    const panel = document.createElement("section");
    panel.className = "region-panel dynamic-work";
    panel.id = "region-" + region;
    panel.innerHTML = '<div><p class="eyebrow">' + label.en + '</p><h3>' + text(label) + '</h3></div>';
    lists.appendChild(panel);
    return panel;
  }
  function renderRegionItem(work) {
    const item = document.createElement("a");
    item.className = "region-item dynamic-work";
    item.href = "work/video.html?id=" + encodeURIComponent(work.id);
    item.innerHTML = "<span></span><strong></strong>";
    item.querySelector("span").textContent = text(work.meta);
    item.querySelector("strong").textContent = text(work.title);
    return item;
  }
  function renderWorkCard(work) {
    const article = document.createElement("article");
    article.className = "work-card dynamic-work";
    article.innerHTML = '<a><div class="thumb video-thumb"></div><div class="work-card-copy"><span></span><h3></h3><p></p></div></a>';
    const link = article.querySelector("a");
    link.href = "work/video.html?id=" + encodeURIComponent(work.id);
    link.setAttribute("aria-label", text(work.title));
    article.querySelector("span").textContent = text(work.meta);
    article.querySelector("h3").textContent = text(work.title);
    article.querySelector("p").textContent = text(work.description);
    return article;
  }
  function render() {
    document.querySelectorAll(".dynamic-work").forEach((node) => node.remove());
    works.forEach((work) => {
      const panel = ensurePanel(work.region);
      if (panel) panel.appendChild(renderRegionItem(work));
      const grid = document.querySelector(".work-grid");
      if (grid) grid.appendChild(renderWorkCard(work));
    });
    if (window.apolloApplyRegionFilter) window.apolloApplyRegionFilter();
  }
  fetch("data/works.json", { cache: "no-store" }).then((response) => response.ok ? response.json() : { works: [] }).then((catalog) => {
    works = Array.isArray(catalog.works) ? catalog.works : [];
    render();
  }).catch(() => {});
  document.querySelectorAll("[data-lang-button]").forEach((button) => button.addEventListener("click", () => window.setTimeout(render, 0)));
})();
