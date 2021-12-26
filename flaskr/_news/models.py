from datetime import datetime as dt

from enum import Enum
import mongoengine as me


class Severity(Enum):
    REMINDER = 'rem'
    NORMAL = 'nor'
    URGENT = 'urg'


class Posts(me.Document):
    created_at = me.DateTimeField(primary_key=True, default=dt.now)
    owner = me.CachedReferenceField(
        'Users', fields=['username'], reverse_delete_rule=me.NULLIFY
    )
    title = me.StringField(required=True)
    content = me.StringField(required=True)
    severity = me.EnumField(Severity)
    is_public = me.BooleanField(required=True)


class NewestPosts(me.Document):
    owner = me.ReferenceField(
        'Users',
        primary_key=True,
        reverse_delete_rule=me.NULLIFY
    )
    time_stamp = me.DateTimeField(default=dt.now)
