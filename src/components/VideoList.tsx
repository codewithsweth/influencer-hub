import { useState } from 'react';
import { Eye, ThumbsUp, MessageCircle, Clock } from 'lucide-react';
import { YouTubeVideo } from '../types/influencer';
import { formatNumber, formatDuration } from '../utils/youtube-api';

interface VideoListProps {
  videos: YouTubeVideo[];
  popularVideos?: YouTubeVideo[];
}

export const VideoList = ({ videos, popularVideos = [] }: VideoListProps) => {
  console.log('\n[VideoList] Rendering video list');
  console.log('[VideoList] Recent videos count:', videos.length);
  console.log('[VideoList] Popular videos count:', popularVideos.length);

  const [activeTab, setActiveTab] = useState<'recent' | 'popular'>('recent');

  const displayVideos = activeTab === 'recent' ? videos : popularVideos;
  console.log('[VideoList] Active tab:', activeTab);
  console.log('[VideoList] Displaying videos:', displayVideos);

  if (videos.length === 0 && popularVideos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500">No videos found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Videos</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'recent'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'popular'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Popular
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {displayVideos.map((video) => (
          <div key={video.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex gap-4">
              <div className="relative flex-shrink-0">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-48 h-27 object-cover rounded-lg"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs font-semibold px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {video.title}
                </h4>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {video.description}
                </p>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(video.viewCount)} views</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{formatNumber(video.likeCount)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    <span>{formatNumber(video.commentCount)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(video.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Watch on YouTube →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
