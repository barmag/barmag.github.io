// barmag — theme toggle. Persists to localStorage('barmag-theme') as 'light'|'dark'.
(function () {
  var STORAGE_KEY = 'barmag-theme';
  var root = document.documentElement;

  function current() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  function init() {
    var btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(current() === 'dark'));
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      apply(next);
      btn.setAttribute('aria-pressed', String(next === 'dark'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
