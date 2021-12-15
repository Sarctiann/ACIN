import os
import datetime as dt

SECRET_KEY = os.environ.get('SECRET_KEY')
JWT_SECRET_KEY = SECRET_KEY
MONGODB_SETTINGS = {

    #BASIC:
    'host': os.environ.get('MONGODB_HOST'),
    'port': int(os.environ.get('MONGODB_PORT')),
    'db': os.environ.get('MONGODB_DB'),

    # AUTHENTICATION:
    'username': os.environ.get('MONGODB_USER'),
    'password': os.environ.get('MONGODB_PASS'),
    'authentication_source': os.environ.get('MONGODB_SOURCE'),
    'authentication_mechanism': os.environ.get('MONGODB_AUTH_MECH')
}
JWT_EXPIRES = dt.timedelta(hours=24)
