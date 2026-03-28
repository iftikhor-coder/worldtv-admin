/* ═══════════════════════════════════════════════
   WorldTV Admin — Dashboard JS
   Faqat index.html ishlatadi
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // Chart.js defaults
  Chart.defaults.color        = '#5a5f78';
  Chart.defaults.borderColor  = '#1d1f2b';

  // ─────────────────────────────────────────────
  // Foydalanuvchilar dinamikasi (line chart)
  // ─────────────────────────────────────────────

  const labels = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.getDate() + '/' + (d.getMonth() + 1);
  });

  const userData = Array.from({ length: 30 }, (_, i) =>
    Math.floor(8000 + Math.sin(i / 3) * 1500 + i * 150 + Math.random() * 400)
  );

  const usersCtx = document.getElementById('usersChart');
  if (usersCtx) {
    new Chart(usersCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label          : 'Foydalanuvchilar',
          data           : userData,
          borderColor    : '#6c7bff',
          backgroundColor: 'rgba(108,123,255,0.08)',
          borderWidth    : 2,
          pointRadius    : 0,
          fill           : true,
          tension        : 0.4,
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 7 } },
          y: {
            grid : { color: '#1d1f2b' },
            ticks: { callback: v => v.toLocaleString() }
          }
        }
      }
    });
  }

  // ─────────────────────────────────────────────
  // Qurilma turlari (doughnut chart)
  // ─────────────────────────────────────────────

  const deviceCtx = document.getElementById('deviceChart');
  if (deviceCtx) {
    new Chart(deviceCtx, {
      type: 'doughnut',
      data: {
        labels  : ['Android Phone', 'Smart TV', 'Tablet', 'Fire TV'],
        datasets: [{
          data           : [58, 27, 10, 5],
          backgroundColor: ['#6c7bff', '#3ddc97', '#ffc15e', '#ff5f6d'],
          borderWidth    : 0,
          hoverOffset    : 6,
        }]
      },
      options: {
        cutout : '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels  : { padding: 14, boxWidth: 10, usePointStyle: true }
          }
        }
      }
    });
  }

  // ─────────────────────────────────────────────
  // Top mamlakatlar jadvali
  // ─────────────────────────────────────────────

  const countries = [
    { flag: '🇺🇿', name: "O'zbekiston", users: 3840, pct: 85 },
    { flag: '🇷🇺', name: "Rossiya",      users: 2210, pct: 52 },
    { flag: '🇺🇸', name: "AQSh",         users: 1640, pct: 40 },
    { flag: '🇩🇪', name: "Germaniya",    users: 980,  pct: 24 },
    { flag: '🇹🇷', name: "Turkiya",      users: 870,  pct: 21 },
  ];

  const tbody = document.getElementById('countries-table');
  if (tbody) {
    countries.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="flag">${c.flag}</span>${c.name}</td>
        <td style="font-family:var(--font-mono);font-size:.8rem">${c.users.toLocaleString()}</td>
        <td style="width:90px">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${c.pct}%"></div>
          </div>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  // ─────────────────────────────────────────────
  // Tizim loglari
  // ─────────────────────────────────────────────

  const logs = [
    { color: '#3ddc97', text: "Yangi foydalanuvchi ro'yxatdan o'tdi — Toshkent, UZ",       time: "2 daqiqa oldin"  },
    { color: '#ff5f6d', text: "CNN International kanali ulanmadi (timeout)",                 time: "8 daqiqa oldin"  },
    { color: '#6c7bff', text: "APK v1.0.1 yangilanishi yuklandi — 48 marta",                 time: "15 daqiqa oldin" },
    { color: '#ffc15e', text: "Yuqori trafik aniqlandi — 847 jonli sessiya",                 time: "32 daqiqa oldin" },
    { color: '#3ddc97', text: "M3U manba muvaffaqiyatli yangilandi (8,240 kanal)",            time: "1 soat oldin"    },
    { color: '#ff5f6d', text: "BBC World Service: SSL sertifikati muddati o'tgan",           time: "2 soat oldin"    },
  ];

  const logContainer = document.getElementById('activity-log');
  if (logContainer) {
    logs.forEach(l => {
      const div = document.createElement('div');
      div.className = 'log-item';
      div.innerHTML = `
        <div class="log-dot" style="background:${l.color}"></div>
        <div>
          <div class="log-text">${l.text}</div>
          <div class="log-time">${l.time}</div>
        </div>`;
      logContainer.appendChild(div);
    });
  }

  // ─────────────────────────────────────────────
  // Jonli KPI yangilash (simulyatsiya)
  // ─────────────────────────────────────────────

  let liveUsers = 847;
  setInterval(() => {
    liveUsers = Math.max(0, liveUsers + Math.floor((Math.random() - 0.4) * 20));
    const el = document.getElementById('kpi-live');
    if (el) el.textContent = liveUsers.toLocaleString();
  }, 3000);

  // ─────────────────────────────────────────────
  // Period tugmalari
  // ─────────────────────────────────────────────

  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      this.closest('.period-btns')
          .querySelectorAll('.period-btn')
          .forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

});

