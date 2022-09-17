from app.accounts.models import User, Profile, Company, Address, Invitation, PasswordToken
import app.accounts
from app.core.models import Snippet
from app.products.models import Product, ProductAsset
from app.orders.models import ContentStandard, Order, OrderTracking, ProductOrder, FullOrder
from django.utils import timezone
from elasticsearch import *

# Django Contribs & Core
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate
from django.core.mail import EmailMessage
from django.template import Context
from django.template.loader import render_to_string, get_template
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

# DRF
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework.authtoken.models import Token
from rest_framework.serializers import ValidationError
from app.imageEditingFunctions.manipulateImage import ManipulateImage, load_image

# Other
import threading
from PIL import Image
import io
import socket
import string
import ipdb
import random
import json
import boto3
from os.path import split, splitext


from app.core.utility import ChargebeeAPI, boto3Upload3

from app.accounts.activation_token import account_activation_token
from xapi.settings import AWS_S3_CUSTOM_DOMAIN, CLOUDFRONT_DOMAIN


class processEditingOrder():
    def __init__(self, order):
        self.order = order
        try:
            self.productAsset = ProductAsset.objects.get(id=int(order['productAssetID']))
        except Exception as e:
            print('error getting product asset id in thread', order['productAssetID'], e)
        self.type = order['type']
        self.contentStandard = order['contentStandard']
        self.assetType = order['assetType']

        # threading.Thread.__init__(self)

    def run(self, company_object):
        print('starting editing')
        if int(self.assetType) == int(1):
            print('here')
            # this is a photo so let's process it
            # set up the image editor
            print('trying to open', self.productAsset.url)
            img = load_image(str(self.productAsset.url))
            print('prepped', self.productAsset.url)
            img = Image.open(io.BytesIO(img))
            IMG_FORMAT = img.format
            print('opened', self.productAsset.url)
            imageEditor = ManipulateImage(img, productAsset=self.productAsset)
            print('imageEditor started')
            params = {}
            if self.type == 'backgroundRemoval':
                params['remove_background'] = True
            print('params established as:', params)
            # TODO: add in content standard logic
            if self.contentStandard is not None:
                print('content standard', self.contentStandard, 'not applied')
            print('beginning imageEditor')
            img, _ = imageEditor.manipulate(params)
            print('kickin it into gear')
            img = Image.fromarray(img, 'RGBA')
            print('kicked')
            if str(self.productAsset.url).startswith('https://' + AWS_S3_CUSTOM_DOMAIN):
                key = str(self.productAsset.url).replace('https://' + AWS_S3_CUSTOM_DOMAIN + '/', '')
            elif str(self.productAsset.url).startswith('https://' + CLOUDFRONT_DOMAIN):
                key = str(self.productAsset.url).replace('https://' + CLOUDFRONT_DOMAIN + '/', '')
            else:
                print('error getting product asset url')
                return 'fail'
            print('key', key)
            f_name = split(key)[1]
            f_name = splitext(f_name)[0]+'.png'
            print('f_name', f_name)
            key = split(key)[0]
            if key.endswith('/'):
                key = key[:-1]
            print('key', key)
            in_mem_file = io.BytesIO()
            print('b')
            img.save(in_mem_file, format='PNG')
            print('ba')
            # if img.format is None:
            #     print('io setup and prepping PIL save with format as:', IMG_FORMAT)
            #     img.save(in_mem_file, format=IMG_FORMAT)
            # else:
            #     print('io setup and prepping PIL save with format as:', img.format)
            #     img.save(in_mem_file, format=img.format)
            in_mem_file.seek(0)
            print('beginning upload')
            location = boto3Upload3(in_mem_file, company_object.slug, key, is_bytes=True, fileName=f_name)
            print('image processed and uploaded')
            loc = location.split('/')
            newlocation = loc[0] + '//d27vruithpdhv2.cloudfront.net/' + loc[3] + '/' + loc[4] + '/' + loc[5] + '/' + \
                          loc[6] + '/' + loc[7]
            self.productAsset.url = newlocation
            self.productAsset.save()
            # create the thumbnail
            # params = {'square': {'fill_color': (255, 255, 255, 255)},
            #           'resize': {'height': 100,
            #                      'width': 100}}
            # thumbnail = imageEditor.manipulate(params)
            # thumbnail = thumbnail.tobytes()
            print('finished editing')
            return 'success'


class ContentStandardCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentStandard
        exclude = ('image_ideal_file_size',)

    def create(self, validated_data):
        creator_profile = self.context.get("profile")

        # add the content standard to the company profiles
        company_objects = Company.objects.filter(uniqueID=creator_profile.companyProfile)
        if company_objects.count() >= 1:
            for company_uniqueID in company_objects:
                # get the other profiles in the company
                company_object = Company.objects.get(uniqueID=company_uniqueID)
                profile_objects = Profile.objects.filter(companyProfile=company_uniqueID)
                count = 0
                for profile in profile_objects:
                    # if profile == creator_profile:
                    #     continue
                    standard = ContentStandard.objects.create(**validated_data)
                    standard.profile = profile
                    standard.company_id = company_object
                    standard.save()
                    count += 1
                if count == (profile_objects.count() - 1):
                    print('all profiles in company had the content standard added to them')
        else:
            print("no company found for profile:", creator_profile)

        return standard


class ContentStandardListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentStandard
        fields = ('_all_')


class ProductOrderSerializer(serializers.ModelSerializer):
    product = serializers.CharField(required=True)
    order = serializers.CharField(required=True)
    uniqueID = serializers.CharField(read_only=True)
    status = serializers.CharField(required=False)
    # is2drequired = serializers.BooleanField(required=False)
    # is360viewrequired = serializers.BooleanField(required=False)
    # is3dmodelrequired = serializers.BooleanField(required=False)
    # isvideorequired = serializers.BooleanField(required=False)
    notes2d = serializers.CharField(allow_blank=True, required=False)
    notes360view = serializers.CharField(allow_blank=True, required=False)
    notes3dmodel = serializers.CharField(allow_blank=True, required=False)
    notesvideo = serializers.CharField(allow_blank=True, required=False)

    # Warehouse Fields
    order_product_qr_code_img = serializers.CharField(required=False)  # Holds an image path (s3)
    isCompleted = serializers.BooleanField(required=False)  # New Field
    isArrived = serializers.BooleanField(required=False)  # New Field
    isDamagedAtArrival = serializers.BooleanField(required=False)  # New Field

    # Photo Services
    singlePhotoServicesRequired = serializers.BooleanField(required=False)  # Formerly: 'is2drequired'
    fourPackServicesRequired = serializers.BooleanField(required=False)  # New Field
    fivePackPackServicesRequired = serializers.BooleanField(required=False)  # New Field

    # 360 View Services
    standard360ServicesRequired = serializers.BooleanField(required=False)  # Formerly: 'is360viewrequired'
    integrated360ServicesRequired = serializers.BooleanField(required=False)  # New Field

    # 3D Model Services
    standard3DModelServicesRequired = serializers.BooleanField(required=False)  # Formerly: 'is3dmodelrequired'
    advanced3DModelServicesRequired = serializers.BooleanField(required=False)  # New Field
    cinematic3DModelServicesRequired = serializers.BooleanField(required=False)  # New Field

    # Video Services
    hdProductVideoServicesRequired = serializers.BooleanField(required=False)  # Formerly: 'is360viewrequired'
    fourKProductServicesRequired = serializers.BooleanField(required=False)  # New Field
    videoWalkthroughServicesRequired = serializers.BooleanField(required=False)  # New Field

    def get_product_object(self, product_slug):
        try:
            return Product.objects.get(slug=product_slug)
        except Product.DoesNotExist:
            return ""

    def get_order_object(self, order_id):
        try:
            return Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return ""

    def get_product_order_object(self, product_order_id):
        try:
            return ProductOrder.objects.get(uniqueID=product_order_id)
        except Product.DoesNotExist:
            return ""

    def create(self, validated_data):
        product_obj = self.get_product_object(validated_data['product'])
        order_obj = self.get_order_object(validated_data['order'])

        if product_obj and order_obj:
            validated_data['product'] = product_obj
            validated_data['order'] = order_obj
            obj = ProductOrder.objects.create(**validated_data)
            return obj
        else:
            return ""

    class Meta(object):
        model = ProductOrder
        fields = (
            'product', 'order', 'uniqueID', 'status',
            'notes2d', 'notes360view', 'notes3dmodel', 'notesvideo', 'order_product_qr_code_img', 'isCompleted',
            'isArrived',
            'isDamagedAtArrival', 'singlePhotoServicesRequired', 'fourPackServicesRequired',
            'fivePackPackServicesRequired',
            'standard360ServicesRequired', 'integrated360ServicesRequired', 'standard3DModelServicesRequired',
            'advanced3DModelServicesRequired'
            , 'cinematic3DModelServicesRequired', 'hdProductVideoServicesRequired', 'fourKProductServicesRequired',
            'videoWalkthroughServicesRequired'
        )


