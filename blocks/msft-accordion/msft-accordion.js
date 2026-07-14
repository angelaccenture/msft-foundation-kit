/**
 * loads and decorates the msft-accordion block
 *
 * Authored structure (one row per item):
 *   <div class="msft-accordion">
 *     <div><div> <picture> <h3>Title</h3> <p>Copy</p> </div></div>
 *     ...
 *   </div>
 *
 * Renders a single-open accordion: each item's <h3> becomes the clickable
 * summary; its image and copy become the expandable body laid out beside the
 * title list. Opening one item closes the others.
 *
 * @param {Element} block The block element
 */
export default function init(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const accordion = document.createElement('div');
  accordion.className = 'msft-accordion-items';

  const detailsEls = [];

  rows.forEach((row, idx) => {
    const cell = row.querySelector(':scope > div') || row;
    const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');

    const details = document.createElement('details');
    details.name = 'msft-accordion'; // native single-open grouping
    if (idx === 0) details.open = true;

    const summary = document.createElement('summary');
    summary.textContent = heading ? heading.textContent : '';
    details.append(summary);
    if (heading) heading.remove();

    const body = document.createElement('div');
    body.className = 'msft-accordion-item-body';
    body.append(...cell.childNodes);
    details.append(body);

    accordion.append(details);
    detailsEls.push(details);
  });

  // Fallback single-open for browsers without <details name> grouping support.
  const supportsGrouping = 'name' in document.createElement('details');
  if (!supportsGrouping) {
    detailsEls.forEach((details) => {
      details.querySelector('summary').addEventListener('click', () => {
        detailsEls.forEach((other) => {
          if (other !== details) other.open = false;
        });
      });
    });
  }

  rows.forEach((row) => row.remove());
  block.append(accordion);
}
