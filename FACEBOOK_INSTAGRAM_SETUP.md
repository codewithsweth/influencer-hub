# Facebook & Instagram Integration Guide

This guide explains how to add Facebook and Instagram to your Influencer Hub platform.

## Overview

The same architecture used for YouTube can be applied to Facebook/Instagram:
1. Influencer connects via OAuth
2. Analytics are fetched and cached in Supabase
3. Brands view cached data (no tokens needed)
4. Data refreshes when influencer logs in

## Meta Platform Setup

### 1. Create Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose app type: **Business**
4. Fill in app details:
   - App Name: Influencer Hub
   - Contact Email: your-email@example.com
   - Business Account: Select or create one

### 2. Configure Basic Settings

In your Meta App Dashboard:

**Basic Settings:**
- App Domains: `yourdomain.com`
- Privacy Policy URL: `https://yourdomain.com/privacy`
- Terms of Service URL: `https://yourdomain.com/terms`
- Category: Business and Pages or Social

### 3. Add Products

Add these products to your app:

**Facebook Login:**
- Click "Set Up" on Facebook Login
- Configure OAuth redirect URIs: `https://yourdomain.com`

**Instagram Basic Display** (for basic profile data):
- Click "Set Up"
- Configure redirect URIs

**Instagram Graph API** (for business insights):
- Available after Instagram Basic Display setup
- Provides analytics and metrics

### 4. Required Permissions (Scopes)

**For Instagram Business/Creator:**
- `instagram_basic` - Basic profile information
- `instagram_manage_insights` - Access to insights data
- `pages_show_list` - List Facebook Pages
- `pages_read_engagement` - Read Page engagement data
- `instagram_manage_comments` - Read comments (optional)
- `instagram_manage_messages` - Read messages (optional)

**For Facebook Pages:**
- `pages_show_list` - List Pages user manages
- `pages_read_engagement` - Read engagement metrics
- `pages_read_user_content` - Read Page content
- `read_insights` - Access Page Insights

### 5. Get App Credentials

In App Dashboard → Settings → Basic:
- **App ID**: Your Facebook App ID
- **App Secret**: Your Facebook App Secret

Add to `.env`:
```
VITE_FACEBOOK_APP_ID=your_app_id
VITE_FACEBOOK_REDIRECT_URI=https://yourdomain.com
```

## Instagram Business Account Requirements

**Important**: Instagram personal accounts cannot access analytics via API.

**What's Required:**
1. Instagram account must be converted to **Business** or **Creator** account
2. Instagram account must be linked to a Facebook Page
3. Facebook Page must be managed by the user

**How to Convert to Business Account:**
1. Go to Instagram app → Profile
2. Menu → Settings → Account
3. Switch to Professional Account
4. Choose Business or Creator
5. Connect to a Facebook Page

## API Endpoints & Data Available

### Instagram Profile Data
```
GET /me?fields=id,username,account_type,media_count,followers_count
```

### Instagram Media (Posts)
```
GET /{user-id}/media?fields=id,caption,media_type,media_url,thumbnail_url,
    permalink,timestamp,like_count,comments_count
```

### Instagram Insights (Analytics)
```
GET /{media-id}/insights?metric=engagement,impressions,reach,saved
GET /{user-id}/insights?metric=follower_count,impressions,reach,
    profile_views&period=day
```

### Audience Demographics
```
GET /{user-id}/insights?metric=audience_city,audience_country,
    audience_gender_age&period=lifetime
```

### Facebook Page Insights
```
GET /{page-id}/insights?metric=page_impressions,page_engaged_users,
    page_fans,page_views_total
```

## Database Schema for Facebook/Instagram

Add these tables to Supabase:

