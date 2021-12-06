from flask import Flask
from flask_cors import CORS

from .extensions import DB, JWT
from flaskr._api import api_v1


def create_app(config_objet='flaskr.settings'):
    app = Flask(
        __name__,
        static_url_path='',
        static_folder='frontend/build/'
    )
    app.config.from_object(config_objet)

    JWT.init_app(app)
    DB.init_app(app)
    try:
        if DB.get_connection().server_info().get('ok'):
            print(f'Connection OK\n')
    except Exception as e:
        print(f'Unable to connect with DB:\n{e}')

    app.register_blueprint(api_v1)          # REGISTER API
    CORS(api_v1)                            # ENABLE CORS

    # SERVE FRONTEND
    @app.route('/')                         # CATCH ALL ROUTES
    @app.errorhandler(404)                  # ENABLE RACT ROUTES
    def serve(_=None):
        # Discart error
        return app.send_static_file('index.html')

    return app
