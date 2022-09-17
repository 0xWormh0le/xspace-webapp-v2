"""Core API URL Configuration

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
from xapi.settings import LOCAL_STORAGE_LOCATION, LOCAL_STORAGE_URL, USE_LOCAL_STORAGE

from rest_framework import routers
import app.core.views as views
import notifications.urls

router = routers.DefaultRouter()

urlpatterns = [
    # url(r'^snippets/$', views.snippet_list),
    # url(r'^snippets/(?P<pk>[0-9]+)/$', views.snippet_detail),
    # url(r'^get_categories/', views.get_categories, name='get_categories'),
    url(r'^category/$', views.Categories.as_view(), name='Categories'),
    url(r'^css/index.css', views.Css.as_view(), name='Css'),
    url(r'^notifications/all/', views.NotificationsView.as_view(), name='notifications_all'),
    url(r'^notifications/mark_as_read/', views.MarkAllReadNotificationView.as_view(),
        name='notifications_mark_as_read'),
    # url(r'^fetch_search_results/', views.fetch_search_results, name='fetch_search_results'),
    # url(r'^api/API2CartImportAPI/', views.API2CartImportAPI.as_view(), name='API2CartImportAPI'),
    # #url(r'^api/updateapi2cart/', views.ImportToStore.as_view(), name='ImportToStore'),
    # url(r'^api2CartTestConnection/', views.api2CartTestConnection, name='api2CartTestConnection'),
    url(r"^echo/$", views.EchoView.as_view(), name="Echo"),
    url(r"^application/$", views.ApplicationAPI.as_view(), name="application_api"),
    url(r"^bigcommerce/callback/$", views.BigCommerceAPIAuthCallback.as_view(), name="bigcommerce_api"),
    url(r"^bigcommerce/load/$", views.BigCommerceAPIAuthLoad.as_view(), name="bigcommerce_api_load"),
    url(r"^shopify/callback/$", views.ShopifyAPIAuthCallback.as_view(), name="bigcommerce_api"),
    url(r"^shopify/load/$", views.ShopifyAPIAuthLoad.as_view(), name="bigcommerce_api_load"),

    url(r'^quickstart/$', views.plugin_quickstart, name="plugin_quickstart"),
    url(r'^product_pull/$', views.plugin_product_pull.as_view(), name="plugin_product_pull"),
    url(r'^product_pull_start/$', views.product_pull_start.as_view(), name="product_pull_start"),
    url(r'^product_push/$', views.plugin_product_push, name="plugin_product_push"),
    url(r'^content_pull/$', views.plugin_content_pull, name="plugin_content_pull"),
    url(r'^content_push/$', views.plugin_content_push, name="plugin_content_push"),

    url(r"^tickets/all/$", views.ViewAllOrgTickets.as_view(), name="view_all_org_tickets"),
    url(r"^tickets/(?P<id>[0-9A-Za-z_\-]+)/$", views.ViewAllOrgTickets.as_view(), name="view_all_org_tickets"),
    url(r"^tickets/$", views.CreateTicket.as_view(), name="create_ticket"),
    url(r"^files/all/$", views.GetCompanyFiles.as_view(), name="get_all_files"),
    # url(r"^api/fupload/$",views.fileUpload,name="file_upload_api"),
]

if USE_LOCAL_STORAGE:
    # add statics
    urlpatterns += static(LOCAL_STORAGE_URL, document_root=LOCAL_STORAGE_LOCATION)
