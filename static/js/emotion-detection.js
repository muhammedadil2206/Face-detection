// Global variables
let video;
let canvas;
let ctx;
let isDetecting = false;
let detectionInterval;
let modelsLoaded = false;

// Emotion smoothing variables - Set to high smoothing for slow, stable emotion changes
let EMOTION_HISTORY_SIZE = 35; // Number of frames to average (higher = slower changes)
let MIN_CONFIDENCE_THRESHOLD = 0.70; // 70% minimum confidence to show emotion
let SIGNIFICANT_CHANGE_THRESHOLD = 0.20; // 20% change required to update display (higher = slower updates)
let DETECTION_INTERVAL = 250; // Milliseconds between detections (slower = more stable)
let MIN_FRAMES_FOR_SMOOTHING = 15; // Minimum frames before applying smoothing
let emotionHistory = {}; // Store emotion history per face
let lastDisplayedEmotions = {}; // Last displayed emotions

// Emotion labels mapping
const EMOTION_LABELS = {
    happy: '😊 Happy',
    sad: '😢 Sad',
    angry: '😠 Angry',
    surprised: '😲 Surprised',
    fearful: '😨 Fearful',
    disgusted: '🤢 Disgusted',
    neutral: '😐 Neutral'
};

// Initialize on page load
window.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, initializing...');
    
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    
    if (!video || !canvas) {
        console.error('Video or canvas element not found');
        updateEmotionResults('Error: Video or canvas element not found', 'error');
        return;
    }
    
    ctx = canvas.getContext('2d');
    
    // Check if face-api.js is available
    if (typeof faceapi === 'undefined') {
        console.error('face-api.js not loaded');
        updateEmotionResults('Error: face-api.js library not loaded. Please check your internet connection.', 'error');
        return;
    }
    
    // Load face-api.js models
    await loadModels();
});

// Load face-api.js models
async function loadModels() {
    try {
        // Check if face-api.js is loaded
        if (typeof faceapi === 'undefined') {
            updateEmotionResults('Error: face-api.js library not loaded. Please check your internet connection and refresh.', 'error');
            console.error('face-api.js is not defined');
            return;
        }
        
        // Use jsdelivr CDN - more reliable for model loading
        // Using the maintained @vladmandic version
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.14/model';
        
        // Show loading message
        updateEmotionResults('Loading AI models from CDN... This may take 10-30 seconds. Please be patient.', 'loading');
        console.log('Starting to load face-api.js models from:', MODEL_URL);
        
        // Load models with timeout handling
        const loadPromise = Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        
        // Add timeout
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Model loading timeout after 60 seconds')), 60000)
        );
        
        await Promise.race([loadPromise, timeoutPromise]);
        
        modelsLoaded = true;
        console.log('All models loaded successfully');
        updateEmotionResults('Models loaded successfully! Click "Start Camera" to begin.', 'success');
    } catch (error) {
        console.error('Error loading models:', error);
        let errorMsg = 'Error loading AI models. ';
        
        if (error.message.includes('timeout')) {
            errorMsg += 'Loading took too long. Please check your internet connection and refresh.';
        } else if (error.message.includes('404') || error.message.includes('fetch')) {
            errorMsg += 'Models not found. The CDN might be temporarily unavailable. Please try refreshing in a moment.';
        } else {
            errorMsg += error.message + '. Please refresh the page.';
        }
        
        updateEmotionResults(errorMsg, 'error');
    }
}

// Start camera and begin detection
async function startCamera() {
    if (!modelsLoaded) {
        alert('Models are still loading. Please wait...');
        return;
    }
    
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const errorMsg = 'Your browser does not support camera access. Please use Chrome, Firefox, or Edge.';
        alert(errorMsg);
        updateEmotionResults(errorMsg, 'error');
        console.error('getUserMedia is not supported');
        return;
    }
    
    try {
        updateEmotionResults('Requesting camera access...', 'loading');
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 640 }, 
                height: { ideal: 480 },
                facingMode: 'user'
            } 
        });
        
        console.log('Camera stream obtained:', stream);
        video.srcObject = stream;
        
        // Wait for video to be ready
        video.onloadedmetadata = () => {
            console.log('Video metadata loaded. Dimensions:', video.videoWidth, 'x', video.videoHeight);
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Show video status indicator
            const videoStatus = document.getElementById('videoStatus');
            if (videoStatus) {
                videoStatus.classList.remove('hidden');
            }
            
            updateEmotionResults('Camera started! Detecting faces...', 'success');
            startDetection();
        };
        
        video.onerror = (error) => {
            console.error('Video error:', error);
            updateEmotionResults('Error with video stream. Please try stopping and starting again.', 'error');
        };
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        let errorMessage = 'Error accessing camera. ';
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            errorMessage += 'Please allow camera access and try again.';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            errorMessage += 'No camera found. Please connect a camera and try again.';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            errorMessage += 'Camera is already in use by another application.';
        } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
            errorMessage += 'Camera constraints could not be satisfied.';
        } else {
            errorMessage += `Error: ${error.message}`;
        }
        
        alert(errorMessage);
        updateEmotionResults(errorMessage, 'error');
    }
}

