import os
from flask import Flask, send_from_directory
from flask_cors import CORS

from api import api_v1
CORS(api_v1)

app = Flask(
    __name__, 
    static_url_path='',
    static_folder='frontend/build/'
)
CORS(app)

# REGISTER API
app.register_blueprint(api_v1)

# SERVE FRONTEND
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)