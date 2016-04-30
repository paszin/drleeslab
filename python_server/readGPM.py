# This is a sample script that reads the IMERG data.
# data is from http://mirador.gsfc.nasa.gov/#
# filename: http://mirador.gsfc.nasa.gov/WWW-TMP/d4fd1881ef3f7ef3440e0eae2fc54906_all_data.txt?ftpscript=wget_data_only
# about data
	# 0.1 x 0.1deg, half hourly precipitation data
	# -90 to 90, -180 to 180
	# minLon = -103 maxLon = -90
	# minLat = 29 maxLat = 35

import numpy as np
import h5py as h5py
import pandas as pd
from pandas.tseries.offsets import *
import matplotlib.pyplot as plt
from mpl_toolkits.basemap import Basemap, cm
import pdb
import re

datafile = 'data/3B-HHR-E.MS.MRG.3IMERG.20160428-S013000-E015959.0090.V03E.HDF5'

# datafile = 'data/3B-HHR-E.MS.MRG.3IMERG.20160424-S200000-E202959.1200.V03E.HDF5'

def getFilename(time_stamp_str):
	# get nearest time stamp
	target = pd.to_datetime(time_stamp_str, infer_datetime_format = True)
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
	value = dataset['Grid/HQprecipitation'][760:900,1120:1250]
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

if __name__ == "__main__":
	path = 'GPMdata/'
	# filename = '3B-HHR-E.MS.MRG.3IMERG.20160415-S000000-E002959.0000.V03E.HDF5'
	filename = '3B-HHR-E.MS.MRG.3IMERG.20160418-S180000-E182959.1080.V03E.HDF5'
	# pdb.set_trace()
	dataset = h5py.File(path + filename, 'r')
	x, y, precip = getGlobal(dataset)
	time = getTimestamp(filename)

	# df = readhdf5(filename,path)
	# df.to_json("GPM.json")
	# x,y,precip = df['longitude'], df['lattitude'], df['precipitation']
	pdb.set_trace()

	# Plot the figure, define the geographic bounds
	fig = plt.figure(dpi=300)
	latcorners = ([20,40])
	loncorners = ([-110,-80])
	m = Basemap(projection='cyl',llcrnrlat=latcorners[0],urcrnrlat=latcorners[1],llcrnrlon=loncorners[0],urcrnrlon=loncorners[1])

	# Draw coastlines, state and country boundaries, edge of map.
	m.drawcoastlines()
	m.drawstates()
	m.drawcountries()

 	# Draw filled contours.
	clevs = np.arange(0,10.26,0.125)

	# Define the latitude and longitude data
	# x, y = np.float32(np.meshgrid(theLons, theLats))

	# Mask the values less than 0 because there is no data to plot.
	masked_array = np.ma.masked_where(precip < 0,precip) 

	# Plot every masked value as white
	cmap = cm.GMT_drywet
	cmap.set_bad('w',1.)

 	# Plot the data
 	pdb.set_trace()
	cs = m.contourf(x,y,precip,clevs,cmap=cmap,latlon=True)
	parallels = np.arange(-60.,61,20.)
	m.drawparallels(parallels,labels=[True,False,True,False])
	meridians = np.arange(-180.,180.,60.)
	m.drawmeridians(meridians,labels=[False,False,False,True])

 	# Set the title and fonts
	plt.title('August 2015 Monthly Average Rain Rate')
	font = {'weight' : 'bold', 'size' : 6}
	plt.rc('font', **font)

	# Add colorbar
	cbar = m.colorbar(cs,location='right',pad="5%")
	cbar.set_label('mm/h')
	plt.savefig('testIMERGmap.png',dpi=200)