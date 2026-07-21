(function () {
  const container = document.querySelector("[data-comments]");
  if (!container) return;

  const databaseUrl = "https://apollo-s-video-like-default-rtdb.firebaseio.com";
  const labels = {
    zh: {
      github: "GitHub 登录留言",
      anonymous: "匿名留言",
      name: "昵称",
      message: "留言内容",
      namePlaceholder: "比如：一位访客",
      messagePlaceholder: "写下你对这条视频的感受",
      submit: "发布留言",
      loading: "正在读取匿名留言...",
      empty: "还没有匿名留言。",
      saving: "正在发布...",
      saved: "留言已发布。",
      error: "匿名留言暂时不可用，请稍后再试。",
      githubNote: "使用 GitHub 账号登录后留言。",
      anonymousNote: "无需登录，填写昵称即可留言。"
    },
    en: {
      github: "Comment with GitHub",
      anonymous: "Anonymous comments",
      name: "Name",
      message: "Comment",
      namePlaceholder: "e.g. A visitor",
      messagePlaceholder: "Share what this video made you feel",
      submit: "Post Comment",
      loading: "Loading anonymous comments...",
      empty: "No anonymous comments yet.",
      saving: "Posting...",
      saved: "Comment posted.",
      error: "Anonymous comments are unavailable. Please try again later.",
      githubNote: "Sign in with GitHub to leave a comment.",
      anonymousNote: "No sign-in needed. Add a name and comment."
    }
  };

  function currentLang() { return document.documentElement.lang === "en" ? "en" : "zh"; }
  function videoId() {
    const dynamicId = new URLSearchParams(window.location.search).get("id");
    return dynamicId || window.location.pathname.replace(/^.*\/work\//, "work/").replace(/\.html$/, "");
  }
  function safeFirebaseKey(value) { return value.replace(/[.#$\[\]/]/g, "-"); }
  function commentsUrl() {
    return databaseUrl + "/comments/" + encodeURIComponent(safeFirebaseKey(videoId())) + ".json";
  }
  function trimText(value, limit) { return value.trim().replace(/\s+/g, " ").slice(0, limit); }
  function escapeControlText(value) { return value.replace(/[<>]/g, ""); }

  container.innerHTML = `
    <div class="comment-tabs" role="tablist">
      <button class="comment-tab is-active" type="button" role="tab" aria-selected="true" data-comment-tab="github"></button>
      <button class="comment-tab" type="button" role="tab" aria-selected="false" data-comment-tab="anonymous"></button>
    </div>
    <div class="comment-panel" data-comment-panel="github">
      <p class="comment-note" data-comment-github-note></p>
      <div data-github-comments></div>
    </div>
    <div class="comment-panel is-hidden" data-comment-panel="anonymous">
      <p class="comment-note" data-comment-anonymous-note></p>
      <form class="anonymous-comment-form" data-anonymous-comment-form>
        <label><span data-comment-name-label></span><input type="text" maxlength="40" required data-comment-name></label>
        <label><span data-comment-message-label></span><textarea rows="4" maxlength="800" required data-comment-message></textarea></label>
        <button class="button primary" type="submit" data-comment-submit></button>
        <p class="comment-status" data-comment-status></p>
      </form>
      <div class="anonymous-comment-list" data-anonymous-comment-list></div>
    </div>
  `;

  const githubPanel = container.querySelector('[data-comment-panel="github"]');
  const anonymousPanel = container.querySelector('[data-comment-panel="anonymous"]');
  const anonymousList = container.querySelector("[data-anonymous-comment-list]");
  const status = container.querySelector("[data-comment-status]");
  const form = container.querySelector("[data-anonymous-comment-form]");
  const nameInput = container.querySelector("[data-comment-name]");
  const messageInput = container.querySelector("[data-comment-message]");
  let comments = [];
  let activeTab = "github";

  function applyText() {
    const text = labels[currentLang()];
    container.querySelector('[data-comment-tab="github"]').textContent = text.github;
    container.querySelector('[data-comment-tab="anonymous"]').textContent = text.anonymous;
    container.querySelector('[data-comment-github-note]').textContent = text.githubNote;
    container.querySelector('[data-comment-anonymous-note]').textContent = text.anonymousNote;
    container.querySelector('[data-comment-name-label]').textContent = text.name;
    container.querySelector('[data-comment-message-label]').textContent = text.message;
    container.querySelector('[data-comment-submit]').textContent = text.submit;
    nameInput.placeholder = text.namePlaceholder;
    messageInput.placeholder = text.messagePlaceholder;
    renderAnonymousComments();
  }
  function switchTab(nextTab) {
    activeTab = nextTab;
    container.querySelectorAll("[data-comment-tab]").forEach((tab) => {
      const active = tab.dataset.commentTab === nextTab;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    githubPanel.classList.toggle("is-hidden", nextTab !== "github");
    anonymousPanel.classList.toggle("is-hidden", nextTab !== "anonymous");
    if (nextTab === "anonymous") loadAnonymousComments();
  }
  function renderAnonymousComments() {
    if (!anonymousList) return;
    const text = labels[currentLang()];
    if (!comments.length) {
      anonymousList.innerHTML = '<p class="comment-empty"></p>';
      anonymousList.querySelector("p").textContent = text.empty;
      return;
    }
    anonymousList.innerHTML = "";
    comments.slice().sort((a, b) => a.createdAt - b.createdAt).forEach((comment) => {
      const article = document.createElement("article");
      article.className = "anonymous-comment";
      const header = document.createElement("div");
      const name = document.createElement("strong");
      const time = document.createElement("time");
      const body = document.createElement("p");
      name.textContent = comment.name;
      time.dateTime = new Date(comment.createdAt).toISOString();
      time.textContent = new Date(comment.createdAt).toLocaleString(currentLang() === "zh" ? "zh-CN" : "en", { dateStyle: "medium", timeStyle: "short" });
      body.textContent = comment.message;
      header.append(name, time);
      article.append(header, body);
      anonymousList.appendChild(article);
    });
  }
  async function loadAnonymousComments() {
    status.textContent = labels[currentLang()].loading;
    try {
      const response = await fetch(commentsUrl(), { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to read comments");
      const data = await response.json();
      comments = Object.values(data || {}).filter((comment) => comment && comment.name && comment.message && comment.createdAt);
      status.textContent = "";
      renderAnonymousComments();
    } catch (error) {
      status.textContent = labels[currentLang()].error;
    }
  }
  async function postAnonymousComment(comment) {
    const response = await fetch(commentsUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment)
    });
    if (!response.ok) throw new Error("Unable to save comment");
  }

  container.querySelectorAll("[data-comment-tab]").forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.commentTab));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = escapeControlText(trimText(nameInput.value || labels[currentLang()].namePlaceholder, 40));
    const message = escapeControlText(messageInput.value.trim()).slice(0, 800);
    if (!name || !message) return;
    status.textContent = labels[currentLang()].saving;
    try {
      const comment = { name, message, createdAt: Date.now() };
      await postAnonymousComment(comment);
      comments.push(comment);
      messageInput.value = "";
      status.textContent = labels[currentLang()].saved;
      renderAnonymousComments();
    } catch (error) {
      status.textContent = labels[currentLang()].error;
    }
  });

  const script = document.createElement("script");
  script.src = "https://utteranc.es/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.setAttribute("repo", "ApolloWei/apollowei.github.io");
  script.setAttribute("issue-term", "pathname");
  script.setAttribute("label", "comment");
  script.setAttribute("theme", "github-light");
  container.querySelector("[data-github-comments]").appendChild(script);

  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => window.setTimeout(applyText, 0));
  });

  applyText();
  switchTab(activeTab);
})();
