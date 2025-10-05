document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const openBtn = document.querySelector('.burger');
  const closeBtn = document.querySelector('.sidebar-toggle');

  function open()  { sidebar?.classList.add('open'); }
  function close() { sidebar?.classList.remove('open'); }

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);

  document.addEventListener('click', (e) => {
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    if (!isMobile) return;
    if (!sidebar?.classList.contains('open')) return;

    if (!sidebar.contains(e.target) && !openBtn.contains(e.target)) {
      close();
    }
  });
});