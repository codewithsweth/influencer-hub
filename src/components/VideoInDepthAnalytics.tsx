import { Eye, ThumbsUp, MessageSquare, TrendingUp, Clock, Calendar, Percent, Target } from 'lucide-react';
import { YouTubeVideo } from '../types/influencer';
import { formatNumber, formatDuration } from '../utils/youtube-api';

interface VideoInDepthAnalyticsProps {
  video: YouTubeVideo;
}

export function VideoInDepthAnalytics({ video }: VideoInDepthAnalyticsProps) {
  const engagementRate = video.viewCount > 0
    ? ((video.likeCount + video.commentCount) / video.viewCount) * 100
    : 0;

  const likeToViewRatio = video.viewCount > 0
    ? (video.likeCount / video.viewCount) * 100
    : 0;

  const commentToViewRatio = video.viewCount > 0
    ? (video.commentCount / video.viewCount) * 100
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const daysAgo = Math.floor(
    (new Date().getTime() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const viewsPerDay = daysAgo > 0 ? Math.round(video.viewCount / daysAgo) : video.viewCount;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Target className="w-8 h-8 text-orange-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Top Video In-Depth Analytics</h2>
          <p className="text-gray-600">Detailed performance breakdown of your most viewed video</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg border border-orange-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          <div className="lg:col-span-2 relative">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
              <TrendingUp className="w-5 h-5" />
              #1 Top Video
            </div>
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-90 text-white px-3 py-2 rounded-lg text-sm font-medium">
              {formatDuration(video.duration)}
            </div>
          </div>

          <div className="lg:col-span-3 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
              {video.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Published {formatDate(video.publishedAt)} ({daysAgo} days ago)</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-medium text-gray-600">Views</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(video.viewCount)}</p>
                <p className="text-xs text-gray-500 mt-1">{formatNumber(viewsPerDay)}/day</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-medium text-gray-600">Likes</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(video.likeCount)}</p>
                <p className="text-xs text-gray-500 mt-1">{likeToViewRatio.toFixed(2)}% ratio</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-medium text-gray-600">Comments</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(video.commentCount)}</p>
                <p className="text-xs text-gray-500 mt-1">{commentToViewRatio.toFixed(2)}% ratio</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="w-5 h-5 text-orange-600" />
                  <span className="text-xs font-medium text-gray-600">Engagement</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{engagementRate.toFixed(2)}%</p>
                <p className="text-xs text-gray-500 mt-1">Total rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Performance Metrics
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Like Rate</span>
                <span className="text-sm font-bold text-gray-900">{likeToViewRatio.toFixed(3)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(likeToViewRatio * 10, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Comment Rate</span>
                <span className="text-sm font-bold text-gray-900">{commentToViewRatio.toFixed(3)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(commentToViewRatio * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Engagement</span>
                <span className="text-sm font-bold text-gray-900">{engagementRate.toFixed(3)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(engagementRate * 10, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Time Analysis
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">Video Length</span>
              <span className="text-sm font-bold text-gray-900">{formatDuration(video.duration)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">Days Published</span>
              <span className="text-sm font-bold text-gray-900">{daysAgo.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">Average Views/Day</span>
              <span className="text-sm font-bold text-gray-900">{viewsPerDay.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-700">Total Engagement</span>
              <span className="text-sm font-bold text-gray-900">
                {formatNumber(video.likeCount + video.commentCount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl shadow-sm border border-blue-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Video Description</h4>
        <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-4">
          {video.description || 'No description available'}
        </p>
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Eye className="w-5 h-5" />
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}
