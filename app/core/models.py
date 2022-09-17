from django.db import models
from django.utils import timezone
import pytz
from datetime import datetime
from django.urls import reverse
import uuid
from app.accounts.models import Company
from oauth2_provider.models import AbstractApplication

try:
    import simplejson as json
except ImportError:
    import json


def convertdatetime(o):
    if isinstance(o, datetime):
        return o.__str__()


class Upload2Ditem(models.Model):
    user_name = models.CharField(blank=True, max_length=50)
    upload_file = models.FileField(blank=True)
    location = models.CharField(max_length=200, blank=True, default="This field is Auto generated")
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        name_file = self.upload_file.name
        name = name_file.split('/')
        return str(name[1])

    class Meta:
        app_label = 'app'


class Snippet(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100, blank=True, default='')
    code = models.TextField()
    linenos = models.BooleanField(default=False)

    # owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='snippets' ,default=1, on_delete=None)

    class Meta:
        ordering = ('created',)
        app_label = 'app'


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=150, unique=True)
    publisher = models.CharField(max_length=300, null=True)
    description = models.TextField(null=True)
    pub_date = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ('name',)
        app_label = 'app'
        verbose_name = 'category'
        verbose_name_plural = 'categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def as_json(self):
        return dict(
            name=self.name,
            slug=self.slug,
            publisher=self.publisher,
            description=self.description,
            pub_date=json.dumps(self.pub_date, default=convertdatetime).strip('\"'),
        )

    def get_absolute_url(self):
        return reverse('product_list_by_category', args=[self.slug, ])


class ShopifyAuthentication(models.Model):
    code = models.CharField(max_length=100, blank=True, unique=True)
    hmac = models.CharField(max_length=100, blank=True, null=True)

    # user = models.OneToOneField(User, null=True, related_name='shopify', on_delete=None)

    class Meta:
        app_label = 'app'


class API2Cart(models.Model):
    # user = models.OneToOneField(User, null=True, related_name='api2cart', on_delete=None)
    shopify_api_key = models.CharField(max_length=300, blank=True)
    shopify_password = models.CharField(max_length=300, blank=True)
    shopify_store_url = models.CharField(max_length=300, blank=True)
    shopify_store_id = models.CharField(max_length=300, blank=True)
    magento_store_id = models.CharField(max_length=300, blank=True)
    magento_store_url = models.CharField(max_length=300, blank=True)
    woocommerce_store_id = models.CharField(max_length=300, blank=True)
    woocommerce_store_url = models.CharField(max_length=300, blank=True)

    class Meta:
        app_label = 'app'


'''
---- Custom Applications DATA MODELS ---- (START)
'''


class Application(AbstractApplication):
    uniqueID = models.CharField(max_length=100, blank=True, unique=True, default=uuid.uuid4)
    name = models.CharField(blank=False, max_length=200)
    description = models.TextField(null=True, blank=True, )
    app_url = models.CharField(blank=True, max_length=200)
    app_icon = models.CharField(blank=True, max_length=200)
    company = models.ForeignKey(Company, blank=True, null=True, unique=False, on_delete='PROTECT')

    # DateTime Fields
    created = models.DateField(blank=True, auto_now_add=True)
    updated = models.DateField(blank=True, auto_now_add=True)

    # App Access Token/Credentials
    # token = models.ManyToManyField('CustomApplicationToken')

    # Big Commerce Based Application
    bigcommerce_api_key = models.CharField(max_length=300, blank=True)
    bigcommerce_password = models.CharField(max_length=300, blank=True)
    bigcommerce_store_url = models.CharField(max_length=300, blank=True)
    bigcommerce_store_id = models.CharField(max_length=300, blank=True)

    # Shopify Based Application
    shopify_api_key = models.CharField(max_length=300, blank=True)
    shopify_password = models.CharField(max_length=300, blank=True)
    shopify_store_url = models.CharField(max_length=300, blank=True)
    shopify_store_id = models.CharField(max_length=300, blank=True)

    # Magento Application
    magento_store_id = models.CharField(max_length=300, blank=True)
    magento_store_url = models.CharField(max_length=300, blank=True)

    # WooCommerce Apps
    woocommerce_store_id = models.CharField(max_length=300, blank=True)
    woocommerce_store_url = models.CharField(max_length=300, blank=True)

    class Meta:
        app_label = 'app'
        managed = True
        verbose_name = "Application"
        verbose_name_plural = "Applications"
        db_table = "app_application"
        app_label = 'app'


'''
---- Custom Applications End ---- (START)
'''


class UploadAsset(models.Model):
    """
    Boto upload model
    """
    user_name = models.CharField(blank=True, max_length=50)
    upload_file = models.FileField(blank=True)
    location = models.CharField(max_length=200, blank=True, default="This field is Auto generated")
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        name_file = self.upload_file.name
        name = name_file.split('/')
        return str(name[1])

    class Meta:
        app_label = 'app'
