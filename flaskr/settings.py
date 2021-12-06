import os

SECRET_KEY = os.environ.get('SECRET_KEY')
JWT_SECRET_KEY = SECRET_KEY
MONGODB_SETTINGS = {
    'host': os.environ.get('MONGODB_HOST'),
    'port': int(os.environ.get('MONGODB_PORT')),
    'db': os.environ.get('MONGODB_DB')
}