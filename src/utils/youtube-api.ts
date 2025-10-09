import { YouTubeChannel, YouTubeVideo, ChannelAnalytics } from '../types/influencer';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_ANALYTICS_API = 'https://youtubeanalytics.googleapis.com/v2';

export const fetchChannelData = async (accessToken: string): Promise<YouTubeChannel> => {
  console.log('\n[API] Fetching channel data...');
  const response = await fetch(
    `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&mine=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log('[API] Channel data response status:', response.status);
  if (!response.ok) {
    console.error('[API] Failed to fetch channel data:', response.statusText);
    throw new Error('Failed to fetch channel data');
  }

  const data = await response.json();
  console.log('[API] Raw channel data:', data);
  const channel = data.items[0];

  const channelData = {
    id: channel.id,
    name: channel.snippet.title,
    customUrl: channel.snippet.customUrl || '',
    description: channel.snippet.description,
    thumbnailUrl: channel.snippet.thumbnails.high.url,
    subscriberCount: parseInt(channel.statistics.subscriberCount),
    videoCount: parseInt(channel.statistics.videoCount),
    viewCount: parseInt(channel.statistics.viewCount),
    publishedAt: channel.snippet.publishedAt,
  };

  console.log('[API] Parsed channel data:', channelData);
  return channelData;
};

export const fetchChannelVideos = async (
  accessToken: string,
  channelId: string,
  maxResults: number = 10
): Promise<YouTubeVideo[]> => {
  console.log(`\n[API] Fetching channel videos for channel: ${channelId}, maxResults: ${maxResults}`);
  const searchResponse = await fetch(
    `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${maxResults}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log('[API] Search response status:', searchResponse.status);
  if (!searchResponse.ok) {
    console.error('[API] Failed to fetch videos:', searchResponse.statusText);
    throw new Error('Failed to fetch videos');
  }

  const searchData = await searchResponse.json();
  console.log('[API] Search results:', searchData);
  const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
  console.log('[API] Video IDs to fetch details for:', videoIds);

  const videosResponse = await fetch(
    `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoIds}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log('[API] Videos details response status:', videosResponse.status);
  if (!videosResponse.ok) {
    console.error('[API] Failed to fetch video details:', videosResponse.statusText);
    throw new Error('Failed to fetch video details');
  }

  const videosData = await videosResponse.json();
  console.log('[API] Raw videos data:', videosData);

  const videos = videosData.items.map((video: any) => ({
    id: video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnailUrl: video.snippet.thumbnails.high.url,
    publishedAt: video.snippet.publishedAt,
    viewCount: parseInt(video.statistics.viewCount || '0'),
    likeCount: parseInt(video.statistics.likeCount || '0'),
    commentCount: parseInt(video.statistics.commentCount || '0'),
    duration: video.contentDetails.duration,
  }));

  console.log('[API] Parsed videos:', videos);
  return videos;
};

export const fetchPopularVideos = async (
  accessToken: string,
  channelId: string,
  maxResults: number = 50
): Promise<YouTubeVideo[]> => {
  console.log(`\n[API] Fetching popular videos for channel: ${channelId}, maxResults: ${maxResults}`);
  const searchResponse = await fetch(
    `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${channelId}&order=viewCount&type=video&maxResults=${maxResults}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log('[API] Popular videos search response status:', searchResponse.status);
  if (!searchResponse.ok) {
    console.error('[API] Failed to fetch popular videos:', searchResponse.statusText);
    throw new Error('Failed to fetch popular videos');
  }

  const searchData = await searchResponse.json();
  console.log('[API] Popular videos search results:', searchData);
  const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
  console.log('[API] Popular video IDs:', videoIds);

  if (!videoIds) {
    console.log('[API] No popular video IDs found');
    return [];
  }

  const videosResponse = await fetch(
    `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoIds}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log('[API] Popular videos details response status:', videosResponse.status);
  if (!videosResponse.ok) {
    console.error('[API] Failed to fetch popular video details:', videosResponse.statusText);
    throw new Error('Failed to fetch popular video details');
  }

  const videosData = await videosResponse.json();
  console.log('[API] Raw popular videos data:', videosData);

  const videos = videosData.items.map((video: any) => ({
    id: video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnailUrl: video.snippet.thumbnails.high.url,
    publishedAt: video.snippet.publishedAt,
    viewCount: parseInt(video.statistics.viewCount || '0'),
    likeCount: parseInt(video.statistics.likeCount || '0'),
    commentCount: parseInt(video.statistics.commentCount || '0'),
    duration: video.contentDetails.duration,
  }));

  console.log('[API] Parsed popular videos (before sorting):', videos);
  const sortedVideos = videos.sort((a, b) => b.viewCount - a.viewCount).slice(0, 10);
  console.log('[API] Top 10 popular videos (after sorting):', sortedVideos);
  return sortedVideos;
};

export const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '0').replace('S', '');

  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const fetchChannelAnalytics = async (
  accessToken: string,
  channelId: string
): Promise<ChannelAnalytics> => {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = '2005-02-14';

  console.log(`\n[API] Fetching channel analytics for channel: ${channelId}`);
  console.log(`[API] Date range: ${startDate} to ${endDate}`);

  try {
    const demographicsResponse = await fetch(
      `${YOUTUBE_ANALYTICS_API}/reports?ids=channel==${channelId}&startDate=${startDate}&endDate=${endDate}&dimensions=ageGroup,gender&metrics=viewerPercentage&sort=-viewerPercentage`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const geographyResponse = await fetch(
      `${YOUTUBE_ANALYTICS_API}/reports?ids=channel==${channelId}&startDate=${startDate}&endDate=${endDate}&dimensions=country&metrics=views,estimatedMinutesWatched&sort=-views&maxResults=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const deviceResponse = await fetch(
      `${YOUTUBE_ANALYTICS_API}/reports?ids=channel==${channelId}&startDate=${startDate}&endDate=${endDate}&dimensions=deviceType&metrics=viewerPercentage&sort=-viewerPercentage`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const watchTimeResponse = await fetch(
      `${YOUTUBE_ANALYTICS_API}/reports?ids=channel==${channelId}&startDate=${startDate}&endDate=${endDate}&metrics=estimatedMinutesWatched&filters=subscribedStatus==SUBSCRIBED`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const totalWatchTimeResponse = await fetch(
      `${YOUTUBE_ANALYTICS_API}/reports?ids=channel==${channelId}&startDate=${startDate}&endDate=${endDate}&metrics=estimatedMinutesWatched`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log('[API] Demographics response status:', demographicsResponse.status);
    console.log('[API] Geography response status:', geographyResponse.status);
    console.log('[API] Device response status:', deviceResponse.status);
    console.log('[API] Watch time response status:', watchTimeResponse.status);
    console.log('[API] Total watch time response status:', totalWatchTimeResponse.status);

    if (demographicsResponse.status === 403) {
      const errorData = await demographicsResponse.json();
      console.warn('[API] YouTube Analytics API is disabled:', errorData);
      console.warn('[API] Enable it at: https://console.developers.google.com/apis/api/youtubeanalytics.googleapis.com/overview');
      console.warn('[API] Continuing without analytics data...');
    }

    const demographicsData = demographicsResponse.ok ? await demographicsResponse.json() : { rows: [] };
    const geographyData = geographyResponse.ok ? await geographyResponse.json() : { rows: [] };
    const deviceData = deviceResponse.ok ? await deviceResponse.json() : { rows: [] };
    const watchTimeData = watchTimeResponse.ok ? await watchTimeResponse.json() : { rows: [[0]] };
    const totalWatchTimeData = totalWatchTimeResponse.ok ? await totalWatchTimeResponse.json() : { rows: [[0]] };

    console.log('[API] Raw demographics data:', demographicsData);
    console.log('[API] Raw geography data:', geographyData);
    console.log('[API] Raw device data:', deviceData);
    console.log('[API] Raw watch time data:', watchTimeData);
    console.log('[API] Raw total watch time data:', totalWatchTimeData);

    const ageMap = new Map<string, number>();
    const genderMap = new Map<string, number>();
    const ageGenderMap = new Map<string, { male: number; female: number }>();

    if (demographicsData.rows) {
      demographicsData.rows.forEach((row: any[]) => {
        const [ageGroup, gender, percentage] = row;
        console.log('[API] Processing demographics row:', { ageGroup, gender, percentage });
        ageMap.set(ageGroup, (ageMap.get(ageGroup) || 0) + percentage);
        genderMap.set(gender, (genderMap.get(gender) || 0) + percentage);

        if (!ageGenderMap.has(ageGroup)) {
          ageGenderMap.set(ageGroup, { male: 0, female: 0 });
        }
        const ageGenderData = ageGenderMap.get(ageGroup)!;
        if (gender.toLowerCase() === 'male') {
          ageGenderData.male += percentage;
        } else if (gender.toLowerCase() === 'female') {
          ageGenderData.female += percentage;
        }
      });
    }

    console.log('[API] Age map:', Array.from(ageMap.entries()));
    console.log('[API] Gender map:', Array.from(genderMap.entries()));
    console.log('[API] Age-Gender map:', Array.from(ageGenderMap.entries()));

    const formatGender = (gender: string): string => {
      const lowerGender = gender.toLowerCase();
      if (lowerGender === 'male' || lowerGender === 'm') return 'Male';
      if (lowerGender === 'female' || lowerGender === 'f') return 'Female';
      if (lowerGender === 'user_specified') return 'Other';
      return 'Other';
    };

    const formatAgeGroup = (ageGroup: string): string => {
      if (ageGroup === 'age13-17') return '13-17';
      if (ageGroup === 'age18-24') return '18-24';
      if (ageGroup === 'age25-34') return '25-34';
      if (ageGroup === 'age35-44') return '35-44';
      if (ageGroup === 'age45-54') return '45-54';
      if (ageGroup === 'age55-64') return '55-64';
      if (ageGroup === 'age65-') return '65+';
      return ageGroup;
    };

    const ageGroupOrder = ['age13-17', 'age18-24', 'age25-34', 'age35-44', 'age45-54', 'age55-64', 'age65-'];

    const countryCodeMap: Record<string, string> = {
      'US': 'United States',
      'IN': 'India',
      'GB': 'United Kingdom',
      'CA': 'Canada',
      'AU': 'Australia',
      'DE': 'Germany',
      'FR': 'France',
      'BR': 'Brazil',
      'MX': 'Mexico',
      'JP': 'Japan',
      'KR': 'South Korea',
      'IT': 'Italy',
      'ES': 'Spain',
      'NL': 'Netherlands',
      'SE': 'Sweden',
      'PL': 'Poland',
      'TR': 'Turkey',
      'RU': 'Russia',
      'ID': 'Indonesia',
      'IQ': 'Iraq',
      'NP': 'Nepal',
      'PH': 'Philippines',
      'VN': 'Vietnam',
      'TH': 'Thailand',
      'MY': 'Malaysia',
      'SG': 'Singapore',
      'AR': 'Argentina',
      'CL': 'Chile',
      'CO': 'Colombia',
      'PE': 'Peru',
      'ZA': 'South Africa',
      'EG': 'Egypt',
      'NG': 'Nigeria',
      'KE': 'Kenya',
      'PK': 'Pakistan',
      'BD': 'Bangladesh',
      'AE': 'United Arab Emirates',
      'SA': 'Saudi Arabia',
      'IL': 'Israel',
      'NZ': 'New Zealand',
      'CH': 'Switzerland',
      'AT': 'Austria',
      'BE': 'Belgium',
      'DK': 'Denmark',
      'FI': 'Finland',
      'NO': 'Norway',
      'IE': 'Ireland',
      'PT': 'Portugal',
      'GR': 'Greece',
      'CZ': 'Czech Republic',
      'RO': 'Romania',
      'HU': 'Hungary',
      'UA': 'Ukraine',
      'JO': 'Jordan',
      'LB': 'Lebanon',
    };

    const analyticsData = {
      demographics: {
        age: Array.from(ageMap.entries()).map(([ageGroup, percentage]) => ({
          ageGroup,
          percentage: Math.round(percentage * 100) / 100,
        })).sort((a, b) => b.percentage - a.percentage),
        gender: Array.from(genderMap.entries()).map(([gender, percentage]) => ({
          gender: formatGender(gender),
          percentage: Math.round(percentage * 100) / 100,
        })).sort((a, b) => b.percentage - a.percentage),
        ageGenderBreakdown: ageGroupOrder
          .filter(ageGroup => ageGenderMap.has(ageGroup))
          .map(ageGroup => {
            const data = ageGenderMap.get(ageGroup)!;
            return {
              ageGroup: formatAgeGroup(ageGroup),
              male: Math.round(data.male * 10) / 10,
              female: Math.round(data.female * 10) / 10,
              total: Math.round((data.male + data.female) * 10) / 10,
            };
          }),
      },
      geography: (() => {
        const totalViews = (geographyData.rows || []).reduce((sum: number, row: any[]) => sum + row[1], 0);
        console.log('[API] Total views across all countries:', totalViews);
        return (geographyData.rows || []).map((row: any[]) => {
          const countryCode = row[0];
          const views = row[1];
          const estimatedMinutesWatched = row[2] || 0;
          const percentage = totalViews > 0 ? (views / totalViews) * 100 : 0;
          const countryName = countryCodeMap[countryCode] || countryCode;
          console.log('[API] Country mapping:', countryCode, '→', countryName, `(${views} views, ${estimatedMinutesWatched} min, ${percentage.toFixed(1)}%)`);
          return {
            country: countryName,
            percentage: Math.round(percentage * 100) / 100,
            views,
            estimatedMinutesWatched,
          };
        });
      })(),
      deviceTypes: (deviceData.rows || []).map((row: any[]) => ({
        deviceType: row[0] === 'DESKTOP' ? 'Desktop' : row[0] === 'MOBILE' ? 'Mobile' : row[0] === 'TABLET' ? 'Tablet' : row[0] === 'TV' ? 'TV' : row[0],
        percentage: Math.round(row[1] * 100) / 100,
      })),
      subscriberWatchTime: watchTimeData.rows?.[0]?.[0] || 0,
      totalWatchTime: totalWatchTimeData.rows?.[0]?.[0] || 0,
    };

    console.log('[API] Parsed analytics data:', analyticsData);
    return analyticsData;
  } catch (error) {
    console.error('[API] Failed to fetch analytics:', error);
    const fallbackData = {
      demographics: {
        age: [],
        gender: [],
        ageGenderBreakdown: [],
      },
      geography: [],
      deviceTypes: [],
      subscriberWatchTime: 0,
      totalWatchTime: 0,
    };
    console.log('[API] Returning fallback analytics data:', fallbackData);
    return fallbackData;
  }
};
