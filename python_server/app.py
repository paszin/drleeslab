from flask import Flask,jsonify, make_response, request
import urllib2
import re
import json
from functools import wraps

# Import the necessary methods from "twitter" library
from twitter import Twitter, OAuth, TwitterHTTPError, TwitterStream

# Variables that contains the user credentials to access Twitter API 
ACCESS_TOKEN = '46342680-LjlLytnHDFvQMXW8Pr0DiyLa70El0Ffj5BkULBVXZ'
ACCESS_SECRET = 'gyZgAnSzQJRME3ZFlUHVMMUK1fm9G1hlE8Ez5nFe7sZPC'
CONSUMER_KEY = 'TSBn91fLSaQbBfeRzyT0RCzja'
CONSUMER_SECRET = '5qBW2BlXL4zXY9MwIAVN16ptlV02kj08xFgIctsatKHzIgXuau'

oauth = OAuth(ACCESS_TOKEN, ACCESS_SECRET, CONSUMER_KEY, CONSUMER_SECRET)

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

def RepresentsInt(s):
    try: 
        int(s)
        return True
    except:
        return False
    
@app.route('/')
@browser_headers
def hello_world():
    return 'Hello World!'

@app.route('/twitter_images')
@browser_headers
def getTwitterImages():
	args = request.args
	query = args.get('query')
	query = query.replace(" ", "")
	count = args.get('count')

	twitterQuery = "#" + query + " filter:images"

	# Initiate the connection to Twitter REST API
	twitter = Twitter(auth=oauth)

	# Search for latest tweets about "#nlproc"
	tweets = twitter.search.tweets(q=twitterQuery, result_type='popular', lang='en', count=count)

	return jsonify(result = tweets)

@app.route('/correlated_queries')
@browser_headers
def getCorrelatedQueries():
	args = request.args
	event = args.get('event')
	place = args.get('place')
	if place is None:
		place = 'us'
	limit = args.get('limit')

	if (not RepresentsInt(limit)) and (limit is not None):
		return "Not able to handle limit", 400
	url1 = "https://www.google.com/trends/correlate/search?e="
	url2 = "&t=weekly&p=" + place + "&filter="
	event = event.replace(" ", "+")
	page =urllib2.urlopen(url1 + event + url2 + event)
	data=page.read()
	resultIndexes = [m.start() for m in re.finditer('<li class="result', data)]
	correlatedQueries = []
	endIndex = -1
	count = 0
	maxRange = len(resultIndexes)-1
	if limit is not None:
		maxRange = min (maxRange, int(limit))
	for i in range(0, maxRange):
		thisData = data[resultIndexes[i]:resultIndexes[i+1]]
		startIndex = thisData.index('event="') + 7
		semiColonIndexes = [z.start() for z in re.finditer('"', thisData)]
		for thisIndex in semiColonIndexes:
			if (thisIndex > startIndex):
				endIndex = thisIndex
				break
		correlatedQueries.append(thisData[startIndex:endIndex])
	return jsonify(results=correlatedQueries)


@app.route('/correlated_queries_plot')
@browser_headers
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