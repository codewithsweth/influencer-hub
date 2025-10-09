import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, ThumbsUp, MessageSquare, Share2, Clock, TrendingUp, Users, Globe, Monitor } from 'lucide-react';
import { fetchVideoAnalytics } from '../utils/youtube-api';
import { VideoAnalytics, YouTubeVideo } from '../types/influencer';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface VideoAnalyticsPageProps {
  accessToken: string;
  channelId: string;
  videos: YouTubeVideo[];
}

export default function VideoAnalyticsPage({ accessToken, channelId, videos }: VideoAnalyticsPageProps) {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<VideoAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const video = videos.find(v => v.id === videoId);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!videoId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await fetchVideoAnalytics(accessToken, channelId, videoId);
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to fetch video analytics:', err);
        setError('Failed to load video analytics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [videoId, accessToken, channelId]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!analytics || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <ErrorMessage message="Video not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="p-8">
            <div className="flex gap-6">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-80 h-45 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">{video.title}</h1>
                <p className="text-slate-600 mb-4 line-clamp-3">{video.description}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>Published: {new Date(video.publishedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Duration: {video.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-slate-600">Views</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatNumber(analytics.engagement.views)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <ThumbsUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-slate-600">Likes</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatNumber(analytics.engagement.likes)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-slate-600">Comments</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatNumber(analytics.engagement.comments)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Share2 className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-sm font-medium text-slate-600">Shares</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatNumber(analytics.engagement.shares)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-slate-700" />
              <h2 className="text-xl font-bold text-slate-900">Watch Time</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Watch Time</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatNumber(analytics.watchTime.estimatedMinutesWatched)} minutes
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Average View Duration</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatDuration(analytics.watchTime.averageViewDuration)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Average View Percentage</p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics.watchTime.averageViewPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Monitor className="w-6 h-6 text-slate-700" />
              <h2 className="text-xl font-bold text-slate-900">Device Types</h2>
            </div>
            <div className="space-y-3">
              {analytics.deviceTypes.map((device) => (
                <div key={device.deviceType} className="flex items-center justify-between">
                  <span className="text-slate-700 font-medium">{device.deviceType}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 w-12 text-right">
                      {device.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-slate-700" />
              <h2 className="text-xl font-bold text-slate-900">Demographics</h2>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Age Distribution</h3>
              <div className="space-y-3">
                {analytics.demographics.age.map((age) => (
                  <div key={age.ageGroup} className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">{age.ageGroup}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${age.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-900 w-12 text-right">
                        {age.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Gender Distribution</h3>
              <div className="space-y-3">
                {analytics.demographics.gender.map((gender) => (
                  <div key={gender.gender} className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">{gender.gender}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${gender.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-900 w-12 text-right">
                        {gender.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-slate-700" />
              <h2 className="text-xl font-bold text-slate-900">Top Locations</h2>
            </div>
            <div className="space-y-4">
              {analytics.geography.slice(0, 10).map((geo) => (
                <div key={geo.country} className="border-b border-slate-100 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 font-medium">{geo.country}</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {geo.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{formatNumber(geo.views)} views</span>
                    <span>{formatNumber(geo.estimatedMinutesWatched)} min watched</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${geo.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {analytics.demographics.ageGenderBreakdown.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-slate-700" />
              <h2 className="text-xl font-bold text-slate-900">Age & Gender Breakdown</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Age Group</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Male</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Female</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.demographics.ageGenderBreakdown.map((item) => (
                    <tr key={item.ageGroup} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-700 font-medium">{item.ageGroup}</td>
                      <td className="py-3 px-4 text-right text-slate-900">{item.male.toFixed(1)}%</td>
                      <td className="py-3 px-4 text-right text-slate-900">{item.female.toFixed(1)}%</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">{item.total.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
