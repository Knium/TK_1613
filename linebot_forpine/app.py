from flask import Flask, request, abort
import urllib, urllib.request
import json
import datetime
import time
import requests

from linebot import (
    LineBotApi, WebhookHandler
)
from linebot.exceptions import (
    InvalidSignatureError
)
from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage, LocationMessage
)

flag = 0
eventdata = {}

app = Flask(__name__)

line_bot_api = LineBotApi('PmU0H7m8V1NwFcHr0xfo9hf1tYRdr5TleAjgdzKTH+kS+LiUqqxCoMqGBrHkp9mMEEmg/lGIf9X8tO0R7SD4oUHnRmJDwDwQwhButjV17oZ5eokcq0ubQ1jUrzKZLLn2ZqdhPqEpw6OjqYGZ1KnjrAdB04t89/1O/w1cDnyilFU=')
handler = WebhookHandler('b2f93c57bf79298e577d414b31248e82')



@app.route("/callback", methods=['POST'])
def callback():
    global flag
    global eventdata

    # get X-Line-Signature header value
    signature = request.headers['X-Line-Signature']

    # get request body as text
    body = request.get_data(as_text=True)
    print(body)

    # handle webhook body
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        abort(400)

    return 'OK'



@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    global flag
    global eventdata
    #line_bot_api.reply_message(event.reply_token,TextSendMessage(text=event.message.text))
    print(flag)
    if flag == 1:
        eventdata['eventName'] = event.message.text
        flag = 2
        line_bot_api.reply_message(event.reply_token,TextSendMessage(text='日時を入力してね'))
        flag = 2
        flag = 2
    elif flag == 2:
        url = 'https://labs.goo.ne.jp/api/chrono'
        appid = '4b611ac26a7d3ad9804948dcd1e4b9e86a774b9bb217e6de6ea4cfe8c7eb14f2'
        message = event.message.text
        data = urllib.parse.urlencode({'app_id':appid,'sentence':message}).encode(encoding='ascii')
        req = urllib.request.Request(url, data)
        response = urllib.request.urlopen(req)
        result = response.read().decode('utf-8')
        data = json.loads(result)
        if len(data['datetime_list']) > 0:
            if 'T' in data['datetime_list'][-1][-1]:
                print(data['datetime_list'][-1][-1])
                apidata = data['datetime_list'][-1][-1].replace('T',' ')
                if ':' in apidata:
                    print(apidata)
                else:
                    apidata = apidata + ':00'
                utc = datetime.datetime.strptime(apidata,'%Y-%m-%d %H:%M')
                unix = time.mktime(utc.timetuple())
                eventdata['eventTime'] = unix

                urlfb = 'https://pine-7ac5b.firebaseio.com/events.json'
                postdata = json.dumps(eventdata)
                rt = requests.post(urlfb,data=postdata)
                #for key,value in rt.__dict__.items():
	                #print("{key} : {value} ".format(key=key, value=value))

                eventdata = {}
                flag = 0

                content = rt._content.decode('utf-8')
                contentdict = json.loads(content)
                rsurl = 'http://pine.url/' + contentdict['name']
                print(rsurl)
                line_bot_api.reply_message(event.reply_token,TextSendMessage(text=rsurl))
            else:
                line_bot_api.reply_message(event.reply_token,TextSendMessage(text='時間まで特定できるようにしろ馬鹿野郎'))
        else:
            line_bot_api.reply_message(event.reply_token,TextSendMessage(text='日付すら含まれてません'))
    elif flag == 0:
        print('flag=0')

@handler.add(MessageEvent, message=LocationMessage)
def handle_location(event):
    global flag
    global eventdata
    if flag == 0:
        flag = 1
        eventdata['targetLocation'] = {}
        eventdata['targetLocation']['lat'] = event.message.latitude
        eventdata['targetLocation']['lng'] = event.message.longitude
        line_bot_api.reply_message(event.reply_token,TextSendMessage(text='イベント名入れてね'))
        flag = 1
    else:
        line_bot_api.reply_message(event.reply_token,TextSendMessage(text='今立て込んでるから後にして'))

if __name__ == '__main__':
    
    port = int(os.environ.get('PORT', 5000))
    app.run(port=port)