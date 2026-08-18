(function () {
  const labels = {
    "asia": { zh: "亚洲", en: "Asia" },
    "europe": { zh: "欧洲", en: "Europe" },
    "north-america": { zh: "北美", en: "North America" },
    "south-america": { zh: "南美", en: "South America" },
    "africa": { zh: "非洲", en: "Africa" },
    "oceania": { zh: "大洋洲", en: "Oceania" }
  };
  function currentLang() { return document.documentElement.lang === "en" ? "en" : "zh"; }
  function text(value) { return typeof value === "string" ? value : value && (value[currentLang()] || value.zh || value.en) || ""; }
  function regionLabel(region) { return text(labels[region]) || region; }
  function monthFromCreated(value) { const date = new Date(value || ""); return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 7); }
  function formatShootDate(value) {
    if (!value) return currentLang() === "en" ? "Not set" : "未设置";
    const parts = value.split("-");
    if (parts.length !== 2) return value;
    const year = parts[0];
    const month = Number(parts[1]);
    if (currentLang() === "en") return new Date(Date.UTC(Number(year), month - 1, 1)).toLocaleString("en", { month: "long", year: "numeric", timeZone: "UTC" });
    return year + "年" + month + "月";
  }
  const id = new URLSearchParams(window.location.search).get("id");
  let activeWork = null;
  let loadingDone = false;

  function finishLoading() {
    if (loadingDone) return;
    loadingDone = true;
    if (window.apolloLoader) window.apolloLoader.hide();
  }

  if (window.apolloLoader) window.apolloLoader.show();
  fetch("../data/works.json", { cache: "no-store" }).then((response) => response.ok ? response.json() : { works: [] }).then((catalog) => {
    const work = (catalog.works || []).find((item) => item.id === id);
    if (!work) throw new Error("not found");
    activeWork = work;
    renderWorkText();
    document.querySelector("[data-back-link]").href = "../hall.html#region-" + work.region;
    const source = document.createElement("source");
    source.src = "../" + work.videoPath;
    source.type = "video/mp4";
    const player = document.querySelector("[data-video-player]");
    player.appendChild(source);
    player.addEventListener("loadedmetadata", finishLoading, { once: true });
    player.addEventListener("canplay", finishLoading, { once: true });
    player.addEventListener("error", finishLoading, { once: true });
    player.load();
    if (player.readyState >= 1) finishLoading();
    window.setTimeout(finishLoading, 7000);
  }).catch(() => {
    finishLoading();
    document.querySelector("[data-video-title]").textContent = currentLang() === "en" ? "Work not found" : "作品不存在";
    document.querySelector("[data-video-description]").textContent = currentLang() === "en" ? "This work may have been deleted." : "这个作品可能已经被删除。";
  });

  function renderWorkText() {
    if (!activeWork) return;
    document.title = text(activeWork.title) + " | Apollo";
    document.querySelector("[data-video-title]").textContent = text(activeWork.title);
    document.querySelector("[data-video-meta]").textContent = text(activeWork.meta);
    document.querySelector("[data-video-region]").textContent = regionLabel(activeWork.region);
    document.querySelector("[data-video-region-detail]").textContent = regionLabel(activeWork.region);
    document.querySelector("[data-video-description]").textContent = text(activeWork.description);
    document.querySelector("[data-video-gear]").textContent = activeWork.gear || "Drone Camera";
    document.querySelector("[data-video-shoot-date]").textContent = formatShootDate(activeWork.shootDate || monthFromCreated(activeWork.createdAt));
  }

  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => window.setTimeout(renderWorkText, 0));
  });
})();
