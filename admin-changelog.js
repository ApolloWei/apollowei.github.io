(function () {
  const repoOwner = "ApolloWei";
  const repoName = "apollowei.github.io";
  const branch = "main";
  const changelogPath = "data/changelog.json";
  const apiBase = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contents/";
  const tokenStorageKey = "apolloGithubToken";
  const form = document.querySelector("[data-changelog-form]");
  if (!form) return;

  const select = form.querySelector("[data-changelog-select]");
  const versionInput = form.querySelector("[data-changelog-version]");
  const zhInput = form.querySelector("[data-changelog-description-zh]");
  const enInput = form.querySelector("[data-changelog-description-en]");
  const dateInput = form.querySelector("[data-changelog-date]");
  const status = form.querySelector("[data-changelog-status]");
  const list = form.querySelector("[data-changelog-list]");
  let changelog = { updates: [] };
  let changelogSha = null;

  function savedToken() {
    try { return window.localStorage.getItem(tokenStorageKey) || ""; } catch (error) { return ""; }
  }

  function storeToken(token, shouldRemember) {
    try {
      if (shouldRemember && token) window.localStorage.setItem(tokenStorageKey, token);
      if (!shouldRemember) window.localStorage.removeItem(tokenStorageKey);
    } catch (error) {}
  }

  function fillSavedToken() {
    const token = savedToken();
    if (!token) return;
    const input = form.querySelector("[data-changelog-token]");
    const remember = form.querySelector("[data-changelog-remember-token]");
    if (input && !input.value) input.value = token;
    if (remember) remember.checked = true;
  }

  function headers(token) {
    return { "Accept": "application/vnd.github+json", "Authorization": "Bearer " + token, "X-GitHub-Api-Version": "2022-11-28" };
  }

  function toBase64Text(text) { return btoa(unescape(encodeURIComponent(text))); }
  function fromBase64Text(text) { return decodeURIComponent(escape(atob(text.split("\n").join("")))); }

  function readableError(error) {
    const raw = error && error.message ? error.message : String(error || "未知错误");
    try { const parsed = JSON.parse(raw); if (parsed.message) return parsed.message; } catch (parseError) {}
    if (raw.includes("Bad credentials")) return "Token 无效，或复制时少了一部分。";
    if (raw.includes("Resource not accessible")) return "Token 没有这个仓库的 Contents: Read and write 权限。";
    if (raw.includes("Not Found")) return "Token 没有选中 ApolloWei/apollowei.github.io 这个仓库，或仓库名称不匹配。";
    if (raw.includes("Failed to fetch")) return "浏览器无法连接 GitHub API，可能是网络或浏览器拦截。";
    return raw.slice(0, 220);
  }

  function versionScore(version) {
    const parts = String(version || "0.0").split(".").map((part) => Number(part) || 0);
    return (parts[0] || 0) * 10 + (parts[1] || 0);
  }

  function todayValue() {
    return new Date().toISOString().slice(0, 10);
  }

  function nextVersion() {
    const sorted = changelog.updates.slice().sort((a, b) => versionScore(b.version) - versionScore(a.version));
    const latest = sorted[0] ? String(sorted[0].version) : "0.9";
    const parts = latest.split(".").map((part) => Number(part) || 0);
    let major = parts[0] || 0;
    let minor = (parts[1] || 0) + 1;
    if (minor >= 10) { major += 1; minor = 0; }
    return major + "." + minor;
  }

  async function getContent(token, filePath) {
    const response = await fetch(apiBase + encodeURIComponent(filePath).replace(/%2F/g, "/") + "?ref=" + branch, { headers: headers(token) });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }

  async function loadWithToken(token) {
    const file = await getContent(token, changelogPath);
    if (!file) { changelog = { updates: [] }; changelogSha = null; return; }
    changelogSha = file.sha;
    changelog = JSON.parse(fromBase64Text(file.content));
    if (!Array.isArray(changelog.updates)) changelog.updates = [];
  }

  async function saveWithToken(token) {
    const body = {
      message: "Update changelog",
      content: toBase64Text(JSON.stringify(changelog, null, 2) + "\n"),
      branch
    };
    if (changelogSha) body.sha = changelogSha;
    const response = await fetch(apiBase + encodeURIComponent(changelogPath).replace(/%2F/g, "/"), {
      method: "PUT",
      headers: { ...headers(token), "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(await response.text());
    const saved = await response.json();
    changelogSha = saved.content.sha;
  }

  function render() {
    const sorted = changelog.updates.slice().sort((a, b) => versionScore(b.version) - versionScore(a.version));
    select.innerHTML = '<option value="">新增版本</option>';
    sorted.forEach((entry) => {
      const option = document.createElement("option");
      option.value = entry.version;
      option.textContent = entry.version;
      select.appendChild(option);
    });
    if (list) {
      list.innerHTML = "";
      sorted.forEach((entry) => {
        const row = document.createElement("div");
        row.className = "admin-list-item";
        row.innerHTML = "<div><strong></strong><span></span></div>";
        row.querySelector("strong").textContent = entry.version + (entry.date ? " · " + entry.date : "");
        row.querySelector("span").textContent = entry.description && entry.description.zh ? entry.description.zh : "";
        row.addEventListener("click", () => { select.value = entry.version; fillForm(entry.version); });
        list.appendChild(row);
      });
    }
    if (!versionInput.value) versionInput.value = nextVersion();
    if (dateInput && !dateInput.value) dateInput.value = todayValue();
  }

  function fillForm(version) {
    const entry = changelog.updates.find((item) => item.version === version);
    if (!entry) {
      versionInput.value = nextVersion();
      zhInput.value = "";
      enInput.value = "";
      if (dateInput) dateInput.value = todayValue();
      return;
    }
    versionInput.value = entry.version;
    zhInput.value = entry.description && entry.description.zh ? entry.description.zh : "";
    enInput.value = entry.description && entry.description.en ? entry.description.en : "";
    if (dateInput) dateInput.value = entry.date || todayValue();
  }

  async function loadPublic() {
    try {
      const response = await fetch("data/changelog.json", { cache: "no-store" });
      changelog = response.ok ? await response.json() : { updates: [] };
      if (!Array.isArray(changelog.updates)) changelog.updates = [];
    } catch (error) {
      changelog = { updates: [] };
    }
    render();
  }

  select.addEventListener("change", () => fillForm(select.value));
  form.querySelector("[data-changelog-new]").addEventListener("click", () => {
    select.value = "";
    versionInput.value = nextVersion();
    zhInput.value = "";
    enInput.value = "";
    if (dateInput) dateInput.value = todayValue();
    zhInput.focus();
  });
  form.querySelector("[data-changelog-delete]").addEventListener("click", async () => {
    const token = form.querySelector("[data-changelog-token]").value.trim();
    const version = select.value;
    if (!version) { status.textContent = "请先选择要删除的版本。"; return; }
    status.textContent = "正在删除更新日志...";
    try {
      storeToken(token, form.querySelector("[data-changelog-remember-token]").checked);
      await loadWithToken(token);
      changelog.updates = changelog.updates.filter((entry) => entry.version !== version);
      await saveWithToken(token);
      status.textContent = "更新日志已删除。GitHub Pages 可能需要几十秒更新。";
      select.value = "";
      fillForm("");
      render();
    } catch (error) {
      status.textContent = "删除失败：" + readableError(error);
      console.error(error);
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const token = form.querySelector("[data-changelog-token]").value.trim();
    const version = versionInput.value.trim();
    if (!version) { status.textContent = "请填写版本号。"; return; }
    status.textContent = "正在保存更新日志...";
    try {
      storeToken(token, form.querySelector("[data-changelog-remember-token]").checked);
      await loadWithToken(token);
      const existing = changelog.updates.find((entry) => entry.version === version);
      const nextEntry = {
        version,
        date: dateInput ? dateInput.value : todayValue(),
        description: { zh: zhInput.value.trim(), en: enInput.value.trim() }
      };
      if (existing) Object.assign(existing, nextEntry);
      else changelog.updates.push(nextEntry);
      changelog.updates.sort((a, b) => versionScore(b.version) - versionScore(a.version));
      await saveWithToken(token);
      status.textContent = "更新日志已保存。GitHub Pages 可能需要几十秒更新。";
      render();
      select.value = version;
    } catch (error) {
      status.textContent = "保存失败：" + readableError(error);
      console.error(error);
    }
  });

  fillSavedToken();
  loadPublic();
})();
