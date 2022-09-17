from django.db import models
from django.shortcuts import render
from django.utils import timezone
from PIL import Image
import requests
from io import BytesIO
import numpy as np
import cv2 as cv
import mimetypes
# from django_images.models import Image
from django.apps import apps
from random import randint
from app.accounts.get_user import get_user
# from app.orders.models import ContentStandard
import boto3
import uuid
import os
from .utility import get_file_type
from xapi.settings import TEST_LOCAL, LOCAL_STORAGE_LOCATION, USE_LOCAL_STORAGE, AWS_STORAGE_BUCKET_NAME, \
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY

from datetime import datetime

try:
    import simplejson as json
except ImportError:
    import json


# Create your models here.


def convertdatetime(o):
    """
    :param o: what you want to convert
    :return: str of that datetime
    """
    if isinstance(o, datetime):
        return o.__str__()


'''
---- Product DATA MODELS ---- (START)
'''


class Product(models.Model):
    """
    Model for a product owned by a profile and company in the datbase
    """
    # Model Reference Fields
    uniqueID = models.CharField(max_length=120, blank=True, unique=True, default=uuid.uuid4)
    profile = models.ForeignKey('app.Profile', null=True, unique=False, on_delete=models.CASCADE)
    company = models.ForeignKey('app.Company', null=True, unique=False, on_delete=models.CASCADE)
    name = models.CharField(max_length=300, db_index=True)
    slug = models.SlugField(max_length=150, db_index=True, null=True)
    url_safe = models.CharField(max_length=120, blank=True)
    # DateTime Fields
    createdDate = models.DateTimeField(auto_now_add=True, null=True)
    lastUpdatedDate = models.DateTimeField(auto_now=True, null=True)

    # Warehouse Related Fields
    status = models.CharField(max_length=50, blank=True)

    # Basic Product Fields
    category = models.ForeignKey('app.Category', related_name='products', on_delete=None)
    upccode = models.CharField(max_length=300, default='')
    UPCType = models.CharField(max_length=200, default='UPC-A')
    SKU = models.CharField(max_length=300, default='000000000')
    description = models.TextField(default='', blank=True, null=True)
    manufacturer = models.CharField(default='Undefined', max_length=300, blank=True)
    price = models.DecimalField(default='0.0', max_digits=12, decimal_places=2, blank=True)
    thumbnail = models.URLField(default="XSPACE-subtle-color.png", null=True)
    # attributes = models.ManyToManyField('ProductAttribute',blank=True)
    length = models.DecimalField(default='0.0', blank=True, max_digits=12, decimal_places=3)
    width = models.DecimalField(default='0.0', blank=True, max_digits=12, decimal_places=3)
    height = models.DecimalField(default='0.0', blank=True, max_digits=12, decimal_places=3)
    weight = models.DecimalField(default='0.0', blank=True, max_digits=12, decimal_places=3)

    # Retailer specific fields
    internalID = models.TextField(default='', blank=True, null=True)
    acDelcoID = models.TextField(default='', blank=True, null=True)
    advancedAutoID = models.TextField(default='', blank=True, null=True)
    advantageID = models.TextField(default='', blank=True, null=True)
    amazonID = models.TextField(default='', blank=True, null=True)
    graingerID = models.TextField(default='', blank=True, null=True)
    homeDepotID = models.TextField(default='', blank=True, null=True)
    johnstoneID = models.TextField(default='', blank=True, null=True)
    oReillyID = models.TextField(default='', blank=True, null=True)
    walmartID = models.TextField(default='', blank=True, null=True)

    # Vendor Code Fields
    vendorCode1 = models.TextField(default='', blank=True, null=True)
    vendorCode2 = models.TextField(default='', blank=True, null=True)
    vendorCode3 = models.TextField(default='', blank=True, null=True)

    # misc fields
    standalone = models.BooleanField(default=False, null=True, blank=True)
    photographyNotes = models.TextField(default='', blank=True, null=True)

    # e-Commerce Integration Reference Fields
    ecommerce_id = models.CharField(max_length=300, blank=True)

    # Content Reference Fields
    directoryURL = models.CharField(max_length=300, db_index=True,
                                    blank=True)  # References to the root base directory location of all content files

    # Asset folder structure Json URL location, pulled by the frontend to make the folder structure dynamically
    folder_structure = models.CharField(max_length=120, blank=True)

    # Compliance to content Standards
    compliance = models.BooleanField(default=False)
    compliance_message = models.TextField(max_length=250, default='', null=True, blank=True)

    class Meta:
        # ADD UPC to ordering Meta
        ordering = ('name', 'SKU')
        app_label = 'app'
        index_together = (('id', 'slug'),)
        permissions = (
            ("view_only", "Can view product link only"),
            ("read_access", "Can retrieve product info from XSPACE"),
            ("private", "Only the owner can get info from XSPACE"),
            ("public", "Can all product info from XSPACE"),
        )

    def __str__(self):
        return self.uniqueID

    def getURL(self):
        key = self.company.slug + '/products/' + self.slug + '/'
        if USE_LOCAL_STORAGE:
            return os.path.normcase(os.path.join(LOCAL_STORAGE_LOCATION, key))
        else:
            return key

    def getImage(self):
        return

    def getDesc(self):
        if self.description:
            return True
        else:
            return False

    def get3Dstatus(self):
        try:
            if self.has3Dfile:
                return True
            else:
                return False
        except:
            return str("Function is Deprecated")

    def get2Dstatus(self):
        try:
            if self.has2Dfile:
                return True
            else:
                return False
        except:
            return str("Function is Deprecated")

    def get2DassetCompliance(self, standard):
        """
        get the compliance for the 2D assets for a specific standard
        :param standard: the content standard you are comparing against
        :return: a list of violations
        """
        obj = self
        try:
            # Get 2d image
            count = ProductAsset.objects.filter(assetType=1, product=obj.id, deletedon='').count()
            if count != 0:
                # dbproduct2d = Product2DImage.objects.get(product_id=dbproduct)
                dbproduct2d = ProductAsset.objects.filter(assetType=1, product=obj.id, deletedon='')
                url = []
                for geturl in dbproduct2d:
                    url.append({'link': geturl.url, 'size': geturl.size, 'lastModified': geturl.lastmodified})
                    # print geturl.size
                    # ipdb.set_trace()

                violations = []
                for f in url:
                    response = requests.get(f['link'])

                    file_bytes = np.asarray(bytearray(BytesIO(response.content).read()), dtype=np.uint8)
                    img = cv.imdecode(file_bytes, cv.IMREAD_COLOR)
                    img_height = img.shape[0]
                    img_width = img.shape[1]
                    content_type = response.headers['content-type']
                    img_fmt = mimetypes.guess_extension(content_type)

                    print(img_width, img_height)
                    if int(standard.image_height) > int(img_height):
                        violations.append("not tall enough")
                    if int(standard.image_width) > int(img_width):
                        violations.append("not wide enough")
                count = len(url)
                print(count)
                if count < standard.image_number:
                    violations.append(str(count - standard.image_number) + " images missing from product")
                print(violations)

                return violations
        except Exception as e:
            print(e)

    def get_absolute_url(self):
        return None

    def photo_url(self):
        if self.image and hasattr(self.image, 'url'):
            return self.image.url

    def as_json(self):
        """
        generate a dictionary of the product information, JSON readable
        :return:
        """
        return dict(
            uniqueID=self.uniqueID,
            profile=str(self.profile.user.first_name)+" "+str(self.profile.user.last_name),
            company=self.company.companyName,
            name=self.name,
            slug=self.slug,
            url_safe=self.url_safe,
            createdDate=json.dumps(self.createdDate, default=convertdatetime).strip('\"'),
            lastUpdatedDate=json.dumps(self.lastUpdatedDate, default=convertdatetime).strip('\"'),
            status=self.status,
            category=self.category.name,
            upccode=self.upccode,
            UPCType=self.UPCType,
            SKU=self.SKU,
            description=self.description,
            manufacturer=self.manufacturer,
            price=self.price,
            length=self.length,
            width=self.width,
            height=self.height,
            weight=self.weight,
            ecommerce_id=self.ecommerce_id,
            directoryURL=self.directoryURL,
            folder_structure=self.folder_structure,
            thumbnail=self.thumbnail,
            compliance=self.compliance,
            compliance_message=self.compliance_message
        )


