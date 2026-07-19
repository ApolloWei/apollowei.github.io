(function () {
  const input = document.querySelector('[data-work-search]');
  const grid = document.querySelector('.work-grid');
  if (!input || !grid) return;

  function normalized(value) {
    return (value || '').toLowerCase().trim();
  }

  function applySearch() {
    const query = normalized(input.value);
    grid.querySelectorAll('.work-card').forEach((card) => {
      const haystack = normalized(card.textContent);
      card.classList.toggle('is-search-hidden', Boolean(query) && !haystack.includes(query));
    });
  }

  input.addEventListener('input', applySearch);
  document.querySelectorAll('[data-lang-button]').forEach((button) => {
    button.addEventListener('click', () => window.setTimeout(applySearch, 0));
  });

  window.apolloApplyWorkSearch = applySearch;
})();
