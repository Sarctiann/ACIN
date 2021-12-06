from flask import Blueprint, jsonify
from flask_cors import CORS

from flaskr._users import users_api_v1

api_v1 = Blueprint('apiV1', __name__, url_prefix='/api-v1')
api_v1.register_blueprint(users_api_v1)
CORS(users_api_v1)

@api_v1.route('/')
def home():
    return jsonify({
        'msg': 'This is the API V1 root', 
        'users login': 'http://localhost:5000/api-v1/users/signin',
        'users signup': 'http://localhost:5000/api-v1/users/signup'
    })
    