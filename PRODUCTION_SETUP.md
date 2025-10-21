# Production Setup Guide for Influencer Hub

This guide will help you move your application from test mode to production, allowing anyone to authenticate and use your platform.

## Current Status

Your app is currently in **Testing Mode**, which means:
- ✅ Works perfectly for development
- ❌ Only users you manually add in Google Cloud Console can sign in
- ❌ Maximum of 100 test users
- ❌ Not accessible to the general public

## Steps to Enable Production Access

### 1. Complete OAuth Consent Screen

Go to [Google Cloud Console - OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)

#### Required Information:

**App Information:**
- **App name**: Influencer Hub
- **User support email**: your-email@example.com
- **App logo**: Upload a 120x120px logo (optional but recommended)

**App Domain:**
- **Application home page**: https://yourdomain.com
- **Application privacy policy link**: https://yourdomain.com/privacy
- **Application terms of service link**: https://yourdomain.com/terms

**Authorized domains:**
- Add your production domain: `yourdomain.com`

**Developer contact information:**
- your-email@example.com

**Scopes** (Already configured):
- `https://www.googleapis.com/auth/youtube.readonly`
- `https://www.googleapis.com/auth/yt-analytics.readonly`

### 2. Deploy Your Application

Before submitting for verification, you need a publicly accessible website:

#### Deployment Options:

**Option A: Vercel (Recommended - Easiest)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

**Option B: Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

**Option C: Your Own Server**
- Build: `npm run build`
- Deploy `dist/` folder to your server
- Set up HTTPS (required for OAuth)

#### Required Environment Variables:
```
VITE_SUPABASE_URL=https://mllpdowmnnqzjwnkxvuv.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_YOUTUBE_CLIENT_ID=your_youtube_client_id
VITE_YOUTUBE_REDIRECT_URI=https://yourdomain.com (your production URL)
```

### 3. Update OAuth Redirect URI

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID
3. Add authorized redirect URI: `https://yourdomain.com`
4. Update `VITE_YOUTUBE_REDIRECT_URI` in your environment variables

### 4. Create Legal Pages

The Privacy Policy and Terms of Service pages have been created for you:
- `/src/pages/PrivacyPolicy.tsx`
- `/src/pages/TermsOfService.tsx`

**Important**: Update the contact emails in these files:
- Replace `privacy@yourdomain.com` with your real email
- Replace `support@yourdomain.com` with your real email
- Replace `yourdomain.com` with your actual domain

**Make these pages accessible at:**
- `https://yourdomain.com/privacy`
- `https://yourdomain.com/terms`

### 5. Prepare Verification Materials

Google requires these for apps using restricted scopes (YouTube Analytics):

#### A. Create a YouTube Video Demo (2-3 minutes)
Show:
1. User clicking "Connect YouTube Channel" button
2. OAuth consent screen appearing
3. User granting permissions
4. App displaying channel analytics
5. User can disconnect/revoke access

#### B. Prepare Screenshots
- OAuth consent screen
- App showing influencer profiles
- App displaying analytics
- Brand viewing influencer data

#### C. Write Scope Justification

Example justification for `youtube.readonly` and `yt-analytics.readonly`:

```
Our application, Influencer Hub, connects YouTube content creators with brands.

Why we need youtube.readonly:
- To fetch channel information (name, subscriber count, video count)
- To display video metadata (titles, thumbnails, view counts)
- To show public channel data to potential brand partners

Why we need yt-analytics.readonly:
- To display channel demographics (age, gender, geography)
- To show video performance metrics (watch time, engagement)
- To provide detailed analytics that help brands make informed decisions
- All data is shared with user's explicit consent

User Control:
- Users explicitly consent to share their analytics
- Users can disconnect at any time
- Data is only displayed, never sold or shared with unauthorized parties
```

### 6. Submit for Verification

1. In Google Cloud Console, go to OAuth Consent Screen
2. Click "Publish App"
3. Submit for verification
4. Fill out the verification form with:
   - Link to your deployed app
   - YouTube video demo link
   - Screenshots
   - Scope justifications
   - Privacy policy URL
   - Terms of service URL

