// ePluribus POC — shared logic, mock data, layout helpers
// All "scanning", "filing", "verification" is simulated for demonstration.

const STATES = {
  AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California',
  CO:'Colorado', CT:'Connecticut', DE:'Delaware', FL:'Florida', GA:'Georgia',
  HI:'Hawaii', ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa',
  KS:'Kansas', KY:'Kentucky', LA:'Louisiana', ME:'Maine', MD:'Maryland',
  MA:'Massachusetts', MI:'Michigan', MN:'Minnesota', MS:'Mississippi', MO:'Missouri',
  MT:'Montana', NE:'Nebraska', NV:'Nevada', NH:'New Hampshire', NJ:'New Jersey',
  NM:'New Mexico', NY:'New York', NC:'North Carolina', ND:'North Dakota', OH:'Ohio',
  OK:'Oklahoma', OR:'Oregon', PA:'Pennsylvania', RI:'Rhode Island', SC:'South Carolina',
  SD:'South Dakota', TN:'Tennessee', TX:'Texas', UT:'Utah', VT:'Vermont',
  VA:'Virginia', WA:'Washington', WV:'West Virginia', WI:'Wisconsin', WY:'Wyoming'
};

const POPULAR_STATES = ['CA','TX','NY','FL','IL','PA','OH','GA','NC','MI','WA','AZ','MA','CO','VA','NJ'];

const STATE_CITIES = {
  CA:'Los Angeles', TX:'Austin', NY:'Brooklyn', FL:'Miami', IL:'Chicago',
  PA:'Philadelphia', OH:'Columbus', GA:'Atlanta', NC:'Charlotte', MI:'Detroit',
  WA:'Seattle', AZ:'Phoenix', MA:'Boston', CO:'Denver', VA:'Richmond', NJ:'Newark'
};

// State income tax rate (top marginal, simplified for demo)
const STATE_TAX = {
  CA:{ rate:0.093, hasIncomeTax:true },
  TX:{ rate:0,     hasIncomeTax:false },
  NY:{ rate:0.0685, hasIncomeTax:true },
  FL:{ rate:0,     hasIncomeTax:false },
  IL:{ rate:0.0495, hasIncomeTax:true },
  WA:{ rate:0,     hasIncomeTax:false },
  default:{ rate:0.05, hasIncomeTax:true }
};

