import { useNavigate } from 'react-router-dom';
import { Eye, ThumbsUp, MessageSquare, TrendingUp, BarChart3 } from 'lucide-react';
import { YouTubeVideo } from '../types/influencer';
import { formatNumber, formatDuration } from '../utils/youtube-api';

interface PopularVideosProps {
  videos?: YouTubeVideo[];
}

export function PopularVideos({ videos = [] }: PopularVideosProps) {
  console.log('\n[PopularVideos] Rendering popular videos');
  console.log('[PopularVideos] Videos count:', videos.length);
  console.log('[PopularVideos] Videos:', videos);

  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-red-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Top Performing Videos</h2>
          <p className="text-gray-600">Your most viewed content</p>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No videos found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
              onClick={() => navigate(`/video/${video.id}`)}
            >
              <div className="relative">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  #{index + 1}
                </div>
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-medium">
                  {formatDuration(video.duration)}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{formatDate(video.publishedAt)}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">{formatNumber(video.viewCount)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm font-medium">{formatNumber(video.likeCount)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {formatNumber(video.commentCount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/video/${video.id}`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </button>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors"
                  >
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
