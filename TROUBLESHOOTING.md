# Troubleshooting Guide - Face Emotion Detection App

## Camera Not Working

If clicking "Start Camera" doesn't work, here are the most common issues and solutions:

### 1. **Check Browser Console**
   - Press `F12` or right-click → "Inspect" → "Console" tab
   - Look for any red error messages
   - Share these errors if you need help

### 2. **Browser Compatibility**
   - ✅ **Recommended**: Google Chrome, Microsoft Edge, Firefox
   - ❌ May not work: Internet Explorer, older browsers
   - Make sure your browser is up to date

### 3. **Camera Permissions**
   - When you click "Start Camera", a popup should ask for camera permission
   - Click **"Allow"** or **"Permit"**
   - If you accidentally clicked "Block":
     - **Chrome/Edge**: Click the lock icon in address bar → Camera → Allow
     - **Firefox**: Click the lock icon → Permissions → Camera → Allow

### 4. **Camera Already in Use**
   - Close other apps using the camera (Zoom, Teams, Skype, etc.)
   - Close other browser tabs that might be using the camera
   - Try restarting your browser

### 5. **HTTPS Requirement** (if accessing remotely)
   - Modern browsers require HTTPS for camera access (except localhost)
   - If accessing via IP address (not localhost), use HTTPS
   - For localhost, HTTP is fine

### 6. **face-api.js Not Loading**
   - Check your internet connection
   - The app needs to download AI models from CDN
   - If models don't load, try:
     - Refresh the page
     - Check firewall/antivirus settings
     - Try a different browser

### 7. **Camera Not Found**
   - Make sure a camera is connected to your computer
   - Check Windows Camera app works: Press `Win + Q`, type "Camera"
   - Try unplugging and reconnecting USB cameras

### 8. **Common Error Messages**

   **"getUserMedia is not supported"**
   - Your browser doesn't support camera access
   - Update your browser or use Chrome/Firefox/Edge

   **"Camera permission denied"**
   - Click the lock icon in address bar → Allow camera

   **"No camera found"**
   - Check camera is connected
   - Try Windows Camera app first

   **"Models not loading"**
   - Check internet connection
   - Wait a bit longer (models can take 10-30 seconds)
   - Refresh the page

## Steps to Debug

1. **Open Browser Console** (F12)
2. **Click "Start Camera"**
3. **Check Console for Errors**:
   - If you see "face-api.js is not defined" → Library not loaded
   - If you see "getUserMedia failed" → Permission or camera issue
   - If you see "Models not loaded" → Network or CDN issue

4. **Check Network Tab**:
   - Look for failed requests (red)
   - Check if face-api.js loaded
   - Check if model files are downloading

## Still Not Working?

1. **Restart the server**:
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   python-embedded\python.exe app.py
   ```

2. **Clear browser cache**:
   - Press `Ctrl + Shift + Delete`
   - Clear cached images and files
   - Refresh the page

3. **Try incognito/private mode**:
   - This eliminates extension conflicts

4. **Check server is running**:
   - Visit: http://localhost:5000/api/health
   - Should see: `{"status": "healthy"}`

## Testing Camera Access

To test if your browser can access the camera:

1. Go to: https://www.webrtc-experiment.com/DetectRTC/
2. Check if it detects your camera
3. If it works there, the issue is with the app
4. If it doesn't work there, it's a browser/system issue

## Contact for Help

If none of these solutions work, please share:
1. Browser name and version
2. Error messages from console (F12)
3. What happens when you click "Start Camera"
4. Any error popups you see

