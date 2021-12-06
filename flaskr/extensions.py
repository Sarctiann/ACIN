from flask_mongoengine import MongoEngine
import flask_jwt_simple as jwt

DB = MongoEngine()
JWT = jwt.JWTManager()