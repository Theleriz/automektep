/* =====================================================================
   AutoMektep 2.1 — автомектептің бизнес-процестерін автоматтандыру жүйесі
   Технологиялар: HTML5, CSS3, JavaScript (ES6+), localStorage. Кітапхана жоқ.
   Модульдер: басқару тақтасы, өтінімдер (CRM), оқушылар, нұсқаушылар,
   автопарк, сабақ кестесі, төлемдер, жылдық жоспар (пайда және мақсат),
   емтихандар, есептер, баптаулар.
   Оқушылар сайты (AutoMektep Client) осы деректерді ортақ қолданады.
   ===================================================================== */
'use strict';

// =====================================================================
// 1. АНЫҚТАМАЛЫҚТАР (константалар)
// =====================================================================
const STORAGE_KEY = 'automektep-data-v4';
const SESSION_KEY = 'automektep-session';
const THEME_KEY = 'automektep-theme';
const CATEGORIES = ['A1', 'A', 'B1', 'B', 'BE', 'C1', 'C', 'C1E', 'CE', 'D1', 'D', 'D1E', 'DE', 'Tm', 'Tb'];
const STATUSES = ['Теория', 'Практика', 'Емтихан', 'Бітірді'];
const STATUS_CLASS = { 'Теория': 's-theory', 'Практика': 's-practice', 'Емтихан': 's-exam', 'Бітірді': 's-done' };
const STATUS_COLOR = { 'Теория': 'var(--primary)', 'Практика': 'var(--yellow)', 'Емтихан': 'var(--purple)', 'Бітірді': 'var(--green)' };
const LESSON_TYPES = ['Теория', 'Практика'];
const SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30'];
const METHODS = ['Kaspi', 'Қолма-қол', 'Банк картасы'];
const EXAM = {
  innerTheory: 'Ішкі емтихан: теория',
  innerPractice: 'Ішкі емтихан: практика',
  stateTheory: 'Мемлекеттік емтихан: теория',
  statePractice: 'Мемлекеттік емтихан: практика',
};
const EXAM_TYPES = Object.values(EXAM);
const RESULTS = ['Күтілуде', 'Өтті', 'Өтпеді'];
const RESULT_CLASS = { 'Күтілуде': 'r-wait', 'Өтті': 'r-pass', 'Өтпеді': 'r-fail' };
const LEAD_STATUSES = ['Жаңа', 'Хабарласты', 'Тіркелді', 'Бас тартты'];
const LEAD_CLASS = { 'Жаңа': 's-theory', 'Хабарласты': 's-practice', 'Тіркелді': 's-done', 'Бас тартты': 's-fail' };
const LEAD_SOURCES = ['Instagram', 'Сайт', '2GIS', 'Таныс арқылы', 'Қоңырау'];
const CAR_STATUSES = ['Жұмыста', 'Жөндеуде'];
const EXPENSE_CATEGORIES = ['Жанармай', 'Үй-жай жалдау', 'Жарнама', 'Көлік жөндеу', 'Коммуналдық', 'Жалақы', 'Басқа'];
const MONTHS = ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'];
const MONTHS_SHORT = ['Қаң', 'Ақп', 'Нау', 'Сәу', 'Мам', 'Мау', 'Шіл', 'Там', 'Қыр', 'Қаз', 'Қар', 'Жел'];
const WEEKDAYS = ['Жексенбі', 'Дүйсенбі', 'Сейсенбі', 'Сәрсенбі', 'Бейсенбі', 'Жұма', 'Сенбі'];
const DEFAULT_SETTINGS = {
  schoolName: 'AutoMektep', city: 'Алматы', phone: '+7 707 898 52 44',
  prices: { A1: 40000, A: 45000, B1: 50000, B: 55000, BE: 60000, C1: 65000, C: 70000, C1E: 72000, CE: 80000, D1: 75000, D: 85000, D1E: 88000, DE: 95000, Tm: 35000, Tb: 60000 },
  practiceRequired: { A1: 10, A: 10, B1: 14, B: 16, BE: 10, C1: 16, C: 20, C1E: 10, CE: 12, D1: 16, D: 20, D1E: 10, DE: 12, Tm: 8, Tb: 20 },
  goals: { revenue: 4000000, profit: 2000000, students: 30 },
};
const NAV = [
  { view: 'dashboard', label: 'Басқару тақтасы', icon: 'dashboard', group: 'Негізгі' },
  { view: 'leads', label: 'Өтінімдер', icon: 'inbox', group: 'Негізгі' },
  { view: 'inbox', label: 'Хабарламалар', icon: 'chat', group: 'Негізгі' },
  { view: 'students', label: 'Оқушылар', icon: 'users', group: 'Негізгі' },
  { view: 'instructors', label: 'Нұсқаушылар', icon: 'wheel', group: 'Оқу процесі' },
  { view: 'cars', label: 'Автопарк', icon: 'car', group: 'Оқу процесі' },
  { view: 'schedule', label: 'Сабақ кестесі', icon: 'calendar', group: 'Оқу процесі' },
  { view: 'theory', label: 'Теория сабақтары', icon: 'book', group: 'Оқу процесі' },
  { view: 'exams', label: 'Емтихандар', icon: 'check', group: 'Оқу процесі' },
  { view: 'payments', label: 'Төлемдер', icon: 'card', group: 'Қаржы және талдау' },
  { view: 'goals', label: 'Жылдық жоспар', icon: 'target', group: 'Қаржы және талдау' },
  { view: 'reports', label: 'Есептер', icon: 'chart', group: 'Қаржы және талдау' },
  { view: 'settings', label: 'Баптаулар', icon: 'gear', group: 'Жүйе' },
];
const VIEW_TITLES = Object.fromEntries(NAV.map((n) => [n.view, n.label]));

// =====================================================================
// 2. КӨМЕКШІ ФУНКЦИЯЛАР
// =====================================================================
const $ = (s) => document.querySelector(s);
const pad = (n) => String(n).padStart(2, '0');
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return isoDate(d); };
const TODAY = isoDate(new Date());
const toDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
const daysFrom = (iso) => Math.round((toDate(iso) - toDate(TODAY)) / 86400000);
const monthKey = (offset) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + offset); return isoDate(d).slice(0, 7); };
const money = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n || 0)) + ' ₸';
const num = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n || 0));
const shortMoney = (n) => (n < 0 ? '−' + shortMoney(-n) : n >= 1e6 ? (n / 1e6).toFixed(1).replace('.0', '') + ' млн' : n >= 1000 ? Math.round(n / 1000) + ' мың' : String(n));
const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const digits = (s) => String(s || '').replace(/\D/g, '');
const prettyDate = (iso) => { const [, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]}`; };
const fullDate = (iso) => `${prettyDate(iso)} ${iso.slice(0, 4)}`;
const weekday = (iso) => WEEKDAYS[toDate(iso).getDay()];
const timeStr = (ts) => { const d = new Date(ts); return `${prettyDate(isoDate(d))}, ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const list = (arr) => arr.map((v) => ({ value: v, label: v }));
const byDateTime = (a, b) => (a.date + a.time).localeCompare(b.date + b.time);
const initials = (name) => name.split(/\s+/).map((w) => w[0] || '').slice(0, 2).join('').toUpperCase();
const pct = (a, b) => (b ? Math.min(100, Math.round((a / b) * 100)) : 0);

// Белгішелер (SVG)
const ICONS = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6Z"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M17 11a3 3 0 1 0 0-6"/><path d="M22 21c0-2.8-1.6-5.2-4-6.3"/>',
  wheel: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M3.5 10.5h6M14.5 10.5h6M12 14.5V21"/>',
  car: '<path d="M5 18H3v-5l2.2-5.2A2 2 0 0 1 7 6.5h10a2 2 0 0 1 1.8 1.3L21 13v5h-2"/><path d="M3 13h18"/><circle cx="7.5" cy="18" r="2"/><circle cx="16.5" cy="18" r="2"/><path d="M9.5 18h5"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  check: '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
  chart: '<path d="M3 3v18h18"/><path d="M8 17v-6M13 17V7M18 17v-3"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chat: '<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12Z"/>',
  print: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/>',
  upload: '<path d="M12 21V9M7 14l5-5 5 5"/><path d="M4 3h16"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
  receipt: '<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2Z"/><path d="M9 8h6M9 12h6"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  del: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  userPlus: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-3.9 3.1-7 7-7 1.6 0 3 .5 4.2 1.4"/><path d="M19 14v6M16 17h6"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  star: '<path d="M12 3l2.8 5.6 6.2.9-4.5 4.4 1.1 6.1L12 17.1 6.4 20l1.1-6.1L3 9.5l6.2-.9Z"/>',
  send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4Z"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  play: '<polygon points="7 4 20 12 7 20 7 4"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5Z"/><path d="M4 19.5V21h16"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><path d="M12 17.5h.01"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

// =====================================================================
// 3. ДЕМО ДЕРЕКТЕР
// =====================================================================
function emptyDB() {
  return {
    settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
    leads: [], cars: [], instructors: [], students: [], lessons: [], payments: [], exams: [], expenses: [], log: [],
    messages: [], accounts: demoAccounts(), theory: defaultTheory(),
  };
}

// Теориялық бейнесабақтар (YouTube). Әкімші «Теория сабақтары» бөлімінде өзгерте алады.
function defaultTheory() {
  return [
    { id: 't1', order: 1, title: '1-сабақ. Жол қозғалысы ережелерінің жалпы ережелері', youtube: '0mLPHC4NyPs', desc: 'Негізгі ұғымдар мен терминдер: жол, жүргізуші, жаяу жүргінші, басымдық. Видеокурс орыс тілінде.' },
    { id: 't2', order: 2, title: '2-сабақ. Жүргізушінің міндеттері', youtube: 'JbMq-IngGK4', desc: 'Жүргізушінің жалпы міндеттері: құжаттар, көлікті тексеру, қауіпсіздік белдігі. Видеокурс орыс тілінде.' },
    { id: 't3', order: 3, title: '3-сабақ. Жаяу жүргіншілер мен жолаушылардың міндеттері', youtube: '102BNJQG5X4', desc: 'Жаяу жүргіншілер мен жолаушылар үшін ережелер. Видеокурс орыс тілінде.' },
    { id: 't4', order: 4, title: '4-сабақ. Ескерту белгілері', youtube: 'mrVCt6ELR5Q', desc: 'Ескерту белгілерінің түрлері және оларды жолда қалай қолдану керегі. Видеокурс орыс тілінде.' },
    { id: 't5', order: 5, title: 'Қосымша сабақ. Жол белгілері (қазақ тілінде)', youtube: 'AEcoIBJb3EU', desc: 'Жол белгілеріне шолу және жүргізуші куәлігін алу сынағына дайындық, қазақ тілінде.' },
  ];
}
const ytId = (s) => {
  const m = String(s || '').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : (/^[\w-]{11}$/.test(String(s || '').trim()) ? String(s).trim() : '');
};
const ytUrl = (id) => `https://www.youtube.com/watch?v=${id}`;

// Құпиясөзді хэштеу (FNV-1a). Демо жоба үшін: нақты жүйеде хэштеу серверде жасалады.
function hashPass(p) {
  let h = 0x811c9dc5;
  for (const ch of 'automektep:' + p) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
// Демо аккаунттар: әкімші және оқушы (Әлия Серікқызы, s1)
function demoAccounts() {
  return [
    { id: 'a1', email: 'admin@automektep.test', pass: hashPass('Admin2026!'), role: 'admin', name: 'Әкімші', studentId: null, leadId: null },
    { id: 'a2', email: 'aliya@automektep.test', pass: hashPass('Student2026!'), role: 'student', name: 'Әлия Серікқызы', studentId: 's1', leadId: null,
      watched: ['t1', 't2'], tests: [{ ts: Date.now() - 3 * 86400e3, score: 7, total: 10 }] },
  ];
}

function seed() {
  const db0 = emptyDB();
  db0.cars = [
    { id: 'c1', model: 'Toyota Corolla', plate: '123 ABC 02', category: 'B', year: 2021, mileage: 84200, inspection: addDays(120), insurance: addDays(18), status: 'Жұмыста' },
    { id: 'c2', model: 'Hyundai Accent', plate: '456 KZA 02', category: 'B', year: 2022, mileage: 61500, inspection: addDays(200), insurance: addDays(240), status: 'Жұмыста' },
    { id: 'c3', model: 'Honda CB500', plate: '78 AB 02', category: 'A', year: 2020, mileage: 23400, inspection: addDays(-3), insurance: addDays(90), status: 'Жұмыста' },
    { id: 'c4', model: 'КамАЗ 65115', plate: '901 TRK 02', category: 'C', year: 2019, mileage: 152000, inspection: addDays(45), insurance: addDays(150), status: 'Жұмыста' },
    { id: 'c5', model: 'Kia Rio', plate: '234 RIO 02', category: 'B', year: 2018, mileage: 198000, inspection: addDays(60), insurance: addDays(70), status: 'Жөндеуде' },
  ];
  db0.instructors = [
    { id: 'i1', name: 'Ерлан Сапаров', phone: '+7 700 000 00 11', categories: ['B'], carIds: ['c1'], experience: 12 },
    { id: 'i2', name: 'Айгүл Нұрланова', phone: '+7 700 000 00 12', categories: ['A', 'B'], carIds: ['c2', 'c3'], experience: 8 },
    { id: 'i3', name: 'Марат Жұмабеков', phone: '+7 700 000 00 13', categories: ['B', 'C'], carIds: ['c4'], experience: 15 },
  ];
  db0.students = [
    { id: 's1', name: 'Әлия Серікқызы', phone: '+7 700 000 01 01', category: 'B', instructorId: 'i1', status: 'Практика', startDate: addDays(-40), discount: 0, note: '' },
    { id: 's2', name: 'Данияр Қасымов', phone: '+7 700 000 01 02', category: 'B', instructorId: 'i2', status: 'Теория', startDate: addDays(-12), discount: 0, note: 'Кешкі топқа ыңғайлы' },
    { id: 's3', name: 'Нұржан Әбілов', phone: '+7 700 000 01 03', category: 'C', instructorId: 'i3', status: 'Емтихан', startDate: addDays(-70), discount: 0, note: '' },
    { id: 's4', name: 'Мадина Төлеген', phone: '+7 700 000 01 04', category: 'B', instructorId: 'i1', status: 'Бітірді', startDate: addDays(-95), discount: 0, note: '' },
    { id: 's5', name: 'Ерасыл Бекұлы', phone: '+7 700 000 01 05', category: 'A', instructorId: 'i2', status: 'Практика', startDate: addDays(-25), discount: 0, note: '' },
    { id: 's6', name: 'Аружан Маратқызы', phone: '+7 700 000 01 06', category: 'B', instructorId: 'i3', status: 'Теория', startDate: addDays(-5), discount: 10, note: 'Студенттік жеңілдік' },
  ];
  // Өткен сабақтар (автоматты түрде құрылады)
  let n = 0;
  const past = (studentId, instructorId, carId, count, time, type, startOffset) => {
    for (let k = 0; k < count; k++) {
      db0.lessons.push({ id: 'l' + (++n), studentId, instructorId, carId, date: addDays(-(2 * k + startOffset)), time, type, done: true, note: '' });
    }
  };
  past('s1', 'i1', 'c1', 8, '09:00', 'Практика', 3);
  past('s4', 'i1', 'c1', 16, '12:00', 'Практика', 20);
  past('s3', 'i3', 'c4', 20, '14:00', 'Практика', 8);
  past('s5', 'i2', 'c3', 4, '10:30', 'Практика', 3);
  past('s2', 'i2', '', 3, '17:00', 'Теория', 4);
  // Алдағы сабақтар
  const next = [
    ['s1', 'i1', 'c1', 0, '09:00', 'Практика', true],
    ['s5', 'i2', 'c3', 0, '12:00', 'Практика', false],
    ['s2', 'i2', '', 0, '17:00', 'Теория', false],
    ['s6', 'i3', '', 1, '10:30', 'Теория', false],
    ['s1', 'i1', 'c1', 2, '14:00', 'Практика', false],
    ['s3', 'i3', 'c4', 3, '09:00', 'Практика', false],
    ['s5', 'i2', 'c3', 4, '15:30', 'Практика', false],
    ['s2', 'i2', '', -1, '18:30', 'Теория', false],
  ];
  next.forEach(([studentId, instructorId, carId, off, time, type, done]) => {
    db0.lessons.push({ id: 'l' + (++n), studentId, instructorId, carId, date: addDays(off), time, type, done, note: '' });
  });
  db0.payments = [
    { id: 'p1', studentId: 's1', amount: 100000, date: addDays(-40), method: 'Kaspi' },
    { id: 'p2', studentId: 's1', amount: 50000, date: addDays(-3), method: 'Kaspi' },
    { id: 'p3', studentId: 's2', amount: 60000, date: addDays(-12), method: 'Қолма-қол' },
    { id: 'p4', studentId: 's3', amount: 120000, date: addDays(-70), method: 'Банк картасы' },
    { id: 'p5', studentId: 's3', amount: 100000, date: addDays(-38), method: 'Kaspi' },
    { id: 'p6', studentId: 's4', amount: 180000, date: addDays(-95), method: 'Kaspi' },
    { id: 'p7', studentId: 's5', amount: 60000, date: addDays(-1), method: 'Kaspi' },
    { id: 'p8', studentId: 's6', amount: 50000, date: addDays(-5), method: 'Қолма-қол' },
  ];
  db0.exams = [
    { id: 'e1', studentId: 's4', type: EXAM.stateTheory, date: addDays(-20), result: 'Өтті' },
    { id: 'e2', studentId: 's4', type: EXAM.statePractice, date: addDays(-14), result: 'Өтті' },
    { id: 'e3', studentId: 's3', type: EXAM.innerTheory, date: addDays(-12), result: 'Өтті' },
    { id: 'e4', studentId: 's3', type: EXAM.innerPractice, date: addDays(-6), result: 'Өтті' },
    { id: 'e5', studentId: 's3', type: EXAM.stateTheory, date: addDays(-2), result: 'Өтпеді' },
    { id: 'e6', studentId: 's1', type: EXAM.innerTheory, date: addDays(6), result: 'Күтілуде' },
  ];
  db0.leads = [
    { id: 'd1', name: 'Самал Ахметова', phone: '+7 700 000 02 01', category: 'B', source: 'Instagram', date: addDays(0), status: 'Жаңа', note: 'Демалыс күндері оқығысы келеді' },
    { id: 'd2', name: 'Тимур Оспанов', phone: '+7 700 000 02 02', category: 'B', source: '2GIS', date: addDays(-2), status: 'Жаңа', note: '' },
    { id: 'd3', name: 'Гүлнұр Әлібек', phone: '+7 700 000 02 03', category: 'A', source: 'Сайт', date: addDays(-4), status: 'Хабарласты', note: 'Бағасын сұрады, қайта хабарласу' },
    { id: 'd4', name: 'Бауыржан Ержанов', phone: '+7 700 000 02 04', category: 'C', source: 'Таныс арқылы', date: addDays(-9), status: 'Бас тартты', note: 'Басқа қалаға көшті' },
    { id: 'd5', name: 'Аружан Маратқызы', phone: '+7 700 000 01 06', category: 'B', source: 'Instagram', date: addDays(-6), status: 'Тіркелді', note: '' },
  ];
  // Жыл басынан бері оқуды бітірген оқушылар (тарих: төлемдер, сабақтар, емтихандар)
  const grads = [
    ['Айдос Нұрланұлы', 'B', 'i1', 'c1', -300, '09:00'],
    ['Жанерке Болатқызы', 'B', 'i2', 'c2', -280, '10:30'],
    ['Ерлан Мұхтарұлы', 'C', 'i3', 'c4', -260, '12:00'],
    ['Дана Серікова', 'B', 'i1', 'c1', -230, '14:00'],
    ['Арман Төлеуов', 'A', 'i2', 'c3', -210, '15:30'],
    ['Мөлдір Ахметова', 'B', 'i2', 'c2', -190, '17:00'],
    ['Бекзат Жақсылықов', 'B', 'i1', 'c1', -160, '10:30'],
    ['Камила Әділова', 'B', 'i2', 'c2', -130, '12:00'],
  ];
  grads.forEach(([name, category, instructorId, carId, off, time], k) => {
    const id = 'g' + (k + 1);
    const price = DEFAULT_SETTINGS.prices[category];
    const req = DEFAULT_SETTINGS.practiceRequired[category];
    db0.students.push({ id, name, phone: `+7 700 000 03 ${pad(k + 1)}`, category, instructorId, status: 'Бітірді', startDate: addDays(off), discount: 0, note: '' });
    db0.payments.push({ id: `pg${k}a`, studentId: id, amount: price / 2, date: addDays(off), method: k % 2 ? 'Қолма-қол' : 'Kaspi' });
    db0.payments.push({ id: `pg${k}b`, studentId: id, amount: price / 2, date: addDays(off + 35), method: 'Kaspi' });
    for (let j = 0; j < req; j++) {
      db0.lessons.push({ id: 'l' + (++n), studentId: id, instructorId, carId, date: addDays(off + 20 + 2 * j), time, type: 'Практика', done: true, note: '' });
    }
    const after = off + 20 + 2 * req;
    [[EXAM.innerTheory, off + 25], [EXAM.innerPractice, after + 2], [EXAM.stateTheory, after + 7], [EXAM.statePractice, after + 12]]
      .forEach(([type, d], m) => db0.exams.push({ id: `eg${k}${m}`, studentId: id, type, date: addDays(d), result: 'Өтті' }));
  });

  // ---- Қосымша: нұсқаушылар, көліктер, оқушылар ----
  db0.instructors.push(
    { id: 'i4', name: 'Руслан Қайратұлы', phone: '+7 700 000 00 14', categories: ['A1', 'A', 'B'], carIds: ['c5', 'c9', 'c22'], experience: 6 },
    { id: 'i5', name: 'Динара Омарова', phone: '+7 700 000 00 15', categories: ['B', 'B1', 'BE'], carIds: ['c6', 'c7', 'c18'], experience: 9 },
    { id: 'i6', name: 'Серік Бекетов', phone: '+7 700 000 00 16', categories: ['C', 'C1', 'CE', 'C1E'], carIds: ['c8', 'c10', 'c13', 'c14'], experience: 18 },
    { id: 'i7', name: 'Асхат Тұрсынов', phone: '+7 700 000 00 17', categories: ['D', 'D1', 'DE', 'D1E'], carIds: ['c11', 'c15', 'c16', 'c17'], experience: 14 },
    { id: 'i9', name: 'Тимур Серіков', phone: '+7 700 000 00 19', categories: ['B1', 'D1', 'Tb'], carIds: ['c19', 'c20'], experience: 11 },
    { id: 'i10', name: 'Бауыржан Әлиев', phone: '+7 700 000 00 20', categories: ['A', 'A1', 'C'], carIds: ['c21'], experience: 10 },
    { id: 'i8', name: 'Гүлмира Ахметова', phone: '+7 700 000 00 18', categories: ['B', 'Tm'], carIds: ['c12', 'c23', 'c24'], experience: 7 },
  );
  db0.cars.push(
    { id: 'c5', model: 'Yamaha YBR125', plate: '91 AC 02', category: 'A1', year: 2021, mileage: 15200, inspection: addDays(150), insurance: addDays(100), status: 'Жұмыста' },
    { id: 'c6', model: 'Kia Rio', plate: '234 BKA 02', category: 'B', year: 2022, mileage: 47800, inspection: addDays(180), insurance: addDays(210), status: 'Жұмыста' },
    { id: 'c7', model: 'Chevrolet Nexia 3', plate: '567 CDA 02', category: 'B', year: 2020, mileage: 92100, inspection: addDays(60), insurance: addDays(25), status: 'Жұмыста' },
    { id: 'c8', model: 'КамАЗ 4308', plate: '321 EFA 02', category: 'C', year: 2019, mileage: 132000, inspection: addDays(90), insurance: addDays(120), status: 'Жұмыста' },
    { id: 'c9', model: 'Kawasaki Ninja 400', plate: '55 AD 02', category: 'A', year: 2022, mileage: 9800, inspection: addDays(210), insurance: addDays(190), status: 'Жұмыста' },
    { id: 'c10', model: 'Hyundai Porter', plate: '654 GHA 02', category: 'C1', year: 2021, mileage: 68300, inspection: addDays(140), insurance: addDays(160), status: 'Жұмыста' },
    { id: 'c11', model: 'Yutong ZK6122 (автобус)', plate: '987 KLA 02', category: 'D', year: 2018, mileage: 210500, inspection: addDays(45), insurance: addDays(70), status: 'Жұмыста' },
    { id: 'c13', model: 'КамАЗ 5460 тартқыш + жартылай тіркеме', plate: '777 FRA 02', category: 'CE', year: 2020, mileage: 118000, inspection: addDays(95), insurance: addDays(130), status: 'Жұмыста' },
    { id: 'c14', model: 'Isuzu NQR + тіркеме', plate: '445 TRA 02', category: 'C1E', year: 2019, mileage: 99500, inspection: addDays(110), insurance: addDays(150), status: 'Жұмыста' },
    { id: 'c15', model: 'Mercedes-Benz Sprinter (шағын автобус)', plate: '318 SPR 02', category: 'D1', year: 2021, mileage: 87400, inspection: addDays(130), insurance: addDays(175), status: 'Жұмыста' },
    { id: 'c16', model: 'Sprinter + тіркеме', plate: '319 SPR 02', category: 'D1E', year: 2020, mileage: 96000, inspection: addDays(70), insurance: addDays(90), status: 'Жұмыста' },
    { id: 'c17', model: 'Higer KLQ6129 (автобус) + тіркеме', plate: '620 BUS 02', category: 'DE', year: 2019, mileage: 176000, inspection: addDays(85), insurance: addDays(100), status: 'Жұмыста' },
    { id: 'c18', model: 'Toyota Camry + тіркеме', plate: '812 CAM 02', category: 'BE', year: 2021, mileage: 54200, inspection: addDays(160), insurance: addDays(200), status: 'Жұмыста' },
    { id: 'c19', model: 'Polaris Sportsman (квадроцикл)', plate: '14 QD 02', category: 'B1', year: 2022, mileage: 6100, inspection: addDays(220), insurance: addDays(210), status: 'Жұмыста' },
    { id: 'c20', model: 'ТролЗа-5264 (троллейбус)', plate: '03 TB 02', category: 'Tb', year: 2016, mileage: 143000, inspection: addDays(55), insurance: addDays(95), status: 'Жұмыста' },
    { id: 'c21', model: 'Honda CBR250 (мотоцикл)', plate: '66 AE 02', category: 'A', year: 2021, mileage: 12900, inspection: addDays(170), insurance: addDays(140), status: 'Жұмыста' },
    { id: 'c22', model: 'Suzuki GN125 (жеңіл мотоцикл)', plate: '67 AE 02', category: 'A1', year: 2020, mileage: 18700, inspection: addDays(120), insurance: addDays(115), status: 'Жұмыста' },
    { id: 'c23', model: 'Toyota Corolla', plate: '505 COR 02', category: 'B', year: 2023, mileage: 21000, inspection: addDays(300), insurance: addDays(280), status: 'Жұмыста' },
    { id: 'c24', model: 'Lada Granta', plate: '606 LDA 02', category: 'B', year: 2021, mileage: 73000, inspection: addDays(100), insurance: addDays(60), status: 'Жұмыста' },
    { id: 'c12', model: 'МТЗ-82 (трактор)', plate: '12 TM 02', category: 'Tm', year: 2017, mileage: 4200, inspection: addDays(-8), insurance: addDays(80), status: 'Жөндеуде' },
  );
  const extra = [
    ['Асылбек Мақсатұлы', 'B', 'i5', 'Практика', -30, 0.7], ['Томирис Нұрболқызы', 'A', 'i4', 'Практика', -22, 0.5],
    ['Бексұлтан Қалиев', 'C', 'i6', 'Практика', -45, 1], ['Зарина Оразбаева', 'B', 'i8', 'Теория', -9, 0.5],
    ['Дәурен Сейітов', 'D', 'i7', 'Практика', -50, 0.8], ['Ұлжан Абдрахманова', 'B1', 'i5', 'Теория', -4, 0.3],
    ['Рамазан Ибраев', 'CE', 'i6', 'Емтихан', -80, 1], ['Салтанат Жүнісова', 'B', 'i5', 'Практика', -18, 0.6],
    ['Ержан Тілеуберді', 'Tm', 'i8', 'Теория', -7, 0.5], ['Айнұр Қасенова', 'BE', 'i5', 'Практика', -26, 0.6],
  ];
  extra.forEach(([name, category, instructorId, status, off, share], k) => {
    const id = 's' + (7 + k);
    const price = DEFAULT_SETTINGS.prices[category];
    const carId = (db0.instructors.find((i) => i.id === instructorId).carIds || [])[0] || null;
    db0.students.push({ id, name, phone: `+7 700 000 04 ${pad(k + 1)}`, category, instructorId, status, startDate: addDays(off), discount: 0, note: '' });
    db0.payments.push({ id: `pe${k}`, studentId: id, amount: Math.round(price * share), date: addDays(off + 1), method: k % 2 ? 'Қолма-қол' : 'Kaspi' });
    const done = status === 'Теория' ? 0 : Math.round(DEFAULT_SETTINGS.practiceRequired[category] * (status === 'Емтихан' ? 1 : 0.5));
    for (let j = 0; j < done; j++) db0.lessons.push({ id: 'l' + (++n), studentId: id, instructorId, carId, date: addDays(off + 8 + 2 * j), time: ['09:00', '10:30', '12:00', '14:00'][j % 4], type: 'Практика', done: true, note: '' });
  });
  const grads2 = [['Нұрсұлтан Әлімов', 'D', 'i7', 'c11', -240], ['Гүлзира Мырзабек', 'C1', 'i6', 'c10', -200], ['Мирас Омаров', 'A', 'i4', 'c9', -170], ['Лаура Кенжебаева', 'B', 'i5', 'c6', -150], ['Санжар Бейсенов', 'CE', 'i6', 'c8', -120], ['Әсел Дүйсенова', 'B', 'i8', 'c12', -100]];
  grads2.forEach(([name, category, instructorId, carId, off], k) => {
    const id = 'h' + (k + 1);
    const price = DEFAULT_SETTINGS.prices[category];
    db0.students.push({ id, name, phone: `+7 700 000 05 ${pad(k + 1)}`, category, instructorId, status: 'Бітірді', startDate: addDays(off), discount: 0, note: '' });
    db0.payments.push({ id: `ph${k}a`, studentId: id, amount: price / 2, date: addDays(off), method: 'Kaspi' }, { id: `ph${k}b`, studentId: id, amount: price / 2, date: addDays(off + 30), method: k % 2 ? 'Қолма-қол' : 'Kaspi' });
    [[EXAM.innerTheory, off + 20], [EXAM.innerPractice, off + 45], [EXAM.stateTheory, off + 50], [EXAM.statePractice, off + 56]]
      .forEach(([type, d], m) => db0.exams.push({ id: `eh${k}${m}`, studentId: id, type, date: addDays(d), result: 'Өтті' }));
  });
  // Жыл бойына таралған қосымша түлектер (табыс динамикасы үшін)
  const fn = ['Айбек', 'Дина', 'Нұрлан', 'Томирис', 'Ернар', 'Ляззат', 'Мадияр', 'Еркебұлан', 'Томирис', 'Аян', 'Сәуле', 'Қанат', 'Айым', 'Ғалым', 'Жансая', 'Бауыржан'];
  const ln = ['Сатыбалдиев', 'Қарабаева', 'Омаров', 'Тұрарова', 'Есенов', 'Маратова', 'Қайыров', 'Серіков', 'Жақыпова', 'Мұратов', 'Әбдіқадыр', 'Нұрғалиев', 'Қасымова', 'Темірбеков', 'Ахметжанова', 'Дүйсенбаев'];
  const pairs = [['B', 'i1'], ['B', 'i2'], ['A', 'i4'], ['B', 'i5'], ['C', 'i6'], ['B', 'i8'], ['D', 'i7'], ['B', 'i1']];
  fn.forEach((name, k) => {
    const [category, instructorId] = pairs[k % pairs.length];
    const id = 'u' + (k + 1);
    const off = -(20 + k * 18);
    const price = DEFAULT_SETTINGS.prices[category];
    db0.students.push({ id, name: `${name} ${ln[k]}`, phone: `+7 700 000 06 ${pad(k + 1)}`, category, instructorId, status: 'Бітірді', startDate: addDays(off - 60), discount: 0, note: '' });
    db0.payments.push({ id: `pu${k}a`, studentId: id, amount: price / 2, date: addDays(off - 60), method: 'Kaspi' }, { id: `pu${k}b`, studentId: id, amount: price / 2, date: addDays(off), method: k % 2 ? 'Қолма-қол' : 'Kaspi' });
  });
  // Барлық оқушыға жеке кабинет (әкімші бәрінің теория/тест белсенділігін көреді)
  db0.students.filter((st) => st.id !== 's1').forEach((st, k) => {
    const done = st.status === 'Бітірді';
    const w = done ? 5 : st.status === 'Теория' ? (k % 3) : 2 + (k % 4);
    db0.accounts.push({ id: 'a' + st.id, email: `${st.id}@automektep.test`, pass: hashPass('Student2026!'), role: 'student', name: st.name, studentId: st.id, leadId: null,
      watched: ['t1', 't2', 't3', 't4', 't5'].slice(0, Math.min(5, w)),
      tests: st.status === 'Теория' && k % 2 ? [] : [1, 2].slice(0, 1 + (k % 2)).map((v, j) => ({ ts: Date.now() - (j + k % 5 + 1) * 86400e3, score: done ? 18 + (k % 3) : 11 + ((k * 3 + j * 2) % 8), total: 20, v: ((k + j) % 4) + 1 })) });
  });
  // Шығындар: ағымдағы жылдың әр айы
  const year = Number(TODAY.slice(0, 4));
  const curMonth = Number(TODAY.slice(5, 7));
  const repairs = { 3: 35000, 7: 52000, 10: 28000 };
  for (let m = 1; m <= curMonth; m++) {
    const d = (day) => `${year}-${pad(m)}-${pad(day)}`;
    const add = (category, amount, day, note = '') => { if (d(day) <= TODAY) db0.expenses.push({ id: `x${m}-${db0.expenses.length}`, date: d(day), category, amount, note }); };
    add('Үй-жай жалдау', 60000, 1, 'Оқу сыныбы');
    add('Жанармай', 40000 + (m % 4) * 3000, 2);
    add('Жарнама', 15000, 3, 'Instagram жарнамасы');
    add('Коммуналдық', 12000 + (m % 3) * 1500, 4);
    add('Жалақы', 50000, 5, 'Әкімші мен қосымша жалақы');
    add('Жанармай', 20000 + (m % 5) * 2000, 12, 'Қосымша көліктер');
    add('Жарнама', 5000 + (m % 3) * 2500, 15, '2GIS / Instagram');
    if (m % 2 === 0) add('Көлік жөндеу', 18000 + m * 2500, 20, 'Шина, май, тежегіш');
    add('Басқа', 5000 + (m % 4) * 1500, 25, 'Кеңсе, байланыс');
    if (repairs[m]) add('Көлік жөндеу', repairs[m], 4, 'Жоспарлы қызмет көрсету');
  }

  const now = Date.now();
  // Әкімші мен оқушы арасындағы хабарламалар (Әлия — a2)
  db0.messages = [
    { id: 'm1', accountId: 'a2', from: 'admin', kind: 'system', text: 'AutoMektep жеке кабинетіне қош келдіңіз! Мұнда сабаққа жазылып, төлемдер мен емтихан нәтижелерін көре аласыз.', ts: now - 40 * 86400e3, read: true },
    { id: 'm2', accountId: 'a2', from: 'student', kind: 'text', text: 'Сәлеметсіз бе! Ішкі теория емтиханына қалай дайындалсам болады?', ts: now - 2 * 86400e3, read: true },
    { id: 'm3', accountId: 'a2', from: 'admin', kind: 'text', text: 'Сәлеметсіз бе, Әлия! Теория сабақтарындағы тест сұрақтарын қайталаңыз. Емтиханға дейін нұсқаушыңыз сынақ тест өткізеді.', ts: now - 2 * 86400e3 + 3600e3, read: true },
    { id: 'm4', accountId: 'a2', from: 'student', kind: 'payment', text: 'Оқу ақысының қалдығын төледім', amount: 30000, method: 'Kaspi', status: 'pending', ts: now - 2 * 3600e3, read: false },
  ];
  db0.log = [
    { ts: now - 3600e3, text: 'Жаңа өтінім: Самал Ахметова (Instagram)' },
    { ts: now - 86400e3, text: 'Төлем қабылданды: Ерасыл Бекұлы — 60 000 ₸' },
    { ts: now - 2 * 86400e3, text: 'Нұржан Әбілов «Мемлекеттік емтихан: теория» — Өтпеді' },
    { ts: now - 3 * 86400e3, text: 'Төлем қабылданды: Әлия Серікқызы — 50 000 ₸' },
  ];
  return db0;
}

// =====================================================================
// 4. САҚТАУ (localStorage)
// =====================================================================
function normalize(d) {
  const base = emptyDB();
  const out = { ...base, ...d };
  Object.keys(base).forEach((k) => { if (k !== 'settings' && !Array.isArray(out[k])) out[k] = []; });
  const s = d.settings || {};
  out.settings = {
    ...base.settings, ...s,
    prices: { ...base.settings.prices, ...(s.prices || {}) },
    practiceRequired: { ...base.settings.practiceRequired, ...(s.practiceRequired || {}) },
    goals: { ...base.settings.goals, ...(s.goals || {}) },
  };
  const op = out.settings.prices;
  if (op.A === 120000 && op.B === 180000 && op.C === 220000) { out.settings.prices = { ...DEFAULT_SETTINGS.prices }; out.settings.practiceRequired = { ...DEFAULT_SETTINGS.practiceRequired }; }
  if (out.settings.phone === '+7 700 000 00 00') out.settings.phone = DEFAULT_SETTINGS.phone;
  out.instructors.forEach((i) => { i.carIds = i.carIds || []; i.categories = i.categories || []; });
  // Әкімші аккаунты әрқашан болуы керек (әйтпесе жүйеге кіру мүмкін емес)
  if (!out.accounts.some((a) => a.role === 'admin')) out.accounts.unshift(demoAccounts()[0]);
  if (!Array.isArray(d.theory)) out.theory = defaultTheory();
  if (!out.extrasV2) {
    out.extrasV2 = true;
    try {
      const fresh = seed();
      ['instructors', 'cars', 'students', 'lessons', 'payments', 'exams', 'expenses'].forEach((k) => {
        const have = new Set(out[k].map((x) => x.id));
        fresh[k].forEach((x) => { if (!have.has(x.id)) out[k].push(x); });
      });
      out.instructors.forEach((i) => {
        const f = fresh.instructors.find((x) => x.id === i.id);
        if (f) f.carIds.forEach((c) => { if (!(i.carIds || []).includes(c)) i.carIds = [...(i.carIds || []), c]; });
        if (f) f.categories.forEach((c) => { if (!(i.categories || []).includes(c)) i.categories = [...(i.categories || []), c]; });
      });
      fresh.accounts.forEach((a) => {
        if (!out.accounts.some((x) => x.id === a.id || x.email === a.email || (a.studentId && x.studentId === a.studentId))) out.accounts.push(a);
      });
    } catch (e) { /* демо деректерді қосу мүмкін болмады */ }
  }
  out.students.forEach((st) => {
    if (out.accounts.some((a) => a.studentId === st.id)) return;
    const email = `${st.id}@automektep.test`;
    if (out.accounts.some((a) => a.email === email)) return;
    out.accounts.push({ id: 'a' + st.id, email, pass: hashPass('Student2026!'), role: 'student', name: st.name, studentId: st.id, leadId: null, watched: [], tests: [] });
  });
  out.accounts.forEach((a) => { a.watched = a.watched || []; a.tests = a.tests || []; });
  return out;
}
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch (e) { /* жад қолжетімсіз — демо деректер */ }
  return seed();
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); } catch (e) { /* елемейміз */ }
}

