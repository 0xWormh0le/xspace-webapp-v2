"""Product API URL Configuration

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
from xapi.settings import LOCAL_STORAGE_LOCATION, LOCAL_STORAGE_URL, USE_LOCAL_STORAGE, TEST_LOCAL,\
    AWS_STORAGE_BUCKET_NAME, STATICFILES_STORAGE
from rest_framework import routers
import app.products.views as views

urlpatterns = [
    url(r"^xedit-asset/$", views.XEditAPI.as_view(), name="xedit_api_view"),
    url(r"^product_search/$", views.ProductsSearchAPI.as_view(), name="product_search_api"),
    url(r"^xspace-products/$", views.ProductsAPI.as_view(), name="products_api"),
    url(r"^xspace-products2/$", views.ProductListViewSet.as_view({'post': 'list'}), name="products_api"),
    url(r"^multifill2D/(?P<username>[0-9A-Za-z_\-]+)/$", views.multifill_db_2dscript.as_view(), name="multifill"),
    url(r"^get_fill_db/(?P<slug>[-\w]+)/$", views.fill_db_script.as_view(), name="api_fill_db"),
    url(r"^get_2dfill_db/(?P<slug>[-\w]+)/$", views.fill_db_2dscript.as_view(), name="api_2dfill_db"),
    url(r"^create_s3_folder/$", views.s3_create_folder.as_view(), name="api_create_s3_folder"),
    url(r"^delete_s3_file/$", views.s3_move_files.as_view(), name="api_delete_s3_file"),
    url(r"^upload/$", views.ProductUploadView.as_view(), name="api_rest_view"),
    url(r"^editing-upload/$", views.EditingUploadView.as_view(), name="api_rest_view"),
    url(r"^get_product_thumbnail/$", views.s3_get_files.as_view(), name="api_get_product"),
    url(r"^get_product_360/$", views.s3_get_360.as_view(), name="api_360_get"),
    url(r"^get_product_2D/$", views.s3_get_2d.as_view(), name="api_2D_get"),
    url(r"^products_list/(?P<pagesize>[0-9]+)/(?P<pageno>[0-9]+)/$", views.ProductDetail.as_view(), name="api_product"),
    url(r"^products_update/(?P<pk>[0-9]+)/$", views.ProductUpdateDetail.as_view(), name="api_product_edit"),
    url(r'^product_message_thread/$', views.ProductMessageThreadListAPI.as_view(), name='product_message_threads'),
    url(r"^product_message_thread/(?P<product>[-\w]+)/(?P<slug>[-\w]+)/(?P<itype>[-\w]+)/(?P<filename>[-\w\s.]+)/$",
        views.ProductMessageThreadAPI.as_view()),
    url(r"^product_message_thread/(?P<product>[-\w]+)/(?P<slug>[-\w]+)/(?P<itype>[-\w]+)/(?P<filename>[-\w\s.]+)/messages/$",
        views.ProductMessageAPI.as_view()),
    url(r'^product_message_thread/(?P<uidb64>[0-9A-Za-z_\-]+)/$', views.ProductMessageThreadByUUIDAPI.as_view(),
        name='product_message_threads'),
    url(r'^product_message_thread/(?P<uidb64>[0-9A-Za-z_\-]+)/messages/$', views.ProductMessageByUUIDAPI.as_view(),
        name='product_message_threads'),
    url(r"^upload-asset/$", views.AssetUploadAPI.as_view(), name="upload_asset_api_view"),
    url(r"^thumbnail/$", views.ProductThumbnailAPI.as_view(), name="thumbnail_api_view"),
    url(r"^generate360/$", views.Generate360.as_view(), name="generate_360_api_view"),
]

if USE_LOCAL_STORAGE:
    # add statics
    urlpatterns += static(LOCAL_STORAGE_URL, document_root=LOCAL_STORAGE_LOCATION)

else:
    if TEST_LOCAL:
        # add statics
        urlpatterns += static(str("/"+AWS_STORAGE_BUCKET_NAME+"/"),
                              document_root='https://s3.amazonaws.com/')
