//  BAGIAN: DATA KARYA SENI
const artworks = [
  { id:1, title:'Fragmentasi Ruang Kosong', artist:'Andi Prasetyo',  price:4500000,  category:'digital',   status:'available', grad:'art-grad-1' },
  { id:2, title:'Fluiditas Dinamis',        artist:'Sari Dewi',      price:12000000, category:'lukisan',   status:'available', grad:'art-grad-2' },
  { id:3, title:'Ethereal Motion',          artist:'Sita Devi',      price:45000000, category:'patung',    status:'available', grad:'art-grad-3' },
  { id:4, title:'Digital Horizon',          artist:'Raka Jurnal',    price:8200000,  category:'digital',   status:'available', grad:'art-grad-4' },
  { id:5, title:'Oceanic Chaos',            artist:'Meila Jaarsma',  price:32000000, category:'lukisan',   status:'sold',      grad:'art-grad-6' },
  { id:6, title:'Data Flow v2.0',           artist:'Denny R.',       price:5500000,  category:'digital',   status:'available', grad:'art-grad-7' },
  { id:7, title:'Semburat Senja #04',       artist:'Budi Santoso',   price:12500000, category:'lukisan',   status:'available', grad:'art-grad-8' },
  { id:8, title:'Struktur Linear v.1',      artist:'Arsitel Senja',  price:6800000,  category:'digital',   status:'available', grad:'art-grad-9' },
];

const catLabel = { digital:'Digital', lukisan:'Lukisan', patung:'Patung' };
const catClass  = { digital:'cat-digital', lukisan:'cat-lukisan', patung:'cat-patung' };

// Keranjang belanja (disimpan di memori sesi)
let cart = [];

//  BAGIAN: TOAST NOTIFIKASI (dipakai semua halaman)

