# YouTube Integration Guide - Influencer Connect

## Executive Summary

The YouTube Integration enables the Influencer Connect platform to securely connect with YouTube channels using OAuth 2.0, retrieve comprehensive channel and video data, and fetch detailed analytics from YouTube Data API v3 and YouTube Analytics API v2.

**Key Capabilities:**
- OAuth 2.0 authentication with Google
- Channel profile and statistics retrieval
- Video listing with engagement metrics
- Advanced analytics (demographics, geography, device types)
- Secure token management with automatic refresh
- Persistent storage in Supabase database

**APIs Used:**
- YouTube Data API v3 (channel data, videos, statistics)
- YouTube Analytics API v2 (demographics, geography, performance metrics)
- Google OAuth 2.0 API (authentication)

---

## Data Capabilities

### 1. Channel Data
- **Channel ID**: Unique YouTube channel identifier
- **Channel Name**: Display name of the channel
- **Custom URL**: YouTube custom URL (e.g., @channelname)
- **Description**: Channel description/bio
- **Thumbnail**: High-resolution channel avatar
- **Subscriber Count**: Total subscribers
- **Video Count**: Total videos published
- **View Count**: Lifetime channel views
- **Published Date**: Channel creation date

### 2. Video Data
- **Video ID**: Unique video identifier
- **Title**: Video title
- **Description**: Video description
- **Thumbnail**: High-resolution thumbnail
- **Published Date**: Upload date
- **View Count**: Total views
- **Like Count**: Total likes
- **Comment Count**: Total comments
- **Duration**: Video length (ISO 8601 format)

### 3. Channel Analytics
- **Demographics**: Age and gender breakdown
- **Geography**: Top 10 countries by views
- **Device Types**: Desktop, mobile, tablet, TV usage
- **Subscriber Watch Time**: Minutes watched by subscribers
- **Total Watch Time**: Total estimated minutes watched

### 4. Video Analytics (Per Video)
- **Watch Time**: Estimated minutes watched
- **Average View Duration**: Average seconds per view
- **Impressions**: Number of times thumbnail shown
- **Click-Through Rate**: Percentage of impressions clicked
- **Subscribers Gained**: New subscribers from video
- **Demographics**: Age/gender breakdown for video
- **Geography**: Country-level performance
- **Device Types**: Viewing device breakdown

---

## Prerequisites & Setup

### 1. Google Cloud Project Setup

**Step 1: Create a Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Note your Project ID

**Step 2: Enable Required APIs**
Enable these APIs in the Google Cloud Console:
- YouTube Data API v3
- YouTube Analytics API v2

Links:
- YouTube Data API: `https://console.developers.google.com/apis/api/youtube.googleapis.com/overview`
- YouTube Analytics API: `https://console.developers.google.com/apis/api/youtubeanalytics.googleapis.com/overview`

**Step 3: Create OAuth 2.0 Credentials**
1. Navigate to: APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Application type: "Web application"
4. Authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
5. Authorized redirect URIs:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
6. Save and copy:
   - **Client ID**
   - **Client Secret**

### 2. Supabase Database Setup

The database is already configured with:

**Table: `youtube_tokens`**
- Stores OAuth tokens securely
- Automatically refreshes expired tokens
- Indexed for fast lookups

**Edge Functions:**
- `exchange-youtube-token`: Exchanges OAuth code for tokens
- `refresh-youtube-token`: Refreshes expired access tokens

---

## Permission Scopes

The application requests these OAuth scopes:

| Scope | Purpose | Access Level |
|-------|---------|--------------|
| `https://www.googleapis.com/auth/youtube.readonly` | Read channel data, videos, statistics | Read-only |
| `https://www.googleapis.com/auth/yt-analytics.readonly` | Read analytics reports | Read-only |
| `https://www.googleapis.com/auth/userinfo.profile` | Get user profile info | Read-only |

**Important Notes:**
- All scopes are read-only (no modification capabilities)
- `access_type: offline` ensures we receive a refresh token
- `prompt: consent` forces re-consent to guarantee refresh token

---

## Authentication Flow

### Step 1: Initiate OAuth Login

