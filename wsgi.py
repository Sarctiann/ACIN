# import os
# from dotenv import load_dotenv

# BASE_DIR = os.path.abspath(os.path.dirname(__name__))
# project_folder = os.path.expanduser(BASE_DIR)
# load_dotenv(os.path.join(project_folder, '.env'))

# load_dotenv('.env')

from flaskr import create_app


app = create_app()

if __name__ == "__main__":
    app.run()