from flask import Flask,jsonify, make_response, request
import urllib2
import re
import json
from functools import wraps
app = Flask(__name__)


## cors decorators

def add_response_headers(headers={}):
    '''adds the headers passed in to the response'''
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            resp = make_response(f(*args, **kwargs))
            h = resp.headers
            for header, value in headers.items():
                h[header] = value
            return resp
        return decorated_function
    return decorator


def browser_headers(f):
    '''adds the headers required for browser secrurity'''
    @wraps(f)
    @add_response_headers({'Access-Control-Allow-Origin': '*',
                           'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                           'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'})
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated_function



@app.route('/')
def hello_world():
    return 'Hello World!'

@browser_headers
@app.route('/correlated_queries')
def getCorrelatedQueries():
	args = request.args
	event = args.get('event')
	place = args.get('place')
	if place is None:
		place = 'us'
	url1 = "https://www.google.com/trends/correlate/search?e="
	url2 = "&t=weekly&p=" + place + "&filter="
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


@browser_headers
@app.route('/correlated_queries_plot')
def getCorrelatedQueriesPlots():
	args = request.args
	event = args.get('event')
	correlated_query = args.get('correlated_query')
	place = args.get('place')
	if place is None:
		place = 'us'
	print place
	url1 = "https://www.google.com/trends/correlate/search?e="
	url2 = "&e="
	url3 = "&t=weekly&p="
	event = event.replace(" ", "+")
	correlated_query = correlated_query.replace(" ", "+")
	page =urllib2.urlopen(url1 + event + url2 + correlated_query + url3 + place)
	data=page.read()
	if "series_set = " not in data:
		return jsonify(series=[])
	startIndex = data.index("series_set = ") + 13
	semiColonIndexes = [m.start() for m in re.finditer(';', data)]
	for thisIndex in semiColonIndexes:
		if (thisIndex > startIndex):
			endIndex = thisIndex
			break
	dataJson = json.loads(data[startIndex:endIndex])
	for thisSeries in dataJson["series"]:
		for thisPoint in thisSeries["point"]:
			del thisPoint['place_id']
	return jsonify(series=dataJson["series"])

if __name__ == '__main__':
    app.run(debug=True)