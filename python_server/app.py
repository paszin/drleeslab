from flask import Flask,jsonify, make_response, request
import urllib2
import re
import json
from functools import wraps
from datetime import date, timedelta
import pdb
import pandas as pd
import matplotlib.pyplot as plt

# Import the necessary methods from "twitter" library
from twitter import Twitter, OAuth, TwitterHTTPError, TwitterStream

# import the necessary methods from "TextBlob" library
from textblob import TextBlob

import numpy as np
import h5py as h5py
from pandas.tseries.offsets import *

# Variables that contains the user credentials to access Twitter API 
ACCESS_TOKEN = '725596276083941376-Rf25f1xDH6xmpUnpwwlLqDyeSi4vv8M'
ACCESS_SECRET = 'bzvrVn8EoWetbEK929L7FFS0gwNnjDJOTAjE6KS9y8Ui7'
CONSUMER_KEY = 'opxZpHiXxMSOINHIEKzmQQEJI'
CONSUMER_SECRET = 'juAiRb11RF8OiHwVAs9gedsZrxKkTmCp2ATTHSUMLFtP8Un5ra'

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
	if int(count) > 100:
		count = 100
	count = int(count)

	twitterQuery = "#" + query + " filter:images"

	# Initiate the connection to Twitter REST API
	twitter = Twitter(auth=oauth)

	# Search for latest tweets
	tweets = twitter.search.tweets(q=twitterQuery, result_type='recent', lang='en', count=100)

	image_ids = []
	number = 0

	for tweet in tweets['statuses']:
		for media in tweet['entities']['media']:
			if 'source_status_id' in media:
				image_ids.append(media['source_status_id'])
				number += 1
				if number >= count:
					return jsonify(result = image_ids)

	return jsonify(result = image_ids)

@app.route('/twitter_sentiment')
@browser_headers
def getTwitterSentiment():
	args = request.args
	query = args.get('query')
	query = query.replace(" ", "")

	twitter_sentiment_data = []

	for i in range(0, 30):

		d = date.today() - timedelta(days=i)

		twitterQuery = "#" + query + " until:" + str(d)
		
		# Initiate the connection to Twitter REST API
		twitter = Twitter(auth=oauth)
		
		# Search for latest tweets
		tweets = twitter.search.tweets(q=twitterQuery, result_type='recent', lang='en', count=100)

		if len(tweets['statuses']) == 0:
			break

		# texts detect duplicates
		texts = []
		positive = 0
		neutral = 0
		negative = 0
		for tweet in tweets['statuses']:
			if 'text' in tweet and tweet['text'] not in texts:
				texts.append(tweet['text'])
				sentiment_text = TextBlob(tweet['text'])
				polarity = sentiment_text.sentiment.polarity
				if polarity > 0:
					positive += 1
				elif polarity == 0:
					neutral += 1
				else:
					negative += 1

		total = positive + neutral + negative

		this_twitter_sentiment_data = {}
		this_twitter_sentiment_data['date'] = str(d)
		this_twitter_sentiment_data['positive'] = positive / (total * 1.0)
		this_twitter_sentiment_data['neutral'] = neutral / (total * 1.0)
		this_twitter_sentiment_data['negative'] = negative / (total * 1.0)
		twitter_sentiment_data.append(this_twitter_sentiment_data)

	return jsonify(result = twitter_sentiment_data)


