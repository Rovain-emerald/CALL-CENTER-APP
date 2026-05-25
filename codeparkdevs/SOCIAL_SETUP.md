# Social Media Platform Setup Guide

This guide walks you through creating developer apps on each supported platform so Codeparkdevs can connect user accounts for posting, reading metrics, and running ads.

**Redirect URI pattern for all platforms:**
```
{NEXT_PUBLIC_APP_URL}/api/auth/callback/{platform}
```
Example: `https://app.codeparkdevs.com/api/auth/callback/instagram`

---

## All Required Environment Variables (Summary)

Add all of these to your `.env.local` and Vercel project settings.

```env
# ── App ──────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://app.codeparkdevs.com

# ── Instagram / Facebook (Meta) ──────────────────────────────
META_APP_ID=
META_APP_SECRET=
META_REDIRECT_URI=${NEXT_PUBLIC_APP_URL}/api/auth/callback/instagram

# ── Twitter / X ──────────────────────────────────────────────
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
TWITTER_REDIRECT_URI=${NEXT_PUBLIC_APP_URL}/api/auth/callback/twitter

# ── LinkedIn ─────────────────────────────────────────────────
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_REDIRECT_URI=${NEXT_PUBLIC_APP_URL}/api/auth/callback/linkedin

# ── TikTok ───────────────────────────────────────────────────
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
TIKTOK_REDIRECT_URI=${NEXT_PUBLIC_APP_URL}/api/auth/callback/tiktok

# ── YouTube (Google) ─────────────────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=${NEXT_PUBLIC_APP_URL}/api/auth/callback/youtube

# ── Pinterest ────────────────────────────────────────────────
PINTEREST_APP_ID=
PINTEREST_APP_SECRET=
PINTEREST_REDIRECT_URI=${NEXT_PUBLIC_APP_URL}/api/auth/callback/pinterest
```

---

## 1. Instagram & Facebook (Meta)

**Developer Portal:** https://developers.facebook.com/

Instagram posts are managed through the Meta Graph API via a connected Facebook Page. You need a single Meta App that covers both platforms.

### Step-by-Step App Creation

1. Go to https://developers.facebook.com/apps/ and click **Create App**.
2. Select **Business** as the app type, then click **Next**.
3. Enter your **App Name** (e.g., `Codeparkdevs`), provide your contact email, and link your **Business Portfolio** if prompted.
4. Click **Create App** (you may need to complete identity verification).
5. From your app dashboard, click **Add Products** and add:
   - **Facebook Login** — click Set Up, choose **Web**, enter your site URL.
   - **Instagram Graph API** — click Set Up.
6. Go to **Facebook Login > Settings** in the left sidebar:
   - Under **Valid OAuth Redirect URIs**, add:
     ```
     {NEXT_PUBLIC_APP_URL}/api/auth/callback/instagram
     ```
   - Enable **Client OAuth Login** and **Web OAuth Login**.
   - Save changes.
7. Go to **App Settings > Basic**:
   - Copy your **App ID** → `META_APP_ID`
   - Copy your **App Secret** → `META_APP_SECRET`
   - Add your app domain and privacy policy URL (required for review).
8. To go live, click **App Review > Permissions and Features** and request the scopes listed below.

### Required OAuth Scopes

```
pages_show_list
pages_read_engagement
pages_manage_posts
pages_manage_metadata
instagram_basic
instagram_content_publish
instagram_manage_comments
instagram_manage_insights
ads_management
ads_read
business_management
read_insights
```

### Environment Variables

```env
META_APP_ID=your_app_id_here
META_APP_SECRET=your_app_secret_here
META_REDIRECT_URI={NEXT_PUBLIC_APP_URL}/api/auth/callback/instagram
```

### Notes

- Users must connect a **Facebook Page** linked to their Instagram Business/Creator account.
- Use **long-lived tokens** (60-day expiry) and store the refresh logic server-side.
- For ads, your app must be linked to a **Business Portfolio** in Meta Business Manager.
- Test with the **Graph API Explorer** at https://developers.facebook.com/tools/explorer/

---

## 2. Twitter / X

**Developer Portal:** https://developer.twitter.com/

### Step-by-Step App Creation

1. Go to https://developer.twitter.com/en/portal/dashboard and sign in.
2. If you don't have a developer account, apply at https://developer.twitter.com/en/apply-for-access — approval can take 1–3 days.
3. In the dashboard, click **+ Add App** or create a new **Project** first, then add an app inside it.
4. Name your app (e.g., `codeparkdevs-prod`) and click **Next**.
5. Copy the displayed **API Key** and **API Secret Key** — these are shown only once. Store them securely.
6. Go to your app's **Settings** tab:
   - Under **User authentication settings**, click **Set up**.
   - Set **App permissions** to **Read and Write** (and **Direct Messages** if needed).
   - Set **Type of App** to **Web App, Automated App or Bot**.
   - Enter **Callback URI / Redirect URL**:
     ```
     {NEXT_PUBLIC_APP_URL}/api/auth/callback/twitter
     ```
   - Enter your **Website URL**.
   - Save.
