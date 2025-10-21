import { useEffect, useState } from 'react';
import { ConnectButton } from './components/ConnectButton';
import { ChannelCard } from './components/ChannelCard';
import { VideoList } from './components/VideoList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PopularVideos } from './components/PopularVideos';
import { DemographicsAnalytics } from './components/DemographicsAnalytics';
import { VideoInDepthAnalytics } from './components/VideoInDepthAnalytics';
import { Influencer } from './types/influencer';
import { parseOAuthCallback, clearOAuthCallback } from './utils/youtube-oauth';
import { fetchChannelData, fetchChannelVideos, fetchPopularVideos, fetchChannelAnalytics, fetchVideoAnalytics } from './utils/youtube-api';
import { Youtube, LogOut } from 'lucide-react';

function App() {
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('=== App Initialization ===');
    console.log('Current URL:', window.location.href);
    console.log('Current hash:', window.location.hash);

    const accessToken = parseOAuthCallback();
    console.log('OAuth access token from callback:', accessToken);

    if (accessToken) {
      console.log('Fresh OAuth token detected - clearing old data and fetching new data');
      localStorage.removeItem('influencer');
      clearOAuthCallback();
      handleOAuthSuccess(accessToken);
    } else {
      console.log('No OAuth token in URL');
      const savedInfluencer = localStorage.getItem('influencer');
      console.log('Checking localStorage:', savedInfluencer);
      if (savedInfluencer) {
        const parsed = JSON.parse(savedInfluencer);
        console.log('Parsed influencer data from localStorage:', parsed);
        setInfluencer(parsed);
      } else {
        console.log('No saved data - showing connect screen');
      }
    }
  }, []);

  const handleOAuthSuccess = async (accessToken: string) => {
    console.log('\n=== OAuth Success Handler ===');
    console.log('Access Token:', accessToken);
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching channel data...');
      const channel = await fetchChannelData(accessToken);
      console.log('Channel data received:', channel);

      console.log('Fetching channel videos...');
      const videos = await fetchChannelVideos(accessToken, channel.id);
      console.log(`Fetched ${videos.length} videos:`, videos);

      console.log('Fetching popular videos...');
      const popularVideos = await fetchPopularVideos(accessToken, channel.id);
      console.log(`Fetched ${popularVideos.length} popular videos:`, popularVideos);

      console.log('Fetching channel analytics...');
      const analytics = await fetchChannelAnalytics(accessToken, channel.id);
      console.log('Analytics data received:', analytics);

      if (popularVideos.length > 0) {
        console.log('Fetching video analytics for top video...');
        const videoAnalytics = await fetchVideoAnalytics(accessToken, popularVideos[0].id);
        console.log('Video analytics data received:', videoAnalytics);
        popularVideos[0].analytics = videoAnalytics;
      }

      const newInfluencer: Influencer = {
        channelId: channel.id,
        channel,
        videos,
        popularVideos,
        analytics,
        accessToken,
        connectedAt: new Date().toISOString(),
      };

      console.log('Complete influencer object:', newInfluencer);
      setInfluencer(newInfluencer);
      localStorage.setItem('influencer', JSON.stringify(newInfluencer));
      console.log('Influencer data saved to localStorage');
    } catch (err) {
      console.error('Error in OAuth success handler:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect YouTube channel');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    console.log('\n=== Refresh Data Handler ===');
    if (!influencer) {
      console.log('No influencer data to refresh');
      return;
    }

    console.log('Refreshing data for channel:', influencer.channelId);
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching updated channel data...');
      const channel = await fetchChannelData(influencer.accessToken);
      console.log('Updated channel data:', channel);

      console.log('Fetching updated videos...');
      const videos = await fetchChannelVideos(influencer.accessToken, channel.id);
      console.log(`Fetched ${videos.length} updated videos:`, videos);

      console.log('Fetching updated popular videos...');
      const popularVideos = await fetchPopularVideos(influencer.accessToken, channel.id);
      console.log(`Fetched ${popularVideos.length} updated popular videos:`, popularVideos);

      console.log('Fetching updated analytics...');
      const analytics = await fetchChannelAnalytics(influencer.accessToken, channel.id);
      console.log('Updated analytics data:', analytics);

      if (popularVideos.length > 0) {
        console.log('Fetching video analytics for top video...');
        const videoAnalytics = await fetchVideoAnalytics(influencer.accessToken, popularVideos[0].id);
        console.log('Video analytics data received:', videoAnalytics);
        popularVideos[0].analytics = videoAnalytics;
      }

      const updatedInfluencer: Influencer = {
        ...influencer,
        channel,
        videos,
        popularVideos,
        analytics,
      };

      console.log('Complete updated influencer object:', updatedInfluencer);
      setInfluencer(updatedInfluencer);
      localStorage.setItem('influencer', JSON.stringify(updatedInfluencer));
      console.log('Updated data saved to localStorage');
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    console.log('\n=== Disconnect Handler ===');
    console.log('Disconnecting influencer:', influencer?.channelId);
    console.log('Current URL hash:', window.location.hash);
    console.log('Current localStorage before clear:', localStorage.getItem('influencer'));

    // Clear localStorage
    localStorage.clear();
    console.log('All localStorage cleared');

    // Clear URL hash (remove OAuth token from URL)
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
      console.log('URL hash cleared');
    }

    // Clear all state
    setInfluencer(null);
    setError(null);
    setLoading(false);
    console.log('All state cleared');

    // Verify everything is clean
    const currentStorage = localStorage.getItem('influencer');
    console.log('Verify localStorage is empty:', currentStorage);
    console.log('Verify URL hash is empty:', window.location.hash);
    console.log('Current influencer state:', influencer);
  };

  console.log('\n[App Render] Component rendering');
  console.log('[App Render] influencer:', influencer);
  console.log('[App Render] loading:', loading);
  console.log('[App Render] error:', error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Youtube className="w-10 h-10 text-red-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Influencer Hub
                </h1>
                <p className="text-sm text-gray-600">
                  Connect and manage YouTube influencers
                </p>
              </div>
            </div>

            {influencer && (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <>
            {console.log('[App Render] Showing loading spinner')}
            <LoadingSpinner message="Fetching YouTube data..." />
          </>
        )}

        {error && (
          <>
            {console.log('[App Render] Showing error message')}
            <ErrorMessage message={error} onRetry={handleRefresh} />
          </>
        )}

        {!loading && !influencer && !error && (
          <>
            {console.log('[App Render] Showing connect button screen')}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
              <Youtube className="w-20 h-20 text-red-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Connect Your First Influencer
              </h2>
              <p className="text-gray-600 mb-8">
                Authorize YouTube access to view channel analytics, subscriber counts,
                and video performance metrics.
              </p>
              <ConnectButton />
            </div>
          </div>
          </>
        )}

        {!loading && influencer && !error && (
          <>
            {console.log('[App Render] Showing dashboard with data')}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Channel Overview</h2>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm border border-gray-200 transition-colors"
              >
                Refresh Data
              </button>
            </div>

            <ChannelCard channel={influencer.channel} />
            <AnalyticsDashboard channel={influencer.channel} videos={influencer.videos} />
            <DemographicsAnalytics analytics={influencer.analytics} />
            {influencer.popularVideos && influencer.popularVideos.length > 0 && (
              <VideoInDepthAnalytics video={influencer.popularVideos[0]} />
            )}
            <PopularVideos videos={influencer.popularVideos || []} />
            <VideoList videos={influencer.videos} popularVideos={influencer.popularVideos || []} />
          </div>
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Built with YouTube Data API v3
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
