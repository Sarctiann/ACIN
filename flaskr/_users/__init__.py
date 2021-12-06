from flask import Blueprint, jsonify, request
from mongoengine.fields import EmailField
from werkzeug.security import generate_password_hash, check_password_hash

from flaskr.extensions import jwt
from .models import Users


users_api_v1 = Blueprint('users', __name__, url_prefix='/users')


@users_api_v1.post('/signin')
def signin():
    data = request.get_json()

    if not data.get('username'):
        return jsonify({'msg': 'You must provide a username'})
    if not data.get('password'):
        return jsonify({'msg': 'You must provide a password'})

    try:
        user = Users.objects(username=data.get('username')).first()
        if user and check_password_hash(user.password, data.get('password')):
            return jsonify({
                'user': {
                    'username': user.username,
                    'password': user.username,
                    'email': user.username,
                    'first_name': user.username,
                    'last_name': user.username,
                    'is_admin': user.username,
                    'is_active': user.username,
                    'token': jwt.create_jwt(identity=user.username)
                }
            })
        else:
            return jsonify({'msg': 'Invalid Credentials'})
    except Exception as e:
        return jsonify({'err': str(e)})


@users_api_v1.post('/signup')
def signup1():
    return jsonify({
        'msg': 'I must create a new user'
    })


@users_api_v1.get('/signup')
def signup2():
    user = Users(
        username='Sarctiann',
        password=generate_password_hash('123'),
        email='sebas.sarc@gmail.com',
        first_name='Sebastián',
        last_name='Atlántico',
        is_admin=True,
        is_active=True
    )
    user.save()
    return jsonify({
        'msg': 'User Created'
    })
