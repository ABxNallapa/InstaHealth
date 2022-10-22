import base64
import csv, json, requests, re
from linecache import cache
from email.mime import base
from bs4 import BeautifulSoup
import numpy as np
import pandas as pd
from requests.structures import CaseInsensitiveDict
import base64
import myfitnesspal
from datetime import date

def get_goals():
    client = myfitnesspal.Client()

    return client.get_date(date.today().year, date.today().month, date.today().day).goals


def calculate_percent(search):
  url = "https://trackapi.nutritionix.com/v2/natural/nutrients"

  headers = CaseInsensitiveDict()
  headers["x-app-key"] = "39c6d041dcd2c9a2fa8ee3fdf0ce92d3"
  headers["x-app-id"] = "76b38792"
  headers["Content-Type"] = "application/json"

  data = '{"query": "' + search + '"}'

  response = requests.post(url, headers=headers, data=data)

  raw_list = response.json()
  servings = raw_list['foods'][0]['serving_qty']
  calories = servings * raw_list['foods'][0]['nf_calories']
  carbohydrates = servings * raw_list['foods'][0]['nf_total_carbohydrate']
  fat = servings * raw_list['foods'][0]['nf_total_fat']
  protein = servings * raw_list['foods'][0]['nf_protein']
  sodium = servings * raw_list['foods'][0]['nf_sodium']
  sugar = servings * raw_list['foods'][0]['nf_sugars']
  edited_dict = {"calories": calories, "carbohydrates": carbohydrates, "fat": fat, "protein": protein, "sodium": sodium, "sugar": sugar}

  goals_dict = get_goals()
  
  percent_dict = {}
  for item in goals_dict.items():
    str = item[0]
    percent_dict[str] = edited_dict[str] / item[1]
    percent_dict[str] = round(percent_dict[str]*100, 2)    

  return percent_dict

print(calculate_percent("Pocky"))
