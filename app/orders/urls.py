"""Order API URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url, include, handler404
from django.conf.urls.static import static
from rest_framework import routers
import app.orders.views as views
from xapi.settings import LOCAL_STORAGE_LOCATION, LOCAL_STORAGE_URL, USE_LOCAL_STORAGE

urlpatterns = [
    url(r"^orders/$", views.OrdersAPI.as_view(), name="orders_api"),
    url(r"^editing-order/$", views.EditingOrdersAPI.as_view(), name="editing_orders_api"),
    url(r"^full-order/$", views.FullOrdersAPI.as_view(), name="full_orders_api"),
    url(r"^orders/(?P<uidb64>[0-9A-Za-z_\-]+)/$", views.OrdersByUUIDAPI.as_view(), name="orders_api"),
    url(r"^orders/download/(?P<orderID>[0-9A-Za-z_\-]+)/$", views.GetAllOrderDownloads.as_view(),
        name="orders_downloads_api"),
    url(r"^orders_all/$", views.AllOrdersAPI.as_view(), name="orders_all_api"),
    url(r"^orders_by_username/(?P<username>[0-9A-Za-z_\-]+)/$", views.OrdersByUsernameAPI.as_view(),
        name="orders_username_api"),
    url(r"^orders_by_company/(?P<uidb64>[0-9A-Za-z_\-]+)/$", views.OrdersByCompanyAPI.as_view(),
        name="orders_company_api"),
    url(r'^content_standard/$', views.ContentStandardAPI.as_view(), name='api_contentstandard'),
    url(r"^upload_by_username/(?P<username>[0-9A-Za-z_\-]+)/$", views.UploadByUsernameAPI.as_view(),
        name="upload_username_api"),
    url(r"^order-track/$", views.OrderTrackingViewSet.as_view(), name="OrderTracking"),
    url(r"^order-qrcode/$", views.OrderQRCodeViewSet.as_view(), name="OrderQRTracking"),
    url(r"^order-excel-qrcode/$", views.OrderExcelToQRCodeViewSet.as_view(), name="OrderExcelToQRCodeViewSet"),
    url(r"^order-update/$", views.OrdersRESTAPI.as_view(), name="orders_api_view"),
    url(r"^audit/$", views.AuditAPI.as_view(), name="audit"),
    url(r"^processEditingOrder/$", views.ProcessEditingOrderAPI.as_view(), name="process_editing_order"),
]

if USE_LOCAL_STORAGE:
    # add statics
    urlpatterns += static(LOCAL_STORAGE_URL, document_root=LOCAL_STORAGE_LOCATION)
