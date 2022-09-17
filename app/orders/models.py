"""
Order Models
"""
from django.db import models
from django.shortcuts import render
from random import randint
import uuid
import os
from datetime import datetime
from app.products.models import Product, ProductAsset
from app.accounts.models import Company, Profile

'''
---- Ordering DATA MODELS ---- (START)
'''


class Order(models.Model):
    """
    Model for tracking orders
    """
    # Model Reference Fields
    profile = models.ForeignKey(Profile, null=True, unique=False, on_delete="PROTECT")
    company = models.ForeignKey(Company, null=True, unique=False, on_delete="PROTECT")
    orderID = models.CharField(max_length=120, blank=True, unique=True, default=uuid.uuid4)

    # DateTime Fields
    order_date = models.DateTimeField(default=datetime.now)
    facility_arrival_date = models.DateTimeField(blank=True, null=True)
    estimated_completion_date = models.DateTimeField(blank=True, null=True)

    # Warehouse Fields
    content_standard = models.OneToOneField("app.ContentStandard", null=True, unique=False, on_delete="PROTECT")
    order_qr_code_img = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=50, blank=True)
    recieving_manager = models.CharField(max_length=200, blank=True)
    inventory_operator = models.CharField(max_length=200, blank=True)

    # Order Fields
    paid = models.BooleanField(default=False, editable=False)
    delivered = models.BooleanField(default=False)
    balance = models.DecimalField(default=0.00, decimal_places=2, max_digits=12)
    terms_accepted = models.BooleanField(default=False)

    numberOfProducts = models.IntegerField(default=0)
    products_order = models.ManyToManyField('app.Product', related_name='product')

    incomingTrackingNumbers = models.ManyToManyField('app.OrderTracking', related_name='incoming_tracking_number')
    outgoingTrackingNumbers = models.ManyToManyField('app.OrderTracking', related_name='outgoing_tracking_number')

    @property
    def slug(self):
        return self.id

    def get_full_name(self):
        return u"%s %s" % (self.first_name, self.last_name)

    # @models.permalink
    # def get_absolute_url(self):
    #     return reverse('order_detail', args=[self.id])

    def __unicode__(self):
        return u"F%0.3d" % (self.id,)

    def as_json(self):
        return

    class Meta:
        verbose_name, verbose_name_plural = "order", "orders"
        app_label = 'app'


class OrderTracking(models.Model):
    order = models.ForeignKey(Order, null=True, unique=False, on_delete="PROTECT")
    tracking_number = models.TextField(blank=True)
    tracking_type = models.IntegerField(blank=True, null=True)
    status = models.BooleanField(default=True)
    status = models.CharField(max_length=120, blank=True)  # New Field

    class Meta:
        # managed = False
        # db_table = 'app_order_tracking'
        app_label = 'app'


'''
---- Content Standard DATA MODELS ---- (START)
'''


# TODO: [BACKEND][Jacob] add in the ability to add own content standards
class ContentStandard(models.Model):
    """
    content standard model
    """
    uniqueID = models.CharField(max_length=120, blank=True, unique=True, default=uuid.uuid4)
    profile = models.ForeignKey(Profile, null=True, blank=True, related_name='profile', on_delete='PROTECT')
    company_id = models.ForeignKey(Company, null=True, blank=True, on_delete='PROTECT')
    name = models.CharField(blank=False, max_length=200)
    description = models.TextField(null=True, blank=True, )
    force_asset_square = models.BooleanField(default=False)
    strictnessLevel = models.CharField(max_length=20, blank=True, unique=False, default='strict')

    # 2D Photo Settings
    image_number = models.IntegerField(default=5)
    image_file_type = models.CharField(blank=False, max_length=200)
    image_background_type = models.CharField(blank=False, max_length=200)
    image_color_profile = models.CharField(blank=False, max_length=200)
    image_compression_type = models.CharField(blank=False, max_length=200)
    image_ideal_file_size = models.CharField(blank=False, max_length=200)
    image_width = models.CharField(blank=False, max_length=200)
    image_height = models.CharField(blank=False, max_length=200)

    # 2D Photo Formatting Fields
    image_margin_type = models.CharField(blank=False, max_length=200)
    image_margin_top = models.IntegerField(default=0)
    image_margin_left = models.IntegerField(default=0)
    image_margin_bottom = models.IntegerField(default=0)
    image_margin_right = models.IntegerField(default=0)

    # 360 View Settings
    threeSixtyImage_number = models.IntegerField(default=0)
    threeSixtyImage_file_type = models.CharField(blank=False, max_length=200)
    threeSixtyImage_background_type = models.CharField(blank=False, max_length=200)
    threeSixtyImage_color_profile = models.CharField(blank=False, max_length=200)
    threeSixtyImage_compression_type = models.CharField(blank=False, max_length=200)

    # 360 View Formatting
    threeSixtyImage_margin_type = models.CharField(blank=False, max_length=200)
    threeSixtyImage_margin_top = models.IntegerField(default=0)
    threeSixtyImage_margin_left = models.IntegerField(default=0)
    threeSixtyImage_margin_bottom = models.IntegerField(default=0)
    threeSixtyImage_margin_right = models.IntegerField(default=0)

    # 3D Modeling Settings
    threeD_number = models.IntegerField(default=0)
    threeD_file_type = models.CharField(blank=False, max_length=200)
    threeD_compression_type = models.CharField(blank=False, max_length=200)

    # Video Settings
    video_number = models.IntegerField(default=0)
    video_file_type = models.CharField(blank=False, max_length=200)

    # File Naming Convention fields
    # May hold a custom string value $CUSTOMSTRING or $PRODUCT_NAME, $PRODUCT_SKU, $PRODUCT_UPC, $XSPACE_ID
    filename_prefix = models.CharField(blank=True, max_length=200)

    # Can Consist of 4 Different String Types: $PRODUCT_NAME, $PRODUCT_SKU, $PRODUCT_UPC, $XSPACE_ID
    filename_base = models.CharField(blank=False, max_length=200)

    # Can consist of two delimiter characters: $HYPHEN or $UNDERSCORE
    filename_delimiter = models.CharField(blank=False, default='_', max_length=1)

    # May hold a custom string value $CUSTOMSTRING  or $PRODUCT_NAME, $PRODUCT_SKU, $PRODUCT_UPC, $XSPACE_ID
    filename_suffix = models.CharField(blank=True, max_length=200)

    # Consists of a data model fields that holds a string combination
    # Filename = '$filename_prefix' / '$filename_base' / 'filename_suffix' / 'filename_extension'
    filename_convention = models.CharField(blank=True, max_length=200)

    verified_background_removed = models.BooleanField(default=True)

    class Meta:
        # managed = False
        # db_table = 'app_order_content_standard'
        app_label = 'app'

    def __str__(self):
        return str(self.profile) + " Standard"


