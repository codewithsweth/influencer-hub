import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface RefreshRequest {
  channelId: string;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { channelId }: RefreshRequest = await req.json();

    if (!channelId) {
      return new Response(
        JSON.stringify({ error: 'Missing channelId' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: tokenData, error: fetchError } = await supabase
      .from('youtube_tokens')
      .select('refresh_token')
      .eq('channel_id', channelId)
      .maybeSingle();

    if (fetchError || !tokenData) {
      console.error('Failed to fetch refresh token:', fetchError);
      return new Response(
        JSON.stringify({ error: 'No tokens found for this channel' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const clientId = Deno.env.get('YOUTUBE_CLIENT_ID')!;
    const clientSecret = Deno.env.get('YOUTUBE_CLIENT_SECRET')!;

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: tokenData.refresh_token,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token refresh failed:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to refresh token' }),
        {
          status: tokenResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const tokens: TokenResponse = await tokenResponse.json();

    const tokenExpiry = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    const { error: updateError } = await supabase
      .from('youtube_tokens')
      .update({
        access_token: tokens.access_token,
        token_expiry: tokenExpiry,
        updated_at: new Date().toISOString(),
      })
      .eq('channel_id', channelId);

    if (updateError) {
      console.error('Failed to update tokens:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update tokens' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        accessToken: tokens.access_token,
        expiresAt: tokenExpiry,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in refresh-youtube-token:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});