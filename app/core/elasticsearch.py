import requests
from requests.exceptions import ConnectionError
import sys
from app.core.constants import *
import time

try:
    import simplejson as json
except ImportError:
    import json
from dateutil.tz import tzutc

UTC = tzutc()

LISTING_INDEX = "/xspace_product_primary/listing/"
USER_INDEX = "/xspace_user_primary/profile/"
HOST_URL = "http://34.218.14.126:9200"


def load_config(server_type='local'):
    global LISTING_INDEX, USER_INDEX, HOST_URL
    if server_type.lower() == 'beta':
        LISTING_INDEX = "/xspace_product_primary/listing/"
        USER_INDEX = "/xspace_user_primary/profile/"
        HOST_URL = "http://34.218.14.126:9200"
    elif server_type.lower() == 'local':
        LISTING_INDEX = "/xspace_product_primary/listing/"
        # HOST_URL = "http://192.168.2.44:9200"
        USER_INDEX = "/xspace_user_primary/profile/"
        HOST_URL = "http://34.218.14.126:9200"
    else:
        LISTING_INDEX = "/xspace_product_primary/listing/"
        USER_INDEX = "/xspace_user_primary/profile/"
        HOST_URL = "http://34.218.14.126:9200"


def convert_datetime(datetime_obj):
    datetime_obj = datetime_obj.astimezone(UTC).replace(tzinfo=None)
    datetime_obj = datetime_obj.isoformat() + 'Z'
    return datetime_obj


def inject_product_data(obj):
    print("injecting data")
    server_type = sys.argv[1] if len(sys.argv) > 1 else 'local'
    load_config(server_type)
    data_doc = {
        # '_id': obj.id,
        'id': obj.id,
        'name': obj.name,
        'manufacturer': obj.manufacturer if obj.manufacturer != '' else ' ',
        'uniqueID': str(obj.uniqueID),
        'profile': obj.profile_id,
        'category_id': obj.category_id,
        'category': obj.category.name,
        'UPCType': obj.UPCType,
        'SKU': obj.SKU,
        'slug': obj.slug,
        'description': obj.description,
        'directoryURL': obj.directoryURL,
        'AssetURL2D': obj.AssetURL2D,
        'AssetURL3D': obj.AssetURL3D,
        'productOwner': obj.productOwner,
        'available': obj.available,
        'has3Dfile': obj.has3Dfile,
        'has2Dfile': obj.has2Dfile,
        'created': convert_datetime(obj.created),
        'updated': convert_datetime(obj.updated),
        'stock': obj.stock,
        'price': obj.price,
        'creditsCost': obj.creditsCost,
        '_lastJobDate': convert_datetime(obj._lastJobDate),
        '_proposedJobDate': convert_datetime(obj._proposedJobDate),
        'isScanComplete': obj.isScanComplete,
        'is2DCaptureComplete': obj.is2DCaptureComplete,
        'is3DCaptureComplete': obj.is3DCaptureComplete,
        'length': obj.length,
        'width': obj.width,
        'height': obj.height,
        'ecommerce_id': obj.ecommerce_id,

    }

    try:
        req = requests.post(HOST_URL + LISTING_INDEX + str(obj.id), data=json.dumps(data_doc))
    except ConnectionError as ex:
        time.sleep(2)
        req = requests.post(HOST_URL + LISTING_INDEX + str(obj.id), data=json.dumps(data_doc))


def search_product(start_from, size, search_string):
    print("searching by product")
    server_type = sys.argv[1] if len(sys.argv) > 1 else 'local'
    load_config(server_type)
    data_doc = product_search % (start_from, size, search_string, search_string, search_string)
    req = requests.post(HOST_URL + LISTING_INDEX + "_search", data=data_doc)
    return json.loads(req.content)


def search_product_by_category(start_from, size, search_string):
    server_type = sys.argv[1] if len(sys.argv) > 1 else 'local'
    load_config(server_type)
    data_doc = product_search_by_category % (start_from, size, search_string)
    req = requests.post(HOST_URL + LISTING_INDEX + "_search", data=data_doc)
    return json.loads(req.content)


def search_product_by_manufacturer(start_from, size, search_string):
    server_type = sys.argv[1] if len(sys.argv) > 1 else 'local'
    load_config(server_type)
    data_doc = product_search_by_manufacturer % (start_from, size, search_string)
    req = requests.post(HOST_URL + LISTING_INDEX + "_search", data=data_doc)
    return json.loads(req.content)


def search_product_by_category_and_manufacturer(start_from, size, min_limit, max_limit):
    server_type = sys.argv[1] if len(sys.argv) > 1 else 'local'
    load_config(server_type)
    data_doc = product_search_by_category_and_manufacturer  % (start_from, size, min_limit,max_limit)
    req = requests.get(HOST_URL + LISTING_INDEX + "_search", data=data_doc)
    return json.loads(req.content)


def search_product_by_price_range(start_from, size, min_limit, max_limit):
    server_type = sys.argv[1] if len(sys.argv) > 1 else 'local'
    load_config(server_type)
    data_doc = product_search_by_price_range % (start_from, size, min_limit, max_limit)
    req = requests.post(HOST_URL + LISTING_INDEX + "_search", data=data_doc)
    return json.loads(req.content)


def return_token_count(obj):
    name_list = (obj).split(' ')
    count = 1
    if name_list[-1] == '' and name_list[0] == '':
        count = len(name_list[1:-1])
    elif name_list[-1] == '':
        count = len(name_list[:-1])
    elif name_list[0] == '':
        count = len(name_list[1:])
    else:
        count = len(name_list)
    return count


def inject_user(user_obj, profile_obj):
    print("injecting user")
    server_type = sys.argv[1] if len(sys.argv) > 1 else 'local'
    load_config(server_type)

    data_doc = {
        "address1": profile_obj.address1,
        "address2": profile_obj.address2,
        "cityName": profile_obj.cityName,
        "companyName": profile_obj.companyName,
        "companyRole": profile_obj.companyRole,
        "country": profile_obj.country,
        "credits": profile_obj.credits,
        "date_joined": convert_datetime(user_obj.date_joined),
        "email": user_obj.email,
        "first_name": user_obj.first_name,
        "first_name_tokencount": return_token_count(user_obj.first_name),
        "id": profile_obj.id,
        "image": profile_obj.image,
        "industry": profile_obj.industry,
        "is_active": user_obj.is_active,
        "is_staff": user_obj.is_staff,
        "last_name": user_obj.last_name,
        "last_name_tokencount": return_token_count(user_obj.last_name),
        "newsletter": profile_obj.newsletter,
        "numOfProducts": profile_obj.numOfProducts,
        "phoneNum": profile_obj.phoneNum,
        "poBoxNum": profile_obj.poBoxNum,
        "profileURL": profile_obj.profileURL,
        "slug": profile_obj.slug,
        "state": profile_obj.state,
        "userPosition": profile_obj.userPosition,
        "user_id": user_obj.id,
        "username": user_obj.username,
        "username_tokencount": 1,
        "zipCode": profile_obj.zipCode,
    }
    try:
        req = requests.post(HOST_URL + USER_INDEX + str(profile_obj.id), data=json.dumps(data_doc))
    except ConnectionError as ex:
        time.sleep(2)
        req = requests.post(HOST_URL + USER_INDEX + str(profile_obj.id), data=json.dumps(data_doc))
