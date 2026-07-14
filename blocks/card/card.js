export default function init(el) {
  const inner = el.querySelector(':scope > div');
  if (!inner) return;
  inner.classList.add('card-inner');

  // Picture: authored as a bare <picture> inside its own cell div (DA wraps
  // cells in divs, not <p>). Move it into a dedicated picture container.
  const pic = el.querySelector('picture');
  if (pic) {
    const picCell = pic.closest(':scope > div > div') || pic.closest('div');
    const picDiv = document.createElement('div');
    picDiv.className = 'card-picture-container';
    picDiv.append(pic);
    inner.insertAdjacentElement('afterbegin', picDiv);
    if (picCell && picCell !== picDiv) picCell.remove();
  }

  // Content: the remaining unclassed cell holds eyebrow, heading, copy, CTA.
  const con = inner.querySelector(':scope > div:not([class])');
  if (con) con.classList.add('card-content-container');

  // CTA: last paragraph containing a link.
  const ctaPara = con?.querySelector(':scope > p:last-of-type');
  const cta = ctaPara?.querySelector('a');
  if (cta) {
    if (el.classList.contains('hash-aware')) {
      cta.href = `${cta.getAttribute('href')}${window.location.hash}`;
    }
    ctaPara.classList.add('card-cta-container');
    inner.append(ctaPara);
  }
}
