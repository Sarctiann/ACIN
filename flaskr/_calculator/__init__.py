import math
from flask import Blueprint, jsonify, request

from flaskr.extensions import jwt
from .tools import (
    pct, get_percent, upload_data, store_list,
    perform_operation_first, perform_operation_second, perform_operation_third
)
from .models import History
from flaskr._users.models import Users

calculator_api_v1 = Blueprint('calculator', __name__, url_prefix='/calculator')


# For basic calculator ---------------------------------------------------------

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

                hist = History(
                    owner=user,
                    calculation=f'${price} + {percent}% = ${result}',
                    footnote=f'(input: {str_date}, as date: {as_date})'
                ).save()

                res['result'] = result
                res['calculation'] = hist.calculation
                res['footnote'] = hist.footnote

            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


# For complete calculator ------------------------------------------------------

@calculator_api_v1.post('/get-first-term')
@jwt.jwt_required
def get_first_term():

    identity = jwt.get_jwt()['sub']['email']
    user = Users.objects(email=identity).first()
    res = {}

    if identity:
        data = request.get_json()
        if (
                (second := data.get('second'))
                and (third := data.get('third'))
                and (sign := data.get('sign'))
                and (operation := data.get('operation'))
        ):
            try:
                first, calculation, footnote = perform_operation_first(
                    second, third, sign, operation
                )
                History(
                    owner=user,
                    calculation=calculation,
                    footnote=footnote
                ).save()
                res['result'] = str(first)
                res['calculation'] = calculation
                res['footnote'] = footnote

            except Exception as e:
                print(e)
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


@calculator_api_v1.post('/get-second-term')
@jwt.jwt_required
def get_second_term():

    identity = jwt.get_jwt()['sub']['email']
    user = Users.objects(email=identity).first()
    res = {}

    if identity:
        data = request.get_json()
        if (
                (first := data.get('first'))
                and (third := data.get('third'))
                and (sign := data.get('sign'))
                and (operation := data.get('operation'))
        ):
            try:
                second, calculation, footnote = perform_operation_second(
                    first, third, sign, operation
                )
                History(
                    owner=user,
                    calculation=calculation,
                    footnote=footnote
                ).save()
                res['result'] = str(second)
                res['calculation'] = calculation
                res['footnote'] = footnote

            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


@calculator_api_v1.post('/get-result')
@jwt.jwt_required
def get_result():

    identity = jwt.get_jwt()['sub']['email']
    user = Users.objects(email=identity).first()
    res = {}

    if identity:
        data = request.get_json()
        if (
                (first := data.get('first'))
                and (second := data.get('second'))
                and (sign := data.get('sign'))
                and (operation := data.get('operation'))
        ):
            try:
                third, calculation, footnote = perform_operation_third(
                    first, second, sign, operation
                )
                History(
                    owner=user,
                    calculation=calculation,
                    footnote=footnote
                ).save()
                res['result'] = str(third)
                res['calculation'] = calculation
                res['footnote'] = footnote

            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


@calculator_api_v1.post('/resolve-expression')
@jwt.jwt_required
def resolve_expression():

    identity = jwt.get_jwt()['sub']['email']
    user = Users.objects(email=identity).first()
    res = {}

    if identity:
        data = request.get_json()
        if (expression := data.get('expression')):
            try:
                result = eval(expression, {'__builtins__': None}, {'m': math})

                format_exp = expression.replace(' ', '')
                for char in '+-/*':
                    format_exp = format_exp.replace(char, f' {char} ')
                format_exp = format_exp.replace('(', ' (')
                format_exp = format_exp.replace(')', ') ')

                hist = History(
                    owner=user,
                    calculation=f'{format_exp} = {result}',
                    footnote=f'(input: {expression})'
                ).save()

                res['result'] = result
                res['calculation'] = hist.calculation
                res['footnote'] = hist.footnote
            except Exception as e:
                res['err'] = f'Invalid Expression, {str(e)}'
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


# For general purposes ---------------------------------------------------------

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
