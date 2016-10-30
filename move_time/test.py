from selenium import webdriver
from bs4 import BeautifulSoup
import os
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json
from pyvirtualdisplay import Display

display = Display(visible=0, size=(800, 600))
display.start()
url = 'https://www.google.co.jp/maps/dir/'