from flask import Blueprint, jsonify, request

from flaskr.extensions import jwt
from .tools import get_percent, upload_data, store_list
from .Percentages import Percentron
from .models import History
from flaskr._users.models import Users

calculator_api_v1 = Blueprint('calculator', __name__, url_prefix='/calculator')

pct = Percentron()


@calculator_api_v1.post('/price-add-percent')
@jwt.jwt_required
def price_add_percent():

    identity = jwt.get_jwt()['sub']['email']
    user = Users.objects(email=identity).first()
    res = {}

    if identity:
        data = request.get_json()
        if (price := data.get('price')) and (str_date := data.get('str_date')):
            try:

                percent, as_date = get_percent(str_date)
                result = pct.val_increase(percent, val=float(price))

                History(
                    owner=user,
                    calculation=f'${price} + {percent}% = ${result}',
                    footnote=f'(input: {str_date}, as date: {as_date})'
                ).save()

                res['result'] = result
                res['percent'] = percent
                res['as_date'] = as_date

            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


@calculator_api_v1.get('/get-history')
@jwt.jwt_required
def get_history():

    identity = jwt.get_jwt()['sub']['email']
    user = Users.objects(email=identity).first()
    res = {}

    if identity:
        try:
            History.objects(owner=user)[20:].delete()
            history = History.objects(owner=user).order_by('-created_at')
            if history:
                res['hist'] = history
            else:
                res['msg'] = 'No previous calculations'

        except Exception as e:
            res['err'] = str(e)
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


@calculator_api_v1.post('/load-list')
@jwt.jwt_required
def load_list():

    identity = jwt.get_jwt()
    res = {}

    if identity:
        data = request.get_json()
        if list_name := data.get('list_name'):
            try:
                upload_data(list_name)
                res['msg'] = f'{list_name} loaded'

            except Exception as e:
                res['err'] = str(e)
        elif dates := data.get('dates'):
            try:
                list_name = store_list(dates)
                upload_data(list_name)
                res['msg'] = f'{list_name} created and loaded'
            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)
