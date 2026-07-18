(function () {
  const container = document.querySelector('[data-comments]');
  if (!container) return;

  const script = document.createElement('script');
  script.src = 'https://utteranc.es/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.setAttribute('repo', 'ApolloWei/apollowei.github.io');
  script.setAttribute('issue-term', 'pathname');
  script.setAttribute('label', 'comment');
  script.setAttribute('theme', 'github-light');
  container.appendChild(script);
})();