'''
---- Content Standard DATA MODELS ---- (END)
'''


class FullOrder(models.Model):
    """
    Model for tracking orders
    """
    # Model Reference Fields

    class Meta:
        managed = True
        app_label = 'app'

    order_ID = models.TextField(max_length=50, blank=True, null=True, default='')
    profile = models.ForeignKey('app.Profile', on_delete="PROTECT")
    product = models.ForeignKey('app.Product', on_delete="PROTECT")
    productAsset = models.ForeignKey('app.ProductAsset', on_delete="PROTECT", null=True, blank=True, default='')
    contentStandard = models.ForeignKey('app.ContentStandard', null=True, on_delete="PROTECT")

    # 0=Pending Payment, 1=Paid, 2=In Progress, 3=Pending Approval, 4=Complete, -1=cancelled
    status = models.IntegerField(default=0, blank=True, null=True)
    paid = models.BooleanField(default=False, blank=True, null=True)
    price = models.CharField(max_length=50, default=0, blank=True, null=True)
    chargebeeURL = models.CharField(max_length=200, blank=True, null=True)

    # DateTime Fields
    createdDate = models.DateTimeField(auto_now_add=True, null=True)
    lastModifiedDate = models.DateTimeField(auto_now_add=True, null=True)

    # Type of Service
    isCapture = models.BooleanField(default=False)
    isEditing = models.BooleanField(default=False)

    # Order still Active?
    isActive = models.BooleanField(default=True)

    # Capture Services
    # Photo Capture Services
    singlePhoto = models.BooleanField(default=False)
    fourPack = models.BooleanField(default=False)
    fivePack = models.BooleanField(default=False)

    # 360 View Capture Services
    standard360 = models.BooleanField(default=False)
    integrated360 = models.BooleanField(default=False)

    # 3D Model Capture Services
    standard3DModel = models.BooleanField(default=False)
    advanced3DModel = models.BooleanField(default=False)
    cinematic3DModel = models.BooleanField(default=False)

    # Video Capture Services
    hdProductVideo = models.BooleanField(default=False)
    fourKProduct = models.BooleanField(default=False)
    videoWalkthrough = models.BooleanField(default=False)

    # Content Generation Notes
    notes2d = models.TextField(max_length=1024, blank=True, default='')
    notes360view = models.TextField(max_length=1024, blank=True, default='')
    notes3dmodel = models.TextField(max_length=1024, blank=True, default='')
    notesvideo = models.TextField(max_length=1024, blank=True, default='')

    # Image Editing Services
    backgroundRemoval = models.BooleanField(default=False)
    autoCropAndCenter = models.BooleanField(default=False)
    blemishReduction = models.BooleanField(default=False)
    barcodeDetection = models.BooleanField(default=False)
    applyContentStandard = models.BooleanField(default=False)
    colorCorrection = models.BooleanField(default=False)

    def as_json(self):
        return dict(
            order=self.order,
            product=self.product,
            profile=self.profile,
            productAsset=self.productAsset,
            contentStandard=self.contentStandard,
            status=self.status,
            paid=self.paid,
            chargebeeURL=self.chargebeeURL,
            createdDate=self.createdDate,
            lastModifiedDate=self.lastModifiedDate,
            singlePhoto=self.singlePhoto,
            fourPack=self.fourPack,
            fivePack=self.fivePack,
            standard360=self.standard360,
            integrated360=self.integrated360,
            standard3DModel=self.standard3DModel,
            advanced3DModel=self.advanced3DModel,
            cinematic3DModel=self.cinematic3DModel,
            hdProductVideo=self.hdProductVideo,
            fourKProduct=self.fourKProduct,
            videoWalkthrough=self.videoWalkthrough,
            notes2d=self.notes2d,
            notes360view=self.notes360view,
            notes3dmodel=self.notes3dmodel,
            notesvideo=self.notesvideo,
            backgroundRemoval=self.backgroundRemoval,
            autoCropAndCenter=self.autoCropAndCenter,
            blemishReduction=self.blemishReduction,
            barcodeDetection=self.barcodeDetection,
            applyContentStandard=self.applyContentStandard,
            colorCorrection=self.colorCorrection
        )

    def get_chargebee_url(self):
        return self.chargebeeURL


