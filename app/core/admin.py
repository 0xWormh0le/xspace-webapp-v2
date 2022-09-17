from django.contrib import admin
from app.core.models import Category, ShopifyAuthentication, API2Cart, UploadAsset


# 6 core slightly disorganized models

admin.site.register(Category)
admin.site.register(ShopifyAuthentication)
admin.site.register(API2Cart)
admin.site.register(UploadAsset)
