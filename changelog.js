(function () {
  let updates = [];

  function currentLang() {
    return document.documentElement.lang === "en" ? "en" : "zh";
  }

  function text(value) {
    return typeof value === "string" ? value : value && (value[currentLang()] || value.zh || value.en) || "";
  }

  function versionScore(version) {
    const parts = String(version || "0.0").split(".").map((part) => Number(part) || 0);
    return (parts[0] || 0) * 10 + (parts[1] || 0);
  }

  function render() {
    const rows = document.querySelector("[data-changelog-rows]");
    const summary = document.querySelector("[data-changelog-summary]");
    if (!rows) return;

    const sorted = updates.slice().sort((a, b) => versionScore(b.version) - versionScore(a.version));
    rows.innerHTML = "";
    sorted.forEach((entry) => {
      const row = document.createElement("div");
      row.className = "changelog-row";
      row.setAttribute("role", "row");
      row.innerHTML = '<div role="cell"></div><div role="cell"></div>';
      row.children[0].textContent = text(entry.description);
      row.children[1].textContent = entry.version;
      rows.appendChild(row);
    });

    if (summary) {
      const latest = sorted[0] ? sorted[0].version : "-";
      summary.textContent = currentLang() === "en" ? sorted.length + " updates · Current version " + latest : "共 " + sorted.length + " 次更新 · 当前版本 " + latest;
    }
  }

  fetch("data/changelog.json", { cache: "no-store" })
    .then((response) => response.ok ? response.json() : { updates: [] })
    .then((data) => {
      updates = Array.isArray(data.updates) ? data.updates : [];
      render();
    })
    .catch(() => {
      updates = [];
      render();
    });

  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => window.setTimeout(render, 0));
  });
})();
