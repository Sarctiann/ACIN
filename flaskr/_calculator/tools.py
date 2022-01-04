import os
import re
import json
from datetime import datetime as dt

from .models import DatesPercents, Lists
from .Percentages import Percentron


DF = re.compile(r'(\d*)/(\d*)/?(\d*)')
pct = Percentron()


def _format_date(date):

    day, month, year = date.groups()
    t = dt.today()

    if year == '':
        year = month
        month = day
        day = str(t.day)
    if len(year) < 4:
        year = f'{str(t.year)[:4-len(year)]}{year}'

    year = str(max(2000, min(t.year, int(year))))
    month = str(max(1, min(12, int(month))))
    day = str(max(1, min(31, int(day))))

    return f'{year[-4:]}/{month[-2:]:>02}/{day[-2:]:>02}'


def get_percent(str_date):
    """
    Return percentage corresponding to gte passed str_date:
    """
    fDate = None
    if date := DF.search(str_date):
        fDate = _format_date(date)
        from_table = DatesPercents.objects(
            str_date__gte=fDate
        ).order_by('str_date').first()
        percent = from_table.percent if from_table else 0
    else:
        percent = str_date

    return float(percent), fDate


def perform_operation_first(second, third, sign, operation):

    percent, as_date = get_percent(second)
    if sign == 'pri' and operation == 'add':
        first = pct.val_from_increase(percent, val=float(third))
        calculation = f'${first} + {percent}% = ${third}'
    elif sign == 'pri' and operation == 'sub':
        first = pct.val_from_discount(percent, val=float(third))
        calculation = f'${first} - {percent}% = ${third}'
    elif sign == 'per' and operation == 'add':
        first = pct.per_from_addition(percent, per=float(third))
        calculation = f'{first}% + {percent}% = {third}%'
    elif sign == 'per' and operation == 'sub':
        first = pct.per_from_subtraction(percent, per=float(third))
        calculation = f'{first}% - {percent}% = {third}%'
    else:
        first, calculation = None, None

    footnote = f'(inputs: {second = } as date: {as_date} and {third = })'

    return first, calculation, footnote


def perform_operation_second(first, third, sign, operation):

    if sign == 'pri' and operation == 'add':
        second = pct.per_from_val_increase(float(third), val=float(first))
        calculation = f'${first} + {second}% = ${third}'
    elif sign == 'pri' and operation == 'sub':
        second = pct.per_from_val_discount(float(third), val=float(first))
        calculation = f'${first} - {second}% = ${third}'
    elif sign == 'per' and operation == 'add':
        second = pct.per_from_per_addition(float(third), per=float(first))
        calculation = f'{first}% + {second}% = {third}%'
    elif sign == 'per' and operation == 'sub':
        second = pct.per_from_per_subtraction(float(third), per=float(first))
        calculation = f'{first}% - {second}% = {third}%'
    else:
        second, calculation = None, None

    footnote = f'(inputs: {first = } and {third = })'

    return second, calculation, footnote


def perform_operation_third(first, second, sign, operation):

    percent, as_date = get_percent(second)
    if sign == 'pri' and operation == 'add':
        third = pct.val_increase(percent, val=float(first))
        calculation = f'${first} + {percent}% = ${third}'
    elif sign == 'pri' and operation == 'sub':
        third = pct.val_discount(percent, val=float(first))
        calculation = f'${first} - {percent}% = ${third}'
    elif sign == 'per' and operation == 'add':
        third = pct.per_addition(percent, per=float(first))
        calculation = f'{first}% + {percent}% = {third}%'
    elif sign == 'per' and operation == 'sub':
        third = pct.per_subtraction(percent, per=float(first))
        calculation = f'{first}% - {percent}% = {third}%'
    else:
        third, calculation = None, None

    footnote = f'(inputs: {first} and {second = } as date: {as_date})'

    return third, calculation, footnote


def upload_data(list_name):

    with open(os.path.join('all_lists', list_name), 'r', encoding='utf-8') as f:
        data = json.load(f)
    try:
        for date, percent in data.items():
            DatesPercents(str_date=date, percent=round(percent, 2)).save()
    except Exception as e:
        print(e)


def store_list(dates):
    today = dt.today()
    new_name = f'list_{today.day:}-{today.month}-{str(today.year)[-2:]}.json'
    new_path = os.path.join('all_lists', new_name)

    try:
        Lists(list_name=new_name)
    except Exception as e:
        print(e)

    with open(new_path, 'w+', encoding='utf-8') as new_file:
        json.dump(dates, new_file, indent=4, ensure_ascii=False)

    return new_name

# def actualizar_fechas(self, vigente: str("date"), porcentaje: float):
#     """
#     Crea una nueva lista actualizando los porcentajes de la anterior,
#     y guarda su ruta en config.
#     """

#     fechas = self.fechas

#     hoy = dt.datetime.now()
#     nf = dt.datetime.strptime(vigente, '%d/%m/%Y') - dt.timedelta(days=1)

#     fechas[f'{nf.year:02}/{nf.month:02}/{nf.day:02}'] = 0

#     for f, p in fechas.items():
#         fechas[f] = p + porcentaje + (p * porcentaje / 100)

#     nueva_lista = {
#         "vigente": vigente,
#         "fechas": fechas
#     }

#     new_name = f'cloud_{hoy.day:}-{hoy.month}-{str(hoy.year)[-2:]}.json'
#     new_path = os.path.join(BASE_DIR, "listas", new_name)

#     with open(new_path, 'w', encoding="utf-8") as new:
#         json.dump(nueva_lista, new, indent=4, ensure_ascii=False)

#     with open(CONFIG_FILE, "r+", encoding='utf-8') as conf:
#         pre_conf = json.load(conf)
#         pre_conf["lista"] = new_path
#         conf.seek(0)
#         json.dump(pre_conf, conf, indent=4, ensure_ascii=False)
#         conf.truncate()

#     self.dicc = self.obtener_fechas()
#     self.fechas = self.dicc['fechas']
