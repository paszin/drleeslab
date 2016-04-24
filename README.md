# Run Backend Python Server
Go to python_server folder, and run the command below. 
```bash
python app.py
```

# Backend APIs

## Get Correlated Queries
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

## Get Correlated Queries Plots
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

## Get Houston Flood Tweets
```bash
http://nodetest123.mybluemix.net/houstonflood?limit=<number>
```
This Bluemix API returns tweets regarding Houston Flood along with sentiment analysis and location information. Limit is optional. Not specifying the limit returns all tweets in the database. 

### Example
```bash
http://nodetest123.mybluemix.net/houstonflood?limit=10
```

## Get Fuego Volcano English Tweets
```bash
http://nodetest123.mybluemix.net/fuego_volcano_en?limit=<number>
```
This Bluemix API returns **English** tweets regarding Fuego Volcano along with sentiment analysis and location information. Limit is optional. Not specifying the limit returns all tweets in the database. 

### Example
```bash
http://nodetest123.mybluemix.net/fuego_volcano_en?limit=10
```