7. Go to the **Keys and Tokens** tab:
   - Under **OAuth 2.0 Client ID and Client Secret**, generate and copy:
     - **Client ID** → `TWITTER_CLIENT_ID`
     - **Client Secret** → `TWITTER_CLIENT_SECRET`
8. For Ads API access, apply separately at https://developer.twitter.com/en/products/twitter-ads

### Required OAuth 2.0 Scopes

```
tweet.read
tweet.write
tweet.moderate.write
users.read
follows.read
follows.write
offline.access
like.read
like.write
list.read
media.write
```

### Environment Variables

```env
TWITTER_CLIENT_ID=your_client_id_here
TWITTER_CLIENT_SECRET=your_client_secret_here
TWITTER_REDIRECT_URI={NEXT_PUBLIC_APP_URL}/api/auth/callback/twitter
```

### Notes

- Use **OAuth 2.0 with PKCE** for user authentication (not OAuth 1.0a).
- Request the `offline.access` scope to receive a **refresh token** for long-lived sessions.
- Free API tier allows 1,500 tweets/month per app. Upgrade to **Basic** ($100/mo) or **Pro** for higher limits.
- Store `access_token` and `refresh_token` in `social_accounts` table; refresh before expiry (typically 2 hours).

---

## 3. LinkedIn

**Developer Portal:** https://www.linkedin.com/developers/

### Step-by-Step App Creation

1. Go to https://www.linkedin.com/developers/apps and click **Create App**.
2. Enter your **App Name**, link your **LinkedIn Company Page** (required), upload a logo, and accept the legal agreement.
3. Click **Create App**.
4. Go to the **Auth** tab of your new app:
   - Under **OAuth 2.0 settings**, add your **Authorized redirect URL**:
     ```
     {NEXT_PUBLIC_APP_URL}/api/auth/callback/linkedin
     ```
   - Copy your **Client ID** → `LINKEDIN_CLIENT_ID`
   - Copy your **Client Secret** → `LINKEDIN_CLIENT_SECRET`
5. Go to the **Products** tab and request access to:
   - **Share on LinkedIn** — for posting content
   - **Sign In with LinkedIn using OpenID Connect** — for user auth
   - **Marketing Developer Platform** — for ads and analytics (requires approval)
6. After requesting products, the required scopes will become available on the **Auth** tab.
7. For Marketing Developer Platform access, complete the additional review form LinkedIn provides.

### Required OAuth Scopes

```
openid
profile
email
w_member_social
r_basicprofile
r_organization_social
w_organization_social
rw_organization_admin
r_ads
rw_ads
r_ads_reporting
```

### Environment Variables

```env
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_REDIRECT_URI={NEXT_PUBLIC_APP_URL}/api/auth/callback/linkedin
```

### Notes

- LinkedIn access tokens expire after **60 days**. Use the refresh token endpoint if the `offline_access` scope is approved.
- Posts to Company Pages require the user to be an **admin** of the page.
- The **Marketing Developer Platform** product requires a formal application and business justification — allow 2–4 weeks.
- Test with the **LinkedIn API Explorer** at https://www.linkedin.com/developers/tools/explorer

---

## 4. TikTok

**Developer Portal:** https://developers.tiktok.com/

### Step-by-Step App Creation

1. Go to https://developers.tiktok.com/ and log in with a TikTok account.
2. Click **Manage Apps** > **Create App**.
3. Enter your **App Name**, select **Web** as the platform, and submit.
4. Your app starts in **Sandbox** mode. Fill in all required fields (privacy policy, terms of service URLs, app icon).
5. Go to the **Login Kit** section and add your redirect URI:
   ```
   {NEXT_PUBLIC_APP_URL}/api/auth/callback/tiktok
   ```
6. Go to the **Products** section and enable:
   - **Login Kit** — for OAuth
   - **Content Posting API** — for uploading videos/photos
   - **Research API** — for metrics (requires separate approval)
7. Copy your **Client Key** → `TIKTOK_CLIENT_KEY` and **Client Secret** → `TIKTOK_CLIENT_SECRET` from the **App Info** section.
8. Submit your app for **review** to move from Sandbox to Production. Provide use-case descriptions and demo videos if requested.

### Required OAuth Scopes

```
user.info.basic
user.info.profile
user.info.stats
video.list
video.publish
video.upload
```

### Environment Variables

```env
TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
TIKTOK_REDIRECT_URI={NEXT_PUBLIC_APP_URL}/api/auth/callback/tiktok
```

### Notes

- TikTok uses `client_key` (not `client_id`) — make sure your OAuth requests use the correct parameter name.
- Access tokens expire after **24 hours**; refresh tokens last **365 days**.
- In Sandbox mode, only added test accounts can authenticate. Add testers under **Sandbox Management**.
- Video uploads go through a two-step process: **init upload → upload chunks → publish**. Use the Content Posting API docs at https://developers.tiktok.com/doc/content-posting-api-get-started

---

## 5. YouTube (Google)

**Developer Portal:** https://console.cloud.google.com/

### Step-by-Step App Creation