let db = load();
let view = 'dashboard';
let weekOffset = 0;
const filters = { q: '', cat: '', st: '', sort: 'name', pq: '', pm: '', inst: '', lq: '', ls: '', er: '' };

// =====================================================================
// 5. ЕСЕПТЕУЛЕР (бизнес-логика)
// =====================================================================
const byId = (coll, id) => db[coll].find((x) => x.id === id);
const studentName = (id) => byId('students', id)?.name ?? '—';
const instructorName = (id) => byId('instructors', id)?.name ?? '—';
const carLabel = (id) => { const c = byId('cars', id); return c ? `${c.model} · ${c.plate}` : '—'; };
const basePrice = (cat) => Number(db.settings.prices[cat]) || 0;
const priceOf = (s) => Math.round(basePrice(s.category) * (1 - (Number(s.discount) || 0) / 100));
const paidBy = (sid) => db.payments.filter((p) => p.studentId === sid).reduce((sum, p) => sum + p.amount, 0);
const debtOf = (s) => Math.max(0, priceOf(s) - paidBy(s.id));
const practiceDone = (sid) => db.lessons.filter((l) => l.studentId === sid && l.type === 'Практика' && l.done).length;
const practiceReq = (s) => Number(db.settings.practiceRequired[s.category]) || 0;
const examPassed = (sid, type) => db.exams.some((e) => e.studentId === sid && e.type === type && e.result === 'Өтті');
const income = (key) => db.payments.filter((p) => p.date.startsWith(key)).reduce((sum, p) => sum + p.amount, 0);
const instructorOptions = () => db.instructors.map((i) => ({ value: i.id, label: `${i.name} (${i.categories.join(', ')})` }));
const carUsers = (cid) => db.instructors.filter((i) => (i.carIds || []).includes(cid)).map((i) => i.name);

function docState(iso) {
  const d = daysFrom(iso);
  if (d < 0) return { cls: 'bad', text: `мерзімі өтті (${Math.abs(d)} күн)` };
  if (d <= 30) return { cls: 'warn', text: `${d} күн қалды` };
  return { cls: 'ok', text: `${fullDate(iso)} дейін` };
}
function carIssues() {
  const out = [];
  db.cars.forEach((c) => {
    [['Техбайқау', c.inspection], ['Сақтандыру', c.insurance]].forEach(([doc, date]) => {
      const st = docState(date);
      if (st.cls !== 'ok') out.push({ car: c, doc, st });
    });
  });
  return out;
}

// Жылдық қаржы есептеулері
const YEAR = TODAY.slice(0, 4);
const expenseSum = (key) => db.expenses.filter((x) => x.date.startsWith(key)).reduce((s, x) => s + x.amount, 0);
function yearStats() {
  const months = Array.from({ length: 12 }, (_, k) => `${YEAR}-${pad(k + 1)}`);
  const rows = months.map((m) => ({ m, inc: income(m), exp: expenseSum(m) }));
  const inc = income(YEAR);
  const exp = expenseSum(YEAR);
  const start = new Date(Number(YEAR), 0, 1);
  const end = new Date(Number(YEAR) + 1, 0, 1);
  const daysInYear = Math.round((end - start) / 86400000);
  const dayOfYear = Math.max(1, Math.round((toDate(TODAY) - start) / 86400000) + 1);
  const factor = daysInYear / dayOfYear;
  const newStudents = db.students.filter((s) => s.startDate.startsWith(YEAR)).length;
  const monthsLeft = 12 - Number(TODAY.slice(5, 7)) + 1;
  return {
    rows, inc, exp, profit: inc - exp, newStudents, monthsLeft, dayOfYear, daysInYear,
    forecastInc: Math.round(inc * factor), forecastProfit: Math.round((inc - exp) * factor),
    forecastStudents: Math.round(newStudents * factor), goals: db.settings.goals,
  };
}

// ---------- Әкімші ↔ оқушы байланысы (хабарламалар) ----------
const accountsOf = (studentId) => db.accounts.filter((a) => a.studentId === studentId);
// Әкімші жағындағы оқиға туралы оқушы кабинетіне автоматты хабарлама
function notifyStudent(studentId, text) {
  accountsOf(studentId).forEach((a) => db.messages.push({ id: uid('m'), accountId: a.id, from: 'admin', kind: 'system', text, ts: Date.now(), read: false }));
}
// Оқушы жағындағы оқиға туралы әкімшіге хабарлама
function notifyAdmin(accountId, text, extra = {}) {
  db.messages.push({ id: uid('m'), accountId, from: 'student', kind: 'system', text, ts: Date.now(), read: false, ...extra });
}
const pendingPayments = () => db.messages.filter((m) => m.kind === 'payment' && m.status === 'pending');
const unreadForAdmin = () => db.messages.filter((m) => m.from === 'student' && !m.read).length;
const unreadForAccount = (accId) => db.messages.filter((m) => m.accountId === accId && m.from === 'admin' && !m.read).length;

// Әрекеттер журналы
function logAct(text) {
  db.log.unshift({ ts: Date.now(), text });
  db.log = db.log.slice(0, 40);
}
function notify(text) { logAct(text); toast(text); }

// =====================================================================
// 6. UI БӨЛШЕКТЕРІ
// =====================================================================
const pill = (text, cls) => `<span class="pill ${cls || ''}">${esc(text)}</span>`;
const statusPill = (s) => pill(s, STATUS_CLASS[s]);
const typePill = (t) => pill(t, t === 'Практика' ? 't-practice' : 't-theory');
const iconBtn = (action, id, ic, title, cls = '') => `<button type="button" class="icon-btn ${cls}" title="${title}" aria-label="${title}" data-action="${action}" data-id="${id}">${icon(ic)}</button>`;
const editBtn = (a, id) => iconBtn(a, id, 'edit', 'Өңдеу');
const delBtn = (a, id) => iconBtn(a, id, 'del', 'Жою', 'del');
const waHref = (phone, text) => `https://wa.me/${digits(phone)}?text=${encodeURIComponent(text)}`;
const waBtn = (phone, text) => `<a class="icon-btn wa" href="${waHref(phone, text)}" target="_blank" rel="noopener" title="WhatsApp арқылы жазу" aria-label="WhatsApp">${icon('chat')}</a>`;
const stat = (label, value, note, color) => `<div class="stat" style="--accent:${color}"><span>${label}</span><b>${value}</b><small>${note}</small></div>`;
const empty = (t) => `<p class="empty">${t}</p>`;
const meter = (value, max, cls = '') => `<div class="meter"><div class="progress ${cls}"><i style="width:${pct(value, max)}%"></i></div>`;
function goalBar(label, value, goal, fmt, forecast) {
  const p = pct(value, goal);
  const ok = forecast >= goal;
  return `<div class="goal">
    <div class="goal-top"><span>${label}</span><b>${p}%</b></div>
    <div class="progress goal-progress"><i style="width:${p}%"></i></div>
    <small>${fmt(value)} / ${fmt(goal)}</small>
    <small class="${ok ? 'up' : 'down'}">Болжам: ${fmt(forecast)} — ${ok ? 'мақсат орындалады' : 'мақсатқа жетпейді'}</small>
  </div>`;
}
const studentLink = (id) => `<button type="button" class="link" data-action="studentCard" data-id="${id}">${esc(studentName(id))}</button>`;

function reminderText(s) {
  const nextL = db.lessons.filter((l) => l.studentId === s.id && !l.done && l.date >= TODAY).sort(byDateTime)[0];
  let t = `Сәлеметсіз бе, ${s.name}! ${db.settings.schoolName} автомектебі.`;
  if (nextL) t += ` Келесі сабағыңыз: ${prettyDate(nextL.date)}, ${nextL.time} (${nextL.type.toLowerCase()}).`;
  if (debtOf(s) > 0) t += ` Оқу ақысының қалдығы: ${money(debtOf(s))}.`;
  return t;
}

// =====================================================================
// 7. БАСҚАРУ ТАҚТАСЫ
// =====================================================================
function getAlerts() {
  const out = [];
  const pend = pendingPayments().length;
  if (pend) out.push({ kind: 'warn', text: `Оқушы кабинетінен ${pend} төлем растауды күтуде — «Хабарламалар» бөлімі` });
  const unread = db.messages.filter((m) => m.from === 'student' && !m.read && m.kind !== 'payment').length;
  if (unread) out.push({ kind: 'info', text: `Оқушылардан ${unread} оқылмаған хабарлама бар` });
  carIssues().forEach(({ car, doc, st }) => out.push({
    kind: st.cls === 'bad' ? 'danger' : 'warn',
    text: `${car.model} (${car.plate}): ${doc.toLowerCase()} — ${st.text}`,
  }));
  db.exams.filter((e) => e.result === 'Өтпеді').forEach((e) => {
    const again = db.exams.some((x) => x.studentId === e.studentId && x.type === e.type && x.date > e.date);
    if (!again) out.push({ kind: 'danger', text: `${studentName(e.studentId)} «${e.type}» өте алмады — қайта тапсыруға жазу керек` });
  });
  const oldLeads = db.leads.filter((l) => l.status === 'Жаңа' && daysFrom(l.date) <= -1).length;
  if (oldLeads) out.push({ kind: 'warn', text: `${oldLeads} жаңа өтінімге 24 сағаттан бері жауап берілмеген` });
  const missed = db.lessons.filter((l) => l.date < TODAY && !l.done).length;
  if (missed) out.push({ kind: 'warn', text: `Өткен ${missed} сабақ «өтті» деп белгіленбеген — кестені тексеріңіз` });
  db.students.filter((s) => s.status === 'Практика' && debtOf(s) > 0)
    .forEach((s) => out.push({ kind: 'warn', text: `${s.name} практикада, бірақ қарызы бар: ${money(debtOf(s))}` }));
  db.exams.filter((e) => e.result === 'Күтілуде' && e.date >= TODAY && e.date <= addDays(7))
    .forEach((e) => out.push({ kind: 'info', text: `${studentName(e.studentId)}: ${e.type} — ${prettyDate(e.date)}` }));
  db.students.filter((s) => s.status !== 'Бітірді' && practiceReq(s) && practiceDone(s.id) >= practiceReq(s) && !examPassed(s.id, EXAM.innerPractice)
    && !db.exams.some((e) => e.studentId === s.id && e.type === EXAM.innerPractice && e.result === 'Күтілуде'))
    .forEach((s) => out.push({ kind: 'info', text: `${s.name} міндетті практиканы аяқтады — ішкі практикалық емтиханға жазуға болады` }));
  const order = { danger: 0, warn: 1, info: 2 };
  return out.sort((a, b) => order[a.kind] - order[b.kind]);
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Қайырлы таң' : h < 18 ? 'Қайырлы күн' : 'Қайырлы кеш';
}

