# Deploy to Netlify - Step by Step Guide

Your Face Emotion Detection app is ready to deploy on Netlify! Since all the AI processing happens in the browser, we can deploy it as a static site.

## Quick Deploy (Recommended)

### Option 1: Deploy via Netlify UI (Easiest)

1. **Test the build locally** (optional):
   ```bash
   python build.py
   ```
   This creates a `dist` folder with static files.

2. **Push to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Face Emotion Detection app"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

3. **Connect to Netlify**:
   - Go to [netlify.com](https://www.netlify.com)
   - Sign up / Log in
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

4. **Configure Build Settings**:
   - **Build command**: `python build.py`
   - **Publish directory**: `dist`
   - **Python version**: 3.11 (if needed, Netlify will detect it)

5. **Deploy**:
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Build the site**:
   ```bash
   python build.py
   ```

4. **Initialize and deploy**:
   ```bash
   netlify init
   # Follow the prompts:
   # - Create & configure a new site
   # - Team: (select your team)
   # - Site name: (choose a name or press enter for random)
   # - Build command: python build.py
   # - Directory to deploy: dist
   ```

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

## What Gets Deployed

- ✅ Static HTML file (converted from Flask template)
- ✅ CSS files (Tailwind + custom styles)
- ✅ JavaScript files (emotion detection logic)
- ✅ Model files (face-api.js models, if downloaded locally)
- ✅ Netlify Function for health check endpoint

## Important Notes

1. **HTTPS Required for Camera**: Netlify automatically provides HTTPS, which is required for camera access in modern browsers.

2. **Static Assets**: All assets are served from CDN or your static files. The app works entirely client-side.

3. **Health Check**: The `/api/health` endpoint is handled by a Netlify Function (serverless).

4. **Build Process**: The `build.py` script converts Flask template syntax to static paths automatically.

## Custom Domain (Optional)

After deployment:
1. Go to your site settings in Netlify
2. Click "Domain settings"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Environment Variables (If Needed)

If you need any environment variables:
1. Go to Site settings → Environment variables
2. Add your variables
3. Redeploy the site

## Troubleshooting

**Build fails?**
- Make sure Python 3.11 is available in Netlify
- Check that `build.py` runs successfully locally
- Review build logs in Netlify dashboard

**Camera not working?**
- Make sure you're using HTTPS (Netlify provides this automatically)
- Check browser console for errors
- Verify camera permissions are granted

**Models not loading?**
- Models load from CDN, so ensure internet connection
- Check that face-api.js CDN is accessible

## Files Created for Netlify

- `netlify.toml` - Netlify configuration
- `build.py` - Build script to create static files
- `netlify/functions/health.js` - Serverless function for health check

Your app is now ready for production deployment on Netlify! 🚀

