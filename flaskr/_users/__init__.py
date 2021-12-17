from flask import Blueprint, jsonify, request
from flask_jwt_simple.view_decorators import jwt_required
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
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'is_admin': user.is_admin,
                    'token': jwt.create_jwt(identity=user.username)
                }
            })
        else:
            return jsonify({'msg': 'Invalid Credentials'})
    except Exception as e:
        return jsonify({'err': str(e)})


@users_api_v1.get('/check-auth')
@jwt.jwt_required
def check_auth():

    data = jwt.get_jwt()

    return jsonify({
        'identity': data['sub']['identity']
    })


@users_api_v1.get('/get-user-data')
@jwt.jwt_required
def get_user_data():

    username = jwt.get_jwt()['sub']['identity']

    user = Users.objects(username=username).first()
    if not user: return jsonify({'err': 'No logged user!'})

    return jsonify({
        'username': username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_admin': user.is_admin
    })


@users_api_v1.post('/update-user')
@jwt.jwt_required
def signuupdate_user():

    identity = jwt.get_jwt()['sub']

    data = request.get_json()
    if not data:
        return jsonify({
            'err': f"User NOT Updated: JSON body was not provided"
        })

    user = Users.objects(username=identity.get('identity')).first()
    if user and check_password_hash(user.password, data.get('password', '')):
        msg = {}
        try:
            user.update(
                first_name=data.get('first_name', user.first_name),
                last_name=data.get('last_name', user.last_name),
                is_admin=data.get('is_admin', user.is_admin)
            )
            msg['msg'] = 'User Updated'
            if (usr := data.get('username')) != user.username:
                user.update(username=usr)
                msg['wrn'] = 'You need to login with the new credentials'
            if (pss := data.get('new_password')):
                user.update(password=generate_password_hash(pss))
            return jsonify(msg)

        except Exception as e:
            return jsonify({
                'err': f'User NOT Updated: {e}'
            })
    else:
        return jsonify({
            'err': 'Invalid Credentials'
        })


@users_api_v1.post('/signup')
@jwt.jwt_required
def signup():

    is_admin = jwt.get_jwt()['sub']['is_admin']

    if is_admin:
        data = request.get_json()
        user = Users.objects(username=data.get('username')).first()
        if not user:
            try:
                user = Users(
                    username=data.get('username'),
                    password=generate_password_hash('abc123'),
                    email=data.get('email'),
                    first_name=data.get('first_name'),
                    last_name=data.get('last_name'),
                    is_admin=data.get('is_admin')
                )
                user.save()
                return jsonify({
                    'msg': 'user_created'
                })
            except Exception as e:
                return jsonify({
                    'err': f'User NOT Created: {e}'
                })
        else:
            return jsonify({
                'err': f"User NOT Created: User '{user.username}' alredy exist"
            })
    else:
        return jsonify({
            'err': f"User NOT Created: Not permission to perform this operation"
        })


@users_api_v1.get('/get-users')
@jwt.jwt_required
def get_users():

    username = jwt.get_jwt()['sub']['identity']
    users = Users.objects(username__ne=username)
    user_response = []

    for user in users:
        user_response.append({
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_admin': user.is_admin
        })

    return jsonify(user_response)


@users_api_v1.post('/update-other-user')
@jwt.jwt_required
def signuupdate_other_user():

    is_admin = jwt.get_jwt()['sub']['is_admin']

    if is_admin:
        data = request.get_json()
        user = Users.objects(email=data.get('email')).first()
        if user:
            try:
                user.update(
                    username=data.get('username'),
                    first_name=data.get('first_name'),
                    last_name=data.get('last_name'),
                    is_admin=data.get('is_admin')
                )
                return jsonify({
                    'msg': 'User Updated'
                })
            except Exception as e:
                return jsonify({
                    'err': f'User NOT Updated: {e}'
                })
        else:
            return jsonify({
                'err': f"User NOT Updated: User do not exist"
            })
    else:
        return jsonify({
            'err': f"User NOT Updated: Not permission to perform this operation"
        })


@users_api_v1.post('/delete-other-user')
@jwt.jwt_required
def delete_other_user():

    is_admin = jwt.get_jwt()['sub']['is_admin']

    if is_admin:
        data = request.get_json()
        user = Users.objects(email=data.get('email')).first()
        if user:
            try:
                user.delete()
                return jsonify({
                    'msg': 'User Deleted'
                })
            except Exception as e:
                return jsonify({
                    'err': f'User NOT Deleted: {e}'
                })
        else:
            return jsonify({
                'err': f"User NOT Deleted: User do not exist"
            })
    else:
        return jsonify({
            'err': f"User NOT Deleted: Not permission to perform this operation"
        })
