from selenium import webdriver
from bs4 import BeautifulSoup
import os
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import falcon
#from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import json
from pyvirtualdisplay import Display

def find_time(fx,fy,sx,sy):

    display = Display(visible=0, size=(800, 600))
    display.start()
    print(fx)

    url = 'https://www.google.com/maps/dir/'

    #dcap = dict(DesiredCapabilities.PHANTOMJS)
    #dcap["phantomjs.page.settings.userAgent"] = (
    #    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/53 "
    #    "(KHTML, like Gecko) Chrome/15.0.87"
    #)
    #browser = webdriver.PhantomJS(desired_capabilities=dcap)
    #browser = webdriver.Chrome('/usr/bin/chromedriver')
    browser = webdriver.Firefox()
    #browser.set_window_size(1000,500)
    browser.get(url)

    time.sleep(3)

    sb50 = browser.find_element_by_id('sb_ifc50')
    imput50 = sb50.find_element_by_class_name('tactile-searchbox-input')
    imput50.send_keys(fx + ',' + fy)
    sb51 = browser.find_element_by_id('sb_ifc51')
    imput51 = sb51.find_element_by_class_name('tactile-searchbox-input')
    imput51.send_keys(sx + ',' + sy)
    dbb = browser.find_element_by_class_name("directions-transit-icon")
    dbb.click()

    FILENAME = os.path.join(os.path.dirname(os.path.abspath(__file__)), "screen.png")
    browser.save_screenshot(FILENAME)

    time.sleep(3)

    html_s = browser.page_source.encode('utf-8').decode('ascii', 'ignore')
    bs_obj = BeautifulSoup(html_s,'lxml')

    result = bs_obj.find_all(class_="section-directions-trip-duration")
    print(result)
    print(result[0].string)

    browser.quit()
    return(result[0].string)

class HelloResource(object):

    def on_get(self,req,res):
        msg = {'result':find_time(str(req.get_param('fx')),str(req.get_param('fy')),str(req.get_param('sx')),str(req.get_param('sy')))}
        res.body = json.dumps(msg)

app = falcon.API()
app.add_route("/",HelloResource())

if __name__ == '__main__':
    from wsgiref import simple_server
    httpd = simple_server.make_server("0.0.0.0",8000,app)
    httpd.serve_forever()