// Stop camera
function stopCamera() {
    if (video.srcObject) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
    
    if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
    }
    
    isDetecting = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Hide video status indicator
    const videoStatus = document.getElementById('videoStatus');
    if (videoStatus) {
        videoStatus.classList.add('hidden');
    }
    
    // Clear emotion history
    emotionHistory = {};
    lastDisplayedEmotions = {};
    
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    
    updateEmotionResults('Camera stopped. Click "Start Camera" to begin again.', 'info');
}

// Start emotion detection loop
function startDetection() {
    if (isDetecting) {
        console.log('Detection already running');
        return;
    }
    
    if (!video || video.readyState < 2) {
        console.error('Video not ready');
        updateEmotionResults('Video not ready. Please wait...', 'info');
        return;
    }
    
    isDetecting = true;
    console.log('Starting face detection loop');
    
            detectionInterval = setInterval(async () => {
        try {
            if (!video || video.paused || video.ended) {
                console.warn('Video is paused or ended');
                return;
            }
            
            const detections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320 }))
                .withFaceLandmarks()
                .withFaceExpressions();
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (detections.length > 0) {
                // Draw detections
                const resizedDetections = faceapi.resizeResults(detections, {
                    width: video.videoWidth,
                    height: video.videoHeight
                });
                
                // Draw bounding box and landmarks
                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                
                // Process and display emotions with smoothing
                displayEmotionsWithSmoothing(detections);
            } else {
                // Clear history when no face detected
                emotionHistory = {};
                lastDisplayedEmotions = {};
                updateEmotionResults('No face detected. Please position yourself in front of the camera.', 'info');
            }
        } catch (error) {
            console.error('Error during face detection:', error);
            // Continue detection loop even if one detection fails
        }
    }, DETECTION_INTERVAL); // Detect at configured interval for stable predictions
}

// Add emotion prediction to history for smoothing
function addToEmotionHistory(faceIndex, expressions) {
    if (!emotionHistory[faceIndex]) {
        emotionHistory[faceIndex] = [];
    }
    
    // Add current prediction to history
    emotionHistory[faceIndex].push(expressions);
    
    // Keep only last N predictions
    if (emotionHistory[faceIndex].length > EMOTION_HISTORY_SIZE) {
        emotionHistory[faceIndex].shift();
    }
}

// Calculate averaged emotions from history
function getAveragedEmotions(faceIndex) {
    if (!emotionHistory[faceIndex] || emotionHistory[faceIndex].length === 0) {
        return null;
    }
    
    const history = emotionHistory[faceIndex];
    const averagedExpressions = {};
    
    // Initialize all emotion values
    const allEmotions = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'];
    allEmotions.forEach(emotion => {
        averagedExpressions[emotion] = 0;
    });
    
    // Sum up all predictions
    history.forEach(expressions => {
        allEmotions.forEach(emotion => {
            averagedExpressions[emotion] += expressions[emotion] || 0;
        });
    });
    
    // Average them
    const historySize = history.length;
    allEmotions.forEach(emotion => {
        averagedExpressions[emotion] /= historySize;
    });
    
    return averagedExpressions;
}

