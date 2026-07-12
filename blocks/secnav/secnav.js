/**
 * Secondary Nav (secnav)
 * A sticky in-page navigation bar (matches microsoft.com's `secondary-nav`):
 * a row of jump-links on the left and one or two CTAs on the right.
 *
 * Authoring: a single cell holding a list of nav links (<ul>) and a
 * paragraph with the CTA link(s). The first CTA renders as a filled
 * primary button, the second as an outline button — both reuse the
 * global .btn classes, so no button styling lives in this block.
 */
export default function init(el) {
  const cell = el.querySelector(':scope > div > div') || el;

  const list = cell.querySelector('ul');
  const links = document.createElement('nav');
  links.className = 'secnav-links';
  links.setAttribute('aria-label', 'In-page navigation');
  if (list) links.append(list);

  const actions = document.createElement('div');
  actions.className = 'secnav-actions';
  const ctas = [...cell.querySelectorAll('p a')];
  ctas.forEach((a, i) => {
    a.classList.add('btn', 'btn-primary', 'btn-sm');
    if (i > 0) a.classList.add('btn-outline');
    actions.append(a);
  });

  el.textContent = '';
  el.append(links, actions);
}
