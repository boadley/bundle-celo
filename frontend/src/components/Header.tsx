import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IoHelpCircleOutline, IoNotificationsOutline, IoPersonCircleOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';

export default function Header() {
  const { isSignedIn, address, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddressClick = async () => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(address);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = address;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      toast.success('Address copied!');
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  const handleProfileClick = () => {
    handleAddressClick();
  };



  return (
    <header className="bg-primary p-4 flex justify-between items-center relative">
      {isSignedIn ? (
        <>
          {/* Left side - Profile and greeting */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleProfileClick}
              className="flex items-center space-x-3 hover:bg-white/5 rounded-lg p-1 transition-colors"
              title="Click to copy wallet address"
            >
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                <IoPersonCircleOutline className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <p className="text-sm text-secondary">Hi,</p>
                <div className="flex items-center space-x-1">
                  <p className="text-white font-medium">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'User'}
                  </p>
                </div>
              </div>
            </button>


          </div>

          {/* Right side - Help, notifications, and logout */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-secondary hover:text-white transition-colors">
              <IoHelpCircleOutline className="w-5 h-5" />
              <span className="text-sm font-medium">HELP</span>
            </button>
            <button className="text-secondary hover:text-white transition-colors">
              <IoNotificationsOutline className="w-6 h-6" />
            </button>
            {!isMobile && (
              <button 
                onClick={logout}
                className="text-sm text-secondary hover:text-white transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl font-bold text-accent">Bundle</div>
        </>
      )}
    </header>
  );
}
