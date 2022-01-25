from flask import Blueprint, request, jsonify

from flaskr.extensions import jwt
from flaskr._users.models import Users
from .models import PaymentMethods, Answers, Color, Expressions


answers_api_v1 = Blueprint('answers', __name__, url_prefix='/answers')


# Auxiliar ---------------------------------------------------------------------
# ------------------------------------------------------------------------------

@answers_api_v1.get('/get-all')
@jwt.jwt_required
def get_all():

    identity = jwt.get_jwt()['sub']
    res = {}

    if identity:
        owner = Users.objects(email=identity['email']).first()
        try:
            payment_methods = PaymentMethods.objects().order_by(
                'card_name', 'installments'
            )
            common_answers = Answers.objects(common=True).order_by('order')
            own_answers = Answers.objects(
                owner=owner, common=False
            ).order_by('order')
            sys_regex = Expressions.objects(is_system=True)
            own_regex = Expressions.objects(is_system=False)

            res['answers'] = {}
            wrns = []
            if payment_methods:
                res['answers']['payment_methods'] = payment_methods
            else:
                wrns.append('No Credit Card Available')
            if common_answers:
                res['answers']['common_answers'] = common_answers
            else:
                wrns.append('No Common Answers Available')
            if own_answers:
                res['answers']['own_answers'] = own_answers
            else:
                wrns.append('No Own Answers Available')
            if sys_regex:
                res['answers']['sys_regex'] = sys_regex
            else:
                wrns.append('No System Expressions Available')
            if own_regex:
                res['answers']['own_regex'] = own_regex
            else:
                wrns.append('No Own Expressions Available')

            if wrns:
                res['wrn'] = '\n'.join(wrns)
        except Exception as e:
            res['err'] = str(e)
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


# Credit Cards -----------------------------------------------------------------
# ------------------------------------------------------------------------------