class ProductOrderListSerializer(serializers.Serializer):
    product = serializers.CharField(read_only=True)
    order = serializers.CharField(read_only=True)
    is2drequired = serializers.BooleanField(read_only=True)
    is360viewrequired = serializers.BooleanField(read_only=True)
    is3dmodelrequired = serializers.BooleanField(read_only=True)
    isvideorequired = serializers.BooleanField(read_only=True)
    notes2d = serializers.CharField(read_only=True)
    notes360view = serializers.CharField(read_only=True)
    notes3dmodel = serializers.CharField(read_only=True)
    notesvideo = serializers.CharField(read_only=True)
    UPC = serializers.SerializerMethodField('get_product_upc')
    SKU = serializers.SerializerMethodField('get_product_sku')
    productId = serializers.SerializerMethodField('get_product_Id')
    status = serializers.CharField(read_only=True)
    uniqueID = serializers.CharField(read_only=True)
    order_date = serializers.DateTimeField(read_only=True)

    def get_product_Id(self, obj):
        return obj.product.id

    def get_product_upc(self, obj):
        return obj.product.upccode

    def get_product_sku(self, obj):
        return obj.product.SKU

    class Meta(object):
        model = ProductOrder
        fields = (
            'product', 'productId', 'SKU', 'UPC', 'uniqueID', 'status', 'order', 'order_date', 'is2drequired',
            'is360viewrequired', 'is3dmodelrequired', 'isvideorequired',
            'notes2d', 'notes360view', 'notes3dmodel', 'notesvideo'
        )
        read_only_fields = fields


class BatchOrderSerializer(serializers.Serializer):
    numberOfOrders = serializers.IntegerField(required=True)
    orders = serializers.ListField(required=True)