class ProductOrder(models.Model):
    # Model Reference Fields
    product = models.ForeignKey(Product, on_delete="PROTECT")
    order = models.ForeignKey(Order, on_delete="PROTECT")
    uniqueID = models.CharField(max_length=120, blank=True, unique=True, default=uuid.uuid4)
    status = models.CharField(max_length=120, blank=True)  # New Field

    # DateTime Fields
    createdDate = models.DateTimeField(auto_now_add=True, null=True)  # New Field
    lastModifiedDate = models.DateTimeField(auto_now_add=True, null=True)  # New Field

    # Warehouse Fields
    order_product_qr_code_img = models.CharField(max_length=200, blank=True)  # Holds an image path (s3)
    isCompleted = models.BooleanField(default=False)  # New Field
    isArrived = models.BooleanField(default=False)  # New Field
    isDamagedAtArrival = models.BooleanField(default=False)  # New Field

    # Photo Services
    singlePhotoServicesRequired = models.BooleanField(default=False)  # Formerly: 'is2drequired'
    fourPackServicesRequired = models.BooleanField(default=False)  # New Field
    fivePackPackServicesRequired = models.BooleanField(default=False)  # New Field

    # 360 View Services
    standard360ServicesRequired = models.BooleanField(default=False)  # Formerly: 'is360viewrequired'
    integrated360ServicesRequired = models.BooleanField(default=False)  # New Field

    # 3D Model Services
    standard3DModelServicesRequired = models.BooleanField(default=False)  # Formerly: 'is3dmodelrequired'
    advanced3DModelServicesRequired = models.BooleanField(default=False)  # New Field
    cinematic3DModelServicesRequired = models.BooleanField(default=False)  # New Field

    # Video Services
    hdProductVideoServicesRequired = models.BooleanField(default=False)  # Formerly: 'is360viewrequired'
    fourKProductServicesRequired = models.BooleanField(default=False)  # New Field
    videoWalkthroughServicesRequired = models.BooleanField(default=False)  # New Field

    # Content Generation Notes
    notes2d = models.TextField(blank=True)
    notes360view = models.TextField(blank=True)
    notes3dmodel = models.TextField(blank=True)
    notesvideo = models.TextField(blank=True)

    # TODO: [BACKEND][Dom] Define Unicode function return fields
    def __unicode__(self):
        return 'Product : ' + self.product.name + ' Product Order Id : ' + str(self.uniqueID)

    def as_json(self):
        return dict(
            product=self.product.id,
            order=self.order.id,
            uniqueID=self.uniqueID,
            status=self.status,
            createdDate=self.createdDate,
            lastModifiedDate=self.lastModifiedDate,
            order_product_qr_code_img=self.order_product_qr_code_img,
            isCompleted=self.isCompleted,
            isArrived=self.isArrived,
            isDamagedAtArrival=self.isDamagedAtArrival,
            singlePhotoServicesRequired=self.singlePhotoServicesRequired,
            fourPackServicesRequired=self.fourPackServicesRequired,
            fivePackPackServicesRequired=self.fivePackPackServicesRequired,
            standard360ServicesRequired=self.standard360ServicesRequired,
            integrated360ServicesRequired=self.integrated360ServicesRequired,
            standard3DModelServicesRequired=self.standard3DModelServicesRequired,
            advanced3DModelServicesRequired=self.advanced3DModelServicesRequired,
            cinematic3DModelServicesRequired=self.cinematic3DModelServicesRequired,
            hdProductVideoServicesRequired=self.hdProductVideoServicesRequired,
            fourKProductServicesRequired=self.fourKProductServicesRequired,
            videoWalkthroughServicesRequired=self.videoWalkthroughServicesRequired,
            notes2d=self.notes2d,
            notes360view=self.notes360view,
            notes3dmodel=self.notes3dmodel,
            notesvideo=self.notesvideo,
        )

    class Meta:
        managed = True
        app_label = 'app'
