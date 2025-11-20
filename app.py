"""
Main application file for the Face Emotion Detection app.
"""
from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    """Home page route - Emotion Detection."""
    return render_template('emotion_detection.html')

@app.route('/api/health')
def health():
    """Health check endpoint for deployment monitoring."""
    return jsonify({'status': 'healthy', 'message': 'Emotion Detection App is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