**Frontend (`youtube-oauth.ts`):**
```typescript
const OAUTH_CONFIG = {
  clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  redirectUri: window.location.origin,
  scope: 'youtube.readonly yt-analytics.readonly userinfo.profile',
};

// Generate auth URL
const authUrl = generateAuthUrl();
// Redirects to: https://accounts.google.com/o/oauth2/v2/auth?...
```

**User Action:**
User clicks "Connect YouTube" → Browser redirects to Google OAuth consent screen

### Step 2: User Consent

User authorizes the application:
1. Google displays requested permissions
2. User clicks "Allow"
3. Google redirects back to app with authorization code

Redirect format: `https://yourapp.com?code=AUTHORIZATION_CODE`

### Step 3: Exchange Code for Tokens

**Frontend (`token-manager.ts`):**
```typescript
const { channelId, accessToken } = await exchangeCodeForToken(code);
```

**Edge Function (`exchange-youtube-token`):**
1. Receives authorization code from frontend
2. Exchanges code for tokens with Google:
   - **Access Token** (expires in 1 hour)
   - **Refresh Token** (long-lived)
3. Fetches channel ID from YouTube API
4. Stores tokens in Supabase `youtube_tokens` table
5. Returns channel ID and access token to frontend

### Step 4: Token Details

**Access Token:**
- Used for API calls to YouTube
- Expires after 3600 seconds (1 hour)
- Stored in database with expiry timestamp