@app.route('/gg_trend')
@browser_headers
def getGoogleTrend():
	args = request.args
	keyword = args.get('keyword')
	country = args.get('country')
	region = args.get('region')
	city = args.get('city')
	year = args.get('year')
	startMonth = args.get('startmonth')
	numOfMonth = args.get('numofmonth')

	if keyword is None:
		return jsonify({'success': 'fail', 'message': 'keyword is not given'})
	if country is None:
		country = 'US'
	if region is not None:
		region = str(region)
	if city is not None:
		city = str(city)
	if year is None:
		return jsonify({'success': 'fail', 'message': 'year is not given'})
	if startMonth is None:
		return jsonify({'success': 'fail', 'message': 'startmonth is not given'})
	if numOfMonth is None:
		return jsonify({'success': 'fail', 'message': 'numofmonth is not given'})

	URL, flag = ScrapeWeekly(str(keyword), str(country), region, city, int(year), int(startMonth), int(numOfMonth))

	page = urllib2.urlopen(URL)
	data = page.read()
	date, value, timestamp = [],[],[]

	if flag == 'daily':
		fm = 'Date\((\d*),(\d*),(\d*)\),"f":\"(.+?)\"},{"v":(\d*\.?\d*)'
	elif flag == 'weekly':
		fm = 'Date\((\d*),(\d*),(\d*)\),"f":\".+?\"},{"v":(\d*\.?\d*)'

	for m in re.finditer(fm,data):
		iyear = int(m.group(1))
		imonth = int(m.group(2)) + 1
		iday = int(m.group(3))
		date.append(pd.to_datetime(iyear*10000 + imonth*100 + iday, format = '%Y%m%d'))
		if flag == 'daily':
			timestamp.append(pd.to_datetime(m.group(4), infer_datetime_format = True))
			value.append(float(m.group(5)))
		elif flag == 'weekly':
			value.append(float(m.group(4)))   

	gt_df = pd.DataFrame({
		'Date': timestamp,
		'SVI': value
	})

	print gt_df

	ggTrendData = []

	for i in range(0, len(gt_df)):

		thisGGTrendData = {}
		date = gt_df['Date'][i]
		thisGGTrendData['date'] = date.strftime("%Y-%m-%d")
		thisGGTrendData['svi'] = gt_df['SVI'][i]
		ggTrendData.append(thisGGTrendData)

	return jsonify(result = ggTrendData)

def monthConverter(month):
	if month == 'Jan':
		return '01'
	elif month == 'Feb':
		return '02'
	elif month == 'Mar':
		return '03'
	elif month == 'Apr':
		return '04'
	elif month == 'May':
		return '05'
	elif month == 'Jun':
		return '06'
	elif month == 'Jul':
		return '07'
	elif month == 'Aug':
		return '08'
	elif month == 'Sep':
		return '09'
	elif month == 'Oct':
		return '10'
	elif month == 'Nov':
		return '11'
	elif month == 'Dec':
		return '12'
	else:
		return '00'

def ScrapeWeekly(keyword, country, region, city, year, startmonth, numofmonth):
	"""
	Custom Timeframe Pattern:

		- By Month: "MM/YYYY #m" where # is the number of months from that date to pull data for
			For example: "10/2009 61m" would get data from October 2009 to October 2014
			Less than 4 months will return Daily level data
			More than 36 months will return monthly level data
			4-36 months will return weekly level data

	Current Time Minus Time Pattern:

		- By Month: "today #-m" where # is the number of months from that date to pull data for
				For example: "today 61-m" would get data from today to 61months ago
				1-3 months will return daily intervals of data
				4-36 months will return weekly intervals of data
				36+ months will return monthly intervals of data
				NOTE Google uses UTC date as 'today'
		- Daily: "today #-d" where # is the number of days from that date to pull data for
				For example: "today 7-d" would get data from the last week
				1 day will return 8min intervals of data
				2-8 days will return Hourly intervals of data
				8-90 days will return Daily level data
		- Hourly: "now #-H" where # is the number of hours from that date to pull data for
				For example: "now 1-H" would get data from the last hour
				1-3 hours will return 1min intervals of data
				4-26 hours will return 8min intervals of data
				27-34 hours will return 16min intervals of data
	"""

	if numofmonth > 3:
		flag = 'weekly'
	else:
		flag = 'daily'

	print 'Scraping from ' + str(year) + '/' + str(startmonth) + ' for ' + str(numofmonth) + ' months for ' + flag + ' data'
	URL_start = "http://www.google.com/trends/fetchComponent?&q="
	URL_end = "&cid=TIMESERIES_GRAPH_0&export=3"

	# http://www.google.com/trends/fetchComponent?q=flood&date=1%2F2015%205m&geo=US-TX-618&cid=TIMESERIES_GRAPH_0&export=5   
	# Geographic restrictions
	if country is not None:
		geo = "&geo="
		geo = geo + country
		if region is not None:
			geo = geo + "-" + region
			if city is not None:
				geo = geo + "-" + city

	print "type"
	print type(keyword)

	if type(keyword) is str:
		phrase = keyword.split()
		queries = phrase[0]
		if len(queries)> 1:
			for word in phrase[1:]:
				queries = queries + "%20" + word


	elif type(keyword) is list:
		queries = keyword[0]
		if len(keyword) > 1:
			for word in keyword[1:]:
				queries = queries + "%2C" + word

	else:
		queries = ''
		
	date = '&date='+str(startmonth)+'%2F'+str(year)+'%20' + str(numofmonth) + 'm'
	# date = '&date=' + 'today' + '%20' +  str(8) + '-d'

	URL = URL_start + queries + geo + date + URL_end
	print(URL)

	return URL, flag

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

