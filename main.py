import csv, json, requests, re
from bs4 import BeautifulSoup
import numpy as np
import pandas as pd

kroger_client_id = "instahealth-179c5f3fd5cf54b9a407f14847ee638f3255889021849445767"
kroger_client_secret = "Mj6Lw7QcGm7f3ZGprJMK-NqVdiCUBzaFoxqK8Lyv"

auth_str = "Authorization: Basic {{base64(" + kroger_client_id + ":" + kroger_client_secret + "}}"
