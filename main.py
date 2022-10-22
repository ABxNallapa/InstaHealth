import csv, json, requests, re
from linecache import cache
from email.mime import base
from bs4 import BeautifulSoup
import numpy as np
import pandas as pd
from requests.structures import CaseInsensitiveDict
import myfitnesspal
from datetime import date

def get_goals():
    client = myfitnesspal.Client()

    return client.get_date(date.today().year, date.today().month, date.today().day).goals


def pull_data(search):
  url = "https://trackapi.nutritionix.com/v2/natural/nutrients"

  headers = CaseInsensitiveDict()
  headers["x-app-key"] = "39c6d041dcd2c9a2fa8ee3fdf0ce92d3"
  headers["x-app-id"] = "76b38792"
  headers["Content-Type"] = "application/json"

  data = '{"query": "' + search + '"}'

  response = requests.post(url, headers=headers, data=data)

  raw_list = response.json()

  item_name = raw_list['foods'][0]['food_name']
  item_brand = raw_list['foods'][0]['brand_name']

  print("You searched: " + search + " and we found: " + item_name)

  return raw_list


def calculate_percent(api_list):
  
  goals_dict = get_goals()

  servings = api_list['foods'][0]['serving_qty']
  calories = servings * api_list['foods'][0]['nf_calories']
  carbohydrates = servings * api_list['foods'][0]['nf_total_carbohydrate']
  fat = servings * api_list['foods'][0]['nf_total_fat']
  protein = servings * api_list['foods'][0]['nf_protein']
  sodium = servings * api_list['foods'][0]['nf_sodium']
  sugar = servings * api_list['foods'][0]['nf_sugars']
  edited_dict = {"calories": calories, "carbohydrates": carbohydrates, "fat": fat, "protein": protein, "sodium": sodium, "sugar": sugar}
  
  # print(api_list)

  percent_dict = {}
  for item in goals_dict.items():
    str = item[0]
    percent_dict[str] = edited_dict[str] / item[1]
    percent_dict[str] = round(percent_dict[str]*100, 2)

  return percent_dict


print(calculate_percent(pull_data("beyond burger")))
