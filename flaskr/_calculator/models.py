from datetime import datetime as dt

import mongoengine as me


class DatesPercents(me.Document):
    str_date = me.StringField(
        primary_key=True, max_length=10, required=True)  # yyyy/mm/dd
    percent = me.FloatField(required=True)


class Lists(me.Document):
    list_name = me.StringField(required=True)


class History(me.Document):
    created_at = me.DateTimeField(primary_key=True, default=dt.now)
    owner = me.ReferenceField('Users', required=True)
    calculation = me.StringField(required=True)
    footnote = me.StringField(required=True)
