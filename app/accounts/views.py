# Django Contrib & Core
from django.core.mail import send_mail
from django.utils.html import strip_tags
from django.core.paginator import Paginator
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth import get_user_model
from django.views.generic.detail import DetailView
from django.views.decorators.csrf import csrf_exempt
from dateutil.relativedelta import relativedelta
from django.template import Context
from django.template.loader import render_to_string, get_template
from app.accounts.serializers import boto3Upload2, CompanyPreviewSerializer
from boto3.s3.transfer import S3Transfer
import io, boto3, pystache
from app.core.appCssMustache import css as appCssMustache
from app.orders.models import ContentStandard
# DRF
import oauth2 as oauth
# Django REST Framework
from rest_framework import viewsets, mixins, parsers, renderers, status, generics
from rest_framework import generics
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework import status
from rest_framework.decorators import api_view
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
import urllib.request, urllib.parse, urllib.error, json
import requests
from app.core.utility import has_permission, iterate_and_save_products, AuthenticatedUserMixin, IsNotAuthenticated, \
    ChargebeeAPI, write_asset_order_excel
from app.core.utility import master_permissions_list as P
from app.core.QRGenerator import generateProductOrderQRCode, GenerateQRLabelDoc
from elasticsearch import *
import requests
import random
import string
import ast
import base64
import os
import datetime
from wsgiref.util import FileWrapper

# import simplejson as json
import requests
import sys
from requests.exceptions import ConnectionError

# from constants import product_search,API2CART_SUCCESS,API2CART_FAILED,UPDATE_CREDS_SUCCESS,UPDATE_CREDS_FAILED,API2CART_DOMAIN,VALIDATE_CART_API,CREATE_CART_API
try:
    import simplejson as json
except ImportError:
    import json
from dateutil.tz import tzutc

UTC = tzutc()

from app.accounts.serializers import SignUpSerializer2, WhiteLabelSerializer, AssignPermissionSerializer, \
    SignUpSerializer, UserSerializer, ProfilePic_UpdateSerializer, ProfilePic_getSerializer, CompanyDetailSerializer, \
    UserEmailSerializer, PasswordTokenSerializer, EmailThread, UserActivateSerializer, CompanyUpdateSerializer, \
    AddressSerializer, CompanySerializer, InvitationSerializer, UserDetailSerializer, Roll_phone_UpdateSerializer, \
    PasswordSerializer, NameUpdateSerializer, OnBoardSerializer, Company_ProfilePic_getSerializer,\
    Company_ProfilePic_UpdateSerializer
from app.products.serializers import ProductMessageSerializer, ProductMessageThreadCreateSerializer, \
    ProductMessageThreadListSerializer, UploaderSerializer, ProductListSerializer
from app.orders.serializers import FullOrderSerializer
from app.core.models import UploadAsset
from app.accounts.models import User, Profile, Company, Address, Invitation, PasswordToken, PermissionAssignment, \
    Permission, WhiteLabel, OnBoarding
from rest_framework.authtoken.models import Token
import ipdb


# class UserActivatSubContractor(APIView):


