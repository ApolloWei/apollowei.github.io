(function () {
  const button = document.querySelector("[data-like-button]");
  const countText = document.querySelector("[data-like-count-text]");
  const buttonText = document.querySelector("[data-like-button-text]");
  if (!button || !countText || !buttonText) return;

  const countsKey = "apolloVideoLikeCounts";
  const likedKey = "apolloLikedVideos";
  const labels = {
    zh: { button: "点赞", liked: "已点赞", count: "{count} 个赞" },
    en: { button: "Like", liked: "Liked", count: "{count} likes" }
  };

  function currentLang() { return document.documentElement.lang === "en" ? "en" : "zh"; }
  function videoId() {
    const dynamicId = new URLSearchParams(window.location.search).get("id");
    return dynamicId || window.location.pathname.replace(/^.*\/work\//, "work/").replace(/\.html$/, "");
  }
  function readJson(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }
  function writeJson(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (error) {}
  }

  const id = videoId();
  let counts = readJson(countsKey, {});
  let liked = readJson(likedKey, []);
  if (!Array.isArray(liked)) liked = [];
  if (!Number.isFinite(Number(counts[id]))) counts[id] = 0;

  function hasLiked() { return liked.includes(id); }
  function render() {
    const lang = currentLang();
    const total = Number(counts[id]) || 0;
    const active = hasLiked();
    button.classList.toggle("is-liked", active);
    button.setAttribute("aria-pressed", String(active));
    buttonText.textContent = active ? labels[lang].liked : labels[lang].button;
    countText.textContent = labels[lang].count.replace("{count}", String(total));
  }

  button.addEventListener("click", () => {
    if (hasLiked()) return;
    liked.push(id);
    counts[id] = (Number(counts[id]) || 0) + 1;
    writeJson(likedKey, liked);
    writeJson(countsKey, counts);
    render();
  });

  document.querySelectorAll("[data-lang-button]").forEach((langButton) => {
    langButton.addEventListener("click", () => window.setTimeout(render, 0));
  });

  render();
})();
