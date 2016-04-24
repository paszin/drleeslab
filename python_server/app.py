from flask import Flask,jsonify
import urllib2
import re
app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/correlated_queries/<event>')
def getCorrelatedQueries(event):
	url1 = "https://www.google.com/trends/correlate/search?e="
	url2 = "&t=weekly&p=us&filter="
	event = event.replace(" ", "+")
	page =urllib2.urlopen(url1 + event + url2 + event)
	data=page.read()
	resultIndexes = [m.start() for m in re.finditer('<li class="result', data)]
	correlatedQueries = []
	endIndex = -1
	for i in range(0, len(resultIndexes)-1):
		thisData = data[resultIndexes[i]:resultIndexes[i+1]]
		startIndex = thisData.index('event="') + 7
		semiColonIndexes = [z.start() for z in re.finditer('"', thisData)]
		for thisIndex in semiColonIndexes:
			if (thisIndex > startIndex):
				endIndex = thisIndex
				break
		correlatedQueries.append(thisData[startIndex:endIndex])
	print correlatedQueries
	return jsonify(results=correlatedQueries)

@app.route('/correlated_queries/<event>/<correlated_query>')
def getCorrelatedQueriesPlots(event, correlated_query):
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