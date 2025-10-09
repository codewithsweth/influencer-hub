import { OAuthConfig } from '../types/influencer';

const OAUTH_CONFIG: OAuthConfig = {
  clientId: '418254354787-i4qruhsk2e926pbp4eifcpfbr4mug32i.apps.googleusercontent.com',
  redirectUri: window.location.origin + '/oauth/callback',
  scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/userinfo.profile',
};

export const generateAuthUrl = (): string => {
  console.log('\n[OAuth] Generating OAuth URL');
  console.log('[OAuth] Client ID:', OAUTH_CONFIG.clientId);
  console.log('[OAuth] Redirect URI:', OAUTH_CONFIG.redirectUri);
  console.log('[OAuth] Scope:', OAUTH_CONFIG.scope);

  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.clientId,
    redirect_uri: OAUTH_CONFIG.redirectUri,
    response_type: 'token',
    scope: OAUTH_CONFIG.scope,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  console.log('[OAuth] Generated auth URL:', authUrl);
  return authUrl;
};

export const parseOAuthCallback = (): string | null => {
  console.log('\n[OAuth] Parsing OAuth callback');
  const hash = window.location.hash.substring(1);
  console.log('[OAuth] Hash from URL:', hash);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  console.log('[OAuth] Extracted access token:', accessToken ? 'Present' : 'Not found');
  return accessToken;
};

export const clearOAuthCallback = (): void => {
  console.log('[OAuth] Clearing OAuth callback from URL');
  window.history.replaceState(null, '', window.location.pathname);
  console.log('[OAuth] URL cleaned:', window.location.href);
};