**Refresh Token:**
- Used to obtain new access tokens
- Long-lived (doesn't expire unless revoked)
- Never exposed to frontend
- Stored securely in database

**Automatic Refresh:**
```typescript
// Automatically refreshes if token expires within 5 minutes
const accessToken = await getValidAccessToken(channelId);
```

---

## Data Fetching Flow

### Phase 1: Channel Discovery

**Endpoint:** `GET /youtube/v3/channels`
- **Auth:** Bearer token (access_token)
- **Parameters:**
  - `part=snippet,statistics`
  - `mine=true`

**Response Fields:**
- `id`: Channel ID
- `snippet.title`: Channel name
- `snippet.customUrl`: Custom URL
- `snippet.description`: Description
- `snippet.thumbnails.high.url`: Avatar
- `statistics.subscriberCount`: Subscribers
- `statistics.videoCount`: Total videos
- `statistics.viewCount`: Total views

### Phase 2: Channel Analytics

**Endpoint:** `GET /youtubeanalytics/v2/reports`

**Demographics Query:**
```
?ids=channel==CHANNEL_ID
&startDate=2005-02-14
&endDate=TODAY
&dimensions=ageGroup,gender
&metrics=viewerPercentage
&sort=-viewerPercentage
```

**Geography Query:**
```
?ids=channel==CHANNEL_ID
&startDate=2005-02-14
&endDate=TODAY
&dimensions=country
&metrics=views,estimatedMinutesWatched
&sort=-views
&maxResults=10
```

**Device Types Query:**
```
?ids=channel==CHANNEL_ID
&startDate=2005-02-14
&endDate=TODAY
&dimensions=deviceType
&metrics=views,estimatedMinutesWatched
&sort=-views
```

**Watch Time Query:**
```
?ids=channel==CHANNEL_ID
&startDate=2005-02-14
&endDate=TODAY
&metrics=estimatedMinutesWatched
&filters=subscribedStatus==SUBSCRIBED
```

### Phase 3: Video Discovery

**Search Endpoint:** `GET /youtube/v3/search`
- **Parameters:**
  - `part=snippet`
  - `channelId=CHANNEL_ID`
  - `order=date` (recent) or `order=viewCount` (popular)
  - `type=video`
  - `maxResults=50`

**Details Endpoint:** `GET /youtube/v3/videos`
- **Parameters:**
  - `part=snippet,statistics,contentDetails`
  - `id=VIDEO_IDS` (comma-separated)

### Phase 4: Video Analytics

**Video Performance Metrics:**
```
?ids=channel==MINE
&startDate=2005-02-14
&endDate=TODAY
&metrics=estimatedMinutesWatched,averageViewDuration,views
&filters=video==VIDEO_ID
```

**Video Demographics:**
```
?ids=channel==MINE
&startDate=2005-02-14
&endDate=TODAY
&dimensions=ageGroup,gender
&metrics=viewerPercentage
&filters=video==VIDEO_ID
&sort=-viewerPercentage
```

**Video Geography:**
```
?ids=channel==MINE
&startDate=2005-02-14
&endDate=TODAY
&dimensions=country
&metrics=views,estimatedMinutesWatched
&filters=video==VIDEO_ID
&sort=-views
&maxResults=10
```

**Video Device Types:**
```
?ids=channel==MINE
&startDate=2005-02-14
&endDate=TODAY
&dimensions=deviceType
&metrics=views,estimatedMinutesWatched
&filters=video==VIDEO_ID
&sort=-views
```

**Engagement Metrics:**
```
?ids=channel==MINE
&startDate=2005-02-14
&endDate=TODAY
&metrics=cardImpressions,cardClickRate
&filters=video==VIDEO_ID
```

**Subscriber Growth:**
```
?ids=channel==MINE
&startDate=2005-02-14
&endDate=TODAY
&metrics=subscribersGained,estimatedMinutesWatched
&filters=video==VIDEO_ID;subscribedStatus==SUBSCRIBED
```

---

## API Endpoints Reference

| API | Endpoint | Token | Response Fields |
|-----|----------|-------|-----------------|
| **OAuth Token Exchange** | `POST /oauth2.googleapis.com/token` | N/A | access_token, refresh_token, expires_in |
| **Channel Data** | `GET /youtube/v3/channels` | Access | id, snippet, statistics |
| **Video Search** | `GET /youtube/v3/search` | Access | items[].id.videoId, snippet |
| **Video Details** | `GET /youtube/v3/videos` | Access | statistics, contentDetails, snippet |
| **Channel Analytics** | `GET /youtubeanalytics/v2/reports` | Access | rows[] (demographics, geography, devices) |
| **Video Analytics** | `GET /youtubeanalytics/v2/reports` | Access | rows[] (performance, demographics, traffic) |

---

## Error Handling & Limitations

### Common Errors

**1. OAuth Errors**
- `invalid_grant`: Authorization code expired or already used
  - **Solution:** Restart OAuth flow
- `redirect_uri_mismatch`: Redirect URI doesn't match configured URI
  - **Solution:** Verify OAuth credentials configuration

**2. API Errors**
- `401 Unauthorized`: Token expired or invalid
  - **Solution:** Automatic token refresh via `getValidAccessToken()`
- `403 Forbidden`: API not enabled or quota exceeded
  - **Solution:** Enable API in Google Cloud Console
- `404 Not Found`: Channel or video doesn't exist
  - **Solution:** Verify channel/video ID

**3. Analytics Errors**
- `403 youtubeAnalytics.reports.query` - YouTube Analytics API disabled
  - **Solution:** Enable at console.developers.google.com
- Empty analytics data: Channel too new or no data available
  - **Solution:** Graceful fallback with empty arrays

### Rate Limits

**YouTube Data API v3:**
- Default quota: 10,000 units/day
- Channel request: 1 unit
- Video list: 1 unit
- Video details: 1 unit per video
- Search: 100 units

**YouTube Analytics API v2:**
- Default quota: 50,000 queries/day
- Each analytics query: 1 query

**Best Practices:**
- Cache channel data (rarely changes)
- Batch video detail requests (up to 50 videos)
- Use `maxResults` to limit API calls
- Store analytics in database to avoid repeated queries

---

## Best Practices

### 1. Token Management
```typescript
// ✅ Always use getValidAccessToken() - handles refresh automatically
const token = await getValidAccessToken(channelId);

// ❌ Don't use token directly from database
const token = tokenData.access_token; // May be expired!
```

### 2. Caching Strategy
- **Cache channel data:** 24 hours (rarely changes)
- **Cache video lists:** 1 hour (new uploads are infrequent)
- **Cache analytics:** 6-12 hours (updated daily by YouTube)

### 3. Pagination
```typescript
// For channels with many videos, use pagination
let nextPageToken = null;
do {
  const response = await fetch(`/youtube/v3/search?...&pageToken=${nextPageToken}`);
  const data = await response.json();
  nextPageToken = data.nextPageToken;
  // Process data.items
} while (nextPageToken);
```

### 4. Retry Logic
```typescript
async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
      if (response.status === 429) {
        // Rate limited - exponential backoff
        await new Promise(r => setTimeout(r, 2 ** i * 1000));
        continue;
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
}
```

### 5. Error Boundaries
```typescript
try {
  const analytics = await fetchChannelAnalytics(channelId);
} catch (error) {
  console.error('Analytics fetch failed:', error);
  // Graceful fallback
  const analytics = {
    demographics: { age: [], gender: [], ageGenderBreakdown: [] },
    geography: [],
    deviceTypes: [],
    subscriberWatchTime: 0,
    totalWatchTime: 0,
  };
}
```

---

## Integration Checklist

### Pre-Development
- [ ] Create Google Cloud Project
- [ ] Enable YouTube Data API v3
- [ ] Enable YouTube Analytics API v2
- [ ] Create OAuth 2.0 credentials
- [ ] Configure authorized redirect URIs
- [ ] Copy Client ID and Client Secret
- [ ] Configure credentials in Edge Functions

### Development
- [ ] Implement OAuth flow (`youtube-oauth.ts`)
- [ ] Implement token management (`token-manager.ts`)
- [ ] Create Edge Functions for token exchange and refresh
- [ ] Implement YouTube API calls (`youtube-api.ts`)
- [ ] Create database table for tokens
- [ ] Add RLS policies for token access
- [ ] Implement automatic token refresh logic
- [ ] Add error handling and fallbacks
- [ ] Test with multiple channels
- [ ] Verify analytics data accuracy

### Deployment
- [ ] Update OAuth redirect URIs for production domain
- [ ] Deploy Edge Functions to Supabase
- [ ] Verify database migrations applied
- [ ] Test OAuth flow in production
- [ ] Monitor API quota usage
- [ ] Set up error logging/monitoring
- [ ] Test token refresh in production
- [ ] Verify analytics data loads correctly

---

## Support & Resources

### Official Documentation
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [YouTube Analytics API v2](https://developers.google.com/youtube/analytics)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

### API Explorers
- [YouTube Data API Explorer](https://developers.google.com/youtube/v3/docs)
- [YouTube Analytics API Explorer](https://developers.google.com/youtube/analytics/v2/reports)

### Rate Limit Monitoring
- [Google Cloud Console - Quotas](https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas)
- [YouTube Analytics Quotas](https://console.cloud.google.com/apis/api/youtubeanalytics.googleapis.com/quotas)

### Troubleshooting
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
- [YouTube API Error Codes](https://developers.google.com/youtube/v3/docs/errors)

---

## Architecture Summary

```
┌─────────────┐
│   User      │
└─────┬───────┘
      │ 1. Click "Connect YouTube"
      ▼
┌─────────────────────┐
│  Frontend (React)   │
│  - youtube-oauth.ts │
│  - token-manager.ts │
│  - youtube-api.ts   │
└──────┬──────────────┘
       │ 2. Generate OAuth URL
       ▼
┌─────────────────────┐
│  Google OAuth 2.0   │
│  Consent Screen     │
└──────┬──────────────┘
       │ 3. User authorizes → returns code
       ▼
┌─────────────────────────────────┐
│  Supabase Edge Function         │
│  exchange-youtube-token         │
│  - Exchange code for tokens     │
│  - Fetch channel ID             │
│  - Store in database            │
└──────┬──────────────────────────┘
       │ 4. Returns channelId + accessToken
       ▼
┌─────────────────────────────────┐
│  Supabase Database              │
│  youtube_tokens table           │
│  - channel_id                   │
│  - access_token                 │
│  - refresh_token                │
│  - token_expiry                 │
└──────┬──────────────────────────┘
       │ 5. Fetch data with token
       ▼
┌─────────────────────────────────┐
│  YouTube APIs                   │
│  - Data API v3 (channel/videos)│
│  - Analytics API v2 (insights) │
└─────────────────────────────────┘
```

---

**Last Updated:** 2025-11-05
**Integration Version:** 1.0
**Maintained By:** Influencer Connect Development Team
