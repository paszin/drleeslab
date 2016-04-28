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

def readhdf5(filename):
    # read longitude, lattitude and precipitation from file
    dataset = h5py.File("GPMdata/" + filename, 'r') # Change this to the proper path
    precip = dataset['Grid/precipitationCal'][:]
    precip = np.transpose(precip)
    theLats= dataset['Grid/lat'][:]
    theLons = dataset['Grid/lon'][:]
    x, y = np.float32(np.meshgrid(theLons, theLats))
    lon = x.reshape(-1)
    lat = y.reshape(-1)
    prep = precip.reshape(-1)
    return lon,lat,prep