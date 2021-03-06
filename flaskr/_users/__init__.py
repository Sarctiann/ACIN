from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash

from flaskr.extensions import jwt
from .models import Users, UserSettings


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
        sett = UserSettings.objects(owner=user).first()
        if not sett:
            sett = UserSettings(owner=user)
            sett.save()
        if user and check_password_hash(user.password, data.get('password')):
            return jsonify({
                'user': {
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'is_admin': user.is_admin,
                    'token': jwt.create_jwt(identity=user.username)
                },
                'settings': sett
            })
        else:
            return jsonify({'msg': 'Invalid Credentials'})
    except Exception as e:
        return jsonify({'err': str(e)})


@users_api_v1.get('/refresh-auth')
@jwt.jwt_required
def refresh_auth():

    identity = jwt.get_jwt()['sub']['identity']

    try:
        if identity:
            user = Users.objects(username=identity).first()
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
            return jsonify({'err': 'Invalid Identity'})
    except Exception as e:
        return jsonify({'err': str(e)})


@users_api_v1.post('/update-user')
@jwt.jwt_required
def update_user():

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
            )
            msg['msg'] = 'User Updated'
            if user.is_admin:
                user.update(is_admin=data.get('is_admin', user.is_admin))
            if not user.is_admin and data.get('is_admin'):
                msg['err'] = "Can't become admin yourself"
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
                    is_admin=data.get('is_admin', False)
                )
                user.save()
                UserSettings(owner=user).save()
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
    print(users[0]['username'])
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


@users_api_v1.get('/get-user-data')
@jwt.jwt_required
def get_user_data():

    username = jwt.get_jwt()['sub']['identity']
    user = Users.objects(username=username).first()
    res = {}

    if user:
        res['username'] = user.username
        res['first_name'] = user.first_name
        res['last_name'] = user.last_name
        res['is_admin'] = user.is_admin
    else:
        res['err'] = 'Invalid User'

    return jsonify(res)


@users_api_v1.post('/update-other-user')
@jwt.jwt_required
def update_other_user():

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


@users_api_v1.delete('/delete-other-user')
@jwt.jwt_required
def delete_other_user():

    is_admin = jwt.get_jwt()['sub']['is_admin']

    if is_admin:
        data = request.get_json()
        user = Users.objects(email=data.get('email')).first()
        if user:
            try:
                user.delete()
                UserSettings(owner=user).delete()
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


@users_api_v1.put('/update-user-settings')
@jwt.jwt_required
def update_user_settings():

    identity = jwt.get_jwt().get('sub')
    res = {}

    if identity:
        data = request.get_json().get('settings')
        if data:
            user = Users.objects(email=identity['email']).first()
            sett = (
                UserSettings.objects(owner=user).first()
                or
                UserSettings(owner=user)
            )
            if sett:
                try:
                    for k, v in data.items():
                        sett[k] = v
                    sett.save()
                    res['msg'] = 'Settings Updated'
                    res['settings'] = sett
                except Exception as e:
                    res['err'] = str(e)
            else:
                res['err'] = 'Invalid User Settings'
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)
