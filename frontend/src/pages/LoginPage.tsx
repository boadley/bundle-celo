import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

function BundleLogo() {
  return (
    <div className="w-20 h-20 mb-12 flex items-center justify-center">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 15 C20 10, 25 5, 35 5 L50 5 C60 5, 65 10, 65 20 C65 25, 62 28, 58 30 C62 32, 65 35, 65 40 C65 50, 60 55, 50 55 L35 55 C25 55, 20 50, 20 40 Z"
          fill="#00F5D4"
          opacity="0.9"
        />
        <path
          d="M15 25 C15 20, 20 15, 30 15 L45 15 C55 15, 60 20, 60 30 C60 35, 57 38, 53 40 C57 42, 60 45, 60 50 C60 60, 55 65, 45 65 L30 65 C20 65, 15 60, 15 50 Z"
          fill="#00F5D4"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

function PWAInstallButton({ onInstall }: { onInstall: () => void }) {
  return (
    <button
      onClick={onInstall}
      className="w-full mb-4 bg-accent text-black font-semibold py-3 px-6 rounded-lg hover:bg-accent/90 transition-colors"
    >
      📱 Install App
    </button>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (isMobile) {
        setShowInstallButton(true);
      }
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
      toast.success('App installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isMobile]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error('Installation not available');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      toast.success('Installing app...');
    } else {
      toast('Installation cancelled');
    }

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
      toast.success('Successfully logged in!');
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';

      if (errorMessage.includes('cancelled')) {
        toast('Login cancelled');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4 text-white">
      <BundleLogo />
      <h2 className="text-2xl font-bold text-white mb-12 text-center max-w-md">
        Spend Crypto on <span className="text-accent">Anything</span> in <span className="text-accent">Nigeria</span>
      </h2>
      <div className="w-full max-w-sm space-y-4">
        {showInstallButton && isMobile && (
          <PWAInstallButton onInstall={handleInstallClick} />
        )}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="btn-primary disabled:opacity-50"
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
}
