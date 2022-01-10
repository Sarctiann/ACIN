import os
import math
from flask import Blueprint, jsonify, request, send_from_directory

from flaskr.extensions import jwt
from .tools import (
    pct, get_percent, upload_data, store_list,
    perform_operation_first, perform_operation_second, perform_operation_third
)
from .models import History, DatesPercents, Lists
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

                if isinstance(result, int) or isinstance(result, float):
                    result = round(result, 2)
                    eq = ' = '
                elif isinstance(result, dict):
                    result = {k: round(v, 2) for k, v in result.items()}
                    eq = '\n=\n'
                else:
                    result = tuple((round(v, 2) for v in result))
                    eq = '\n=\n'

                calculation = f'{expression}{eq}{result}'

                for char in '" '+"'":
                    format_calc = calculation.replace(char, '')
                for char in '+-/*=':
                    format_calc = format_calc.replace(char, f' {char} ')
                for char in '{[(':
                    format_calc = format_calc.replace(char, f' {char}')
                for char in ',:}])':
                    format_calc = format_calc.replace(char, f'{char} ')

                hist = History(
                    owner=user,
                    calculation=format_calc,
                    footnote=f'(input: {expression})'
                ).save()

                res['result'] = str(result)
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
                DatesPercents.objects().delete()
                upload_data(list_name)
                res['msg'] = f'{list_name} loaded'

            except Exception as e:
                res['err'] = str(e)
        elif dates := data.get('dates'):
            for i, date in enumerate(dates):
                if date['percent'] == -1:
                    DatesPercents.objects(str_date=date['_id']).delete()
                    dates.pop(i)
            dates.sort(key= lambda x: x['_id'])
            print(dates)
            try:
                list_name = store_list(dates)
                upload_data(list_name)
                res['msg'] = f'{list_name} created and loaded'
                res['new_list'] = list_name
            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


@calculator_api_v1.get('/get-lists-data')
@jwt.jwt_required
def get_list():

    identity = jwt.get_jwt()
    res = {}

    if identity:
        try:
            res['dates'] = DatesPercents.objects().order_by('-str_date')
            res['lists'] = Lists.objects().order_by('-_id')

        except Exception as e:
            res['err'] = str(e)
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


@calculator_api_v1.post('/get-list-file')
@jwt.jwt_required
def get_list_file():

    identity = jwt.get_jwt()
    res = {}

    if identity:
        file_name = request.get_json().get('file_name')
        if file_name:
            try:
                abs_path = os.path.dirname(os.path.abspath(__name__))
                path = os.path.join('all_lists', file_name)
                return send_from_directory(abs_path, path)

            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid data'
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


@calculator_api_v1.delete('/drop-list')
@jwt.jwt_required
def drop_list():

    identity = jwt.get_jwt()
    res = {}

    if identity:
        name = request.get_json().get('file_name')
        list_file = os.path.join('all_lists', name)
        if name and os.path.exists(list_file):
            try:
                Lists.objects(list_name=name).first().delete()
                os.remove(list_file)
                res['msg'] = f'List {name} Dropped'

            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid List file'
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)
