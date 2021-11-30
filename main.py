import os
from flask import Flask
from flask_cors import CORS

from _config import CONFIG

from _api import api_v1
CORS(api_v1)

app = Flask(
    __name__, 
    static_url_path='',
    static_folder='frontend/build/'
)

app.config['SECRET_KEY'] = CONFIG['SECRET_KEY']
app.config['MONGODB_SETTINGS'] = CONFIG['MONGODB_SETTINGS']

CORS(app)

# REGISTER API
app.register_blueprint(api_v1)

# SERVE FRONTEND
@app.route('/', defaults={'_': None})   # CATCH ALL ROUTES
@app.errorhandler(404)                  # ENABLE RACT ROUTES
def serve(_):
    # discart argument
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(debug=True)