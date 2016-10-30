import urllib, urllib.request
import json
#import requests
#curl -X POST -d '{"app_id":"test","sentence":"message"}' 'https://pine-7ac5b.firebaseio.com/members.json'
url = 'https://pine-7ac5b.firebaseio.com/members.json'
data = {"app_id":"test","sentence":"message"}
data2 = urllib.parse.urlencode(data).encode(encoding='utf-8')
response = urllib.request.urlopen(url,data2)
result = response.read().decode('utf-8')
print(result)

#r = requests.post(url, params=data)

#print(r.text)