class LocalAssetInfoHolder:
    """
    helper class to store information
    """
    def __init__(self):
        url = None
        content = None


class ProductAsset(models.Model):
    """
    A generic Product asset with all of the fields needed for any type of product asset
    """
    uniqueID = models.CharField(max_length=120, blank=True, unique=True, default=uuid.uuid4)
    product = models.ForeignKey(Product, null=True, unique=False, on_delete=models.SET_NULL)
    company = models.ForeignKey('app.Company', null=True, unique=False, on_delete=models.SET_NULL)
    file_name = models.CharField(max_length=200, blank=True)
    url = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(max_length=3, blank=True, unique=False)
    size = models.CharField(max_length=20, blank=True)
    original = models.BooleanField(default=False)
    lastmodified = models.DateTimeField(blank=True)
    deletedon = models.CharField(max_length=200, default='', blank=True)
    thumbnail_url = models.CharField(max_length=200, default='', blank=True)
    thumbnail_id = models.IntegerField(null=True)
    is_thumbnail = models.BooleanField(default=False)
    is_mask = models.BooleanField(default=False)

    # verified removed background; only place as True if we removed the background
    verified_background_removed = models.BooleanField(default=False)
    # location of the mask that corresponds to this asset
    mask_url = models.CharField(max_length=200, blank=True)

    # 2D Image, 360, and Video Specific fields
    asset_height = models.IntegerField(null=True)
    asset_width = models.IntegerField(null=True)
    asset_channels = models.IntegerField(null=True)
    # Background identifiers: 1 = transparent; 2 = white; 3 = black; 4 = unknown; 5 = custom
    asset_background_type = models.IntegerField(null=True)  # new field

    # 360 specific fields
    xml = models.CharField(max_length=200, null=True)  # location of xml file
    baseImage = models.CharField(max_length=200, null=True)  # location of baseImage
    css = models.CharField(max_length=200, null=True)  # location of css files
    jquery = models.CharField(max_length=200, null=True)  # location of jquery file
    imagerotator = models.CharField(max_length=200, null=True)  # location of imagerotator file
    html = models.CharField(max_length=200, null=True)  # location of html file

    # new field to designate the type of asset following:
    #         1 = 2d image
    #         2 = 360 Model
    #         3 = Video
    #         4 = 3D Model
    #         5 = Misc
    assetType = models.IntegerField(blank=True)

    # compliance is primarily determined at the product asset level, since product assets can have different content
    # standards applied to them. If all product assets are compliant to all of the content standards applied to them,
    # then the product is judged compliant by if the product level content standards are met. EG a product has a content
    # standard applied to it that requires 4 images that (within the same content standard) are compliant.
    # If the user uploads 3 images that are compliant to the content standard then great, the individual assets are
    # compliant, but the product is not compliant since it is missing the correct number of images.

    compliance = models.BooleanField(default=False)
    compliance_message = models.TextField(max_length=250, default='', null=True, blank=True)

    class Meta:
        app_label = 'app'
        verbose_name = 'Product Asset'
        verbose_name_plural = 'Product Assets'

    def get_asset_type(self):
        """
        Return the asset type
        :return:
        """
        return self.assetType

    def as_json(self):
        """
        Return all the information of an asset as an object with specific logic applied
        :return:
        """
        output = {"uniqueID": self.uniqueID,
                  "product": self.product,
                  "filename": self.file_name,
                  "url": self.url,
                  "size": self.size,
                  "lastmodified": self.lastmodified,
                  "deletedon": self.deletedon, }
        # if the asset is an image, 360 or video add their common fields to the dict being returned
        if int(self.assetType) <= int(3):
            output['asset_height'] = self.asset_height
            output['asset_width'] = self.asset_width
            output['asset_channels'] = self.asset_channels
            output['asset_background_type'] = self.asset_background_type
        # if the asset is a 360 add in the fields specific to 360 models
        if int(self.assetType) == int(2):
            output['xml'] = self.xml
            output['baseImage'] = self.baseImage
            output['css'] = self.css
            output['jquery'] = self.jquery
            output['imagerotator'] = self.imagerotator

        return output

    def generate_asset_attributes(self):
        """
        generate the asset attributes and save them to the asset
        :return: whether the operation was successful or not
        """
        # if the asset type was for some reason never established, let's try to do that now
        print("generate_asset_attributes")
        if self.assetType is None:
            print("assset type from generate:", self.assetType)
            file_type = get_file_type(str(self.url))
            if file_type == 0:
                # check to see if it is a 360
                file_type = get_file_type(str(self.baseImage))
                if file_type == 0:
                    return None
            elif file_type == 1:
                self.assetType = 1
            elif file_type == 2:
                self.assetType = 3
            elif file_type == 3:
                self.assetType = 4
            else:
                # we don't know what the file is
                return None
        print("generate_asset_attributes asset type:", self.assetType)
        print("generate_asset_attributes getting info from:", self.url)
        # 2D image, 360 Model, or  specific attribute generator
        # step one get the right asset, if its an image or video let's grab it
        if self.assetType == int(1) or self.assetType == int(3):
            if USE_LOCAL_STORAGE:
                response = LocalAssetInfoHolder()
                with open(str(self.url), 'rb') as f:
                    response.content = f.read()
            else:
                response = requests.get(self.url)
        # if it is a 360 let's grab the base image
        elif self.assetType == int(2):
            if USE_LOCAL_STORAGE:
                response = LocalAssetInfoHolder()
                with open(str(self.url), 'rb') as f:
                    response.content = f.read()
            else:
                response = requests.get(self.url)

        # otherwise it is a misc or 3D model
        else:
            return None
        print('getting bytes')
        if USE_LOCAL_STORAGE:
            file_bytes = np.asarray(bytearray(BytesIO(response.content).read()), dtype=np.uint8)
        else:
            byte_stream = BytesIO(response.content)
            file_bytes = np.fromstring(byte_stream.read(), dtype=np.uint8)
        print('decoding image from byte stream')
        # step 2 let's decode the asset; if it is a 2D image or 360, let's go ahead and open it up
        if self.assetType <= int(2):
            img = cv.imdecode(file_bytes, cv.IMREAD_UNCHANGED)
            print('img decoded with height, width as', img.shape)
        # if it is a video, let's grab the first frame as a reference
        elif self.assetType == int(3):
            img = cv.VideoCapture(file_bytes)
            _, img = img.read()

        # step 3 extract the attributes; if it is a 2D image, 360 or Video
        if self.assetType <= int(3):
            self.asset_height, self.asset_width = img.shape[:2]
            try:
                self.asset_channels = img.shape[2]
            except IndexError:
                self.asset_channels = 1

            # let's determine the background
            # Background identifiers: 1 = transparent; 2 = white; 3 = black; 4 = unknown; 5 = custom
            # get background color by sampling the corner of the image
            imgBG = img[0:10, 0:10]
            imgBG = cv.mean(imgBG)
            if int(self.asset_channels) >= int(3):
                # dealing with an 3+ channel image
                if int(self.asset_channels) == int(4) and int(imgBG[-1]) == int(0):
                    self.asset_background_type = int(1)
                elif int(sum(imgBG[:]) / len(imgBG)) == int(255):
                    self.asset_background_type = int(2)
                elif int(sum(imgBG[:]) / len(imgBG)) == int(0):
                    self.asset_background_type = int(3)
                else:
                    # we don't know the background type
                    self.asset_background_type = int(4)
            else:
                # dealing with a single channel image
                if int(sum(imgBG[:]) / len(imgBG)) == int(255):
                    self.asset_background_type = int(2)
                elif int(sum(imgBG[:]) / len(imgBG)) == int(0):
                    self.asset_background_type = int(3)
                else:
                    # we don't know the background type
                    self.asset_background_type = int(4)

            # not sure to use a dictionary to update or call each individually tbh so I put in both and hopefully a
            # person down the line will have the answer
            # now let's go ahead and update the database
            ProductAsset.objects.filter(uniqueID=self.uniqueID).update(size=self.size,
                                                                       lastmodified=self.lastmodified,
                                                                       asset_height=self.asset_height,
                                                                       asset_width=self.asset_width,
                                                                       asset_channels=self.asset_channels,
                                                                       asset_background_type=self.asset_background_type)
            return True
            # updateDict = {"size": self.size,
            #               "lastmodified": self.lastmodified,
            #               "asset_height": self.asset_height,
            #               "asset_width": self.asset_width,
            #               "asset_channels": self.asset_channels,
            #               "asset_background_type": self.asset_background_type
            #               }
            # obj = self
            # obj.__dict__.update(updateDict)
        else:
            return False


