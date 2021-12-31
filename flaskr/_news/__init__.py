from datetime import (datetime as dt, timedelta as td)
from flask import Blueprint, jsonify, request
from mongoengine.queryset.visitor import Q

from flaskr.extensions import jwt
from .models import Posts, Severity, NewestPosts
from flaskr._users import Users


news_api_v1 = Blueprint('news', __name__, url_prefix='/news')


@news_api_v1.post('/fetch-posts')
@jwt.jwt_required
def fetch_posts():

    identity = jwt.get_jwt()['sub']['email']
    user = Users.objects(email=identity).first()
    now = dt.now()
    valid = now - td(days=30)
    # Get newest post from database and format it removing microseconds
    newest_post = NewestPosts.objects().order_by(
        '-time_stamp'
    ).first()['time_stamp'].replace(microsecond=0)
    # Get latest post from request
    last_post = request.get_json()['last_post']
    # Validate conditon to retrieve posts
    return_posts = True
    if last_post:
        if dt.strptime(last_post, "%a, %d %b %Y %H:%M:%S %Z") == newest_post:
            return_posts = False
    res = {}

    if identity:
        if return_posts:
            posts = Posts.objects(
                ((Q(is_public=True) | Q(owner=user))
                    &
                (Q(created_at__lte=now) & Q(created_at__gte=valid)))
            )
            if posts:
                res['posts'] = posts.order_by('-created_at')
                res['newest_post'] = newest_post
            else:
                res['wrn'] = 'No new posts'
        else:
            res['msg'] = 'Already fetched!'
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


@ news_api_v1.post('/create-post')
@ jwt.jwt_required
def create_post():

    identity = jwt.get_jwt()['sub']['email']
    user = Users.objects(email=identity).first()
    data = request.get_json()

    res = {}
    if data:
        if user:
            try:
                time = dt.now()
                if offset:= data.get('days_offset'):
                    time + td(days=int(offset))
                    time.replace(hour=10, minute=30, second=0)
                Posts(
                    owner=user,
                    title=data.get('title', 'Untitled'),
                    content=data.get('content', 'No content'),
                    severity=data.get('severity', Severity.NORMAL),
                    is_public=data.get('is_public', False),
                    created_at=time
                ).save()
                NewestPosts(owner=user).save()
                res['msg'] = 'Post Created'
            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid User'
    else:
        res['err'] = 'No Valid data'
    return jsonify(res)


@ news_api_v1.delete('/delete-post')
@ jwt.jwt_required
def delete_post():

    identity = jwt.get_jwt()['sub']['email']
    user = Users.objects(email=identity).first()
    post_id = dt.fromtimestamp(
        request.get_json()['$date'] / 1000) + td(hours=3)
    res = {}

    post = Posts.objects(created_at=post_id).first()
    if post:
        if user.is_admin or post.owner == user:
            post.delete()
            NewestPosts(owner=user).save()
            res['msg'] = f'Post deleted'
        else:
            res['err'] = 'Invalid Identity'
    else:
        res['wrn'] = 'Post do not exist'

    return jsonify(res)


@ news_api_v1.delete('/purge-old-posts')
@ jwt.jwt_required
def purge_old_posts():

    identity = jwt.get_jwt()
    valid = dt.now() - td(days=30)
    res = {}

    if identity:
        posts = Posts.objects(created_at__lte=valid)
        if posts:
            count = posts.count()
            posts.delete()
            res['msg'] = f'{count} Posts deleted'
        else:
            res['wrn'] = 'No old posts'
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)