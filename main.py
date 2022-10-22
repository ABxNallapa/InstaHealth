import requests
import json
import myfitnesspal
from datetime import date

kroger_client_id = "instahealth-179c5f3fd5cf54b9a407f14847ee638f3255889021849445767"
kroger_client_secret = "Mj6Lw7QcGm7f3ZGprJMK-NqVdiCUBzaFoxqK8Lyv"


def get_goals():
    client = myfitnesspal.Client()

    return client.get_date(date.today().year, date.today().month, date.today().day).goals

print(get_goals())