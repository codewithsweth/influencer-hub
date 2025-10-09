import { Users, Video, Eye, Calendar } from 'lucide-react';
import { YouTubeChannel } from '../types/influencer';
import { formatNumber } from '../utils/youtube-api';

interface ChannelCardProps {
  channel: YouTubeChannel;
}

export const ChannelCard = ({ channel }: ChannelCardProps) => {
  console.log('\n[ChannelCard] Rendering channel card');
  console.log('[ChannelCard] Channel data:', channel);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative h-32 bg-gradient-to-r from-red-500 to-red-600">
        <div className="absolute -bottom-12 left-6">
          <img
            src={channel.thumbnailUrl}
            alt={channel.name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      <div className="pt-16 px-6 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{channel.name}</h2>
        {channel.customUrl && (
          <a
            href={`https://youtube.com/${channel.customUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            youtube.com/{channel.customUrl}
          </a>
        )}

        {channel.description && (
          <p className="mt-4 text-gray-600 text-sm line-clamp-3">
            {channel.description}
          </p>
        )}

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Subscribers</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {formatNumber(channel.subscriberCount)}
            </span>
          </div>

          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Video className="w-4 h-4" />
              <span className="text-xs font-medium">Videos</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {formatNumber(channel.videoCount)}
            </span>
          </div>

          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs font-medium">Views</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {formatNumber(channel.viewCount)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            Joined {new Date(channel.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