@answers_api_v1.get('/get-payment-methods')
@jwt.jwt_required
def get_payment_methods():

    identity = jwt.get_jwt()['sub']
    res = {}

    if identity:
        try:
            payment_methods = PaymentMethods.objects().order_by(
                'card_name', 'installments'
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
                    'card_name', 'installments'
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
                        'card_name', 'installments'
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
                        'card_name', 'installments'
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
                        'card_name', 'installments'
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
                        'card_name', 'installments'
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


# Answers ----------------------------------------------------------------------
# ------------------------------------------------------------------------------

@answers_api_v1.get('/get-answers')
@jwt.jwt_required
def get_answers():

    identity = jwt.get_jwt()['sub']
    res = {}

    if identity:
        owner = Users.objects(email=identity['email']).first()
        try:
            common_answers = Answers.objects(common=True).order_by('order')
            own_answers = Answers.objects(
                owner=owner, common=False
            ).order_by('order')

            res['answers'] = {}
            wrns = []
            if common_answers:
                res['answers']['common_answers'] = common_answers
            else:
                wrns.append('No Common Answers Available')
            if own_answers:
                res['answers']['own_answers'] = own_answers
            else:
                wrns.append('No Own Answers Available')

            if wrns:
                res['wrn'] = '\n'.join(wrns)
        except Exception as e:
            res['err'] = str(e)
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


@answers_api_v1.post('/create-answer')
@jwt.jwt_required
def create_answer():

    identity = jwt.get_jwt().get('sub')
    res = {}

    if identity:
        owner = Users.objects(email=identity['email']).first()
        data = request.get_json()
        if data and (answer := data.get('answer')):
            try:
                ans = Answers(
                    owner=owner,
                    label=answer.get('label'),
                    color=Color[answer.get('color')],
                    content=answer.get('content'),
                    order=answer.get('order')
                )
                if identity.get('is_admin'):
                    ans.common = answer.get('common', False)
                ans.save()

                res['msg'] = 'Answer stored'
                common_answers = Answers.objects(common=True).order_by('order')
                own_answers = Answers.objects(
                    owner=owner, common=False
                ).order_by('order')

                res['answers'] = {}
                wrns = []
                if common_answers:
                    res['answers']['common_answers'] = common_answers
                else:
                    wrns.append('No Common Answers Available')
                if own_answers:
                    res['answers']['own_answers'] = own_answers
                else:
                    wrns.append('No Own Answers Available')

                if wrns:
                    res['wrn'] = '\n'.join(wrns)

            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity or Unauthorized User'

    return jsonify(res)


@ answers_api_v1.put('/update-answer')
@ jwt.jwt_required
def update_answer():

    identity = jwt.get_jwt().get('sub')
    res = {}

    if identity:
        data = request.get_json()
        owner = Users.objects(email=identity['email']).first()
        if answer := data.get('answer'):
            try:
                if owner.is_admin:
                    ans = Answers.objects(id=answer.get('id')).first()
                else:
                    ans = Answers.objects(
                        id=answer.get('id'), owner=owner
                    ).first()
                ans.update(
                    label=answer.get('label', ans.label),
                    color=Color[answer.get('color', ans.color)],
                    content=answer.get('content', ans.content),
                    order=answer.get('order', ans.order)
                )

                res['msg'] = 'Answer updated'
                common_answers = Answers.objects(common=True).order_by('order')
                own_answers = Answers.objects(
                    owner=owner, common=False
                ).order_by('order')

                res['answers'] = {}
                wrns = []
                if common_answers:
                    res['answers']['common_answers'] = common_answers
                else:
                    wrns.append('No Common Answers Available')
                if own_answers:
                    res['answers']['own_answers'] = own_answers
                else:
                    wrns.append('No Own Answers Available')

                if wrns:
                    res['wrn'] = '\n'.join(wrns)

            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity or Unauthorized User'

    return jsonify(res)


@ answers_api_v1.delete('/delete-answer')
@ jwt.jwt_required
def delete_answer():

    identity = jwt.get_jwt().get('sub')
    res = {}

    if identity:
        data = request.get_json()
        owner = Users.objects(email=identity['email']).first()
        if answer := data.get('answer'):
            try:
                if identity.get('is_admin'):
                    ans = Answers.objects(id=answer.get('id')).first()
                else:
                    ans = Answers.objects(
                        owner=owner, id=answer.get('id')
                    ).first()
                ans.delete()

                res['msg'] = 'Answer deleted'
                common_answers = Answers.objects(common=True).order_by('order')
                own_answers = Answers.objects(
                    owner=owner, common=False
                ).order_by('order')

                res['answers'] = {}
                wrns = []
                if common_answers:
                    res['answers']['common_answers'] = common_answers
                else:
                    wrns.append('No Common Answers Available')
                if own_answers:
                    res['answers']['own_answers'] = own_answers
                else:
                    wrns.append('No Own Answers Available')

                if wrns:
                    res['wrn'] = '\n'.join(wrns)

            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity or Unauthorized User'

    return jsonify(res)


# Expressions ------------------------------------------------------------------
# ------------------------------------------------------------------------------

@answers_api_v1.get('/get-expressions')
@jwt.jwt_required
def get_expressions():

    identity = jwt.get_jwt()['sub']
    res = {}

    if identity:
        owner = Users.objects(email=identity['email']).first()
        try:
            sys_regex = Expressions.objects(is_system=True)
            own_regex = Expressions.objects(owner=owner, is_system=False)

            res['answers'] = {}
            wrns = []
            if sys_regex:
                res['answers']['sys_regex'] = sys_regex
            else:
                wrns.append('No System Expressions Available')
            if own_regex:
                res['answers']['own_regex'] = own_regex
            else:
                wrns.append('No Own Expressions Available')

            if wrns:
                res['wrn'] = '\n'.join(wrns)
        except Exception as e:
            res['err'] = str(e)
    else:
        res['err'] = 'Invalid Identity'

    return jsonify(res)


@answers_api_v1.post('/create-expression')
@jwt.jwt_required
def create_expression():

    identity = jwt.get_jwt().get('sub')
    res = {}

    if identity:
        owner = Users.objects(email=identity['email']).first()
        data = request.get_json()
        if data and (expression := data.get('expression')):
            try:
                exp = Expressions(
                    owner=owner,
                    identifier=expression.get('identifier'),
                    pattern=expression.get('pattern'),
                    replacement=expression.get('replacement')
                )
                if identity.get('is_admin'):
                    exp.is_system = expression.get('is_system', False)
                exp.save()

                res['msg'] = 'Expression stored'
                sys_regex = Expressions.objects(is_system=True)
                own_regex = Expressions.objects(owner=owner, is_system=False)

                res['answers'] = {}
                wrns = []
                if sys_regex:
                    res['answers']['sys_regex'] = sys_regex
                else:
                    wrns.append('No System Expressions Available')
                if own_regex:
                    res['answers']['own_regex'] = own_regex
                else:
                    wrns.append('No Own Expressions Available')

                if wrns:
                    res['wrn'] = '\n'.join(wrns)

            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity or Unauthorized User'

    return jsonify(res)


@ answers_api_v1.put('/update-expression')
@ jwt.jwt_required
def update_expression():

    identity = jwt.get_jwt().get('sub')
    res = {}

    if identity:
        data = request.get_json()
        owner = Users.objects(email=identity['email']).first()
        if expression := data.get('expression'):
            try:
                if owner.is_admin:
                    exp = Expressions.objects(id=expression.get('id')).first()
                else:
                    exp = Expressions.objects(
                        id=expression.get('id'), owner=owner
                    ).first()
                exp.update(
                    identifier=expression.get(
                        'identifier', expression.identifier
                    ),
                    pattern=Color[expression.get(
                        'pattern', expression.pattern
                    )],
                    replacement=expression.get(
                        'replacement', expression.replacement
                    )
                )

                res['msg'] = 'Expression updated'
                sys_regex = Expressions.objects(is_system=True)
                own_regex = Expressions.objects(owner=owner, is_system=False)

                res['answers'] = {}
                wrns = []
                if sys_regex:
                    res['answers']['sys_regex'] = sys_regex
                else:
                    wrns.append('No System Expressions Available')
                if own_regex:
                    res['answers']['own_regex'] = own_regex
                else:
                    wrns.append('No Own Expressions Available')

                if wrns:
                    res['wrn'] = '\n'.join(wrns)

            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity or Unauthorized User'

    return jsonify(res)


@ answers_api_v1.delete('/delete-expression')
@ jwt.jwt_required
def delete_expression():

    identity = jwt.get_jwt().get('sub')
    res = {}

    if identity:
        data = request.get_json()
        owner = Users.objects(email=identity['email']).first()
        if expression := data.get('expression'):
            try:
                if identity.get('is_admin'):
                    exp = Expressions.objects(id=expression.get('id')).first()
                else:
                    exp = Expressions.objects(
                        owner=owner, id=expression.get('id')
                    ).first()
                exp.delete()

                res['msg'] = 'Expression deleted'
                sys_regex = Expressions.objects(is_system=True)
                own_regex = Expressions.objects(owner=owner, is_system=False)

                res['answers'] = {}
                wrns = []
                if sys_regex:
                    res['answers']['sys_regex'] = sys_regex
                else:
                    wrns.append('No System Expressions Available')
                if own_regex:
                    res['answers']['own_regex'] = own_regex
                else:
                    wrns.append('No Own Expressions Available')

                if wrns:
                    res['wrn'] = '\n'.join(wrns)

            except Exception as e:
                res['err'] = str(e)
        else:
            res['err'] = 'Invalid Data'
    else:
        res['err'] = 'Invalid Identity or Unauthorized User'

    return jsonify(res)
