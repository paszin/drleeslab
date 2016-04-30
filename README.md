# Earth Care




### Technology Stack
- Nodejs
- Python
- Flask
- MongoDB
- Express
- AngularJS

### APIs & Datasources

- facebook (use connect with facebook function to see the locations of your friends)
- twitter (see )
- IBM Bluemix Node Red Sentiment Analysis
- Google Correlate & Trend
- CHIRPS Rainfall Data
- NASA Map Layers


### Getting Started (Frontend)

`npm install -g bower grunt grunt-cli`

 `npm install` 
 
 `bower install` 
 
 `mongod` 
 
 `grunt serve`





# Run Backend Python Server
Go to python_server folder, and run the command below. 
```bash
python app.py
```

# Backend APIs

## 1. Get Correlated Queries
```bash
http://localhost:5000/correlated_queries?event=<event_name>&place=<country_code>
```
This API returns a list of correlated queries given a event name in a sorted order. Place is optional. See country_code.csv to see the list of country codes. Default place is the US. 

### Example
```bash
http://localhost:5000/correlated_queries?event=fukushima%20tsunami&place=us
```

### Response
```bash
{
  "results": [
    "tsunami fukushima", 
    "fukushima video", 
    "golurk pokemon", 
    "gigalith", 
    .
    .
    .
    "dan newlin", 
    "bouffalant", 
    "chandelure moveset"
  ]
}
```

## 2. Get Correlated Queries Plots
```bash
http://localhost:5000/correlated_queries_plot?event=<event_name>&correlated_query=<correlated_query>&place=<country_code>
```
This API returns plots data for the frontend to draw the graphs. Place is optional. See country_code.csv to see the list of country codes. Default place is the US. 

### Example
```bash
http://localhost:5000/correlated_queries_plot?event=fukushima%20tsunami&correlated_query=tepco&place=us
```

### Response
```bash
{
  "series": [
    {
      "name": "fukushima tsunami", 
      "point": [
        {
          "date": "2004-01-04", 
          "value": -0.505
        }, 
        {
          "date": "2004-01-11", 
          "value": -0.505
        }, 
        .
        .
        .
        {
          "date": "2016-01-24", 
          "value": 0.637
        }
      ]
    }, 
    {
      "name": "tepco", 
      "point": [
        {
          "date": "2004-01-04", 
          "value": -0.038
        }, 
        {
          "date": "2004-01-11", 
          "value": -0.022
        }, 
        .
        .
        .
        {
          "date": "2016-01-24", 
          "value": -0.219
        }
      ]
    }
  ]
}
```

## 3. Get Houston Flood Tweets
```bash
http://nodetest123.mybluemix.net/houstonflood?limit=<number>
```
This Bluemix API returns tweets regarding Houston Flood along with sentiment analysis and location information. Limit is optional. Not specifying the limit returns all tweets in the database. 

### Example
```bash
http://nodetest123.mybluemix.net/houstonflood?limit=10
```

## 4. Get Fuego Volcano English Tweets
```bash
http://nodetest123.mybluemix.net/fuego_volcano_en?limit=<number>
```
This Bluemix API returns **English** tweets regarding Fuego Volcano along with sentiment analysis and location information. Limit is optional. Not specifying the limit returns all tweets in the database. 

### Example
```bash
http://nodetest123.mybluemix.net/fuego_volcano_en?limit=10
```

## 5. Get Fuego Volcano All Language Tweets
```bash
http://nodetest123.mybluemix.net/fuego_volcano_all?limit=<number>
```
This Bluemix API returns **all language** tweets regarding Fuego Volcano along with sentiment analysis and location information. Limit is optional. Not specifying the limit returns all tweets in the database. 

### Example
```bash
http://nodetest123.mybluemix.net/fuego_volcano_all?limit=10
```

## 6. Get Twitter Images
```bash
http://localhost:5000/twitter_images?query=<query>&count=<count>
```
This API returns a list of IDs of twitter images given a query. <query> is converted to a hashtag format. For example, "houston flood" will be converted to "#houstonflood" for search. 

### Example
```bash
http://localhost:5000/twitter_images?query=houston%20flood&count=20
```

### Response
```bash
{
  "result": [
    725105271417147392, 
    725441964699619328, 
    723570517215596544, 
    722676449069633537, 
    722676449069633537, 
    722676449069633537, 
    722676449069633537, 
    725459529157074944, 
    724966878360145920, 
    725441964699619328, 
    722676449069633537, 
    722676449069633537, 
    724632826717442049, 
    725337484238815232, 
    725105271417147392, 
    722449096418537473, 
    722246502765035522, 
    722449096418537473, 
    723151141966467072, 
    725459529157074944
  ]
}
```

## 7. Get Twitter Sentiment
```bash
http://localhost:5000/twitter_sentiment?query=<query>
```
This API returns sentiment data from the tweets given a query sorted by date. <query> is converted to a hashtag format. For example, "houston flood" will be converted to "#houstonflood" for search. 

### Example
```bash
http://localhost:5000/twitter_sentiment?query=houston%20flood
```

### Response
```bash
{
  "result": [
    {
      "date": "2016-04-28", 
      "negative": 0.09859154929577464, 
      "neutral": 0.6619718309859155, 
      "positive": 0.23943661971830985
    }, 
    .
    .
    .
    {
      "date": "2016-04-20", 
      "negative": 0.21739130434782608, 
      "neutral": 0.32608695652173914, 
      "positive": 0.45652173913043476
    }, 
    {
      "date": "2016-04-19", 
      "negative": 0.11475409836065574, 
      "neutral": 0.4918032786885246, 
      "positive": 0.39344262295081966
    }
  ]
}
```

## 8. Get Google Trend
```bash
http://localhost:5000/gg_trend?keyword=<keyword>&year=<year>&startmonth=<startmonth>&numofmonth=<numofmonth>&country=<country>&region=<region>&city=<city>
```
This API returns google trend data given a keyword. **keyword**, **year**, **startmonth**, and **numofmonth** are required. Default country is the US. 

### Example
```bash
http://localhost:5000/gg_trend?keyword=houston flood&year=2016&startmonth=1&numofmonth=3
```

### Response
```bash
{
  "result": [
    {
      "date": "2015-12-31", 
      "svi": 74.0
    }, 
    {
      "date": "2016-01-01", 
      "svi": 71.0
    }, 
    .
    .
    .
    {
      "date": "2016-03-29", 
      "svi": 78.0
    }, 
    {
      "date": "2016-03-30", 
      "svi": 77.0
    }
  ]
}
```

## 9. Get Precipitation Data
```bash
http://localhost:5000/precipitation?timestamp=<timestamp>
```
This API returns a precipitation dataset given a timestamp. 

### Example
```bash
http://localhost:5000/precipitation?timestamp=2016-04-21%2011:11:11
```

### Response
```bash
{
  "result": [
    {
      "latitude": 22.350000381469727, 
      "longitude": -98.75, 
      "precipitation": 0.20000000298023224
    }, 
    {
      "latitude": 22.350000381469727, 
      "longitude": -98.6500015258789, 
      "precipitation": 0.20000000298023224
    },
    .
    .
    .
    {
      "latitude": 34.75, 
      "longitude": -90.94999694824219, 
      "precipitation": 1.399999976158142
    }, 
    {
      "latitude": 34.95000076293945, 
      "longitude": -90.3499984741211, 
      "precipitation": 1.2000000476837158
    }
  ], 
  "timestamp": "Thu, 21 Apr 2016 11:29:59 GMT"
}
```
