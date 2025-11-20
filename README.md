# Face Emotion Detection Application

A real-time face emotion detection web application built with Flask and face-api.js. Detects emotions (happy, sad, angry, surprised, fearful, disgusted, neutral) through your camera.

## Features

- 🎥 Real-time face detection using webcam
- 😊 Emotion recognition (Happy, Sad, Angry, Surprised, Fearful, Disgusted, Neutral)
- 📊 Confidence scores for each detected emotion
- 🎨 Modern, responsive UI
- ✅ Health check endpoint for monitoring
- 🚀 Ready for deployment on various platforms

## Local Development

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
```

2. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
python app.py
```

The app will be available at `http://localhost:5000`

## Deployment

This application can be deployed on various platforms:

### Deploy to Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Deploy: `git push heroku main`

### Deploy to Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`

### Deploy to Render

1. Connect your GitHub repository
2. Create a new Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn app:app`

### Deploy with Docker

1. Build image: `docker build -t python-app .`
2. Run container: `docker run -p 5000:5000 python-app`

## Project Structure

```
.
├── app.py              # Main application file
├── requirements.txt    # Python dependencies
├── templates/         # HTML templates
│   └── index.html
├── static/            # Static files (CSS, JS, images)
└── README.md          # This file
```

## API Endpoints

- `GET /` - Emotion detection page with camera interface
- `GET /api/health` - Health check endpoint

## How to Use

1. Start the application (see Setup above)
2. Open your browser and go to `http://localhost:5000`
3. Click "Start Camera" button
4. Allow camera access when prompted
5. Position yourself in front of the camera
6. Watch real-time emotion detection with confidence scores

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **AI Models**: face-api.js (TinyFaceDetector, FaceExpressionNet)
- **Camera Access**: MediaDevices API (getUserMedia)


