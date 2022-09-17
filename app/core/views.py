from django.shortcuts import render

# Django Contrib & Core
from django.core.paginator import Paginator
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth import get_user_model
from django.views.generic.detail import DetailView
from django.views.decorators.csrf import csrf_exempt
from dateutil.relativedelta import relativedelta
from app.core.appCssMustache import css as appCssMustache
from rest_framework.permissions import AllowAny
import boto3
from xapi.settings import INITIAL
# DRF
import oauth2 as oauth
# Django REST Framework
from rest_framework import viewsets, mixins, parsers, renderers, status, generics
from rest_framework import generics
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import authentication, permissions
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser

from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from app.accounts.activation_token import account_activation_token
from django.utils.encoding import force_bytes, force_text

from django.template.defaultfilters import slugify
from autoslug import AutoSlugField

# Other
import csv
import urllib, json
import requests
from app.core.utility import iterate_and_save_products, AuthenticatedUserMixin, IsNotAuthenticated, ChargebeeAPI, \
    write_asset_order_excel
from app.core.QRGenerator import generateProductOrderQRCode, GenerateQRLabelDoc
from elasticsearch import *
import requests
import random
import string
import ast
import base64
import os
import datetime
import pystache
from wsgiref.util import FileWrapper

# import simplejson as json
import requests
import sys
from requests.exceptions import ConnectionError
from .category_gen import run as category_run

# from constants import product_search,API2CART_SUCCESS,API2CART_FAILED,UPDATE_CREDS_SUCCESS,UPDATE_CREDS_FAILED,
# API2CART_DOMAIN,VALIDATE_CART_API,CREATE_CART_API
try:
    import simplejson as json
except ImportError:
    import json
from dateutil.tz import tzutc

UTC = tzutc()

from app.accounts.serializers import NotificationSerializer, PasswordTokenSerializer, EmailThread, \
    UserActivateSerializer, CompanyUpdateSerializer, AddressSerializer, CompanySerializer, InvitationSerializer, \
    UserDetailSerializer, Roll_phone_UpdateSerializer, PasswordSerializer, NameUpdateSerializer
from app.products.serializers import ProductMessageSerializer, ProductMessageThreadCreateSerializer, \
    ProductMessageThreadListSerializer, UploaderSerializer, ProductListSerializer
from app.orders.serializers import FullOrderSerializer
from app.core.models import UploadAsset, Category, Application
from app.core.serializers import MessageSerializer, ApplicationSerializer
from app.accounts.models import User, Profile, Company, Token, PasswordToken, WhiteLabel

from oauth2_provider.views import ProtectedResourceView
import bigcommerce
from bigcommerce.api import BigcommerceApi
import ipdb
from oauth2_provider.models import AccessToken
from app.products.models import Product

from notifications.signals import notify
from notifications.models import Notification

from app.core.utility import ProductComparison, ZendeskAPI


@permission_classes((AllowAny,))
class EchoView(APIView):
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        return Response({'status': 'OK'}, status=status.HTTP_200_OK)


@permission_classes((AllowAny,))
class Css(APIView):
    def get(self, request, *args, **kwargs):

        content = pystache.render(appCssMustache,
                                  {"logo": "https://s3.amazonaws.com/storage.xspaceapp.com/css/img/logo.png",
                                   "background": "828282", "fore1": "000", "fore2": "FFFFFF", "beacon": "30"})
        response = FileResponse(content, filename='index.css', content_type='text/css')

        try:
            print(request.query_params['user_id'])
            data = request.query_params['user_id']
            user = User.objects.get(pk=data)
            profile = Profile.objects.get(user=user)
            print(profile.pk)
            company = Company.objects.get(pk=profile.companyProfile.pk)
            print(company.pk)
            w = WhiteLabel.objects.get(company_id=company.pk)
            print(w.pk)
            logo = w.logoUrl
            background = w.backgroundColor
            fore1 = w.foregroundColor1
            fore2 = w.foregroundColor2
            print(logo)
            content = pystache.render(appCssMustache,
                                      {"logo": logo, "background": background, "fore1": fore1, "fore2": fore2,
                                       "beacon": "25"})
            response = FileResponse(content, filename='index.css', content_type='text/css')
        except:
            try:
                data = request.query_params['user_id']
                user = User.objects.get(pk=data)
                content = pystache.render(appCssMustache,
                                          {"logo": "https://s3.amazonaws.com/storage.xspaceapp.com/css/img/logo.png",
                                           "background": "828282", "fore1": "000", "fore2": "FFFFFF", "beacon": "25"})
                response = FileResponse(content, filename='index.css', content_type='text/css')
            except:
                content = pystache.render(appCssMustache,
                                          {"logo": "https://s3.amazonaws.com/storage.xspaceapp.com/css/img/logo.png",
                                           "background": "828282", "fore1": "000", "fore2": "FFFFFF", "beacon": "30"})
                response = FileResponse(content, filename='index.css', content_type='text/css')

        return response