### 7. Verification Timeline

**Expected Timeline**: 4-6 weeks
**What happens**:
- Google reviews your app
- They may ask questions or request changes
- Once approved, anyone can use your app

**While waiting for verification**:
- Your app stays in "Testing" mode
- You can add up to 100 test users manually
- Test users can fully use the app

### 8. Domain Verification

You need to verify domain ownership:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your domain property
3. Verify ownership via:
   - DNS TXT record (recommended)
   - HTML file upload
   - HTML meta tag
   - Google Analytics
   - Google Tag Manager

### 9. Post-Approval Steps

Once approved:

1. ✅ Change publishing status to "In Production"
2. ✅ Remove test user restrictions
3. ✅ Anyone can now connect their YouTube channel
4. ✅ Monitor API quota usage in Google Cloud Console

## API Quotas

YouTube Data API v3 has daily quotas:

**Default quota**: 10,000 units/day

**Cost per operation**:
- Channel details: 1 unit
- Videos list: 1 unit
- Analytics report: 50 units (expensive!)

**Example**: If each user connection costs ~150 units (channel + videos + analytics), you can onboard ~60 users per day.

**To increase quota**:
1. Go to Google Cloud Console
2. APIs & Services → YouTube Data API v3
3. Click "Quotas"
4. Request quota increase (provide justification)

## Monitoring

After going live:

**Google Cloud Console**:
- Monitor API usage
- Watch for quota exceeded errors
- Track authentication success rate

**Supabase Dashboard**:
- Monitor database growth
- Check query performance
- Review RLS policy effectiveness

**Application Logs**:
- Track user connections
- Monitor error rates
- Review OAuth success/failure rates

## Security Checklist

Before production:

- [ ] HTTPS enabled on your domain
- [ ] Environment variables set correctly
- [ ] Supabase RLS policies enabled on all tables
- [ ] OAuth redirect URI matches production URL
- [ ] Privacy policy publicly accessible
- [ ] Terms of service publicly accessible
- [ ] Contact emails updated in legal pages
- [ ] API keys not exposed in client-side code
- [ ] Error handling for quota exceeded
- [ ] Rate limiting implemented (if needed)

## Cost Estimates

**Supabase** (Free tier):
- 500MB database storage
- 2GB file storage
- 50,000 monthly active users
- Upgrade to Pro ($25/month) when needed

**Google Cloud** (Free tier):
- 10,000 API units/day
- Request increase when needed (usually granted)

**Hosting** (varies):
- Vercel: Free for hobby projects
- Netlify: Free for hobby projects
- Custom server: $5-20/month

## Support

If you encounter issues:

1. **Google OAuth Issues**: Check [Google OAuth 2.0 docs](https://developers.google.com/identity/protocols/oauth2)
2. **YouTube API Issues**: Check [YouTube Data API docs](https://developers.google.com/youtube/v3)
3. **Verification Issues**: Contact Google Cloud Support

## Next Steps

1. Deploy your application to a public URL
2. Update OAuth consent screen with production URLs
3. Add production redirect URI to OAuth credentials
4. Update environment variables
5. Test with a few users
6. Create demo video
7. Submit for verification
8. Wait for approval (4-6 weeks)
9. Launch to public!

## Quick Reference

**Google Cloud Console**: https://console.cloud.google.com
**OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent
**API Credentials**: https://console.cloud.google.com/apis/credentials
**API Quotas**: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas
**Supabase Dashboard**: https://supabase.com/dashboard
**Google Search Console**: https://search.google.com/search-console

---

## Summary

**To go from testing to production:**

1. ✅ Deploy your app to a public URL with HTTPS
2. ✅ Update OAuth redirect URIs
3. ✅ Make privacy policy and terms publicly accessible
4. ✅ Create a demo video
5. ✅ Submit for Google verification
6. ⏳ Wait 4-6 weeks for approval
7. ✅ Launch to public!

**Important**: You can continue testing with up to 100 test users while waiting for verification approval. Just manually add their email addresses in Google Cloud Console → OAuth Consent Screen → Test Users.
