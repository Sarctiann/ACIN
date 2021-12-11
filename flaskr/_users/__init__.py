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
        user = Users.objects(
            username=data.get('username'),
            is_active=True
        ).first()
        if user and check_password_hash(user.password, data.get('password')):
            return jsonify({
                'user': {
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'token': jwt.create_jwt(identity=user.username)
                }
            })
        else:
            return jsonify({'msg': 'Invalid Credentials'})
    except Exception as e:
        return jsonify({'err': str(e)})


@users_api_v1.get('/signup')
def signup():
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

@users_api_v1.get('/check_auth')
@jwt.jwt_required
def check_auth():

    data = jwt.get_jwt()
    
    return jsonify({
        'identity': data['sub']['identity']
    })

@users_api_v1.get('/test_jwt')
@jwt.jwt_required
def test_jwt_data():

    data = jwt.get_jwt()
    
    return jsonify({
        'JWT_DATA': data
    })