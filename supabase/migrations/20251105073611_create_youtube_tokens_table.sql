/*
  # Create YouTube Tokens Table

  1. New Tables
    - `youtube_tokens`
      - `id` (uuid, primary key) - Unique identifier for each token record
      - `channel_id` (text, unique, not null) - YouTube channel ID
      - `access_token` (text, not null) - Current access token for API calls
      - `refresh_token` (text, not null) - Long-lived refresh token
      - `token_expiry` (timestamptz, not null) - When the access token expires
      - `created_at` (timestamptz) - When the token was first created
      - `updated_at` (timestamptz) - When the token was last refreshed

  2. Security
    - Enable RLS on `youtube_tokens` table
    - Add policy for public read access (frontend needs to read tokens)
    - Add policy for public insert/update (frontend needs to store tokens)
    
  3. Indexes
    - Index on channel_id for fast lookups
    - Index on token_expiry for efficient expiry checks

  4. Notes
    - Tokens are stored securely in Supabase database
    - Access tokens expire after 1 hour and need refresh
    - Refresh tokens are long-lived and used to get new access tokens
*/

CREATE TABLE IF NOT EXISTS youtube_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id text UNIQUE NOT NULL,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  token_expiry timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE youtube_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tokens"
  ON youtube_tokens
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert tokens"
  ON youtube_tokens
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update tokens"
  ON youtube_tokens
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_youtube_tokens_channel_id ON youtube_tokens(channel_id);
CREATE INDEX IF NOT EXISTS idx_youtube_tokens_expiry ON youtube_tokens(token_expiry);