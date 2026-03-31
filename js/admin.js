/* ═══════════════════════════════════════════════
   WorldTV Admin Panel — Umumiy JS
   Barcha sahifalar shu faylni import qiladi
═══════════════════════════════════════════════ */

// ─────────────────────────────────────────────
// CONFIG — faqat shu yerda o'zgartiring
// ─────────────────────────────────────────────

const ADMIN_CONFIG = {
  SUPABASE_URL  : 'https://wmymjjbmbkdubgzvcvyg.supabase.co',
  SERVICE_KEY   : 'YOUR_SERVICE_ROLE_KEY',
  ADMIN_PASSWORD: 'worldtv_admin_2025',
  SESSION_KEY   : 'worldtv_admin_session',
};

// ─────────────────────────────────────────────
// SIDEBAR — barcha sahifalar uchun bir xil
// Yangi sahifa qo'shilsa — faqat shu yerda
// ─────────────────────────────────────────────

const SIDEBAR_LINKS = [
  {
    section: 'Asosiy',
    items: [
      { icon: '📊', label: 'Dashboard',        href: 'index.html'              },
      { icon: '👥', label: 'Foydalanuvchilar', href: 'users.html',    badge: '' },
      { icon: '📺', label: 'Kanallar',         href: 'channels.html'           },
      { icon: '📈', label: 'Analytics',        href: '#'                        },
    ],
  },
  {
    section: 'Moliya',
    items: [
      { icon: '💳', label: 'Obuna narxlari',   href: 'subscription-plans.html' },
      { icon: '📊', label: 'Daromadlar',        href: '#'                       },
    ],
  },
  {
    section: 'Tizim',
    items: [
      { icon: '🔔', label: 'Bildirishnomalar', href: '#',               badge: '3'  },
      { icon: '💬', label: 'Feedbacklar',      href: 'feedbacks.html', badge: ''   },
      { icon: '⚙️', label: 'Sozlamalar',       href: '#'                           },
      { icon: '📝', label: 'Loglar',           href: '#'                           },
    ],
  },
];

function buildSidebar() {
  const current  = window.location.pathname.split('/').pop() || 'index.html';
  const sections = SIDEBAR_LINKS.map(sec => {
    const items = sec.items.map(item => {
      const isActive = item.href === current;
      const badge    = item.badge !== undefined
        ? `<span class="nav-badge" id="badge-${item.label.replace(/\s/g,'')}">${item.badge}</span>`
        : '';
      return `
        <a class="nav-item ${isActive ? 'active' : ''}" href="${item.href}">
          <span class="icon">${item.icon}</span> ${item.label}${badge}
        </a>`;
    }).join('');
    return `
      <div class="nav-section">
        <div class="nav-section-label">${sec.section}</div>
        ${items}
      </div>`;
  }).join('');

  return `
    <div class="sidebar-logo">
      <div class="logo-icon">W</div>
      <div class="logo-text">World<span>TV</span></div>
      <span class="logo-badge">Admin</span>
    </div>
    ${sections}
    <div class="sidebar-footer">
      <div class="admin-card">
        <div class="admin-avatar">A</div>
        <div>
          <div class="admin-name">Admin</div>
          <div class="admin-role">Super Administrator</div>
        </div>
      </div>
      <button class="logout-btn" onclick="adminLogout()">🚪 Chiqish</button>
    </div>`;
}

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

function isAuthenticated() {
  return sessionStorage.getItem(ADMIN_CONFIG.SESSION_KEY) === 'authenticated';
}

function requireAuth() {
  if (!isAuthenticated()) window.location.href = 'login.html';
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
// SUPABASE API
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
// CLOCK
// ─────────────────────────────────────────────

function initClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const update = () => { el.textContent = new Date().toLocaleTimeString('uz-UZ'); };
  update();
  setInterval(update, 1000);
}

// ─────────────────────────────────────────────
// SIDEBAR mobile toggle
// ─────────────────────────────────────────────

function initSidebarToggle() {
  const toggle  = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== toggle) {
      sidebar.classList.remove('open');
    }
  });
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function esc(s) {
  return String(s || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showMsg(elId, text, isError = false) {
  const el = document.getElementById(elId);
  if (el) el.innerHTML = `<div class="${isError ? 'err-msg' : 'suc-msg'}">${text}</div>`;
}

function clearMsg(elId) {
  const el = document.getElementById(elId);
  if (el) el.innerHTML = '';
}

// ─────────────────────────────────────────────
// FEEDBACK BADGE — yangi xabarlar sonini ko'rsatish
// ─────────────────────────────────────────────

async function loadFeedbackBadge() {
  try {
    const data = await sbFetch('feedbacks?select=id&is_read=eq.false');
    const count = data?.length || 0;
    const badge = document.getElementById('badgeFeedbacklar');
    if (badge) {
      badge.textContent = count > 0 ? count : '';
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  } catch(e) { /* jimgina o'tkazib yuboriladi */ }
}

// ─────────────────────────────────────────────
// INIT — sahifa yuklanganda
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const isLoginPage = window.location.pathname.includes('login');
  if (!isLoginPage) requireAuth();

  // Sidebar'ni render qilish
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = buildSidebar();

  initSidebarToggle();
  initClock();

  // Feedback badge'ni yuklash (login sahifasidan tashqari)
  if (!isLoginPage) loadFeedbackBadge();
});
