from enum import Enum
import mongoengine as me


class Users(me.Document):
    email = me.EmailField(primary_key=True, required=True)
    username = me.StringField(requred=True, unique_with='email')
    password = me.StringField(required=True)
    first_name = me.StringField(required=True)
    last_name = me.StringField(required=True)
    is_admin = me.BooleanField(required=True, default=False)


class Mode(Enum):
    LIGHT = 'light'
    DARK = 'dark'


class UserSettings(me.Document):
    owner = me.ReferenceField(
        'Users',
        primary_key=True,
        reverse_delete_rule=me.NULLIFY
    )
    theme_mode = me.EnumField(Mode, default=Mode.DARK)
    calculator = me.BooleanField(default=True)
    postsFontFamily = me.StringField(default='Helvetica')
    notifVol = me.FloatField(min_value=0, max_value=1, default=0.1)
