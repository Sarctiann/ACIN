import mongoengine as me

class User(me.Document):
    first_name = me.StringField()
    last_name = me.StringField()
    is_admin = me.BooleanField()
    is_active = me.BooleanField()
