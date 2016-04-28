
from osgeo import gdal,ogr
from osgeo.gdalconst import *
import struct
import sys
import hanaConnection as hana

Hana = hana.Hana()


datafile = "data/chirp.2004.01.19.tif"

ds = gdal.Open(datafile, GA_ReadOnly)
    

def pt2fmt(pt):
	fmttypes = {
		GDT_Byte: 'B',
		GDT_Int16: 'h',
		GDT_UInt16: 'H',
		GDT_Int32: 'i',
		GDT_UInt32: 'I',
		GDT_Float32: 'f',
		GDT_Float64: 'f'
		}
	return fmttypes.get(pt, 'x')


def getValueFromTiff(ds, lon, lat):
    if ds is None:
        print 'Failed open file'
        sys.exit(1)

    transf = ds.GetGeoTransform()
    cols = ds.RasterXSize
    rows = ds.RasterYSize
    bands = ds.RasterCount #1
    band = ds.GetRasterBand(1)
    bandtype = gdal.GetDataTypeName(band.DataType) #Int16
    driver = ds.GetDriver().LongName #'GeoTIFF'

    success, transfInv = gdal.InvGeoTransform(transf)
    if not success:
        print "Failed InvGeoTransform()"
        sys.exit(1)

    px, py = gdal.ApplyGeoTransform(transfInv, lon, lat)

    structval = band.ReadRaster(int(px), int(py), 1,1, buf_type = band.DataType )

    fmt = pt2fmt(band.DataType)

    intval = struct.unpack(fmt , structval)

    return intval[0] #intval is a tuple, length=1 as we only asked for 1 pixel value

    
for lat in range(0, 50):
    for lng in range(0, 20):
        value = getValueFromTiff(ds, lng, lat)
        Hana.insertRain({"x": lat, "y": lng, "value": (value or 0), "date": "2004-1-19"})
    
    

def latLonToPixel(geotifAddr, latLonPairs):
	# Load the image dataset
	ds = gdal.Open(geotifAddr)
	# Get a geo-transform of the dataset
	gt = ds.GetGeoTransform()
	# Create a spatial reference object for the dataset
	srs = osr.SpatialReference()
	srs.ImportFromWkt(ds.GetProjection())
	# Set up the coordinate transformation object
	srsLatLong = srs.CloneGeogCS()
	ct = osr.CoordinateTransformation(srsLatLong,srs)
	# Go through all the point pairs and translate them to latitude/longitude pairings
	pixelPairs = []
	for point in latLonPairs:
		# Change the point locations into the GeoTransform space
		(point[1],point[0],holder) = ct.TransformPoint(point[1],point[0])
		# Translate the x and y coordinates into pixel values
		x = (point[1]-gt[0])/gt[1]
		y = (point[0]-gt[3])/gt[5]
		# Add the point to our return array
		pixelPairs.append([int(x),int(y)])
	return pixelPairs
# The following method translates given pixel locations into latitude/longitude locations on a given GEOTIF
# INPUTS: geotifAddr - The file location of the GEOTIF
#      pixelPairs - The pixel pairings to be translated in the form [[x1,y1],[x2,y2]]
# OUTPUT: The lat/lon translation of the pixel pairings in the form [[lat1,lon1],[lat2,lon2]]
# NOTE:   This method does not take into account pixel size and assumes a high enough 
#	  image resolution for pixel size to be insignificant
def pixelToLatLon(geotifAddr,pixelPairs):
	# Load the image dataset
	ds = gdal.Open(geotifAddr)
	# Get a geo-transform of the dataset
	gt = ds.GetGeoTransform()
	# Create a spatial reference object for the dataset
	srs = osr.SpatialReference()
	srs.ImportFromWkt(ds.GetProjection())
	# Set up the coordinate transformation object
	srsLatLong = srs.CloneGeogCS()
	ct = osr.CoordinateTransformation(srs,srsLatLong)
	# Go through all the point pairs and translate them to pixel pairings
	latLonPairs = []
	for point in pixelPairs:
		# Translate the pixel pairs into untranslated points
		ulon = point[0]*gt[1]+gt[0]
		ulat = point[1]*gt[5]+gt[3]
		# Transform the points to the space
		(lon,lat,holder) = ct.TransformPoint(ulon,ulat)
		# Add the point to our return array
		latLonPairs.append([lat,lon])
 
	return latLonPairs




#print pixelToLatLon(datafile, [(0, 0), (0, 1)])