@permission_classes((AllowAny,))
class Categories(generics.RetrieveUpdateAPIView):
    renderer_classes = (renderers.JSONRenderer,)

    def get(self, request, format=None):
        objs = Category.objects.all()
        res = [{"title": category.name, "slug": category.slug, "id": category.id} for category in objs]
        resp_cat = {"categories": res}
        return Response(resp_cat)


class NotificationsView(AuthenticatedUserMixin, APIView):
    permission_classes = (IsAuthenticated,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = NotificationSerializer

    def get(self, request, *args, **kwargs):
        # Get All Notifications for User

        user = User.objects.get(pk=request.user.pk)
        notifs = Notification.objects.filter(recipient=user)
        unreadNotifs = Notification.objects.filter(recipient=user, unread=True)
        unreadCount = user.notifications.unread().count()

        try:
            serializer = NotificationSerializer(notifs, data=list(request.data), many=True)
            # serializer2 = NotificationSerializer(unreadNotifs, data=request.data, many=True)

            # notifications = notifs.values()
            # unrd_notifications = unreadNotifs.values()

            # return Response(list(notifs.values()))

            if serializer.is_valid():
                return Response({'unreadCount': unreadCount, 'notifications': serializer.data,
                                 'unread_notifications': serializer.data}, status=status.HTTP_201_CREATED)

            return Response({serializer.errors, serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e), 'notifications': [],
                             'unread_notifications': []}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        # Get All Notifications for User
        user = User.objects.get(pk=request.user.id)

        actor = request.data['actor']
        recipient = user
        verb = request.data['verb']
        action_object = request.data['action_object']
        target = request.data['target']
        level = request.data['level']
        description = request.data['description']
        public = False
        timestamp = datetime.datetime.now()

        notify.send(user, recipient=user, verb='you reached level 10')

        # notify.send(actor, recipient, verb, action_object, target, level, description, public, timestamp, **kwargs)

        # notifs = Notification.objects.filter(recipient=user.id)
        # unreadCount = user.notifications.unread().count()
        #
        # serializer = NotificationSerializer(notifs, data=request.data, many=True)
        #
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response({'unreadCount':unreadCount,'notifications':serializer.data }, status=status.HTTP_201_CREATED, content_type="application/json")
        #
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Success': 'Notification sent.'}, status=status.HTTP_400_BAD_REQUEST)


class MarkAllReadNotificationView(AuthenticatedUserMixin, APIView):
    permission_classes = (IsAuthenticated,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = NotificationSerializer

    def post(self, request, *args, **kwargs):
        # Get All Notifications for User
        user = User.objects.get(pk=request.user.pk)
        notifs = Notification.objects.filter(recipient=user)
        unreadNotifs = Notification.objects.filter(recipient=user, unread=True)
        unreadCount = user.notifications.unread().count()

        try:

            notifs.mark_all_as_read()

            serializer = NotificationSerializer(notifs, data=list(request.data), many=True)
            # serializer2 = NotificationSerializer(unreadNotifs, data=request.data, many=True)

            # ipdb.set_trace()

            # notifications = notifs.values()
            # unrd_notifications = unreadNotifs.values()

            # return Response(list(notifs.values()))

            if serializer.is_valid():
                return Response({'unreadCount': unreadCount, 'notifications': serializer.data,
                                 'unread_notifications': serializer.data}, status=status.HTTP_201_CREATED)

                return Response({serializer.errors, serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e), 'notifications': [],
                             'unread_notifications': []}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApplicationAPI(ProtectedResourceView, APIView):
    permission_classes = (IsAuthenticated,)
    # authentication_classes = (TokenAuthentication)
    renderer_classes = (renderers.JSONRenderer,)

    @csrf_exempt
    def get(self, request):
        application = Application.objects.all()
        serializer = ApplicationSerializer(application, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        # user = User.objects.get(pk=request.user.id)
        serializer = ApplicationSerializer(data=request.data)
        # print(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# The Auth Callback URL. See https://developer.bigcommerce.com/api/callback
class BigCommerceAPIAuthCallback(APIView):
    permission_classes = (IsNotAuthenticated,)

    def get(self, request):
        # Put together params for token request request.query_params['query_string']
        code = request.query_params['code']
        context = request.query_params['context']
        scope = request.query_params['scope']
        store_hash = context.split('/')[1]
        redirect = "https://localhost:8000/api/bigcommerce/callback/"
        clientID = "mwuylo16gsu326bp8slxvf0vuaqc5ra"
        clientSecret = "tvecew7jculpwvm5seimvu7pa7ccp4j"

        # Fetch a permanent oauth token. This will throw an exception on error,
        # which will get caught by our error handler above.
        client = BigcommerceApi(client_id=clientID, store_hash=store_hash)
        token = client.oauth_fetch_token(clientSecret, code, context, scope, redirect)
        bc_user_id = token['user']['id']
        email = 'crich@ilstu.edu'
        # email = token['user']['email']
        access_token = token['access_token']

        # Create or update store -> Create a new XSPACE Application, for user.

        xapp = Application.objects.filter(bigcommerce_store_id=str(store_hash))
        appname = "BigCommerce_" + str(bc_user_id) + "_" + email
        description = "The XSPACE Connector application for Big Commerce"
        app_url = "https://api.bigcommerce.com/stores/" + str(store_hash) + "/v3/catalog/products"

        import ipdb

        try:
            # Create or update global BC user
            user = User.objects.filter(email=email).first()

        except User.DoesNotExist:
            print("User Not Found")

        if user is None:
            # If an XSPACE User does not exit, prompt login callback, end callback function
            pass

        client_type = ""
        if not xapp.exists():
            newApp = Application.objects.create(name=appname, description=description, app_url=app_url,
                                                bigcommerce_store_id=str(store_hash), bigcommerce_api_key=access_token)
            newApp.save()

            newToken = AccessToken.objects.create(token=access_token, user=user, scope=scope, application=newApp,
                                                  expires="2020-05-30 02:32:25.722881", created=datetime.datetime.now(),
                                                  updated=datetime.datetime.now())
            newToken.save()

        from django.shortcuts import render_to_response

        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        return render(request, 'quickstart.html')


# The Load URL. See https://developer.bigcommerce.com/api/load
class BigCommerceAPIAuthLoad(APIView):
    permission_classes = (IsNotAuthenticated,)

    def get(self, request):
        # Decode and verify payload
        payload = request.query_params['signed_payload']
        user_data = BigcommerceApi.oauth_verify_payload(payload, "tvecew7jculpwvm5seimvu7pa7ccp4j")
        if user_data is False:
            return "Payload verification failed!", 401

        bc_user_id = user_data['user']['id']
        email = user_data['user']['email']
        store_hash = user_data['store_hash']

        # # Lookup store
        # store = Store.query.filter_by(store_hash=store_hash).first()
        # if store is None:
        #     return "Store not found!", 401
        #
        # # Lookup user and create if doesn't exist (this can happen if you enable multi-user
        # # when registering your app)
        # user = User.query.filter_by(bc_id=bc_user_id).first()
        # if user is None:
        #     user = User(bc_user_id, email)
        #     db.session.add(user)
        #     db.session.commit()
        # storeuser = StoreUser.query.filter_by(user_id=user.id, store_id=store.id).first()
        # if storeuser is None:
        #     storeuser = StoreUser(store, user)Upon receiving a GET request to the Load Callback URI, your app needs to process the signed payload. After processing the payload, your app returns its user interface as HTML. BigCommerce renders this inside of an iframe. Please see User Interface Constraints for important information about your app’s user interface.

        #     db.session.add(storeuser)
        #     db.session.commit()
        #
        # # Log user in and redirect to app interface
        # flask.session['storeuserid'] = storeuser.id

        from django.shortcuts import render_to_response

        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        return render(request, 'quickstart.html', {'email': email, 'store_hash': store_hash, "bc_user_id": bc_user_id})


# The Auth Callback URL. See https://developer.bigcommerce.com/api/callback
class ShopifyAPIAuthCallback(APIView):
    permission_classes = (IsNotAuthenticated,)

    def get(self, request):
        # Put together params for token request request.query_params['query_string']
        # code = request.query_params['code']
        hmac = request.query_params['hmac']
        shop = request.query_params['shop']

        # scope = request.query_params['scope']
        # store_hash = context.split('/')[1]
        redirect = "https://localhost:8000/api/bigcommerce/callback/"

        # Fetch a permanent oauth token. This will throw an exception on error,
        # which will get caught by our error handler above.
        # client = BigcommerceApi(client_id="mwuylo16gsu326bp8slxvf0vuaqc5ra", store_hash=store_hash)
        # token = client.oauth_fetch_token("tvecew7jculpwvm5seimvu7pa7ccp4j", code, context, scope, redirect)
        # bc_user_id = token['user']['id']
        # email = token['user']['email']
        # access_token = token['access_token']

        # Create or update store
        # store = Store.query.filter_by(store_hash=store_hash).first()
        # if store is None:
        #     store = Store(store_hash, access_token, scope)
        #     db.session.add(store)
        #     db.session.commit()
        # else:
        #     store.access_token = access_token
        #     store.scope = scope
        #     db.session.add(store)
        #     db.session.commit()
        #     # If the app was installed before, make sure the old admin user is no longer marked as the admin
        #     oldadminuser = StoreUser.query.filter_by(store_id=store.id, admin=True).first()
        #     if oldadminuser:
        #         oldadminuser.admin = False
        #         db.session.add(oldadminuser)
        #
        # # Create or update global BC user
        # user = User.query.filter_by(bc_id=bc_user_id).first()
        # if user is None:
        #     user = User(bc_user_id, email)
        #     db.session.add(user)
        # elif user.email != email:
        #     user.email = email
        #     db.session.add(user)

        # Create or update store user
        # storeuser = StoreUser.query.filter_by(user_id=user.id, store_id=store.id).first()
        # if not storeuser:
        #     storeuser = StoreUser(store, user, admin=True)
        # else:
        #     storeuser.admin = True
        # db.session.add(storeuser)
        # db.session.commit()

        # Log user in and redirect to app home

        from django.shortcuts import render_to_response

        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        return render_to_response(BASE_DIR + '/core/templates/email.html')


# The Load URL. See https://developer.bigcommerce.com/api/load
class ShopifyAPIAuthLoad(APIView):
    permission_classes = (IsNotAuthenticated,)

    def get(self, request):
        # Decode and verify payload
        payload = request.query_params['signed_payload']
        user_data = BigcommerceApi.oauth_verify_payload(payload, "tvecew7jculpwvm5seimvu7pa7ccp4j")
        if user_data is False:
            return "Payload verification failed!", 401

        bc_user_id = user_data['user']['id']
        email = user_data['user']['email']
        store_hash = user_data['store_hash']

        # # Lookup store
        # store = Store.query.filter_by(store_hash=store_hash).first()
        # if store is None:
        #     return "Store not found!", 401
        #
        # # Lookup user and create if doesn't exist (this can happen if you enable multi-user
        # # when registering your app)
        # user = User.query.filter_by(bc_id=bc_user_id).first()
        # if user is None:
        #     user = User(bc_user_id, email)
        #     db.session.add(user)
        #     db.session.commit()
        # storeuser = StoreUser.query.filter_by(user_id=user.id, store_id=store.id).first()
        # if storeuser is None:
        #     storeuser = StoreUser(store, user)Upon receiving a GET request to the Load Callback URI, your app needs to process the signed payload. After processing the payload, your app returns its user interface as HTML. BigCommerce renders this inside of an iframe. Please see User Interface Constraints for important information about your app’s user interface.

        #     db.session.add(storeuser)
        #     db.session.commit()
        #
        # # Log user in and redirect to app interface
        # flask.session['storeuserid'] = storeuser.id

        from django.shortcuts import render_to_response

        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        return render_to_response(BASE_DIR + '/core/templates/email.html')


#
# # The Uninstall URL. See https://developer.bigcommerce.com/api/load
# @app.route('/bigcommerce/uninstall')
# def uninstall():
#     # Decode and verify payload
#     payload = flask.request.args['signed_payload']
#     user_data = BigcommerceApi.oauth_verify_payload(payload, client_secret())
#     if user_data is False:
#         return "Payload verification failed!", 401
#
#     # Lookup store
#     store_hash = user_data['store_hash']
#     store = Store.query.filter_by(store_hash=store_hash).first()
#     if store is None:
#         return "Store not found!", 401
#
#     # Clean up: delete store associated users. This logic is up to you.
#     # You may decide to keep these records around in case the user installs
#     # your app again.
#     storeusers = StoreUser.query.filter_by(store_id=store.id)
#     for storeuser in storeusers:
#         db.session.delete(storeuser)
#     db.session.delete(store)
#     db.session.commit()
#
#     return flask.Response('Deleted', status=204)
#
#
# # The Remove User Callback URL.
# @app.route('/bigcommerce/remove-user')
# def remove_user():
#     # Decode and verify payload
#     payload = flask.request.args['signed_payload']
#     user_data = BigcommerceApi.oauth_verify_payload(payload, client_secret())
#     if user_data is False:
#         return "Payload verification failed!", 401
#
#     # Lookup store
#     store_hash = user_data['store_hash']
#     store = Store.query.filter_by(store_hash=store_hash).first()
#     if store is None:
#         return "Store not found!", 401
#
#     # Lookup user and delete it
#     bc_user_id = user_data['user']['id']
#     user = User.query.filter_by(bc_id=bc_user_id).first()
#     if user is not None:
#         storeuser = StoreUser.query.filter_by(user_id=user.id, store_id=store.id).first()
#         db.session.delete(storeuser)
#         db.session.commit()
#
#     return flask.Response('Deleted', status=204)


'''
Plugin Views
'''


# def storeAuthToProfile(request, platform):


def plugin_quickstart(request):
    from django.shortcuts import render_to_response

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return render(request, 'quickstart.html')

    # return render_to_response(BASE_DIR + '/core/templates/quickstart.html')


class plugin_product_pull(APIView):
    permission_classes = (IsNotAuthenticated,)

    def get(self, request):
        from django.shortcuts import render_to_response

        email = request.query_params['email'] if 'email' in request.query_params else None
        store_hash = request.query_params['store_hash'] if 'store_hash' in request.query_params else None
        bc_user_id = request.query_params['bc_user_id'] if 'bc_user_id' in request.query_params else None

        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        # api = bigcommerce.api.BigcommerceApi(client_id='', store_hash='', access_token='')

        return render(request, 'product-pull.html',
                      {'email': email, 'store_hash': store_hash, "bc_user_id": bc_user_id})

        # return render_to_response(BASE_DIR + '/core/templates/quickstart.html')


def plugin_product_push(request):
    from django.shortcuts import render_to_response

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return render(request, 'quickstart.html')

    # return render_to_response(BASE_DIR + '/core/templates/quickstart.html')


class product_pull_start(APIView):
    permission_classes = (IsNotAuthenticated,)

    def get(self, request):
        from django.shortcuts import render_to_response

        email = request.query_params['email'] if 'email' in request.query_params else None
        store_hash = request.query_params['store_hash'] if 'store_hash' in request.query_params else None
        bc_user_id = request.query_params['bc_user_id'] if 'bc_user_id' in request.query_params else None

        clientID = "mwuylo16gsu326bp8slxvf0vuaqc5ra"
        clientSecret = "tvecew7jculpwvm5seimvu7pa7ccp4j"

        # Fetch a permanent oauth token. This will throw an exception on error,
        # which will get caught by our error handler above.

        # TODO: [BACKEND][Dom] Grab products from Company later.
        xapp = Application.objects.filter(bigcommerce_store_id=str(store_hash)).first()
        api = BigcommerceApi(client_id=clientID, store_hash=store_hash, access_token=xapp.bigcommerce_api_key)
        prod = api.Products.all()

        # Grab the owner of the application
        prof = Profile.objects.get(user=xapp.user)

        # Grab all XSPACE product objects for that profile/company
        xspace_products = Product.objects.filter(profile=prof)

        print(prod)

        comparator = ProductComparison()
        pull_list = comparator.compare(prod, list(xspace_products), 'big-commerce')

        for product in pull_list:
            api.Products.create(name=product.name, type='physical', description=product.description, sku=product.SKU,
                                upc=product.upccode,
                                availability="available", price=str(product.price), weight=str(0.00),
                                depth=str(product.height), width=str(product.width), height=str(product.height),
                                categories=[23])

        return render(request, 'product-pull.html', {'pull_list': pull_list})


def plugin_content_pull(request):
    from django.shortcuts import render_to_response

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return render(request, 'quickstart.html')

    # return render_to_response(BASE_DIR + '/core/templates/quickstart.html')


def plugin_content_push(request):
    from django.shortcuts import render_to_response

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return render(request, 'quickstart.html')

    # return render_to_response(BASE_DIR + '/core/templates/quickstart.html')


def plugin_viewersettings(request):
    from django.shortcuts import render_to_response

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return render(request, 'quickstart.html')

    # return render_to_response(BASE_DIR + '/core/templates/quickstart.html')


# def plugin_quickstart(request):
#     from django.shortcuts import render_to_response
#
#     BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
#     return render(request, 'quickstart.html')
#
#     #return render_to_response(BASE_DIR + '/core/templates/quickstart.html')
#
#
# def plugin_quickstart(request):
#     from django.shortcuts import render_to_response
#
#     BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
#     return render(request, 'quickstart.html')
#
#     #return render_to_response(BASE_DIR + '/core/templates/quickstart.html')


class ViewAllOrgTickets(AuthenticatedUserMixin, APIView):
    renderer_classes = (renderers.JSONRenderer,)

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        company = Company.objects.get(pk=profile.companyProfile.pk)
        ze = ZendeskAPI(request)
        tickets = ze.viewOrgZendeskTickets(company)
        return Response({'tickets': tickets}, status=status.HTTP_201_CREATED)


class CreateTicket(AuthenticatedUserMixin, APIView):
    renderer_classes = (renderers.JSONRenderer,)

    def post(self, request, *args):
        subject = request.data['subject']
        type = request.data['type']
        comment = request.data['comment']

        profile = Profile.objects.get(user=request.user)
        company = Company.objects.get(pk=profile.companyProfile.pk)

        ze = ZendeskAPI(request)

        tickets = ze.createZendeskTicket2(request.user, company, subject, type, comment)

        return Response({'tickets': tickets}, status=status.HTTP_201_CREATED)


class GetCompanyFiles(APIView):
    renderer_classes = (renderers.JSONRenderer,)

    def get(self, request, *args):
        fileList = []
        # userid = request.user.id
        # get_username = User.objects.get(pk=userid)
        try:
            # profile = Profile.objects.get(user=get_username)

            files = []
            file_size = []
            created_date = []
            key = []

            key.append('admin' + '/company_assets/')
            # key.append(str(profile.companyProfile.slug) + '/company_assets/')

            bucketname = 'storagev2'
            s3 = boto3.resource('s3', aws_access_key_id='AKIAJKV6HI4YIS35FTVA',
                                aws_secret_access_key='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')
            data = s3.Bucket(bucketname)

            for i in range(len(key)):
                for item in data.objects.filter(Prefix=key[i]):
                    test = ''
                    for k in range(len(item.key)):
                        if k == (len(item.key) - 1):
                            test += item.key[k]
                    if test != '/':
                        # print str(item.size/1024)+' kb'
                        file_size.append(item.size / 1024)
                        files.append('https://storage.xspaceapp.com/' + item.key)
                    created_date.append(item.last_modified)

                    filekey = {'key': 'https://storage.xspaceapp.com/' + item.key, 'modified': item.last_modified,
                               'size': str('{0:.3g}'.format(item.size / 1024))}
                    fileList.append(filekey)

            return Response({'success': 'true', 'error': 'None', 'files': fileList})
            return Response({'files': fileList}, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({'success': 'None', 'error': 'No Profile found for this user.'})
            return Response({'files': None}, status=status.HTTP_400_BAD_REQUEST)


# creates the categories at the startup of the application
if INITIAL:
    pass
else:
    category_run()
