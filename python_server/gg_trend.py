import re
import urllib2, json
import pdb
import pandas as pd
import matplotlib.pyplot as plt


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

    if type(keyword) is str:
        phrase = keyword.split()
        queries = phrase[0]
        if len(queries)> 1:
            for word in phrase[1:]:
                queries = queries + "%20" + word


    if type(keyword) is list:
        queries = keyword[0]
        if len(keyword) > 1:
            for word in keyword[1:]:
                queries = queries + "%2C" + word
        
    date = '&date='+str(startmonth)+'%2F'+str(year)+'%20' + str(numofmonth) + 'm'
    # date = '&date=' + 'today' + '%20' +  str(8) + '-d'

    URL = URL_start+queries+ geo + date+URL_end
    print(URL)

    return URL, flag

if __name__ == '__main__':
    
    # change input here
    URL, flag= ScrapeWeekly('steph curry', 'US', None, None, 2016, 1, 3)
    
    # download and save to csv file
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
    
    # pdb.set_trace()
    gt_df = pd.DataFrame({
        'Date': timestamp,
        'SVI': value
    })
    
    gt_df.to_csv('gtdata.csv')

    # Plot
    # ts = pd.Series(value, index=date)
    # gt_df.plot(x = 'Date', y = 'SVI')
    # plt.show()
