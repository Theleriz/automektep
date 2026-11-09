'use client';

import { useEffect, useState } from 'react';

/**
 * Бүкіл интерфейсті (лендинг, әкімші панелі, оқушы кабинеті) қосатын қабыршақ.
 *
 * Ескі код таза статикалық JS (localStorage, innerHTML) болғандықтан, ол
 * `legacy/app.js` ішінде сақталған және тек браузерде, орнатудан кейін
 * шақырылады. Сол себепті бірінші HTML бірден боялады, JS келгенде интерфейс
 * толық интерактивті болады.
 */
export default function LegacyApp() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import('@/legacy/app.js')
      .then((mod) => {
        if (cancelled) return;
        // Статикалық (SEO) лендингті алып тастаймыз — оның орнын толық интерфейс алады
        document.querySelector('[data-am-static]')?.remove();
        document.getElementById('amBoot')?.remove();
        (mod as { mount: () => void }).mount();
        document.getElementById('amBoot')?.remove();
      })
      .catch((e) => {
        console.error('[AutoMektep] app.js жүктелмеді', e);
        setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!error) return null;

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        inset: 'auto 16px 16px 16px',
        zIndex: 9999,
        background: '#FDECEA',
        color: '#B42318',
        border: '1px solid #F5C2BD',
        borderRadius: 14,
        padding: '14px 16px',
        fontSize: 14,
        boxShadow: '0 8px 24px rgba(16,24,40,.16)',
      }}
    >
      <b>Интерфейс жүктелмеді.</b> Бетті жаңартып көріңіз (Ctrl/Cmd + R). Қате: {error}
    </div>
  );
}