class FullOrderSerializer(serializers.ModelSerializer):
    # TODO: Validate Data.

    class Meta:
        model = FullOrder
        # fields = '_all_'
        fields = '__all__'

    def create(self, validated_data, request):
        # data structured as follows:
        # validated_data
        #   order_ID
        #   orderparts
        #       asset_id, attribute, value
        print('FullOrderSerializer CREATE received', validated_data, request)
        data = validated_data['orderparts']
        orderID = validated_data['orderid']
        asset_idList = dict()
        errorsList = []
        productList = []
        profile = Profile.objects.get(user=request.user)
        prodcounter = 1
        # create counters

        counters = {
            'singlePhotoCounter': {'count': 0,
                                   'chargebeeServiceID': 'single-2d-photo'},
            'fourPackCounter': {'count': 0,
                                'chargebeeServiceID': '2d-four-pack'},
            'fivePackCounter': {'count': 0,
                                'chargebeeServiceID': '2d-five-pack'},
            'standard360Counter': {'count': 0,
                                   'chargebeeServiceID': '360-photo-pack'},
            'integrated360Counter': {'count': 0,
                                     'chargebeeServiceID': 'int-360-photo-pack'},
            'standard3DModelCounter': {'count': 0,
                                       'chargebeeServiceID': 'standard-3d-model'},
            'advanced3DModelCounter': {'count': 0,
                                       'chargebeeServiceID': 'advanced-3d-model'},
            'cinematic3DModelCounter': {'count': 0,
                                        'chargebeeServiceID': 'Performance-3d-model'},
            'hdProductVideoCounter': {'count': 0,
                                      'chargebeeServiceID': 'hd-video'},
            'fourKProductCounter': {'count': 0,
                                    'chargebeeServiceID': '4k-video'},
            'videoWalkthroughCounter': {'count': 0,
                                        'chargebeeServiceID': 'video_walkthrough'},
            'backgroundRemovalCounter': {'count': 0,
                                         'chargebeeServiceID': 'background-removal'},
            'autoCropAndCenterCounter': {'count': 0,
                                         'chargebeeServiceID': 'auto-crop-and-center'},
            'blemishReductionCounter': {'count': 0,
                                        'chargebeeServiceID': 'blemish-reduction'},
            'barcodeDetectionCounter': {'count': 0,
                                        'chargebeeServiceID': 'barcode-detection'},
            'applyContentStandardCounter': {'count': 0,
                                            'chargebeeServiceID': 'apply-content-standard'},
            'colorCorrectionCounter': {'count': 0,
                                       'chargebeeServiceID': 'color-correction'},
        }

        for item in data:

            asset_id, attribute, value, typeservice, contentstandard = item
            existing = False
            isEdit = True if typeservice == 'edit' else False
            isCapt = True if typeservice == 'capture' else False

            try:
                if asset_id in asset_idList:
                    # print(1)
                    order_obj = asset_idList[asset_id]
                    # print(2)
                    order_obj.isEditing = order_obj.isEditing or isEdit
                    # print(3)
                    order_obj.isCapture = order_obj.isCapture or isCapt
                    # print(4)
                    existing = True
                    # print(5)
                else:
                    # print(6)
                    if contentstandard:
                        # print(7)
                        # print('contentstandard', contentstandard)
                        contStand = ContentStandard.objects.get(uniqueID=contentstandard)
                        # print(8)
                    else:
                        # print(9)
                        contStand = None
                        # print(10)
                    # 0=Pending Payment, 1=Paid, 2=In Progress, 3=Pending Approval, 4=Complete
                    if isEdit:
                        # print(11)
                        product_ass = ProductAsset.objects.get(uniqueID=asset_id)
                        # print(12)
                        prod = product_ass.product
                        # print(13)
                    elif isCapt:
                        # print(14)
                        product_ass = None
                        # print(15)
                        prod = Product.objects.get(slug=asset_id)
                        # print(16)
                        productList.append(
                            {'counter': prodcounter, 'name': prod.name, 'upc': prod.upccode, 'sku': prod.SKU})
                        # print(17)
                        prodcounter += 1
                    # print(18)
                    order_obj = FullOrder.objects.create(order_ID=orderID,
                                                         status=0, productAsset=product_ass, product=prod,
                                                         contentStandard=contStand,
                                                         profile=profile, createdDate=timezone.now(),
                                                         lastModifiedDate=timezone.now(),
                                                         isEditing=isEdit, isCapture=isCapt)
                    # print(19)

            except Exception as e:
                print('FullOrderSerializer: Error on item order insertion', e, type(e))
                errorsList += item
            # print(20)
            try:
                if attribute == 'contentStandard':
                    order_obj.contentStandard = value
                if attribute == 'singlePhoto':
                    order_obj.singlePhoto = value
                    # counters['singlePhotoCounter']['count'] += 1
                elif attribute == 'fourPack':
                    order_obj.fourPack = value
                    # counters['fourPackCounter']['count'] += 1
                elif attribute == 'fivePack':
                    order_obj.fivePack = value
                    # counters['fivePackCounter']['count'] += 1
                elif attribute == 'standard360':
                    order_obj.standard360 = value
                    # counters['standard360Counter']['count'] += 1
                elif attribute == 'integrated360':
                    order_obj.integrated360 = value
                    # counters['integrated360Counter']['count'] += 1
                elif attribute == 'standard3DModel':
                    order_obj.standard3DModel = value
                    # counters['standard3DModelCounter']['count'] += 1
                elif attribute == 'advanced3DModel':
                    order_obj.advanced3DModel = value
                    # counters['advanced3DModelCounter']['count'] += 1
                elif attribute == 'cinematic3DModel':
                    order_obj.cinematic3DModel = value
                    # counters['cinematic3DModelCounter']['count'] += 1
                elif attribute == 'hdProductVideo':
                    order_obj.hdProductVideo = value
                    # counters['hdProductVideoCounter']['count'] += 1
                elif attribute == 'fourKProduct':
                    order_obj.fourKProduct = value
                    # counters['fourKProductCounter']['count'] += 1
                elif attribute == 'videoWalkthrough':
                    order_obj.videoWalkthrough = value
                    # counters['videoWalkthroughCounter']['count'] += 1
                elif attribute == 'notes2d':
                    order_obj.notes2d = value
                elif attribute == 'notes360view':
                    order_obj.notes360view = value
                elif attribute == 'notes3dmodel':
                    order_obj.notes3dmodel = value
                elif attribute == 'notesvideo':
                    order_obj.notesvideo = value
                elif attribute == 'backgroundRemoval':
                    order_obj.backgroundRemoval = value
                    # counters['backgroundRemovalCounter']['count'] += 1
                elif attribute == 'autoCropAndCenter':
                    order_obj.autoCropAndCenter = value
                    # counters['autoCropAndCenterCounter']['count'] += 1
                elif attribute == 'blemishReduction':
                    order_obj.blemishReduction = value
                    # counters['blemishReductionCounter']['count'] += 1
                elif attribute == 'barcodeDetection':
                    order_obj.barcodeDetection = value
                    # counters['barcodeDetectionCounter']['count'] += 1
                elif attribute == 'applyContentStandard':
                    order_obj.applyContentStandard = value
                    # counters['applyContentStandardCounter']['count'] += 1
                elif attribute == 'colorCorrection':
                    order_obj.colorCorrection = value
                    # counters['colorCorrectionCounter']['count'] += 1
                else:
                    pass

            except Exception as e:
                print('FullOrderSerializer: Error on order type determination', e, type(e))
            # print(21)
            order_obj.save()
            # print(22)
            if not existing:
                # print(21)
                asset_idList[asset_id] = order_obj
                # print(22)

        if len(errorsList) == len(data):
            status = 400
        else:
            status = 200
        return counters, errorsList, status, order_obj, productList

    def getAttributes(self, order_objs):

        # DB name -> chargebee name.
        services = {
            'singlePhoto': 'single-2d-photo',
            'fourPack': '2d-four-pack',
            'fivePack': '2d-five-pack',
            'standard360': '360-photo-pack',
            'integrated360': 'int-360-photo-pack',
            'standard3DModel': 'standard-3d-model',
            'advanced3DModel': 'advanced-3d-model',
            'cinematic3DModel': 'performance-3d-model',
            'hdProductVideo': 'hd-video',
            'fourKProduct': '4k-video',
            'videoWalkthrough': 'video-walkthrough',
            'backgroundRemoval': 'background-removal',
            'autoCropAndCenter': 'auto-crop-and-center',
            'blemishReduction': 'blemish-reduction',
            'barcodeDetection': 'barcode-detection',
            'applyContentStandard': 'apply-content-standard',
            'colorCorrection': 'color-correction',
        }

        prodAssetList = order_objs.values_list('productAsset', flat=True).distinct().exclude(productAsset=None)
        # print('prodAssetList', prodAssetList)
        productAssets = ProductAsset.objects.filter(pk__in=prodAssetList, deletedon='')
        # print('productAssets', productAssets)
        assetdict = {}
        for asset in productAssets:
            # print(FullOrder.objects.filter(productAsset=asset).values('order_ID'))
            # print(asset.product.name)
            product = asset.product
            info = {'name': asset.file_name, 'product': {'id': product.pk, 'name': product.name}, 'services': {}}
            for k, v in services.items():
                orders = list(
                    order_objs.filter(productAsset=asset, **{k: True}).values_list('order_ID', flat=True).distinct())
                info['services'][v] = {'order_ids': orders, 'count': len(orders)}
            assetdict[asset.uniqueID] = info

        order_objs_filter = order_objs.filter(productAsset=None, isCapture=True)
        # print('order_objs_filter', order_objs_filter)
        captOrdersList = order_objs_filter.values_list('product', flat=True).distinct()
        # print('captOrdersList', captOrdersList)
        captOrders = Product.objects.filter(pk__in=captOrdersList)
        # print('captOrders', captOrders)
        for prod in captOrders:
            # if prod.pk in assetdict:
            #     print("True")
            # else: print("False")
            info = {'name': prod.name, 'product': {'id': prod.pk, 'name': ''}, 'services': {}}
            for k, v in services.items():
                orders = list(
                    order_objs_filter.filter(product=prod, **{k: True}).values_list('order_ID', flat=True).distinct())
                info['services'][v] = {'order_ids': orders, 'count': len(orders)}
            assetdict[prod.uniqueID] = info

        individual_orders = {}
        # import pprint
        # pprint.pprint(assetdict)
        for asset in assetdict:
            # print(assetdict[x])
            # print("\n")
            for service in assetdict[asset]['services']:
                theservice = assetdict[asset]['services'][service]
                if theservice['count'] != 0:
                    for orderid in theservice['order_ids']:
                        if orderid not in individual_orders:
                            individual_orders[orderid] = {
                                'fileList': {(assetdict[asset]['name'], asset, assetdict[asset]['product']['name'])},
                                'counters': {service: {'chargebeeServiceID': service, 'count': 1}}}
                        else:
                            individual_orders[orderid]['fileList'].add(
                                (assetdict[asset]['name'], asset, assetdict[asset]['product']['name']))
                            individual_orders[orderid]['counters'][service]['count'] += 1

        for orders in individual_orders:
            setToList = list(individual_orders[orders]['fileList'])
            individual_orders[orders]['fileList'] = setToList
        # print(individual_orders)

        return individual_orders


