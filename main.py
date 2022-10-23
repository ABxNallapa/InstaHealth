import csv, json, requests, re
from linecache import cache
from email.mime import base
from bs4 import BeautifulSoup
import numpy as np
import pandas as pd
from requests.structures import CaseInsensitiveDict
import myfitnesspal
from datetime import date
from flask import Flask, request

def get_goals():
    client = myfitnesspal.Client()

    return client.get_date(date.today().year, date.today().month, date.today().day).goals

app = Flask(__name__)

@app.route('/pull_data')
def pull_data():
  search = request.args.get('search')
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

  return {"servings": raw_list['foods'][0]['serving_qty'],
          "calories": raw_list['foods'][0]['nf_calories'],
          "carbohydrates": raw_list['foods'][0]['nf_total_carbohydrate'],
          "fat": raw_list['foods'][0]['nf_total_fat'],
          "protein": raw_list['foods'][0]['nf_protein'],
          "sodium": raw_list['foods'][0]['nf_sodium'],
          "sugar": raw_list['foods'][0]['nf_sugars'],}

@app.route('/calculate_percent', methods=['POST'])
def calculate_percent():
  
  goals_dict = get_goals()

  api_list = request.get_json()
  servings = api_list['servings']
  calories = servings * api_list['calories']
  carbohydrates = servings * api_list['carbohydrates']
  fat = servings * api_list['fat']
  protein = servings * api_list['protein']
  sodium = servings * api_list['sodium']
  sugar = servings * api_list['sugar']
  all_serv_dict = {"calories": calories, "carbohydrates": carbohydrates, "fat": fat, "protein": protein, "sodium": sodium, "sugar": sugar}

  per_serv_dict = {"calories": api_list['servings'], "carbohydrates": api_list['carbohydrates'], "fat": api_list['fat'], "protein": api_list['protein'], "sodium": api_list['sodium'], "sugar": api_list['sugar']}
  
  # print(api_list)

  per_serv_percent_dict = {}
  all_serv_percent_dict = {}
  for item in goals_dict.items():
    str = item[0]
    all_serv_percent_dict[str] = all_serv_dict[str] / item[1]
    all_serv_percent_dict[str] = round(all_serv_percent_dict[str]*100, 2)
    per_serv_percent_dict[str] = per_serv_dict[str] / item[1]
    per_serv_percent_dict[str] = round(per_serv_dict[str]*100, 2)

  
  return {"servings_adjusted": all_serv_percent_dict, "per_serving": per_serv_percent_dict}


if __name__ == '__main__':
    # run app in debug mode on port 5000
    app.run(debug=True, port=5000)


# Curl command to make post request to calculate_percent
