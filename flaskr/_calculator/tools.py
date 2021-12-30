import os
import re
import json
from datetime import datetime as dt

from .models import DatesPercents, Lists


DF = re.compile(r'(\d*)/(\d*)/?(\d*)')


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