class EditOrderSerializer(serializers.ModelSerializer):
    order_date = serializers.DateTimeField(required=False)
    orderID = serializers.CharField(required=False)
    status = serializers.CharField(required=False)

    def create(self, validated_data, request):
        ob = Profile.objects.get(user=request.user)
        # status_obj = self.get_status_object()
        validated_data.update({"profile": ob})

        obj = Order.objects.create(**validated_data)

        obj.company = ob.companyProfile

        obj.status = "Pending"

        # if 'saveFlag' in request.data and request.data['saveFlag']:
        obj.save()

        return obj

    class Meta:
        model = Order
        fields = ('orderID', 'order_date', 'status')


class CreateOrderSerializer(serializers.ModelSerializer):
    order_date = serializers.DateTimeField(required=False)
    paid = serializers.BooleanField(read_only=True)
    orderID = serializers.CharField(required=False)
    delivered = serializers.BooleanField(required=False)
    terms_accepted = serializers.BooleanField(required=False)
    balance = serializers.DecimalField(decimal_places=2, max_digits=12, required=False)
    status = serializers.CharField(required=False)
    numberOfProducts = serializers.IntegerField(required=False, allow_null=True)

    def get_full_name(self, obj):
        return str(obj.profile.user.first_name) + ' ' + str(obj.profile.user.last_name)

    # def get_status_object(self):
    #    try:
    #        return StatusMaster.objects.get(id = 7)
    #    except StatusMaster.DoesNotExist:
    #        return ""

    def create(self, validated_data, request):
        ob = Profile.objects.get(user=request.user)
        # status_obj = self.get_status_object()
        validated_data.update({"profile": ob})
        obj = Order.objects.create(**validated_data)
        obj.company = ob.companyProfile
        obj.status = "Pending"
        obj.save()

        return obj

    def updateStatus(self, validated_data, request):
        return {"status": "OK"}

    class Meta:
        model = Order
        fields = (
            'orderID', 'order_date', 'paid', 'delivered', 'terms_accepted', 'balance', 'numberOfProducts', 'status')


