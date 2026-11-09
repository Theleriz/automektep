/* AutoMektep — әр қабатта бірдей көрінетін негізгі бет (shell).
   Нақты интерфейсті (лендинг + әкімші панелі + оқушы кабинеті) legacy/app.js салады,
   сондықтан статикалық экспорттың алғашқы HTML-і де толық мазмұнды болады. */
import type { Metadata } from 'next';
import LegacyApp from '@/components/LegacyApp';
import StaticLanding from '@/components/StaticLanding';

export const metadata: Metadata = {
  title: { absolute: 'AutoMektep — Алматыдағы автомектеп: A, B, C санаттары' },
};

export default function Page() {
  return (
    <>
      {/* Статикалық мазмұн: SEO және JS өшірулі браузерлер үшін.
          Интерфейс іске қосылғанда LegacyApp бұл блокты жояды. */}
      <StaticLanding />

      {/* Статикалық мазмұн толық болса да, интерфейс іске қосылғанша спиннер көрсетеміз */}
      <div id="amBoot" className="boot" aria-hidden="true" />

      <div id="authView" className="pub" />
      <div id="portalView" className="pub" hidden />

      <div className="app" id="adminApp" hidden>
        <aside className="sidebar" id="sidebar">
          <div className="brand">
            <div className="brand-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="2.5" />
                <path d="M3.5 10.5h6M14.5 10.5h6M12 14.5V21" />
              </svg>
            </div>
            <div>
              <div className="brand-name" id="brandName">AutoMektep</div>
              <div className="brand-sub">Автомектепті басқару жүйесі</div>
            </div>
          </div>
          <nav className="nav" id="nav" />
          <div className="sidebar-foot">
            <span className="version">Нұсқа 3.0</span>
            <p>Деректер браузер жадында (localStorage) сақталады.</p>
          </div>
        </aside>

        <div className="scrim" id="scrim" />

        <div className="main">
          <header className="topbar">
            <button className="icon-btn menu-btn" id="menuBtn" aria-label="Мәзір">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 id="viewTitle">Басқару тақтасы</h1>
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                className="input"
                id="globalSearch"
                type="search"
                placeholder="Оқушы, өтінім, көлік іздеу…  ( / )"
                autoComplete="off"
              />
              <div className="search-results" id="searchResults" hidden />
            </div>
            <button className="icon-btn" id="themeBtn" title="Жарық / қараңғы тақырып" aria-label="Тақырыпты ауыстыру" />
            <div className="topbar-date" id="today" />
            <span className="user-chip" id="userChip" />
            <button className="icon-btn" id="logoutBtn" title="Жүйеден шығу" aria-label="Жүйеден шығу">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </header>
          <main id="content" />
        </div>
      </div>

      <div className="modal-backdrop" id="modal" hidden>
        <div className="modal" id="modalBox" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div className="modal-head">
            <h2 id="modalTitle" />
            <button type="button" className="icon-btn" data-close aria-label="Жабу">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <form id="modalForm" noValidate />
        </div>
      </div>

      <input type="file" id="importFile" accept=".json,application/json" hidden />
      <div id="chatWidget" />
      <div className="toast" id="toast" role="status" />

      <LegacyApp />
    </>
  );
}