function showToast(pesan, tipe = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${tipe}`;
  toast.innerHTML = `
    <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    ${pesan}
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ─────────────────────────────────────────────
//  BAGIAN: KERANJANG BELANJA
// ─────────────────────────────────────────────
function tambahKeKeranjang(artworkId) {
  const karya = artworks.find(a => a.id === artworkId);
  if (!karya) return;

  // Cek apakah sudah ada di keranjang
  const sudahAda = cart.find(item => item.id === artworkId);
  if (sudahAda) {
    showToast('Karya sudah ada di keranjang', 'error');
    return;
  }

  cart.push({ ...karya });
  updateCartBadge();
  showToast('Karya ditambahkan ke keranjang!');
}

function hapusDariKeranjang(artworkId) {
  cart = cart.filter(item => item.id !== artworkId);
  updateCartBadge();
  renderKeranjang();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  badge.textContent = cart.length;
  badge.style.display = cart.length > 0 ? 'flex' : 'none';
}

function renderKeranjang() {
  const container = document.getElementById('cart-items');
  const totalEl   = document.getElementById('cart-total');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:3rem 0;color:var(--text-muted)">
        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24" style="margin:0 auto 1rem">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <p>Keranjang masih kosong</p>
        <a href="catalog.html" class="btn btn-primary btn-sm" style="margin-top:1rem">Lihat Katalog</a>
      </div>
    `;
    if (totalEl) totalEl.textContent = 'Rp 0';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="${item.grad}" style="width:70px;height:70px;border-radius:var(--radius);flex-shrink:0"></div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;font-size:0.9rem">${item.title}</div>
        <div style="font-size:0.78rem;color:var(--text-muted)">oleh ${item.artist}</div>
        <div style="font-weight:700;color:var(--navy);margin-top:0.25rem">Rp ${item.price.toLocaleString('id-ID')}</div>
      </div>
      <button class="btn btn-ghost btn-sm" style="color:var(--danger);flex-shrink:0" onclick="hapusDariKeranjang(${item.id})">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
        </svg>
      </button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  if (totalEl) totalEl.textContent = 'Rp ' + total.toLocaleString('id-ID');
}

function checkout() {
  if (cart.length === 0) {
    showToast('Keranjang masih kosong', 'error');
    return;
  }
  cart = [];
  updateCartBadge();
  renderKeranjang();
  showToast('Pembelian berhasil! Terima kasih.');
}


// ─────────────────────────────────────────────
//  BAGIAN: CATALOG — render & filter kartu
// ─────────────────────────────────────────────
function buatKartu(a) {
  return `
    <div class="artwork-card card" onclick="window.location='catalog-detail.html'">
      <div class="art-img-wrap">
        <div class="${a.grad}" style="width:100%;height:100%"></div>
        <div class="art-badge" ${a.status === 'sold' ? 'style="background:var(--danger)"' : ''}>
          ${a.status === 'sold' ? 'Terjual' : 'Tersedia'}
        </div>
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <div class="art-overlay">
          <span style="color:white;font-size:0.8rem;font-weight:600">Lihat Detail →</span>
        </div>
      </div>
      <div class="art-info">
        <div class="art-title">${a.title}</div>
        <div class="art-artist">oleh ${a.artist}</div>
        <div class="art-footer">
          <div class="art-price">Rp ${a.price.toLocaleString('id-ID')}</div>
          <div class="art-category ${catClass[a.category]}">${catLabel[a.category]}</div>
        </div>
      </div>
    </div>
  `;
}

function renderGrid(list) {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  const hitungEl = document.getElementById('catalog-count');
  if (hitungEl) hitungEl.textContent = `Menampilkan ${list.length} karya`;

  grid.innerHTML = list.length > 0
    ? list.map(buatKartu).join('')
    : '<p style="color:var(--text-muted);padding:2rem 0">Tidak ada karya yang cocok.</p>';
}

function filterCards() {
  const teks     = (document.getElementById('catalog-search')?.value || '').toLowerCase();
  const cats     = [...document.querySelectorAll('.cat-filter:checked')].map(el => el.value);
  const maxPrice = parseInt(document.getElementById('price-range')?.value || 50000000);
  const avail    = document.querySelector('input[name="avail"]:checked')?.value || 'all';
  const urutan   = document.getElementById('sort-select')?.value || 'newest';

  let hasil = artworks.filter(a => {
    const cocokTeks   = !teks || a.title.toLowerCase().includes(teks) || a.artist.toLowerCase().includes(teks);
    const cocokKat    = cats.length === 0 || cats.includes(a.category);
    const cocokHarga  = a.price <= maxPrice;
    const cocokStatus = avail === 'all' || a.status === avail;
    return cocokTeks && cocokKat && cocokHarga && cocokStatus;
  });

  if (urutan === 'price-asc')  hasil.sort((a, b) => a.price - b.price);
  if (urutan === 'price-desc') hasil.sort((a, b) => b.price - a.price);

  renderGrid(hasil);
}

function updatePriceLabel() {
  const range = document.getElementById('price-range');
  const label = document.getElementById('price-max-label');
  if (!range || !label) return;
  const v = parseInt(range.value);
  label.textContent = 'Rp ' + v.toLocaleString('id-ID') + (v >= 50000000 ? '+' : '');
}

function resetFilters() {
  // Reset semua checkbox kategori
  document.querySelectorAll('.cat-filter').forEach(el => el.checked = false);

  // Reset harga
  const range = document.getElementById('price-range');
  if (range) range.value = 50000000;
  updatePriceLabel();

  // Reset radio ketersediaan ke "semua"
  const radioAll = document.querySelector('input[name="avail"][value="all"]');
  if (radioAll) radioAll.checked = true;

  // Reset search
  const search = document.getElementById('catalog-search');
  if (search) search.value = '';

  // Reset sort
  const sort = document.getElementById('sort-select');
  if (sort) sort.value = 'newest';

  // Tampilkan semua karya
  renderGrid(artworks);
}


// ─────────────────────────────────────────────
//  BAGIAN: INDEX — navigasi search
// ─────────────────────────────────────────────
function handleNavSearch(e) {
  if (e.key === 'Enter' && e.target.value.trim()) {
    window.location = 'catalog.html';
  }
}


// ─────────────────────────────────────────────
//  BAGIAN: CATALOG DETAIL — thumbnail gallery
// ─────────────────────────────────────────────
function selectThumb(el, grad) {
  document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');

  const main = document.getElementById('main-img');
  if (!main) return;
  main.className = grad;
  main.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;';
  main.innerHTML = `
    <svg width="64" height="64" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  `;
}

function beliKarya() {
  // Tambah karya pertama ke keranjang (simulasi), lalu ke halaman cart
  tambahKeKeranjang(1);
  setTimeout(() => window.location = 'cart.html', 600);
}


// ─────────────────────────────────────────────
//  BAGIAN: INBOX / CHAT
// ─────────────────────────────────────────────
let activePerson = 'Julian Voss';

const contacts = [
  { name: 'Julian Voss',     avatar: 'J', preview: "I've attached the latest sketches...", time: '10:43 AM', unread: 2 },
  { name: 'Elena Rodriguez', avatar: 'E', preview: 'The commission looks great!',           time: 'Yesterday', unread: 0 },
  { name: 'Marcus Chen',     avatar: 'M', preview: 'Is the canvas still available?',        time: 'Mon',       unread: 1 },
];

const messages = {
  'Julian Voss': [
    { from: 'them', text: "Hi! I've finished the initial concept for the \"Modern Brutalist\" piece. Would you like to take a look?", time: '10:42 AM' },
    { from: 'me',   text: "That sounds perfect! Please send them over — I'm particularly interested in the lighting on the lower quadrant.", time: '10:45 AM' },
    { from: 'them', text: "I've attached the latest sketches. Let me know what you think.", time: '10:47 AM', img: true },
  ],
  'Elena Rodriguez': [
    { from: 'them', text: 'The commission looks great! When can I expect delivery?', time: 'Yesterday' },
    { from: 'me',   text: "Estimated 2 weeks for shipping. I'll send tracking once packed.", time: 'Yesterday' },
  ],
  'Marcus Chen': [
    { from: 'them', text: 'Is the canvas still available for shipping?', time: 'Mon' },
  ],
};

function renderContacts(list) {
  const el = document.getElementById('chat-list');
  if (!el) return;
  el.innerHTML = list.map(c => `
    <div class="chat-item ${c.name === activePerson ? 'active' : ''}" onclick="selectChat('${c.name}')">
      <div class="chat-item-avatar">${c.avatar}</div>
      <div class="chat-item-info">
        <div class="chat-item-name">${c.name}</div>
        <div class="chat-item-preview">${c.preview}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.35rem;flex-shrink:0">
        <div class="chat-item-time">${c.time}</div>
        ${c.unread ? `<div style="width:18px;height:18px;background:var(--navy);color:white;border-radius:50%;font-size:0.7rem;font-weight:700;display:flex;align-items:center;justify-content:center">${c.unread}</div>` : ''}
      </div>
    </div>
  `).join('');
}

function renderMessages(name) {
  const msgs    = messages[name] || [];
  const contact = contacts.find(c => c.name === name);
  if (!contact) return;

  const headerEl = document.getElementById('chat-main-header');
  if (headerEl) {
    headerEl.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="chat-item-avatar" style="width:40px;height:40px;font-size:1rem">${contact.avatar}</div>
        <div>
          <div style="font-weight:700;font-size:0.95rem">${name}</div>
          <div style="font-size:0.75rem;color:var(--success)">● Online</div>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-ghost btn-sm">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.29h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.93a16 16 0 0 0 6.06 6.06l.92-.92a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </button>
        <button class="btn btn-ghost btn-sm">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </div>
    `;
  }

  const msgEl = document.getElementById('chat-messages');
  if (!msgEl) return;
  msgEl.innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem">
      <span style="font-size:0.75rem;color:var(--text-muted);background:var(--surface-2);padding:0.25rem 0.75rem;border-radius:99px">HARI INI</span>
    </div>
    ${msgs.map(m => `
      <div class="message-row ${m.from === 'me' ? 'me' : 'them'}">
        ${m.from === 'them' ? `<div class="chat-item-avatar" style="width:32px;height:32px;font-size:0.8rem;flex-shrink:0">${contact.avatar}</div>` : ''}
        <div>
          <div class="message-bubble ${m.from === 'me' ? 'bubble-me' : 'bubble-them'}">
            ${m.text}
            ${m.img ? `
              <div style="margin-top:0.75rem;border-radius:var(--radius);overflow:hidden;max-width:200px">
                <div class="art-grad-3" style="width:200px;height:140px;display:flex;align-items:center;justify-content:center">
                  <svg width="32" height="32" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              </div>` : ''}
          </div>
          <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.25rem;${m.from === 'me' ? 'text-align:right' : ''}">${m.time}</div>
        </div>
        ${m.from === 'me' ? `<div class="chat-item-avatar" style="width:32px;height:32px;font-size:0.8rem;background:var(--navy);flex-shrink:0">A</div>` : ''}
      </div>
    `).join('')}
  `;
  msgEl.scrollTop = msgEl.scrollHeight;
}

function selectChat(name) {
  activePerson = name;
  const c = contacts.find(c => c.name === name);
  if (c) c.unread = 0;
  renderContacts(contacts);
  renderMessages(name);
}

function filterChats(q) {
  const filtered = contacts.filter(c => c.name.toLowerCase().includes(q.toLowerCase()));
  renderContacts(filtered);
}

function sendMessage() {
  const input = document.getElementById('msg-input');
  const text  = input?.value.trim();
  if (!text) return;

  if (!messages[activePerson]) messages[activePerson] = [];
  const now  = new Date();
  const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
  messages[activePerson].push({ from: 'me', text, time });
  input.value = '';
  renderMessages(activePerson);

  // Auto-reply setelah 1 detik
  setTimeout(() => {
    const balasan = ['Terima kasih pesannya!', 'Saya akan segera mengeceknya.', 'Baik, saya konfirmasi.', 'Noted!'];
    const t = new Date();
    messages[activePerson].push({
      from: 'them',
      text: balasan[Math.floor(Math.random() * balasan.length)],
      time: t.getHours() + ':' + String(t.getMinutes()).padStart(2, '0'),
    });
    renderMessages(activePerson);
  }, 1200);
}


// ─────────────────────────────────────────────
//  BAGIAN: UPLOAD — form & pricing calculator
// ─────────────────────────────────────────────
function handleFile(input) {
  const file = input.files[0];
  if (!file) return;
  const zone = document.getElementById('drop-zone');
  if (!zone) return;
  zone.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem">
      <svg width="32" height="32" fill="none" stroke="var(--sage)" stroke-width="2" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <div style="font-weight:600">${file.name}</div>
      <div style="font-size:0.75rem;color:var(--text-muted)">${(file.size / 1024 / 1024).toFixed(1)} MB · Siap diupload</div>
    </div>
  `;
}