function viewDashboard() {
  const active = db.students.filter((s) => s.status !== 'Бітірді');
  const todayLessons = db.lessons.filter((l) => l.date === TODAY);
  const inc = income(monthKey(0));
  const prev = income(monthKey(-1));
  const diff = prev ? Math.round(((inc - prev) / prev) * 100) : null;
  const debtors = db.students.filter((s) => debtOf(s) > 0).sort((a, b) => debtOf(b) - debtOf(a));
  const totalDebt = debtors.reduce((s, st) => s + debtOf(st), 0);
  const finished = db.exams.filter((e) => e.result !== 'Күтілуде');
  const passRate = pct(finished.filter((e) => e.result === 'Өтті').length, finished.length);
  const upcoming = db.lessons.filter((l) => l.date >= TODAY && !l.done).sort(byDateTime).slice(0, 6);
  const counts = STATUSES.map((st) => ({ st, n: db.students.filter((s) => s.status === st).length }));
  const max = Math.max(1, ...counts.map((c) => c.n));
  const alerts = getAlerts();
  const newLeads = db.leads.filter((l) => l.status === 'Жаңа');
  const ys = yearStats();

  return `
  <section class="hero">
    <div>
      <p class="hero-eyebrow">${greeting()}!</p>
      <h2>${esc(db.settings.schoolName)} · ${esc(db.settings.city)}</h2>
      <p>Бүгін ${todayLessons.length} сабақ, ${newLeads.length} жаңа өтінім және ${alerts.length} ескерту бар.</p>
    </div>
    <div class="hero-actions">
      <button class="btn light" data-action="addLead">${icon('plus')} Өтінім</button>
      <button class="btn light" data-action="addStudent">${icon('plus')} Оқушы</button>
      <button class="btn light" data-action="addLesson">${icon('plus')} Сабақ</button>
      <button class="btn light" data-action="addPayment">${icon('plus')} Төлем</button>
    </div>
  </section>

  <section class="stats">
    ${stat('Белсенді оқушылар', active.length, `Барлығы тіркелген: ${db.students.length}`, 'var(--primary)')}
    ${stat('Бүгінгі сабақтар', todayLessons.length, `${todayLessons.filter((l) => l.done).length} сабақ өтті`, 'var(--yellow)')}
    ${stat('Осы айдағы түсім', money(inc), diff === null ? 'өткен айда түсім жоқ' : `<span class="${diff >= 0 ? 'up' : 'down'}">${diff >= 0 ? '▲' : '▼'} ${Math.abs(diff)}%</span> өткен аймен салыстырғанда`, 'var(--green)')}
    ${stat('Жалпы қарыз', money(totalDebt), `${debtors.length} оқушыда`, 'var(--red)')}
    ${stat('Емтихан нәтижесі', passRate + '%', 'тапсырғандардың өткені', 'var(--purple)')}
  </section>

  <section class="grid-2">
    <div class="card span-2">
      <div class="card-head"><h2>${YEAR} жылғы мақсат</h2><button class="btn small" data-action="go" data-id="goals">${icon('target')} Жылдық жоспар</button></div>
      <div class="goal-grid">
        ${goalBar('Түсім', ys.inc, ys.goals.revenue, money, ys.forecastInc)}
        ${goalBar('Таза пайда', ys.profit, ys.goals.profit, money, ys.forecastProfit)}
        ${goalBar('Жаңа оқушылар', ys.newStudents, ys.goals.students, (v) => `${v} оқушы`, ys.forecastStudents)}
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h2>Жақын сабақтар</h2><button class="btn small" data-action="go" data-id="schedule">Кестені ашу</button></div>
      ${upcoming.length ? `<ul class="list">${upcoming.map((l) => `
        <li>
          <div class="when"><b>${l.time}</b><span>${l.date === TODAY ? 'Бүгін' : prettyDate(l.date)}</span></div>
          <div class="grow">${studentLink(l.studentId)}<span>${esc(instructorName(l.instructorId))}${l.carId ? ' · ' + esc(carLabel(l.carId)) : ''}</span></div>
          ${typePill(l.type)}
        </li>`).join('')}</ul>` : empty('Алдағы сабақтар жоқ')}
    </div>

    <div class="card">
      <div class="card-head"><h2>Автоматты ескертулер</h2><span class="muted small">${alerts.length} ескерту</span></div>
      ${alerts.length ? `<ul class="alerts">${alerts.slice(0, 7).map((a) => `<li class="al-${a.kind}">${esc(a.text)}</li>`).join('')}</ul>` : empty('Ескерту жоқ — бәрі тәртіпте')}
    </div>

    <div class="card">
      <div class="card-head"><h2>Жаңа өтінімдер</h2><button class="btn small" data-action="go" data-id="leads">Барлығы</button></div>
      ${newLeads.length ? `<ul class="list">${newLeads.slice(0, 5).map((l) => `
        <li>
          <div class="grow"><b>${esc(l.name)}</b><span>${esc(l.phone)} · ${l.category} санаты · ${esc(l.source)}</span></div>
          ${waBtn(l.phone, `Сәлеметсіз бе, ${l.name}! ${db.settings.schoolName} автомектебіне өтінім қалдырғаныңызға рахмет.`)}
          <button class="btn small" data-action="convertLead" data-id="${l.id}">Тіркеу</button>
        </li>`).join('')}</ul>` : empty('Жаңа өтінім жоқ')}
    </div>

    <div class="card">
      <div class="card-head"><h2>Оқу кезеңдері</h2><button class="btn small" data-action="go" data-id="students">Оқушылар</button></div>
      <div class="bars">${counts.map((c) => `
        <div class="bar-row"><span>${c.st}</span><div class="bar"><i style="width:${(c.n / max) * 100}%;background:${STATUS_COLOR[c.st]}"></i></div><b>${c.n}</b></div>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-head"><h2>Қарызы бар оқушылар</h2></div>
      ${debtors.length ? `<ul class="list">${debtors.slice(0, 5).map((s) => `
        <li>
          <div class="grow">${studentLink(s.id)}<span>${esc(s.phone)} · ${s.category} санаты</span></div>
          <span class="debt">${money(debtOf(s))}</span>
          ${waBtn(s.phone, reminderText(s))}
          <button class="btn small" data-action="payFor" data-id="${s.id}">Төлем</button>
        </li>`).join('')}</ul>` : empty('Барлық оқушы толық төледі')}
    </div>

    <div class="card">
      <div class="card-head"><h2>Соңғы әрекеттер</h2></div>
      ${db.log.length ? `<ul class="list log">${db.log.slice(0, 7).map((x) => `<li><time>${timeStr(x.ts)}</time><span class="grow">${esc(x.text)}</span></li>`).join('')}</ul>` : empty('Әзірге әрекет жоқ')}
    </div>
  </section>`;
}

// =====================================================================
// 8. ӨТІНІМДЕР (CRM)
// =====================================================================
function viewLeads() {
  const c = (st) => db.leads.filter((l) => l.status === st).length;
  const conv = pct(c('Тіркелді'), db.leads.length);
  return `
  <section class="stats">
    ${stat('Жаңа өтінімдер', c('Жаңа'), 'жауап күтіп тұр', 'var(--primary)')}
    ${stat('Хабарласты', c('Хабарласты'), 'шешім қабылдауда', 'var(--yellow)')}
    ${stat('Тіркелді', c('Тіркелді'), 'оқушыға айналды', 'var(--green)')}
    ${stat('Конверсия', conv + '%', `барлық ${db.leads.length} өтінімнен`, 'var(--purple)')}
  </section>
  <div class="toolbar">
    <input class="input" type="search" placeholder="Аты немесе телефон бойынша іздеу…" data-filter="lq" value="${esc(filters.lq)}">
    <select class="input" data-filter="ls">
      <option value="">Барлық күй</option>
      ${LEAD_STATUSES.map((s) => `<option ${filters.ls === s ? 'selected' : ''}>${s}</option>`).join('')}
    </select>
    <button class="btn primary" data-action="addLead">${icon('plus')} Өтінім қосу</button>
  </div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>Күні</th><th>Аты-жөні</th><th>Телефон</th><th>Санат</th><th>Көзі</th><th>Күйі</th><th></th></tr></thead>
      <tbody id="rows">${leadRows()}</tbody>
    </table>
  </div>`;
}

function leadRows() {
  const q = filters.lq.trim().toLowerCase();
  const qd = digits(q);
  const rows = db.leads
    .filter((l) => (!filters.ls || l.status === filters.ls) && (!q || l.name.toLowerCase().includes(q) || (qd.length >= 3 && digits(l.phone).includes(qd))))
    .sort((a, b) => b.date.localeCompare(a.date));
  if (!rows.length) return '<tr><td colspan="7" class="empty-cell">Өтінім табылмады</td></tr>';
  return rows.map((l) => `<tr>
    <td class="nowrap">${prettyDate(l.date)}</td>
    <td><b>${esc(l.name)}</b>${db.accounts.some((a) => a.leadId === l.id) ? `<small>${pill('сайтта аккаунты бар', 's-exam')}</small>` : ''}${l.note ? `<small>${esc(l.note)}</small>` : ''}</td>
    <td class="nowrap">${esc(l.phone)}</td>
    <td><span class="cat">${l.category}</span></td>
    <td>${esc(l.source)}</td>
    <td><select class="input mini-select" data-change="leadStatus" data-id="${l.id}" aria-label="Күйі">
      ${LEAD_STATUSES.map((s) => `<option ${s === l.status ? 'selected' : ''}>${s}</option>`).join('')}
    </select></td>
    <td class="actions">
      ${l.status !== 'Тіркелді' ? `<button class="btn small" data-action="convertLead" data-id="${l.id}">${icon('userPlus')} Тіркеу</button>` : ''}
      ${waBtn(l.phone, `Сәлеметсіз бе, ${l.name}! ${db.settings.schoolName} автомектебі. ${l.category} санаты бойынша оқу бағасы — ${money(basePrice(l.category))}.`)}
      ${editBtn('editLead', l.id)}${delBtn('deleteLead', l.id)}
    </td>
  </tr>`).join('');
}

function leadForm(l = {}) {
  openForm({
    title: l.id ? 'Өтінімді өңдеу' : 'Жаңа өтінім',
    values: { category: 'B', source: 'Instagram', status: 'Жаңа', date: TODAY, ...l },
    fields: [
      { name: 'name', label: 'Аты-жөні', required: true, full: true },
      { name: 'phone', label: 'Телефон', type: 'tel', required: true, placeholder: '+7 7__ ___ __ __' },
      { name: 'category', label: 'Санат', type: 'select', options: list(CATEGORIES) },
      { name: 'source', label: 'Өтінім көзі', type: 'select', options: list(LEAD_SOURCES) },
      { name: 'date', label: 'Күні', type: 'date', required: true },
      { name: 'status', label: 'Күйі', type: 'select', options: list(LEAD_STATUSES), full: true },
      { name: 'note', label: 'Ескерту', type: 'textarea', full: true },
    ],
    onSubmit: (d) => {
      if (!d.name || !d.date) return 'Аты-жөні мен күнін толтырыңыз';
      if (digits(d.phone).length < 10) return 'Телефон нөмірі кемінде 10 цифрдан тұруы керек';
      if (l.id) Object.assign(byId('leads', l.id), d);
      else { db.leads.push({ id: uid('d'), ...d }); logAct(`Жаңа өтінім: ${d.name} (${d.source})`); }
    },
    success: l.id ? 'Өтінім жаңартылды' : 'Өтінім қосылды',
  });
}

// =====================================================================
// 8а. ХАБАРЛАМАЛАР (әкімші ↔ оқушы кабинеті)
// =====================================================================
let inboxAcc = null;

function msgBubble(m, side) {
  const mine = m.from === side;
  const payment = m.kind === 'payment';
  const st = { pending: pill('Растауды күтуде', 's-practice'), confirmed: pill('Расталды', 's-done'), rejected: pill('Қабылданбады', 's-fail') };
  return `<div class="bubble ${mine ? 'mine' : ''} ${m.kind === 'system' ? 'sys' : ''}">
    ${payment ? `<div class="bubble-pay">${icon('card')}<b>${money(m.amount)}</b><span>${esc(m.method)}</span>${st[m.status] || ''}</div>` : ''}
    <p>${esc(m.text)}</p>
    <time>${timeStr(m.ts)}${m.kind === 'system' ? ' · автоматты' : ''}</time>
    ${payment && m.status === 'pending' && side === 'admin' ? `<div class="bubble-actions">
      <button type="button" class="btn small primary" data-action="confirmPay" data-id="${m.id}">${icon('check')} Растау</button>
      <button type="button" class="btn small" data-action="rejectPay" data-id="${m.id}">Қабылдамау</button></div>` : ''}
  </div>`;
}

function viewInbox() {
  const threads = db.accounts.filter((a) => a.role === 'student').map((a) => {
    const msgs = db.messages.filter((m) => m.accountId === a.id).sort((x, y) => x.ts - y.ts);
    return { a, msgs, last: msgs.at(-1), unread: msgs.filter((m) => m.from === 'student' && !m.read).length };
  }).sort((x, y) => (y.last?.ts || 0) - (x.last?.ts || 0));
  if (!inboxAcc || !threads.some((t) => t.a.id === inboxAcc)) inboxAcc = threads[0]?.a.id || null;
  const cur = threads.find((t) => t.a.id === inboxAcc);
  // Ашылған тізбектегі оқушы хабарламаларын оқылды деп белгілеу
  if (cur && cur.unread) { cur.msgs.forEach((m) => { if (m.from === 'student') m.read = true; }); cur.unread = 0; save(); setTimeout(renderNav, 0); }
  const st = cur && cur.a.studentId ? byId('students', cur.a.studentId) : null;
  const pend = pendingPayments();
  return `
  <section class="stats">
    ${stat('Оқушы аккаунттары', threads.length, 'сайт арқылы тіркелген', 'var(--primary)')}
    ${stat('Оқылмаған', unreadForAdmin(), 'оқушылардан келген хабарлама', 'var(--yellow)')}
    ${stat('Төлем растау', pend.length, pend.length ? money(pend.reduce((s, m) => s + m.amount, 0)) + ' күтуде' : 'күтудегі төлем жоқ', 'var(--green)')}
  </section>
  ${threads.length ? `<div class="inbox">
    <div class="card inbox-list">${threads.map((t) => `
      <button type="button" class="thread ${t.a.id === inboxAcc ? 'on' : ''}" data-action="openThread" data-id="${t.a.id}">
        <div class="avatar">${esc(initials(t.a.name))}</div>
        <div class="grow"><b>${esc(t.a.name)}</b><span>${t.last ? esc(t.last.kind === 'payment' ? `Төлем: ${money(t.last.amount)}` : t.last.text).slice(0, 48) : 'Хабарлама жоқ'}</span></div>
        ${t.unread ? `<em class="badge">${t.unread}</em>` : ''}
      </button>`).join('')}
    </div>
    <div class="card inbox-thread">
      ${cur ? `
      <div class="thread-head">
        <div class="avatar">${esc(initials(cur.a.name))}</div>
        <div class="grow"><b>${esc(cur.a.name)}</b><span>${esc(cur.a.email)} · ${st ? `${st.category} санаты · ${st.status} · қалдық ${money(debtOf(st))}` : 'әзірге өтінім (оқушы емес)'}</span></div>
        ${st ? `<button class="btn small" data-action="studentCard" data-id="${st.id}">${icon('eye')} Оқушы картасы</button>` : ''}
      </div>
      <div class="bubbles" id="bubbles">${cur.msgs.map((m) => msgBubble(m, 'admin')).join('') || empty('Хабарлама әзірге жоқ')}</div>
      <form id="replyForm" class="reply" novalidate>
        <textarea class="input textarea" name="text" placeholder="${esc(firstName(cur.a.name))} оқушысына жауап жазу…" rows="2"></textarea>
        <button type="submit" class="btn primary">${icon('chat')} Жіберу</button>
      </form>` : empty('Тізбек таңдалмаған')}
    </div>
  </div>` : `<div class="card">${empty('Әзірге оқушы аккаунты жоқ. Оқушылар сайттағы «Тіркелу» арқылы аккаунт ашады.')}</div>`}`;
}

function sendReply(form) {
  const text = String(new FormData(form).get('text') || '').trim();
  if (!text) return;
  db.messages.push({ id: uid('m'), accountId: inboxAcc, from: 'admin', kind: 'text', text, ts: Date.now(), read: false });
  logAct(`Оқушыға хабарлама жіберілді: ${byId('accounts', inboxAcc)?.name || ''}`);
  save();
  render();
  toast('Хабарлама оқушы кабинетіне жіберілді');
}

// =====================================================================
// 9. ОҚУШЫЛАР
// =====================================================================
const SORTERS = {
  name: (a, b) => a.name.localeCompare(b.name, 'kk'),
  start: (a, b) => b.startDate.localeCompare(a.startDate),
  debt: (a, b) => debtOf(b) - debtOf(a),
  progress: (a, b) => practiceDone(b.id) / (practiceReq(b) || 1) - practiceDone(a.id) / (practiceReq(a) || 1),
};

function viewStudents() {
  return `
  <div class="toolbar">
    <input class="input" type="search" placeholder="Аты немесе телефон бойынша іздеу…" data-filter="q" value="${esc(filters.q)}">
    <select class="input" data-filter="cat">
      <option value="">Барлық санат</option>
      ${CATEGORIES.map((c) => `<option value="${c}" ${filters.cat === c ? 'selected' : ''}>${c} санаты</option>`).join('')}
    </select>
    <select class="input" data-filter="st">
      <option value="">Барлық кезең</option>
      ${STATUSES.map((s) => `<option ${filters.st === s ? 'selected' : ''}>${s}</option>`).join('')}
    </select>
    <select class="input" data-filter="sort" aria-label="Сұрыптау">
      ${[['name', 'Аты бойынша'], ['start', 'Жаңалары бірінші'], ['debt', 'Қарызы көп'], ['progress', 'Практика прогресі']]
        .map(([v, t]) => `<option value="${v}" ${filters.sort === v ? 'selected' : ''}>${t}</option>`).join('')}
    </select>
    <button class="btn" data-action="exportStudents">${icon('download')} Excel (CSV)</button>
    <button class="btn primary" data-action="addStudent">${icon('plus')} Оқушы қосу</button>
  </div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>Аты-жөні</th><th>Телефон</th><th>Санат</th><th>Нұсқаушы</th><th>Кезең</th><th>Практика</th><th>Төлем</th><th></th></tr></thead>
      <tbody id="rows">${studentRows()}</tbody>
    </table>
  </div>`;
}

function filteredStudents() {
  const q = filters.q.trim().toLowerCase();
  const qd = digits(q);
  return db.students
    .filter((s) => (!filters.cat || s.category === filters.cat) && (!filters.st || s.status === filters.st)
      && (!q || s.name.toLowerCase().includes(q) || (qd.length >= 3 && digits(s.phone).includes(qd))))
    .sort(SORTERS[filters.sort] || SORTERS.name);
}

function studentRows() {
  const rows = filteredStudents();
  if (!rows.length) return '<tr><td colspan="8" class="empty-cell">Оқушы табылмады</td></tr>';
  return rows.map((s) => {
    const paid = paidBy(s.id);
    const price = priceOf(s);
    const done = practiceDone(s.id);
    const req = practiceReq(s);
    return `<tr>
      <td>${studentLink(s.id)}<small>Басталды: ${prettyDate(s.startDate)}${s.discount ? ` · жеңілдік ${s.discount}%` : ''}</small></td>
      <td class="nowrap">${esc(s.phone)}</td>
      <td><span class="cat">${s.category}</span></td>
      <td>${esc(instructorName(s.instructorId))}</td>
      <td>${statusPill(s.status)}</td>
      <td>${meter(done, req, 'blue')}<small>${done} / ${req} сабақ</small></div></td>
      <td>${meter(paid, price)}<small>${money(paid)} / ${money(price)}</small></div></td>
      <td class="actions">${iconBtn('studentCard', s.id, 'eye', 'Оқушы картасы')}${waBtn(s.phone, reminderText(s))}${editBtn('editStudent', s.id)}${delBtn('deleteStudent', s.id)}</td>
    </tr>`;
  }).join('');
}

function studentForm(s = {}, opts = {}) {
  if (!db.instructors.length) return toast('Алдымен нұсқаушы қосыңыз');
  openForm({
    title: s.id ? 'Оқушыны өңдеу' : 'Жаңа оқушы',
    values: { category: 'B', status: 'Теория', startDate: TODAY, discount: 0, ...s },
    fields: [
      { name: 'name', label: 'Аты-жөні', required: true, full: true },
      { name: 'phone', label: 'Телефон', type: 'tel', required: true, placeholder: '+7 7__ ___ __ __' },
      { name: 'category', label: 'Санат', type: 'select', options: CATEGORIES.map((c) => ({ value: c, label: `${c} — ${money(basePrice(c))}` })) },
      { name: 'instructorId', label: 'Нұсқаушы', type: 'select', allowEmpty: true, options: instructorOptions(), full: true, hint: 'Нұсқаушыда оқушының санаты болуы керек' },
      { name: 'status', label: 'Оқу кезеңі', type: 'select', options: list(STATUSES) },
      { name: 'startDate', label: 'Оқу басталған күн', type: 'date', required: true },
      { name: 'discount', label: 'Жеңілдік (%)', type: 'number', min: 0, step: 1, hint: '0–50% аралығында. Баға автоматты қайта есептеледі' },
      { name: 'note', label: 'Ескерту', type: 'textarea', full: true },
    ],
    onSubmit: (d) => {
      if (!d.name || !d.startDate) return 'Аты-жөні мен оқу басталған күнін толтырыңыз';
      if (digits(d.phone).length < 10) return 'Телефон нөмірі кемінде 10 цифрдан тұруы керек';
      const ins = byId('instructors', d.instructorId);
      if (!ins) return 'Нұсқаушыны таңдаңыз';
      if (!ins.categories.includes(d.category)) return `${ins.name} «${d.category}» санатына оқытпайды`;
      if (!(d.discount >= 0 && d.discount <= 50)) return 'Жеңілдік 0 мен 50% аралығында болуы керек';
      if (db.students.some((x) => x.id !== s.id && digits(x.phone) === digits(d.phone))) return 'Бұл телефон нөмірімен оқушы тіркелген';
      if (s.id) Object.assign(byId('students', s.id), d);
      else {
        const newId = uid('s');
        db.students.push({ id: newId, ...d });
        logAct(`Жаңа оқушы тіркелді: ${d.name} (${d.category} санаты)`);
        if (opts.fromLead) {
          const lead = byId('leads', opts.fromLead);
          if (lead) lead.status = 'Тіркелді';
          // Сайтта аккаунт ашқан болса — оқушы кабинетін автоматты байланыстыру
          db.accounts.filter((a) => a.leadId === opts.fromLead).forEach((a) => { a.studentId = newId; });
          notifyStudent(newId, `Құттықтаймыз! Сіз ${d.category} санаты бойынша оқушы ретінде тіркелдіңіз. Нұсқаушыңыз: ${instructorName(d.instructorId)}. Енді кабинеттен сабаққа жазыла аласыз.`);
        }
      }
    },
    success: s.id ? 'Оқушы деректері жаңартылды' : opts.fromLead ? 'Өтінім оқушыға айналды' : 'Оқушы тіркелді',
  });
}

function studentCard(id) {
  const s = byId('students', id);
  if (!s) return;
  const price = priceOf(s);
  const paid = paidBy(s.id);
  const debt = debtOf(s);
  const done = practiceDone(s.id);
  const req = practiceReq(s);
  const lessons = db.lessons.filter((l) => l.studentId === id).sort(byDateTime).reverse();
  const pays = db.payments.filter((p) => p.studentId === id).sort((a, b) => b.date.localeCompare(a.date));
  const exams = db.exams.filter((e) => e.studentId === id).sort((a, b) => b.date.localeCompare(a.date));
  openModal('Оқушы картасы', `
  <div class="profile">
    <div class="profile-head">
      <div class="avatar big">${esc(initials(s.name))}</div>
      <div class="grow"><b class="profile-name">${esc(s.name)}</b>
        <span>${esc(s.phone)} · ${s.category} санаты · нұсқаушы: ${esc(instructorName(s.instructorId))}</span>
        <span>${accountsOf(s.id).length ? `Сайт аккаунты: ${accountsOf(s.id).map((a) => esc(a.email)).join(', ')}` : 'Сайтта аккаунты жоқ'}</span>
        <span>${theoryLine(s.id)}</span></div>
      ${statusPill(s.status)}
    </div>
    <div class="profile-grid">
      <div class="mini"><span>Оқу ақысы</span><b>${money(price)}</b><small>${s.discount ? `жеңілдік ${s.discount}%` : 'жеңілдіксіз'}</small></div>
      <div class="mini"><span>Төленді</span><b>${money(paid)}</b>${meter(paid, price)}</div></div>
      <div class="mini"><span>Қалдық</span><b class="${debt ? 'debt' : ''}">${money(debt)}</b><small>${debt ? 'төлеу керек' : 'толық төленді'}</small></div>
      <div class="mini"><span>Практика</span><b>${done} / ${req}</b>${meter(done, req, 'blue')}</div></div>
    </div>
    ${s.note ? `<p class="note">${esc(s.note)}</p>` : ''}
    <div class="profile-cols">
      <div><h3>Сабақтар (${lessons.length})</h3><ul class="mini-list">${lessons.slice(0, 8).map((l) =>
        `<li><span>${prettyDate(l.date)}, ${l.time} · ${l.type}</span><b>${l.done ? 'өтті' : 'жоспарда'}</b></li>`).join('') || '<li>Сабақ жоқ</li>'}</ul></div>
      <div><h3>Төлемдер (${pays.length})</h3><ul class="mini-list">${pays.map((p) =>
        `<li><span>${prettyDate(p.date)} · ${esc(p.method)}</span><b>${money(p.amount)}</b></li>`).join('') || '<li>Төлем жоқ</li>'}</ul></div>
      <div><h3>Емтихандар (${exams.length})</h3><ul class="mini-list">${exams.map((e) =>
        `<li><span>${esc(e.type.replace(' емтихан', ''))}</span><b>${e.result}</b></li>`).join('') || '<li>Емтихан жоқ</li>'}</ul></div>
    </div>
    <div class="modal-actions">
      ${accountsOf(s.id).length ? `<button type="button" class="btn" data-action="messageStudent" data-id="${s.id}">${icon('chat')} Кабинетке жазу</button>` : ''}
      <a class="btn wa" href="${waHref(s.phone, reminderText(s))}" target="_blank" rel="noopener">${icon('chat')} WhatsApp еске салу</a>
      ${debt ? `<button type="button" class="btn" data-action="payFor" data-id="${s.id}">${icon('card')} Төлем қабылдау</button>` : ''}
      <button type="button" class="btn" data-action="editStudent" data-id="${s.id}">${icon('edit')} Өңдеу</button>
      <button type="button" class="btn primary" data-close>Жабу</button>
    </div>
  </div>`, true);
}

// =====================================================================
// 10. НҰСҚАУШЫЛАР
// =====================================================================
function viewInstructors() {
  const weekEnd = addDays(6);
  return `
  <div class="toolbar">
    <p class="muted small grow-text">Әр нұсқаушының оқушылары, көліктері, жүктемесі және оқушыларының емтихан нәтижесі автоматты есептеледі.</p>
    <button class="btn primary" data-action="addInstructor">${icon('plus')} Нұсқаушы қосу</button>
  </div>
  ${db.instructors.length ? `<div class="cards">${db.instructors.map((i) => {
    const studs = db.students.filter((s) => s.instructorId === i.id && s.status !== 'Бітірді').length;
    const week = db.lessons.filter((l) => l.instructorId === i.id && l.date >= TODAY && l.date <= weekEnd).length;
    const sids = db.students.filter((s) => s.instructorId === i.id).map((s) => s.id);
    const ex = db.exams.filter((e) => sids.includes(e.studentId) && e.result !== 'Күтілуде');
    const rate = ex.length ? pct(ex.filter((e) => e.result === 'Өтті').length, ex.length) + '%' : '—';
    return `<div class="card">
      <div class="inst-top">
        <div class="avatar">${esc(initials(i.name))}</div>
        <div class="grow"><b>${esc(i.name)}</b><span>${esc(i.phone)}</span></div>
      </div>
      <div class="info">
        <div><span>Санаттар</span><div class="chips">${i.categories.map((c) => `<span class="chip">${c}</span>`).join('')}</div></div>
        <div><span>Көліктері</span><b>${(i.carIds || []).map((cid) => esc(carLabel(cid))).join('<br>') || '—'}</b></div>
        <div><span>Тәжірибесі</span><b>${i.experience} жыл</b></div>
      </div>
      <div class="meta">
        <div><b>${studs}</b><span>оқушы</span></div>
        <div><b>${week}</b><span>сабақ / 7 күн</span></div>
        <div><b>${rate}</b><span>емтихан</span></div>
      </div>
      <div class="card-foot">${waBtn(i.phone, `Сәлеметсіз бе, ${i.name}! Ертеңгі сабақ кестесін тексеріңізші.`)}${editBtn('editInstructor', i.id)}${delBtn('deleteInstructor', i.id)}</div>
    </div>`;
  }).join('')}</div>` : `<div class="card">${empty('Нұсқаушылар әлі қосылмаған')}</div>`}`;
}

function instructorForm(i = {}) {
  openForm({
    title: i.id ? 'Нұсқаушыны өңдеу' : 'Жаңа нұсқаушы',
    values: { categories: ['B'], carIds: [], experience: 1, ...i },
    fields: [
      { name: 'name', label: 'Аты-жөні', required: true, full: true },
      { name: 'phone', label: 'Телефон', type: 'tel', required: true },
      { name: 'experience', label: 'Тәжірибесі (жыл)', type: 'number', min: 0, step: 1, required: true },
      { name: 'categories', label: 'Оқытатын санаттар', type: 'checks', options: list(CATEGORIES), full: true },
      { name: 'carIds', label: 'Бекітілген көліктер', type: 'checks', options: db.cars.map((c) => ({ value: c.id, label: `${c.model} (${c.category})` })), full: true },
    ],
    onSubmit: (d) => {
      if (!d.name) return 'Аты-жөнін толтырыңыз';
      if (digits(d.phone).length < 10) return 'Телефон нөмірі кемінде 10 цифрдан тұруы керек';
      if (!d.categories.length) return 'Кемінде бір санатты таңдаңыз';
      if (!(d.experience >= 0)) return 'Тәжірибені дұрыс енгізіңіз';
      const wrong = d.carIds.map((cid) => byId('cars', cid)).find((c) => c && !d.categories.includes(c.category));
      if (wrong) return `${wrong.model} — ${wrong.category} санатты көлік, бірақ нұсқаушыда бұл санат жоқ`;
      if (i.id) Object.assign(byId('instructors', i.id), d);
      else { db.instructors.push({ id: uid('i'), ...d }); logAct(`Жаңа нұсқаушы: ${d.name}`); }
    },
    success: i.id ? 'Нұсқаушы жаңартылды' : 'Нұсқаушы қосылды',
  });
}

// =====================================================================
// 11. АВТОПАРК
// =====================================================================
function viewCars() {
  const working = db.cars.filter((c) => c.status === 'Жұмыста').length;
  const issues = carIssues();
  return `
  <section class="stats">
    ${stat('Барлық көлік', db.cars.length, 'автопаркте', 'var(--primary)')}
    ${stat('Жұмыста', working, 'сабаққа дайын', 'var(--green)')}
    ${stat('Жөндеуде', db.cars.length - working, 'сабаққа шықпайды', 'var(--orange)')}
    ${stat('Құжат ескертуі', issues.length, 'техбайқау / сақтандыру', 'var(--red)')}
  </section>
  <div class="toolbar">
    <p class="muted small grow-text">Техбайқау мен сақтандыру мерзімі 30 күннен аз қалса, жүйе автоматты ескертеді. Жөндеудегі көлікке сабақ жазылмайды.</p>
    <button class="btn primary" data-action="addCar">${icon('plus')} Көлік қосу</button>
  </div>
  ${db.cars.length ? `<div class="cards">${db.cars.map((c) => {
    const ins = docState(c.inspection);
    const sur = docState(c.insurance);
    return `<div class="card">
      <div class="inst-top">
        <div class="car-icon">${icon('car')}</div>
        <div class="grow"><b>${esc(c.model)}</b><span class="plate">${esc(c.plate)}</span></div>
        <select class="input mini-select ${c.status === 'Жұмыста' ? 'r-pass' : 'r-fail'}" data-change="carStatus" data-id="${c.id}" aria-label="Күйі">
          ${CAR_STATUSES.map((s) => `<option ${s === c.status ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="info">
        <div><span>Санат · жылы</span><b>${c.category} · ${c.year}</b></div>
        <div><span>Жүрісі</span><b>${num(c.mileage)} км</b></div>
        <div><span>Техбайқау</span><span class="doc ${ins.cls}">${ins.text}</span></div>
        <div><span>Сақтандыру</span><span class="doc ${sur.cls}">${sur.text}</span></div>
        <div><span>Нұсқаушы</span><b>${esc(carUsers(c.id).join(', ') || '—')}</b></div>
      </div>
      <div class="card-foot">${editBtn('editCar', c.id)}${delBtn('deleteCar', c.id)}</div>
    </div>`;
  }).join('')}</div>` : `<div class="card">${empty('Автопарк бос')}</div>`}`;
}

function carForm(c = {}) {
  openForm({
    title: c.id ? 'Көлікті өңдеу' : 'Жаңа көлік',
    values: { category: 'B', year: new Date().getFullYear(), mileage: 0, inspection: addDays(365), insurance: addDays(365), status: 'Жұмыста', ...c },
    fields: [
      { name: 'model', label: 'Маркасы мен моделі', required: true, full: true },
      { name: 'plate', label: 'Мемлекеттік нөмірі', required: true, placeholder: '123 ABC 02' },
      { name: 'category', label: 'Санат', type: 'select', options: list(CATEGORIES) },
      { name: 'year', label: 'Шыққан жылы', type: 'number', min: 1990, step: 1 },
      { name: 'mileage', label: 'Жүрісі (км)', type: 'number', min: 0, step: 1 },
      { name: 'inspection', label: 'Техбайқау мерзімі', type: 'date', required: true },
      { name: 'insurance', label: 'Сақтандыру мерзімі', type: 'date', required: true },
      { name: 'status', label: 'Күйі', type: 'select', options: list(CAR_STATUSES), full: true },
    ],
    onSubmit: (d) => {
      if (!d.model || !d.plate || !d.inspection || !d.insurance) return 'Барлық міндетті өрісті толтырыңыз';
      d.plate = d.plate.toUpperCase();
      if (db.cars.some((x) => x.id !== c.id && x.plate.replace(/\s/g, '') === d.plate.replace(/\s/g, ''))) return 'Бұл нөмірлі көлік тіркелген';
      if (!(d.year >= 1990 && d.year <= new Date().getFullYear() + 1)) return 'Шыққан жылын дұрыс енгізіңіз';
      if (!(d.mileage >= 0)) return 'Жүрісін дұрыс енгізіңіз';
      if (c.id) Object.assign(byId('cars', c.id), d);
      else { db.cars.push({ id: uid('c'), ...d }); logAct(`Автопаркке қосылды: ${d.model} (${d.plate})`); }
    },
    success: c.id ? 'Көлік жаңартылды' : 'Көлік қосылды',
  });
}

// =====================================================================
// 12. САБАҚ КЕСТЕСІ
// =====================================================================
function viewSchedule() {
  const days = Array.from({ length: 7 }, (_, k) => addDays(weekOffset * 7 + k));
  const lessons = db.lessons.filter((l) => !filters.inst || l.instructorId === filters.inst);
  const weekL = lessons.filter((l) => l.date >= days[0] && l.date <= days[6]);
  return `
  <div class="toolbar">
    <div class="seg">
      <button class="btn" data-action="prevWeek" aria-label="Алдыңғы апта">‹</button>
      <button class="btn" data-action="thisWeek">Бүгін</button>
      <button class="btn" data-action="nextWeek" aria-label="Келесі апта">›</button>
    </div>
    <span class="range grow-text">${prettyDate(days[0])} — ${prettyDate(days[6])} · ${weekL.length} сабақ (${weekL.filter((l) => l.type === 'Практика').length} практика)</span>
    <select class="input" data-filter="inst">
      <option value="">Барлық нұсқаушы</option>
      ${db.instructors.map((i) => `<option value="${i.id}" ${filters.inst === i.id ? 'selected' : ''}>${esc(i.name)}</option>`).join('')}
    </select>
    <button class="btn primary" data-action="addLesson">${icon('plus')} Сабақ қосу</button>
  </div>
  <div class="week">${days.map((d) => {
    const dl = lessons.filter((l) => l.date === d).sort(byDateTime);
    return `<div class="day ${d === TODAY ? 'today' : ''}">
      <div class="day-head"><b>${weekday(d)}</b><span>${prettyDate(d)}${d === TODAY ? ' · бүгін' : ''}</span></div>
      ${dl.length ? dl.map((l) => `
        <div class="lesson ${l.type === 'Практика' ? 'practice' : 'theory'} ${l.done ? 'done' : ''}">
          <div class="lesson-top"><b>${l.time}</b>${typePill(l.type)}</div>
          <div>${studentLink(l.studentId)}</div>
          <small>${esc(instructorName(l.instructorId))}</small>
          ${l.carId ? `<small>${esc(carLabel(l.carId))}</small>` : ''}
          ${l.note ? `<small><i>${esc(l.note)}</i></small>` : ''}
          <div class="lesson-foot">
            <label class="check"><input type="checkbox" data-change="lessonDone" data-id="${l.id}" ${l.done ? 'checked' : ''}> Өтті</label>
            ${delBtn('deleteLesson', l.id)}
          </div>
        </div>`).join('') : '<p class="muted small">Сабақ жоқ</p>'}
    </div>`;
  }).join('')}</div>`;
}

function lessonForm(studentId) {
  const pool = db.students.filter((s) => s.status !== 'Бітірді');
  if (!pool.length) return toast('Сабаққа жазылатын оқушы жоқ');
  openForm({
    title: 'Жаңа сабақ',
    values: { studentId, date: weekOffset > 0 ? addDays(weekOffset * 7) : TODAY, time: '10:30', type: 'Практика' },
    fields: [
      { name: 'studentId', label: 'Оқушы', type: 'select', options: pool.map((s) => ({ value: s.id, label: `${s.name} (${s.category}) — практика ${practiceDone(s.id)}/${practiceReq(s)}` })), full: true },
      { name: 'instructorId', label: 'Нұсқаушы', type: 'select', allowEmpty: true, emptyLabel: 'Оқушының өз нұсқаушысы', options: instructorOptions(), full: true },
      { name: 'date', label: 'Күні', type: 'date', required: true },
      { name: 'time', label: 'Уақыты', type: 'select', options: list(SLOTS) },
      { name: 'type', label: 'Сабақ түрі', type: 'select', options: list(LESSON_TYPES), full: true, hint: 'Практикаға көлік автоматты таңдалады' },
      { name: 'note', label: 'Ескерту', type: 'textarea', full: true },
    ],
    onSubmit: (d) => {
      const r = bookLesson(d);
      if (r.err) return r.err;
      notifyStudent(d.studentId, `Сізге сабақ жазылды: ${prettyDate(d.date)}, ${d.time} (${d.type.toLowerCase()})${d.carId ? `, көлік: ${carLabel(d.carId)}` : ''}.`);
      toast(r.msg);
    },
  });
}

