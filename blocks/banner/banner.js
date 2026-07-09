/**
 * Banner
 * A top-of-page announcement / promo bar (matches the microsoft.com
 * ocr-announcement strip: centered message + optional CTA link).
 * Adds a dismiss button; once closed it stays hidden for the session.
 *
 * Authoring: a single cell with the message text and an optional link.
 */
export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  // Flatten the authored content into one content wrapper.
  const content = document.createElement('div');
  content.className = 'banner-content';
  rows.forEach((row) => {
    [...row.children].forEach((cell) => content.append(...cell.childNodes));
  });
  el.textContent = '';
  el.append(content);

  // Session dismiss memory, keyed by the message text.
  const key = `banner-dismissed:${content.textContent.trim().slice(0, 60)}`;
  try {
    if (sessionStorage.getItem(key) === '1') {
      el.setAttribute('hidden', '');
      return;
    }
  } catch (e) { /* sessionStorage unavailable — just show the banner */ }

  const close = document.createElement('button');
  close.className = 'banner-close';
  close.type = 'button';
  close.setAttribute('aria-label', 'Dismiss announcement');
  close.innerHTML = '<span class="icon icon-close" aria-hidden="true">×</span>';
  close.addEventListener('click', () => {
    el.setAttribute('hidden', '');
    try { sessionStorage.setItem(key, '1'); } catch (e) { /* ignore */ }
  });
  el.append(close);
}
