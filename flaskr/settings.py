# import os
import datetime as dt

import env

SECRET_KEY = env.SECRET_KEY
JWT_SECRET_KEY = SECRET_KEY

MONGODB_SETTINGS = {

    'host': env.MONGODB_HOST.format(
        user=env.MONGODB_USER,
        pasw=env.MONGODB_PASS
    )
}
JWT_EXPIRES = dt.timedelta(hours=24)
