/* Статикалық (pre-render) лендинг.
   JS жүктелмей тұрғанда да, іздеу жүйелері үшін де толық мазмұн көрінеді.
   `data-am-static` — интерфейс толық іске қосылғанда осы блок жойылады
   (legacy/app.js → mount()). */
import { CATEGORIES, FAQ, INSTRUCTORS, SITE, STEPS, money } from '@/content/site';

const Icon = ({ d, ...rest }: { d: string } & React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
    dangerouslySetInnerHTML={{ __html: d }}
  />
);

const ICON = {
  wheel: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M3.5 10.5h6M14.5 10.5h6M12 14.5V21"/>',
  check: '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chat: '<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12Z"/>',
  car: '<path d="M5 18H3v-5l2.2-5.2A2 2 0 0 1 7 6.5h10a2 2 0 0 1 1.8 1.3L21 13v5h-2"/><path d="M3 13h18"/><circle cx="7.5" cy="18" r="2"/><circle cx="16.5" cy="18" r="2"/><path d="M9.5 18h5"/>',
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0] || '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function StaticLanding() {
  return (
    <div className="pub" data-am-static>
      <header className="pub-header">
        <div className="pub-brand">
          <span className="brand-logo">
            <Icon d={ICON.wheel} />
          </span>
          <span>
            <b>{SITE.brand}</b>
            <small>автомектебі</small>
          </span>
        </div>
        <nav className="pub-nav" aria-label="Бөлімдер">
          <a href="#about">Автошкола туралы</a>
          <a href="#prices">Бағалар</a>
          <a href="#steps">Оқу жолы</a>
          <a href="#team">Нұсқаушылар</a>
          <a href="#faq">Сұрақтар</a>
          <a href="#contacts">Байланыс</a>
        </nav>
        <div className="pub-actions">
          <a className="btn small" href="#auth">Кіру</a>
          <a className="btn small primary" href="#prices">Тіркелу</a>
        </div>
      </header>

      <section className="pub-hero" id="top">
        <div className="pub-hero-text">
          <p className="pub-eyebrow light">
            {SITE.city} · {SITE.brand} автомектебі
          </p>
          <h1>Жүргізуші куәлігіне сенімді жол</h1>
          <p className="pub-lead">
            Теория, практика және емтиханға дайындық бір жерде. Сабақ кестесін, төлемдер мен оқу прогресін жеке кабинетте бақылаңыз.
          </p>
          <div className="pub-stats">
            <div>
              <b>31</b>
              <span>түлек</span>
            </div>
            <div>
              <b>97%</b>
              <span>мемлекеттік емтиханнан өтті</span>
            </div>
            <div>
              <b>{INSTRUCTORS.length}</b>
              <span>нұсқаушы</span>
            </div>
            <div>
              <b>23</b>
              <span>оқу көлігі</span>
            </div>
          </div>
        </div>

        <div className="auth-card" id="auth">
          <div className="auth-tabs" aria-hidden="true">
            <span className="on">Кіру</span>
            <span>Тіркелу</span>
          </div>
          <div className="auth-form">
            <h2>Жүйеге кіру</h2>
            <p className="muted small">
              Әкімші басқару жүйесіне, оқушы жеке кабинетке кіреді. Кіру үшін браузерде JavaScript қосулы болуы керек.
            </p>
            <div className="field">
              <label htmlFor="static_email">Email</label>
              <input className="input" id="static_email" type="email" placeholder="name@mail.kz" />
            </div>
            <div className="field">
              <label htmlFor="static_pass">Құпиясөз</label>
              <input className="input" id="static_pass" type="password" />
            </div>
            <a className="btn primary wide" href={SITE.phoneHref}>
              <Icon d={ICON.phone} /> Оқуға жазылу: {SITE.phone}
            </a>
            <div className="demo-box">
              <p className="demo-title">Демо аккаунттар (JavaScript қосулы болса)</p>
              <div className="demo-row">
                <div>
                  <b>Әкімші</b>
                  <span>admin@automektep.test</span>
                  <span>Admin2026!</span>
                </div>
              </div>
              <div className="demo-row">
                <div>
                  <b>Оқушы</b>
                  <span>aliya@automektep.test</span>
                  <span>Student2026!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pub-section" id="about">
        <div className="pub-head">
          <p className="pub-eyebrow">Автошкола туралы</p>
          <h2>{SITE.brand} автомектебі</h2>
          <p>
            {SITE.brand} — {SITE.city} қаласындағы автомектеп. A, B және C санаттары бойынша теориялық және практикалық оқыту:
            тәжірибелі нұсқаушылар, техбайқаудан өткен оқу көліктері, бейнесабақтар, онлайн тесттер және жеке кабинет.
          </p>
        </div>
        <div className="card about-box">
          <div>
            <p className="muted small" style={{ margin: '0 0 4px' }}>
              Байланыс телефоны
            </p>
            <a className="about-phone" href={SITE.phoneHref}>
              {SITE.phone}
            </a>
            <div className="about-meta">
              <span>
                <Icon d={ICON.clock} />
                {SITE.workHours}
              </span>
              <span>
                <Icon d={ICON.pin} />
                {SITE.city}
              </span>
            </div>
          </div>
          <div className="cab-actions">
            <a className="btn primary" href={SITE.phoneHref}>
              <Icon d={ICON.phone} /> Қоңырау шалу
            </a>
            <a className="btn wa" href={SITE.whatsapp} target="_blank" rel="noopener">
              <Icon d={ICON.chat} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="pub-section" id="prices">
        <div className="pub-head">
          <p className="pub-eyebrow">Бағалар</p>
          <h2>Санаттар мен оқу ақысы</h2>
          <p>Баға теориялық курсты, міндетті практикалық сабақтарды және ішкі емтихандарды қамтиды.</p>
        </div>
        <div className="price-grid">
          {CATEGORIES.map((c) => (
            <div className={`price-card ${c.code === 'B' ? 'featured' : ''}`} key={c.code}>
              {c.code === 'B' && <span className="tag">Ең танымал</span>}
              <div className="price-cat">{c.code}</div>
              <h3>{c.name}</h3>
              <p>{c.text}</p>
              <div className="price">{money(c.price)}</div>
              <ul className="ticks">
                <li>
                  <Icon d={ICON.check} /> {c.practice} практикалық сабақ
                </li>
                <li>
                  <Icon d={ICON.check} /> Теориялық курс
                </li>
                <li>
                  <Icon d={ICON.check} /> Ішкі емтихандар
                </li>
                <li>
                  <Icon d={ICON.check} /> Жеке кабинет
                </li>
              </ul>
              <a className={`btn ${c.code === 'B' ? 'primary' : ''}`} href={SITE.phoneHref}>
                Осы санатқа тіркелу
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="pub-section alt" id="steps">
        <div className="pub-head">
          <p className="pub-eyebrow">Оқу жолы</p>
          <h2>Өтінімнен куәлікке дейін — 6 қадам</h2>
        </div>
        <div className="steps">
          {STEPS.map(([title, text], i) => (
            <div className="step" key={title}>
              <span className="step-no">{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pub-section" id="team">
        <div className="pub-head">
          <p className="pub-eyebrow">Команда</p>
          <h2>Біздің нұсқаушылар</h2>
        </div>
        <div className="team">
          {INSTRUCTORS.map((i) => (
            <div className="card team-card" key={i.name}>
              <div className="avatar big">{initials(i.name)}</div>
              <h3>{i.name}</h3>
              <p className="muted small">{i.experience} жыл тәжірибе</p>
              <div className="chips center">
                {i.categories.map((c) => (
                  <span className="chip" key={c}>
                    {c} санаты
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="fleet">
          <h3>
            <Icon d={ICON.car} /> Оқу көліктері
          </h3>
          <div className="chips">
            <span className="chip">Toyota Corolla · B</span>
            <span className="chip">Hyundai Accent · B</span>
            <span className="chip">Kia Rio · B</span>
            <span className="chip">Honda CB500 · A</span>
            <span className="chip">КамАЗ 65115 · C</span>
            <span className="chip">Mercedes-Benz Sprinter · D1</span>
            <span className="chip">Higer KLQ6129 · D</span>
            <span className="chip">МТЗ-82 · Tm</span>
          </div>
        </div>
      </section>

      <section className="pub-section alt" id="faq">
        <div className="pub-head">
          <p className="pub-eyebrow">Сұрақтар</p>
          <h2>Жиі қойылатын сұрақтар</h2>
        </div>
        <div className="faq">
          {FAQ.map(([q, a]) => (
            <details className="faq-item" key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="pub-section" id="contacts">
        <div className="contact card">
          <div>
            <p className="pub-eyebrow">Байланыс</p>
            <h2>Сұрағыңыз бар ма?</h2>
            <ul className="contact-list">
              <li>
                <Icon d={ICON.pin} /> {SITE.city}
              </li>
              <li>
                <Icon d={ICON.phone} /> {SITE.phone}
              </li>
              <li>
                <Icon d={ICON.clock} /> {SITE.workHours}
              </li>
            </ul>
          </div>
          <a className="btn wa" href={SITE.whatsapp} target="_blank" rel="noopener">
            <Icon d={ICON.chat} /> WhatsApp-қа жазу
          </a>
        </div>
      </section>

      <footer className="pub-footer">
        © {SITE.year} {SITE.brand} автомектебі · Оқу жобасы (демо нұсқа)
      </footer>
    </div>
  );
}