@app.route('/precipitation')
@browser_headers
def getPrecipitation():
	args = request.args
	timestamp = args.get('timestamp')

	path = 'Data/'
	filename = getFilename(timestamp)
	dataset = h5py.File(path + filename, 'r')
	# x, y, precip = getGlobal(dataset)
	x, y, precip = getTexasRegion(dataset)
	nx, ny, nprecip = getNonzeroPrecip(x,y,precip)
	time = getTimestamp(filename)

	output_df = pd.DataFrame({
		'longitude': nx, 
		'latitude': ny,
		'precipitation': nprecip,
	})

	precipitationData = []
	for i in range(0, len(output_df)):
		thisPrecipitationData = {}
		thisPrecipitationData['longitude'] = float(output_df['longitude'][i])
		thisPrecipitationData['latitude'] = float(output_df['latitude'][i])
		thisPrecipitationData['precipitation'] = float(output_df['precipitation'][i])
		precipitationData.append(thisPrecipitationData)

	return jsonify(timestamp = time, result = precipitationData)


# timestamp: yyyy-mm-dd hh-mm-ss in string
def getFilename(time_stamp_str): 
	# get nearest time stamp
	target = pd.to_datetime(str(time_stamp_str), infer_datetime_format = True)
	ts = pd.date_range('2016-04-15', periods = 432, freq = '30min')
	tdiff = abs(ts - target)
	time_stamp = ts[tdiff == tdiff.min()][0]

	# generate HDF5 file name
	t1 = time_stamp.strftime('%Y%m%d')
	t2 = time_stamp.strftime('%H%M%S')
	t3 = time_stamp + Minute(29) + Second(59)
	t3 = t3.strftime('%H%M%S')
	t4 = time_stamp.hour*60 + time_stamp.minute 
	t4 = "%04d" % t4
	filename = '3B-HHR-E.MS.MRG.3IMERG.{}-S{}-E{}.{}.V03E.HDF5'.format(t1,t2,t3,t4)

	return filename

def getTimestamp(filename):
	"""
		Read the time stamp from a GPM filename
	"""
	txt  = re.search(r'IMERG.(\d+)-S\d+-E(\d+)',filename)
	timestring = txt.group(1) + " " + txt.group(2)
	time_stamp = pd.to_datetime(timestring, infer_datetime_format = True)
	return time_stamp

def getTexasRegion(dataset):
	#   Subset to Spatial Region (22.94,-103.23,35.77,-90.04), 
	value = dataset['Grid/precipitationUncal'][760:900,1120:1250]
	value = value.transpose()
	theLats = dataset['Grid/lat'][1120:1250]
	theLons = dataset['Grid/lon'][760:900]
	lon, lat = np.float32(np.meshgrid(theLons, theLats))
	return lon, lat, value

def getGlobal(dataset):
	#   Subset to Spatial Region (22.94,-103.23,35.77,-90.04), 
	value = dataset['Grid/precipitationUncal'][:]
	value = value.transpose()
	theLats = dataset['Grid/lat'][:]
	theLons = dataset['Grid/lon'][:]
	lon, lat = np.float32(np.meshgrid(theLons, theLats))
	return lon, lat, value

def getNonzeroPrecip(lon,lat,value):
	idx = np.nonzero(value > 0)
	newlon  = lon[idx]
	newlat = lat[idx]
	newvalue = value[idx]
	return newlon, newlat, newvalue

def readhdf5(filename, path):
	dataset = h5py.File(path + filename, 'r')
	# lon, lat, value = getGlobal(dataset)
	lon, lat, value = getTexasRegion(dataset)
	
	time = getTimestamp(filename)
	output_df = pd.DataFrame({
			'longitude': lon, 
			'lattitude': lat,
			'precipitation': value,
			'time_stamp': time
		})
	
	return output_df



if __name__ == '__main__':
	app.run(debug=True)