// Per-state theming: accent color (drawn from the state flag's secondary
// color) and a deep navy base for the license card gradient. The flag image
// itself is fetched from flagcdn.com via getStateFlagUrl() — see consumers
// in renderUserCard, the DOMContentLoaded watermark inject, and license.html.
const STATE_LICENSE_THEME = {
  AL: { accent:'#c97a6c', deep:'#0a1f3a' },
  AK: { accent:'#b8c5d6', deep:'#0a1a2e' },
  AZ: { accent:'#d4a373', deep:'#0a2030' },
  AR: { accent:'#c97a6c', deep:'#0a1f3a' },
  CA: { accent:'#c9a227', deep:'#0a2a6b' },
  CO: { accent:'#d4a373', deep:'#0a2540' },
  CT: { accent:'#b8c5d6', deep:'#0a1f3a' },
  DE: { accent:'#c9a227', deep:'#0a1f3a' },
  FL: { accent:'#5dc6c0', deep:'#0a3a52' },
  GA: { accent:'#f7b878', deep:'#0a2538' },
  HI: { accent:'#5dc6c0', deep:'#0a2a40' },
  ID: { accent:'#5b8a72', deep:'#0a2030' },
  IL: { accent:'#b8c5d6', deep:'#0a1f4a' },
  IN: { accent:'#c9a227', deep:'#0a1f3a' },
  IA: { accent:'#c9a227', deep:'#0a1f3a' },
  KS: { accent:'#c9a227', deep:'#0a2030' },
  KY: { accent:'#1e88a8', deep:'#0a1f3a' },
  LA: { accent:'#c9a227', deep:'#0a1f4a' },
  ME: { accent:'#5b8a72', deep:'#0a2030' },
  MD: { accent:'#c97a6c', deep:'#0a1f3a' },
  MA: { accent:'#b8c5d6', deep:'#0a1f3a' },
  MI: { accent:'#5b8a72', deep:'#0a2438' },
  MN: { accent:'#5b8a72', deep:'#0a2438' },
  MS: { accent:'#c97a6c', deep:'#0a1f3a' },
  MO: { accent:'#c9a227', deep:'#0a1f3a' },
  MT: { accent:'#c97a6c', deep:'#0a2030' },
  NE: { accent:'#c9a227', deep:'#0a1f3a' },
  NV: { accent:'#b8c5d6', deep:'#0a2030' },
  NH: { accent:'#5b8a72', deep:'#0a2030' },
  NJ: { accent:'#f7b878', deep:'#0a1f3a' },
  NM: { accent:'#c97a6c', deep:'#0a2030' },
  NY: { accent:'#f2c14e', deep:'#0c2a52' },
  NC: { accent:'#c97a6c', deep:'#0a1f3a' },
  ND: { accent:'#c9a227', deep:'#0a1f3a' },
  OH: { accent:'#c97a6c', deep:'#0a1f3a' },
  OK: { accent:'#c97a6c', deep:'#0a1f3a' },
  OR: { accent:'#5b8a72', deep:'#0a2030' },
  PA: { accent:'#c9a227', deep:'#0a1f4a' },
  RI: { accent:'#c9a227', deep:'#0a1f3a' },
  SC: { accent:'#1e88a8', deep:'#0a1f3a' },
  SD: { accent:'#c9a227', deep:'#0a1f3a' },
  TN: { accent:'#c97a6c', deep:'#0a1f3a' },
  TX: { accent:'#c97a6c', deep:'#0b1437' },
  UT: { accent:'#c9a227', deep:'#0a1f3a' },
  VT: { accent:'#5b8a72', deep:'#0a2030' },
  VA: { accent:'#c9a227', deep:'#0a1f3a' },
  WA: { accent:'#5b8a72', deep:'#0a2438' },
  WV: { accent:'#5b8a72', deep:'#0a2030' },
  WI: { accent:'#c9a227', deep:'#0a1f3a' },
  WY: { accent:'#c97a6c', deep:'#0a2030' },
  default: { accent:'#c9a227', deep:'#0a1138' }
};

// Real state flags are fetched from flagcdn.com (Cloudflare-cached SVG, CORS-open).
// Pattern: https://flagcdn.com/us-{lowercase-postal-code}.svg
function getStateFlagUrl(stateCode) {
  const code = (stateCode || 'us').toLowerCase();
  return `https://flagcdn.com/us-${code}.svg`;
}

function getCitizen() {
  const stored = sessionStorage.getItem('civic_user');
  return stored ? JSON.parse(stored) : null;
}
function setCitizen(data) { sessionStorage.setItem('civic_user', JSON.stringify(data)); }
function clearCitizen() { sessionStorage.removeItem('civic_user'); sessionStorage.removeItem('civic_state'); }
function getState() { return sessionStorage.getItem('civic_state') || 'CA'; }
function setState(code) { sessionStorage.setItem('civic_state', code); }

function requireAuth() {
  const user = getCitizen();
  if (!user) { window.location.href = 'index.html'; return null; }
  return user;
}

