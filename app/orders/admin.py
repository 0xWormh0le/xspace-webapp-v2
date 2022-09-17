from django.contrib import admin
from app.orders.models import Order, ProductOrder, OrderTracking, FullOrder
# Register your models here.

admin.site.register(Order)
admin.site.register(ProductOrder)
admin.site.register(OrderTracking)
admin.site.register(FullOrder)
