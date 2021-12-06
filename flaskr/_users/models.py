import mongoengine as me

class Users(me.Document):
    username = me.StringField()
    password = me.StringField()
    email = me.EmailField()
    first_name = me.StringField()
    last_name = me.StringField()
    is_admin = me.BooleanField()
    is_active = me.BooleanField()