class OrderSerializer(serializers.ModelSerializer):
    order_date = serializers.DateTimeField(required=False)
    paid = serializers.BooleanField(read_only=True)
    orderID = serializers.CharField(required=False)
    delivered = serializers.BooleanField(required=False)
    terms_accepted = serializers.BooleanField(required=False)
    balance = serializers.DecimalField(decimal_places=2, max_digits=12, required=False)
    status = serializers.CharField(required=False)
    numberOfProducts = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Order
        fields = (
            'orderID', 'order_date', 'paid', 'delivered', 'terms_accepted', 'balance', 'numberOfProducts', 'status')


class OrderTrackingSerializer(serializers.ModelSerializer):
    order = serializers.CharField(required=True)
    tracking_number = serializers.CharField(required=True)

    def get_order_object(self, order):
        try:
            return Order.objects.get(orderID=order)
        except Order.DoesNotExist:
            return ""

    def create(self, validated_data):

        order_obj = self.get_order_object(validated_data['order'])
        validated_data.update({"order": order_obj})
        obj = OrderTracking.objects.create(**validated_data)
        return obj

    class Meta:
        model = OrderTracking
        fields = ('order', 'tracking_number')


class OrderUpdateSerializer(serializers.ModelSerializer):
    order_date = serializers.DateTimeField(required=False)
    paid = serializers.BooleanField(read_only=True)
    delivered = serializers.BooleanField(required=False)
    terms_accepted = serializers.BooleanField(required=False)
    status = serializers.CharField(required=False)
    balance = serializers.DecimalField(decimal_places=2, max_digits=12, required=False)

    class Meta:
        model = Order
        fields = ('order_date', 'paid', 'delivered', 'terms_accepted', 'status', 'balance')


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    status = serializers.CharField(required=True)

    class Meta:
        model = Order
        fields = ('status',)


