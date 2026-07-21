(function () {
  const button = document.querySelector("[data-like-button]");
  const countText = document.querySelector("[data-like-count-text]");
  const buttonText = document.querySelector("[data-like-button-text]");
  if (!button || !countText || !buttonText) return;

  const databaseUrl = "https://apollo-s-video-like-default-rtdb.firebaseio.com";
  const likedKey = "apolloLikedVideos";
  const labels = {
    zh: { button: "点赞", liked: "已点赞", loading: "正在读取赞数...", count: "{count} 个赞", error: "赞数暂时无法读取" },
    en: { button: "Like", liked: "Liked", loading: "Loading likes...", count: "{count} likes", error: "Likes are unavailable" }
  };

  function currentLang() { return document.documentElement.lang === "en" ? "en" : "zh"; }
  function videoId() {
    const dynamicId = new URLSearchParams(window.location.search).get("id");
    return dynamicId || window.location.pathname.replace(/^.*\/work\//, "work/").replace(/\.html$/, "");
  }
  function safeFirebaseKey(value) {
    return value.replace(/[.#$\[\]/]/g, "-");
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
  function likeUrl() {
    return databaseUrl + "/likes/" + encodeURIComponent(safeFirebaseKey(id)) + ".json";
  }

  const id = videoId();
  let liked = readJson(likedKey, []);
  let count = 0;
  let isLoading = true;
  let isSaving = false;
  let hasError = false;
  if (!Array.isArray(liked)) liked = [];

  function hasLiked() { return liked.includes(id); }
  function render() {
    const lang = currentLang();
    const active = hasLiked();
    button.classList.toggle("is-liked", active);
    button.disabled = isSaving || isLoading || active;
    button.setAttribute("aria-pressed", String(active));
    buttonText.textContent = active ? labels[lang].liked : labels[lang].button;
    if (hasError) countText.textContent = labels[lang].error;
    else if (isLoading) countText.textContent = labels[lang].loading;
    else countText.textContent = labels[lang].count.replace("{count}", String(count));
  }
  async function readCount() {
    isLoading = true;
    hasError = false;
    render();
    try {
      const response = await fetch(likeUrl(), { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to read likes");
      const value = await response.json();
      count = Number.isFinite(Number(value)) ? Number(value) : 0;
    } catch (error) {
      hasError = true;
    } finally {
      isLoading = false;
      render();
    }
  }
  async function incrementCount() {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const readResponse = await fetch(likeUrl(), {
        cache: "no-store",
        headers: { "X-Firebase-ETag": "true" }
      });
      if (!readResponse.ok) throw new Error("Unable to read likes");
      const etag = readResponse.headers.get("ETag");
      const value = await readResponse.json();
      const nextCount = (Number.isFinite(Number(value)) ? Number(value) : 0) + 1;
      const writeResponse = await fetch(likeUrl(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "If-Match": etag || "*"
        },
        body: JSON.stringify(nextCount)
      });
      if (writeResponse.ok) return nextCount;
      if (writeResponse.status !== 412) throw new Error("Unable to save like");
    }
    throw new Error("Unable to save like");
  }

  button.addEventListener("click", async () => {
    if (hasLiked() || isSaving || isLoading) return;
    isSaving = true;
    hasError = false;
    render();
    const previousCount = count;
    try {
      count = await incrementCount();
      liked.push(id);
      writeJson(likedKey, liked);
    } catch (error) {
      count = previousCount;
      hasError = true;
    } finally {
      isSaving = false;
      render();
    }
  });

  document.querySelectorAll("[data-lang-button]").forEach((langButton) => {
    langButton.addEventListener("click", () => window.setTimeout(render, 0));
  });

  readCount();
})();