class UserActivate(APIView):
    permission_classes = (IsNotAuthenticated,)

    def post(self, request, uidb64, token, format=None):
        print("!!!!!!!!!!!!!!!!!!!!!    UserActivate.POST   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
            Response({'Error': 'No User Exists'}, status=status.HTTP_400_BAD_REQUEST)

        token = token
        print("request.data", request.data)
        serializer = UserActivateSerializer(data=request.data, context={'uid': uid, 'token': token, 'request': request})

        if serializer.is_valid():
            serializer.save()
            profile = Profile.objects.get(user=user)
            user = User.objects.get(pk=uid)
            company = profile.companyProfile

            data = {'data': {'permission': {"user": user.pk, "company": company.pk, "perm": "ALL"},
                             'assigner': {"assigner": user.pk}}}
            request = Struct(**data)
            UserPermissionAssignment.activate_post(self=None, request=request, format=None)
            return Response({'data': serializer.data, 'is_active': user.is_active}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserActivateCompanyAndPassword(APIView):
    permission_classes = (IsNotAuthenticated,)

    def post(self, request, uidb64, token, format=None):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            if user is not None and account_activation_token.check_token(user, token):

                # TODO: [BACKEND][Dom] Add password and confirm check for backend. Front end validation for now.
                # pw = request.data['password']
                # cpw = request.data['confirmPassword']
                try:
                    serializer = UserActivateSerializer(data=request.data,
                                                        context={'uid': uid, 'token': token, 'request': request})

                    if serializer.is_valid():
                        serializer.save()
                        return Response({'Success': 'User Activated', 'is_active': True},
                                        status=status.HTTP_201_CREATED)
                    else:
                        return Response({'Error': 'Incorrect information given to serializer', 'error': False},
                                        status=status.HTTP_400_BAD_REQUEST)
                except:
                    # try to do what the serializer is supposed to do we'll just do it manually
                    user.is_active = True
                    user.save()
                    # TODO: [BACKEND][Dom] Add password and confirm check for backend. Front end validation for now.
                    pw = request.data['password']
                    companyName = request.data['companyName']
                    companySubDomain = request.data['companySubDomain']

                    # pw = request.data['password']
                    # cpw = request.data['confirmPassword']

                    user.set_password(str(pw))
                    user.save()

                    company = None
                    profile = Profile.objects.get(user=user)
                    try:
                        company = Company.objects.create(companyName=companyName, industry=profile.industry,
                                                         companyEmail=user.email)
                    except:
                        company = Company.objects.create(companyName=companyName, industry='No Company Industry',
                                                         companyEmail=user.email)

                    profile.companyProfile = company
                    profile.save()

                    company.users.add(user)
                    company.save()
            else:
                return Response({'Error': 'No User Exists', 'error': user.is_active},
                                status=status.HTTP_400_BAD_REQUEST)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
            return Response({'Error': 'No User Exists'}, status=status.HTTP_400_BAD_REQUEST)

        # uid = force_text(urlsafe_base64_decode(uidb64))
        # print("-------------->UID", uid)

        # token = token

        # serializer = UserActivateSerializer2(data=request.data, context={'uid':uid, 'token':token, 'request':request})
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # return Response({'Success': 'User Activated', 'is_active': user.is_active}, status=status.HTTP_201_CREATED)


class UserPermissionAssignment(APIView):
    permission_classes = (IsAuthenticated,)

    @has_permission(P.ALL)
    def get(self, request, format=None):
        permission = Permission.objects.filter(user=request.data.permission.user)
        return Response(permission, status=status.HTTP_200_OK)

    def activate_post(self, request, format=None):
        serializer = AssignPermissionSerializer(data=request.data['assigner'],
                                                context={'data': request.data['permission']}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @has_permission(P.ALL)
    def post(self, request, format=None):
        serializer = AssignPermissionSerializer(data=request.data['assigner'],
                                                context={'data': request.data['permission']}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# request.data for post = {permission:{user:uid1,company:cid, value:"some_permission"},assigner:{assigner:uid2}}
# request.data for get = {permission:{user:uid1,...}}

class ListUsers(APIView):
    """
    View to list all users in the system.

    * Requires token authentication.
    * Only admin users are able to access this view.
    """
    # authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAdminUser,)

    @has_permission(P.ALL)
    def get(self, request, format=None):
        """
        Return a list of all users.
        """
        usernames = [user.username for user in User.objects.all()]
        return Response(usernames)


class ResetPassword(APIView):
    permission_classes = (IsNotAuthenticated,)

    def post(self, request, format=None):

        user = User.objects.get(email=request.data['email'])

        if user:
            active_status = False

            email = user.email
            userpk = user.id
            active_status = user.is_active

            if active_status == False:
                return Response({'result': '0'}, status=status.HTTP_201_CREATED)

            uuid = str(urlsafe_base64_encode(force_bytes(userpk)))

            userToken = account_activation_token.make_token(user)
            userToken = urlsafe_base64_encode(force_bytes(userToken))

            mail_subject = 'XSPACE Password Reset'

            # this differentiates between localhost and
            host = request.META["HTTP_ORIGIN"]
            message = 'Your request to reset password has been accepted.<br><b><a href="' + host + '/#/resetpassword/' + uuid + str(
                userpk) + '/' + str(userToken) + '">Click here to reset your Password</a></b>'

            EmailThread(mail_subject, message, email).start()

            tokendata = PasswordToken.objects.filter(user=user, token=userToken)
            if tokendata:
                tokendata = PasswordToken.objects.get(user=user, token=userToken)
                tokendata.date = datetime.datetime.now().date()
                tokendata.time = datetime.datetime.now().time()
                tokendata.active_status = True
                tokendata.save()
            else:
                passwordtoken = PasswordToken(user=user, token=userToken, date=datetime.datetime.now().date(),
                                              time=datetime.datetime.now().time(), active_status=True)
                passwordtoken.save()

            return Response({'result': '1', 'active': active_status}, status=status.HTTP_201_CREATED)
        return Response({'result': 'no user'}, status=status.HTTP_201_CREATED)


class ActivateResetPassword(APIView):
    permission_classes = (IsNotAuthenticated,)

    def post(self, request, uidb64, token, format=None):

        uid = force_text(urlsafe_base64_decode(uidb64).decode())

        decode_token = token
        token = urlsafe_base64_decode(token)
        # return Response({'status34':uid,'ok':token,'uidb':uidb64}, status=status.HTTP_201_CREATED)
        # user = User.objects.filter(pk=uid)
        # if user:
        passwordtoken = PasswordToken.objects.filter(token=decode_token)
        if passwordtoken:
            passwordtoken = PasswordToken.objects.get(token=decode_token)
            date = passwordtoken.date
            time = passwordtoken.time

            token_timestamp = datetime.datetime.combine(date, time)
            now_timestamp = datetime.datetime.combine(datetime.datetime.now().date(), datetime.datetime.now().time())
            statuscheck = ''
            userid = passwordtoken.user.pk
            # PasswordToken.objects.all().delete()
            diff = relativedelta(now_timestamp, token_timestamp)
            if diff.years > 0 or diff.months > 0 or diff.days > 0 or diff.hours > 1:
                passwordtoken.active_status = False
                passwordtoken.save()
                statuscheck = False
            elif diff.hours >= 1 and diff.minutes > 0:
                passwordtoken.active_status = False
                passwordtoken.save()
                statuscheck = False
            elif diff.hours >= 1 and diff.seconds > 0:
                passwordtoken.active_status = False
                passwordtoken.save()
                statuscheck = False
            else:
                statuscheck = passwordtoken.active_status

            # serializer = UserActivateSerializer(data=request.data, context={'uid':uid, 'token':token, "userid":userid})

            # if serializer.is_valid():
            #    serializer.save()

            return Response({'id': userid, 'status': statuscheck, 'diff_years': diff.years, 'diff_months': diff.months,
                             'diff_days': diff.days, 'diff_hours': diff.hours, 'diff_minutes': diff.minutes,
                             'diff_seconds': diff.seconds}, status=status.HTTP_201_CREATED)  # serializer.data
        else:
            return Response({'error': 'no token'}, status=status.HTTP_404_NOT_FOUND)


class PasswordTokenView(generics.ListAPIView):
    queryset = PasswordToken.objects.all()
    serializer_class = PasswordTokenSerializer()

    def list(self, request):
        # Note the use of get_queryset() instead of self.queryset
        queryset = self.get_queryset()
        serializer = PasswordTokenSerializer(queryset, many=True)
        return Response(serializer.data)


class UserCheck(APIView):
    permission_classes = (IsNotAuthenticated,)
    renderer_classes = (renderers.JSONRenderer,)

    def post(self, request, format=None):
        try:
            user = User.objects.get(email=request.data['email'])
            if user:
                active_status = False
                email = user.email
                active_status = user.is_active

                return Response({'result': '1', 'status': active_status, 'email': email},
                                status=status.HTTP_201_CREATED)
            return Response({'result': '0'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response([{'non_field_errors': 'This e-mail is currently not registered.'}])


class WhiteLabelView(generics.RetrieveAPIView):
    queryset = WhiteLabel.objects.all()
    serializer_class = WhiteLabelSerializer
    permission_classes = (IsNotAuthenticated,)

    @csrf_exempt
    @has_permission(P.WHITELABEL)
    def put(self, request, *args, **kwargs):
        print(request.data)
        pk = request.data['userId']
        user = User.objects.get(pk=pk)
        profile = Profile.objects.get(user=user)
        company = Company.objects.get(pk=profile.companyProfile.pk)
        w = WhiteLabel.objects.get(company=company)
        request.data.update({'company': company.pk})
        serializer = WhiteLabelSerializer(data=request.data)
        logo = w.logoUrl
        background = w.backgroundColor
        fore1 = w.foregroundColor1
        fore2 = w.foregroundColor2
        print(logo)
        content = pystache.render(appCssMustache,
                                  {"logo": logo, "background": background, "fore1": fore1, "fore2": fore2,
                                   "beacon": "25"})
        if serializer.is_valid():
            WhiteLabel.objects.filter(id=w.id).update(**serializer.validated_data)
            client = boto3.client('s3', aws_access_key_id='AKIAJKV6HI4YIS35FTVA',
                                  aws_secret_access_key='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')
            transfer = S3Transfer(client)
            try:
                # print(str(filelocation.split('/')[(len(filelocation.split('/'))-1)]))
                keyvalue = "index_" + str(company.name) + ".css"
                transfer.upload_file(io.StringIO(content), 'storage.xspaceapp.com/css/', keyvalue)
                return Response(keyvalue, status=status.HTTP_201_CREATED)
            except Exception as err:
                print('err')
                return Response(serializer.data, status=status.HTTP_304_NOT_MODIFIED)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_304_NOT_MODIFIED)

    @csrf_exempt
    @has_permission(P.WHITELABEL)
    def post(self, request, format=None):
        pk = request.data['userId']
        user = User.objects.get(pk=pk)
        profile = Profile.objects.get(user=user)
        company = Company.objects.get(pk=profile.companyProfile.pk)
        request_type = request.data['type']
        if request_type == 'post':
            # user = request.user
            serializer = WhiteLabelSerializer(data=request.data['wlabel'])
            if serializer.is_valid():
                w = serializer.save()
                request.data.update({'company': company.pk})

                logo = w.logoUrl
                background = w.backgroundColor
                fore1 = w.foregroundColor1
                fore2 = w.foregroundColor2
                print(logo)
                content = pystache.render(appCssMustache,
                                          {"logo": logo, "background": background, "fore1": fore1, "fore2": fore2,
                                           "beacon": "25"})
                if serializer.is_valid():

                    client = boto3.client('s3', aws_access_key_id='AKIAJKV6HI4YIS35FTVA',
                                          aws_secret_access_key='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')
                    transfer = S3Transfer(client)
                    try:
                        # print(str(filelocation.split('/')[(len(filelocation.split('/'))-1)]))
                        keyvalue = "index_" + str(company.name) + ".css"
                        transfer.upload_file(io.StringIO(content), 'storage.xspaceapp.com/css/', keyvalue)
                        return Response(keyvalue, status=status.HTTP_201_CREATED)
                    except Exception as err:
                        print('err')
                        return Response(serializer.data, status=status.HTTP_304_NOT_MODIFIED)
                return Response(serializer.data, status=status.HTTP_304_NOT_MODIFIED)


class UserProfileViewsSet(AuthenticatedUserMixin, generics.RetrieveUpdateAPIView):
    """
    Purpose: To get profile of logged in user and update user details
    Methods Supported: Get & Put.
    Constraints:
        1. User should be logged into the system.
    """
    permission_classes = (IsAuthenticated,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = UserDetailSerializer

    @has_permission(P.READ_ONLY)
    def get(self, request, *args, **kwargs):

        try:

            # This code will check the if existing user are create company or not if not then create the company
            user = User.objects.get(pk=request.user.id)
            profile = Profile.objects.get(user=user)
            company = profile.companyProfile
            if not company:
                user = User.objects.get(pk=request.user.id)
                try:
                    company = Company.objects.create(companyName=profile.companyName, industry=profile.industry,
                                                     companyEmail=user.email)
                except:
                    company = Company.objects.create(companyName='No Company Name', industry='No Company Industry',
                                                     companyEmail=user.email)

                company.users.add(user)
                company.save()

                profile = Profile.objects.get(user=user)
                profile.companyProfile = company
                profile.save()
                user.save()

            serializer = UserDetailSerializer(user)
            # print(serializer.data)
            return Response({'result': serializer.data}, status=status.HTTP_200_OK)
        except Exception as ex:
            return Response({'Error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):

        """
        Purpose: Update user profile of the logged in user.
        :param self: Context object
        :param request: HTTPRequest object
        :returns: returns dictionary of serialized data for profile details and
        success message in case of success of the event else
        dictionary of error flag and error message string.
        """
        try:
            if 'first_name' in request.data:
                serializer_class = NameUpdateSerializer
                serializer = NameUpdateSerializer(data=request.data)
                if serializer.is_valid():
                    User.objects.filter(pk=request.user.id).update(**serializer.validated_data)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            elif 'emailUpdate' in request.data:
                request.data.pop('emailUpdate')

                # serializer = UserSerializer(data=request.data, context={'pk':request.user.pk})
                # Serializer call not working
                pk = request.user.pk
                email = request.data['email']
                password = request.data['password']

                Token.objects.create(user=User.objects.get(email=email))
                print(email)
                if not email:
                    return Response({'error': 'A email is required.'}, status=status.HTTP_201_CREATED)
                user = get_user_model().objects.filter(pk=pk)
                if user.exists() and user.count() == 1:
                    user_obj = user.first()
                else:
                    return Response({'error': 'This email is not valid'}, status=status.HTTP_201_CREATED)
                if user_obj:
                    if not user_obj.check_password(password):
                        return Response({'error': 'Incorrect credentials please try again.'},
                                        status=status.HTTP_201_CREATED)
                    else:
                        get_user_model().objects.filter(pk=pk).update(email=email)
                        try:
                            print(user_obj)
                            token = Token.objects.get(user=user_obj)
                            token.delete()
                            Token.objects.create(user=User.objects.get(email=email))
                        except Exception as err:
                            print(email)
                            token = Token.objects.create(user=User.objects.get(email=email))

                        return Response({'test': get_user_model().objects.get(pk=pk)}, status=status.HTTP_201_CREATED)
                '''
                print serializer.is_valid()
                print request.data
                if serializer.is_valid():
                    user_obj = serializer.save()
                    from account.models import EmailAddress
                    ob = EmailAddress.objects.get(user=user_obj)
                    ob.email = user_obj.email
                    ob.save()
                #return Response(serializer.data, status=status.HTTP_201_CREATED)
                '''
                # return Response({'test':get_user_model().objects.get(pk=pk)}, status=status.HTTP_201_CREATED)
            elif 'password' in request.data:
                pk = request.user.id
                queryset = get_user_model().objects.all()
                serializer_class = PasswordSerializer
                serializer = PasswordSerializer(data=request.data, context={'pk': pk})
                if serializer.is_valid():
                    serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            elif 'companyRole' in request.data or 'phoneNum' in request.data:
                serializer = Roll_phone_UpdateSerializer(data=request.data)
                if serializer.is_valid():
                    Profile.objects.filter(user=request.user).update(**serializer.validated_data)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# TODO: [BACKEND][Dom] Rewrite for cleaner code and switch to RSAA
class ResetChangePassword(APIView):
    permission_classes = (IsNotAuthenticated,)

    def post(self, request, format=None):
        user = User.objects.get(pk=request.data['id'])
        password = request.data['password']
        if user:
            user = User.objects.get(pk=request.data['id'])
            user.set_password(password)
            user.save()
            return Response({'result': '1'}, status=status.HTTP_201_CREATED)
        return Response({'result': '0'}, status=status.HTTP_400_BAD_REQUEST)


class BearerAuthentication(authentication.TokenAuthentication):
    '''
    Simple token based authentication using utvsapitoken.

    Clients should authenticate by passing the token key in the 'Authorization'
    HTTP header, prepended with the string 'Bearer '.  For example:

    Authorization: Bearer 956e252a-513c-48c5-92dd-bfddc364e812
    '''
    keyword = 'Bearer'


# TODO: [BACKEND][Dom] Rewrite for cleaner code and switch to RSAA
class UserDetail(generics.RetrieveAPIView):
    authentication_classes = (BearerAuthentication)
    queryset = get_user_model().objects.all()
    serializer_class = UserEmailSerializer

    def post(self, request, format=None):
        pk = request.data['userId']
        request_type = request.data['type']
        serializer = UserSerializer(data=request.data, context={'pk': pk})
        if request_type == 'post':
            # user = request.user
            serializer = UserSerializer(data=request.data, context={'pk': pk})
            if serializer.is_valid():
                user_obj = serializer.save()
                from account.models import EmailAddress
                ob = EmailAddress.objects.get(user=user_obj)
                ob.email = user_obj.email
                ob.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request_type == 'get':
            users = get_user_model().objects.filter(pk=pk)
            res = ''
            for user in users:
                res = {"id": user.id, "email": user.email, "username": user.username}
            return Response(res, status=status.HTTP_201_CREATED)


class OnboardView(generics.UpdateAPIView):
    queryset = OnBoarding.objects.all()
    serializer_class = OnBoardSerializer
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        # TODO: [BACKEND][Jacob] work with Angel to figure out what is being passed through
        print(request.data)
        onboard_object = OnBoarding.objects.get(user=request.user)
        for attrname in request.data.keys():
            print(attrname)
            if str(attrname) != str("user"):
                setattr(onboard_object, str(attrname), request.data[attrname])
                onboard_object.save()
                serializer = OnBoardSerializer(onboard_object, many=False)

        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)


# TODO: [BACKEND][Dom]Convert to RSAA Pattern
class PassDetail(generics.RetrieveAPIView):
    # permission_classes = (IsNotAuthenticated,)
    # authentication_classes = (BasicAuthentication)
    queryset = get_user_model().objects.all()
    serializer_class = PasswordSerializer

    def post(self, request, format=None):
        # print request.data
        pk = request.data['userId']
        # print pk
        serializer = PasswordSerializer(data=request.data, context={'pk': pk})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_201_CREATED)


class Struct:
    def __init__(self, **entries):
        self.__dict__.update(entries)


# TODO: [BACKEND][Dom] Rewrite for cleaner code and switch to RSAA
class ProfilePicUrlDetail(generics.RetrieveAPIView):
    permission_classes = (IsNotAuthenticated,)
    # authentication_classes = (BasicAuthentication)
    serializer_class = ProfilePic_UpdateSerializer

    def get(self, request, format=None):
        pk = request.data['userId']
        user = User.objects.get(pk=pk)
        snippets = Profile.objects.get(user=user)
        serializer = ProfilePic_getSerializer(snippets, many=False)
        return Response(serializer.data)

    def post(self, request, format=None):
        # user = request.user
        pk = request.data['userId']
        serializer = ProfilePic_UpdateSerializer(data=request.data, context={'pk': pk})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# TODO: [BACKEND][Dom] Rewrite for cleaner code and switch to RSAA
class CompanyProfilePicUrlDetail(generics.RetrieveAPIView):
    permission_classes = (IsNotAuthenticated,)
    # authentication_classes = (BasicAuthentication)
    serializer_class = ProfilePic_UpdateSerializer

    def get(self, request, format=None):
        pk = request.data['userId']
        user = User.objects.get(pk=pk)
        snippets = Company.objects.get(user=user)
        serializer = Company_ProfilePic_getSerializer(snippets, many=False)
        return Response(serializer.data)

    def post(self, request, format=None):
        # user = request.user
        print("!!!!!!!!!!!!!!!!!!!!!!!! CompanyProfilePicUrlDetail POST !!!!!!!!!!!!!!!!!!!!!!!!!!!")
        pk = request.data['userId']
        profile = Profile.objects.get(user=pk)
        if not profile.isCompanyAdmin:
            print("user is not administrator of this account and cannot adjust the profile picture")
            return Response(None, status=status.HTTP_400_BAD_REQUEST)
        company = profile.companyProfile
        serializer = Company_ProfilePic_UpdateSerializer()
        out = serializer.create_profile_pic(validated_data=request.data, context={'pk': pk, 'company': company})
        return Response(out, status=status.HTTP_200_OK)


class BillingSummaryAPI(APIView):
    permission_classes = (IsAuthenticated,)
    # authentication_classes = (TokenAuthentication)
    renderer_classes = (renderers.JSONRenderer,)

    @csrf_exempt
    @has_permission(P.ALL)
    def get(self, request):
        # user = User.objects.filter(profile=request.profile)
        chargebee_obj = ChargebeeAPI(request)

        profile = Profile.objects.get(user=request.user)

        invoiceObj = chargebee_obj.getCustomerInvoices(request, profile)

        # serializer = ProductMessageThreadCreateSerializer(thread, many=True)
        # return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(invoiceObj.__dict__['response'])


class BillingPortalAPI(AuthenticatedUserMixin, APIView):
    permission_classes = (IsAuthenticated,)
    renderer_classes = (renderers.JSONRenderer,)
    swagger_schema = None

    @csrf_exempt
    @has_permission(P.ALL)
    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        chargebee_obj = ChargebeeAPI(request)
        subscriptionList = chargebee_obj.getBillingInfo(request, profile)
        portal = chargebee_obj.getCustomerPortal(request, profile)
        portalURL = str(portal.__dict__['access_url'])
        invoiceObj = chargebee_obj.getCustomerInvoices(request, profile)
        subscriptionID = subscriptionList.__dict__['response']
        nextInvoiceDate = subscriptionID[0]["subscription"]["next_billing_at"]
        maxNumberOfUsers = 0
        subscriptionPlanDataLimit = 0

        # TODO: [BACKEND][Jacob] Tie in user's current storage size into the request from company profile
        # Check for Subcription List
        company = profile.companyProfile
        numOfUsers = profile.companyProfile.users.count()
        numOfProducts = profile.companyProfile.products.count()
        currentStorage = profile.companyProfile.current_storage_size
        storageFloat = float(currentStorage / 1000000)
        currentStorage = storageFloat

        invoiceList = []

        # For Every Invoice, Map Object to Key Value
        for x in range(0, len(invoiceObj)):
            id = invoiceObj[x].invoice.id

            # Date Validation
            date = int(invoiceObj[x].invoice.date)
            date = datetime.datetime.fromtimestamp(date).strftime('%m/%d/%Y')

            description = 'Charge'
            amount = int(invoiceObj[x].invoice.total / 100)
            amount = '{:,.2f}'.format(amount)
            status = invoiceObj[x].invoice.status

            if status == "paid":
                status = "Completed"
            elif status == "not_paid":
                status = "Not Paid"
            elif status == "posted":
                status = "Posted"
            elif status == "payment_due":
                status = "Payment Due"
            elif status == "voided":
                status = "Void"
            elif status == "pending":
                status = "Pending"

            invoiceElement = {'invoiceid': id, 'date': date, 'description': description, 'amount': amount,
                              'status': status}

            invoiceList.append(invoiceElement)

        subscriptionType = subscriptionID[1]["subscription"]["plan_id"]

        if subscriptionType == 'free-plan':
            planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            subscriptionPlanDataLimit = planObj.cf_planstoragesize / 1000
            maxNumberOfUsers = planObj.cf_maxusercount
            subscriptionType = 'Free Plan'
        elif subscriptionType == 'base-plan':
            planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            subscriptionPlanDataLimit = planObj.cf_planstoragesize / 1000
            maxNumberOfUsers = planObj.cf_maxusercount
            subscriptionType = 'Base Plan'
        elif subscriptionType == 'base-plus-plan':
            planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            subscriptionPlanDataLimit = planObj.cf_planstoragesize / 1000
            maxNumberOfUsers = planObj.cf_maxusercount
            subscriptionType = 'Base Plus Plan'
        elif subscriptionType == 'brand-manager-plan':
            planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            subscriptionPlanDataLimit = planObj.cf_planstoragesize / 1000
            maxNumberOfUsers = planObj.cf_maxusercount
            subscriptionType = 'Brand Manager Plan'
        elif subscriptionType == 'brand-manager-plus-plan':
            planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            subscriptionPlanDataLimit = planObj.cf_planstoragesize / 1000
            maxNumberOfUsers = planObj.cf_maxusercount
            subscriptionType = 'Brand Manager Plus Plan'
        elif subscriptionType == 'enterprise-plan':
            planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            subscriptionPlanDataLimit = planObj.cf_planstoragesize / 1000
            maxNumberOfUsers = planObj.cf_maxusercount
            subscriptionType = 'Enterprise Plan'
        elif subscriptionType == 'capture-services':
            # planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            # print(subscriptionID)
            subscriptionType = subscriptionID[0]["subscription"]["plan_id"]
            print((subscriptionID[0]))

        else:
            subscriptionType = 'No Active Plan'
            subscriptionPlanDataLimit = 0

        subscriptionID = subscriptionID[0]["subscription"]["id"]
        subscriptionList = str(subscriptionList.__dict__['response'])
        nextInvoiceDate = int(nextInvoiceDate)
        formatDate = datetime.datetime.fromtimestamp(nextInvoiceDate).strftime('%m/%d/%Y')

        return Response({'currentStorage': currentStorage, 'subscriptionPlanDataLimit': subscriptionPlanDataLimit,
                         'nextInvoiceDate': formatDate, 'subscriptionType': subscriptionType,
                         'maxNumberOfUsers': maxNumberOfUsers, 'billingPortalURL': portalURL,
                         'invoiceList': invoiceList, 'numOfProducts': numOfProducts, 'numOfUsers': numOfUsers})

    @csrf_exempt
    @has_permission(P.ALL)
    def put(self, request):

        profile = Profile.objects.get(user=request.user)
        chargebee_obj = ChargebeeAPI(request)
        # print(subscriptionID)

        if request.data["planType"] == "additional-user-plan":

            subscriptionList = chargebee_obj.getAddUserPlan(request, profile)
            subscriptionID = subscriptionList.__dict__['response']

            # print(len(subscriptionID))
            # print(subscriptionID)

            if len(subscriptionList) == 0:
                checkoutPage = chargebee_obj.createNewAddUserSubscriptionPlan(request, profile)
            else:
                companySubID = profile.companyProfile.subscription_id
                checkoutPage = chargebee_obj.updateSubscriptionPlan(request, companySubID)

            checkoutPage = checkoutPage.__dict__['url']

        else:

            # subscriptionList = chargebee_obj.getBillingInfo(request)
            # subscriptionID = subscriptionList.__dict__['response']
            # subscriptionID = subscriptionID[0]["subscription"]["id"]

            companySubID = profile.companyProfile.subscription_id
            checkoutPage = chargebee_obj.updateSubscriptionPlan(request, companySubID)
            checkoutPage = checkoutPage.__dict__['url']

        return Response({'checkoutPlanURL': checkoutPage})


# TODO: [BACKEND][Dom] Convert to RSAA
class DownloadInvoicePDf(APIView):
    permission_classes = (IsNotAuthenticated,)
    renderer_classes = (renderers.JSONRenderer,)
    swagger_schema = None

    @csrf_exempt
    def get(self, request):
        chargebee_obj = ChargebeeAPI(request)

        invoiceID = request.query_params['query_string'] if 'query_string' in request.query_params else None
        downloadOBJ = chargebee_obj.getInvoicePDFObject(request, invoiceID)
        url = downloadOBJ.download.download_url

        return Response({'downloadURL': url})


class BillingPlanAPI(AuthenticatedUserMixin, APIView):
    permission_classes = (IsAuthenticated,)
    renderer_classes = (renderers.JSONRenderer,)
    swagger_schema = None


class BillingCheck(AuthenticatedUserMixin, APIView):
    permission_classes = (IsAuthenticated,)
    renderer_classes = (renderers.JSONRenderer,)
    swagger_schema = None

    @csrf_exempt
    @has_permission(P.GENERIC)
    def get(self, request):
        chargebee_obj = ChargebeeAPI(request)

        profile = Profile.objects.get(user=request.user)

        # Read Current Subscription Plans Limits
        subscriptionList = chargebee_obj.getBillingInfo(request, profile)
        subscription = subscriptionList.__dict__['response']
        subscriptionID = subscription[0]["subscription"]["id"]

        # Check for Subcription List
        company = profile.companyProfile
        numOfUsers = profile.companyProfile.users.count()
        numOfProducts = profile.companyProfile.products.count()
        current_storage_size = profile.companyProfile.current_storage_size

        # Set initalized variables.
        at_max_storage = False
        at_max_users = False
        at_max_products = False

        # Grab subscription limits
        maxStorage = None
        maxUsers = None
        maxProducts = None

        subscriptionType = subscription[0]["subscription"]["plan_id"]

        if (subscriptionType == 'free-plan'):
            planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            maxStorage = planObj.cf_planstoragesize
            maxUsers = planObj.cf_maxusercount
            maxProducts = planObj.cf_maxproducts
        elif (subscriptionType == 'base-plan'):
            planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            maxStorage = planObj.cf_planstoragesize
            maxUsers = planObj.cf_maxusercount
            maxProducts = planObj.cf_maxproducts
        elif (subscriptionType == 'base-plus-plan'):
            planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            maxStorage = planObj.cf_planstoragesize
            maxUsers = planObj.cf_maxusercount
            maxProducts = planObj.cf_maxproducts
        elif (subscriptionType == 'brand-manager-plan'):
            planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            maxStorage = planObj.cf_planstoragesize
            maxUsers = planObj.cf_maxusercount
            maxProducts = planObj.cf_maxproducts
        elif (subscriptionType == 'brand-manager-plus-plan'):
            planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            maxStorage = planObj.cf_planstoragesize
            maxUsers = planObj.cf_maxusercount
            maxProducts = planObj.cf_maxproducts
        elif (subscriptionType == 'enterprise-plan'):
            planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            maxStorage = planObj.cf_planstoragesize
            maxUsers = planObj.cf_maxusercount
            maxProducts = planObj.cf_maxproducts
        elif (subscriptionType == 'capture-services'):
            # planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            subscriptionType = subscription[1]["subscription"]["plan_id"]
            planObj = chargebee_obj.getPlanObject(request, subscriptionType).plan
            maxStorage = planObj.cf_planstoragesize
            maxUsers = planObj.cf_maxusercount
            maxProducts = planObj.cf_maxproducts

        else:
            subscriptionPlanDataLimit = 0

        # Check for storage limit
        if (current_storage_size >= maxStorage):
            at_max_storage = True
        else:
            at_max_storage = False

        # Check for users limit
        if (numOfUsers >= maxUsers):
            at_max_users = True
        else:
            at_max_users = False

        # Products limit
        if (numOfProducts >= maxProducts):
            at_max_products = True
        else:
            at_max_products = False

        return Response({'company': profile.companyProfile.companyName, 'subscription_id': subscriptionID,
                         'subscription_type': str(subscriptionType), 'at_max_storage': at_max_storage,
                         "at_max_users": at_max_users, "at_max_products": at_max_products,
                         "current_storage_size": current_storage_size, "numOfUsers": numOfUsers,
                         "numOfProducts": numOfProducts})


class CompanyAPI(APIView):
    queryset = Company.objects.all()
    permission_classes = (IsAuthenticated,)
    # authentication_classes = (TokenAuthentication)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = CompanySerializer

    def get(self, request):
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyDetailAPI(AuthenticatedUserMixin, APIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    # authentication_classes = (TokenAuthentication)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = CompanySerializer

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        company = profile.companyProfile
        serializer = CompanyDetailSerializer(company, many=False)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @csrf_exempt
    @has_permission(P.ALL)
    def put(self, request, *args, **kwargs):
        print("!!!!!!!!!!!!!!!!!!!!!! CompanyDetailAPI PUT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        profile = Profile.objects.get(user=request.user)
        company = profile.companyProfile
        print('profile', profile)
        print('company', company)
        print('request', request)
        print('request.data', request.data)
        serializer = CompanyUpdateSerializer(instance=company, data=request.data, partial=True, )
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserList(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer()
    swagger_schema = None

    # permission_classes = (IsAdminUser,)
    @has_permission(P.ALL)
    def list(self, request):
        # Note the use of get_queryset() instead of self.queryset
        queryset = self.get_queryset()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)


class UserDetail(generics.RetrieveAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserEmailSerializer
    swagger_schema = None

    # permission_classes = (IsAuthenticated,)
    @csrf_exempt
    @has_permission(P.ALL)
    def post(self, request, format=None):
        pk = request.data['userId']
        request_type = request.data['type']
        if request_type == 'post':
            # user = request.user
            serializer = UserSerializer(data=request.data, context={'pk': pk})
            if serializer.is_valid():
                user_obj = serializer.save()
                from account.models import EmailAddress
                ob = EmailAddress.objects.get(user=user_obj)
                ob.email = user_obj.email
                ob.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request_type == 'get':
            users = get_user_model().objects.filter(pk=pk)
            res = ''
            for user in users:
                res = {"id": user.id, "email": user.email, "username": user.username}
            return Response(res, status=status.HTTP_201_CREATED)


class AddressAPI(AuthenticatedUserMixin, APIView):
    permission_classes = (IsAuthenticated,)
    # authentication_classes = (TokenAuthentication)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = AddressSerializer

    @has_permission(P.GENERIC)
    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        company = profile.companyProfile
        addresses = company.addresses.all()
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Done
    @csrf_exempt
    @has_permission(P.GENERIC)
    def post(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        company = profile.companyProfile

        serializer = AddressSerializer(data=request.data, context={'company': company, 'profile': profile})

        if serializer.is_valid():
            serializer.save()

            company.addresses.add(serializer.data["id"])
            company.save()

            profile.addresses.add(serializer.data["id"])
            profile.save()

            print(company.addresses.all())
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Done
    @csrf_exempt
    @has_permission(P.GENERIC)
    def put(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        company = profile.companyProfile

        serializer = AddressSerializer(data=request.data, context={'company': company, 'profile': profile})
        if serializer.is_valid():
            serializer.save()

            main = Address.objects.get(pk=serializer.data["id"])
            company.mainAddress = main
            company.addresses.add(serializer.data["id"])
            company.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSignupAPI(APIView):
    permission_classes = (IsNotAuthenticated,)
    swagger_schema = None

    def post(self, request, *args, **kwargs):
        data = request.data
        step = data['step']
        if step == 1:
            data.pop('step')
            rand_str = lambda n: ''.join([random.choice(string.ascii_lowercase) for i in range(n)])
            s = rand_str(10)
            data.update({'username': s})

            # companyName = data['company']
            # companyRole = data['companyRole']
            # industry = data['industry']

            signupToken = data['signupToken']

            # data.pop('company')
            # data.pop('companyRole')
            # data.pop('industry')

            host_name = request.META['HTTP_HOST']

            stringHost = host_name.split(':')

            # Get server name
            baseHost = stringHost[0]
            protocol = 'http://'

            if (baseHost == '127.0.0.1'):
                baseHost = 'localhost:3000'
                protocol = 'http://'
            elif (baseHost == '52.10.110.128'):
                baseHost = 'app.xspaceapp.com'
                protocol = 'https://'
            elif (baseHost == '52.41.20.71'):
                baseHost = '52.41.20.71'
            else:
                baseHost = baseHost

            if (baseHost != 'localhost:3000'):
                baseHost = 'app.xspaceapp.com'
                protocol = 'https://'

            serializer = SignUpSerializer2(data=data,
                                           context={"signupToken": signupToken, "host": baseHost, "protocol": protocol})

            if serializer.is_valid():
                user = serializer.save()
                profile = Profile.objects.get(user=user)
                # Create Company Subscription via Regular signup
                if user and profile.companyProfile == None:

                    # print("Test")
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


'''
        if step == 2 or  step == 3:
            serializer = UserProfileSerializer(data=data)
            if serializer.is_valid():
                profile = serializer.create_profile(data)
                return Response(serializer.data,status=status.HTTP_201_CREATED)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
'''


# TODO: [BACKEND][Dom] Convert RSSAA
class SendInvitation(APIView):
    permission_classes = (IsNotAuthenticated,)
    swagger_schema = None

    def get(self, request, *args, **kwargs):
        print("!!!!!!!!!!!!!!!!!!!! SendInvitation GET FUNCTION !!!!!!!!!!!!!!!!!!!!!! ")
        username = request.query_params['query_string']
        user = User.objects.get(username=username)
        profile = Profile.objects.get(user=user)
        company = profile.companyProfile
        invites = Invitation.objects.filter(parent_id=profile.companyProfile.pk)
        inactiveList = []
        emailList = []
        print('request', request, 'request.data', request.data)
        for user in company.users.all():
            if (user.is_active == True):
                emailList.append(user.email)
                print(user)

        print('emailList', emailList)

        for inv in invites:
            if (inv.emailId not in emailList):
                inactiveList.append(inv)

        serializer = InvitationSerializer(inactiveList, many=True)
        print('serializer', serializer, 'serializer.data', serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        print("!!!!!!!!!!!!!!!!!!!! SendInvitation POST FUNCTION !!!!!!!!!!!!!!!!!!!!!! ")
        data = request.data
        print('data.keys', data.keys())
        print(request.data)
        username = data['userName']
        user = User.objects.get(username=username)
        profile = Profile.objects.get(user=user)
        print('established user and profile as:', user, profile)
        parentcompany = profile.companyProfile
        parentcompany = Company.objects.get(uniqueID=parentcompany)
        parentcompanyName = parentcompany.companyName
        print('user company and company name:', parentcompany, parentcompanyName)

        standards = ContentStandard.objects.filter(company_id=parentcompany.id)
        # invite user -- within the company they will be able to:
        #         - do everything parent company can do except:
        #                   - access to billing
        #                   - edit organizational info
        #                   - and invite additional users
        # invite contractor -- outside of the company, they will:
        #       - parent company can see contractor images.
        #         - contractor cannot see parent company images
        #         - contractor cannot edit parent company information
        #         - parent company cannot edit contractor information
        #         - contractor CAN see parent company's content standards
        if 'newcompany' in data.keys():
            try:
                company = Company.objects.get(companyName=data['newcompany'], industry=profile.industry,
                                              companyEmail=user.email, parentCompany=parentcompany.uniqueID)
            except:
                company = Company.objects.create(companyName=data['newcompany'], industry='No Company Industry',
                                                 companyEmail=user.email, parentCompany=parentcompany.uniqueID)
        else:
            company = Company.objects.get(id=parentcompany.id)

        company.save()
        tval = data['invitationemail'] + '|' + data['first_name'] + '|' + data['last_name'] + '|' + parentcompanyName
        print(tval)
        tokenData = str(urlsafe_base64_encode(force_bytes(tval)))
        print(tokenData)

        try:
            checkInvetition = Invitation.objects.get(uniqueToken=tokenData)
        except Invitation.DoesNotExist:
            checkInvetition = None
        print('checkInvitation', checkInvetition)
        if checkInvetition:
            domain = 'localhost:3000'
            protocol = "http://"
            if (request.META.get('HTTP_X_API_SUBDOMAIN') and request.META.get(
                    'HTTP_X_API_SUBDOMAIN') == 'localhost:3000'):
                domain = 'localhost:3000'
            elif (request.META.get('HTTP_X_API_SUBDOMAIN')):
                domain = str(request.META['HTTP_X_API_SUBDOMAIN']) + '.xspaceapp.com'
                protocol = "https://"
            else:
                domain = 'localhost:3000'
            activationlink = protocol + domain + '/#/register/' + str(tokenData)
            # activationlink = 'http://localhost:3000/#/register/' + str(checkInvetition.uniqueToken)
            activationlink = str(activationlink)
            ctx = {'company_name': company.companyName, 'activation_link': activationlink}
            mail_subject = "[XSPACE Web App] Invitation from " + company.companyName
            message = get_template('invitation.html').render(ctx)
            to_email = str(data['invitationemail'])
            # ipdb.set_trace()
            print('mail_subject', mail_subject, 'message', message)
            send_mail(
                mail_subject,
                strip_tags(message),
                'no-reply@xspaceapp.com',
                [to_email, 'dominic@xspaceapp.com'],
                fail_silently=False,
                html_message=message,
            )

            return Response({'message': 'Invitation already sent to this email, sending another email.'},
                            status=status.HTTP_201_CREATED)
        else:
            try:
                if 'newcompany' in data.keys():
                    invitation = Invitation(uniqueToken=tokenData, firstName=data['first_name'],
                                            lastName=data['last_name'], emailId=data['invitationemail'],
                                            senderEmail=data['senderemail'], company_id=company.id,
                                            parent=parentcompany)
                else:
                    invitation = Invitation(uniqueToken=tokenData, firstName=data['first_name'],
                                            lastName=data['last_name'], emailId=data['invitationemail'],
                                            senderEmail=data['senderemail'], company_id=company.id, parent=company)

                invitation.save()
                print('invitation saved as:', invitation)
                # print invitation
                domain = 'localhost:3000'
                protocol = "http://"
                if (request.META.get('HTTP_X_API_SUBDOMAIN') and request.META.get(
                        'HTTP_X_API_SUBDOMAIN') == 'localhost:3000'):
                    domain = 'localhost:3000'
                elif (request.META.get('HTTP_X_API_SUBDOMAIN')):
                    domain = str(request.META['HTTP_X_API_SUBDOMAIN']) + '.xspaceapp.com'
                    protocol = "https://"
                else:
                    domain = 'localhost:3000'
                activationlink = protocol + domain + '/#/register/' + str(tokenData)
                # activationlink = 'http://localhost:3000/#/register/'+str(tokenData)
                activationlink = str(activationlink)
                ctx = {'company_name': company.companyName, 'activation_link': activationlink}
                mail_subject = "Invitation from XSPACE"
                message = get_template('invitation.html').render(ctx)
                to_email = str(data['invitationemail'])
                # ipdb.set_trace()
                send_mail(
                    mail_subject,
                    strip_tags(message),

                    'no-reply@xspaceapp.com',
                    [to_email, 'j.dallas@xspaceapp.com'],
                    fail_silently=False,
                    html_message=message,
                )
                # msg = EmailThread(mail_subject, message,to_email)
                # msg.start()
                #
                # print(msg)

                return Response({'message': 'Invitation Sent Successfully'}, status=status.HTTP_201_CREATED)
            except Exception as err:
                print(err)
                return Response({'message': err}, status=status.HTTP_201_CREATED)


# TODO: [BACKEND][Dom] Convert RSSAA
class JoinInvitation(APIView):
    permission_classes = (IsNotAuthenticated,)
    swagger_schema = None

    def post(self, request, *args, **kwargs):
        data = request.data
        email = data['email']
        print("!!!!!!!!!!!!!!!!!!!! JoinInvitation POST FUNCTION !!!!!!!!!!!!!!!!!!!!!! ")
        try:
            checkInvitation = Invitation.objects.get(emailId=email)
            print(checkInvitation)
        except Invitation.DoesNotExist:
            checkInvitation = None
            return Response({'message': 'No invitation was found associated with this email address.'},
                            status=status.HTTP_400_BAD_REQUEST)

        company = checkInvitation.company
        companyName = company.companyName

        # tval = data['invitationemail']+'|'+data['first_name']+'|'+data['last_name']+'|'+companyName
        # tokenData =  str(urlsafe_base64_encode(force_bytes(tval)))

        if checkInvitation:
            domain = 'localhost:3000'
            if (request.META.get('HTTP_X_API_SUBDOMAIN')):
                domain = str(request.META['HTTP_X_API_SUBDOMAIN']) + '.xspaceapp.com'
            else:
                domain = 'localhost:3000'
            activationlink = 'http://' + domain + '/#/register/' + str(checkInvitation.uniqueToken)
            activationlink = str(activationlink)
            ctx = {'company_name': company.companyName, 'activation_link': activationlink}
            mail_subject = "[XSPACE Web App] Invitation from " + company.companyName
            message = get_template('invitation.html').render(ctx)
            to_email = str(email)
            # ipdb.set_trace()
            msg = EmailThread(mail_subject, message, to_email)
            msg.start()

            return Response(
                {'message': 'Invitation already sent to this email, sending another email.', 'resent': True},
                status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'No Invitation Found', 'resent': False}, status=status.HTTP_400_BAD_REQUEST)


# TODO: [BACKEND][Dom] Convert RSSAA
class InviteeSignup(APIView):
    permission_classes = (IsNotAuthenticated,)
    swagger_schema = None

    def post(self, request, token):
        print("!!!!!!!!!!!!!!!!!!!! InviteeSignup POST FUNCTION !!!!!!!!!!!!!!!!!!!!!! ")
        data = request.data
        uniqueToken = token
        password = data['password']
        # cpw = data['confirm']

        try:

            checkInvitation = Invitation.objects.get(uniqueToken=uniqueToken)
            # print(checkInvitation)
            # return Response(
            #     {'message': 'Invitation already sent to this email, sending another email.', 'resent': True}, status=status.HTTP_200_OK)

            # Invitation Token Found, Now Create Sub User
            # company=Company.objects.get(id=data['company'])
            company = checkInvitation.company
            rand_str = lambda n: ''.join([random.choice(string.ascii_lowercase) for i in range(n)])
            username = rand_str(10)

            # If user exists, return response for API.
            if User.objects.filter(email=checkInvitation.emailId).exists():
                return Response({'message': 'A user already exists with this email.', 'error': True},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                user = User.objects.create_user(email=checkInvitation.emailId, password=str(password),
                                                username=username, first_name=checkInvitation.firstName,
                                                last_name=checkInvitation.lastName)
                user.is_active = True
                user.save()

                company.users.add(user)
                company.save()

                profile = Profile.objects.get(user=user)
                profile.companyProfile = company
                profile.save()

                if checkInvitation.company.id == checkInvitation.parent.id:
                    data = {'data': {'permission': {"user": user.pk, "company": company.pk, "perm": "GENERIC"},
                                     'assigner': {"assigner": user.pk}}}
                    request = Struct(**data)
                    UserPermissionAssignment.activate_post(self=None, request=request, format=None)

                    data = {'data': {'permission': {"user": user.pk, "company": company.pk, "perm": "READ_ONLY"},
                                     'assigner': {"assigner": user.pk}}}
                    request = Struct(**data)
                    UserPermissionAssignment.activate_post(self=None, request=request, format=None)
                else:
                    data = {'data': {'permission': {"user": user.pk, "company": company.pk, "perm": "GENERIC"},
                                     'assigner': {"assigner": user.pk}}}
                    request = Struct(**data)
                    UserPermissionAssignment.activate_post(self=None, request=request, format=None)
                    data = {'data': {'permission': {"user": user.pk, "company": company.pk, "perm": "ALL"},
                                     'assigner': {"assigner": user.pk}}}
                    request = Struct(**data)
                    UserPermissionAssignment.activate_post(self=None, request=request, format=None)

                    data = {'data': {'permission': {"user": user.pk, "company": company.pk, "perm": "READ_ONLY"},
                                     'assigner': {"assigner": user.pk}}}
                    request = Struct(**data)
                    UserPermissionAssignment.activate_post(self=None, request=request, format=None)

                return Response(
                    {'message': 'Sub Account created successfully.', 'is_active': user.is_active, 'error': False},
                    status=status.HTTP_201_CREATED)

        except Invitation.DoesNotExist:
            checkInvitation = None
            return Response(
                {'message': 'Token invalid; no token found associated with this signup link.', 'is_active': False},
                status=status.HTTP_400_BAD_REQUEST)


class CompanyListAPIView(AuthenticatedUserMixin, APIView):
    permission_classes = (IsNotAuthenticated,)

    def get(self, request, *args, **kwargs):
        if (request.user.email == "j.dallas@xspaceapp.com"):
            queryset = Company.objects.filter()
            serializer = CompanyPreviewSerializer(queryset, many=True)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        if (request.user.email == "j.dallas@xspaceapp.com"):
            try:
                uniqueId = request.data['companyId']
                company = Company.objects.get(uniqueID=uniqueId)
                user = request.user
                profile = Profile.objects.get(user=user)

                try:
                    perm = Permission.objects.get(user=user, company=company)
                    profile.companyProfile = company
                    profile.save()
                except Exception as e_inner:
                    perm = Permission.objects.create(user=user, perm='ALL', company=company)
                    profile.companyProfile = company
                    profile.save()
            except Exception as e:
                return Response({"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"status": "OK"}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "message": "Unauthenticated user"}, status=status.HTTP_400_BAD_REQUEST)
