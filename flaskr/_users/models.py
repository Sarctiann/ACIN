from typing_extensions import Required
import mongoengine as me


class Users(me.Document):
    email = me.EmailField(primary_key=True, required=True)
    username = me.StringField(requred=True, unique_with='email')
    password = me.StringField(required=True)
    first_name = me.StringField(required=True)
    last_name = me.StringField(required=True)
    is_admin = me.BooleanField(required=True, default=False)
