import base64
import csv, json, requests, re
from linecache import cache
from email.mime import base
from bs4 import BeautifulSoup
import numpy as np
import pandas as pd
from requests.structures import CaseInsensitiveDict
import base64

url = "https://trackapi.nutritionix.com/v2/search/instant?query=grilled%20cheese"

headers = CaseInsensitiveDict()
headers["x-app-key"] = "39c6d041dcd2c9a2fa8ee3fdf0ce92d3"
headers["x-app-id"] = "76b38792"

resp = requests.get(url, headers=headers)
print(resp.json())