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
  const id = new URLSearchParams(window.location.search).get("id");
  let activeWork = null;
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
    player.load();
  }).catch(() => {
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
  }

  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => window.setTimeout(renderWorkText, 0));
  });
})();
