/**
 * Advanced Text
 * Author syntax: (class[, class…])text(/class[, /class…])
 * Only matched open/close pairs (same classes, same order) transform;
 * anything unmatched is left untouched.
 *
 * TEXT elements (h1–h6, p, li): the matched run is wrapped in a
 *   <span class="…"> carrying the class(es).
 *     (highlight, dark)here(/highlight, /dark)
 *       -> <span class="highlight dark">here</span>
 *
 * LINKS (<a>): the class(es) are added to the <a> itself.
 *     (highlight)Shop(/highlight)  ->  <a class="highlight">Shop</a>
 *   If any class is a button style (btn / btn-*), the base "btn" class is
 *   also added and the label is wrapped in <span class="btn_text">:
 *     (btn-primary)Shop now(/btn-primary)
 *       -> <a class="btn btn-primary"><span class="btn_text">Shop now</span></a>
 */

const PATTERN = '\\(([a-zA-Z][\\w-]*(?:\\s*,\\s*[a-zA-Z][\\w-]*)*)\\)'
  + '([\\s\\S]*?)'
  + '\\(\\s*((?:\\/[a-zA-Z][\\w-]*\\s*,?\\s*)+)\\)';
const PAIR_GLOBAL = new RegExp(PATTERN, 'g');
const PAIR_ONE = new RegExp(PATTERN);

/**
 * Validate that the open list and close list are the same classes in the same
 * order. Returns the class array, or null if they don't match.
 */
function matchedClasses(open, close) {
  const opened = open.split(',').map((s) => s.trim()).filter(Boolean);
  const closed = close.split(',').map((s) => s.trim().replace(/^\//, '')).filter(Boolean);
  const ok = opened.length === closed.length
    && opened.every((cls, i) => cls === closed[i]);
  return ok ? opened : null;
}

const isButtonClass = (cls) => /^btn(-|$)/.test(cls);

/* TEXT elements → wrap matched run in a span with the class(es). */
function decorateTextNode(el) {
  el.innerHTML = el.innerHTML.replace(PAIR_GLOBAL, (match, open, inner, close) => {
    const classes = matchedClasses(open, close);
    return classes ? `<span class="${classes.join(' ')}">${inner}</span>` : match;
  });
}

/* LINKS → apply class(es) to the <a>; button styles also wrap label in span. */
function decorateAnchor(a) {
  const m = PAIR_ONE.exec(a.innerHTML);
  if (!m) return;
  const classes = matchedClasses(m[1], m[3]);
  if (!classes) return;

  const label = m[2].trim();
  if (classes.some(isButtonClass)) {
    a.classList.add('btn', ...classes);
    a.innerHTML = `<span class="btn_text">${label}</span>`;
  } else {
    a.classList.add(...classes);
    a.innerHTML = label;
  }
}

export default function init(el) {
  // Anchors first, so their tags are stripped before the text pass runs
  // (prevents the text pass from wrapping link labels in a stray span).
  el.querySelectorAll('a').forEach(decorateAnchor);
  el.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li').forEach(decorateTextNode);
}
