import mongoengine as me


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
