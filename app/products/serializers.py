from app.accounts.models import User, Profile, Company
from app.core.models import Snippet
from app.products.models import Product
from app.core.elasticsearch import *
from django.template.defaultfilters import slugify
from django.utils import timezone
import zipfile

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
from rest_framework import serializers, status
from rest_framework.validators import UniqueValidator
from rest_framework.authtoken.models import Token
from rest_framework.serializers import ValidationError

# Other
import threading
import socket
import string
import ipdb
import random
import json
import urllib
import datetime
from app.products.utility import create_url_safe
from app.core.utility import ChargebeeAPI

from app.accounts.activation_token import account_activation_token
import app
from app.core.utility import boto3Pierarchy, boto3Upload3, ZendeskAPI as zen
from app.core.models import API2Cart, UploadAsset, Category
from app.imageEditingFunctions.contentStandardFunctions import load_image
from app.imageEditingFunctions.manipulateImage import ManipulateImage
from app.products.models import Product, MessageParticipant, \
    ProductMessageThread, ProductMessage, ProductAsset, AssetContentStandards
from app.orders.models import OrderTracking, ContentStandard
from app.accounts.serializers import UserEmailSerializer, EmailThread
from django.conf import settings
from .utility import get_file_type
from xapi.settings import TEST_LOCAL, LOCAL_STORAGE_LOCATION, USE_LOCAL_STORAGE, AWS_STORAGE_BUCKET_NAME, \
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
from app.imageEditingFunctions.file_name_functions import findFiles
from os.path import isdir, isfile, join, normcase, split
from os import makedirs, remove
from pathlib import Path
from shutil import copy
from PIL import Image
import io
from app.imageEditingFunctions.threesixty_file_functions import compile360Bundle
import boto3
import base64


class ProductMessageSerializer(serializers.ModelSerializer):
    # sender = UserEmailSerializer(read_only=True)
    # recipient = UserEmailSerializer(read_only=True)

    class Meta:
        model = ProductMessage
        fields = ('sender', 'recipient', 'productMessageThread', 'messageID', 'timestamp', 'message')

        def create(self, validated_data):
            # uid = self.context.get("uid")
            # print("=========>UID", uid)
            # user = User.objects.get(pk=uid)
            # print("==============>>USER", user)
            # token = self.context.get("token")
            # print("============>>Token", token)
            # uid = self.context.get("uid")
            # print(uid)
            # messageThread = ProductMessageThread.objects.get(pk=uid)
            # username = validated_data.get('username', None)

            return ProductMessage.objects.create(**validated_data)


class UserMSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageParticipant
        fields = ['participant', 'first_name', 'last_name']


class ProductMessageThreadCreateSerializer(serializers.ModelSerializer):
    messageThreadName = serializers.CharField(required=False)
    participants = UserMSerializer(many=True, read_only=True)
    messages = ProductMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ProductMessageThread
        fields = ('id', 'product', 'product2DImage', 'product360Image', 'messageThreadID', 'messageThreadName',
                  'creationDateTime', 'lastUpdateDateTime', 'participants', 'messages',)

    def create(self, validated_data):
        return ProductMessageThread.objects.create(**validated_data)


class ProductMessageThreadListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMessageThread
        fields = '__all__'


class ProductListSerializer(serializers.ModelSerializer):
    productid = serializers.SerializerMethodField('get_product_id')
    # category = serializers.SerializerMethodField('get_category_name')
    categoryId = serializers.SerializerMethodField('get_category_id')
    # profile = serializers.SerializerMethodField('get_profile_id')
    # company = serializers.SerializerMethodField('get_company_id')

    category = serializers.StringRelatedField(required=False, read_only=True)
    profile = serializers.PrimaryKeyRelatedField(required=False, read_only=True)
    company = serializers.PrimaryKeyRelatedField(required=False, read_only=True)

    class Meta:
        model = Product
        # fields = ['id','uniqueID','profile','name','SKU','slug','description','stock','price']
        # fields = '__all__'
        fields = '__all__'
        read_only_fields = ['uniqueID', 'createdDate', 'name']

        datatables_always_serialize = ('id')

    # compliance = serializers.SerializerMethodField('get_compliance_violations')
    #
    # def get_compliance_violations(self, obj):
    #     standard = ContentStandard.objects.get(name="Default")
    #     violations = obj.get2DassetCompliance(standard)
    #     return violations

    def get_product_id(self, obj):
        return obj.id

    def get_category_name(self, obj):
        try:
            return obj.category.name
        except Category.DoesNotExist:
            return Category.objects.get(name="Uncategorized").name

    def get_category_id(self, obj):
        return obj.category.id

    def get_profile_id(self, obj):
        try:
            id = obj.profile.id
            return id
        except:
            return None

    def get_company_id(self, obj):
        try:
            id = obj.companyProfile.id
            return id
        except:
            return None


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for the Product Model located in app.products.models
    """
    category = serializers.StringRelatedField(required=False, read_only=True)
    profile = serializers.PrimaryKeyRelatedField(required=False, read_only=True)
    company = serializers.PrimaryKeyRelatedField(required=False, read_only=True)
    categoryId = serializers.SerializerMethodField('get_category_id')
    productid = serializers.SerializerMethodField('get_product_id')
    # TODO: [BACKEND][Jacob] add back in compliance
    # compliance = serializers.SerializerMethodField('get_compliance_violations')

    # shouldn't need all of these fields just pass partial=True in the view.py

    # id = serializers.IntegerField(read_only=True)
    # uniqueID = serializers.CharField(required=False)
    # slug = serializers.SlugField(required=False)
    # description = serializers.CharField(required=False)
    # url = serializers.CharField(required=False)
    # AssetURLFolder = serializers.CharField(required=False)
    # AssetURL2D = serializers.CharField(required=False)
    # AssetURL3D = serializers.CharField(required=False)
    # productOwner = serializers.CharField(required=False)
    # available = serializers.BooleanField(required=False)
    # has3Dfile = serializers.BooleanField(required=False)
    # has2Dfile = serializers.BooleanField(required=False)
    # createdDate = serializers.DateTimeField(required=False)
    # updatedDate = serializers.DateTimeField(required=False)
    # manufacturer = serializers.CharField(required=False)
    # stock = serializers.IntegerField(required=False)
    # price = serializers.DecimalField(decimal_places=2, max_digits=12, required=False)
    # creditsCost = serializers.DecimalField(decimal_places=2, max_digits=12, required=False)
    # specifications = serializers.ManyToManyField('app.ProductAttribute', blank=True)
    # _lastJobDate = serializers.DateTimeField(required=False)
    # _proposedJobDate = serializers.DateTimeField(required=False)
    # isScanComplete = serializers.BooleanField(required=False)
    # is2DCaptureComplete = serializers.BooleanField(required=False)
    # is3DCaptureComplete = serializers.BooleanField(required=False)
    # length = serializers.DecimalField(decimal_places=3, max_digits=12, required=False)
    # width = serializers.DecimalField(decimal_places=3, max_digits=12, required=False)
    # height = serializers.DecimalField(decimal_places=3, max_digits=12, required=False)
    # weight = serializers.DecimalField(decimal_places=3, max_digits=12, required=False)
    # ecommerce_id = serializers.CharField(required=False)
    # upccode = serializers.CharField(required=False)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['createdDate', 'name', 'SKU', 'UPCType', 'read_only=True']
        # not sure why they were specifying fields because there are misspellings/misreferences all over the place,
        # kept it in here for reference
        #
        # fields = (
        #     'productid', 'name', 'SKU', 'UPCType', 'category', 'categoryId', 'profile', 'company', 'compliance',
        #    'uniqueID', 'slug', 'description', 'directoryURL', 'AssetURL2D', 'AssetURL3D', 'productOwner', 'available',
        #    'has3Dfile', 'has2Dfile', 'created', 'updated', 'manufacturer', 'stock', 'price', 'creditsCost',
        #     '_lastJobDate', '_proposedJobDate', 'isScanComplete', 'is2DCaptureComplete', 'is3DCaptureComplete',
        #     'length', 'width', 'height', 'weight', 'ecommerce_id', 'upccode')

    def get_compliance_violations(self, obj):
        """
        get the compliance violations of a specific product
        :param obj: Product object
        :return: list of violations
        """
        standard = ContentStandard.objects.get(name="Default")
        violations = obj.get2DassetCompliance(standard)
        return violations

    # def generate_asset_attributes(self, obj):
    #     """
    #     generate the asset attributes of a specific product
    #     :param obj: Product object
    #     :return: Boolen Tue = successful
    #     """
    #     out = obj.generate_asset_attributes()
    #     return out

    def get_product_id(self, obj):
        return obj.id

    # def get_category_name(self, obj):
    #     try:
    #         return obj.category.name
    #     except Category.DoesNotExist:
    #         return Category.objects.get(name="Uncategorized").name

    def get_category_id(self, obj):
        try:
            return obj.category.id
        except:
            return None

    # def get_profile_id(self, obj):
    #     try:
    #         return obj.profile.id
    #     except:
    #         return None
    #
    # def get_company_id(self, obj):
    #     try:
    #         out = obj.companyProfile.id
    #         return out
    #     except:
    #         return None


class ProductUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating the product
    """

    class Meta:
        model = Product
        fields = '__all__'


class ProductUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadAsset
        # fields = '_all_'
        fields = ['id', 'user_name', 'upload_file', 'location', 'upload_date']
        read_only_fields = ['user_name']

    def create(self, validated_data):
        """
        create a product asset linked to a product and profile in the database
        """
        print("!!!!!!!!!!!!!!!!!!!!!!     ProductUploadSerializer.CREATE Function   !!!!!!!!!!!!!!!!!!!!!")

        pk = self.context.get("pk")
        # username = self.context.get('username')  # unused
        upload_file = self.context.get('file')
        # data = upload_file.read()
        product_slug = self.context.get('product_slug')
        product_uniqueID = Product.objects.get(slug=product_slug).uniqueID
        # adminUsername = User.objects.filter(pk=1)  # unused
        user = User.objects.get(pk=pk)
        profile = Profile.objects.get(user=pk)
        company = profile.companyProfile
        com = company.slug
        product = Product.objects.get(uniqueID=product_uniqueID)
        # print("company slug:", com)
        # print("pk:", pk)
        # print("username:", username)
        # print("upload File:", upload_file)
        # print("Product_Slug:", product_slug)
        # print("product_uniqueID:", product_uniqueID)
        # print("user:", user)
        # print("profile:", profile)
        # print("company:", company)

        # let's get the file name
        tp = upload_file.__str__()
        typ = tp.lower()

        # let's get the type of file we're dealing with
        file_type = get_file_type(typ)

        # new way of adding an asset; much more concise
        # check that the asset is not a 360 or folder, if so let's go farther into the rabbit hole
        if int(file_type) != int(2) or int(file_type) == int(0):
            # if it is a single file let's give it a "2D" string
            if int(file_type) == int(1):
                typs = "2D"
            # if it's a video, let's give it a "Video" string
            elif int(file_type) == int(3):
                typs = "Video"
            # if it's a 3D model, let's give it a "3D" string
            elif int(file_type) == int(4):
                typs = "3D"
            # otherwise it is a miscellaneous asset
            else:
                typs = "Miscellaneous"

            # let's create our key
            key = (com + '/products/' + product_slug + '/' + typs)
            overwriteFlag = False
            if USE_LOCAL_STORAGE:
                outputLocation = normcase(join(LOCAL_STORAGE_LOCATION, key))
                if not isdir(outputLocation):
                    makedirs(outputLocation)
                location = normcase(join(outputLocation, upload_file.name))
                if isfile(location):
                    print("overwriting file at:", location)
                    overwriteFlag = True
                with open(location, 'wb+') as f:
                    f.write(upload_file.read())
                print("successfully wrote to:", location)

            # otherwise we are saving it to the cloud
            else:
                print("company slug and key", com, key)
                location = boto3Upload3(upload_file, com, key)
                loc = location.split('/')
                newlocation = loc[0] + '//d27vruithpdhv2.cloudfront.net/' + loc[3] + '/' + loc[4] + '/' + loc[5] + '/' + \
                              loc[6] + '/' + loc[7]
                print("new_assset", loc, "\n", newlocation)

            try:
                # let's create the new asset in the database
                new_asset = ProductAsset()
                new_asset.product = product
                new_asset.file_name = upload_file.name
                new_asset.company_id = company.id
                if USE_LOCAL_STORAGE:
                    # record the local storage area
                    new_asset.url = location
                else:
                    # use cloudfront location
                    new_asset.url = str(newlocation)
                # get size of the product asset in kB
                new_asset.size = upload_file.size / 1024
                new_asset.lastmodified = timezone.now()
                new_asset.deletedon = ''
                new_asset.assetType = file_type
                new_asset.original = True
                new_asset.is_thumbnail = False
                new_asset.save()
                print('new asset created in database')
                try:
                    # let's generate some data on the asset so that it makes for quicker compliance
                    # lookups in the future
                    new_asset.generate_asset_attributes()
                    print('generated asset attributes')
                except:
                    print("Could not generate asset attributes for:", str(upload_file.name))

                # let's make the thumbnail for this little pupper
                # resize the image to 250 x 250
                # print("made it halfway through the upload asset")
                try:
                    img = Image.open(upload_file)
                    THUMBNAIL_FORMAT = img.format
                    print("THUMBNAIL_FORMAT", THUMBNAIL_FORMAT)
                    imageEditor = ManipulateImage(img, productAsset=new_asset)
                    THUMBNAIL_HEIGHT = 250
                    THUMBNAIL_WIDTH = 250
                    params = {'square': {'fill_color': (255, 255, 255, 255)},
                              'resize': {'height': THUMBNAIL_HEIGHT,
                                         'width': THUMBNAIL_WIDTH}}
                    thumbnail, mask = imageEditor.manipulate(params)
                    print("manipulated image")

                    del img
                    del imageEditor
                    print('made thumbnail')
                    # let's creat our key
                    key = (com + '/products/' + product_slug + '/' + typs + '/thumbnails/')
                    if USE_LOCAL_STORAGE:
                        print("here")
                        print(LOCAL_STORAGE_LOCATION, key)
                        outputLocation = normcase(join(LOCAL_STORAGE_LOCATION, key))
                        print(outputLocation)
                        if not isdir(outputLocation):
                            makedirs(outputLocation)

                        print(outputLocation, upload_file.name)
                        location = normcase(join(outputLocation, upload_file.name))
                        print(location)
                        print("about to save", thumbnail)
                        if isfile(location):
                            print("overwriting file at:", location)
                        thumbnail.save(location)
                        print("successfully wrote to:", location)

                    # otherwise we are saving it to the cloud
                    else:
                        print("trying to save it to the cloud")
                        # Save the image to an in-memory byte string file
                        in_mem_file = io.BytesIO()
                        if thumbnail.format is None:
                            print('io setup and prepping PIL save with format as:', THUMBNAIL_FORMAT)
                            thumbnail.save(in_mem_file, format=THUMBNAIL_FORMAT)
                        else:
                            print('io setup and prepping PIL save with format as:', thumbnail.format)
                            thumbnail.save(in_mem_file, format=thumbnail.format)
                        print('thumbnail saved in memory')
                        in_mem_file.seek(0)
                        print('at beginning of file')
                        location = boto3Upload3(in_mem_file, com, key, is_bytes=True, fileName=upload_file.name)
                        print('saved file at', location)
                        loc = location.split('/')

                        newlocation = loc[0] + '//d27vruithpdhv2.cloudfront.net/' + loc[3] + '/' + loc[4] + '/' + loc[5] + \
                                      '/' + loc[6] + '/' + loc[7] + '/' + str(upload_file.name)
                        print('cloudfront location', newlocation)

                    print("creating thumbnail asset")
                    new_thumbnail = ProductAsset()
                    new_thumbnail.product = product
                    new_thumbnail.file_name = upload_file.name
                    new_thumbnail.company_id = company.id
                    new_thumbnail.is_thumbnail = True
                    if USE_LOCAL_STORAGE:
                        # record the local storage area
                        new_thumbnail.url = location
                        new_asset.thumbnail_url = location
                        if product.thumbnail is None or\
                                product.thumbnail == '' or\
                                product.thumbnail == 'XSPACE-subtle-color.png':
                            product.thumbnail = str(location)
                            product.save()
                    else:
                        # s3 location
                        print("thumbnail location registered as:", str(newlocation))
                        new_thumbnail.url = str(newlocation)
                        new_asset.thumbnail_url = str(newlocation)
                        if product.thumbnail is None or product.thumbnail == '' or product.thumbnail == 'XSPACE-subtle-color.png':
                            product.thumbnail = str(newlocation)
                            product.save()
                    new_thumbnail.size = upload_file.size / 1024
                    new_thumbnail.lastmodified = timezone.now()
                    new_thumbnail.deletedon = ''
                    new_thumbnail.asset_height = THUMBNAIL_HEIGHT
                    new_thumbnail.asset_width = THUMBNAIL_WIDTH
                    new_thumbnail.asset_channels = 3
                    new_thumbnail.assetType = file_type
                    new_thumbnail.asset_background_type = new_asset.asset_background_type
                    new_thumbnail.save()
                    new_asset.thumbnail_id = new_thumbnail.id
                    new_asset.save()
                    print('thumbnail asset in database and connected to the asset')
                except:
                    new_asset.thumbnail_url = 'XSPACE-subtle-color.png'
                    new_asset.save()
                    print("thumbnail not created")
            except:
                return(status.HTTP_400_BAD_REQUEST)
        else:
            # TODO: [BACKEND][Jacob] add in 360 logic
            # we didn't upload anything so return None
            print('no file uploaded for:', upload_file)
            return status.HTTP_400_BAD_REQUEST

        try:
            # since we were successful, let's create the new message thread for the new asset
            new_thread = ProductMessageThread()
            new_thread.product = product
            new_thread.productAsset_id = new_asset.id
            new_thread.messageThreadName = str(upload_file.name)
            currentDT = timezone.now()
            new_thread.creationDateTime = currentDT
            new_thread.lastUpdateDateTime = currentDT
            new_thread.save()
            print('new thread created')

            # let's create a new part to this message thread
            # print("creating message part")
            createdThread = ProductMessageThread.objects.get(pk=new_thread.id)

            new_part = MessageParticipant()
            new_part.first_name = profile.first_name
            new_part.last_name = profile.last_name
            new_part.participant = user
            new_part.save()
            # print("saved the new part in the new thread before")
            createdThread.participants.add(new_part)
            # createdThread.participants.add(user[0])
            createdThread.save()
            print('new participant created')
            # print("saved the new part in the new thread after")
        except:
            pass
        sizeInMB = upload_file.size / 1024
        # print(sizeInMB)
        company.current_storage_size += sizeInMB
        company.save()
        print('company updated')
        return {'location': location}  # UploadAsset.objects.create(user_name=user_name, upload_file=location, location=location)


class ProductUploadFolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadAsset
        # fields = '_all_'
        fields = ['id', 'user_name', 'upload_file', 'location', 'upload_date']
        read_only_fields = ['user_name']

    def create(self, validated_data):
        from app.imageEditingFunctions.file_name_functions import file_copy
        new_asset = None
        list_of_stuff_to_do = self.context.get('files')
        user_id = self.context.get('pk')
        username = self.context.get('username')
        profile_object = Profile.objects.get(user=user_id)
        user_object = User.objects.get(pk=user_id)
        company_object = self.context.get('company')
        print('backend serializer recieved:', list_of_stuff_to_do)
        list_count = 0
        print('list length', len(list_of_stuff_to_do))
        # convert string to dict
        json_string = list_of_stuff_to_do
        list_of_stuff_to_do = json.loads(json_string)
        keys = list_of_stuff_to_do.keys()
        print('keys', keys)
        for key in keys:
            # make sure we know where this guy is going, if we don't know and the user did not correct it,
            # then we will not upload it and it will be deleted.
            print(key)
            if key == 'Unknown File Naming Schema' or key == 'Current XSPACE Location of Assets':
                # TODO: [BACKEND][Jacob] add in deletion criteria for the items that fall into this category
                list_count += 1
                continue

            primary_key = list_count
            print('key', list_count)
            try:
                print('key', list_of_stuff_to_do[key])
            except:
                pass
            try:
                print('list_count', list_of_stuff_to_do[list_count])
            except:
                pass
            product_uniqueID = list_of_stuff_to_do[key]['uniqueID']
            print('product_uniqueID', product_uniqueID)
            product_object = Product.objects.get(uniqueID=product_uniqueID)
            asset_paths_list = [list_of_stuff_to_do[key]['2D'], list_of_stuff_to_do[key]['Video'],
                                list_of_stuff_to_do[key]['Misc'], list_of_stuff_to_do[key]['3D'],
                                list_of_stuff_to_do[key]['360']]
            count = 0
            print('working on:', primary_key)
            print('asset_paths_list', asset_paths_list)
            for asset_paths in asset_paths_list:
                if len(asset_paths) == 0:
                    count += 1
                    continue
                if count < 4:
                    # 360's are the only assets that need special attention at this time
                    # because they have to be compiled
                    if count == 0:
                        typs = '2D'
                        file_type = 1
                    elif count == 1:
                        typs = 'Video'
                        file_type = 3
                    elif count == 2:
                        typs = 'Miscellaneous'
                        file_type = 5
                    else:
                        typs = '3D'
                        file_type = 4

                    for asset_path in asset_paths:
                        file_name = split(asset_path)[1]
                        outputLocation = company_object.slug + '/products/' + product_object.slug + '/' + typs
                        if USE_LOCAL_STORAGE:
                            outputLocation = normcase(join(LOCAL_STORAGE_LOCATION, outputLocation))
                            file_copy(str(asset_path), outputLocation, delete_original=True)
                            # TODO: [BACKEND][Jacob] add in overwrite protection
                            print("successfully wrote to:", outputLocation)
                            # otherwise we are saving it to the cloud
                        else:
                            file_copy(str(asset_path), outputLocation, delete_original=True)
                            # TODO: [BACKEND][Jacob] known bug: verify that the cloudfront location is correct
                            loc = outputLocation.split('/')
                            newlocation = loc[0] + '//d27vruithpdhv2.cloudfront.net/' + loc[3] + '/' + loc[4] + '/' +\
                                          loc[5] + '/' + loc[6] + '/' + loc[7]

                        # let's create the new asset in the database
                        new_asset = ProductAsset()
                        new_asset.product = product_object
                        new_asset.file_name = file_name
                        if USE_LOCAL_STORAGE:
                            # record the local storage area
                            new_asset.url = join(outputLocation, file_name)
                        else:
                            # use cloudfront location
                            new_asset.url = str(newlocation)
                        new_asset.lastmodified = timezone.now()
                        new_asset.deletedon = ''
                        new_asset.assetType = file_type
                        new_asset.original = True
                        new_asset.is_thumbnail = False
                        new_asset.save()

                        try:
                            # let's generate some data on the asset so that it makes for quicker lookups in the future
                            new_asset.generate_asset_attributes()
                        except:
                            print("Could not generate asset attributes for:", str(file_name))

                        # let's make the thumbnail for this little pupper
                        # resize the image to 100 x 100
                        # print("made it halfway through the upload asset")
                        if count == 0:
                            img = load_image(new_asset.url)
                            img = Image.open(img)
                            imageEditor = ManipulateImage(img)
                            params = {'square': {'fill_color': (255, 255, 255, 255)},
                                      'resize': {'height': 100,
                                                 'width': 100}}
                            thumbnail = imageEditor.manipulate(params)

                            del img
                            del imageEditor

                            # let's creat our key
                            outputLocation = (company_object.slug + '/products/' + product_object.slug + '/' + typs + '/thumbnails/')
                            if USE_LOCAL_STORAGE:
                                outputLocation = normcase(join(LOCAL_STORAGE_LOCATION, outputLocation))
                                if not isdir(outputLocation):
                                    makedirs(outputLocation)
                                location = normcase(join(outputLocation, file_name))
                                if isfile(location):
                                    print("overwriting file at:", location)
                                thumbnail.save(location, optimize=True, format='JPEG')
                                print("successfully wrote to:", location)

                            # otherwise we are saving it to the cloud
                            else:
                                location = boto3Upload3(thumbnail, company_object.slug, outputLocation)
                                loc = location.split('/')
                                newlocation = loc[0] + '//d27vruithpdhv2.cloudfront.net/' + loc[3] + '/' + loc[4] + '/' + \
                                              loc[5] + \
                                              '/' + loc[6] + '/' + loc[7]

                            new_thumbnail = ProductAsset()
                            new_thumbnail.product = product_object
                            new_thumbnail.is_thumbnail = True
                            new_thumbnail.file_name = file_name
                            if USE_LOCAL_STORAGE:
                                # record the local storage area
                                new_thumbnail.url = location
                                new_asset.thumbnail_url = location
                                if product_object.thumbnail_url is None or product_object.thumbnail_url == '':
                                    product_object.thumbnail_url = str(location)
                                    product_object.save()
                            else:
                                # use cloudfront location
                                new_thumbnail.url = str(newlocation)
                                new_asset.thumbnail_url = str(newlocation)
                                if product_object.thumbnail_url is None or product_object.thumbnail_url == '':
                                    product_object.thumbnail_url = str(newlocation)
                                    product_object.save()

                            new_thumbnail.lastmodified = timezone.now()
                            new_thumbnail.deletedon = ''
                            new_thumbnail.asset_height = 100
                            new_thumbnail.asset_width = 100
                            new_thumbnail.asset_channels = 3
                            new_thumbnail.assetType = file_type
                            new_thumbnail.asset_background_type = new_asset.asset_background_type
                            new_thumbnail.save()
                            new_asset.thumbnail_id = new_thumbnail.id
                            new_asset.save()

                        # since we were successful, let's create the new message thread for the new asset
                        new_thread = ProductMessageThread()
                        new_thread.product = product_object
                        new_thread.productAsset_id = new_asset
                        new_thread.messageThreadName = file_name
                        currentDT = timezone.now()
                        new_thread.creationDateTime = currentDT
                        new_thread.lastUpdateDateTime = currentDT
                        new_thread.save()

                        # let's create a new part to this message thread
                        # print("creating message part")
                        createdThread = ProductMessageThread.objects.get(pk=new_thread.id)

                        new_part = MessageParticipant()
                        new_part.first_name = profile_object.first_name
                        new_part.last_name = profile_object.last_name
                        new_part.participant = user_object.id
                        new_part.save()
                        # print("saved the new part in the new thread before")
                        createdThread.participants.add(new_part)
                        createdThread.save()

                        # update company storage information
                        company_object.update_storage()
                        company_object.save()
                else:
                    # we are dealing with a 360/spin
                    print('working on 360')
                    spin_list = []
                    for spin in asset_paths:
                        # let's move the images into the 360 directory
                        outputLocation = company_object.slug + '/products/' + product_object.slug + \
                                         '/360/' + str(primary_key)
                        if USE_LOCAL_STORAGE:
                            outputLocation = normcase(join(LOCAL_STORAGE_LOCATION, outputLocation))
                        for asset_path in spin:
                            if USE_LOCAL_STORAGE:
                                fc_loc = file_copy(str(asset_path), outputLocation, delete_original=True)
                                # TODO: [BACKEND][Jacob] add in overwrite protection
                                print("successfully wrote to:", outputLocation)
                                # otherwise we are saving it to the cloud
                            else:
                                # move the asset to the new location
                                fc_loc, fc_key = file_copy(str(asset_path), outputLocation, delete_original=True, return_key=True)
                                # TODO: [BACKEND][Jacob] known bug: verify that the cloudfront location is correct
                                loc = fc_loc.split('/')
                                print(loc, fc_loc)
                                newlocation = loc[0] + '//d27vruithpdhv2.cloudfront.net'
                                c = 0
                                for l in loc:
                                    if c < 3:
                                        c += 1
                                    else:
                                        newlocation = str(str(newlocation) + str('/') + str(l))
                                print(newlocation)
                                spin_list.append(fc_key)
                        # create the blank product asset for the 360
                        print(1)
                        new_asset = ProductAsset()
                        print(2)
                        new_asset.product = product_object
                        print(3)
                        new_asset.file_name = str(primary_key)
                        print(4)
                        if USE_LOCAL_STORAGE:
                            # record the local storage area
                            new_asset.url = outputLocation
                        else:
                            # use cloudfront location
                            new_asset.url = str(newlocation)
                            print(5)
                        new_asset.lastmodified = timezone.now()
                        print(6)
                        new_asset.deletedon = ''
                        print(7)
                        new_asset.assetType = int(2)
                        print(8)
                        new_asset.original = True
                        new_asset.is_thumbnail = False
                        print(9)
                        new_asset.save()
                        print(10)
                        if USE_LOCAL_STORAGE:
                            params = {'targetDirectory': split(str(outputLocation))[0],
                                      'productAsset': new_asset,
                                      'productAssetList': spin,
                                      'resultDirectory': None,
                                      'flatten': False,
                                      'mediaUploadFlag': True}
                        else:
                            params = {'targetDirectory': split(str(fc_key))[0],
                                      'productAsset': new_asset,
                                      'productAssetList': spin_list,
                                      'resultDirectory': None,
                                      'flatten': False,
                                      'mediaUploadFlag': True}
                        print(11)
                        compile360Bundle(params=params)
                        print('compiled 360')
                count += 1

        return new_asset


class ProductSpinUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadAsset
        # fields = '_all_'
        fields = ['id', 'user_name', 'upload_file', 'location', 'upload_date']
        read_only_fields = ['user_name']

    def create(self, validated_data):
        """
        create a 360 product asset and compile the spin all of which is linked to a product, company, and profile
         in the database, takes in either a list of images, folder logic coming soon
        """
        print("!!!!!!!!!!!!!!!!!!!!!!     ProductSpinUploadSerializer.CREATE Function   !!!!!!!!!!!!!!!!!!!!!")
        # TODO: add in folder logic (iterate through the folder)
        pk = self.context.get("pk")
        # username = self.context.get('username')  # unused
        upload_file = self.context.get('file')
        # data = upload_file.read()
        product_slug = self.context.get('product_slug')
        product_uniqueID = Product.objects.get(slug=product_slug).uniqueID
        # adminUsername = User.objects.filter(pk=1)  # unused
        user = User.objects.get(pk=pk)
        profile = Profile.objects.get(user=pk)
        company = profile.companyProfile
        com = company.slug
        product = Product.objects.get(uniqueID=product_uniqueID)
        imageList = self.context.get('imageList')
        if imageList == 1:
            # we have a folder so let's grab the images
            _, imageList = findFiles(imageList, subd=False)
            if len(imageList) == 0:
                # images might be held in a subdirectory
                _, imageList = findFiles(imageList)
                if len(imageList) == 0:
                    print("found no images to compile")
                    return None

        # save the images, then compile

        for image in imageList:
            new_asset = ProductAsset()
            new_asset.product = product
            new_asset.file_name = upload_file.name
            if USE_LOCAL_STORAGE:
                # record the local storage area
                new_asset.url = location
            else:
                # use cloudfront location
                new_asset.url = str(newlocation)
            new_asset.size = upload_file.size / 1024
            new_asset.lastmodified = timezone.now()
            new_asset.deletedon = ''
            new_asset.assetType = file_type
            new_asset.original = True
            new_asset.is_thumbnail = False
            new_asset.save()


class ThumbnailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadAsset
        # fields = '_all_'
        fields = ['id', 'user_name', 'upload_file', 'location', 'upload_date']
        read_only_fields = ['user_name']

    def create(self, validated_data):
        """
        create a product asset linked to a product and profile in the database
        """
        print("!!!!!!!!!!!!!!!!!!!!!!     ThumbnailSerializer.CREATE Function   !!!!!!!!!!!!!!!!!!!!!")

        pk = self.context.get("pk")
        # username = self.context.get('username')  # unused
        product_slug = self.context.get('product_slug')
        product_uniqueID = Product.objects.get(slug=product_slug).uniqueID
        productAsset = ProductAsset.objects.get(id=self.context.get('productAsset_id'))
        profile = Profile.objects.get(user=pk)
        company = profile.companyProfile
        com = company.slug
        product = Product.objects.get(uniqueID=product_uniqueID)
        # print("company slug:", com)
        # print("pk:", pk)
        # print("username:", username)
        # print("upload File:", upload_file)
        # print("Product_Slug:", product_slug)
        # print("product_uniqueID:", product_uniqueID)
        # print("user:", user)
        # print("profile:", profile)
        # print("company:", company)

        # let's get the file name
        typ = productAsset.file_name.lower()

        # let's get the type of file we're dealing with
        file_type = productAsset.assetType

        # new way of adding an asset; much more concise
        # check that the asset is not a 360, 3D model or folder, if so let's go farther into the rabbit hole
        if int(file_type) != int(2) or int(file_type) != int(4):
            # if it is a single file let's give it a "2D" string
            if int(file_type) == int(1):
                typs = "2D"
            # if it's a video, let's give it a "Video" string
            elif int(file_type) == int(3):
                typs = "Video"
            # otherwise it is a miscellaneous asset and we can't really make a thumbnail for it
            else:
                return None

            # let's make the thumbnail for this little pupper
            # resize the image to 100 x 100
            img = load_image(productAsset.url)
            img = Image.open(img)
            imageEditor = ManipulateImage(img)
            params = {'square': {'fill_color': (255, 255, 255, 255)},
                      'resize': {'height': 100,
                                 'width': 100}}
            thumbnail = imageEditor.manipulate(params)
            thumbnail = thumbnail.tobytes()

            # save on memory
            del img
            del imageEditor

            # let's creat our key
            key = (com + '/products/' + product_slug + '/' + typs + '/thumbnails/')
            if USE_LOCAL_STORAGE:
                outputLocation = normcase(join(LOCAL_STORAGE_LOCATION, key))
                if not isdir(outputLocation):
                    makedirs(outputLocation)
                location = normcase(join(outputLocation, productAsset.file_name))
                if isfile(location):
                    print("overwriting file at:", location)
                with open(location, 'wb+') as f:
                    f.write(thumbnail)
                print("successfully wrote to:", location)

            # otherwise we are saving it to the cloud
            else:
                location = boto3Upload3(thumbnail, com, key)
                loc = location.split('/')
                newlocation = loc[0] + '//d27vruithpdhv2.cloudfront.net/' + loc[3] + '/' + loc[4] + '/' + loc[5] + \
                              '/' + loc[6] + '/' + loc[7]

            new_thumbnail = ProductAsset()
            new_thumbnail.product = product
            new_thumbnail.is_thumbnail = True
            new_thumbnail.file_name = productAsset.file_name
            if USE_LOCAL_STORAGE:
                # record the local storage area
                new_thumbnail.url = location
                productAsset.thumbnail_url = location
                if product.thumbnail_url is None or product.thumbnail_url == '':
                    product.thumbnail_url = str(location)
                    product.save()
            else:
                # use cloudfront location
                new_thumbnail.url = str(newlocation)
                productAsset.thumbnail_url = str(newlocation)
                if product.thumbnail_url is None or product.thumbnail_url == '':
                    product.thumbnail_url = str(newlocation)
                    product.save()
            new_thumbnail.size = ''
            new_thumbnail.lastmodified = timezone.now()
            new_thumbnail.deletedon = ''
            new_thumbnail.assetType = file_type
            new_thumbnail.save()
            productAsset.thumbnail_id = new_thumbnail.id
            productAsset.save()

            try:
                # let's generate some data on the asset so that it makes for quicker lookups in the future
                new_thumbnail.generate_asset_attributes()
            except:
                print("could not generate asset attributes for:", str(productAsset.file_name), "thumbnail")

        else:
            if int(file_type) == int(2):
                # TODO: [BACKEND][Jacob] add in 360 logic
                # we didn't upload anything so return None
                return None
            else:
                # TODO: [BACKEND][Jacob] add in 3D logic
                # we didn't upload anything so return None
                return None


class EditUploadSerializer(serializers.ModelSerializer):
    """
    Upload a single image to AWS
    """

    class Meta:
        model = UploadAsset
        # fields = '_all_'
        fields = ['id', 'user_name', 'upload_file', 'location', 'upload_date']
        read_only_fields = ['user_name']

    def create(self, validated_data):
        pk = self.context.get("pk")

        # determine file type to dictate which
        upload_file = self.context.get('file')

        orderID = self.context.get('orderID')
        # print(upload_file)

        # adminUsername = User.objects.filter(pk=1)
        user = User.objects.get(pk=pk)
        profile = Profile.objects.get(user=user)
        company = profile.companyProfile
        com = company.slug
        co = slugify(com)

        tp = upload_file.__str__()
        typ = tp.lower()
        typs = ""
        key = ""
        location = ""

        if typ.endswith(".jpg") or typ.endswith(".png") or typ.endswith(".jpeg"):
            key = ('/orders/editing/' + orderID)
            location = boto3Upload3(upload_file, co, key)
            loc = location.split('/')
            # newlocation = loc[0]+'//d27vruithpdhv2.cloudfront.net/'+loc[3]+'/'+loc[4]+'/'+loc[5]+'/'+loc[6]+'/'+loc[7]

        return {'location': location}


class ManualProductCreationSerializer(serializers.ModelSerializer):
    """
    Serializer for a user to manually create a product
    """
    name = serializers.CharField(required=True)
    SKU = serializers.CharField(required=True, allow_blank=True)
    UPCType = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    upccode = serializers.CharField(required=False, allow_blank=True)
    manufacturer = serializers.CharField(required=False, allow_blank=True, default="Undefined")

    class Meta:
        model = Product
        fields = '__all__'

    def get_profile_id(self, obj):
        """
        return the profile id of an object passed through
        :param obj: 
        :return: the profile id
        """
        try:
            out = obj.profile.id
            return out
        except:
            print("Could not retrieve Profile ID")
            return None

    def get_company_id(self, obj):
        """
        return the company id of an object passed through
        :param obj: 
        :return: the company id
        """
        try:
            return obj.companyProfile.id
        except:
            print("Could not retrieve Company ID")
            return None

    def get_product_id(self, obj):
        """
        return the product_id of an object passed through
        :param obj: 
        :return: the product id
        """
        try:
            print("[WARN] Retrieved Company ID, wanted product id")
            return obj.companyProfile.id
        except:
            print("Could not retrieve Product ID")
            return None

    def get_category_name(self, obj):
        """
        return the category name of an object passed through
        :param obj: 
        :return: the category name
        """
        try:
            return obj.category.name
        except:
            print("Could not retrieve Category ID")
            return None

    def create_product(self, validated_data, request, store_product=None, is_ecommerce=False, ecommerce_type=None,
                       template=None, ecommerce_id=None):
        """
        Manual product creation for categorized products
        """
        # request.data is passed through in validated data
        flag = False
        print('serializer', validated_data, request, template)
        try:
            if 'category' in request.data:
                print("Checking category")
                # print(str(request.data['category']), str(request.data['category']).isdigit())
                if (str(request.data['category'])).isdigit():
                    category_object = Category.objects.get(id=request.data['category'])
                    validated_data.update({'category': category_object})
                    print("Updated validated data")
                else:
                    try:
                        category_object = Category.objects.get(slug=request.data['category'])
                    except:
                        category_object = Category.objects.get(slug="uncategorized")
                    validated_data.update({'category': category_object})
                flag = True
        except:
            pass
        try:
            if 'category' in validated_data or 'cat' in validated_data:
                if str(validated_data['category']).isdigit():
                    pass
                else:
                    try:
                        category_object = Category.objects.get(name=validated_data['category'])
                    except:
                        category_object = Category.objects.get(slug="uncategorized")
                    validated_data.update({'category': category_object})
                    flag = True
        except:
            pass
        try:
            if store_product is not None or store_product != '':
                # print('on the store product side of things')
                if (str(store_product['category'])).isdigit():
                    validated_data.update({'category': Category.objects.get(id=store_product['category'])})
                else:
                    product_category = store_product['category']
                    try:
                        category_object = Category.objects.get(slug=product_category)
                    except:
                        category_object = Category.objects.get(slug="uncategorized")
                    validated_data.update({'category': category_object})
                    flag = True
        except:
            pass

        if flag is False:
            category_object = Category.objects.get(slug="uncategorized")
            validated_data.update({'category': category_object})
        try:
            if is_ecommerce:
                # print("on the ecommerce side of things")
                """
                E-commerce type is present
                """
                api_key = API2CART_API_KEY
                a2cobject = API2Cart.objects.get(user=request.user)
                if ecommerce_type == 'Magento1212':
                    store_id = a2cobject.magento_store_id
                elif ecommerce_type == 'Shopify':
                    store_id = a2cobject.shopify_store_id
                else:
                    store_id = a2cobject.woocommerce_store_id

                # get product category name from e-commerce store
                e_commerce_categoryId = str(store_product['category']).rsplit(',')
                try:
                    for id in e_commerce_categoryId:
                        e_commerce_category_details = urllib.Request(
                            API2CART_DOMAIN + CATEGORY_INFO + '?api_key=' + api_key + "&store_key=" + store_id + "&id=" + id)
                        e_commerce_category = json.loads(urllib.urlopen(e_commerce_category_details).read())
                        if e_commerce_category['result']['name']:
                            try:
                                xSpaceCategory = Category.objects.get(name=e_commerce_category['result']['name'])
                                validated_data.update({'category_id': xSpaceCategory.id})
                            except:
                                print("Store Category Not Found on Xspace Platform")
                except:
                    print("Store Category Not Found on Xspace Platform")

                if validated_data['category_id']:
                    print("Category id  is already Updated..")
                else:
                    print("Updating.. category id")
                    xSpaceCategory = Category.objects.get(slug="uncategorized")
                    validated_data.update({'category_id': xSpaceCategory.id})
                validated_data.update({'ecommerce_id': ecommerce_type + '-' + store_product['ecommerce_id']})
        except:
            pass
        try:
            # let's go ahead and try to create the product
            user_object = User.objects.get(email=request.user)
            profile_object = Profile.objects.get(user=user_object.id)
            # print(profile_object)
            validated_data.update({'profile': profile_object})
            validated_data.update({'company': profile_object.companyProfile})

            # let's get a valid slug
            while True:
                random_string = lambda n: ''.join(
                    [random.choice(string.ascii_lowercase + string.digits) for i in range(n)])
                random_string_slug = random_string(10)
                try:
                    # test if this slug exists
                    temp_object = Product.objects.get(slug=random_string_slug)
                    # print("slug exists", random_string_slug)
                except:
                    # print("slug does not exist, let's use it")
                    break
            error_messages = []
            validated_data.update({'slug': random_string_slug})
            validated_data.update({'url_safe': random_string_slug})
            if validated_data.get('slug') is None:
                validated_data['slug'] = random_string_slug
                validated_data['url_safe'] = random_string_slug
            product = Product()

            if template is None or template == 'xspace':
                # print("name in as", validated_data.get('name'))
                if validated_data.get('name') is None:
                    validated_data['name'] = ''
                    error_messages.append('Product Name Missing')
                product.name = validated_data.get('name')
                product.profile = validated_data.get('profile')
                product.company = validated_data.get('company')
                product.slug = validated_data.get('slug')
                product.url_safe = validated_data.get('url_safe')
                product.createdDate = timezone.now()
                product.lastUpdatedDate = timezone.now()
                product.category = validated_data.get('category')
                if validated_data.get('upccode') is None:
                    validated_data['upccode'] = ''
                    error_messages.append('UPC Code Missing')
                product.upccode = validated_data.get('upccode')
                if validated_data.get('UPCType') is None:
                    validated_data['UPCType'] = 'upc-a'
                product.UPCType = validated_data.get('UPCType')
                if validated_data.get('SKU') is None:
                    validated_data['SKU'] = ''
                    error_messages.append('SKU Missing')
                product.SKU = validated_data.get('SKU')
                if validated_data.get('description') == '':
                    error_messages.append('Description Missing')
                product.description = validated_data.get('description')
                if validated_data.get('manufacturer') == '':
                    validated_data['manufacturer'] = ''
                    error_messages.append('Manufacturer Missing')
                product.manufacturer = validated_data.get('manufacturer')
                if validated_data.get('price') == int(0):
                    error_messages.append('Price Missing')
                product.price = validated_data.get('price')
                if validated_data.get('length') == int(0):
                    error_messages.append('Product Length Missing')
                product.length = validated_data.get('length')
                if validated_data.get('width') == int(0):
                    error_messages.append('Product Width Missing')
                product.width = validated_data.get('width')
                if validated_data.get('height') == int(0):
                    error_messages.append('Product Height Missing')
                product.height = validated_data.get('height')
                if len(error_messages) > 0:
                    product.compliance = False
                    errorTextHolder = ''
                    for error in error_messages:
                        errorTextHolder += str(error + ', ')
                    product.compliance_message = str(errorTextHolder)
                else:
                    product.compliance = True
                    product.compliance_message = ''


            elif template == 'snap36':
                # print("made it all the way in here")
                if validated_data.get('name') is None:
                    validated_data['name'] = ''
                    error_messages.append('Product Name Missing')
                product.name = validated_data.get('name')
                product.profile = validated_data.get('profile')
                product.company = validated_data.get('company')
                product.slug = validated_data.get('slug')
                product.url_safe = validated_data.get('url_safe')
                product.createdDate = timezone.now()
                product.lastUpdatedDate = timezone.now()
                product.category = validated_data.get('category')
                if validated_data.get('upccode') is None:
                    validated_data['upccode'] = ''
                    error_messages.append('UPC Code Missing')
                product.upccode = validated_data.get('upccode')
                if validated_data.get('upctype') is None:
                    validated_data['upctype'] = 'upc-a'
                product.UPCType = validated_data.get('upctype')
                if validated_data.get('internalSKU') is None:
                    validated_data['internalSKU'] = ''
                    error_messages.append('Internal SKU Code Missing')
                product.internalID = validated_data.get('internalSKU')
                try:
                    validated_data.pop("cat", None)
                except:
                    print("Key 'cat' not found")
                if validated_data.get('description') is None:
                    validated_data['description'] = ''
                    error_messages.append('Description Missing')
                product.description = validated_data.get('description')
                if validated_data.get('standalone') == '':
                    validated_data['standalone'] = False
                    error_messages.append('Stand Alone Missing')
                if isinstance(validated_data.get('standalone'), bool):
                    product.standalone = validated_data.get('standalone')
                else:
                    product.standalone = False
                if validated_data.get('manufacturer') == '' or validated_data.get('manufacturer') is None:
                    validated_data['manufacturer'] = ''
                    error_messages.append('Manufacturer Missing')
                product.manufacturer = validated_data.get('manufacturer')
                if validated_data.get('price') == int(0) or validated_data.get('price') is None:
                    validated_data['price'] = int(0)
                    error_messages.append('Price Missing')
                try:
                    if isinstance(int(validated_data.get('price')), (int, float, complex)) and not isinstance(
                            validated_data.get('price'), bool):
                        product.price = float(validated_data.get('price'))
                    else:
                        product.price = int(0)
                except:
                    product.price = int(0)
                if validated_data.get('photographyNotes') == '' or validated_data.get('photographyNotes') is None:
                    validated_data['photographyNotes'] = ''
                    error_messages.append('Photography Notes Missing')
                product.photographyNotes = validated_data.get('photographyNotes')

                # length
                if validated_data.get('length') == int(0) or validated_data.get('length') is None or\
                        validated_data.get('length') == '':
                    validated_data['length'] = int(0)
                    error_messages.append('Product Length Missing')
                try:
                    if isinstance(int(validated_data.get('length')), (int, float, complex)) and not isinstance(
                            validated_data.get('length'), bool):
                        # print('length is valid with:', validated_data.get('length'))
                        product.length = float(validated_data.get('length'))
                    else:
                        # print('length is NOT valid with:', validated_data.get('length'))
                        product.length = int(0)
                except:
                    # print('length is NOT valid with:', validated_data.get('length'))
                    product.length = int(0)

                # width
                if validated_data.get('width') == int(0) or validated_data.get('width') is None or \
                        validated_data.get('width') == '':
                    validated_data['width'] = int(0)
                    error_messages.append('Product Width Missing')
                try:
                    if isinstance(int(validated_data.get('width')), (int, float, complex)) and not isinstance(
                            validated_data.get('width'), bool):
                        # print('width is valid with:', validated_data.get('width'))
                        product.width = float(validated_data.get('width'))
                    else:
                        # print('width is NOT valid with:', validated_data.get('width'))
                        product.width = int(0)
                except:
                    # print('width is NOT valid with:', validated_data.get('width'))
                    product.width = int(0)

                # height
                if validated_data.get('height') == int(0) or validated_data.get('height') is None or \
                        validated_data.get('height') == '':
                    validated_data['height'] = int(0)
                    error_messages.append('Product Height Missing')
                try:
                    if isinstance(int(validated_data.get('height')), (int, float, complex)) and not isinstance(
                            validated_data.get('height'), bool):
                        # print('height is valid with:', validated_data.get('height'))
                        product.height = float(validated_data.get('height'))
                    else:
                        # print('height is NOT valid with:', validated_data.get('height'))
                        product.height = int(0)
                except:
                    # print('height is NOT valid with:', validated_data.get('height'))
                    product.height = int(0)

                # weight
                if validated_data.get('weight') == int(0) or validated_data.get('weight') is None or \
                        validated_data.get('weight') == '':
                    validated_data['weight'] = int(0)
                    error_messages.append('Product Weight Missing')
                try:
                    if isinstance(int(validated_data.get('weight')), (int, float, complex)) and not isinstance(validated_data.get('weight'), bool):
                        product.weight = float(validated_data.get('weight'))
                    else:
                        # print('weight is NOT valid with:', validated_data.get('weight'))
                        product.weight = int(0)
                except:
                    # print('weight is NOT valid with:', validated_data.get('weight'))
                    product.weight = int(0)

                # print("made it to the variable ID codes")
                if validated_data.get('acDelcoID') is None or validated_data.get('acDelcoID') == '':
                    validated_data['acDelcoID'] = ''
                product.acDelcoID = validated_data.get('acDelcoID')
                if validated_data.get('advancedAutoID') is None or validated_data.get('advancedAutoID') == '':
                    validated_data['advancedAutoID'] = ''
                product.advancedAutoID = validated_data.get('advancedAutoID')
                if validated_data.get('advantageID') is None or validated_data.get('advantageID') == '':
                    validated_data['advantageID'] = ''
                product.advantageID = validated_data.get('advantageID')
                if validated_data.get('amazonID') is None or validated_data.get('amazonID') == '':
                    validated_data['amazonID'] = ''
                product.amazonID = validated_data.get('amazonID')
                if validated_data.get('graingerID') is None or validated_data.get('graingerID') == '':
                    validated_data['graingerID'] = ''
                product.graingerID = validated_data.get('graingerID')
                if validated_data.get('homeDepotID') is None or validated_data.get('homeDepotID') == '':
                    validated_data['homeDepotID'] = ''
                product.homeDepotID = validated_data.get('homeDepotID')
                if validated_data.get('johnstoneID') is None or validated_data.get('johnstoneID') == '':
                    validated_data['johnstoneID'] = ''
                product.johnstoneID = validated_data.get('johnstoneID')
                if validated_data.get('oReillyID') is None or validated_data.get('oReillyID') == '':
                    validated_data['oReillyID'] = ''
                product.oReillyID = validated_data.get('oReillyID')
                if validated_data.get('walmartID') is None or validated_data.get('walmartID') == '':
                    validated_data['walmartID'] = ''
                product.walmartID = validated_data.get('walmartID')
                if validated_data.get('vendorCode1') is None or validated_data.get('vendorCode1') == '':
                    validated_data['vendorCode1'] = ''
                product.vendorCode1 = validated_data.get('vendorCode1')
                if validated_data.get('vendorCode2') is None or validated_data.get('vendorCode2') == '':
                    validated_data['vendorCode2'] = ''
                product.vendorCode2 = validated_data.get('vendorCode2')
                if validated_data.get('vendorCode3') is None or validated_data.get('vendorCode3') == '':
                    validated_data['vendorCode3'] = ''
                product.vendorCode3 = validated_data.get('vendorCode3')

                if len(error_messages) > 0:
                    product.compliance = False
                    errorTextHolder = ''
                    for error in error_messages:
                        errorTextHolder += str(error + ', ')
                    product.compliance_message = str(errorTextHolder)
                else:
                    product.compliance = True
                    product.compliance_message = ''
            else:
                product = None
                product_status = status.HTTP_400_BAD_REQUEST
                return product, product_status
            # print("product.compliance_message before anyone else touches it", product.compliance_message)
            # print("about to save")
            product.save()
            product_status = status.HTTP_201_CREATED
            print("Created The Product Manually")

            try:
                # Add Products to the user's company
                company = profile_object.companyProfile
                company.products.add(product)
                # print("Added The Product to the company")
            except:
                print("Was not able to add the product to the company")

        except:
            if not is_ecommerce:
                product = None
                product_status = status.HTTP_400_BAD_REQUEST

            else:
                product = None
                product_status = status.HTTP_400_BAD_REQUEST
        return product, product_status


class UploaderSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField('get_UserInfo')
    product_list = serializers.SerializerMethodField('get_products')

    def get_products(self):
        try:
            user = self.context.get("user")
            profile = Profile.objects.filter(user=user).first()
            obj = Product.objects.filter(company=profile.companyProfile)
            products = ProductUpdateSerializer(obj, many=True, read_only=True)
            return products.data
        except Exception as e:
            return str(e)

    def get_UserInfo(self, obj):
        try:
            product = obj.first()
            profile = product.profile
            userDetails = app.accounts.serializers.UserDetailOrderSerializer(profile.user, many=False)

            return userDetails.data
        except User.DoesNotExist:
            return "No"

    class Meta:
        model = Product
        fields = ('user', 'product_list')
