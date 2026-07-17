(function () {
  const labels = { "asia": "亚洲 / Asia", "europe": "欧洲 / Europe", "north-america": "北美 / North America", "south-america": "南美 / South America", "africa": "非洲 / Africa", "oceania": "大洋洲 / Oceania" };
  function currentLang() { return document.documentElement.lang === "en" ? "en" : "zh"; }
  function text(value) { return typeof value === "string" ? value : value && (value[currentLang()] || value.zh || value.en) || ""; }
  const id = new URLSearchParams(window.location.search).get("id");
  fetch("../data/works.json", { cache: "no-store" }).then((response) => response.ok ? response.json() : { works: [] }).then((catalog) => {
    const work = (catalog.works || []).find((item) => item.id === id);
    if (!work) throw new Error("not found");
    document.title = text(work.title) + " | Apollo";
    document.querySelector("[data-video-title]").textContent = text(work.title);
    document.querySelector("[data-video-meta]").textContent = text(work.meta);
    document.querySelector("[data-video-region]").textContent = labels[work.region] || work.region;
    document.querySelector("[data-video-region-detail]").textContent = labels[work.region] || work.region;
    document.querySelector("[data-video-description]").textContent = text(work.description);
    document.querySelector("[data-video-gear]").textContent = work.gear || "Drone Camera";
    document.querySelector("[data-back-link]").href = "../hall.html#region-" + work.region;
    const source = document.createElement("source");
    source.src = "../" + work.videoPath;
    source.type = "video/mp4";
    const player = document.querySelector("[data-video-player]");
    player.appendChild(source);
    player.load();
  }).catch(() => {
    document.querySelector("[data-video-title]").textContent = "作品不存在";
    document.querySelector("[data-video-description]").textContent = "这个作品可能已经被删除。";
  });
})();