function randomDigits(n) {
  let s = '';
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function buildMockCitizen(stateCode) {
  const stateName = STATES[stateCode] || 'California';
  const city = STATE_CITIES[stateCode] || 'Springfield';
  const formats = {
    CA: () => 'D' + randomDigits(7),
    TX: () => randomDigits(8),
    NY: () => randomDigits(3) + ' ' + randomDigits(3) + ' ' + randomDigits(3),
    FL: () => 'M' + randomDigits(3) + '-' + randomDigits(3) + '-' + randomDigits(2),
  };
  const license = (formats[stateCode] || (() => randomDigits(8)))();
  return {
    name: 'Sarah K. Mitchell',
    firstName: 'Sarah',
    middleInitial: 'K',
    lastName: 'Mitchell',
    dob: '1991-03-14',
    sex: 'F',
    height: "5'-06\"",
    weight: '135 lb',
    eyes: 'BRN',
    hair: 'BRN',
    licenseNumber: license,
    address: `1247 Elm Street`,
    city: city,
    zip: '90245',
    issued: '2022-03-14',
    expires: '2027-03-14',
    class: 'C',
    restrictions: 'CORR LENS',
    endorsements: 'NONE',
    donor: 'YES',
    state: stateCode,
    stateName,
    initials: 'SM',
  };
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
}
function formatDateLong(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
}
function formatCurrency(n) {
  return n.toLocaleString('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 });
}

function age(dobIso) {
  const dob = new Date(dobIso + 'T00:00:00');
  const now = new Date();
  let a = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) a--;
  return a;
}

function setActiveNav(page) {
  document.querySelectorAll('.sidebar nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
}

function getStateTheme(stateCode) {
  const code = stateCode || (getCitizen() && getCitizen().state);
  return STATE_LICENSE_THEME[code] || STATE_LICENSE_THEME.default;
}

function applyStateTheme(stateCode) {
  const theme = getStateTheme(stateCode);
  document.body.style.setProperty('--license-accent', theme.accent);
  document.body.style.setProperty('--license-deep', theme.deep);
  return theme;
}

function renderUserCard() {
  const user = getCitizen();
  if (!user) return '';
  const initials = (user.firstName[0] + user.lastName[0]).toUpperCase();
  const flag = getStateFlagUrl(user.state);
  return `
    <div class="user-card">
      <div class="avatar">${initials}</div>
      <div class="user-info">
        <div class="name">${user.firstName} ${user.lastName}</div>
        <div class="state">
          <span class="state-flag-chip" aria-hidden="true" style="background-image:url('${flag}')"></span>
          ${user.stateName}
        </div>
      </div>
    </div>
    <button class="btn btn-ghost signout" onclick="signOut()" style="margin-top:8px;font-size:13px;padding:8px;">Sign out</button>
  `;
}

function renderSidebar(activePage) {
  const user = getCitizen();
  const stateBadge = user
    ? `<span class="brand-state">${user.state}</span>`
    : '';
  return `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark"><svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="15" height="15" fill="#3c3b6e"/><rect x="5" y="5" width="5" height="5" fill="#fff"/><rect x="15" width="10" height="5" fill="#b22234"/><rect x="15" y="5" width="10" height="5" fill="#fff"/><rect x="15" y="10" width="10" height="5" fill="#b22234"/><rect y="15" width="25" height="5" fill="#fff"/><rect y="20" width="25" height="5" fill="#b22234"/></svg></div>
        <span>ePluribus${stateBadge ? ` ${stateBadge}` : ''}</span>
      </div>
      <nav>
        <a href="dashboard.html" data-page="dashboard">${icon('home')}<span>Home</span></a>
        <a href="license.html" data-page="license">${icon('id')}<span>Wallet</span></a>
        <a href="taxes.html" data-page="taxes">${icon('receipt')}<span>State Taxes</span></a>
        <a href="healthcare.html" data-page="healthcare">${icon('heart')}<span>Health Insurance</span></a>
        <a href="welfare.html" data-page="welfare">${icon('dollar')}<span>Benefits</span></a>
        <a href="business.html" data-page="business">${icon('briefcase')}<span>Business</span></a>
        <a href="engage.html" data-page="engage">${icon('picket')}<span>Get Involved</span></a>
        <a href="vote.html" data-page="vote">${icon('ballot')}<span>Voting</span></a>
        <a href="jobs.html" data-page="jobs">${icon('handshake')}<span>Jobs</span></a>
        <a href="repairs.html" data-page="repairs">${icon('wrench')}<span>Report It</span></a>
        <a href="tickets.html" data-page="tickets">${icon('ticket')}<span>Passes</span></a>
      </nav>
      ${renderUserCard()}
    </aside>
  `;
}

function signOut() {
  clearCitizen();
  window.location.href = 'index.html';
}

function icon(name, size = 20) {
  const s = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  const icons = {
    home: `<svg ${s}><path d="M3 12L12 4l9 8"/><path d="M5 10v10h14V10"/></svg>`,
    id: `<svg ${s}><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M15 10h3M15 14h3M6 16c.5-1.5 2-2 3-2s2.5.5 3 2"/></svg>`,
    receipt: `<svg ${s}><path d="M5 3v18l3-2 3 2 3-2 3 2 3-2V3"/><path d="M9 8h8M9 12h8M9 16h5"/></svg>`,
    heart: `<svg ${s}><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/></svg>`,
    hand: `<svg ${s}><path d="M9 11V5a2 2 0 1 1 4 0v6"/><path d="M13 7a2 2 0 1 1 4 0v7"/><path d="M17 9a2 2 0 1 1 4 0v6c0 4-3 6-6 6h-3a4 4 0 0 1-3-1l-5-6 1-2 4 1V5a2 2 0 1 1 4 0v6"/></svg>`,
    briefcase: `<svg ${s}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>`,
    upload: `<svg ${s}><path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/></svg>`,
    camera: `<svg ${s}><path d="M3 8a2 2 0 0 1 2-2h3l2-2h4l2 2h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    check: `<svg ${s}><polyline points="20 6 9 17 4 12"/></svg>`,
    shield: `<svg ${s}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z"/><polyline points="9 12 11 14 15 10"/></svg>`,
    bell: `<svg ${s}><path d="M18 16l-1-3V9a5 5 0 0 0-10 0v4l-1 3z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>`,
    plus: `<svg ${s}><path d="M12 5v14M5 12h14"/></svg>`,
    arrow: `<svg ${s}><path d="M5 12h14M13 5l7 7-7 7"/></svg>`,
    download: `<svg ${s}><path d="M12 4v12M7 11l5 5 5-5"/><path d="M5 20h14"/></svg>`,
    share: `<svg ${s}><circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8.6 10.6l6.8-3.6M8.6 13.4l6.8 3.6"/></svg>`,
    pill: `<svg ${s}><rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(45 12 12)"/><path d="M8.5 8.5l7 7"/></svg>`,
    calendar: `<svg ${s}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`,
    file: `<svg ${s}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><polyline points="14 3 14 8 19 8"/></svg>`,
    building: `<svg ${s}><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2"/></svg>`,
    qr: `<svg ${s}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3M21 14v3M17 17v4h4M14 21h-1"/></svg>`,
    eye: `<svg ${s}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`,
    megaphone: `<svg ${s}><path d="M3 11v2a1 1 0 0 0 1 1h2l8 5V5L6 10H4a1 1 0 0 0-1 1z"/><path d="M18 8a4 4 0 0 1 0 8"/></svg>`,
    picket: `<svg ${s}><rect x="5" y="3" width="14" height="9" rx="1"/><path d="M8 6h8M8 9h5"/><path d="M12 12v10"/></svg>`,
    handshake: `<svg ${s}><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>`,
    dollar: `<svg ${s}><rect x="3" y="7" width="18" height="10" rx="1"/><circle cx="12" cy="12" r="3"/></svg>`,
    ballot: `<svg ${s}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12l3 3 5-6"/></svg>`,
    trending: `<svg ${s}><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>`,
    wrench: `<svg ${s}><path d="M14.7 6.3a4.5 4.5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a4.5 4.5 0 0 0 6.4-6.4l-3.5 3.5-2.5-2.5z"/></svg>`,
    ticket: `<svg ${s}><path d="M2 9V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 5v2M14 11v2M14 17v2"/></svg>`,
  };
  return icons[name] || '';
}

// Auto-mount sidebar on signed-in pages, and apply the user's state theme
// (CSS vars on <body>) so any downstream chrome can pick up --license-accent
// and --license-deep without each page wiring it up itself.
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  const signedInPages = ['dashboard','license','taxes','healthcare','welfare','business','engage','vote','jobs','repairs','tickets'];
  if (signedInPages.includes(page)) {
    const user = requireAuth();
    if (!user) return;
    applyStateTheme(user.state);
    const mount = document.getElementById('sidebar-mount');
    if (mount) mount.outerHTML = renderSidebar(page);
    setActiveNav(page);
  }
});
