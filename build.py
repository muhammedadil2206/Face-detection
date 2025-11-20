"""
Build script to prepare static files for Netlify deployment
"""
import os
import shutil
from pathlib import Path

def build_static_site():
    """Convert Flask app to static site for Netlify"""
    
    # Create dist directory
    dist_dir = Path('dist')
    if dist_dir.exists():
        shutil.rmtree(dist_dir)
    dist_dir.mkdir()
    
    # Create static directories
    (dist_dir / 'static' / 'css').mkdir(parents=True)
    (dist_dir / 'static' / 'js').mkdir(parents=True)
    (dist_dir / 'static' / 'models').mkdir(parents=True)
    
    # Read the HTML template
    template_path = Path('templates/emotion_detection.html')
    with open(template_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Replace Flask template syntax with static paths
    html_content = html_content.replace(
        '{{ url_for(\'static\', filename=\'css/emotion.css\') }}',
        '/static/css/emotion.css'
    )
    html_content = html_content.replace(
        '{{ url_for(\'static\', filename=\'js/emotion-detection.js\') }}',
        '/static/js/emotion-detection.js'
    )
    
    # Write index.html
    with open(dist_dir / 'index.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    # Copy static files
    print("Copying static files...")
    
    # Copy CSS
    shutil.copytree('static/css', dist_dir / 'static' / 'css', dirs_exist_ok=True)
    
    # Copy JS
    shutil.copytree('static/js', dist_dir / 'static' / 'js', dirs_exist_ok=True)
    
    # Copy models if they exist
    if Path('static/models').exists():
        shutil.copytree('static/models', dist_dir / 'static' / 'models', dirs_exist_ok=True)
    
    print(f"Static site built successfully in {dist_dir}/")
    print("Ready for Netlify deployment!")

if __name__ == '__main__':
    build_static_site()

