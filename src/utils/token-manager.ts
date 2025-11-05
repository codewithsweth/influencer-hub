import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface TokenData {
  channel_id: string;
  access_token: string;
  refresh_token: string;
  token_expiry: string;
}

export const exchangeCodeForToken = async (code: string): Promise<{ channelId: string; accessToken: string }> => {
  const response = await fetch(
    `${supabaseUrl}/functions/v1/exchange-youtube-token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        code,
        redirectUri: window.location.origin,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to exchange code for token');
  }

  const data = await response.json();
  return {
    channelId: data.channelId,
    accessToken: data.accessToken,
  };
};

export const getValidAccessToken = async (channelId: string): Promise<string> => {
  const { data: tokenData, error } = await supabase
    .from('youtube_tokens')
    .select('access_token, token_expiry')
    .eq('channel_id', channelId)
    .maybeSingle();

  if (error || !tokenData) {
    throw new Error('No tokens found for this channel');
  }

  const expiryTime = new Date(tokenData.token_expiry).getTime();
  const currentTime = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (expiryTime > currentTime + fiveMinutes) {
    return tokenData.access_token;
  }

  return await refreshToken(channelId);
};

const refreshToken = async (channelId: string): Promise<string> => {
  const response = await fetch(
    `${supabaseUrl}/functions/v1/refresh-youtube-token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ channelId }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to refresh token');
  }

  const data = await response.json();
  return data.accessToken;
};

export const deleteTokens = async (channelId: string): Promise<void> => {
  await supabase
    .from('youtube_tokens')
    .delete()
    .eq('channel_id', channelId);
};
