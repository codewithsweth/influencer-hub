import { Youtube } from 'lucide-react';
import { generateAuthUrl } from '../utils/youtube-oauth';

export const ConnectButton = () => {
  const handleConnect = () => {
    console.log('\n[ConnectButton] Connect button clicked');
    console.log('[ConnectButton] Current URL before redirect:', window.location.href);
    console.log('[ConnectButton] localStorage before redirect:', localStorage.getItem('influencer'));

    const authUrl = generateAuthUrl();
    console.log('[ConnectButton] Redirecting to OAuth URL:', authUrl);

    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleConnect}
      className="flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
    >
      <Youtube className="w-6 h-6" />
      Connect YouTube Channel
    </button>
  );
};