function calcPrice() {
  const biaya = parseFloat(document.getElementById('calc-biaya')?.value) || 0;
  const waktu = parseFloat(document.getElementById('calc-waktu')?.value) || 0;
  const diff  = document.querySelector('input[name="diff"]:checked')?.value || 'basic';
  const mult  = { basic: 2.5, intermediate: 3.5, advanced: 5 }[diff];
  const rec   = Math.round((biaya + waktu * 50000) * mult / 10000) * 10000;

  const recEl   = document.getElementById('rec-price');
  const finalEl = document.getElementById('final-price');
  const prevEl  = document.getElementById('preview-price');
  if (recEl)   recEl.textContent  = 'Rp ' + rec.toLocaleString('id-ID');
  if (finalEl) finalEl.value      = rec;
  if (prevEl)  prevEl.textContent = 'Rp ' + rec.toLocaleString('id-ID');
}

function updatePreview() {
  const title = document.getElementById('art-title')?.value;
  const cat   = document.getElementById('art-category')?.value;
  const titleEl = document.getElementById('preview-title');
  const catEl   = document.getElementById('preview-cat');
  if (titleEl) titleEl.textContent = title || 'Judul Karya Anda';
  if (catEl && cat) {
    catEl.textContent = cat;
    catEl.className = 'art-category cat-' + cat.toLowerCase();
  }
}

