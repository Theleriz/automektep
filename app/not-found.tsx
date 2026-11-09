import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '32px 20px',
        background:
          'radial-gradient(1200px 520px at 12% -8%, rgba(67,97,238,.16), transparent 70%), radial-gradient(900px 420px at 92% 8%, rgba(247,184,1,.18), transparent 70%), var(--bg)',
        color: 'var(--ink)',
        fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 24,
          padding: '36px 32px',
          boxShadow: '0 1px 2px rgba(16,24,40,.05), 0 18px 44px rgba(16,24,40,.10)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            margin: '0 auto 18px',
            borderRadius: 20,
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(135deg,#FFD34E,#F7B801)',
            boxShadow: '0 10px 24px rgba(247,184,1,.35)',
          }}
          aria-hidden
        >
          <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#141C33" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="2.5" />
            <path d="M3.5 10.5h6M14.5 10.5h6M12 14.5V21" />
          </svg>
        </div>
        <p style={{ margin: 0, fontWeight: 800, letterSpacing: '.08em', fontSize: 13, color: 'var(--muted)' }}>404</p>
        <h1 style={{ margin: '6px 0 10px', fontSize: 26, letterSpacing: '-.02em' }}>Бет табылмады</h1>
        <p style={{ margin: '0 0 24px', color: 'var(--muted)', lineHeight: 1.5 }}>
          Сілтеме ескірген болуы мүмкін. Басты бетке оралып, автомектеп туралы ақпаратты, бағаларды немесе жеке кабинетті қараңыз.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            height: 46,
            padding: '0 22px',
            borderRadius: 12,
            background: 'var(--primary)',
            color: '#fff',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 8px 18px rgba(67,97,238,.28)',
          }}
        >
          Басты бетке
        </Link>
      </div>
    </main>
  );
}
