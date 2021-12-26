from flask import Blueprint, jsonify
from flask_cors import CORS

from flaskr._users import users_api_v1
from flaskr._news import news_api_v1

api_v1 = Blueprint('apiV1', __name__, url_prefix='/api-v1')
api_v1.register_blueprint(users_api_v1)
CORS(users_api_v1)
api_v1.register_blueprint(news_api_v1)
CORS(news_api_v1)

@api_v1.route('/')
def home():
    return jsonify({
        'msg': 'This is the API V1 root'
    })
    