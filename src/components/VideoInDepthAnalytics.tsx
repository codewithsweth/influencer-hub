import { Eye, ThumbsUp, MessageSquare, TrendingUp, Clock, Calendar, Percent, Target, Users, Globe, Monitor, PlayCircle, MousePointerClick, UserPlus } from 'lucide-react';
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

  const formatWatchTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours.toLocaleString()}h`;
    }
    return `${minutes.toLocaleString()}m`;
  };

  const formatSeconds = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const hasAnalytics = video.analytics && (
    video.analytics.watchTime > 0 ||
    video.analytics.demographics.age.length > 0 ||
    video.analytics.geography.length > 0 ||
    video.analytics.deviceTypes.length > 0
  );

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

      {hasAnalytics && video.analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {video.analytics.watchTime > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-medium text-gray-600">Watch Time</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{formatWatchTime(video.analytics.watchTime)}</p>
                <p className="text-xs text-gray-500 mt-1">Total minutes</p>
              </div>
            )}

            {video.analytics.averageViewDuration > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <PlayCircle className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-medium text-gray-600">Avg View Duration</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{formatSeconds(video.analytics.averageViewDuration)}</p>
                <p className="text-xs text-gray-500 mt-1">Minutes:Seconds</p>
              </div>
            )}

            {video.analytics.subscribersGained > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="w-5 h-5 text-red-600" />
                  <span className="text-xs font-medium text-gray-600">Subscribers Gained</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(video.analytics.subscribersGained)}</p>
                <p className="text-xs text-gray-500 mt-1">From this video</p>
              </div>
            )}

            {video.analytics.impressions > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-medium text-gray-600">Impressions</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(video.analytics.impressions)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {video.analytics.clickThroughRate > 0 ? `${video.analytics.clickThroughRate.toFixed(1)}% CTR` : 'Total shown'}
                </p>
              </div>
            )}
          </div>

          {video.analytics.demographics.ageGenderBreakdown && video.analytics.demographics.ageGenderBreakdown.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl shadow-sm border border-blue-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Video Age & Gender Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-blue-300">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Age Group</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-blue-700">Male (%)</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-pink-700">Female (%)</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Total (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {video.analytics.demographics.ageGenderBreakdown.map((row, index) => (
                      <tr
                        key={row.ageGroup}
                        className={`border-b border-blue-100 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}
                      >
                        <td className="py-3 px-4 text-sm font-medium text-gray-800">{row.ageGroup}</td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-blue-700">{row.male.toFixed(1)}</td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-pink-700">{row.female.toFixed(1)}</td>
                        <td className="py-3 px-4 text-sm text-right font-bold text-gray-900">{row.total.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {video.analytics.geography.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Top Geographies</h3>
                </div>
                <div className="space-y-4">
                  {video.analytics.geography.slice(0, 5).map((item) => (
                    <div key={item.country} className="border-l-4 border-green-500 pl-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.country}</span>
                        <span className="text-sm font-semibold text-gray-900">{item.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>{(item.views || 0).toLocaleString()} views</span>
                        <span>•</span>
                        <span>{(item.estimatedMinutesWatched || 0).toLocaleString()} min watched</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {video.analytics.deviceTypes.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Monitor className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Device Types</h3>
                </div>
                <div className="space-y-3">
                  {video.analytics.deviceTypes.map((item) => (
                    <div key={item.deviceType}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.deviceType}</span>
                        <span className="text-sm font-semibold text-gray-900">{item.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {video.analytics.subscriberWatchTime > 0 && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-semibold text-gray-900">Subscriber Watch Time</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Watch Time from Subscribers</p>
                  <p className="text-3xl font-bold text-orange-600">{formatWatchTime(video.analytics.subscriberWatchTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Percentage from Subscribers</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {video.analytics.watchTime > 0
                      ? Math.round((video.analytics.subscriberWatchTime / video.analytics.watchTime) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!hasAnalytics && (
        <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-200 p-8 text-center">
          <Target className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Extended Analytics Not Available</h3>
          <p className="text-gray-600 mb-4">
            Video-specific analytics require YouTube Analytics API to be enabled.
          </p>
        </div>
      )}

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
