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

// ──────────────────────────────────────────────────────────
//  2. FUNGSI KERANJANG BELANJA (Interaksi ke Java)
// ──────────────────────────────────────────────────────────
function tambahKeKeranjang(artworkId) {
    fetch(`/cart/add/${artworkId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            showToast('Karya berhasil masuk ke keranjang!');
        } else {
            showToast('Gagal menambahkan karya. Pastikan sudah login.', 'error');
        }
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
            setTimeout(() => { window.location.href = '/catalog'; }, 1500);
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
//  3. FUNGSI UI LAINNYA (Dropdown, dll)
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

// Init saat halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
    // Dropzone logic (opsional, simpan jika masih pakai fitur upload)
    const zone = document.getElementById('drop-zone');
    if (zone) {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            // Tambahkan logika upload file jika perlu
        });
    }
});