const followBtn = document.querySelector('.author__urls-wrapper button');
if (followBtn) {
  followBtn.addEventListener('click', function() {
    document.querySelector('.author__urls').classList.toggle('is--visible');
  });
}

const linkIcon = '@@ICON:link@@'; // replaced at build time with an inline SVG span
document.querySelectorAll('.page__content :is(h1,h2,h3,h4,h5,h6)[id]').forEach(function(h) {
  const a = document.createElement('a');
  a.className = 'header-link';
  a.href = '#' + h.id;
  a.title = 'Permalink';
  a.setAttribute('aria-label', 'Permalink');
  a.innerHTML = linkIcon;
  h.appendChild(a);
});