class ProductOrderUpdateSerializer(serializers.ModelSerializer):
    status = serializers.CharField(required=True)

    class Meta:
        model = ProductOrder
        fields = ('status',)

    class Meta:
        model = Order
        fields = ('order_date', 'paid', 'delivered', 'terms_accepted', 'status', 'balance')

# class FullOrderSerializer(serializers.ModelSerializer):
#     # contentstandard = ContentStandardListSerializer(many=False, read_only=True)
#     # order = OrderSerializer(many=False, read_only=True)
#     # product = ManualProductCreationSerializer(many=False, read_only=True)
#     user = serializers.SerializerMethodField('get_UserInfo')
#     # contentstandard = ContentStandardListSerializer(many=False, read_only=True)
#     productorders = serializers.SerializerMethodField('get_product_orders')
#
#     # address = serializers.AddressSerializer(many=False, read_only=True)
#
#     # def get_status_object(self):
#     #    try:
#     #        return StatusMaster.objects.get(id = 7)
#     #    except StatusMaster.DoesNotExist:
#     #        return ""
#
#     # TODO: [BACKEND][Dom] Optimize for nested serializers. Needs to remove N+1 performance.
#     #  Ideally, one call for all product orders, and then filter and retrieve PO for the order instance in question
#     def get_product_orders(self, obj):
#         try:
#
#             prod = ProductOrder.objects.filter(order=obj.id).values()
#             product_orders = ProductOrderSerializer(obj, many=True)
#
#             return prod
#         except:
#             return {}
#
#     def get_UserInfo(self, obj):
#         try:
#             orderObj = Order.objects.get(id=obj.id)
#             userObj = User.objects.get(pk=obj.profile.user.id)
#             userDetails = app.accounts.serializers.UserDetailOrderSerializer(userObj, many=False)
#
#             return userDetails.data
#         except User.DoesNotExist:
#             return "No"
#
#     class Meta:
#         model = Order
#         fields = (
#             'id', 'orderID', 'order_date', 'paid', 'delivered', 'terms_accepted', 'status', 'balance',
#             'content_standard',
#             'user', 'productorders')
#         read_only_fields = fields
