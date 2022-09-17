from django.contrib import admin
from app.products.models import Product, ProductAttribute,\
    ProductMessage, ProductMessageThread, ProductAsset,  AssetContentStandards

# Register your models here.
# 9 Key Product Models

admin.site.register(Product)
admin.site.register(ProductAsset)
admin.site.register(ProductAttribute)
admin.site.register(ProductMessage)
admin.site.register(ProductMessageThread)
admin.site.register(AssetContentStandards)







