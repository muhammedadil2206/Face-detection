"""
Script to download face-api.js models for local use
"""
import os
import urllib.request
from pathlib import Path

# Models to download from unpkg CDN
MODELS = {
    'tiny_face_detector_model-weights_manifest.json': 'https://unpkg.com/@vladmandic/face-api@1.7.14/model/tiny_face_detector_model-weights_manifest.json',
    'tiny_face_detector_model-shard1': 'https://unpkg.com/@vladmandic/face-api@1.7.14/model/tiny_face_detector_model-shard1',
    
    'face_landmark_68_model-weights_manifest.json': 'https://unpkg.com/@vladmandic/face-api@1.7.14/model/face_landmark_68_model-weights_manifest.json',
    'face_landmark_68_model-shard1': 'https://unpkg.com/@vladmandic/face-api@1.7.14/model/face_landmark_68_model-shard1',
    
    'face_recognition_model-weights_manifest.json': 'https://unpkg.com/@vladmandic/face-api@1.7.14/model/face_recognition_model-weights_manifest.json',
    'face_recognition_model-shard1': 'https://unpkg.com/@vladmandic/face-api@1.7.14/model/face_recognition_model-shard1',
    'face_recognition_model-shard2': 'https://unpkg.com/@vladmandic/face-api@1.7.14/model/face_recognition_model-shard2',
    
    'face_expression_model-weights_manifest.json': 'https://unpkg.com/@vladmandic/face-api@1.7.14/model/face_expression_model-weights_manifest.json',
    'face_expression_model-shard1': 'https://unpkg.com/@vladmandic/face-api@1.7.14/model/face_expression_model-shard1',
}

def download_file(url, filepath):
    """Download a file from URL to filepath"""
    try:
        print(f"Downloading {filepath.name}...")
        urllib.request.urlretrieve(url, filepath)
        print(f"OK Downloaded {filepath.name}")
        return True
    except Exception as e:
        print(f"ERROR downloading {filepath.name}: {e}")
        return False

def main():
    models_dir = Path('static/models')
    models_dir.mkdir(parents=True, exist_ok=True)
    
    print("Downloading face-api.js models...")
    print("This may take a few minutes depending on your internet connection.\n")
    
    success_count = 0
    total_count = len(MODELS)
    
    for filename, url in MODELS.items():
        filepath = models_dir / filename
        if filepath.exists():
            print(f"⊘ {filename} already exists, skipping...")
            success_count += 1
        else:
            if download_file(url, filepath):
                success_count += 1
    
    print(f"\n{'='*50}")
    if success_count == total_count:
        print(f"✓ Successfully downloaded/verified {success_count}/{total_count} model files!")
        print("Models are ready to use!")
    else:
        print(f"⚠ Downloaded/verified {success_count}/{total_count} model files.")
        print("Some files failed to download. Please check your internet connection and try again.")

if __name__ == '__main__':
    main()

