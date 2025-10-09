import { Eye, ThumbsUp, MessageSquare, TrendingUp, Users, Video } from 'lucide-react';
import { YouTubeChannel, YouTubeVideo } from '../types/influencer';
import { formatNumber } from '../utils/youtube-api';

interface AnalyticsDashboardProps {
  channel: YouTubeChannel;
  videos: YouTubeVideo[];
}

export function AnalyticsDashboard({ channel, videos }: AnalyticsDashboardProps) {
  console.log('\n[AnalyticsDashboard] Rendering dashboard');
  console.log('[AnalyticsDashboard] Channel:', channel);
  console.log('[AnalyticsDashboard] Videos count:', videos.length);
  console.log('[AnalyticsDashboard] Videos:', videos);

  const totalViews = videos.reduce((sum, video) => sum + video.viewCount, 0);
  const totalLikes = videos.reduce((sum, video) => sum + video.likeCount, 0);
  const totalComments = videos.reduce((sum, video) => sum + video.commentCount, 0);
  const avgViewsPerVideo = videos.length > 0 ? totalViews / videos.length : 0;
  const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

  console.log('[AnalyticsDashboard] Calculated metrics:', {
    totalViews,
    totalLikes,
    totalComments,
    avgViewsPerVideo,
    engagementRate,
  });

  const stats = [
    {
      label: 'Total Subscribers',
      value: formatNumber(channel.subscriberCount),
      icon: Users,
      color: 'bg-red-500',
      change: null,
    },
    {
      label: 'Total Videos',
      value: formatNumber(channel.videoCount),
      icon: Video,
      color: 'bg-blue-500',
      change: null,
    },
    {
      label: 'Channel Views',
      value: formatNumber(channel.viewCount),
      icon: Eye,
      color: 'bg-purple-500',
      change: null,
    },
    {
      label: 'Avg Views/Video',
      value: formatNumber(Math.round(avgViewsPerVideo)),
      icon: TrendingUp,
      color: 'bg-green-500',
      change: null,
    },
    {
      label: 'Total Likes',
      value: formatNumber(totalLikes),
      icon: ThumbsUp,
      color: 'bg-pink-500',
      change: null,
    },
    {
      label: 'Engagement Rate',
      value: `${engagementRate.toFixed(2)}%`,
      icon: MessageSquare,
      color: 'bg-orange-500',
      change: null,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Overview</h2>
        <p className="text-gray-600">Comprehensive performance metrics for your channel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Recent Videos Analyzed</p>
            <p className="text-2xl font-bold text-gray-900">{videos.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Total Recent Views</p>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(totalViews)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Total Engagement</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(totalLikes + totalComments)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
