from flask import Flask
import urllib2
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/correlated_queries/<event>')
def getCorrelatedQueries(event):
	url="http://google.com"
	page =urllib2.urlopen(url)
	data=page.read()
	print data
	return event

if __name__ == '__main__':
    app.run()