```sql
-- Instagram influencers table
CREATE TABLE instagram_influencers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram_user_id text UNIQUE NOT NULL,
  username text NOT NULL,
  account_type text, -- BUSINESS, CREATOR
  profile_picture_url text,
  followers_count bigint DEFAULT 0,
  following_count bigint DEFAULT 0,
  media_count integer DEFAULT 0,
  biography text,
  website text,
  is_public boolean DEFAULT true,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Instagram media (posts/reels)
CREATE TABLE instagram_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id uuid REFERENCES instagram_influencers(id),
  media_id text UNIQUE NOT NULL,
  media_type text, -- IMAGE, VIDEO, CAROUSEL_ALBUM
  caption text,
  media_url text,
  thumbnail_url text,
  permalink text,
  timestamp timestamptz,
  like_count bigint DEFAULT 0,
  comments_count bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Instagram analytics
CREATE TABLE instagram_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id uuid UNIQUE REFERENCES instagram_influencers(id),
  impressions bigint DEFAULT 0,
  reach bigint DEFAULT 0,
  profile_views bigint DEFAULT 0,
  website_clicks bigint DEFAULT 0,
  audience_city jsonb DEFAULT '[]',
  audience_country jsonb DEFAULT '[]',
  audience_gender_age jsonb DEFAULT '{}',
  cached_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Instagram media insights
CREATE TABLE instagram_media_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid UNIQUE REFERENCES instagram_media(id),
  engagement bigint DEFAULT 0,
  impressions bigint DEFAULT 0,
  reach bigint DEFAULT 0,
  saved bigint DEFAULT 0,
  video_views bigint DEFAULT 0,
  cached_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Facebook pages table
CREATE TABLE facebook_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id text UNIQUE NOT NULL,
  name text NOT NULL,
  category text,
  profile_picture_url text,
  fan_count bigint DEFAULT 0,
  talking_about_count bigint DEFAULT 0,
  is_public boolean DEFAULT true,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE instagram_influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_media_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE facebook_pages ENABLE ROW LEVEL SECURITY;

-- Public read policies (brands can view all public profiles)
CREATE POLICY "Public influencers are viewable"
  ON instagram_influencers FOR SELECT
  USING (is_public = true);

CREATE POLICY "Public media is viewable"
  ON instagram_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM instagram_influencers
      WHERE instagram_influencers.id = instagram_media.influencer_id
      AND instagram_influencers.is_public = true
    )
  );

-- Similar policies for other tables...
```

## OAuth Flow Implementation

### 1. Redirect to Facebook Login

