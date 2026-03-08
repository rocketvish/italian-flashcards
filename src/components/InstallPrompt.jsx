import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleBeforeInstall(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setDeferredPrompt(null);
  }

  if (!visible) return null;

  return (
    <div className="install-banner">
      <span className="install-banner-text">Add Parole to your home screen</span>
      <div className="install-banner-actions">
        <button className="btn btn-primary btn-sm" onClick={handleInstall}>Install</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setVisible(false)}>Later</button>
      </div>
    </div>
  );
}