1. Go to https://console.cloud.google.com/ and create a new **Project** (e.g., `codeparkdevs`).
2. In the left sidebar, go to **APIs & Services > Library**.
3. Search for and enable the following APIs:
   - **YouTube Data API v3**
   - **YouTube Analytics API**
4. Go to **APIs & Services > OAuth consent screen**:
   - Choose **External** user type.
   - Fill in app name, support email, and developer contact email.
   - Add the scopes listed below.
   - Add test users while in development.
   - Submit for verification when ready for production.
5. Go to **APIs & Services > Credentials** and click **Create Credentials > OAuth client ID**:
   - Application type: **Web application**
   - Name: `Codeparkdevs Web Client`
   - Under **Authorized redirect URIs**, add:
     ```
     {NEXT_PUBLIC_APP_URL}/api/auth/callback/youtube
     ```
   - Click **Create**.
6. Copy your **Client ID** → `GOOGLE_CLIENT_ID` and **Client Secret** → `GOOGLE_CLIENT_SECRET`.

### Required OAuth Scopes

```
https://www.googleapis.com/auth/youtube
https://www.googleapis.com/auth/youtube.upload
https://www.googleapis.com/auth/youtube.readonly
https://www.googleapis.com/auth/youtube.force-ssl
https://www.googleapis.com/auth/youtubepartner
https://www.googleapis.com/auth/yt-analytics.readonly
https://www.googleapis.com/auth/yt-analytics-monetary.readonly
```

### Environment Variables

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI={NEXT_PUBLIC_APP_URL}/api/auth/callback/youtube
```

### Notes

- Request `access_type=offline` and `prompt=consent` in the OAuth URL to always receive a **refresh token**.
- Google access tokens expire after **1 hour**. Refresh proactively using the stored refresh token.
- Sensitive scopes (e.g., `youtube.upload`) require **Google's OAuth verification** — submit your app for review at https://console.cloud.google.com/apis/credentials/consent
- Verification can take 4–6 weeks and requires a privacy policy, demo video, and explanation of data use.
- YouTube video uploads are done via the **resumable upload** protocol for files > 5MB.

---

## 6. Pinterest

**Developer Portal:** https://developers.pinterest.com/

### Step-by-Step App Creation

1. Go to https://developers.pinterest.com/ and click **My Apps** in the top navigation.
2. Click **Connect App** > **Create App**.
3. Fill in your **App Name**, **Description**, and **Website URL**.
4. Under **Redirect URIs**, add:
   ```
   {NEXT_PUBLIC_APP_URL}/api/auth/callback/pinterest
   ```
5. Accept the Developer Terms and click **Create**.
6. Your app starts in **Development** mode (limited to 10 users). To go live:
   - Complete your app profile with a logo and full description.
   - Submit for **Review** via the app dashboard.
7. From the app dashboard, copy:
   - **App ID** → `PINTEREST_APP_ID`
   - **App Secret Key** → `PINTEREST_APP_SECRET`
8. To access the **Ads API**, request access at https://developers.pinterest.com/docs/getting-started/marketing-api/ — requires a managed Pinterest partner account.

### Required OAuth Scopes

```
boards:read
boards:write
pins:read
pins:write
user_accounts:read
catalogs:read
catalogs:write
ads:read
ads:write
```

### Environment Variables

```env
PINTEREST_APP_ID=your_app_id_here
PINTEREST_APP_SECRET=your_app_secret_here
PINTEREST_REDIRECT_URI={NEXT_PUBLIC_APP_URL}/api/auth/callback/pinterest
```

### Notes

- Pinterest uses **OAuth 2.0**. Access tokens expire after **30 days**; refresh tokens after **365 days**.
- In Development mode, only the app owner and up to 9 explicitly added test users can authenticate.
- Pins must include an image URL or media upload. Use the **Media Upload** endpoint for direct uploads.
- Pinterest Ads API is restricted — you need an approved partner account. Contact ads-api@pinterest.com.
- API reference: https://developers.pinterest.com/docs/api/v5/

---

## Common Troubleshooting

| Issue | Solution |
|---|---|
| Redirect URI mismatch | Ensure the URI in your app settings exactly matches `NEXT_PUBLIC_APP_URL` including `https://` and no trailing slash |
| Token expired on first use | Some platforms require the user to re-auth if the app was in sandbox during initial connection |
| Scope not granted | User may have denied a permission during OAuth — check your auth callback for denied scopes and re-prompt |
| App not verified | Users will see a warning screen — add test users in the dev portal to bypass during development |
| Rate limits | Implement exponential backoff. Store `retry-after` headers in Redis/Upstash to pause requests per platform |

---

## Storing Tokens Securely

All OAuth tokens are stored in the `social_accounts` table with RLS enabled. Additional recommendations:

- Encrypt `access_token` and `refresh_token` columns at rest using Supabase Vault or `pgcrypto`.
- Never expose tokens to the client — all social API calls must go through your backend API routes.
- Rotate tokens before expiry using a background job (e.g., Supabase Edge Function on a cron schedule).
- Log all token refresh events in the `audit_logs` table with `action = 'security_event'`.
