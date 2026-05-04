"""
DyslexEase — Flask Backend
Production-ready Python Flask server for DyslexEase platform
Supports: SDG 4 (Quality Education), SDG 10 (Reduced Inequalities), SDG 3 (Good Health)
"""

from flask import Flask, send_from_directory, jsonify, request
import os

app = Flask(__name__, static_folder='.')
app.secret_key = 'dyslexease-secret-key-2026'

# ===== SERVE STATIC FILES =====
@app.route('/')
@app.route('/index.html')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/pages/<path:filename>')
def serve_pages(filename):
    return send_from_directory('pages', filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

# ===== API ENDPOINTS =====

@app.route('/api/format-text', methods=['POST'])
def format_text():
    """Format text for dyslexia-friendly reading"""
    data = request.get_json()
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # Simple formatting: split into chunks
    words = text.split(' ')
    chunks = []
    chunk = []
    for i, word in enumerate(words):
        chunk.append(word)
        if len(chunk) == 7:  # 7 words per line
            chunks.append(' '.join(chunk))
            chunk = []
    if chunk:
        chunks.append(' '.join(chunk))
    
    formatted = '\n\n'.join(chunks)
    
    return jsonify({
        'formatted': formatted,
        'word_count': len(words),
        'chunk_count': len(chunks)
    })

@app.route('/api/analyze-text', methods=['POST'])
def analyze_text():
    """Analyze text for dyslexia difficulty"""
    data = request.get_json()
    text = data.get('text', '')
    
    words = text.split()
    avg_word_len = sum(len(w) for w in words) / len(words) if words else 0
    
    # Simple readability score
    difficulty = 'Easy' if avg_word_len < 4 else ('Medium' if avg_word_len < 6 else 'Hard')
    
    return jsonify({
        'word_count': len(words),
        'avg_word_length': round(avg_word_len, 1),
        'difficulty': difficulty,
        'reading_time_seconds': len(words) * 0.5  # ~0.5s per word for slow reader
    })

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'app': 'DyslexEase',
        'version': '1.0.0',
        'sdgs': ['SDG 3', 'SDG 4', 'SDG 10']
    })

if __name__ == '__main__':
    print("🚀 DyslexEase server starting...")
    print("📖 Visit: http://localhost:5000")
    print("🌍 Supporting: SDG 3, SDG 4, SDG 10")
    app.run(debug=False, host='0.0.0.0', port=5000)