class AssetContentStandards(models.Model):
    """
    All of the Content Standards applied to a generic asset
    """
    uniqueID = models.CharField(max_length=120, blank=True, unique=True, default=uuid.uuid4)
    contentStandard = models.ForeignKey('app.ContentStandard', null=True, unique=False, on_delete=models.SET_NULL)
    product = models.ForeignKey(Product, null=True, unique=False, on_delete=models.SET_NULL)
    productAsset = models.ForeignKey(ProductAsset, null=True, unique=False, on_delete=models.SET_NULL)
    lastmodified = models.DateTimeField(blank=True)
    deletedon = models.CharField(max_length=200, default='', blank=True)

    class Meta:
        app_label = 'app'
        verbose_name = 'Asset Content Standard'
        verbose_name_plural = 'Asset Content Standards'

    def get_asset_standards(self):
        """
        Return the list of content standards
        :return:
        """
        return self.contentStandard


class ProductMessage(models.Model):
    sender = models.ForeignKey("app.User", null=True, blank=True, related_name='sender', on_delete=models.SET_NULL)
    recipient = models.ForeignKey("app.User", null=True, blank=True, related_name='recipient', on_delete=models.SET_NULL)
    productMessageThread = models.ForeignKey('ProductMessageThread', null=True, blank=True, on_delete=models.SET_NULL)
    messageID = models.CharField(max_length=120, blank=True, unique=True, default=uuid.uuid4)
    timestamp = models.DateTimeField(default=timezone.now, null=True, blank=True, db_index=True)
    message = models.TextField(null=True, blank=True, )

    # this simplifies sorting so the "Max('conversation__message')" line
    # sorts on date rather than primary key
    ordering = ["-timestamp"]

    def __unicode__(self):
        return '[{timestamp}] {messageID}: {message}'.format(**self.as_dict())

    @property
    def formatted_timestamp(self):
        return self.timestamp.strftime('%b %-d %-I:%M %p')

    def as_dict(self):
        return {'messageID': self.messageID, 'message': self.message, 'timestamp': self.formatted_timestamp}

    class Meta:
        app_label = 'app'