// Display emotions with smoothing
function displayEmotionsWithSmoothing(detections) {
    const emotions = [];
    
    detections.forEach((detection, index) => {
        const expressions = detection.expressions;
        
        // Add to history for smoothing
        addToEmotionHistory(index, expressions);
        
        // Get averaged emotions (need at least MIN_FRAMES_FOR_SMOOTHING frames for stability)
        let smoothedExpressions = expressions;
        if (emotionHistory[index] && emotionHistory[index].length >= MIN_FRAMES_FOR_SMOOTHING) {
            smoothedExpressions = getAveragedEmotions(index);
        }
        
        // Sort emotions by confidence (using smoothed values)
        const sortedEmotions = Object.entries(smoothedExpressions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3); // Top 3 emotions
        
        const topEmotion = sortedEmotions[0];
        const emotionName = topEmotion[0];
        const confidence = topEmotion[1];
        
        // Only show emotion if confidence is above threshold
        if (confidence < MIN_CONFIDENCE_THRESHOLD) {
            // If confidence is too low, check if we should keep previous emotion or show "Uncertain"
            const lastEmotion = lastDisplayedEmotions[index];
            if (lastEmotion && Math.abs(confidence - lastEmotion.confidence) < 0.15) {
                // Keep showing previous if change is small
                emotions.push({
                    face: detections.length > 1 ? `Face ${index + 1}` : 'Face',
                    emotion: lastEmotion.emotion,
                    confidence: ((lastEmotion.confidence * 100).toFixed(1)),
                    allEmotions: sortedEmotions.map(([emotion, conf]) => [emotion, conf]),
                    smoothed: true
                });
                return;
            }
        }
        
        // Check if change is significant enough to update
        const lastEmotion = lastDisplayedEmotions[index];
        if (lastEmotion) {
            const confidenceChange = Math.abs(confidence - lastEmotion.confidence);
            const emotionChanged = emotionName !== lastEmotion.emotion;
            
            // Only update if emotion changed OR confidence changed significantly
            if (!emotionChanged && confidenceChange < SIGNIFICANT_CHANGE_THRESHOLD) {
                // Keep previous display
                emotions.push({
                    face: detections.length > 1 ? `Face ${index + 1}` : 'Face',
                    emotion: lastEmotion.emotion,
                    confidence: ((lastEmotion.confidence * 100).toFixed(1)),
                    allEmotions: sortedEmotions.map(([emotion, conf]) => [emotion, conf]),
                    smoothed: true
                });
                return;
            }
        }
        
        // Update last displayed emotion
        lastDisplayedEmotions[index] = {
            emotion: emotionName,
            confidence: confidence
        };
        
            emotions.push({
            face: detections.length > 1 ? `Face ${index + 1}` : 'Face',
            emotion: emotionName,
            confidence: confidence,
            allEmotions: sortedEmotions.map(([emotion, conf]) => [emotion, conf]),
            smoothed: true
        });
    });
    
    // Update UI only if we have emotions to display
    if (emotions.length > 0) {
        updateEmotionResults(emotions);
    }
}

// Display detected emotions (legacy - kept for compatibility)
function displayEmotions(detections) {
    displayEmotionsWithSmoothing(detections);
}

// Update emotion results in the UI
function updateEmotionResults(data, type = 'emotions') {
    const resultsDiv = document.getElementById('emotionResults');
    
    if (type === 'emotions' && Array.isArray(data)) {
        let html = '';
        
        data.forEach((item) => {
            const emotionLabel = EMOTION_LABELS[item.emotion] || item.emotion;
            // Handle confidence - it might be a number (0-1) or string percentage
            let confidenceValue = typeof item.confidence === 'string' 
                ? parseFloat(item.confidence) 
                : (item.confidence > 1 ? item.confidence : item.confidence * 100);
            confidenceValue = Math.min(Math.max(confidenceValue, 0), 100); // Clamp between 0-100
            const barWidth = confidenceValue;
            
            html += `
                <div class="emotion-item">
                    <div class="emotion-header">
                        <span class="face-label">${item.face}</span>
                        <span class="top-emotion">
                            <strong>${emotionLabel}</strong>
                            <span class="confidence">${confidenceValue.toFixed(1)}%</span>
                        </span>
                    </div>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${barWidth}%"></div>
                    </div>
                    <div class="all-emotions">
                        ${item.allEmotions.map(([emotion, conf]) => {
                            const label = EMOTION_LABELS[emotion] || emotion;
                            // Handle confidence - normalize to percentage
                            let confPercent = typeof conf === 'number' 
                                ? (conf > 1 ? conf : conf * 100) 
                                : parseFloat(conf);
                            confPercent = Math.min(Math.max(confPercent, 0), 100);
                            return `<span class="emotion-tag">${label}: ${confPercent.toFixed(1)}%</span>`;
                        }).join('')}
                    </div>
                </div>
            `;
        });
        
        resultsDiv.innerHTML = html;
    } else {
        // Status message with better styling
        const iconClass = type === 'error' ? 'text-red-400' : 
                         type === 'success' ? 'text-green-400' : 
                         type === 'loading' ? 'text-yellow-400' : 'text-blue-400';
        const iconSvg = type === 'error' 
            ? '<svg class="w-12 h-12 ' + iconClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            : type === 'success'
            ? '<svg class="w-12 h-12 ' + iconClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            : '<svg class="w-12 h-12 ' + iconClass + ' animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>';
        
        const className = type === 'error' ? 'error' : 
                         type === 'success' ? 'success' : 
                         type === 'loading' ? 'loading' : 'info';
        
        resultsDiv.innerHTML = `
            <div class="text-center py-12">
                <div class="inline-block p-4 bg-${type === 'error' ? 'red' : type === 'success' ? 'green' : type === 'loading' ? 'yellow' : 'blue'}-500/20 rounded-full mb-4">
                    ${iconSvg}
                </div>
                <p class="${className} font-medium text-lg">${data}</p>
            </div>
        `;
    }
}

