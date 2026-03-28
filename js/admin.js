/* ═══════════════════════════════════════════════
   WorldTV Admin Panel — Umumiy JS
   Barcha sahifalar shu faylni import qiladi
═══════════════════════════════════════════════ */

// ─────────────────────────────────────────────
// CONFIG — faqat shu yerda o'zgartiring
// ─────────────────────────────────────────────

const ADMIN_CONFIG = {
  SUPABASE_URL : 'https://wmymjjbmbkdubgzvcvyg.supabase.co',
  SERVICE_KEY  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndteW1qamJtYmtkdWJnenZjdnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM3NTEyMywiZXhwIjoyMDg5OTUxMTIzfQ.epo_yzHjeNrlDiv5tWD7p1rU7fKjmQI03hmBrgwzsaw',   // Supabase → Settings → API → service_role
  ADMIN_PASSWORD: 'worldtv_admin_2025',     // Admin panel paroli
  SESSION_KEY  : 'worldtv_admin_session',
};

// ─────────────────────────────────────────────
// AUTH — kirish tekshiruvi
// ─────────────────────────────────────────────

function isAuthenticated() {
  const session = sessionStorage.getItem(ADMIN_CONFIG.SESSION_KEY);
  return session === 'authenticated';
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

function adminLogin(password) {
  if (password === ADMIN_CONFIG.ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_CONFIG.SESSION_KEY, 'authenticated');
    return true;
  }
  return false;
}

function adminLogout() {
  if (!confirm('Admin paneldan chiqmoqchimisiz?')) return;
  sessionStorage.removeItem(ADMIN_CONFIG.SESSION_KEY);
  window.location.href = 'login.html';
}

// ─────────────────────────────────────────────
// SUPABASE API helper
// ─────────────────────────────────────────────

const SB_HEADERS = {
  get value() {
    return {
      'apikey'       : ADMIN_CONFIG.SERVICE_KEY,
      'Authorization': `Bearer ${ADMIN_CONFIG.SERVICE_KEY}`,
      'Content-Type' : 'application/json',
      'Prefer'       : 'return=representation',
    };
  }
};

async function sbFetch(endpoint, opts = {}) {
  const url = `${ADMIN_CONFIG.SUPABASE_URL}/rest/v1/${endpoint}`;
  const res = await fetch(url, {
    ...opts,
    headers: { ...SB_HEADERS.value, ...(opts.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[${res.status}] ${text}`);
  }
  const tx = await res.text();
  return tx ? JSON.parse(tx) : null;
}

// ─────────────────────────────────────────────
// SIDEBAR — mobile toggle
// ─────────────────────────────────────────────

function initSidebar() {
  const toggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    // Tashqariga bosganida yopish
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          e.target !== toggle) {
        sidebar.classList.remove('open');
      }
    });
  }
}

// ─────────────────────────────────────────────
// CLOCK
// ─────────────────────────────────────────────

function initClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const update = () => {
    el.textContent = new Date().toLocaleTimeString('uz-UZ');
  };
  update();
  setInterval(update, 1000);
}

// ─────────────────────────────────────────────
// ACTIVE NAV — joriy sahifani belgilash
// ─────────────────────────────────────────────

function initActiveNav() {
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href') || '';
    item.classList.toggle('active', href === current);
  });
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showMsg(elId, text, isError = false) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = `<div class="${isError ? 'err-msg' : 'suc-msg'}">${text}</div>`;
}

function clearMsg(elId) {
  const el = document.getElementById(elId);
  if (el) el.innerHTML = '';
}

// ─────────────────────────────────────────────
// INIT — sahifa yuklanganda
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Login sahifasi emas bo'lsa — auth tekshirish
  const isLoginPage = window.location.pathname.includes('login');
  if (!isLoginPage) requireAuth();

  initSidebar();
  initClock();
  initActiveNav();
});

