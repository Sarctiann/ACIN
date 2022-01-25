import mongoengine as me
from enum import Enum


class PaymentMethods(me.Document):
    card_name = me.StringField(required=True)
    installments = me.IntField(required=True)
    increase = me.FloatField(required=True)
    pos_code = me.IntField(required=True)
    description = me.StringField()

    meta = {
        'indexes': [
            {'fields': ('card_name', 'installments'), 'unique': True}
        ]
    }


class Color(Enum):
    BLUE = '#1976d2'
    CYAN = '#0097a7'
    GREEN = '#388e3c'
    YELLOW = '#fbc02d'
    ORANGE = '#f57c00'
    RED = '#d32f2f'
    PINK = '#c2185b'
    PURPLE = '#7b1fa2'
    BROWN = '#5d4037'
    GREY = '#455a64'


class Answers(me.Document):
    owner = me.ReferenceField('Users', required=True)
    label = me.StringField(unique=True, required=True)
    color = me.EnumField(Color, required=True, default=Color.GREY)
    content = me.StringField(required=True)
    common = me.BooleanField(default=False)
    order = me.IntField()

class Expressions(me.Document):
    owner = me.ReferenceField('Users', required=True)
    is_system = me.BooleanField(default=False)
    identifier = me.StringField(unique=True, required=True)
    pattern = me.StringField(required=True)
    replacement = me.StringField(required=True)