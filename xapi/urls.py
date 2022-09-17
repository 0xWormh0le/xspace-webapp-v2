"""xapi URL Configuration

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
from django.contrib import admin
from django.conf.urls import url, include, handler404
from django.urls import path, include
from rest_framework import routers
import oauth2_provider.views as oauth2_views
from django.conf.urls.static import static
from xapi.settings import LOCAL_STORAGE_LOCATION, LOCAL_STORAGE_URL, USE_LOCAL_STORAGE

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
import notifications.urls

schema_view = get_schema_view(
    openapi.Info(
        title="XSPACE Web API Service",
        default_version='v1',
        description="XSPACE API Service Documentation",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = routers.DefaultRouter()

# OAuth2 provider endpoints
oauth2_endpoint_views = [
    url(r'^authorize/$', oauth2_views.AuthorizationView.as_view(), name="authorize"),
    url(r'^token/$', oauth2_views.TokenView.as_view(), name="token"),
    url(r'^revoke-token/$', oauth2_views.RevokeTokenView.as_view(), name="revoke-token"),
]

oauth2_endpoint_views += [
    url(r'^applications/$', oauth2_views.ApplicationList.as_view(), name="list"),
    url(r'^applications/register/$', oauth2_views.ApplicationRegistration.as_view(), name="register"),
    url(r'^applications/(?P<pk>\d+)/$', oauth2_views.ApplicationDetail.as_view(), name="detail"),
    url(r'^applications/(?P<pk>\d+)/delete/$', oauth2_views.ApplicationDelete.as_view(), name="delete"),
    url(r'^applications/(?P<pk>\d+)/update/$', oauth2_views.ApplicationUpdate.as_view(), name="update"),
]

urlpatterns = [

    path('api/', include('app.accounts.urls')),
    path('api/', include('app.core.urls')),
    path('api/', include('app.orders.urls')),
    path('api/', include('app.products.urls')),
    url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    url(r'oauth/', include(('oauth2_provider.urls', 'oauth2_provider_app',), namespace='oauth2_provider'), ),
    # path('accounts/', include('django.contrib.auth.urls')),
    # url('accounts/', include('app.accounts.urls')),
    # url('core/', include('app.core.urls')),
    # url('orders/', include('app.orders.urls')),
    # url('products/', include('app.products.urls')),
    url('admin/', admin.site.urls),

]

if USE_LOCAL_STORAGE:
    # add statics
    urlpatterns += static(LOCAL_STORAGE_URL, document_root=LOCAL_STORAGE_LOCATION)