// Сабаққа жазу: барлық бизнес-ережелер осында тексеріледі (әкімші де, оқушы да қолданады)
function bookLesson(d) {
  const st = byId('students', d.studentId);
  if (!st) return { err: 'Оқушыны таңдаңыз' };
  if (!d.date) return { err: 'Күнін көрсетіңіз' };
  if (st.status === 'Бітірді') return { err: 'Оқуды бітірген оқушыға сабақ жазылмайды' };
  d.instructorId = d.instructorId || st.instructorId;
  const ins = byId('instructors', d.instructorId);
  if (!ins) return { err: 'Нұсқаушыны таңдаңыз' };
  if (db.lessons.some((l) => l.date === d.date && l.time === d.time && l.instructorId === d.instructorId))
    return { err: `${ins.name} ${prettyDate(d.date)}, ${d.time} уақытында бос емес` };
  if (db.lessons.some((l) => l.date === d.date && l.time === d.time && l.studentId === d.studentId))
    return { err: 'Оқушының бұл уақытта басқа сабағы бар' };
  d.carId = '';
  if (d.type === 'Практика') {
    if (!ins.categories.includes(st.category)) return { err: `${ins.name} «${st.category}» санатына практика жүргізбейді` };
    if (paidBy(st.id) === 0) return { err: 'Практикаға жазылу үшін алдымен алғашқы төлем жасалуы керек' };
    const cars = db.cars.filter((c) => (ins.carIds || []).includes(c.id) && c.category === st.category);
    if (!cars.length) return { err: `${ins.name} нұсқаушысына ${st.category} санатты көлік бекітілмеген` };
    const car = cars.find((c) => c.status === 'Жұмыста' && docState(c.inspection).cls !== 'bad'
      && !db.lessons.some((l) => l.date === d.date && l.time === d.time && l.carId === c.id));
    if (!car) return { err: 'Бос әрі жарамды көлік жоқ (жөндеуде, техбайқау мерзімі өткен немесе бос емес)' };
    d.carId = car.id;
  }
  db.lessons.push({ id: uid('l'), studentId: d.studentId, instructorId: d.instructorId, carId: d.carId, date: d.date, time: d.time, type: d.type, done: false, note: d.note || '' });
  logAct(`Сабақ жазылды: ${st.name} — ${prettyDate(d.date)}, ${d.time} (${d.type})`);
  if (d.type === 'Практика' && st.status === 'Теория') {
    st.status = 'Практика';
    return { msg: `Сабақ қосылды. ${st.name} «Практика» кезеңіне ауысты` };
  }
  return { msg: d.carId ? `Сабақ қосылды. Көлік: ${carLabel(d.carId)}` : 'Сабақ кестеге қосылды' };
}

// =====================================================================
// 12а. ТЕОРИЯ САБАҚТАРЫ (әкімші басқарады, оқушы кабинетте көреді)
// =====================================================================
const theorySorted = () => [...db.theory].sort((a, b) => (a.order || 0) - (b.order || 0));
const watchedCount = (acc) => (acc.watched || []).filter((id) => db.theory.some((t) => t.id === id)).length;
const bestTest = (acc) => (acc.tests || []).reduce((best, t) => Math.max(best, pct(t.score, t.total)), 0);
function theoryLine(studentId) {
  const acc = accountsOf(studentId)[0];
  if (!acc) return 'Сайтта аккаунты жоқ — теория прогресі көрінбейді';
  return `Теория: ${watchedCount(acc)} / ${db.theory.length} бейнесабақ · Тест: ${acc.tests.length ? bestTest(acc) + '% (ең жақсы)' : 'тапсырмаған'}`;
}

function viewTheory() {
  const lessons = theorySorted();
  const studs = db.accounts.filter((a) => a.role === 'student');
  const avgW = studs.length ? Math.round(studs.reduce((s, a) => s + pct(watchedCount(a), lessons.length), 0) / studs.length) : 0;
  const tested = studs.filter((a) => a.tests.length);
  const avgT = tested.length ? Math.round(tested.reduce((s, a) => s + bestTest(a), 0) / tested.length) : 0;
  return `
  <section class="stats">
    ${stat('Бейнесабақтар', lessons.length, 'YouTube сілтемесі арқылы', 'var(--primary)')}
    ${stat('Оқушы аккаунттары', studs.length, 'кабинеттен көре алады', 'var(--purple)')}
    ${stat('Орташа қарау', avgW + '%', 'сабақтардың қаралған үлесі', 'var(--yellow)')}
    ${stat('Тест нәтижесі', tested.length ? avgT + '%' : '—', `${tested.length} оқушы тапсырды`, 'var(--green)')}
  </section>
  <div class="toolbar">
    <p class="muted small grow-text">Мұнда қосқан сабақтар оқушы кабинетіндегі «Теория» бетінде бірден шығады. YouTube сілтемесін қойсаңыз жеткілікті.</p>
    <button class="btn primary" data-action="addTheory">${icon('plus')} Сабақ қосу</button>
  </div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>#</th><th>Сабақ</th><th>Бейне</th><th class="right">Қарағандар</th><th></th></tr></thead>
      <tbody>${lessons.map((t) => `<tr>
        <td>${t.order || ''}</td>
        <td><b>${esc(t.title)}</b><small>${esc(t.desc)}</small></td>
        <td><a class="btn small" href="${ytUrl(t.youtube)}" target="_blank" rel="noopener">${icon('play')} YouTube</a></td>
        <td class="right">${studs.filter((a) => a.watched.includes(t.id)).length} / ${studs.length}</td>
        <td class="actions">${editBtn('editTheory', t.id)}${delBtn('deleteTheory', t.id)}</td>
      </tr>`).join('') || '<tr><td colspan="5" class="empty-cell">Сабақ жоқ</td></tr>'}</tbody>
    </table>
  </div>
  <div class="card table-wrap">
    <div class="card-head" style="padding:20px 20px 0"><h2>Оқушылардың теория прогресі</h2></div>
    <table>
      <thead><tr><th>Оқушы</th><th>Бейнесабақтар</th><th class="right">Тест (ең жақсы)</th><th class="right">Әрекет саны</th><th class="right">Соңғы тест</th></tr></thead>
      <tbody>${studs.map((a) => `<tr>
        <td><b>${esc(a.name)}</b><small>${esc(a.email)}</small></td>
        <td>${meter(watchedCount(a), lessons.length, 'blue')}<small>${watchedCount(a)} / ${lessons.length}</small></div></td>
        <td class="right">${a.tests.length ? `<b>${bestTest(a)}%</b>` : '—'}</td>
        <td class="right">${a.tests.length}</td>
        <td class="right nowrap">${a.tests.length ? timeStr(a.tests.at(-1).ts) : '—'}</td>
      </tr>`).join('') || '<tr><td colspan="5" class="empty-cell">Оқушы аккаунты жоқ</td></tr>'}</tbody>
    </table>
  </div>`;
}

function theoryForm(t = {}) {
  openForm({
    title: t.id ? 'Сабақты өңдеу' : 'Жаңа теория сабағы',
    values: { order: theorySorted().length + 1, ...t, url: t.youtube ? ytUrl(t.youtube) : '' },
    fields: [
      { name: 'title', label: 'Сабақ атауы', required: true, full: true },
      { name: 'url', label: 'YouTube сілтемесі', full: true, placeholder: 'https://www.youtube.com/watch?v=…', hint: 'youtube.com/watch?v=…, youtu.be/… немесе бейненің 11 таңбалы id-і' },
      { name: 'order', label: 'Реті', type: 'number', min: 1, step: 1 },
      { name: 'desc', label: 'Қысқаша сипаттама', type: 'textarea', full: true },
    ],
    onSubmit: (d) => {
      if (!d.title) return 'Сабақ атауын жазыңыз';
      const id = ytId(d.url);
      if (!id) return 'YouTube сілтемесі дұрыс емес';
      const rec = { title: d.title, youtube: id, order: d.order || 1, desc: d.desc };
      if (t.id) Object.assign(byId('theory', t.id), rec);
      else {
        db.theory.push({ id: uid('t'), ...rec });
        db.accounts.filter((a) => a.role === 'student').forEach((a) => db.messages.push({
          id: uid('m'), accountId: a.id, from: 'admin', kind: 'system', text: `Жаңа теория сабағы қосылды: «${d.title}». Кабинеттегі «Теория» бетінде көре аласыз.`, ts: Date.now(), read: false,
        }));
      }
      logAct(`Теория сабағы ${t.id ? 'жаңартылды' : 'қосылды'}: ${d.title}`);
    },
    success: t.id ? 'Сабақ жаңартылды' : 'Сабақ қосылды — оқушыларға хабарланды',
  });
}

// =====================================================================
// 13. ТӨЛЕМДЕР
// =====================================================================
function viewPayments() {
  const total = db.payments.reduce((s, p) => s + p.amount, 0);
  const debtors = db.students.filter((s) => debtOf(s) > 0);
  const debt = debtors.reduce((s, st) => s + debtOf(st), 0);
  const expected = db.students.reduce((s, st) => s + priceOf(st), 0);
  return `
  <section class="stats">
    ${stat('Барлық түсім', money(total), `${db.payments.length} төлем`, 'var(--primary)')}
    ${stat('Осы айда', money(income(monthKey(0))), `${MONTHS[new Date().getMonth()]} айы`, 'var(--green)')}
    ${stat('Күтілетін қалдық', money(debt), `${debtors.length} оқушыда қарыз бар`, 'var(--red)')}
    ${stat('Жиналу деңгейі', pct(total, expected) + '%', 'шарт сомасынан төленгені', 'var(--purple)')}
  </section>
  <div class="toolbar">
    <input class="input" type="search" placeholder="Оқушы аты бойынша іздеу…" data-filter="pq" value="${esc(filters.pq)}">
    <select class="input" data-filter="pm">
      <option value="">Барлық тәсіл</option>
      ${METHODS.map((m) => `<option ${filters.pm === m ? 'selected' : ''}>${m}</option>`).join('')}
    </select>
    <button class="btn" data-action="exportPayments">${icon('download')} Excel (CSV)</button>
    <button class="btn primary" data-action="addPayment">${icon('plus')} Төлем қабылдау</button>
  </div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>Күні</th><th>Оқушы</th><th>Төлем тәсілі</th><th class="right">Сома</th><th class="right">Қалдық</th><th></th></tr></thead>
      <tbody id="rows">${paymentRows()}</tbody>
    </table>
  </div>`;
}

