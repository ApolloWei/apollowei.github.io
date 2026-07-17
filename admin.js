(function () {
  const adminPassword = "Peter";
  const repoOwner = "ApolloWei";
  const repoName = "apollowei.github.io";
  const branch = "main";
  const catalogPath = "data/works.json";
  const apiBase = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contents/";
  const lock = document.querySelector("[data-admin-lock]");
  const panel = document.querySelector("[data-admin-panel]");
  const login = document.querySelector("[data-admin-login]");
  const list = document.querySelector("[data-admin-list]");
  let catalog = { works: [] };
  let catalogSha = null;
  function showPanel() { lock.classList.add("is-hidden"); panel.classList.remove("is-hidden"); loadPublicCatalog(); }
  login.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("[data-admin-password]");
    const error = document.querySelector("[data-admin-error]");
    if (input.value === adminPassword) { window.sessionStorage.setItem("apolloAdminGranted", "true"); showPanel(); return; }
    input.value = ""; input.focus(); error.hidden = false;
  });
  if (window.sessionStorage.getItem("apolloAdminGranted") === "true") showPanel();
  function headers(token) { return { "Accept": "application/vnd.github+json", "Authorization": "Bearer " + token, "X-GitHub-Api-Version": "2022-11-28" }; }
  function slugify(value) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "video-" + Date.now(); }
  function readableError(error) {
    if (!error) return "未知错误";
    const raw = error.message || String(error);
    try {
      const parsed = JSON.parse(raw);
      if (parsed.message) return parsed.message;
    } catch (parseError) {}
    if (raw.includes("Bad credentials")) return "Token 无效，或复制时少了一部分。";
    if (raw.includes("Resource not accessible")) return "Token 没有这个仓库的 Contents: Read and write 权限。";
    if (raw.includes("Not Found")) return "Token 没有选中 ApolloWei/apollowei.github.io 这个仓库，或仓库名称不匹配。";
    if (raw.includes("too_large") || raw.includes("exceeds")) return "视频文件太大，请压缩到 70MB 以下再试。";
    if (raw.includes("Failed to fetch")) return "浏览器无法连接 GitHub API，可能是网络或浏览器拦截。";
    return raw.slice(0, 220);
  }
  function toBase64Text(text) { return btoa(unescape(encodeURIComponent(text))); }
  function fromBase64Text(text) { return decodeURIComponent(escape(atob(text.replace(/\n/g, "")))); }
  function fileToBase64(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => { const bytes = new Uint8Array(reader.result); let binary = ""; for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]); resolve(btoa(binary)); }; reader.onerror = reject; reader.readAsArrayBuffer(file); }); }
  async function getContent(token, filePath) { const response = await fetch(apiBase + encodeURIComponent(filePath).replace(/%2F/g, "/") + "?ref=" + branch, { headers: headers(token) }); if (response.status === 404) return null; if (!response.ok) throw new Error(await response.text()); return response.json(); }
  async function loadCatalogWithToken(token) { const file = await getContent(token, catalogPath); if (!file) { catalog = { works: [] }; catalogSha = null; return; } catalogSha = file.sha; catalog = JSON.parse(fromBase64Text(file.content)); if (!Array.isArray(catalog.works)) catalog.works = []; }
  async function saveContent(token, filePath, content, message, sha) { const body = { message, content, branch }; if (sha) body.sha = sha; const response = await fetch(apiBase + encodeURIComponent(filePath).replace(/%2F/g, "/"), { method: "PUT", headers: { ...headers(token), "Content-Type": "application/json" }, body: JSON.stringify(body) }); if (!response.ok) throw new Error(await response.text()); return response.json(); }
  async function deleteContent(token, filePath, message) { const file = await getContent(token, filePath); if (!file) return; const response = await fetch(apiBase + encodeURIComponent(filePath).replace(/%2F/g, "/"), { method: "DELETE", headers: { ...headers(token), "Content-Type": "application/json" }, body: JSON.stringify({ message, sha: file.sha, branch }) }); if (!response.ok) throw new Error(await response.text()); }
  function renderList() { if (!list) return; list.innerHTML = ""; if (!catalog.works.length) { list.innerHTML = '<p class="admin-note">还没有通过管理页上传的视频。</p>'; return; } catalog.works.forEach((work) => { const row = document.createElement("div"); row.className = "admin-list-item"; row.innerHTML = '<div><strong></strong><span></span></div><button class="button secondary" type="button">删除</button>'; row.querySelector("strong").textContent = work.title.zh; row.querySelector("span").textContent = work.meta.zh; row.querySelector("button").addEventListener("click", () => removeWork(work.id)); list.appendChild(row); }); }
  async function loadPublicCatalog() { try { const response = await fetch("data/works.json", { cache: "no-store" }); catalog = response.ok ? await response.json() : { works: [] }; if (!Array.isArray(catalog.works)) catalog.works = []; } catch (error) {} renderList(); }
  document.querySelector("[data-upload-form]").addEventListener("submit", async (event) => { event.preventDefault(); const status = document.querySelector("[data-upload-status]"); const form = event.currentTarget; const token = form.querySelector("[data-token]").value.trim(); const file = form.querySelector("[data-video-file]").files[0]; if (!file) return; if (file.size > 70 * 1024 * 1024) { status.textContent = "视频超过 70MB。通过 GitHub API 上传会转成 Base64，实际体积会变大，请先压缩后再上传。"; return; } status.textContent = "正在上传，请不要关闭页面..."; try { await loadCatalogWithToken(token); const titleZh = form.querySelector("[data-title-zh]").value.trim(); const titleEn = form.querySelector("[data-title-en]").value.trim(); const id = slugify(titleEn) + "-" + Date.now(); const videoPath = "assets/videos/" + id + ".mp4"; await saveContent(token, videoPath, await fileToBase64(file), "Add video " + titleEn, null); catalog.works.push({ id, region: form.querySelector("[data-region]").value, title: { zh: titleZh, en: titleEn }, meta: { zh: form.querySelector("[data-meta-zh]").value.trim(), en: form.querySelector("[data-meta-en]").value.trim() }, description: { zh: form.querySelector("[data-description-zh]").value.trim(), en: form.querySelector("[data-description-en]").value.trim() }, videoPath, createdAt: new Date().toISOString() }); const saved = await saveContent(token, catalogPath, toBase64Text(JSON.stringify(catalog, null, 2) + "\n"), "Update video catalog", catalogSha); catalogSha = saved.content.sha; status.textContent = "上传完成。GitHub Pages 可能需要几十秒更新。"; form.reset(); renderList(); } catch (error) { status.textContent = "上传失败：" + readableError(error); console.error(error); } });
  async function removeWork(id) { const status = document.querySelector("[data-delete-status]"); const token = document.querySelector("[data-delete-token]").value.trim(); if (!token) { status.textContent = "请先输入 GitHub Token。"; return; } status.textContent = "正在删除..."; try { await loadCatalogWithToken(token); const current = catalog.works.find((item) => item.id === id); if (current) await deleteContent(token, current.videoPath, "Delete video " + current.title.en); catalog.works = catalog.works.filter((item) => item.id !== id); const saved = await saveContent(token, catalogPath, toBase64Text(JSON.stringify(catalog, null, 2) + "\n"), "Update video catalog", catalogSha); catalogSha = saved.content.sha; status.textContent = "删除完成。GitHub Pages 可能需要几十秒更新。"; renderList(); } catch (error) { status.textContent = "删除失败：" + readableError(error); console.error(error); } }
})();