class MessageParticipant(models.Model):
    participant = models.ForeignKey('app.User', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100, blank=True, default=uuid.uuid4)
    last_name = models.CharField(max_length=100, blank=True, default=uuid.uuid4)
    messageThread = models.ForeignKey('ProductMessageThread', null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        app_label = 'app'


class ProductMessageThread(models.Model):
    product = models.ForeignKey(Product, null=True, blank=True, unique=False, on_delete=models.SET_NULL)
    productAsset = models.ForeignKey(ProductAsset, null=True, blank=True, unique=False, on_delete=models.SET_NULL)
    messageThreadID = models.CharField(max_length=100, blank=True, unique=True, default=uuid.uuid4)
    messageThreadName = models.SlugField(null=True, blank=True)
    creationDateTime = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    lastUpdateDateTime = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    messages = models.ManyToManyField(ProductMessage, blank=True)
    participants = models.ManyToManyField('MessageParticipant', blank=True)
    ticket = models.CharField(max_length=20, blank=True)

    def __unicode__(self):
        return self.messageThreadName

    class Meta:
        app_label = 'app'
        db_table = 'app_productmessagethread'


class ProductAttribute(models.Model):
    """
    The ProductAttribute model represents information unique to a specific product. This is a generic design that can be
     used to extend the information contained in the Product model with specific extra details.
    """
    product = models.ForeignKey('app.Product', null=True, related_name='attributes', on_delete=models.SET_NULL)
    attributeName = models.CharField(max_length=500)
    value = models.CharField(max_length=500)

    def __unicode__(self):
        return u'%s: %s - %s' % (self.product, self.attributeName, self.value)

    class Meta:
        app_label = 'app'


'''
---- Product DATA MODELS ---- (END)
'''