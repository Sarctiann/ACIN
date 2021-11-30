from flask import Blueprint, jsonify

users_api_v1 = Blueprint('users', __name__, url_prefix='/users')

@users_api_v1.route('/signin')
def signin():
    return jsonify({
        'msg': 'I must return a token'
    })

@users_api_v1.route('/signup')
def signup():
    return jsonify({
        'msg': 'I must create a new user'
    })