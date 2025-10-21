export interface YouTubeChannel {
  id: string;
  name: string;
  customUrl: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  publishedAt: string;
}

export interface VideoAnalytics {
  watchTime: number;
  averageViewDuration: number;
  impressions: number;
  clickThroughRate: number;
  subscribersGained: number;
  demographics: {
    age: DemographicData[];
    gender: GenderData[];
    ageGenderBreakdown: AgeGenderBreakdown[];
  };
  geography: GeographyData[];
  deviceTypes: DeviceData[];
  subscriberWatchTime: number;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  analytics?: VideoAnalytics;
}

export interface DemographicData {
  ageGroup: string;
  percentage: number;
}

export interface GenderData {
  gender: string;
  percentage: number;
}

export interface GeographyData {
  country: string;
  percentage: number;
  views: number;
  estimatedMinutesWatched: number;
}

export interface DeviceData {
  deviceType: string;
  percentage: number;
}

export interface AgeGenderBreakdown {
  ageGroup: string;
  male: number;
  female: number;
  total: number;
}

export interface ChannelAnalytics {
  demographics: {
    age: DemographicData[];
    gender: GenderData[];
    ageGenderBreakdown: AgeGenderBreakdown[];
  };
  geography: GeographyData[];
  deviceTypes: DeviceData[];
  subscriberWatchTime: number;
  totalWatchTime: number;
}

export interface Influencer {
  channelId: string;
  channel: YouTubeChannel;
  videos: YouTubeVideo[];
  popularVideos: YouTubeVideo[];
  analytics?: ChannelAnalytics;
  accessToken: string;
  connectedAt: string;
}

export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}
