# Google Calendar API Setup Guide

## Quick Setup (5 minutes)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project** (or use existing)
   - Click "Select a project" → "New Project"
   - Name it something like "Secretairy"
   - Click "Create"

3. **Enable Google Calendar API**
   - In the search bar, type "Google Calendar API"
   - Click on it and press "Enable"

4. **Create Credentials**

   ### API Key (for basic access):
   - Go to "Credentials" in the left menu
   - Click "+ CREATE CREDENTIALS" → "API key"
   - Copy the API key
   
   ### OAuth 2.0 (for user calendar access):
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - If prompted, configure consent screen:
     - Choose "External" (unless you have a Google Workspace)
     - Fill in app name: "Secretairy"
     - Add your email
     - Skip the optional fields
   - For Application type: choose "Web application"
   - Add Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:4173`
     - Your production URL (if you have one)
   - Click "Create"
   - Copy the Client ID

5. **Add to your .env.local**
   ```
   PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   PUBLIC_GOOGLE_API_KEY=your-api-key
   ```

6. **Restart your dev server**
   ```bash
   bun run dev
   ```

That's it! The calendar integration will now work.

## Note on Quotas
- Free tier includes 1,000,000 requests per day
- More than enough for personal use
- No credit card required

## Troubleshooting
- If you get "redirect_uri_mismatch", make sure your localhost URL matches exactly
- If calendar doesn't load, check browser console for specific errors