```typescript
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
const REDIRECT_URI = import.meta.env.VITE_FACEBOOK_REDIRECT_URI;

const scopes = [
  'instagram_basic',
  'instagram_manage_insights',
  'pages_show_list',
  'pages_read_engagement',
].join(',');

const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
  `client_id=${FACEBOOK_APP_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=${scopes}` +
  `&response_type=code`;

window.location.href = authUrl;
```

### 2. Exchange Code for Access Token

Facebook returns a `code` (not a token directly like YouTube).

You need to exchange it for an access token:

```typescript
// This MUST be done server-side (use Supabase Edge Function)
const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?` +
  `client_id=${FACEBOOK_APP_ID}` +
  `&redirect_uri=${REDIRECT_URI}` +
  `&client_secret=${FACEBOOK_APP_SECRET}` + // SECRET! Never expose client-side
  `&code=${code}`;

const response = await fetch(tokenUrl);
const { access_token } = await response.json();
```

**Important**: This step requires your App Secret, which must NEVER be exposed in client-side code.

### 3. Get Long-Lived Token (Optional but Recommended)

Short-lived tokens expire in 1 hour. Exchange for 60-day token:

```typescript
const longLivedUrl = `https://graph.facebook.com/v18.0/oauth/access_token?` +
  `grant_type=fb_exchange_token` +
  `&client_id=${FACEBOOK_APP_ID}` +
  `&client_secret=${FACEBOOK_APP_SECRET}` +
  `&fb_exchange_token=${short_lived_token}`;
```

## Implementation Architecture

### Required: Supabase Edge Function

Unlike YouTube (which returns token in URL), Facebook requires server-side token exchange.

**Create edge function**: `supabase/functions/facebook-oauth/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();

    const FACEBOOK_APP_ID = Deno.env.get("FACEBOOK_APP_ID");
    const FACEBOOK_APP_SECRET = Deno.env.get("FACEBOOK_APP_SECRET");
    const REDIRECT_URI = Deno.env.get("FACEBOOK_REDIRECT_URI");

    // Exchange code for token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `client_id=${FACEBOOK_APP_ID}` +
      `&redirect_uri=${REDIRECT_URI}` +
      `&client_secret=${FACEBOOK_APP_SECRET}` +
      `&code=${code}`
    );

    const { access_token } = await tokenResponse.json();

    // Get Instagram Business Account
    const accountsResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${access_token}`
    );
    const accountsData = await accountsResponse.json();

    // Get Instagram account connected to Page
    const pageId = accountsData.data[0]?.id;
    const igAccountResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${access_token}`
    );
    const igData = await igAccountResponse.json();
    const igUserId = igData.instagram_business_account?.id;

    return new Response(
      JSON.stringify({
        access_token,
        ig_user_id: igUserId
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
```

## App Review & Permissions

Similar to YouTube, Facebook requires app review for production:

### 1. Development Mode
- App works for admins, developers, and testers only
- Can add up to 25 test users

### 2. Submit for Review

Required for production access:

**What to Submit:**
- Screencast video showing OAuth flow
- Step-by-step instructions
- Justification for each permission

**Instagram Permissions to Request:**
- `instagram_basic` - Always approved
- `instagram_manage_insights` - Requires review
- `pages_show_list` - Usually approved
- `pages_read_engagement` - Requires review

**Review Time**: 2-4 weeks typically

### 3. Business Verification

For access to advanced features, Meta may require:
- Business verification (documents)
- Website verification
- Phone verification

## Multi-Platform Strategy

### Option 1: Separate Platforms
- Keep YouTube, Instagram, Facebook as separate connections
- Users connect each platform independently
- Brands filter by platform

### Option 2: Unified Profile
- Users connect multiple platforms to one profile
- Show combined metrics
- Cross-platform analytics comparison

### Recommended Database Structure

```sql
-- Main influencer profile (platform-agnostic)
CREATE TABLE influencers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  bio text,
  profile_picture_url text,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Platform connections
CREATE TABLE platform_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id uuid REFERENCES influencers(id),
  platform text NOT NULL, -- 'youtube', 'instagram', 'facebook'
  platform_user_id text NOT NULL,
  platform_username text,
  is_active boolean DEFAULT true,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(platform, platform_user_id)
);
```

## Rate Limits & Quotas

**Instagram Graph API:**
- 200 calls per hour per user
- 4800 calls per hour per app (for all users combined)

**Facebook Graph API:**
- 200 calls per hour per user
- App-level rate limits vary by usage tier

**Best Practice**: Cache aggressively, refresh only when needed

## Cost Estimates

**Meta for Developers:**
- Free for basic usage
- No API quota costs (unlike YouTube)
- Unlimited API calls within rate limits

**Business Verification:**
- Free, but may take time
- Sometimes requires business documents

## Testing Before Review

**How to Test Without App Review:**

1. Add yourself as app admin/developer
2. Add test users (up to 25)
3. Test users can connect and see analytics
4. Perfect for development and demo

**Add Test Users:**
1. App Dashboard → Roles → Test Users
2. Add by Facebook user ID or create test accounts
3. Test users have full access to all permissions

## Comparison: YouTube vs Instagram

| Feature | YouTube | Instagram | Facebook |
|---------|---------|-----------|----------|
| OAuth Flow | Token in URL | Code → Server exchange | Code → Server exchange |
| API Quota | 10k units/day | Rate limit only | Rate limit only |
| Account Type | Any YouTube channel | Business/Creator only | Page required |
| Analytics Depth | Very detailed | Moderate | Moderate |
| Demographics | Yes | Yes | Yes |
| Video Analytics | Excellent | Limited (Reels) | Good |
| Verification Time | 4-6 weeks | 2-4 weeks | 2-4 weeks |
| Cost | Free | Free | Free |

## Next Steps

1. Create Meta App
2. Set up Supabase Edge Function for token exchange
3. Create database tables for Instagram/Facebook data
4. Implement Instagram OAuth flow
5. Fetch and cache Instagram analytics
6. Test with test users
7. Submit for app review
8. Launch to production

## Resources

- **Meta for Developers**: https://developers.facebook.com
- **Instagram Graph API**: https://developers.facebook.com/docs/instagram-api
- **Facebook Graph API**: https://developers.facebook.com/docs/graph-api
- **App Review**: https://developers.facebook.com/docs/app-review
- **Permissions Reference**: https://developers.facebook.com/docs/permissions/reference

---

**Summary**: Yes, you can implement Facebook/Instagram using the same architecture! The main difference is that Facebook requires server-side token exchange (using Supabase Edge Functions), whereas YouTube returns the token directly in the URL.
