from flask import Blueprint, request, jsonify

from flaskr.extensions import jwt
from .models import PaymentMethods


answers_api_v1 = Blueprint('answers', __name__, url_prefix='/answers')


@answers_api_v1.get('/get-payment-methods')
@jwt.jwt_required
def get_payment_methods():

    identity = jwt.get_jwt()
    res = {}

    if identity:
        try:
            payment_methods = PaymentMethods.objects().order_by(
                'card_name', 'installements'
            )
            if payment_methods:
                res['payment_methods'] = payment_methods
            else:
                res['wrn'] = 'No Credit Card Available'
        except Exception as e:
            res['err'] = str(e)
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


@answers_api_v1.post('/create-payment-method')
@jwt.jwt_required
def create_payment_method():

    identity = jwt.get_jwt().get('sub')
    res = {}

    if identity and identity.get('is_admin'):
        data = request.get_json()
        if method := data.get('method'):
            try:
                PaymentMethods(
                    card_name=method['card_name'],
                    installments=method['installments'],
                    increase=method['increase'],
                    pos_code=method['pos_code'],
                    description=method['description']
                ).save()

                res['msg'] = 'Payment method stored'
                res['payment_methods'] = PaymentMethods.objects().order_by(
                    'card_name', 'installement'
                )
            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity or Unauthorized User'

    return jsonify(res)


@answers_api_v1.put('/update-method')
@jwt.jwt_required
def update_method():

    identity = jwt.get_jwt().get('sub')
    res = {}

    if identity and identity.get('is_admin'):
        data = request.get_json().get('method')
        if data:
            method = PaymentMethods.objects(id=data['id']).first()
            if method:
                try:
                    method.update(
                        card_name=data.get(
                            'card_name', method.card_name),
                        installments=data.get(
                            'installments', method.installments),
                        increase=data.get(
                            'increase', method.increase),
                        pos_code=data.get(
                            'pos_code', method.pos_code),
                        description=data.get(
                            'description', method.description)
                    )
                    res['msg'] = 'Payment method updated'
                    res['payment_methods'] = PaymentMethods.objects().order_by(
                        'card_name', 'installement'
                    )
                except Exception as e:
                    res['err'] = str(e)
            else:
                res['err'] = 'Invalid Payment Method'
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity or Unauthorized User'

    return jsonify(res)


@answers_api_v1.delete('/delete-method')
@jwt.jwt_required
def delete_method():

    identity = jwt.get_jwt().get('sub')
    res = {}

    if identity and identity.get('is_admin'):
        data = request.get_json().get('method')
        if data:
            method = PaymentMethods.objects(id=data['id']).first()
            if method:
                try:
                    method.delete()
                    res['msg'] = 'Payment method deleted'
                    res['payment_methods'] = PaymentMethods.objects().order_by(
                        'card_name', 'installement'
                    )
                except Exception as e:
                    res['err'] = str(e)
            else:
                res['err'] = 'Invalid Payment Method'
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity or Unauthorized User'

    return jsonify(res)

# ------------------------------------------------------------------------------


@answers_api_v1.put('/update-credit-card')
@jwt.jwt_required
def update_credit_card():

    identity = jwt.get_jwt().get('sub')
    res = {}

    if identity and identity.get('is_admin'):
        card = request.get_json().get('name')
        name = request.get_json().get('new_name')
        if card and name:
            methods = PaymentMethods.objects(card_name=card)
            if methods:
                try:
                    methods.update(card_name=name)
                    res['msg'] = 'Card Name updated'
                    res['payment_methods'] = PaymentMethods.objects().order_by(
                        'card_name', 'installement'
                    )
                except Exception as e:
                    res['err'] = str(e)
            else:
                res['err'] = 'Invalid Card Name'
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity or Unauthorized User'

    return jsonify(res)


@answers_api_v1.delete('/delete-credit-card')
@jwt.jwt_required
def delete_credit_card():

    identity = jwt.get_jwt().get('sub')
    res = {}

    if identity and identity.get('is_admin'):
        name = request.get_json().get('card_name')
        if name:
            methods = PaymentMethods.objects(card_name=name)
            if methods:
                try:
                    methods.delete()
                    res['msg'] = 'Credit Card deleted'
                    res['payment_methods'] = PaymentMethods.objects().order_by(
                        'card_name', 'installement'
                    )
                except Exception as e:
                    res['err'] = str(e)
            else:
                res['err'] = 'Invalid Card Name'
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity or Unauthorized User'

    return jsonify(res)
