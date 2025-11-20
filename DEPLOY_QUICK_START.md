# Quick Start: Deploy to Netlify 🚀

Your Face Emotion Detection app is ready for Netlify! Follow these simple steps:

## Method 1: Deploy via GitHub (Recommended) ⭐

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Ready for Netlify deployment"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Go to Netlify**:
   - Visit [app.netlify.com](https://app.netlify.com)
   - Sign up/Login (use GitHub to sign in)

3. **Import your project**:
   - Click "Add new site" → "Import an existing project"
   - Select "GitHub" and authorize Netlify
   - Choose your repository

4. **Configure build settings** (usually auto-detected):
   - Build command: `python3 build.py` or `python build.py`
   - Publish directory: `dist`

5. **Click "Deploy site"** ✨

That's it! Your site will be live in 1-2 minutes at `https://your-site-name.netlify.app`

## Method 2: Drag & Drop Deployment

1. **Build locally**:
   ```bash
   python build.py
   ```

2. **Go to Netlify**:
   - Visit [app.netlify.com](https://app.netlify.com)
   - Drag the `dist` folder to the deployment area

Done! Your site is live instantly.

## Method 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
python build.py

# Deploy
netlify deploy --prod
```

## ✅ What's Included

- ✅ Static HTML (converted from Flask template)
- ✅ CSS & JavaScript files
- ✅ Health check endpoint (Netlify Function)
- ✅ All configuration files

## 🎯 Important Notes

- **HTTPS is automatic** - Netlify provides free SSL certificate (required for camera access)
- **Custom domain** - Add your own domain in Site settings → Domain management
- **Auto-deploy** - Every push to GitHub automatically deploys (if connected)

## 🔧 Build Requirements

Netlify will automatically install Python 3.11 if needed. The build script (`build.py`) handles everything.

## 📱 Test Your Deployment

1. Visit your Netlify URL
2. Click "Start Camera"
3. Allow camera permissions
4. Start detecting emotions!

## Need Help?

- Check `NETLIFY_DEPLOY.md` for detailed instructions
- View build logs in Netlify dashboard
- Check browser console for errors

Your premium emotion detection app is ready to go live! 🎉