function filteredPayments() {
  const q = filters.pq.trim().toLowerCase();
  return db.payments
    .filter((p) => (!filters.pm || p.method === filters.pm) && (!q || studentName(p.studentId).toLowerCase().includes(q)))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function paymentRows() {
  const rows = filteredPayments();
  if (!rows.length) return '<tr><td colspan="6" class="empty-cell">Төлем табылмады</td></tr>';
  return rows.map((p) => {
    const st = byId('students', p.studentId);
    const rest = st ? debtOf(st) : 0;
    return `<tr>
      <td class="nowrap">${fullDate(p.date)}</td>
      <td>${st ? studentLink(st.id) : '—'}${st ? `<small>${st.category} санаты · шарт ${money(priceOf(st))}</small>` : ''}</td>
      <td>${esc(p.method)}</td>
      <td class="right nowrap"><b>${money(p.amount)}</b></td>
      <td class="right">${rest ? `<span class="debt">${money(rest)}</span>` : pill('Толық төленді', 's-done')}</td>
      <td class="actions">${iconBtn('receipt', p.id, 'receipt', 'Түбіртек')}${delBtn('deletePayment', p.id)}</td>
    </tr>`;
  }).join('');
}

function paymentForm(studentId) {
  const debtors = db.students.filter((s) => debtOf(s) > 0);
  if (!debtors.length) return toast('Қарызы бар оқушы жоқ');
  const sel = debtors.find((s) => s.id === studentId) || debtors[0];
  openForm({
    title: 'Төлем қабылдау',
    values: { studentId: sel.id, date: TODAY, method: 'Kaspi', amount: debtOf(sel) },
    fields: [
      { name: 'studentId', label: 'Оқушы', type: 'select', options: debtors.map((s) => ({ value: s.id, label: `${s.name} — қалдық ${money(debtOf(s))}` })), full: true },
      { name: 'amount', label: 'Сома (₸)', type: 'number', min: 1, step: 1, required: true, hint: 'Әдепкі мәні — толық қалдық' },
      { name: 'date', label: 'Күні', type: 'date', required: true },
      { name: 'method', label: 'Төлем тәсілі', type: 'select', options: list(METHODS), full: true },
    ],
    onSubmit: (d) => {
      const st = byId('students', d.studentId);
      if (!st) return 'Оқушыны таңдаңыз';
      if (!(d.amount > 0)) return 'Соманы дұрыс енгізіңіз';
      if (!d.date) return 'Күнін көрсетіңіз';
      const debt = debtOf(st);
      if (d.amount > debt) return `Сома қалдықтан көп. Қалдық: ${money(debt)}`;
      db.payments.push({ id: uid('p'), ...d });
      logAct(`Төлем қабылданды: ${st.name} — ${money(d.amount)}`);
      const rest = debt - d.amount;
      notifyStudent(st.id, `Төлеміңіз қабылданды: ${money(d.amount)} (${d.method}). Қалдық: ${money(rest)}.`);
      toast(rest ? `Төлем қабылданды. Қалдық: ${money(rest)}` : `${st.name} оқу ақысын толық төледі`);
    },
  });
}

function receipt(id) {
  const p = byId('payments', id);
  if (!p) return;
  const st = byId('students', p.studentId);
  const sorted = [...db.payments].sort((a, b) => (a.date + a.id).localeCompare(b.date + b.id));
  const no = String(sorted.indexOf(p) + 1).padStart(5, '0');
  const s = db.settings;
  openModal('Төлем түбіртегі', `
  <div class="receipt" id="receiptBox">
    <div class="rc-head"><b>${esc(s.schoolName)} автомектебі</b><span>${esc(s.city)} · ${esc(s.phone)}</span></div>
    <h3>Төлем түбіртегі № ${no}</h3>
    <dl class="rc-list">
      <div><dt>Күні</dt><dd>${fullDate(p.date)}</dd></div>
      <div><dt>Оқушы</dt><dd>${esc(st ? st.name : '—')}</dd></div>
      <div><dt>Оқу санаты</dt><dd>${st ? st.category : '—'}</dd></div>
      <div><dt>Төлем тәсілі</dt><dd>${esc(p.method)}</dd></div>
      <div><dt>Шарт сомасы</dt><dd>${st ? money(priceOf(st)) : '—'}</dd></div>
      <div><dt>Барлығы төленді</dt><dd>${st ? money(paidBy(st.id)) : '—'}</dd></div>
      <div><dt>Қалдық</dt><dd>${st ? money(debtOf(st)) : '—'}</dd></div>
      <div class="rc-total"><dt>Осы төлем сомасы</dt><dd>${money(p.amount)}</dd></div>
    </dl>
    <p class="rc-foot"><span>Қабылдаған: ________________</span><span>Қолы: ________</span></p>
  </div>
  <div class="modal-actions">
    <button type="button" class="btn" data-close>Жабу</button>
    <button type="button" class="btn primary" data-action="printReceipt">${icon('print')} Басып шығару</button>
  </div>`);
}

// =====================================================================
// 13а. ЖЫЛДЫҚ ЖОСПАР: ПАЙДА ЖӘНЕ МАҚСАТ
// =====================================================================
function viewGoals() {
  const ys = yearStats();
  const g = ys.goals;
  const curKey = TODAY.slice(0, 7);
  const maxV = Math.max(1, ...ys.rows.map((r) => Math.max(r.inc, r.exp)));
  const needMonthly = Math.max(0, Math.ceil((g.revenue - ys.inc) / ys.monthsLeft));
  const margin = ys.inc ? Math.round((ys.profit / ys.inc) * 100) : 0;
  const yearExp = db.expenses.filter((x) => x.date.startsWith(YEAR));
  const byCat = EXPENSE_CATEGORIES.map((c) => ({ c, sum: yearExp.filter((x) => x.category === c).reduce((s, x) => s + x.amount, 0) })).filter((x) => x.sum);
  const maxCat = Math.max(1, ...byCat.map((x) => x.sum));
  const rows = [...yearExp].sort((a, b) => b.date.localeCompare(a.date));
  const inp = (name, label, value, hint) =>
    `<div class="field"><label for="goal_${name}">${label}</label><input class="input" id="goal_${name}" name="${name}" type="number" min="0" step="1" value="${esc(value)}"><small>${hint}</small></div>`;
  return `
  <section class="stats">
    ${stat('Жыл басынан түсім', money(ys.inc), `${YEAR} жыл, ${ys.dayOfYear}-күн`, 'var(--primary)')}
    ${stat('Шығындар', money(ys.exp), `${yearExp.length} жазба`, 'var(--orange)')}
    ${stat('Таза пайда', money(ys.profit), `рентабельділік ${margin}%`, ys.profit >= 0 ? 'var(--green)' : 'var(--red)')}
    ${stat('Жыл соңына болжам', money(ys.forecastProfit), 'таза пайда, қазіргі қарқынмен', 'var(--purple)')}
  </section>
  <section class="grid-2">
    <div class="card span-2">
      <div class="card-head"><h2>Мақсаттың орындалуы</h2>
        <span class="muted small">${ys.inc >= g.revenue ? 'Түсім мақсаты орындалды!' : `Мақсатқа жету үшін қалған ${ys.monthsLeft} айда айына <b>${money(needMonthly)}</b> түсім керек`}</span></div>
      <div class="goal-grid">
        ${goalBar('Түсім', ys.inc, g.revenue, money, ys.forecastInc)}
        ${goalBar('Таза пайда', ys.profit, g.profit, money, ys.forecastProfit)}
        ${goalBar('Жаңа оқушылар', ys.newStudents, g.students, (v) => `${v} оқушы`, ys.forecastStudents)}
      </div>
    </div>
    <div class="card span-2">
      <div class="card-head"><h2>${YEAR} жыл: түсім мен шығын айлар бойынша</h2>
        <div class="legend"><span><i class="lg-inc"></i>Түсім</span><span><i class="lg-exp"></i>Шығын</span></div></div>
      <div class="ychart">${ys.rows.map((r, k) => `
        <div class="ycol ${r.m > curKey ? 'future' : ''}">
          <div class="ybars">
            <i class="yb-inc" style="height:${(r.inc / maxV) * 100}%" title="Түсім: ${money(r.inc)}"></i>
            <i class="yb-exp" style="height:${(r.exp / maxV) * 100}%" title="Шығын: ${money(r.exp)}"></i>
          </div>
          <span class="vlab">${MONTHS_SHORT[k]}</span>
          <span class="yprofit ${r.inc - r.exp < 0 ? 'down' : ''}">${r.m > curKey ? '—' : shortMoney(r.inc - r.exp)}</span>
        </div>`).join('')}
      </div>
      <p class="muted small" style="margin:10px 0 0">Бағанның астындағы сан — сол айдағы таза пайда (түсім − шығын). Бағанның үстіне тышқанды апарсаңыз, нақты сома көрінеді.</p>
    </div>
    <div class="card">
      <div class="card-head"><h2>Жылдық мақсаттар</h2></div>
      <form id="goalsForm" class="settings-form one" novalidate>
        ${inp('revenue', 'Жылдық түсім мақсаты (₸)', g.revenue, 'Жыл бойы түсетін төлемдер сомасы')}
        ${inp('profit', 'Таза пайда мақсаты (₸)', g.profit, 'Түсім минус шығындар')}
        ${inp('students', 'Жаңа оқушылар саны', g.students, 'Осы жылы оқуды бастағандар')}
        <p class="form-error full" id="goalsError"></p>
        <div class="form-actions"><button type="submit" class="btn primary">Мақсатты сақтау</button></div>
      </form>
    </div>
    <div class="card">
      <div class="card-head"><h2>Шығын құрылымы</h2><span class="muted small">${money(ys.exp)}</span></div>
      ${byCat.length ? `<div class="bars">${byCat.map((x) => `
        <div class="bar-row"><span>${esc(x.c)}</span><div class="bar"><i style="width:${(x.sum / maxCat) * 100}%;background:var(--orange)"></i></div><b>${money(x.sum)}</b></div>`).join('')}</div>` : empty('Шығын енгізілмеген')}
    </div>
    <div class="card span-2 table-wrap" style="padding:0">
      <div class="card-head" style="padding:20px 20px 0"><h2>Шығындар журналы</h2>
        <button class="btn primary small" data-action="addExpense">${icon('plus')} Шығын қосу</button></div>
      <table>
        <thead><tr><th>Күні</th><th>Санат</th><th>Ескерту</th><th class="right">Сома</th><th></th></tr></thead>
        <tbody>${rows.length ? rows.slice(0, showAllExpenses ? rows.length : 10).map((x) => `<tr>
          <td class="nowrap">${fullDate(x.date)}</td>
          <td>${pill(x.category, 't-practice')}</td>
          <td>${esc(x.note) || '<span class="muted">—</span>'}</td>
          <td class="right nowrap"><b>${money(x.amount)}</b></td>
          <td class="actions">${delBtn('deleteExpense', x.id)}</td>
        </tr>`).join('') : '<tr><td colspan="5" class="empty-cell">Шығын жоқ</td></tr>'}</tbody>
      </table>
      ${rows.length > 10 ? `<div style="padding:12px 20px 18px;text-align:center"><button class="btn small" data-action="toggleExpenses">${showAllExpenses ? 'Жасыру' : `Барлығын көрсету (${rows.length})`}</button></div>` : ''}
    </div>
  </section>`;
}
let showAllExpenses = false;

function expenseForm() {
  openForm({
    title: 'Жаңа шығын',
    values: { date: TODAY, category: 'Жанармай' },
    fields: [
      { name: 'category', label: 'Санат', type: 'select', options: list(EXPENSE_CATEGORIES) },
      { name: 'amount', label: 'Сома (₸)', type: 'number', min: 1, step: 1, required: true },
      { name: 'date', label: 'Күні', type: 'date', required: true, full: true },
      { name: 'note', label: 'Ескерту', type: 'textarea', full: true },
    ],
    onSubmit: (d) => {
      if (!(d.amount > 0)) return 'Соманы дұрыс енгізіңіз';
      if (!d.date) return 'Күнін көрсетіңіз';
      if (d.date > TODAY) return 'Болашақ күнге шығын жазуға болмайды';
      db.expenses.push({ id: uid('x'), ...d });
      logAct(`Шығын енгізілді: ${d.category} — ${money(d.amount)}`);
    },
    success: 'Шығын қосылды',
  });
}

function saveGoals(form) {
  const fd = new FormData(form);
  const revenue = Number(fd.get('revenue'));
  const profit = Number(fd.get('profit'));
  const students = Number(fd.get('students'));
  if (!(revenue > 0)) return 'Түсім мақсаты 0-ден көп болуы керек';
  if (!(profit >= 0)) return 'Пайда мақсатын дұрыс енгізіңіз';
  if (profit > revenue) return 'Пайда мақсаты түсім мақсатынан көп бола алмайды';
  if (!(students > 0 && Number.isInteger(students))) return 'Оқушылар саны бүтін оң сан болуы керек';
  db.settings.goals = { revenue, profit, students };
  return '';
}

// =====================================================================
// 14. ЕМТИХАНДАР
// =====================================================================
function viewExams() {
  const done = db.exams.filter((e) => e.result !== 'Күтілуде');
  const pass = done.filter((e) => e.result === 'Өтті').length;
  return `
  <section class="stats">
    ${stat('Барлық емтихан', db.exams.length, `${db.exams.length - done.length} күтілуде`, 'var(--purple)')}
    ${stat('Өтті', pass, done.length ? `${pct(pass, done.length)}% нәтиже` : 'әзірге нәтиже жоқ', 'var(--green)')}
    ${stat('Өтпеді', done.length - pass, 'қайта тапсыру керек', 'var(--red)')}
    ${stat('Бітірушілер', db.students.filter((s) => s.status === 'Бітірді').length, 'куәлік алуға дайын', 'var(--primary)')}
  </section>
  <div class="toolbar">
    <p class="muted small grow-text">Ретпен тапсырылады: ішкі теория → ішкі практика (міндетті сабақтардан кейін) → мемлекеттік теория → мемлекеттік практика. Мемлекеттік емтиханға тек толық төлеген оқушы жіберіледі.</p>
    <select class="input" data-filter="er">
      <option value="">Барлық нәтиже</option>
      ${RESULTS.map((r) => `<option ${filters.er === r ? 'selected' : ''}>${r}</option>`).join('')}
    </select>
    <button class="btn primary" data-action="addExam">${icon('plus')} Емтихан тағайындау</button>
  </div>
  <div class="card table-wrap">
    <table>
      <thead><tr><th>Күні</th><th>Оқушы</th><th>Емтихан түрі</th><th>Нәтиже</th><th></th></tr></thead>
      <tbody id="rows">${examRows()}</tbody>
    </table>
  </div>`;
}

function examRows() {
  const rows = db.exams.filter((e) => !filters.er || e.result === filters.er).sort((a, b) => b.date.localeCompare(a.date));
  if (!rows.length) return '<tr><td colspan="5" class="empty-cell">Емтихан табылмады</td></tr>';
  return rows.map((e) => `<tr>
    <td class="nowrap">${fullDate(e.date)}</td>
    <td>${studentLink(e.studentId)}</td>
    <td>${esc(e.type)}</td>
    <td><select class="input result ${RESULT_CLASS[e.result]}" data-change="examResult" data-id="${e.id}" aria-label="Нәтиже">
      ${RESULTS.map((r) => `<option ${r === e.result ? 'selected' : ''}>${r}</option>`).join('')}
    </select></td>
    <td class="actions">${delBtn('deleteExam', e.id)}</td>
  </tr>`).join('');
}

// Емтихан нәтижесіне байланысты оқушы кезеңін автоматты өзгерту
function applyExamRules(ex) {
  const st = byId('students', ex.studentId);
  if (!st) return '';
  if (ex.type === EXAM.statePractice && ex.result === 'Өтті') {
    st.status = 'Бітірді';
    return `${st.name} оқуды бітірді — жүргізуші куәлігін алуға дайын`;
  }
  if (ex.type.startsWith('Мемлекеттік') && st.status !== 'Бітірді' && st.status !== 'Емтихан') {
    st.status = 'Емтихан';
    return `${st.name} «Емтихан» кезеңіне ауыстырылды`;
  }
  return '';
}

function examCheck(st, type) {
  if (type === EXAM.innerPractice && practiceDone(st.id) < practiceReq(st))
    return `Ішкі практикаға дейін ${practiceReq(st)} практикалық сабақ өту керек (қазір ${practiceDone(st.id)})`;
  if (type === EXAM.innerPractice && !examPassed(st.id, EXAM.innerTheory)) return 'Алдымен ішкі теориялық емтиханнан өту керек';
  if (type.startsWith('Мемлекеттік') && debtOf(st) > 0) return `Мемлекеттік емтиханға тек толық төлеген оқушы шығады (қарызы: ${money(debtOf(st))})`;
  if (type === EXAM.stateTheory && !examPassed(st.id, EXAM.innerTheory)) return 'Алдымен ішкі теориялық емтиханнан өту керек';
  if (type === EXAM.statePractice && !examPassed(st.id, EXAM.innerPractice)) return 'Алдымен ішкі практикалық емтиханнан өту керек';
  if (type === EXAM.statePractice && !examPassed(st.id, EXAM.stateTheory)) return 'Алдымен мемлекеттік теориялық емтиханнан өту керек';
  if (examPassed(st.id, type)) return 'Оқушы бұл емтиханнан бұрын өткен';
  if (db.exams.some((e) => e.studentId === st.id && e.type === type && e.result === 'Күтілуде')) return 'Бұл емтихан бұрыннан тағайындалған';
  return '';
}

function examForm() {
  const pool = db.students.filter((s) => s.status !== 'Бітірді');
  if (!pool.length) return toast('Емтиханға шығатын оқушы жоқ');
  openForm({
    title: 'Емтихан тағайындау',
    values: { date: addDays(7), type: EXAM.innerTheory, result: 'Күтілуде' },
    fields: [
      { name: 'studentId', label: 'Оқушы', type: 'select', options: pool.map((s) => ({ value: s.id, label: `${s.name} (${s.status})` })), full: true },
      { name: 'type', label: 'Емтихан түрі', type: 'select', options: list(EXAM_TYPES), full: true },
      { name: 'date', label: 'Күні', type: 'date', required: true },
      { name: 'result', label: 'Нәтиже', type: 'select', options: list(RESULTS) },
    ],
    onSubmit: (d) => {
      const st = byId('students', d.studentId);
      if (!st) return 'Оқушыны таңдаңыз';
      if (!d.date) return 'Күнін көрсетіңіз';
      const err = examCheck(st, d.type);
      if (err) return err;
      const ex = { id: uid('e'), ...d };
      db.exams.push(ex);
      logAct(`Емтихан тағайындалды: ${st.name} — ${d.type}`);
      notifyStudent(st.id, `Сізге емтихан тағайындалды: ${d.type}, ${fullDate(d.date)}.${d.result !== 'Күтілуде' ? ` Нәтиже: ${d.result}.` : ''}`);
      const msg = applyExamRules(ex);
      if (msg) logAct(msg);
      toast(msg || 'Емтихан тағайындалды');
    },
  });
}

function setExamResult(id, result) {
  const ex = byId('exams', id);
  if (!ex) return;
  ex.result = result;
  logAct(`${studentName(ex.studentId)} «${ex.type}» — ${result}`);
  const msg = applyExamRules(ex);
  if (result !== 'Күтілуде') {
    notifyStudent(ex.studentId, result === 'Өтті'
      ? `Құттықтаймыз! «${ex.type}» — өтті.${ex.type === EXAM.statePractice ? ' Сіз оқуды толық аяқтадыңыз!' : ''}`
      : `«${ex.type}» — өтпеді. Әкімші қайта тапсыру күнін тағайындайды.`);
  }
  if (msg) logAct(msg);
  save();
  render();
  toast(msg || 'Нәтиже сақталды');
}

// =====================================================================
// 15. ЕСЕПТЕР
// =====================================================================
function viewReports() {
  const months = Array.from({ length: 6 }, (_, k) => monthKey(k - 5));
  const incomes = months.map(income);
  const maxInc = Math.max(1, ...incomes);
  const sum6 = incomes.reduce((a, b) => a + b, 0);
  const byCat = CATEGORIES.map((c) => ({
    c,
    sum: db.payments.filter((p) => byId('students', p.studentId)?.category === c).reduce((s, p) => s + p.amount, 0),
    n: db.students.filter((s) => s.category === c).length,
  }));
  const maxCat = Math.max(1, ...byCat.map((x) => x.sum));
  const sources = LEAD_SOURCES.map((s) => {
    const ls = db.leads.filter((l) => l.source === s);
    return { s, n: ls.length, conv: ls.filter((l) => l.status === 'Тіркелді').length };
  }).filter((x) => x.n);
  const weekEnd = addDays(6);
  return `
  <div class="toolbar">
    <p class="muted small grow-text">Барлық есеп енгізілген деректерден автоматты түрде құрылады.</p>
    <button class="btn" data-action="printReport">${icon('print')} Есепті басып шығару</button>
  </div>
  <div id="reportArea">
  <section class="grid-2">
    <div class="card span-2">
      <div class="card-head"><h2>Соңғы 6 айдағы түсім</h2><span class="muted small">Барлығы: <b>${money(sum6)}</b></span></div>
      <div class="vchart">${months.map((m, k) => `
        <div class="vcol"><span class="vval">${shortMoney(incomes[k])}</span>
          <div class="vbar"><i style="height:${(incomes[k] / maxInc) * 100}%"></i></div>
          <span class="vlab">${MONTHS_SHORT[Number(m.slice(5)) - 1]}</span></div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h2>Санат бойынша түсім</h2></div>
      <div class="bars">${byCat.map((x) => `
        <div class="bar-row"><span>${x.c} санаты · ${x.n} оқушы</span><div class="bar"><i style="width:${(x.sum / maxCat) * 100}%;background:var(--primary)"></i></div><b>${money(x.sum)}</b></div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h2>Өтінім көздері</h2></div>
      ${sources.length ? `<table style="min-width:0"><thead><tr><th>Көзі</th><th class="right">Өтінім</th><th class="right">Тіркелді</th><th class="right">Конверсия</th></tr></thead>
        <tbody>${sources.map((x) => `<tr><td>${esc(x.s)}</td><td class="right">${x.n}</td><td class="right">${x.conv}</td><td class="right"><b>${pct(x.conv, x.n)}%</b></td></tr>`).join('')}</tbody></table>` : empty('Өтінім жоқ')}
    </div>
    <div class="card span-2 table-wrap" style="padding:0">
      <div class="card-head" style="padding:20px 20px 0"><h2>Нұсқаушылар тиімділігі</h2></div>
      <table>
        <thead><tr><th>Нұсқаушы</th><th class="right">Белсенді оқушы</th><th class="right">Өткізген практика</th><th class="right">7 күндегі сабақ</th><th class="right">Емтихан нәтижесі</th></tr></thead>
        <tbody>${db.instructors.map((i) => {
          const sids = db.students.filter((s) => s.instructorId === i.id).map((s) => s.id);
          const ex = db.exams.filter((e) => sids.includes(e.studentId) && e.result !== 'Күтілуде');
          return `<tr><td><b>${esc(i.name)}</b></td>
            <td class="right">${db.students.filter((s) => s.instructorId === i.id && s.status !== 'Бітірді').length}</td>
            <td class="right">${db.lessons.filter((l) => l.instructorId === i.id && l.type === 'Практика' && l.done).length}</td>
            <td class="right">${db.lessons.filter((l) => l.instructorId === i.id && l.date >= TODAY && l.date <= weekEnd).length}</td>
            <td class="right"><b>${ex.length ? pct(ex.filter((e) => e.result === 'Өтті').length, ex.length) + '%' : '—'}</b></td></tr>`;
        }).join('')}</tbody>
      </table>
    </div>
  </section>
  </div>`;
}

// =====================================================================
// 16. БАПТАУЛАР
// =====================================================================
function viewSettings() {
  const s = db.settings;
  const theme = document.documentElement.dataset.theme || 'light';
  const inp = (name, label, value, type = 'text') =>
    `<div class="field"><label for="set_${name}">${label}</label><input class="input" id="set_${name}" name="${name}" type="${type}" value="${esc(value)}" ${type === 'number' ? 'min="0" step="1"' : ''}></div>`;
  return `
  <section class="grid-2">
    <div class="card">
      <div class="card-head"><h2>Мектеп туралы және бағалар</h2></div>
      <form id="settingsForm" class="settings-form" novalidate>
        ${inp('schoolName', 'Мектеп атауы', s.schoolName)}
        ${inp('city', 'Қала', s.city)}
        ${inp('phone', 'Телефон', s.phone, 'tel')}
        <h3 class="sub">Оқу бағасы (₸)</h3>
        ${CATEGORIES.map((c) => inp('price_' + c, `${c} санаты`, s.prices[c], 'number')).join('')}
        <h3 class="sub">Міндетті практикалық сабақ саны</h3>
        ${CATEGORIES.map((c) => inp('req_' + c, `${c} санаты`, s.practiceRequired[c], 'number')).join('')}
        <p class="form-error full" id="settingsError"></p>
        <div class="form-actions"><button type="submit" class="btn primary">Сақтау</button></div>
      </form>
    </div>
    <div class="card">
      <div class="card-head"><h2>Сыртқы түрі</h2></div>
      <div class="theme-pick">
        <button class="btn ${theme === 'light' ? 'primary' : ''}" data-action="setTheme" data-id="light">${icon('sun')} Жарық</button>
        <button class="btn ${theme === 'dark' ? 'primary' : ''}" data-action="setTheme" data-id="dark">${icon('moon')} Қараңғы</button>
      </div>
      <div class="card-head" style="margin-top:26px"><h2>Деректер</h2></div>
      <div class="counts">
        <div><b>${db.students.length}</b><span>оқушы</span></div>
        <div><b>${db.lessons.length}</b><span>сабақ</span></div>
        <div><b>${db.payments.length}</b><span>төлем</span></div>
      </div>
      <div class="data-actions">
        <button class="btn" data-action="exportJSON">${icon('download')} Резервтік көшірме жүктеп алу (JSON)</button>
        <button class="btn" data-action="importJSON">${icon('upload')} Көшірмеден қалпына келтіру</button>
        <button class="btn" data-action="resetDemo">Демо деректерді қайтару</button>
        <button class="btn danger-outline" data-action="clearAll">${icon('trash')} Барлық деректерді өшіру</button>
      </div>
    </div>
    <div class="card span-2 table-wrap" style="padding:0">
      <div class="card-head" style="padding:20px 20px 0"><h2>Пайдаланушы аккаунттары</h2><span class="muted small">Оқушылар сайттағы «Тіркелу» арқылы өзі аккаунт ашады</span></div>
      <table>
        <thead><tr><th>Email</th><th>Рөлі</th><th>Аты</th><th>Байланысы</th><th></th></tr></thead>
        <tbody>${db.accounts.map((a) => {
          const st = a.studentId && byId('students', a.studentId);
          const ld = !st && a.leadId && byId('leads', a.leadId);
          const link = a.role === 'admin' ? 'Барлық бөлімдер' : st ? `Оқушы: ${esc(st.name)}` : ld ? `Өтінім: ${esc(ld.status)}` : '—';
          return `<tr><td><b>${esc(a.email)}</b></td><td>${pill(a.role === 'admin' ? 'Әкімші' : 'Оқушы', a.role === 'admin' ? 's-exam' : 's-theory')}</td>
            <td>${esc(a.name)}</td><td>${link}</td>
            <td class="actions">${a.role === 'student' ? delBtn('deleteAccount', a.id) : ''}</td></tr>`;
        }).join('')}</tbody>
      </table>
    </div>
  </section>`;
}

function saveSettings(form) {
  const fd = new FormData(form);
  const get = (k) => String(fd.get(k) ?? '').trim();
  const s = { schoolName: get('schoolName'), city: get('city'), phone: get('phone'), prices: {}, practiceRequired: {}, goals: db.settings.goals };
  if (!s.schoolName) return 'Мектеп атауын енгізіңіз';
  for (const c of CATEGORIES) {
    const p = Number(get('price_' + c));
    const r = Number(get('req_' + c));
    if (!(p > 0)) return `${c} санатының бағасы 0-ден көп болуы керек`;
    if (!(r >= 0 && Number.isInteger(r))) return `${c} санатының сабақ саны бүтін сан болуы керек`;
    s.prices[c] = p;
    s.practiceRequired[c] = r;
  }
  db.settings = s;
  return '';
}

// =====================================================================
// 17. ЭКСПОРТ / ИМПОРТ / БАСЫП ШЫҒАРУ
// =====================================================================
function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
const toCSV = (rows) => '﻿' + rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\r\n');

function printEl(el) {
  if (!el) return;
  el.classList.add('print-target');
  document.body.classList.add('printing');
  window.print();
  document.body.classList.remove('printing');
  el.classList.remove('print-target');
}

// =====================================================================
// 18. МОДАЛЬ ТЕРЕЗЕ ЖӘНЕ ФОРМАЛАР ГЕНЕРАТОРЫ
// =====================================================================
const modal = $('#modal');
const modalBox = $('#modalBox');
const modalForm = $('#modalForm');
const modalTitle = $('#modalTitle');
let formCfg = null;

function fieldHTML(f, v) {
  const id = 'f_' + f.name;
  const req = f.required ? 'required' : '';
  const hint = f.hint ? `<small>${f.hint}</small>` : '';
  if (f.type === 'checks') {
    const vals = v || [];
    return `<div class="field ${f.full ? 'full' : ''}"><span class="label">${f.label}</span><div class="checks">
      ${f.options.length ? f.options.map((o) => `<label class="check"><input type="checkbox" name="${f.name}" value="${esc(o.value)}" ${vals.includes(o.value) ? 'checked' : ''}> ${esc(o.label)}</label>`).join('') : '<span class="muted small">Тізім бос</span>'}
    </div>${hint}</div>`;
  }
  let control;
  if (f.type === 'select') {
    control = `<select class="input" id="${id}" name="${f.name}" ${req}>
      ${f.allowEmpty ? `<option value="">${f.emptyLabel || '— таңдаңыз —'}</option>` : ''}
      ${f.options.map((o) => `<option value="${esc(o.value)}" ${String(o.value) === String(v ?? '') ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}
    </select>`;
  } else if (f.type === 'textarea') {
    control = `<textarea class="input textarea" id="${id}" name="${f.name}" placeholder="${esc(f.placeholder || '')}">${esc(v ?? '')}</textarea>`;
  } else {
    control = `<input class="input" id="${id}" name="${f.name}" type="${f.type || 'text'}" value="${esc(v ?? '')}" ${req}
      ${f.min != null ? `min="${f.min}"` : ''} ${f.step ? `step="${f.step}"` : ''} placeholder="${esc(f.placeholder || '')}">`;
  }
  return `<div class="field ${f.full ? 'full' : ''}"><label for="${id}">${f.label}</label>${control}${hint}</div>`;
}

function openForm(cfg) {
  formCfg = cfg;
  modalTitle.textContent = cfg.title;
  modalBox.classList.toggle('wide', !!cfg.wide);
  const vals = cfg.values || {};
  modalForm.innerHTML =
    (cfg.message ? `<p class="modal-msg">${esc(cfg.message)}</p>` : '') +
    (cfg.fields || []).map((f) => fieldHTML(f, vals[f.name])).join('') +
    `<p class="form-error" id="formError" role="alert"></p>
     <div class="modal-actions">
       <button type="button" class="btn ghost" data-close>Болдырмау</button>
       <button type="submit" class="btn ${cfg.danger ? 'danger' : 'primary'}">${esc(cfg.submitText || 'Сақтау')}</button>
     </div>`;
  showModal();
}

function openModal(title, html, wide = false) {
  formCfg = null;
  modalTitle.textContent = title;
  modalBox.classList.toggle('wide', wide);
  modalForm.innerHTML = html;
  showModal();
}

function showModal() {
  modal.hidden = false;
  const first = modalForm.querySelector('input:not([type=checkbox]), select, textarea, button[type=submit]');
  if (first) first.focus();
}

function openConfirm(message, onYes, success, submitText = 'Иә, жою') {
  openForm({ title: 'Растау', message, fields: [], submitText, danger: true, onSubmit: () => { onYes(); }, success });
}

function closeModal() {
  modal.hidden = true;
  formCfg = null;
}

modalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!formCfg || !formCfg.onSubmit) return;
  const fd = new FormData(modalForm);
  const data = {};
  (formCfg.fields || []).forEach((f) => {
    if (f.type === 'checks') data[f.name] = fd.getAll(f.name);
    else if (f.type === 'number') data[f.name] = Number(fd.get(f.name));
    else data[f.name] = String(fd.get(f.name) ?? '').trim();
  });
  const cfg = formCfg;
  const err = cfg.onSubmit(data);
  if (err) { $('#formError').textContent = err; return; }
  closeModal();
  save();
  render();
  if (cfg.success) notify(cfg.success);
});

modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target.closest('[data-close]')) { closeModal(); return; }
  const b = e.target.closest('[data-action]');
  if (b && actions[b.dataset.action]) actions[b.dataset.action](b.dataset.id);
});

// =====================================================================
// 19. ӘРЕКЕТТЕР (батырмалар)
// =====================================================================
const actions = {
  go: (id) => setView(id),

  addLead: () => leadForm(),
  editLead: (id) => leadForm(byId('leads', id)),
  openLead: (id) => { filters.lq = byId('leads', id)?.name || ''; filters.ls = ''; setView('leads'); },
  convertLead: (id) => {
    const l = byId('leads', id);
    if (!l) return;
    if (db.students.some((s) => digits(s.phone) === digits(l.phone))) {
      l.status = 'Тіркелді'; save(); render();
      return toast('Бұл нөмірмен оқушы бұрын тіркелген — өтінім жабылды');
    }
    studentForm({ name: l.name, phone: l.phone, category: l.category, note: l.note }, { fromLead: id });
  },
  deleteLead: (id) => {
    const l = byId('leads', id);
    openConfirm(`«${l.name}» өтінімін жою керек пе?`, () => { db.leads = db.leads.filter((x) => x.id !== id); }, 'Өтінім жойылды');
  },

  addStudent: () => studentForm(),
  editStudent: (id) => studentForm(byId('students', id)),
  studentCard: (id) => studentCard(id),
  deleteStudent: (id) => {
    const s = byId('students', id);
    openConfirm(`«${s.name}» оқушысын жою керек пе? Оның сабақтары, төлемдері мен емтихандары да өшіріледі.`, () => {
      ['lessons', 'payments', 'exams'].forEach((k) => { db[k] = db[k].filter((x) => x.studentId !== id); });
      db.students = db.students.filter((x) => x.id !== id);
      db.accounts.forEach((a) => { if (a.studentId === id) a.studentId = null; });
    }, `Оқушы жойылды: ${s.name}`);
  },
  exportStudents: () => {
    const rows = [['Аты-жөні', 'Телефон', 'Санат', 'Нұсқаушы', 'Кезең', 'Оқу басталды', 'Жеңілдік %', 'Бағасы', 'Төленді', 'Қалдық', 'Практика']];
    filteredStudents().forEach((s) => rows.push([s.name, s.phone, s.category, instructorName(s.instructorId), s.status, s.startDate,
      s.discount || 0, priceOf(s), paidBy(s.id), debtOf(s), `${practiceDone(s.id)}/${practiceReq(s)}`]));
    downloadFile(`oqushylar-${TODAY}.csv`, toCSV(rows), 'text/csv;charset=utf-8');
    notify('Оқушылар тізімі Excel (CSV) файлына сақталды');
  },

  addInstructor: () => instructorForm(),
  editInstructor: (id) => instructorForm(byId('instructors', id)),
  deleteInstructor: (id) => {
    const i = byId('instructors', id);
    if (db.students.some((s) => s.instructorId === id && s.status !== 'Бітірді'))
      return toast('Алдымен оның оқушыларын басқа нұсқаушыға ауыстырыңыз');
    openConfirm(`«${i.name}» нұсқаушысын жою керек пе? Оның алдағы сабақтары кестеден өшіріледі.`, () => {
      db.lessons = db.lessons.filter((l) => !(l.instructorId === id && !l.done));
      db.instructors = db.instructors.filter((x) => x.id !== id);
    }, `Нұсқаушы жойылды: ${i.name}`);
  },

  addCar: () => carForm(),
  editCar: (id) => carForm(byId('cars', id)),
  deleteCar: (id) => {
    const c = byId('cars', id);
    openConfirm(`«${c.model} (${c.plate})» көлігін автопарктен жою керек пе?`, () => {
      db.instructors.forEach((i) => { i.carIds = (i.carIds || []).filter((x) => x !== id); });
      db.cars = db.cars.filter((x) => x.id !== id);
    }, `Көлік жойылды: ${c.model}`);
  },

  addLesson: () => lessonForm(),
  deleteLesson: (id) => {
    const l = byId('lessons', id);
    if (l && !l.done && l.date >= TODAY) notifyStudent(l.studentId, `${prettyDate(l.date)}, ${l.time} сабағы кестеден алынды. Басқа уақытқа жазыла аласыз.`);
    db.lessons = db.lessons.filter((x) => x.id !== id);
    save(); render(); toast('Сабақ кестеден алынды');
  },
  prevWeek: () => { weekOffset -= 1; render(); },
  thisWeek: () => { weekOffset = 0; render(); },
  nextWeek: () => { weekOffset += 1; render(); },

  addPayment: () => paymentForm(),
  payFor: (id) => paymentForm(id),
  receipt: (id) => receipt(id),
  printReceipt: () => printEl($('#receiptBox')),
  deletePayment: (id) => {
    const p = byId('payments', id);
    openConfirm(`${studentName(p.studentId)} оқушысының ${money(p.amount)} төлемін жою керек пе?`, () => {
      db.payments = db.payments.filter((x) => x.id !== id);
    }, 'Төлем жойылды');
  },
  exportPayments: () => {
    const rows = [['Күні', 'Оқушы', 'Санат', 'Төлем тәсілі', 'Сома']];
    filteredPayments().forEach((p) => rows.push([p.date, studentName(p.studentId), byId('students', p.studentId)?.category || '', p.method, p.amount]));
    downloadFile(`tolemder-${TODAY}.csv`, toCSV(rows), 'text/csv;charset=utf-8');
    notify('Төлемдер тізімі Excel (CSV) файлына сақталды');
  },

  addExam: () => examForm(),
  deleteExam: (id) => {
    db.exams = db.exams.filter((x) => x.id !== id);
    save(); render(); toast('Емтихан жойылды');
  },

  printReport: () => printEl($('#reportArea')),

  deleteAccount: (id) => {
    const a = byId('accounts', id);
    openConfirm(`«${a.email}» аккаунтын жою керек пе? Оқушы мен оның деректері сақталады.`, () => {
      db.accounts = db.accounts.filter((x) => x.id !== id);
    }, 'Аккаунт жойылды');
  },
  logout: () => logout(),
  openThread: (id) => { inboxAcc = id; render(); },
  // Оқушы картасынан чатты бірден ашу
  messageStudent: (studentId) => {
    const acc = accountsOf(studentId)[0];
    if (!acc) return toast('Бұл оқушының сайтта аккаунты жоқ');
    closeModal(); openChat(acc.id);
  },
  confirmPay: (id) => {
    const m = byId('messages', id);
    const acc = m && byId('accounts', m.accountId);
    const st = acc && acc.studentId ? byId('students', acc.studentId) : null;
    if (!st) return toast('Аккаунт оқушыға байланыспаған');
    const debt = debtOf(st);
    if (m.amount > debt) return toast(`Сома қалдықтан көп (қалдық: ${money(debt)}). Төлемді қабылдамаңыз немесе оқушыға жазыңыз`);
    db.payments.push({ id: uid('p'), studentId: st.id, amount: m.amount, date: TODAY, method: m.method });
    m.status = 'confirmed';
    m.read = true;
    notifyStudent(st.id, `Төлеміңіз расталды: ${money(m.amount)}. Қалдық: ${money(debtOf(st))}.`);
    logAct(`Төлем расталды (кабинеттен): ${st.name} — ${money(m.amount)}`);
    save(); render(); toast('Төлем расталды және оқушы кабинетіне хабарланды');
  },
  rejectPay: (id) => {
    const m = byId('messages', id);
    if (!m) return;
    m.status = 'rejected';
    m.read = true;
    db.messages.push({ id: uid('m'), accountId: m.accountId, from: 'admin', kind: 'system', text: `${money(m.amount)} төлемі расталмады — түсім табылмады. Әкімшіге хабарласыңыз.`, ts: Date.now(), read: false });
    logAct(`Төлем қабылданбады: ${money(m.amount)}`);
    save(); render(); toast('Төлем қабылданбады, оқушыға хабарланды');
  },

  addTheory: () => theoryForm(),
  editTheory: (id) => theoryForm(byId('theory', id)),
  deleteTheory: (id) => {
    const t = byId('theory', id);
    openConfirm(`«${t.title}» сабағын жою керек пе?`, () => {
      db.theory = db.theory.filter((x) => x.id !== id);
      db.accounts.forEach((a) => { a.watched = (a.watched || []).filter((w) => w !== id); });
    }, 'Сабақ жойылды');
  },
  // Оқушы: бейнесабақты «қаралды» деп белгілеу
  markWatched: (id) => {
    db = load();
    const acc = currentAccount();
    if (!acc) return;
    const has = acc.watched.includes(id);
    acc.watched = has ? acc.watched.filter((x) => x !== id) : [...acc.watched, id];
    if (!has) logAct(`Оқушы теория сабағын қарады: ${acc.name} — ${byId('theory', id)?.title || ''}`);
    save(); closeModal(); render();
    toast(has ? 'Белгі алынды' : `Керемет! ${watchedCount(acc)} / ${db.theory.length} сабақ қаралды`);
  },

  addExpense: () => expenseForm(),
  toggleExpenses: () => { showAllExpenses = !showAllExpenses; render(); },
  deleteExpense: (id) => {
    const x = byId('expenses', id);
    openConfirm(`«${x.category}» — ${money(x.amount)} шығынын жою керек пе?`, () => {
      db.expenses = db.expenses.filter((e) => e.id !== id);
    }, 'Шығын жойылды');
  },

  setTheme: (t) => { applyTheme(t); render(); },
  exportJSON: () => {
    downloadFile(`automektep-backup-${TODAY}.json`, JSON.stringify(db, null, 2), 'application/json');
    notify('Резервтік көшірме жүктеп алынды');
  },
  importJSON: () => $('#importFile').click(),
  resetDemo: () => openConfirm('Барлық өзгерістер өшіп, демо деректер қайта жүктеледі. Жалғастыру керек пе?', () => { db = seed(); }, 'Демо деректер қайтарылды', 'Иә, қайтару'),
  clearAll: () => openConfirm('Барлық оқушы, сабақ, төлем, көлік және өтінім өшіріледі (баптаулар сақталады). Бұл әрекетті қайтару мүмкін емес.', () => {
    const settings = db.settings;
    const admins = db.accounts.filter((a) => a.role === 'admin');
    const theory = db.theory;
    db = emptyDB();
    db.settings = settings;
    db.accounts = admins;
    db.theory = theory;
  }, 'Барлық деректер өшірілді', 'Иә, өшіру'),
};

// =====================================================================
// 20. КӨРСЕТУ (render), НАВИГАЦИЯ, ТАҚЫРЫП, ІЗДЕУ
// =====================================================================
const VIEWS = {
  dashboard: viewDashboard, leads: viewLeads, inbox: viewInbox, students: viewStudents, instructors: viewInstructors,
  cars: viewCars, schedule: viewSchedule, theory: viewTheory, payments: viewPayments, goals: viewGoals, exams: viewExams,
  reports: viewReports, settings: viewSettings,
};
const ROWS = { students: studentRows, payments: paymentRows, leads: leadRows, exams: examRows };
const content = $('#content');
const sidebar = $('#sidebar');
const scrim = $('#scrim');

function renderNav() {
  const badges = { leads: db.leads.filter((l) => l.status === 'Жаңа').length, inbox: unreadForAdmin(), cars: carIssues().length };
  let html = '';
  let group = '';
  NAV.forEach((n) => {
    if (n.group !== group) { group = n.group; html += `<p class="nav-group">${group}</p>`; }
    html += `<button class="nav-item ${view === n.view ? 'active' : ''}" data-view="${n.view}">${icon(n.icon)}<span>${n.label}</span>${badges[n.view] ? `<em class="badge">${badges[n.view]}</em>` : ''}</button>`;
  });
  $('#nav').innerHTML = html;
}

function renderAdmin() {
  renderNav();
  $('#brandName').textContent = db.settings.schoolName;
  $('#viewTitle').textContent = VIEW_TITLES[view];
  document.title = `${VIEW_TITLES[view]} — ${db.settings.schoolName}`;
  const acc = currentAccount();
  $('#userChip').textContent = acc ? acc.email : '';
  content.innerHTML = VIEWS[view]();
  const box = $('#bubbles');
  if (box) box.scrollTop = box.scrollHeight;
}

// Рөлге қарай бетті таңдау: қонақ → кіру беті, әкімші → басқару жүйесі, оқушы → жеке кабинет
function render() {
  const acc = currentAccount();
  const role = acc ? acc.role : 'guest';
  document.body.dataset.role = role;
  $('#adminApp').hidden = role !== 'admin';
  $('#authView').hidden = role !== 'guest';
  $('#portalView').hidden = role !== 'student';
  // Жасырын беттерді тазалаймыз: бірдей id-лер бір-біріне кедергі келтірмеуі үшін
  if (role !== 'guest') $('#authView').innerHTML = '';
  if (role !== 'student') $('#portalView').innerHTML = '';
  if (role === 'admin') renderAdmin();
  else if (role === 'student') renderPortal(acc);
  else renderAuth();
  renderChat();
}

function setView(v) {
  view = v;
  render();
  closeSidebar();
  window.scrollTo(0, 0);
}

function closeSidebar() {
  sidebar.classList.remove('open');
  scrim.classList.remove('show');
}

let toastTimer;
function toast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* елемейміз */ }
  $('#themeBtn').innerHTML = icon(t === 'dark' ? 'sun' : 'moon');
}

// --- Жаһандық іздеу ---
const gs = $('#globalSearch');
const gr = $('#searchResults');
gs.addEventListener('input', () => {
  const q = gs.value.trim().toLowerCase();
  if (q.length < 2) { gr.hidden = true; return; }
  const qd = digits(q);
  const match = (name, phone) => name.toLowerCase().includes(q) || (qd.length >= 3 && digits(phone).includes(qd));
  const items = [
    ...db.students.filter((s) => match(s.name, s.phone)).map((s) => ({ type: 'Оқушы', label: s.name, sub: `${s.category} санаты · ${s.status}`, action: 'studentCard', id: s.id })),
    ...db.leads.filter((l) => match(l.name, l.phone)).map((l) => ({ type: 'Өтінім', label: l.name, sub: `${l.status} · ${l.source}`, action: 'openLead', id: l.id })),
    ...db.instructors.filter((i) => match(i.name, i.phone)).map((i) => ({ type: 'Нұсқаушы', label: i.name, sub: i.categories.join(', '), action: 'go', id: 'instructors' })),
    ...db.cars.filter((c) => `${c.model} ${c.plate}`.toLowerCase().includes(q)).map((c) => ({ type: 'Көлік', label: c.model, sub: c.plate, action: 'go', id: 'cars' })),
  ].slice(0, 8);
  gr.innerHTML = items.length
    ? items.map((it) => `<button type="button" class="sr-item" data-action="${it.action}" data-id="${it.id}"><span class="sr-type">${it.type}</span><b>${esc(it.label)}</b><small>${esc(it.sub)}</small></button>`).join('')
    : '<p class="sr-empty">Ештеңе табылмады</p>';
  gr.hidden = false;
});
gr.addEventListener('click', (e) => {
  const b = e.target.closest('[data-action]');
  if (!b) return;
  gr.hidden = true;
  gs.value = '';
  actions[b.dataset.action](b.dataset.id);
});
document.addEventListener('click', (e) => { if (!e.target.closest('.search-box')) gr.hidden = true; });

// --- Оқиғалар ---
content.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (btn && actions[btn.dataset.action]) actions[btn.dataset.action](btn.dataset.id);
});

content.addEventListener('input', (e) => {
  const el = e.target.closest('[data-filter]');
  if (!el) return;
  filters[el.dataset.filter] = el.value;
  const rowsFn = ROWS[view];
  const tbody = $('#rows');
  if (rowsFn && tbody) tbody.innerHTML = rowsFn();
  else render();
});

content.addEventListener('change', (e) => {
  const el = e.target.closest('[data-change]');
  if (!el) return;
  const id = el.dataset.id;
  switch (el.dataset.change) {
    case 'lessonDone': {
      const l = byId('lessons', id);
      l.done = el.checked;
      const st = byId('students', l.studentId);
      let msg = el.checked ? 'Сабақ өтті деп белгіленді' : 'Белгі алынды';
      if (el.checked && st && l.type === 'Практика' && practiceDone(st.id) === practiceReq(st)) {
        msg = `${st.name} міндетті ${practiceReq(st)} практикалық сабақты аяқтады — ішкі емтиханға жазуға болады`;
        logAct(msg);
      }
      save(); render(); toast(msg);
      break;
    }
    case 'examResult': setExamResult(id, el.value); break;
    case 'leadStatus': {
      const l = byId('leads', id);
      l.status = el.value;
      logAct(`Өтінім күйі: ${l.name} — ${el.value}`);
      db.accounts.filter((a) => a.leadId === l.id && !a.studentId).forEach((a) => db.messages.push({
        id: uid('m'), accountId: a.id, from: 'admin', kind: 'system', text: `Өтініміңіздің күйі өзгерді: «${el.value}».`, ts: Date.now(), read: false,
      }));
      save(); render(); toast('Өтінім күйі жаңартылды');
      break;
    }
    case 'carStatus': {
      const c = byId('cars', id);
      c.status = el.value;
      logAct(`${c.model} (${c.plate}) — ${el.value}`);
      save(); render(); toast(`Көлік күйі: ${el.value}`);
      break;
    }
    default: break;
  }
});

content.addEventListener('submit', (e) => {
  if (e.target.id === 'settingsForm') {
    e.preventDefault();
    const err = saveSettings(e.target);
    if (err) { $('#settingsError').textContent = err; return; }
    save(); render(); notify('Баптаулар сақталды');
  }
  if (e.target.id === 'replyForm') { e.preventDefault(); sendReply(e.target); }
  if (e.target.id === 'goalsForm') {
    e.preventDefault();
    const err = saveGoals(e.target);
    if (err) { $('#goalsError').textContent = err; return; }
    logAct('Жылдық мақсат жаңартылды');
    save(); render(); toast('Жылдық мақсат сақталды');
  }
});

// Оқушылар сайтынан (басқа бетте) жаңа өтінім түссе — бірден көрсету
window.addEventListener('storage', (e) => {
  if (e.key !== STORAGE_KEY || !e.newValue) return;
  const before = db.leads.length;
  const beforeMsg = db.messages.length;
  db = load();
  const acc = currentAccount();
  if (!acc) return;
  if (!modal.hidden) { if (acc.role === 'admin') renderNav(); return; }
  render();
  const fresh = db.messages.slice(beforeMsg);
  if (acc.role === 'admin') {
    if (db.leads.length > before) toast(`Сайттан жаңа өтінім түсті: ${db.leads[db.leads.length - 1].name}`);
    else if (fresh.some((m) => m.from === 'student')) toast(`Оқушы кабинетінен жаңа хабарлама: ${byId('accounts', fresh.at(-1).accountId)?.name || ''}`);
  } else if (fresh.some((m) => m.accountId === acc.id && m.from === 'admin')) {
    toast(`Әкімшіден жаңа хабарлама: ${fresh.filter((m) => m.accountId === acc.id).at(-1).text.slice(0, 60)}`);
  }
});

$('#nav').addEventListener('click', (e) => {
  const b = e.target.closest('[data-view]');
  if (b) setView(b.dataset.view);
});

$('#menuBtn').addEventListener('click', () => {
  sidebar.classList.toggle('open');
  scrim.classList.toggle('show');
});
scrim.addEventListener('click', closeSidebar);

$('#themeBtn').addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  if (view === 'settings') render();
});

$('#importFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || !Array.isArray(data.students)) throw new Error('bad');
      db = normalize(data);
      logAct('Деректер резервтік көшірмеден қалпына келтірілді');
      save(); render(); toast('Деректер сәтті жүктелді');
    } catch (err) {
      toast('Файл дұрыс емес: AutoMektep JSON көшірмесін таңдаңыз');
    }
    e.target.value = '';
  };
  reader.readAsText(file);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { if (!modal.hidden) closeModal(); gr.hidden = true; }
  const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
  if (e.key === '/' && !typing && modal.hidden && document.body.dataset.role === 'admin') { e.preventDefault(); gs.focus(); }
});

// =====================================================================
// 22. АВТОРИЗАЦИЯ, АШЫҚ САЙТ ЖӘНЕ ОҚУШЫ КАБИНЕТІ
// =====================================================================
const authView = $('#authView');
const portalView = $('#portalView');
const CAT_INFO = {
  A1: { name: 'Жеңіл мотоцикл', text: 'Көлемі 125 см³ дейінгі мотоцикл' },
  A: { name: 'Мотоцикл', text: 'Мотоцикл және мотороллер жүргізу' },
  B1: { name: 'Үш дөңгелекті / квадроцикл', text: 'Үш дөңгелекті көліктер мен квадроцикл' },
  B: { name: 'Жеңіл көлік', text: 'Жеңіл автокөлік — ең танымал санат' },
  BE: { name: 'Жеңіл көлік + тіркеме', text: 'B санатты көлік пен тіркеме' },
  C1: { name: 'Орташа жүк көлігі', text: 'Салмағы 3,5–7,5 тонна жүк көліктері' },
  C: { name: 'Жүк көлігі', text: 'Салмағы 3,5 тоннадан асатын жүк көліктері' },
  C1E: { name: 'C1 + тіркеме', text: 'Орташа жүк көлігі мен тіркеме' },
  CE: { name: 'Жүк көлігі + тіркеме', text: 'Тіркемелі ауыр жүк көліктері (фура)' },
  D1: { name: 'Шағын автобус', text: '16 орынға дейінгі микроавтобус' },
  D: { name: 'Автобус', text: 'Жолаушы тасымалдайтын автобустар' },
  D1E: { name: 'D1 + тіркеме', text: 'Шағын автобус пен тіркеме' },
  DE: { name: 'Автобус + тіркеме', text: 'Автобус пен тіркеме' },
  Tm: { name: 'Трактор / өздігінен жүретін машина', text: 'Тракторлар мен ауыл шаруашылығы техникасы' },
  Tb: { name: 'Трамвай / троллейбус', text: 'Трамвай мен троллейбус жүргізу' },
};
const PREF_TIMES = ['Таңертең (09:00–12:00)', 'Түсте (12:00–15:00)', 'Кешке (15:00–19:00)', 'Демалыс күндері'];
const HEARD = ['Instagram', '2GIS', 'Таныс арқылы', 'Басқа'];
const WORK_HOURS = 'Дүйсенбі–сенбі, 09:00–19:00';
let authTab = 'login';
let regCat = 'B';
let portalPage = 'cabinet';
// Оқушы мәзірі (жеке беттер) және қонақ мәзірі (бір беттегі бөлімдер)
const PAGES = [['cabinet', 'Кабинет'], ['theory', 'Теория'], ['quiz', 'Тест']];
const GUEST_LINKS = [['about', 'Автошкола туралы'], ['prices', 'Бағалар'], ['steps', 'Оқу жолы'], ['team', 'Нұсқаушылар'], ['faq', 'Сұрақтар'], ['contacts', 'Байланыс']];
let quizState = null;

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const firstName = (name) => String(name || '').split(/\s+/)[0];

// Сессия әр қойындыда бөлек (sessionStorage): бір қойындыда әкімші, екіншісінде оқушы бола алады.
// Деректер (db) ортақ — localStorage-та.
let memorySession = null;
function currentAccount() {
  let id = memorySession;
  try { id = sessionStorage.getItem(SESSION_KEY) || memorySession; } catch (e) { /* жад қолжетімсіз */ }
  return id ? db.accounts.find((a) => a.id === id) || null : null;
}
function setSession(id) {
  memorySession = id;
  try { if (id) sessionStorage.setItem(SESSION_KEY, id); else sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* елемейміз */ }
}
function logout() {
  setSession(null);
  closeModal();
  authTab = 'login';
  portalPage = 'cabinet';
  quizState = null;
  chatOpen = false;
  chatThread = null;
  render();
  window.scrollTo(0, 0);
  toast('Жүйеден шықтыңыз');
}

// ---------- Ортақ бөліктер ----------
function pubHeader(acc) {
  const theme = document.documentElement.dataset.theme || 'light';
  // Қонақ үшін мәзір бетті айналдырады, оқушы үшін әр бөлім жеке бет болып ашылады
  const links = acc ? PAGES : GUEST_LINKS;
  const act = acc ? 'page' : 'scroll';
  return `<header class="pub-header">
    <button class="pub-brand" data-pa="${act}" data-id="${acc ? 'cabinet' : 'top'}">
      <span class="brand-logo">${icon('wheel')}</span><span><b>${esc(db.settings.schoolName)}</b><small>автомектебі</small></span>
    </button>
    <nav class="pub-nav">${links.map(([id, t]) => {
      const n = acc && id === 'theory' ? db.theory.length - watchedCount(acc) : 0;
      return `<button class="${acc && portalPage === id ? 'on' : ''}" data-pa="${act}" data-id="${id}">${t}${n > 0 ? ` <em class="badge soft">${n}</em>` : ''}</button>`;
    }).join('')}</nav>
    <div class="pub-actions">
      ${acc
        ? `<span class="pub-user">${icon('users')} ${esc(firstName(acc.name))}</span><button class="icon-btn ${portalPage === 'profile' ? 'on' : ''}" data-pa="page" data-id="profile" title="Баптаулар және көбірек ақпарат" aria-label="Баптаулар">${icon('gear')}</button><button class="btn small" data-pa="logout">${icon('logout')} Шығу</button>`
        : `<button class="btn small" data-pa="tab" data-id="login">Кіру</button><button class="btn small primary" data-pa="tab" data-id="register">Тіркелу</button>`}
      <button class="icon-btn" data-pa="theme" title="Тақырыпты ауыстыру" aria-label="Тақырыпты ауыстыру">${icon(theme === 'dark' ? 'sun' : 'moon')}</button>
    </div>
  </header>`;
}

function pubStats() {
  const grads = db.students.filter((s) => s.status === 'Бітірді').length;
  const done = db.exams.filter((e) => e.type.startsWith('Мемлекеттік') && e.result !== 'Күтілуде');
  const rate = pct(done.filter((e) => e.result === 'Өтті').length, done.length);
  const cars = db.cars.filter((c) => c.status === 'Жұмыста').length;
  return [[grads, 'түлек'], [rate + '%', 'мемлекеттік емтиханнан өтті'], [db.instructors.length, 'нұсқаушы'], [cars, 'оқу көлігі']]
    .map(([v, t]) => `<div><b>${v}</b><span>${t}</span></div>`).join('');
}

function infoSections(acc, only) {
  const s = db.settings;
  const req = (c) => Number(s.practiceRequired[c]) || 0;
  const myCat = acc && acc.studentId && byId('students', acc.studentId) ? byId('students', acc.studentId).category : 'B';
  const parts = {
    about: `
  <section class="pub-section" id="about">
    <div class="pub-head"><p class="pub-eyebrow">Автошкола туралы</p><h2>${esc(s.schoolName)} автомектебі</h2>
      <p>${esc(s.schoolName)} — ${esc(s.city)} қаласындағы автомектеп. A, B және C санаттары бойынша теориялық және практикалық оқыту: тәжірибелі нұсқаушылар, техбайқаудан өткен оқу көліктері, бейнесабақтар, онлайн тесттер (4 нұсқа) және жеке кабинет.</p></div>
    <div class="card about-box">
      <div>
        <p class="muted small" style="margin:0 0 4px">Байланыс телефоны</p>
        <a class="about-phone" href="tel:+${digits(s.phone)}">${esc(s.phone)}</a>
        <div class="about-meta"><span>${icon('clock')}${WORK_HOURS}</span><span>${icon('pin')}${esc(s.city)}</span></div>
      </div>
      <div class="cab-actions">
        <a class="btn primary" href="tel:+${digits(s.phone)}">${icon('phone')} Қоңырау шалу</a>
        <a class="btn wa" href="${waHref(s.phone, `Сәлеметсіз бе! ${s.schoolName} автомектебі туралы сұрағым бар.`)}" target="_blank" rel="noopener">${icon('chat')} WhatsApp</a>
      </div>
    </div>
  </section>`,
    prices: `
  <section class="pub-section" id="prices">
    <div class="pub-head"><p class="pub-eyebrow">Бағалар</p><h2>Санаттар мен оқу ақысы</h2><p>Баға теориялық курсты, міндетті практикалық сабақтарды және ішкі емтихандарды қамтиды.</p></div>
    <div class="price-grid">${CATEGORIES.map((c) => `
      <div class="price-card ${c === 'B' ? 'featured' : ''}">
        ${c === 'B' ? '<span class="tag">Ең танымал</span>' : ''}
        <div class="price-cat">${c}</div>
        <h3>${CAT_INFO[c].name}</h3>
        <p>${CAT_INFO[c].text}</p>
        <div class="price">${money(basePrice(c))}</div>
        <ul class="ticks">
          <li>${icon('check')} ${req(c)} практикалық сабақ</li>
          <li>${icon('check')} Теориялық курс</li>
          <li>${icon('check')} Ішкі емтихандар</li>
          <li>${icon('check')} Жеке кабинет</li>
        </ul>
        ${acc ? '' : `<button class="btn ${c === 'B' ? 'primary' : ''}" data-pa="choose" data-id="${c}">Осы санатқа тіркелу</button>`}
      </div>`).join('')}
    </div>
    <div class="calc card">
      <div><h3>Бөліп төлеу калькуляторы</h3><p class="muted small">Оқу ақысын бірнеше айға бөліп төлеуге болады. Нақты кесте шартта әкімшімен келісіледі.</p></div>
      <div class="calc-row">
        <select class="input" id="calcCat" aria-label="Санат">${CATEGORIES.map((c) => `<option value="${c}" ${c === myCat ? 'selected' : ''}>${c} — ${CAT_INFO[c].name}</option>`).join('')}</select>
        <select class="input" id="calcMonths" aria-label="Ай саны">${[1, 2, 3, 4].map((m) => `<option value="${m}" ${m === 2 ? 'selected' : ''}>${m} айға</option>`).join('')}</select>
      </div>
      <div class="calc-out" id="calcOut">${calcText(myCat, 2)}</div>
    </div>
  </section>`,
    steps: `
  <section class="pub-section alt" id="steps">
    <div class="pub-head"><p class="pub-eyebrow">Оқу жолы</p><h2>Өтінімнен куәлікке дейін — 6 қадам</h2></div>
    <div class="steps">${[
      ['Өтінім қалдыру', 'Сайтта тіркеліп, жеке кабинет ашасыз. Әкімші сізбен хабарласып, шарт жасайды.'],
      ['Теориялық курс', 'Жол жүру ережелері, жол белгілері және қауіпсіздік негіздері.'],
      ['Практикалық сабақтар', `Нұсқаушымен оқу көлігінде: A — ${req('A')}, B — ${req('B')}, C — ${req('C')} сабақ.`],
      ['Ішкі емтихан', 'Алдымен теория, міндетті практикадан кейін — жүргізу.'],
      ['Мемлекеттік емтихан', 'Теория мен практика. Оқу ақысы толық төленгеннен кейін жіберіледі.'],
      ['Жүргізуші куәлігі', 'Мемлекеттік практикалық емтиханнан өткен соң куәлік алуға дайынсыз.'],
    ].map(([t, d], k) => `<div class="step"><span class="step-no">${k + 1}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  </section>`,
    team: `
  <section class="pub-section" id="team">
    <div class="pub-head"><p class="pub-eyebrow">Команда</p><h2>Біздің нұсқаушылар</h2></div>
    <div class="team">${db.instructors.map((i) => `
      <div class="card team-card">
        <div class="avatar big">${esc(initials(i.name))}</div>
        <h3>${esc(i.name)}</h3>
        <p class="muted small">${i.experience} жыл тәжірибе</p>
        <div class="chips center">${i.categories.map((c) => `<span class="chip">${c} санаты</span>`).join('')}</div>
        <p class="small">${(i.carIds || []).map((cid) => esc(byId('cars', cid)?.model || '')).filter(Boolean).join(' · ') || '—'}</p>
      </div>`).join('') || empty('Нұсқаушылар әлі қосылмаған')}
    </div>
    <div class="fleet">
      <h3>${icon('car')} Оқу көліктері</h3>
      <div class="chips">${db.cars.filter((c) => c.status === 'Жұмыста').map((c) => `<span class="chip">${esc(c.model)} · ${c.category} · ${c.year}</span>`).join('') || '<span class="muted">—</span>'}</div>
    </div>
  </section>`,
    faq: `
  <section class="pub-section alt" id="faq">
    <div class="pub-head"><p class="pub-eyebrow">Сұрақтар</p><h2>Жиі қойылатын сұрақтар</h2></div>
    <div class="faq">${[
      ['Оқу қанша уақытқа созылады?', `Бұл сіздің кестеңізге байланысты. Міндетті практикалық сабақ саны: A — ${req('A')}, B — ${req('B')}, C — ${req('C')}.`],
      ['Бөліп төлеуге бола ма?', 'Иә. Алғашқы төлемнен кейін практикаға жазыла аласыз, ал мемлекеттік емтиханға дейін ақы толық төленуі керек.'],
      ['Сабақ уақытын өзім таңдай аламын ба?', 'Иә. Жеке кабинетте нұсқаушыңыздың бос уақытына өзіңіз жазыласыз — жүйе бос емес уақытқа жазылуға жол бермейді.'],
      ['Емтиханға қашан жіберіледі?', 'Ретпен: ішкі теория → ішкі практика → мемлекеттік теория → мемлекеттік практика. Әр кезең алдыңғысынан өткен соң ашылады.'],
      ['Өз көлігім болуы керек пе?', 'Жоқ. Сабақтар мектептің техбайқаудан өткен оқу көліктерінде өтеді.'],
    ].map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  </section>`,
    contacts: `
  <section class="pub-section" id="contacts">
    <div class="contact card">
      <div>
        <p class="pub-eyebrow">Байланыс</p>
        <h2>Сұрағыңыз бар ма?</h2>
        <ul class="contact-list">
          <li>${icon('pin')} ${esc(s.city)}</li>
          <li>${icon('phone')} ${esc(s.phone)}</li>
          <li>${icon('clock')} ${WORK_HOURS}</li>
        </ul>
      </div>
      <a class="btn wa" href="${waHref(s.phone, `Сәлеметсіз бе! ${s.schoolName} автомектебі туралы сұрағым бар.`)}" target="_blank" rel="noopener">${icon('chat')} WhatsApp-қа жазу</a>
    </div>
  </section>`,
  };
  return only ? parts[only] || '' : Object.values(parts).join('');
}

function calcText(cat, months) {
  const total = basePrice(cat);
  const per = Math.ceil(total / months);
  return `<b>${money(per)}</b><span>айына × ${months} ай · барлығы ${money(total)}</span>`;
}

const pubFooter = () => `<footer class="pub-footer">© ${YEAR} ${esc(db.settings.schoolName)} автомектебі · Оқу жобасы (демо нұсқа)</footer>`;

// ---------- Кіру / тіркелу беті ----------
function authCard(tab) {
  return `
  <div class="auth-tabs" role="tablist">
    <button class="${tab === 'login' ? 'on' : ''}" data-pa="tab" data-id="login" role="tab">Кіру</button>
    <button class="${tab === 'register' ? 'on' : ''}" data-pa="tab" data-id="register" role="tab">Тіркелу</button>
  </div>
  ${tab === 'login' ? `
  <form id="loginForm" class="auth-form" novalidate>
    <h2>Жүйеге кіру</h2>
    <p class="muted small">Email-ге қарай жүйе өзі анықтайды: әкімші басқару жүйесіне, оқушы жеке кабинетке кіреді.</p>
    <div class="field"><label for="lg_email">Email</label><input class="input" id="lg_email" name="email" type="email" autocomplete="username" placeholder="name@mail.kz"></div>
    <div class="field"><label for="lg_pass">Құпиясөз</label><input class="input" id="lg_pass" name="pass" type="password" autocomplete="current-password"></div>
    <p class="form-error" id="loginError"></p>
    <button type="submit" class="btn primary wide">Кіру</button>
    <div class="demo-box">
      <p class="demo-title">Демо аккаунттар</p>
      <div class="demo-row"><div><b>Әкімші</b><span>admin@automektep.test</span><span>Admin2026!</span></div><button type="button" class="btn small" data-pa="fill" data-id="admin">Толтыру</button></div>
      <div class="demo-row"><div><b>Оқушы</b><span>aliya@automektep.test</span><span>Student2026!</span></div><button type="button" class="btn small" data-pa="fill" data-id="student">Толтыру</button></div>
    </div>
  </form>` : `
  <form id="registerForm" class="auth-form" novalidate>
    <h2>Оқуға тіркелу</h2>
    <p class="muted small">Тіркелгеннен кейін өтініміңіз әкімшіге түседі, ал сіз жеке кабинетке бірден кіресіз.</p>
    <div class="field"><label for="rg_name">Аты-жөні</label><input class="input" id="rg_name" name="name" autocomplete="name"></div>
    <div class="two">
      <div class="field"><label for="rg_phone">Телефон</label><input class="input" id="rg_phone" name="phone" type="tel" placeholder="+7 7__ ___ __ __" autocomplete="tel"></div>
      <div class="field"><label for="rg_email">Email</label><input class="input" id="rg_email" name="email" type="email" autocomplete="email"></div>
    </div>
    <div class="two">
      <div class="field"><label for="rg_cat">Санат</label><select class="input" id="rg_cat" name="category">${CATEGORIES.map((c) => `<option value="${c}" ${c === regCat ? 'selected' : ''}>${c} — ${CAT_INFO[c].name}</option>`).join('')}</select></div>
      <div class="field"><label for="rg_time">Ыңғайлы уақыт</label><select class="input" id="rg_time" name="time">${PREF_TIMES.map((t) => `<option>${t}</option>`).join('')}</select></div>
    </div>
    <div class="two">
      <div class="field"><label for="rg_pass">Құпиясөз</label><input class="input" id="rg_pass" name="pass" type="password" autocomplete="new-password" placeholder="кемінде 6 таңба"></div>
      <div class="field"><label for="rg_pass2">Құпиясөзді қайталаңыз</label><input class="input" id="rg_pass2" name="pass2" type="password" autocomplete="new-password"></div>
    </div>
    <div class="field"><label for="rg_heard">Бізді қайдан білдіңіз?</label><select class="input" id="rg_heard" name="heard">${HEARD.map((h) => `<option>${h}</option>`).join('')}</select></div>
    <label class="check consent"><input type="checkbox" name="consent"> Жеке деректерімді өңдеуге келісемін</label>
    <p class="form-error" id="registerError"></p>
    <button type="submit" class="btn primary wide">Тіркелу және кабинетке кіру</button>
  </form>`}`;
}

function renderAuth() {
  document.title = `${db.settings.schoolName} автомектебі — кіру`;
  authView.innerHTML = `
  ${pubHeader(null)}
  <section class="pub-hero" id="top">
    <div class="pub-hero-text">
      <p class="pub-eyebrow light">${esc(db.settings.city)} · ${esc(db.settings.schoolName)} автомектебі</p>
      <h1>Жүргізуші куәлігіне сенімді жол</h1>
      <p class="pub-lead">Теория, практика және емтиханға дайындық бір жерде. Сабақ кестесін, төлемдер мен оқу прогресін жеке кабинетте бақылаңыз.</p>
      <div class="pub-stats">${pubStats()}</div>
    </div>
    <div class="auth-card" id="auth">${authCard(authTab)}</div>
  </section>
  ${infoSections(null)}
  ${pubFooter()}`;
}

function doLogin(form) {
  db = load();
  const fd = new FormData(form);
  const email = String(fd.get('email') || '').trim().toLowerCase();
  const pass = String(fd.get('pass') || '');
  if (!email || !pass) return 'Email мен құпиясөзді енгізіңіз';
  const acc = db.accounts.find((a) => a.email.toLowerCase() === email);
  if (!acc || acc.pass !== hashPass(pass)) return 'Email немесе құпиясөз қате';
  setSession(acc.id);
  logAct(`Жүйеге кірді: ${acc.email} (${acc.role === 'admin' ? 'әкімші' : 'оқушы'})`);
  save();
  view = 'dashboard';
  render();
  window.scrollTo(0, 0);
  toast(`Қош келдіңіз, ${firstName(acc.name)}!`);
  return '';
}

function doRegister(form) {
  db = load();
  const fd = new FormData(form);
  const get = (k) => String(fd.get(k) ?? '').trim();
  const d = { name: get('name'), phone: get('phone'), email: get('email').toLowerCase(), category: get('category'), time: get('time'), heard: get('heard'), pass: String(fd.get('pass') || ''), pass2: String(fd.get('pass2') || '') };
  if (d.name.split(/\s+/).length < 2) return 'Аты-жөніңізді толық жазыңыз (аты және тегі)';
  if (digits(d.phone).length < 10) return 'Телефон нөмірі кемінде 10 цифрдан тұруы керек';
  if (!isEmail(d.email)) return 'Email дұрыс емес';
  if (db.accounts.some((a) => a.email.toLowerCase() === d.email)) return 'Бұл email-мен аккаунт бар — «Кіру» бөлімін қолданыңыз';
  if (d.pass.length < 6) return 'Құпиясөз кемінде 6 таңбадан тұруы керек';
  if (d.pass !== d.pass2) return 'Құпиясөздер сәйкес емес';
  if (!fd.get('consent')) return 'Жеке деректерді өңдеуге келісім беріңіз';
  const acc = { id: uid('a'), email: d.email, pass: hashPass(d.pass), role: 'student', name: d.name, studentId: null, leadId: null };
  // Бұрыннан оқып жүрген оқушы болса — кабинетті сол оқушыға байланыстыру
  const existing = db.students.find((s) => digits(s.phone) === digits(d.phone));
  if (existing) {
    acc.studentId = existing.id;
    logAct(`Оқушы сайтта аккаунт ашты: ${existing.name}`);
  } else {
    const lead = { id: uid('d'), name: d.name, phone: d.phone, category: d.category, source: 'Сайт', date: TODAY, status: 'Жаңа', note: `Сайт арқылы тіркелді. Ыңғайлы уақыт: ${d.time}. Қайдан білді: ${d.heard}. Email: ${d.email}` };
    db.leads.push(lead);
    acc.leadId = lead.id;
    logAct(`Сайттан жаңа өтінім: ${d.name} (${d.category} санаты)`);
  }
  db.accounts.push(acc);
  setSession(acc.id);
  save();
  render();
  window.scrollTo(0, 0);
  toast(existing ? 'Аккаунт ашылды — оқу деректеріңіз кабинетте' : 'Өтінім қабылданды! Әкімші сізбен хабарласады');
  return '';
}

// ---------- Оқушы кабинеті ----------
const STAGES = ['Өтінім', 'Теория', 'Практика', 'Емтихан', 'Куәлік'];
function tracker(idx) {
  return `<ol class="tracker">${STAGES.map((s, k) => `<li class="${k < idx ? 'done' : k === idx ? 'now' : ''}"><span>${k < idx ? icon('check') : k + 1}</span>${s}</li>`).join('')}</ol>`;
}

function cabinet(acc) {
  const st = acc.studentId ? byId('students', acc.studentId) : null;
  const lead = !st && acc.leadId ? byId('leads', acc.leadId) : null;
  const s = db.settings;
  if (!st) {
    return `<section class="pub-section cabinet" id="cabinet">
      <div class="cab-head"><div><p class="pub-eyebrow">Жеке кабинет</p><h2>Сәлем, ${esc(firstName(acc.name))}!</h2></div></div>
      ${lead ? `<div class="card cab-wait">
        <div class="cab-wait-top">${icon('clock')}<div class="grow"><h3>Өтініміңіз қабылданды</h3><span>${fullDate(lead.date)} · ${lead.category} санаты · ${esc(lead.phone)}</span></div>${pill(lead.status, LEAD_CLASS[lead.status])}</div>
        ${tracker(0)}
        <p>${lead.status === 'Бас тартты'
          ? 'Өтінім жабылған. Қайта оқығыңыз келсе, әкімшіге жазыңыз.'
          : 'Әкімші сізбен телефон арқылы хабарласып, шарт жасайды. Шарттан кейін осы кабинетте сабақ кестесі, төлемдер мен оқу прогресі пайда болады, ал сабаққа өзіңіз жазыла аласыз.'}</p>
      </div>` : `<div class="card">${empty('Профиліңіз табылмады. Әкімшіге хабарласыңыз.')}</div>`}
      
    </section>`;
  }
  const idx = { 'Теория': 1, 'Практика': 2, 'Емтихан': 3, 'Бітірді': 4 }[st.status] ?? 1;
  const price = priceOf(st);
  const paid = paidBy(st.id);
  const debt = debtOf(st);
  const done = practiceDone(st.id);
  const req = practiceReq(st);
  const ins = byId('instructors', st.instructorId);
  const upcoming = db.lessons.filter((l) => l.studentId === st.id && !l.done && l.date >= TODAY).sort(byDateTime);
  const exams = db.exams.filter((e) => e.studentId === st.id).sort((a, b) => b.date.localeCompare(a.date));
  const pays = db.payments.filter((p) => p.studentId === st.id).sort((a, b) => b.date.localeCompare(a.date));
  const msg = {
    'Теория': 'Теориялық курстасыз. Практикаға жазылу үшін алғашқы төлем жеткілікті.',
    'Практика': done >= req ? 'Міндетті практика аяқталды — әкімші сізді емтиханға жазады.' : `Практика: ${done} / ${req} сабақ. Тағы ${req - done} сабақтан кейін ішкі практикалық емтиханға шыға аласыз.`,
    'Емтихан': 'Емтихан кезеңіндесіз. Сәттілік тілейміз!',
    'Бітірді': 'Құттықтаймыз! Оқуды аяқтадыңыз — жүргізуші куәлігін алуға дайынсыз.',
  }[st.status];
  return `<section class="pub-section cabinet" id="cabinet">
    <div class="cab-head">
      <div><p class="pub-eyebrow">Жеке кабинет · ${st.category} санаты</p><h2>Сәлем, ${esc(firstName(st.name))}!</h2><p class="muted">${msg}</p></div>
      <div class="cab-actions">
        ${st.status !== 'Бітірді' ? `<button class="btn primary" data-pa="book">${icon('calendar')} Сабаққа жазылу</button>` : ''}
        ${debt ? `<button class="btn" data-pa="payinfo">${icon('card')} Төлеу</button>` : ''}
        <button class="btn" data-pa="chat">${icon('chat')} Әкімшіге жазу</button>
      </div>
    </div>
    ${tracker(idx)}
    ${upcoming.length ? `<div class="next-lesson">
      <div class="nl-icon">${icon('calendar')}</div>
      <div class="grow"><span>Келесі сабақ</span><b>${upcoming[0].date === TODAY ? 'Бүгін' : `${weekday(upcoming[0].date)}, ${prettyDate(upcoming[0].date)}`}, ${upcoming[0].time} · ${upcoming[0].type}</b>
        <small>${esc(ins ? ins.name : '')}${upcoming[0].carId ? ' · ' + esc(carLabel(upcoming[0].carId)) : ''} · ${daysFrom(upcoming[0].date) === 0 ? 'бүгін' : daysFrom(upcoming[0].date) + ' күннен кейін'}</small></div>
      <button class="btn small" data-pa="ics">${icon('download')} Күнтізбеге қосу</button>
    </div>` : ''}
    <div class="cab-grid">
      <div class="mini"><span>Оқу ақысы</span><b>${money(price)}</b><small>${st.discount ? `жеңілдік ${st.discount}%` : 'жеңілдіксіз'}</small></div>
      <div class="mini"><span>Төленді</span><b>${money(paid)}</b>${meter(paid, price)}</div></div>
      <div class="mini"><span>Қалдық</span><b class="${debt ? 'debt' : ''}">${money(debt)}</b><small>${myPending(acc) ? `${money(myPending(acc))} растауды күтуде` : debt ? 'мемлекеттік емтиханға дейін төлеу керек' : 'толық төленді'}</small></div>
      <div class="mini"><span>Практика</span><b>${done} / ${req}</b>${meter(done, req, 'blue')}</div></div>
      <div class="mini link-card" data-pa="page" data-id="theory"><span>Теория (бейнесабақ)</span><b>${watchedCount(acc)} / ${db.theory.length}</b>${meter(watchedCount(acc), db.theory.length, 'blue')}</div></div>
      <div class="mini link-card" data-pa="page" data-id="quiz"><span>Тест (ең жақсы)</span><b>${acc.tests.length ? bestTest(acc) + '%' : '—'}</b><small>${acc.tests.length ? `${acc.tests.length} рет тапсырылды` : 'әлі тапсырылмаған'}</small></div>
    </div>
    <div class="cab-cols">
      <div class="card"><h3>Алдағы сабақтар</h3>
        ${upcoming.length ? `<ul class="mini-list">${upcoming.slice(0, 6).map((l) => `<li><span><b>${l.date === TODAY ? 'Бүгін' : prettyDate(l.date)}, ${l.time}</b> · ${l.type}${l.carId ? ` · ${esc(byId('cars', l.carId)?.model || '')}` : ''}</span>${l.date > TODAY ? `<button class="link small" data-pa="cancel" data-id="${l.id}">Бас тарту</button>` : ''}</li>`).join('')}</ul>` : '<p class="muted small">Жоспарланған сабақ жоқ.</p>'}
      </div>
      <div class="card"><h3>Емтихандар</h3>
        ${exams.length ? `<ul class="mini-list">${exams.map((e) => `<li><span>${esc(e.type.replace(' емтихан', ''))} · ${prettyDate(e.date)}</span>${pill(e.result, e.result === 'Өтті' ? 's-done' : e.result === 'Өтпеді' ? 's-fail' : 's-theory')}</li>`).join('')}</ul>` : '<p class="muted small">Емтихан әлі тағайындалмаған.</p>'}
      </div>
      <div class="card"><h3>Төлемдер тарихы</h3>
        ${pays.length ? `<ul class="mini-list">${pays.map((p) => `<li><span>${fullDate(p.date)} · ${esc(p.method)}</span><span class="nowrap"><b>${money(p.amount)}</b> <button class="link small blue" data-pa="receipt" data-id="${p.id}">түбіртек</button></span></li>`).join('')}</ul>` : '<p class="muted small">Төлем әлі жоқ.</p>'}
      </div>
    </div>
    
  </section>`;
}

const myPending = (acc) => db.messages.filter((m) => m.accountId === acc.id && m.kind === 'payment' && m.status === 'pending').reduce((s, m) => s + m.amount, 0);

// Кабинеттегі чат карточкасы: соңғы хабарлама + чатты ашу
function chatPromo(acc) {
  const msgs = db.messages.filter((m) => m.accountId === acc.id).sort((a, b) => a.ts - b.ts);
  const last = msgs.at(-1);
  const n = unreadForAccount(acc.id);
  return `<div class="card chat-promo">
    <div class="nl-icon">${icon('chat')}</div>
    <div class="grow"><b>Әкімшімен чат ${n ? `<em class="badge">${n}</em>` : ''}</b>
      <span>${last ? `${last.from === 'admin' ? 'Әкімші' : 'Сіз'}: ${esc((last.kind === 'payment' ? `төлем ${money(last.amount)}` : last.text).slice(0, 90))}` : 'Сұрағыңыз болса, сайттан шықпай әкімшіге жазыңыз.'}</span></div>
    <button class="btn primary" data-pa="chat">${icon('chat')} Чатты ашу</button>
  </div>`;
}

function sendStudentMessage(form) {
  const text = String(new FormData(form).get('text') || '').trim();
  if (!text) return;
  db = load();
  const acc = currentAccount();
  if (!acc) return;
  db.messages.push({ id: uid('m'), accountId: acc.id, from: 'student', kind: 'text', text, ts: Date.now(), read: false });
  logAct(`Оқушыдан хабарлама: ${acc.name}`);
  save();
  render();
  toast('Хабарлама әкімшіге жіберілді');
}

function renderPortal(acc) {
  const ALL_PAGES = [...PAGES, ['profile', 'Баптаулар']];
  if (!ALL_PAGES.some(([id]) => id === portalPage)) portalPage = 'cabinet';
  const title = ALL_PAGES.find(([id]) => id === portalPage)[1];
  document.title = `${title} — ${db.settings.schoolName}`;
  const PAGE_FN = { cabinet: cabinet, theory: theoryPage, quiz: quizPage, profile: profilePage, school: (a) => infoSections(a) };
  portalView.innerHTML = `${pubHeader(acc)}<main class="pub-main page-${portalPage}">${PAGE_FN[portalPage](acc)}</main>${pubFooter()}`;
}

// ---------- Теория: YouTube бейнесабақтары ----------
const thumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
function theoryPage(acc) {
  const lessons = theorySorted();
  const w = watchedCount(acc);
  return `<section class="pub-section cabinet">
    <div class="cab-head">
      <div><p class="pub-eyebrow">Теориялық курс</p><h2>Бейнесабақтар</h2>
        <p class="muted">Сабақтар YouTube арқылы көрсетіледі. Әр сабақты қарап шыққан соң «Қарап шықтым» деп белгілеңіз — прогресіңізді әкімші де көреді.</p></div>
      <div class="cab-actions"><button class="btn primary" data-pa="page" data-id="quiz">${icon('quiz')} Тестке өту</button></div>
    </div>
    <div class="card theory-progress">
      <div class="grow"><b>${w} / ${lessons.length} сабақ қаралды</b>
        <div class="progress blue goal-progress"><i style="width:${pct(w, lessons.length)}%"></i></div>
        <small class="muted">${w >= lessons.length && lessons.length ? 'Барлық сабақ қаралды — енді тест тапсырыңыз!' : 'Барлық сабақты қарап, тестпен біліміңізді тексеріңіз.'}</small></div>
    </div>
    <div class="video-grid">${lessons.map((t) => {
      const seen = acc.watched.includes(t.id);
      return `<div class="video-card ${seen ? 'seen' : ''}">
        <button class="thumb" data-pa="video" data-id="${t.id}" aria-label="${esc(t.title)} — көру">
          <img src="${thumb(t.youtube)}" alt="" loading="lazy" onerror="this.remove()">
          <span class="play">${icon('play')}</span>
          ${seen ? `<span class="seen-tag">${icon('check')} Қаралды</span>` : ''}
        </button>
        <div class="vc-body">
          <h3>${esc(t.title)}</h3>
          <p>${esc(t.desc)}</p>
          <div class="vc-actions">
            <button class="btn small primary" data-pa="video" data-id="${t.id}">${icon('play')} Көру</button>
            <button class="btn small" data-pa="watch" data-id="${t.id}">${seen ? 'Белгіні алу' : 'Қарап шықтым'}</button>
            <a class="link small blue" href="${ytUrl(t.youtube)}" target="_blank" rel="noopener">YouTube-та ашу</a>
          </div>
        </div>
      </div>`;
    }).join('') || `<div class="card">${empty('Әзірге теория сабағы қосылмаған')}</div>`}</div>
  </section>`;
}

function openVideo(id) {
  const t = byId('theory', id);
  const acc = currentAccount();
  if (!t || !acc) return;
  const seen = acc.watched.includes(t.id);
  openModal(t.title, `
    <div class="profile">
      <div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/${t.youtube}?rel=0" title="${esc(t.title)}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
      <p class="muted small" style="margin:0">${esc(t.desc)} Бейне ашылмаса, «YouTube-та ашу» батырмасын басыңыз.</p>
      <div class="modal-actions">
        <a class="btn" href="${ytUrl(t.youtube)}" target="_blank" rel="noopener">${icon('link')} YouTube-та ашу</a>
        <button type="button" class="btn primary" data-action="markWatched" data-id="${t.id}">${icon('check')} ${seen ? 'Белгіні алу' : 'Қарап шықтым'}</button>
      </div>
    </div>`, true);
}

// ---------- Тест: жол қозғалысы ережелері ----------
const PASS_SCORE = 80;
const QUIZ_BASE = [
  { q: 'Бағдаршамның сары жыпылықтайтын сигналы нені білдіреді?', o: ['Қозғалысқа тыйым салынады', 'Қозғалысқа рұқсат етіледі, бірақ реттелмейтін қиылыс немесе өткел туралы ескертеді', 'Тек оңға бұрылуға болады', 'Бағдаршам бұзылған, міндетті түрде тоқтау керек'], a: 1, e: 'Сары жыпылықтайтын сигнал қозғалысқа рұқсат береді, бірақ реттелмейтін қиылыс немесе жаяу жүргінші өткелі туралы ескертеді — аса сақ болу керек.' },
  { q: 'Елді мекенде жеңіл автокөліктің ең жоғары жылдамдығы қандай (басқа белгі болмаса)?', o: ['40 км/сағ', '60 км/сағ', '80 км/сағ', '90 км/сағ'], a: 1, e: 'Елді мекендерде жылдамдық 60 км/сағ-тан аспауы керек.' },
  { q: 'Апаттық тоқтау белгісі елді мекенде көліктен кемінде қандай қашықтықта қойылады?', o: ['5 м', '10 м', '15 м', '30 м'], a: 2, e: 'Елді мекенде — кемінде 15 м, елді мекеннен тыс — кемінде 30 м.' },
  { q: 'Реттелмейтін жаяу жүргінші өткелінде басымдық кімде?', o: ['Жүргізушіде', 'Өткелге шыққан немесе шыққалы тұрған жаяу жүргіншіде', 'Жылдамырақ қозғалатында', 'Ірі көлікте'], a: 1, e: 'Жүргізуші реттелмейтін өткелде жолды кесіп өтіп жатқан немесе өткелге шыққан жаяу жүргіншіге жол беруі керек.' },
  { q: 'Көлік жүргізу кезінде ұялы телефонды пайдалануға бола ма?', o: ['Иә, кез келген уақытта', 'Тек қолды бос қалдыратын құрылғы (hands-free) арқылы', 'Тек қала сыртында', 'Иә, егер жылдамдық төмен болса'], a: 1, e: 'Қолды бос қалдыратын құрылғысыз телефонмен сөйлесуге тыйым салынған.' },
  { q: 'Қауіпсіздік белдігін кім тағуы керек?', o: ['Тек жүргізуші', 'Жүргізуші мен алдыңғы орындықтағы жолаушы ғана', 'Жүргізуші және белдік орнатылған орындардағы барлық жолаушылар', 'Тек қала сыртында жүргенде'], a: 2, e: 'Белдік орнатылған көлікте жүргізуші де, жолаушылар да белдік тағуы міндетті.' },
  { q: '«Тоқтамай жүруге тыйым салынады» (STOP) белгісі тұрса, жүргізуші не істеуі керек?', o: ['Жылдамдықты азайту жеткілікті', 'Тоқтау сызығы алдында, ол болмаса кесіп өтетін жолдың шетінде міндетті түрде тоқтау', 'Басқа көлік болса ғана тоқтау', 'Дыбыстық белгі беру'], a: 1, e: 'Бұл белгі тұрған жерде басқа көлік болмаса да міндетті түрде тоқтау керек.' },
  { q: 'Көк жарқылдатқыш маягы мен арнайы дыбыстық сигналы қосулы көлік жақындаса, не істеу керек?', o: ['Жылдамдықты арттырып, алдына шығу', 'Оған кедергісіз өтуге жол беру', 'Ештеңе өзгертпеу', 'Тоқтап, дыбыстық белгі беру'], a: 1, e: 'Арнайы сигналдары қосулы жедел қызмет көлігіне жол беру міндетті.' },
  { q: 'Бағдаршамның қызыл және сары сигналдары бірге жанса, бұл нені білдіреді?', o: ['Қозғалуға болады', 'Қозғалысқа әлі тыйым салынады, жақында жасыл сигнал қосылады', 'Тек бұрылуға болады', 'Бағдаршам бұзылған'], a: 1, e: 'Қызыл мен сары бірге — қозғалысқа тыйым салынады және жасыл сигнал қосылатынын хабарлайды.' },
  { q: 'Алкогольдік мас күйде көлік жүргізуге бола ма?', o: ['Аз мөлшерде болады', 'Жоқ, тыйым салынған', 'Тек түнде болады', 'Қысқа қашықтыққа болады'], a: 1, e: 'Мас күйде көлік жүргізуге қатаң тыйым салынған.' },
];

// 4 нұсқа × 20 сұрақ. Формат: 'сұрақ|жауап1|жауап2|...|дұрыс жауаптың нөмірі'
const QV_RAW = [
  [ // 1-нұсқа (алғашқы 10 сұрақ — QUIZ_BASE)
    'Көлік жүргізгенде жүргізуші куәлігі мен көлік тіркеу куәлігі қашан қасыңызда болуы керек?|Тек қала сыртында|Көлік жүргізгенде әрқашан|Тек тексеру кезінде|Тек түнде|2',
    'Қызыл бағдаршам жанып тұрғанда не істеу керек?|Баяулатып өту|Тоқтау сызығының алдында тоқтау|Тек оңға бұрылу|Дыбыстық белгі беріп өту|2',
    'Жасыл бағдаршам жыпылықтаса, бұл нені білдіреді?|Сигнал жақында ауысады|Қозғалысқа тыйым салынады|Жылдамдықты арттыру керек|Бағдаршам бұзылған|1',
    'Бұрылыс алдында не істеу керек?|Бұрылу көрсеткішін алдын ала қосу|Дыбыстық белгі беру|Жылдамдықты арттыру|Ештеңе істемеу|1',
    'Тұтас бөлгіш сызық (1.1) нені білдіреді?|Оны кесіп өтуге болады|Оны кесіп өтуге тыйым салынады|Тек түнде кесіп өтуге болады|Тұраққа рұқсат беріледі|2',
    'Теңдей жолдардың қиылысында оңнан келе жатқан көлікке не істеу керек?|Жол беру|Жол беруге міндетті емессіз|Дыбыстық белгі беру|Жылдамдықты арттыру|1',
    'Қызыл жиекті үшбұрышты белгілер қандай топқа жатады?|Ескерту белгілері|Тыйым салу белгілері|Нұсқау белгілері|Ақпараттық белгілер|1',
    'Қызыл жиекті дөңгелек белгілер қандай топқа жатады?|Ескерту белгілері|Тыйым салу белгілері|Міндеттеу белгілері|Ақпараттық белгілер|2',
    'Тұман кезінде жүргізуші не істеуі керек?|Жылдамдықты арттыру|Жылдамдықты азайтып, жарық құралдарын қосу|Қашықтықты қысқарту|Апаттық сигналмен жүру|2',
    'Жолда шаршау сезілсе, не істеу керек?|Терезені ашып жүре беру|Тоқтап, демалу|Жылдамдықты арттыру|Музыканы қатты қосу|2',
  ],
  [ // 2-нұсқа
    'Темір жол өткелінде шлагбаум түсіріліп тұрса, не істеу керек?|Айналып өту|Шлагбаум көтерілгенше күту|Баяулатып өту|Дыбыстық белгі беру|2',
    'Жол-көлік оқиғасы болғанда бірінші кезекте не істеу керек?|Көлікті тез жылжыту|Апаттық сигналды қосып, тоқтау белгісін қою, 112-ге хабарласу|Оқиға орнынан кету|Көліктен түспеу|2',
    'Төтенше жағдайлардың бірыңғай нөмірі қандай?|112|911|100|555|1',
    'B санаты бойынша жүргізуші куәлігін алудың ең төменгі жасы қандай?|16|18|21|25|2',
    'Озу алдында не міндетті?|Қарсы жолақтың бос екеніне көз жеткізу|Апаттық сигналды қосу|Жылдамдықты азайту|Терезені жабу|1',
    'Жаяу жүргіншілер өткелінде озуға бола ма?|Иә|Жоқ, тыйым салынған|Тек түнде|Баяу болса, болады|2',
    'Көлік тайғақта сырғып кетсе, не істеу керек?|Күрт тежеу|Рульді сырғу жағына бұрып, күрт тежемеу|Газды күрт басу|Рульді жіберіп қою|2',
    'Аквапланинг (су үстінде сырғу) кезінде не істеу керек?|Күрт тежеу|Газды бірте-бірте жіберіп, рульді тұрақты ұстау|Рульді күрт бұру|Жылдамдықты арттыру|2',
    'Алдыңғы көлікпен арақашықтықты қашан ұлғайту керек?|Жол құрғақ болса|Жол дымқыл немесе тайғақ болса|Күндіз|Жол бос болса|2',
    'Мотоцикл жүргізушісі қорғаныс дулығасын қашан киюі керек?|Тек қала сыртында|Әрқашан, әрі байлауы тиіс|Тек түнде|Міндетті емес|2',
    'Балаларды көлікте қалай тасымалдау керек?|Белдіксіз отырғызып|Салмағы мен бойына сай бала ұстағышпен|Алдыңғы орындықта құшағыңызда|Артқы орындықта еркін|2',
    '«Басты жол» белгісі нені білдіреді?|Қиылыстарда басымдық беретін жолды|Тоқтауға тыйымды|Тұрақты|Қозғалысқа тыйымды|1',
    '«Жол беріңіз» (төңкерілген үшбұрыш) белгісі нені талап етеді?|Басты жолдағы көліктерге жол беруді|Тоқтамай өтуді|Тұраққа рұқсатты|Жылдамдықты шектеуді|1',
    'Көлікті қоюға болмайтын жер қайсы?|Жаяу жүргіншілер өткелі|Белгіленген тұрақ|Тұрақ белгісі бар орын|Ашық алаң|1',
    'Тежегіш істен шықса, не істеу керек?|Қозғалтқышпен тежеп, қол тежегішін бірте-бірте тарту|Қозғалтқышты өшіріп, рульді құлыптау|Газды басу|Жоғары берілісті қосу|1',
    'Түнде қарсы көлік көзіңізді шағылыстырса, не істеу керек?|Алыс жарықты қосу|Жылдамдықты азайтып, оң жақ жиекке қарау, қажет болса тоқтау|Көзді жұму|Жылдамдықты арттыру|2',
    'Тұрғын аймақта (аулада) жылдамдық қандай болуы керек?|20 км/сағ-тан аспауы|40 км/сағ-тан аспауы|60 км/сағ-тан аспауы|Шектеусіз|1',
    'Көлік тіркеу куәлігінсіз жүргізуге бола ма?|Болады|Болмайды|Тек қалада|Тек күндіз|2',
    'Қозғалыс реттеушісі қолын жоғары көтерсе, бұл нені білдіреді?|Барлық бағытқа қозғалысқа тыйым|Тек оңға бұрылуға болады|Тек тура жүруге болады|Қозғалыс еркін|1',
    'Реттеушінің сигналы мен бағдаршам қайшы келсе, кімге бағыну керек?|Бағдаршамға|Жол белгісіне|Қозғалыс реттеушісіне|Өз қалауыңызға|3',
  ],
  [ // 3-нұсқа
    'Жолға шығар алдында нені тексеру керек?|Тек радионы|Шина, жарық құралдары, тежегіш, шыны тазалағышты|Тек жанармайды|Ештеңені|2',
    'Жолақ ауыстырғанда кімге жол беру керек?|Бағытын өзгертпей келе жатқан көліктерге|Тек артыңыздан келе жатқандарға|Ешкімге|Тек жаяу жүргіншілерге|1',
    'Қауіпсіздік белдігі апат кезінде не береді?|Жарақат қаупін азайтады|Ешқандай пайдасы жоқ|Тек артқы орындықта пайдалы|Тек жылдамдық жоғары болса, пайдалы|1',
    'Зейінге әсер етуі мүмкін дәрі қабылдағаннан кейін көлік жүргізуге бола ма?|Болады|Болмайды, егер нұсқауда зейінге әсер етеді делінсе|Тек түнде|Тек қалада|2',
    'Көлік жүріс бөлігінде бұзылса, не істеу керек?|Апаттық сигнал қосып, апаттық тоқтау белгісін қою|Ештеңе істемеу|Көлікте күту|Жарықты өшіру|1',
    'Теңдей жолдардың қиылысында трамвай мен көліктің қайсысына басымдық беріледі?|Трамвайға|Көлікке|Жылдамырақ келе жатқанға|Үлкеніне|1',
    'Жол бойында балалар көрінсе, жүргізуші не істеуі керек?|Жылдамдықты арттыру|Жылдамдықты азайтып, сақ болу|Дыбыстық белгі беру|Ештеңе өзгертпеу|2',
    'Түнде қарсы көлік жақындағанда алыс жарықты не істеу керек?|Жақын жарыққа ауыстыру|Қосулы қалдыру|Өшіріп тастау|Жыпылықтату|1',
    'Жылдамдық екі есе артса, тежелу жолы шамамен қалай өзгереді?|Өзгермейді|2 есе артады|4 есе артады|Азаяды|3',
    'Қысқы жолда басты ереже қандай?|Жылдамдықты арттыру|Қашықтықты ұлғайтып, баяу әрі біркелкі жүру|Күрт тежеу|Күрт бұрылу|2',
    'Артериядан қан ағып жатса, жгутты қайда салады?|Жараның жоғары жағына|Жараның төменгі жағына|Жараның үстіне ғана дәке|Салмайды|1',
    'Көлік жүріп келе жатқанда жолаушы не істеуі керек?|Белдік тағуы тиіс|Орнынан тұруы мүмкін|Есікті ашуы мүмкін|Жүргізушінің назарын аударуы мүмкін|1',
    'Көк шаршы ішіндегі «P» әрпі нені білдіреді?|Тұрақ орнын|Жол жөндеуді|Тоқтауға тыйымды|Бір бағытты жолды|1',
    'Көк дөңгелек белгідегі тура көрсеткі нені білдіреді?|Тек тура жүруді міндеттейді|Тура жүруге тыйым салады|Тұрақты|Қиылысты|1',
    'Артқа жүргенде не істеу керек?|Айналаның қауіпсіздігіне көз жеткізу|Тек дыбыстық белгі беру|Жылдамдықты арттыру|Көрсеткішті өшіру|1',
    'Көлік есігін ашар алдында не істеу керек?|Артыңыздан келе жатқан көлік, велосипедші жоқ екеніне көз жеткізу|Тез ашу|Дыбыстық белгі беру|Ештеңе істемеу|1',
    'Шинадағы қысым дұрыс болмаса, не болады?|Басқарылу мен тежелу нашарлайды|Ешқандай әсері жоқ|Көлік жылдамырақ жүреді|Тек шығын азаяды|1',
    'Шаршаған жүргізушінің реакциясы қалай өзгереді?|Жақсарады|Баяулайды|Өзгермейді|Тездейді|2',
    'Мас күйдегі адамға көлік жүргізуге беруге бола ма?|Болады|Тыйым салынады|Жақын жолға болады|Түнде болады|2',
    'Темір жол өткелінде қызыл жыпылықтайтын сигнал жанса, не істеу керек?|Өтуге болады|Өтуге тыйым салынады|Баяулатып өтуге болады|Жылдамдатып өтуге болады|2',
  ],
  [ // 4-нұсқа
    'Озып болғаннан кейін не істеу керек?|Өз жолағыңа қауіпсіз оралу|Қарсы жолақта қалу|Күрт тежеу|Жолақты кесіп өту|1',
    'Көрінімі шектеулі бұрылыста озуға бола ма?|Болады|Тыйым салынады|Түнде болады|Баяу болса, болады|2',
    'Төмпешіктің (көтерілістің) соңында озуға бола ма?|Болады|Тыйым салынады|Жылдам болса, болады|Түнде болады|2',
    'Көліктің міндетті жарақтарына не жатады?|Алғашқы көмек қобдишасы, өрт сөндіргіш, апаттық тоқтау белгісі|Тек домкрат|Тек радио|Тек антенна|1',
    'Жүргізушінің жауапкершілігін міндетті сақтандыру полисі қажет пе?|Иә, міндетті|Жоқ|Тек қала сыртында|Тек жүк көлігіне|1',
    'Апаттық сигнал қашан қосылады?|Көлік бұзылғанда немесе апаттық тоқтағанда|Әр бұрылыста|Тұраққа қойғанда әрқашан|Қозғалыс кезінде тұрақты|1',
    'Жаяу жүргінші жолды қайдан кесіп өтуі керек?|Жаяу жүргіншілер өткелінен|Кез келген жерден|Қиылыс ортасынан|Көліктер арасынан|1',
    'Қозғалыс кезінде қозғалтқыш сөніп қалса, не істеу керек?|Қауіпсіз жерге тоқтау|Рульді құлыптау|Газды басу|Күрт бұрылу|1',
    'Жылдамдықты қай құралдан көруге болады?|Спидометр|Тахометр|Жанармай көрсеткіші|Температура көрсеткіші|1',
    'Қозғалтқыш қызып кетсе, не істеу керек?|Тоқтап, қозғалтқышты өшіріп, суығанша күту|Жылдамдату|Қақпағын қызған кезде ашу|Бірден суық су құю|1',
    'ABS бар көлікте тежегіш педалін қалай басу керек?|Тоқтағанша үздіксіз әрі қатты басып ұстау|Бірнеше рет жеңіл басу|Аяқты алып қою|Қол тежегішін тарту|1',
    'Бағдаршам істемей тұрса, қиылыс қалай өтіледі?|Реттелмейтін қиылыс ретінде|Тоқтамай|Қозғалысқа тыйым|Тек оңға бұрылып|1',
    'Көлікті тұраққа қойғанда не істеу керек?|Қол тежегішін тартып, көлікті құлыптау|Есікті ашық қалдыру|Қозғалтқышты қосулы қалдыру|Кілтті ішінде қалдыру|1',
    'Сізді озып бара жатқан көлікке қалай әрекет ету керек?|Жылдамдықты арттырмай, кедергі жасамау|Жылдамдату|Оң жаққа тарту|Тоқтау|1',
    'Оқиға орнында зардап шегушіге не істеу керек?|Қажетсіз қозғамай, жедел жәрдем шақыру|Тез көліктен суырып алу|Су ішкізу|Жылжыту|1',
    'Автомагистральда тоқтауға бола ма?|Тек арнайы белгіленген орындарда|Кез келген жерде|Түнде|Қысқа уақытқа кез келген жерде|1',
    'Оңға бұрылар алдында көлік қай жолақта болуы керек?|Оң жақ шеткі жолақта|Сол жақ жолақта|Қарсы жолақта|Кез келген жолақта|1',
    'Тар жерде кедергі жағындағы көлік не істеуі керек?|Жол беруі керек|Жылдамдауы керек|Дыбыстық белгі беруі керек|Тоқтамауы керек|1',
    'Үзік бөлгіш сызықты қашан кесіп өтуге болады?|Қауіпсіз болса, ережеге сай|Тыйым салынған|Тек түнде|Тек жылдам жүргенде|1',
    'Көлікті тоқтату сигналын кім бере алады?|Жол полициясының қызметкері|Кез келген жүргізуші|Жаяу жүргінші|Жолаушы|1',
  ],
];
const parseQ = (s) => { const p = s.split('|'); const a = Number(p.pop()) - 1; const q = p.shift(); return { q, o: p, a, e: '' }; };
const QUIZ_VARIANTS = QV_RAW.map((arr, i) => (i === 0 ? [...QUIZ_BASE, ...arr.map(parseQ)] : arr.map(parseQ)));
const shuffle = (arr) => arr.map((x) => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
const variantBest = (acc, v) => (acc.tests || []).filter((t) => t.v === v).reduce((b, t) => Math.max(b, pct(t.score, t.total)), -1);

// Қайта тапсырғанда соңғысынан өзгеше, ең аз тапсырылған нұсқаны береді
function pickVariant(acc) {
  const tests = acc.tests || [];
  const last = tests.length ? tests[tests.length - 1].v : 0;
  const cnt = QUIZ_VARIANTS.map((_, i) => tests.filter((t) => t.v === i + 1).length);
  let cand = QUIZ_VARIANTS.map((_, i) => i + 1).filter((v) => v !== last);
  const min = Math.min(...cand.map((v) => cnt[v - 1]));
  cand = cand.filter((v) => cnt[v - 1] === min);
  return cand[Math.floor(Math.random() * cand.length)];
}
function buildQuizItems(v) {
  return shuffle(QUIZ_VARIANTS[v - 1]).map((q) => {
    const idx = shuffle(q.o.map((_, i) => i));
    return { q: q.q, o: idx.map((i) => q.o[i]), a: idx.indexOf(q.a), e: q.e };
  });
}

function quizPage(acc) {
  const hist = [...acc.tests].reverse();
  if (!quizState) {
    return `<section class="pub-section cabinet">
      <div class="cab-head"><div><p class="pub-eyebrow">Емтиханға дайындық</p><h2>Жол ережелері бойынша тест</h2>
        <p class="muted">${QUIZ_VARIANTS.length} нұсқа · әрқайсысында ${QUIZ_VARIANTS[0].length} сұрақ · «Қайта тапсыру» басқан сайын жаңа нұсқа беріледі · сұрақтар мен жауаптар араласады. Өту шегі — ${PASS_SCORE}%.</p></div></div>
      <div class="cab-cols">
        <div class="card quiz-intro">
          <div class="big-score ${acc.tests.length && bestTest(acc) >= PASS_SCORE ? 'ok' : ''}">${acc.tests.length ? bestTest(acc) + '%' : '—'}</div>
          <p class="muted">Ең жақсы нәтижеңіз</p>
          <button class="btn primary" data-pa="quizStart" data-id="auto">${icon('play')} Тестті бастау (жаңа нұсқа)</button>
          <p class="muted small" style="margin:6px 0 0">Немесе нұсқаны өзіңіз таңдаңыз:</p>
          <div class="vgrid">${QUIZ_VARIANTS.map((_, i) => { const b = variantBest(acc, i + 1); return `<button class="btn" data-pa="quizStart" data-id="${i + 1}"><b>${i + 1}-нұсқа</b><small>${b >= 0 ? 'ең жақсы: ' + b + '%' : 'тапсырылмаған'}</small></button>`; }).join('')}</div>
          <button class="btn" data-pa="page" data-id="theory">${icon('book')} Алдымен теорияны қарау</button>
        </div>
        <div class="card"><h3>Тапсыру тарихы</h3>
          ${hist.length ? `<ul class="mini-list">${hist.slice(0, 10).map((t) => `<li><span>${timeStr(t.ts)}${t.v ? ` · ${t.v}-нұсқа` : ''}</span>${pill(`${t.score} / ${t.total} · ${pct(t.score, t.total)}%`, pct(t.score, t.total) >= PASS_SCORE ? 's-done' : 's-fail')}</li>`).join('')}</ul>` : '<p class="muted small">Әлі тапсырылмаған.</p>'}
        </div>
      </div>
    </section>`;
  }
  const qs = quizState.items;
  if (!quizState.done) {
    return `<section class="pub-section cabinet">
      <div class="cab-head"><div><p class="pub-eyebrow">${quizState.v}-нұсқа</p><h2>Әр сұраққа бір жауапты таңдаңыз</h2></div>
        <div class="cab-actions"><span class="pill s-theory" id="quizCount">Жауап берілді: 0 / ${qs.length}</span><button class="btn small" data-pa="quizCancel">Тоқтату</button></div></div>
      <form id="quizForm" class="quiz" novalidate>
        ${qs.map((q, k) => `<fieldset class="card q">
          <legend><span class="q-no">${k + 1}</span>${esc(q.q)}</legend>
          ${q.o.map((o, j) => `<label class="opt"><input type="radio" name="q${k}" value="${j}"> <span>${esc(o)}</span></label>`).join('')}
        </fieldset>`).join('')}
        <p class="form-error" id="quizError"></p>
        <button type="submit" class="btn primary wide">${icon('check')} Тестті аяқтау</button>
      </form>
    </section>`;
  }
  const score = quizState.score;
  const p = pct(score, qs.length);
  return `<section class="pub-section cabinet">
    <div class="card quiz-result ${p >= PASS_SCORE ? 'ok' : 'bad'}">
      <div class="big-score">${p}%</div>
      <div class="grow"><h2>${p >= PASS_SCORE ? 'Жарайсыз! Тест тапсырылды' : 'Тағы дайындалу керек'} · ${quizState.v}-нұсқа</h2>
        <p>${score} / ${qs.length} дұрыс жауап. ${p >= PASS_SCORE ? 'Ішкі теориялық емтиханға дайынсыз.' : `Өту шегі — ${PASS_SCORE}%. Қате жауаптарды қарап, бейнесабақтарды қайталаңыз.`}</p></div>
      <div class="cab-actions"><button class="btn primary" data-pa="quizStart" data-id="auto">Қайта тапсыру (жаңа нұсқа)</button><button class="btn" data-pa="quizCancel">Нұсқаларға оралу</button><button class="btn" data-pa="page" data-id="theory">Теорияға оралу</button></div>
    </div>
    <div class="quiz">${qs.map((q, k) => {
      const ans = quizState.answers[k];
      return `<div class="card q ${ans === q.a ? 'q-ok' : 'q-bad'}">
        <p class="q-title"><span class="q-no">${k + 1}</span>${esc(q.q)}</p>
        ${q.o.map((o, j) => `<div class="opt ${j === q.a ? 'correct' : j === ans ? 'chosen' : ''}">${j === q.a ? icon('check') : j === ans ? icon('close') : '<i></i>'}<span>${esc(o)}</span></div>`).join('')}
        ${q.e ? `<p class="q-exp">${esc(q.e)}</p>` : ''}
      </div>`;
    }).join('')}</div>
  </section>`;
}

function submitQuiz(form) {
  const items = quizState.items;
  const fd = new FormData(form);
  const answers = items.map((_, k) => (fd.get(`q${k}`) === null ? null : Number(fd.get(`q${k}`))));
  const left = answers.filter((a) => a === null).length;
  if (left) { $('#quizError').textContent = `Барлық сұраққа жауап беріңіз (тағы ${left} сұрақ қалды)`; return; }
  const score = answers.filter((a, k) => a === items[k].a).length;
  db = load();
  const acc = currentAccount();
  acc.tests.push({ ts: Date.now(), score, total: items.length, v: quizState.v });
  logAct(`Оқушы тест тапсырды: ${acc.name} — ${quizState.v}-нұсқа, ${score}/${items.length}`);
  save();
  quizState = { ...quizState, answers, score, done: true };
  render();
  window.scrollTo(0, 0);
  toast(`Нәтиже: ${score} / ${items.length} (${pct(score, items.length)}%)`);
}

// ---------- Профиль ----------
function profilePage(acc) {
  const st = acc.studentId ? byId('students', acc.studentId) : null;
  const lead = !st && acc.leadId ? byId('leads', acc.leadId) : null;
  const ins = st ? byId('instructors', st.instructorId) : null;
  const rows = st
    ? [['Аты-жөні', st.name], ['Email', acc.email], ['Телефон', st.phone], ['Санат', `${st.category} — ${CAT_INFO[st.category]?.name || ''}`], ['Нұсқаушы', instructorName(st.instructorId)], ['Оқу басталды', fullDate(st.startDate)], ['Кезең', st.status]]
    : [['Аты-жөні', acc.name], ['Email', acc.email], ['Телефон', lead ? lead.phone : '—'], ['Өтінім күйі', lead ? lead.status : '—']];
  return `<section class="pub-section cabinet">
    <div class="cab-head"><div><p class="pub-eyebrow">Баптаулар</p><h2>${esc(acc.name)}</h2><p class="muted">${esc(acc.email)}</p></div>
      <div class="cab-actions"><button class="btn" data-pa="chat">${icon('chat')} Деректерді өзгертуді сұрау</button></div></div>
    <div class="cab-cols">
      <div class="card"><h3>Менің нұсқаушым</h3>
        ${ins ? `<div class="inst-top"><div class="avatar">${esc(initials(ins.name))}</div><div class="grow"><b>${esc(ins.name)}</b><span>${ins.experience} жыл тәжірибе · ${ins.categories.join(', ')}</span></div>${waBtn(ins.phone, `Сәлеметсіз бе, ${ins.name}! Мен сіздің оқушыңыз ${st.name}.`)}</div>
          <p class="small muted" style="margin:12px 0 0">${(ins.carIds || []).map((cid) => esc(carLabel(cid))).join('<br>') || ''}</p>` : '<p class="muted small">Нұсқаушы бекітілмеген.</p>'}
      </div>
      <div class="card"><h3>Менің деректерім</h3>
        <div class="info">${rows.map(([k, v]) => `<div><span>${k}</span><b>${esc(v)}</b></div>`).join('')}</div>
      </div>
      <div class="card"><h3>Құпиясөзді өзгерту</h3>
        <form id="passForm" class="auth-form" novalidate>
          <div class="field"><label for="pw_old">Қазіргі құпиясөз</label><input class="input" id="pw_old" name="old" type="password" autocomplete="current-password"></div>
          <div class="field"><label for="pw_new">Жаңа құпиясөз</label><input class="input" id="pw_new" name="pass" type="password" autocomplete="new-password" placeholder="кемінде 6 таңба"></div>
          <div class="field"><label for="pw_new2">Жаңа құпиясөзді қайталаңыз</label><input class="input" id="pw_new2" name="pass2" type="password" autocomplete="new-password"></div>
          <p class="form-error" id="passError"></p>
          <button type="submit" class="btn primary">Сақтау</button>
        </form>
      </div>
      <div class="card"><h3>Жетістіктерім</h3>
        <div class="profile-grid two-col">
          <div class="mini"><span>Теория</span><b>${watchedCount(acc)} / ${db.theory.length}</b>${meter(watchedCount(acc), db.theory.length, 'blue')}</div></div>
          <div class="mini"><span>Тест (ең жақсы)</span><b>${acc.tests.length ? bestTest(acc) + '%' : '—'}</b><small>${acc.tests.length} рет тапсырылды</small></div>
          ${st ? `<div class="mini"><span>Практика</span><b>${practiceDone(st.id)} / ${practiceReq(st)}</b>${meter(practiceDone(st.id), practiceReq(st), 'blue')}</div></div>
          <div class="mini"><span>Оқу ақысы</span><b>${pct(paidBy(st.id), priceOf(st))}%</b>${meter(paidBy(st.id), priceOf(st))}</div></div>` : ''}
        </div>
      </div>
      <div class="card"><h3>Жүктеп алу</h3>
        <p class="muted small">Сабақтарыңызды телефон күнтізбесіне қосыңыз немесе өз деректеріңіздің көшірмесін алыңыз.</p>
        <div class="data-actions">
          ${st ? `<button class="btn" data-pa="ics">${icon('calendar')} Сабақтарды күнтізбеге қосу (.ics)</button>` : ''}
          <button class="btn" data-pa="myData">${icon('download')} Менің деректерім (JSON)</button>
        </div>
      </div>
    </div>
  </section>`;
}

function changePassword(form) {
  const fd = new FormData(form);
  db = load();
  const acc = currentAccount();
  if (hashPass(String(fd.get('old') || '')) !== acc.pass) return 'Қазіргі құпиясөз қате';
  const p1 = String(fd.get('pass') || '');
  if (p1.length < 6) return 'Жаңа құпиясөз кемінде 6 таңбадан тұруы керек';
  if (p1 !== String(fd.get('pass2') || '')) return 'Жаңа құпиясөздер сәйкес емес';
  acc.pass = hashPass(p1);
  logAct(`Құпиясөз өзгертілді: ${acc.email}`);
  save(); render(); toast('Құпиясөз өзгертілді');
  return '';
}

// Алдағы сабақтарды күнтізбеге (.ics) экспорттау
function exportIcs() {
  const st = myStudent();
  if (!st) return;
  const ls = db.lessons.filter((l) => l.studentId === st.id && !l.done && l.date >= TODAY).sort(byDateTime);
  if (!ls.length) return toast('Алдағы сабақ жоқ');
  const stamp = (date, time, plusMin = 0) => {
    const [h, m] = time.split(':').map(Number);
    const total = h * 60 + m + plusMin;
    return `${date.replace(/-/g, '')}T${pad(Math.floor(total / 60))}${pad(total % 60)}00`;
  };
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AutoMektep//KK', 'CALSCALE:GREGORIAN'];
  ls.forEach((l) => lines.push('BEGIN:VEVENT', `UID:${l.id}@automektep`, `DTSTAMP:${stamp(TODAY, '00:00')}`,
    `DTSTART:${stamp(l.date, l.time)}`, `DTEND:${stamp(l.date, l.time, 90)}`,
    `SUMMARY:${db.settings.schoolName}: ${l.type.toLowerCase()} сабағы`,
    `DESCRIPTION:Нұсқаушы: ${instructorName(l.instructorId)}${l.carId ? '. Көлік: ' + carLabel(l.carId) : ''}`,
    `LOCATION:${db.settings.city}`, 'END:VEVENT'));
  lines.push('END:VCALENDAR');
  downloadFile('automektep-sabaqtar.ics', lines.join('\r\n'), 'text/calendar;charset=utf-8');
  toast(`${ls.length} сабақ күнтізбе файлына сақталды`);
}

function myStudent() {
  const acc = currentAccount();
  return acc && acc.studentId ? byId('students', acc.studentId) : null;
}

function selfBookForm() {
  const st = myStudent();
  if (!st) return;
  const ins = byId('instructors', st.instructorId);
  const busy = db.lessons.filter((l) => l.instructorId === st.instructorId && l.date >= TODAY && l.date <= addDays(6)).sort(byDateTime)
    .map((l) => `${prettyDate(l.date)} ${l.time}`);
  openForm({
    title: 'Сабаққа жазылу',
    message: `Нұсқаушыңыз: ${ins ? ins.name : '—'}. Алдағы 7 күндегі бос емес уақыттар: ${busy.join(', ') || 'жоқ'}.`,
    values: { date: addDays(1), time: '10:30', type: st.status === 'Теория' ? 'Теория' : 'Практика' },
    fields: [
      { name: 'date', label: 'Күні', type: 'date', required: true },
      { name: 'time', label: 'Уақыты', type: 'select', options: list(SLOTS) },
      { name: 'type', label: 'Сабақ түрі', type: 'select', options: list(LESSON_TYPES), full: true },
      { name: 'note', label: 'Нұсқаушыға ескерту (міндетті емес)', type: 'textarea', full: true },
    ],
    submitText: 'Жазылу',
    onSubmit: (d) => {
      db = load();
      if (!d.date) return 'Күнін көрсетіңіз';
      if (d.date < TODAY) return 'Өткен күнге жазылуға болмайды';
      if (d.date > addDays(30)) return 'Сабаққа ең көбі 30 күн алдын ала жазылуға болады';
      const r = bookLesson({ studentId: st.id, instructorId: '', date: d.date, time: d.time, type: d.type, note: ['Оқушы кабинеттен жазылды', d.note].filter(Boolean).join('. ') });
      if (r.err) return r.err;
      notifyAdmin(currentAccount().id, `Сабаққа жазылдым: ${prettyDate(d.date)}, ${d.time} (${d.type.toLowerCase()}).${d.note ? ' Ескерту: ' + d.note : ''}`);
      toast(`Сіз ${prettyDate(d.date)}, ${d.time} сабағына жазылдыңыз`);
    },
  });
}

const pubActions = {
  // Тек көрініп тұрған бет ішінен іздейміз (жасырын бетте де бірдей id болуы мүмкін)
  scroll: (id) => {
    const root = authView.hidden ? portalView : authView;
    const el = root.querySelector(`#${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },
  page: (id) => { portalPage = id; render(); window.scrollTo(0, 0); },
  tab: (id) => {
    authTab = id;
    const box = $('#auth');
    if (!box) { render(); return; }
    box.innerHTML = authCard(id);
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const first = box.querySelector('input');
    if (first) first.focus({ preventScroll: true });
  },
  choose: (c) => { regCat = c; pubActions.tab('register'); },
  fill: (role) => {
    const demo = role === 'admin' ? ['admin@automektep.test', 'Admin2026!'] : ['aliya@automektep.test', 'Student2026!'];
    $('#lg_email').value = demo[0];
    $('#lg_pass').value = demo[1];
  },
  logout: () => logout(),
  chat: () => openChat(),
  video: (id) => openVideo(id),
  watch: (id) => actions.markWatched(id),
  receipt: (id) => { const st = myStudent(); const p = byId('payments', id); if (st && p && p.studentId === st.id) receipt(id); },
  ics: () => exportIcs(),
  myData: () => {
    const acc = currentAccount();
    const st = myStudent();
    const data = {
      account: { name: acc.name, email: acc.email, watched: acc.watched, tests: acc.tests },
      student: st || null,
      lessons: st ? db.lessons.filter((l) => l.studentId === st.id) : [],
      payments: st ? db.payments.filter((p) => p.studentId === st.id) : [],
      exams: st ? db.exams.filter((e) => e.studentId === st.id) : [],
      messages: db.messages.filter((m) => m.accountId === acc.id),
    };
    downloadFile(`menin-derekterim-${TODAY}.json`, JSON.stringify(data, null, 2), 'application/json');
    toast('Деректеріңіз файлға сақталды');
  },
  quizStart: (id) => {
    const acc = currentAccount();
    const v = Number(id) >= 1 && Number(id) <= QUIZ_VARIANTS.length ? Number(id) : pickVariant(acc);
    quizState = { v, items: buildQuizItems(v), answers: [], done: false, score: 0 };
    portalPage = 'quiz';
    render();
    window.scrollTo(0, 0);
  },
  quizCancel: () => { quizState = null; render(); },
  theme: () => { applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); render(); },
  book: () => selfBookForm(),
  // Оқушы төлегенін хабарлайды → әкімшінің «Хабарламалар» бөліміне растауға түседі
  payinfo: () => {
    const st = myStudent();
    const acc = currentAccount();
    if (!st || !acc) return;
    if (myPending(acc)) return toast(`Алдыңғы ${money(myPending(acc))} төлеміңіз әкімшінің растауын күтуде`);
    openForm({
      title: 'Төлегенімді хабарлау',
      message: `Қалдық: ${money(debtOf(st))}. Төлемді Kaspi арқылы немесе мектеп кеңсесінде жасап, осы жерде хабарлаңыз. Әкімші растағаннан кейін төлем кабинетте көрінеді.`,
      values: { amount: debtOf(st), method: 'Kaspi' },
      fields: [
        { name: 'amount', label: 'Төленген сома (₸)', type: 'number', min: 1, step: 1, required: true },
        { name: 'method', label: 'Төлем тәсілі', type: 'select', options: list(METHODS) },
        { name: 'note', label: 'Ескерту (міндетті емес)', type: 'textarea', full: true, placeholder: 'мысалы, Kaspi чегінің нөмірі' },
      ],
      submitText: 'Әкімшіге жіберу',
      onSubmit: (d) => {
        db = load();
        const fresh = byId('students', st.id);
        if (!(d.amount > 0)) return 'Соманы дұрыс енгізіңіз';
        if (d.amount > debtOf(fresh)) return `Сома қалдықтан көп. Қалдық: ${money(debtOf(fresh))}`;
        db.messages.push({ id: uid('m'), accountId: acc.id, from: 'student', kind: 'payment', text: d.note || 'Оқу ақысын төледім', amount: d.amount, method: d.method, status: 'pending', ts: Date.now(), read: false });
        logAct(`Оқушы төлем хабарлады: ${fresh.name} — ${money(d.amount)}`);
        toast('Төлем туралы хабар әкімшіге жіберілді. Растауды күтіңіз');
      },
    });
  },
  cancel: (id) => {
    const st = myStudent();
    const l = byId('lessons', id);
    if (!st || !l || l.studentId !== st.id) return;
    openConfirm(`${prettyDate(l.date)}, ${l.time} сабағынан бас тарту керек пе?`, () => {
      db.lessons = db.lessons.filter((x) => x.id !== id);
      logAct(`Оқушы сабақтан бас тартты: ${st.name} — ${prettyDate(l.date)}, ${l.time}`);
      notifyAdmin(currentAccount().id, `Сабақтан бас тарттым: ${prettyDate(l.date)}, ${l.time} (${l.type.toLowerCase()}).`);
    }, 'Сабақ кестеден алынды', 'Иә, бас тарту');
  },
};

[authView, portalView].forEach((root) => {
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pa]');
    if (b && pubActions[b.dataset.pa]) { e.preventDefault(); pubActions[b.dataset.pa](b.dataset.id); }
  });
  root.addEventListener('change', (e) => {
    if (e.target.id === 'calcCat' || e.target.id === 'calcMonths') {
      $('#calcOut').innerHTML = calcText($('#calcCat').value, Number($('#calcMonths').value));
    }
    if (e.target.closest('#quizForm')) {
      const n = new Set([...e.target.closest('#quizForm').querySelectorAll('input:checked')].map((i) => i.name)).size;
      $('#quizCount').textContent = `Жауап берілді: ${n} / ${quizState.items.length}`;
      e.target.closest('fieldset').classList.add('answered');
    }
  });
  root.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.id === 'loginForm') { const err = doLogin(e.target); if (err) $('#loginError').textContent = err; }
    if (e.target.id === 'registerForm') { const err = doRegister(e.target); if (err) $('#registerError').textContent = err; }
    if (e.target.id === 'msgForm') sendStudentMessage(e.target);
    if (e.target.id === 'quizForm') submitQuiz(e.target);
    if (e.target.id === 'passForm') { const err = changePassword(e.target); if (err) $('#passError').textContent = err; }
  });
});
$('#logoutBtn').addEventListener('click', () => logout());

// =====================================================================
// 23. ТІРІ ЧАТ: ӘКІМШІ ↔ ОҚУШЫ (сайттың кез келген бетінде)
// Хабарламалар ортақ db.messages тізімінде. Басқа қойындыда/терезеде жазылған
// хабарлама 'storage' оқиғасы арқылы бірден көрінеді.
// =====================================================================
const chatW = $('#chatWidget');
let chatOpen = false;
let chatThread = null; // әкімші үшін: таңдалған оқушы аккаунты

function chatThreads() {
  return db.accounts.filter((a) => a.role === 'student').map((a) => {
    const msgs = db.messages.filter((m) => m.accountId === a.id);
    return { a, last: msgs.reduce((x, m) => Math.max(x, m.ts), 0), unread: msgs.filter((m) => m.from === 'student' && !m.read).length };
  }).sort((x, y) => (y.unread - x.unread) || (y.last - x.last));
}

function openChat(accountId) {
  chatOpen = true;
  if (accountId) chatThread = accountId;
  renderChat();
  const t = $('#chatText');
  if (t) t.focus();
}

function renderChat() {
  if (!chatW) return;
  const acc = currentAccount();
  if (!acc) { chatW.innerHTML = ''; return; }
  const isAdmin = acc.role === 'admin';
  // Жазылып жатқан мәтінді сақтап қаламыз (қайта салғанда жоғалмауы үшін)
  const draftEl = $('#chatText');
  const draft = draftEl ? draftEl.value : '';
  const hadFocus = document.activeElement === draftEl;
  let threadId = acc.id;
  let headHtml;
  if (isAdmin) {
    const threads = chatThreads();
    if (!chatThread || !threads.some((t) => t.a.id === chatThread)) chatThread = threads[0]?.a.id || null;
    threadId = chatThread;
    const st = threadId && byId('accounts', threadId)?.studentId ? byId('students', byId('accounts', threadId).studentId) : null;
    headHtml = threads.length ? `
      <div class="chat-title"><b>Оқушылармен чат</b><span>${threads.length} оқушы аккаунты</span></div>
      <select class="input chat-pick" id="chatPick" aria-label="Оқушыны таңдау">
        ${threads.map((t) => `<option value="${t.a.id}" ${t.a.id === threadId ? 'selected' : ''}>${esc(t.a.name)}${t.unread ? ` (${t.unread} жаңа)` : ''}</option>`).join('')}
      </select>
      ${st ? `<small class="chat-sub">${st.category} санаты · ${st.status} · қалдық ${money(debtOf(st))}</small>` : '<small class="chat-sub">Әзірге өтінім (оқушы емес)</small>'}`
      : '<div class="chat-title"><b>Оқушылармен чат</b><span>Оқушы аккаунты әлі жоқ</span></div>';
  } else {
    headHtml = `<div class="chat-title with-ava"><span class="avatar">${icon('wheel')}</span>
      <div><b>${esc(db.settings.schoolName)} әкімшісі</b><span>${WORK_HOURS}</span></div></div>`;
  }
  const msgs = threadId ? db.messages.filter((m) => m.accountId === threadId).sort((a, b) => a.ts - b.ts) : [];
  // Ашық чаттағы қарсы жақтың хабарламалары оқылды деп белгіленеді
  let changed = false;
  if (chatOpen && threadId) {
    msgs.forEach((m) => {
      const fromOther = isAdmin ? m.from === 'student' : m.from === 'admin';
      if (fromOther && !m.read) { m.read = true; changed = true; }
    });
  }
  if (changed) { save(); if (isAdmin) renderNav(); }
  const unread = isAdmin ? unreadForAdmin() : unreadForAccount(acc.id);
  chatW.innerHTML = `
    ${chatOpen ? `<div class="chat-panel" role="dialog" aria-label="Чат">
      <div class="chat-head">${headHtml}<button class="icon-btn" data-chat="close" aria-label="Чатты жабу">${icon('close')}</button></div>
      <div class="chat-body" id="chatBody">${msgs.length ? msgs.map((m) => msgBubble(m, isAdmin ? 'admin' : 'student')).join('')
        : `<p class="chat-empty">${isAdmin ? 'Бұл оқушымен әлі хат алмаспадыңыз.' : 'Сәлеметсіз бе! Сұрағыңызды жазыңыз — әкімші осы чатта жауап береді.'}</p>`}</div>
      ${threadId ? `<form class="chat-input" id="chatForm" novalidate>
        <textarea class="input" id="chatText" rows="1" placeholder="Хабарлама жазыңыз…" aria-label="Хабарлама"></textarea>
        <button class="btn primary" type="submit" aria-label="Жіберу">${icon('send')}</button>
      </form>
      ${isAdmin ? '' : `<div class="chat-quick">${['Сабақ уақытын ауыстырғым келеді', 'Төлем туралы сұрақ', 'Емтихан қашан?'].map((q) => `<button type="button" data-chat="quick">${q}</button>`).join('')}</div>`}` : ''}
    </div>` : ''}
    <button class="chat-fab ${chatOpen ? 'open' : ''}" data-chat="toggle" aria-label="${chatOpen ? 'Чатты жабу' : 'Чатты ашу'}">
      ${icon(chatOpen ? 'close' : 'chat')}${!chatOpen ? '<span>Чат</span>' : ''}${unread && !chatOpen ? `<em class="badge">${unread}</em>` : ''}
    </button>`;
  const body = $('#chatBody');
  if (body) body.scrollTop = body.scrollHeight;
  const t = $('#chatText');
  if (t) { t.value = draft; if (hadFocus) t.focus(); }
}

function sendChat() {
  const t = $('#chatText');
  const text = (t ? t.value : '').trim();
  if (!text) return;
  db = load();
  const acc = currentAccount();
  if (!acc) return;
  const isAdmin = acc.role === 'admin';
  const target = isAdmin ? chatThread : acc.id;
  if (!target) return;
  db.messages.push({ id: uid('m'), accountId: target, from: isAdmin ? 'admin' : 'student', kind: 'text', text, ts: Date.now(), read: false });
  if (isAdmin) logAct(`Чат: оқушыға жауап — ${byId('accounts', target)?.name || ''}`);
  save();
  t.value = '';
  // Әкімшінің «Хабарламалар» беті ашық болса — оны да жаңартамыз
  if (isAdmin && view === 'inbox') renderAdmin();
  if (isAdmin) renderNav();
  renderChat();
  const nt = $('#chatText');
  if (nt) nt.focus();
}

chatW.addEventListener('click', (e) => {
  const b = e.target.closest('[data-chat]');
  if (b) {
    const k = b.dataset.chat;
    if (k === 'toggle') { chatOpen = !chatOpen; renderChat(); if (chatOpen) $('#chatText')?.focus(); }
    if (k === 'close') { chatOpen = false; renderChat(); }
    if (k === 'quick') { const t = $('#chatText'); t.value = b.textContent; t.focus(); }
    return;
  }
  // Чаттағы «Растау» / «Қабылдамау» батырмалары (төлем хабарламасы)
  const a = e.target.closest('[data-action]');
  if (a && actions[a.dataset.action]) actions[a.dataset.action](a.dataset.id);
});
chatW.addEventListener('change', (e) => {
  if (e.target.id === 'chatPick') { chatThread = e.target.value; renderChat(); }
});
chatW.addEventListener('submit', (e) => { e.preventDefault(); sendChat(); });
chatW.addEventListener('keydown', (e) => {
  if (e.target.id === 'chatText' && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
});

// =====================================================================
// 21. ІСКЕ ҚОСУ
// =====================================================================

export function mount() {
  if (window.__automektepMounted) return;
  window.__automektepMounted = true;
  try {
    let savedTheme = null;
    try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) { /* елемейміз */ }
    // Сақталған таңдау болмаса — жүйелік тақырыпты құрметтейміз
    if (!savedTheme) savedTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(savedTheme);
    const todayEl = $('#today');
    if (todayEl) todayEl.textContent = `${weekday(TODAY)}, ${fullDate(TODAY)}`;
    render();
  } catch (e) {
    console.error('[AutoMektep] init failed', e);
  }
}
export {};
