from flask import Flask
import urllib2
import re
from HTMLParser import HTMLParser
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/correlated_queries/<event>')
def getCorrelatedQueries(event):
	url1 = "https://www.google.com/trends/correlate/search?e="
	url2 = "&t=weekly&p=us"
	event = event.replace(" ", "+")
	page =urllib2.urlopen(url1 + event + url2)
	data=page.read()

@app.route('/correlated_queries/<event>/<correlated_query>')
def getCorrelatedQueriesPlots(event):
	# url1="https://www.google.com/trends/correlate/search?e=fukushima+tsunami&t=weekly&p=us"
	url1 = "https://www.google.com/trends/correlate/search?e="
	url2 = "&t=weekly&p=us"
	event = event.replace(" ", "+")
	page =urllib2.urlopen(url1 + event + url2)
	data=page.read()
	startIndex = data.index("series_set = ") + 13
	semiColonIndexes = [m.start() for m in re.finditer(';', data)]
	for thisIndex in semiColonIndexes:
		if (thisIndex > startIndex):
			endIndex = thisIndex
			break
	print data[startIndex:endIndex]
	return data[startIndex:endIndex]

if __name__ == '__main__':
    app.run(debug=True)