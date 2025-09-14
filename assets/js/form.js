const form = document.getElementById('quoteForm');
const statusEl = document.getElementById('formStatus');
const waLink = document.getElementById('waLink');

// Pre-select service from URL query
const params = new URLSearchParams(location.search);
const pre = params.get('service');
if (pre) {
  const sel = document.getElementById('service');
  if (sel) sel.value = pre;
}

function setError(input, message) {
  const row = input.closest('.form-row') || input.parentElement;
  const err = row.querySelector('.error');
  if (err) err.textContent = message || '';
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function validate() {
  let ok = true;
  const requiredIds = ['name','phone','service','from','to'];
  requiredIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) { setError(el, 'Required'); ok = false; }
    else setError(el, '');
  });
  const email = document.getElementById('email');
  if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    setError(email, 'Invalid email'); ok = false;
  }
  return ok;
}

function buildMessage() {
  const fields = ['name','phone','service','from','to','date','details','email'];
  const data = {};
  fields.forEach(id => {
    const el = document.getElementById(id);
    data[id] = el ? el.value.trim() : '';
  });
  const lines = [
    `Moving quote request`,
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Service: ${data.service}`,
    `From: ${data.from}`,
    `To: ${data.to}`,
    `Date: ${data.date || 'TBD'}`,
    data.email ? `Email: ${data.email}` : ``,
    data.details ? `Details: ${data.details}` : ``
  ].filter(Boolean);
  return lines.join('\n');
}

// WhatsApp deep link
function updateWaLink() {
  const msg = encodeURIComponent(buildMessage());
  waLink.href = `https://wa.me/254726898381?text=${msg}`;
}
if (waLink) {
  updateWaLink();
  document.querySelectorAll('#quoteForm input, #quoteForm select, #quoteForm textarea')
    .forEach(el => el.addEventListener('input', updateWaLink));
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate()) {
    statusEl.textContent = 'Please fix the highlighted fields.';
    return;
  }
  const message = buildMessage();
  // Option A: open email client
  const mailto = `mailto:hello@example.com?subject=${encodeURIComponent('Moving Quote Request')}&body=${encodeURIComponent(message)}`;
  window.location.href = mailto;

  statusEl.textContent = 'Opening your email client… You can also send via WhatsApp.';
});