function updatePreviewPrice() {
  const v = parseInt(document.getElementById('final-price')?.value) || 0;
  const el = document.getElementById('preview-price');
  if (el) el.textContent = 'Rp ' + v.toLocaleString('id-ID');
}

function submitArtwork() {
  const title  = document.getElementById('art-title')?.value;
  const cat    = document.getElementById('art-category')?.value;
  const cerita = document.getElementById('art-story')?.value;
  if (!title || !cat || !cerita) {
    showToast('Lengkapi semua field yang wajib', 'error');
    return;
  }
  showToast('Karya berhasil disubmit! Menunggu review.');
  setTimeout(() => window.location = 'dashboard.html', 1500);
}


// ─────────────────────────────────────────────
//  BAGIAN: INIT — jalankan saat halaman siap
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

  // Update cart badge di semua halaman
  updateCartBadge();

  // ── Catalog ──
  if (document.getElementById('catalog-grid')) {
    renderGrid(artworks);
  }

  // ── Inbox ──
  if (document.getElementById('chat-list')) {
    renderContacts(contacts);
    renderMessages('Julian Voss');

    const msgInput = document.getElementById('msg-input');
    if (msgInput) {
      msgInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
    }
  }

  // ── Cart ──
  if (document.getElementById('cart-items')) {
    renderKeranjang();
  }

  // ── Upload drop zone ──
  const zone = document.getElementById('drop-zone');
  if (zone) {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) {
        zone.innerHTML = `
          <div style="text-align:center">
            <svg width="32" height="32" fill="none" stroke="var(--sage)" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <div style="font-weight:600;margin-top:0.5rem">${file.name}</div>
          </div>
        `;
      }
    });
  }

});


// ─────────────────────────────────────────────
//  BAGIAN: PROFILE DROPDOWN
// ─────────────────────────────────────────────
function toggleDropdown() {
  const menu = document.getElementById('profile-menu');
  if (menu) menu.classList.toggle('open');
}

// Tutup dropdown kalau klik di luar
document.addEventListener('click', function (e) {
  if (!e.target.closest('.profile-dropdown')) {
    const menu = document.getElementById('profile-menu');
    if (menu) menu.classList.remove('open');
  }
});