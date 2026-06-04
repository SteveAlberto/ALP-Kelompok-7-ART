// ──────────────────────────────────────────────────────────
//  1. FUNGSI TOAST (Notifikasi UI)
// ──────────────────────────────────────────────────────────
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

function tambahKeKeranjang(artworkId) {
    fetch(`/cart/add/${artworkId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        window.location.href = '/cart'; 
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Terjadi kesalahan sistem.', 'error');
    });
}

function checkout() {
    fetch('/cart/checkout', { method: 'POST' })
    .then(response => {
        if (response.ok) {
            showToast('Pembelian berhasil! Terima kasih.');
            setTimeout(() => { window.location.href = '/katalog'; }, 1500);
        } else {
            showToast('Gagal memproses checkout', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Terjadi kesalahan koneksi', 'error');
    });
}

// ──────────────────────────────────────────────────────────
//  2. FUNGSI CHAT / INBOX
// ──────────────────────────────────────────────────────────
function loadMessages() {
    const chatBox = document.getElementById('chat-messages');
    if (!chatBox) return; // Hanya jalankan jika elemen chat ada di halaman

    fetch('/api/chat/list')
        .then(response => response.json())
        .then(data => {
            chatBox.innerHTML = '';
            
            data.forEach(msg => {
                const div = document.createElement('div');
                div.className = 'message-bubble'; 
                
                // Styling dasar bubble chat agar rapi dan terlihat
                div.style.padding = '0.6rem 1rem';
                div.style.margin = '0.5rem 0';
                div.style.backgroundColor = 'var(--surface, #f4f4f4)';
                div.style.border = '1px solid var(--border, #ddd)';
                div.style.borderRadius = '12px';
                div.style.maxWidth = '75%';
                div.style.width = 'fit-content';
                
                div.textContent = msg.content;
                chatBox.appendChild(div);
            });
            
            // Otomatis scroll ke pesan paling bawah (terbaru)
            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(error => console.error('Error mengambil pesan:', error));
}

function sendMessage() {
    const input = document.getElementById('msg-input');
    if (!input) return;
    
    const content = input.value;
    
    // PENTING: Ganti dengan ID Seniman yang dituju (pastikan ID ini ada di database)
    const receiverId = 2; 

    if (!content.trim()) return;

    fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: receiverId, content: content })
    })
    .then(response => {
        if(response.ok) {
            input.value = ''; // Kosongkan input setelah terkirim
            loadMessages();   // Tarik ulang pesan agar yang baru muncul
        } else {
            showToast('Gagal mengirim pesan', 'error');
        }
    })
    .catch(error => console.error('Error:', error));
}


// ──────────────────────────────────────────────────────────
//  3. INIT & FUNGSI UI LAINNYA
// ──────────────────────────────────────────────────────────
function toggleDropdown() {
    const menu = document.getElementById('profile-menu');
    if (menu) menu.classList.toggle('open');
}

// Tutup dropdown jika klik di luar
document.addEventListener('click', function (e) {
    if (!e.target.closest('.profile-dropdown')) {
        const menu = document.getElementById('profile-menu');
        if (menu) menu.classList.remove('open');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    
    // Init Chat: Jika halaman yang dibuka adalah Inbox, load pesannya!
    if (document.getElementById('chat-messages')) {
        loadMessages();
    }

    // Init Dropzone
    const zone = document.getElementById('drop-zone');
    if (zone) {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('drag-over');
        });
    }

    // Init Filter Katalog
    const cards = document.querySelectorAll('.catalog-grid .artwork-card');
    const catFilters = document.querySelectorAll('.cat-filter');
    const priceRange = document.getElementById('price-range');
    const priceLabel = document.getElementById('price-max-label');
    const availFilters = document.querySelectorAll('input[name="avail"]');

    function applyFilters() {
        if (!cards.length) return;

        const activeCats = Array.from(catFilters)
            .filter(cb => cb.checked)
            .map(cb => cb.value.toLowerCase());

        const maxPrice = priceRange ? parseInt(priceRange.value) : 50000000;
        if (priceLabel) {
            priceLabel.textContent = 'Rp ' + maxPrice.toLocaleString('id-ID');
        }

        let activeStatus = 'all';
        availFilters.forEach(rb => { if (rb.checked) activeStatus = rb.value; });

        cards.forEach(card => {
            let isVisible = true;

            const catElem = card.querySelector('.art-category');
            if (catElem && activeCats.length > 0) {
                const cardCat = catElem.textContent.trim().toLowerCase();
                if (!activeCats.includes(cardCat)) isVisible = false;
            }

            const priceElem = card.querySelector('.art-price');
            if (priceElem) {
                const priceVal = parseInt(priceElem.textContent.replace(/\D/g, ''));
                if (priceVal > maxPrice) isVisible = false;
            }

            const badgeElem = card.querySelector('.art-badge');
            if (badgeElem) {
                const cardStatus = badgeElem.textContent.trim().toLowerCase();
                if (activeStatus === 'available' && cardStatus !== 'tersedia') isVisible = false;
                if (activeStatus === 'sold' && cardStatus !== 'terjual') isVisible = false;
            }

            card.style.display = isVisible ? 'block' : 'none';
        });
    }

    if (catFilters.length > 0) {
        catFilters.forEach(cb => cb.addEventListener('change', applyFilters));
        priceRange.addEventListener('input', applyFilters);
        availFilters.forEach(rb => rb.addEventListener('change', applyFilters));
    }
});