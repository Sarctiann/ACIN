from datetime import datetime
from flask import current_app
from flask_mongoengine import MongoEngine
import flask_jwt_simple as jwt

from flaskr._users import Users


# DATABASE ---------------------------------------------------------------------
DB = MongoEngine()

# JWT AUTHORIZATION ------------------------------------------------------------
JWT = jwt.JWTManager()

@JWT.jwt_data_loader
def add_claims_to_access_token(identity):
    user = Users.objects(username=identity, is_active=True).first()

    now = datetime.utcnow()
    return {
        'exp': now + current_app.config['JWT_EXPIRES'],
        'iat': now,
        'nbf': now,
        'sub': {
            'identity': identity,
            'email': user.email,
            'is_admin': user.is_admin
        }
    }
