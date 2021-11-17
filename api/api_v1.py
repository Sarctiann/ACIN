from flask import Blueprint, jsonify

from user.user import user_api_v1

api_v1 = Blueprint('apiV1', __name__, url_prefix='/api-v1')
api_v1.register_blueprint(user_api_v1)

@api_v1.route('/')
def home():
    return jsonify({
        'msg': 'Hello from api V1 root'
    })
    