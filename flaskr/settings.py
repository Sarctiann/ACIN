import os
import datetime as dt

SECRET_KEY = os.environ.get('SECRET_KEY')
JWT_SECRET_KEY = SECRET_KEY

MONGODB_SETTINGS = {

    'host': os.environ.get('MONGODB_HOST').format(
        user=os.environ.get('MONGODB_USER'),
        pasw=os.environ.get('MONGODB_PASS')
    )
}
JWT_EXPIRES = dt.timedelta(hours=24)
