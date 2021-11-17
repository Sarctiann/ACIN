from flask import Blueprint, jsonify

user_api_v1 = Blueprint('user', __name__, url_prefix='/user')

@user_api_v1.route('/signin')
def signin():
    return jsonify({
        'msg': 'Hello from sign in page'
    })

@user_api_v1.route('/signup')
def signup():
    return jsonify({
        'msg': 'Hello from sign up page'
    })