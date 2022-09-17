from app.accounts.models import User, Profile, Company, Address, Invitation, PasswordToken, Permission, \
    PermissionAssignment, WhiteLabel, OnBoarding
from django.template.defaultfilters import slugify
from app.orders.models import ContentStandard
from app.core.models import Snippet
from app.products.models import Product
from PIL import Image
import io
from app.imageEditingFunctions.contentStandardFunctions import load_image
from app.imageEditingFunctions.manipulateImage import ManipulateImage
# from app.products.views import get_all_prods_for_sub_companies
from elasticsearch import *
import string
# Django Contribs & Core
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate
from django.core.mail import EmailMessage
from django.template import Context
from django.template.loader import render_to_string, get_template
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from app.core.utility import master_permissions_list as P
from django.conf import settings

# DRF
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework.authtoken.models import Token
from rest_framework.serializers import ValidationError

# Other
import threading
import requests
import socket
import string
import ipdb
import random
import json
import boto3
import os
from os.path import normcase, split, splitext, join, isfile, isdir
from os import makedirs
from xapi.settings import LOCAL_STORAGE_LOCATION, USE_LOCAL_STORAGE, AWS_STORAGE_BUCKET_NAME, \
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BASE_DIR, LOCAL_STORAGE_URL
from app.core.utility import ChargebeeAPI, boto3Upload2, boto3Upload3, ZendeskAPI
from app.accounts.activation_token import account_activation_token
from notifications.models import Notification, ContentType


class EmailThread(threading.Thread):
    def __init__(self, subject, html_content, recipient_list, bcc_list=None, file=None):
        self.subject = subject
        self.recipient_list = recipient_list
        self.html_content = html_content
        self.bcc_list = [bcc_list]
        self.file = file
        # self.sender = sender
        threading.Thread.__init__(self)

    def run(self):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     EmailThread.run !!!!!!!!!!!!!!!!!!!!!!!!!!")
        msg = EmailMessage(self.subject, self.html_content, to=[self.recipient_list], bcc=self.bcc_list)
        msg.content_subtype = 'html'
        if self.file is not None:
            if str(self.file).startswith('http'):
                response = requests.get(self.file)
                # print(response)
                msg.attach(str(split(self.file)[1]), response.content)
            else:
                msg.attach_file(self.file)
        msg.send()
        if self.file is not None:
            if str(self.file).startswith('http'):
                pass
            else:
                try:
                    os.remove(self.file)
                    # print('Successfully got rid of the audit file on local')
                except:
                    try:
                        os.unlink(self.file)
                        # print('Successfully got rid of the audit file on local')
                    except:
                        print('Did not get rid of audit file on local')


class SnippetSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Snippet
        fields = ('id', 'title', 'code', 'linenos', 'owner')


class UserEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['email']
        read_only_fields = ['email']


class CompanySerializer(serializers.ModelSerializer):
    # companyEmail = UserEmailSerializer(read_only=True)

    class Meta:
        model = Company
        fields = ('id', 'uniqueID', 'createdDate', 'companyName', 'companyEmail', 'companyPhoneNumber', 'mainAddress',
                  'industry', 'users', 'products', 'orders', 'addresses', 'max_users_allowed', 'max_storage_size',
                  'current_storage_size', 'subscription_id')

        def create(self, validated_data):
            print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     CompanySerializer.create !!!!!!!!!!!!!!!!!!!!!!!!!!")

            # uid = self.context.get("uid")
            # print("=========>UID", uid)
            # user = User.objects.get(pk=uid)
            # print("==============>>USER", user)
            # token = self.context.get("token")
            # print("============>>Token", token)
            # uid = self.context.get("uid")

            # print(uid)

            # messageThread = ProductMessageThread.objects.get(pk=uid)

            # username = validated_data.get('username', None)

            return Company.objects.create(**validated_data)

        def get_company_object(self, companyID):
            print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     CompanySerializer.get_company_object !!!!!!!!!!!!!!!!!!!!!!!!!!")

            try:
                return Company.objects.get(id=companyID)
            except Company.DoesNotExist:
                return ""


class AddressSerializer(serializers.ModelSerializer):
    poBoxNum = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:

        model = Address
        fields = ('__all__')

        def create(self, **validated_data):
            print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     AddressSerializer.create !!!!!!!!!!!!!!!!!!!!!!!!!!")

            return Address.objects.create(**validated_data)

        def get_addresss_object(self, addressID):
            print(
                "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     AddressSerializer.get_addresss_object !!!!!!!!!!!!!!!!!!!!!!!!!!")

            try:
                return Address.objects.get(uniqueID=addressID)
            except Address.DoesNotExist:
                return ""


class UserEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'password']
        read_only_fields = ['username']

    def create(self, validated_data):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     UserSerializer.create !!!!!!!!!!!!!!!!!!!!!!!!!!")

        pk = self.context.get("pk")
        # username = validated_data.get('username', None)#get_user_model().objects.get(pk=pk)
        email = validated_data.get('email', None)
        password = validated_data.get('password', None)

        if not email:
            raise ValidationError("A email is required.")
        user = get_user_model().objects.filter(pk=pk)
        if user.exists() and user.count() == 1:
            user_obj = user.first()
        else:
            raise ValidationError("This email is not valid")

        if user_obj:
            if not user_obj.check_password(password):
                raise ValidationError("Incorrect credentials please try again.")
            else:
                get_user_model().objects.filter(pk=pk).update(email=email)
                token = Token.objects.get(user=user_obj)
                token.delete()
                Token.objects.create(user=User.objects.get(email=email))

        return get_user_model().objects.get(pk=pk)


class PasswordSerializer2(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'password']

    def create(self, validated_data):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     PasswordSerializer2.create !!!!!!!!!!!!!!!!!!!!!!!!!!")

        pk = self.context.get("pk")
        newpass = validated_data.get('password', None)

        user = User.objects.filter(pk=pk)
        if user.exists() and user.count() == 1:
            user_obj = user.first()
            user_obj.set_password(str(newpass))
            user_obj.save()

        else:
            raise ValidationError("This user is not valid")

        return User.objects.get(pk=pk)


class PasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'password']

    def create(self, validated_data):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     PasswordSerializer.create !!!!!!!!!!!!!!!!!!!!!!!!!!")

        pk = self.context.get("pk")
        newpass = validated_data.get('username', None)
        # email = validated_data.get('email', None)
        password = validated_data.get('password', None)

        user = get_user_model().objects.filter(pk=pk)
        if user.exists() and user.count() == 1:
            user_obj = user.first()
        else:
            raise ValidationError("This username is not valid")

        if user_obj:
            if not user_obj.check_password(password):
                raise ValidationError("Incorrect credentials please try again.")
            else:
                hashpass = make_password(newpass, salt=None, hasher='default')
                get_user_model().objects.filter(pk=pk).update(password=hashpass)

        return get_user_model().objects.get(pk=pk)


class NameUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['first_name', 'last_name']


class Roll_phone_UpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['companyRole', 'userPosition', 'phoneNum']
        read_only_fields = ['userPosition']


# Profile update to s3 bucket#
class ProfilePic_getSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'companyName', 'profileURL']
        read_only_fields = ['user', 'companyName']


class ProfilePic_UpdateSerializer(serializers.ModelSerializer):
    profileURL = serializers.FileField(max_length=None, allow_empty_file=False, use_url='UPLOADED_FILES_USE_URL')

    class Meta:
        model = Profile
        fields = ['user', 'profileURL']
        read_only_fields = ['user']

    def create(self, validated_data):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     ProfilePic_UpdateSerializer.create !!!!!!!!!!!!!!!!!!!!!!!!!!")

        pk = self.context.get("pk")
        profileurl = validated_data.get('profileURL', None)
        user = User.objects.get(pk=pk)
        company_object = Company.objects.get(users=user)
        key = company_object.slug + '/profiles/' + user.username + '/profilePic'
        if profileurl:
            fileformat = splitext(str(profileurl))[1]
            fname = split(str(profileurl))[1]
            if any([fileformat == '.jpg', fileformat == '.png', fileformat == '.jpeg']):
                if LOCAL_STORAGE_LOCATION:
                    user = User.objects.get(pk=pk)
                    # print user
                    outputLocation = normcase(join(LOCAL_STORAGE_LOCATION, key))
                    if not isdir(outputLocation):
                        makedirs(outputLocation)
                    url = normcase(join(outputLocation, str(profileurl)))
                    if isfile(url):
                        print("overwriting file at:", url)
                        overwriteFlag = True
                    with open(url, 'wb+') as f:
                        f.write(profileurl.read())
                else:
                    url = boto3Upload3(profileurl, company_object.slug, key)
            else:
                print("Profile picture type not supported, needs to be jpg, png, or jpeg")
                return None
            print(url)
            if url:
                # square and resize the image
                img = load_image(url)
                img = Image.open(io.BytesIO(img))
                PROFILEPIC_FORMAT = img.format
                imageEditor = ManipulateImage(img)
                params = {'square': {'fill_color': 'replicate_border'},
                          'resize': {'height': 250,
                                     'width': 250}}
                profilePic, _ = imageEditor.manipulate(params)
                del img
                del imageEditor
                if USE_LOCAL_STORAGE:
                    with open(url, 'wb+') as f:
                        f.write(profilePic.read())
                else:
                    in_mem_file = io.BytesIO()
                    profilePic.save(in_mem_file, format=PROFILEPIC_FORMAT)
                    in_mem_file.seek(0)
                    boto3Upload3(in_mem_file, company_object.slug, key, is_bytes=True, fileName=fname)
                prof = Profile.objects.get(user=user)
                if USE_LOCAL_STORAGE:
                    url = os.path.join(LOCAL_STORAGE_URL,
                                       os.path.relpath(url,
                                                       start=LOCAL_STORAGE_LOCATION)).replace('\\', '/')
                prof.profileURL = url
                prof.save()
                # raise ValidationError("Profile pic update success")
            else:
                raise ValidationError('Invalid format')
        return Profile.objects.get(user=user)


class Company_ProfilePic_getSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['user', 'companyName', 'companyLogoURL']
        read_only_fields = ['user', 'companyName']


class Company_ProfilePic_UpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = ['user', 'profileURL']
        read_only_fields = ['user']

    def create_profile_pic(self, validated_data, context):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     Company_ProfilePic_UpdateSerializer.create !!!!!!!!!!!!!!!!!!!!!!!!!!")

        # pk = self.context.get("pk")
        company = context.get("company")
        print('company', company)
        file_content = validated_data.get('companyLogoURL').read()
        filename = validated_data.get('companyLogoURL')
        print('filename', filename)
        # user = User.objects.get(pk=pk)
        key = str(company.slug) + "/profilePic/"
        if file_content:
            fileformat = splitext(str(filename))[1]
            if any([fileformat == '.jpg', fileformat == '.png', fileformat == '.jpeg']):
                try:
                    # catch any bad file names ahead of saving to the database
                    filename = str(filename).replace(' ', '-')
                except:
                    # filename should be fine
                    pass
                if LOCAL_STORAGE_LOCATION:
                    # user = User.objects.get(pk=pk)
                    # print user
                    outputLocation = normcase(join(LOCAL_STORAGE_LOCATION, key))
                    if not isdir(outputLocation):
                        makedirs(outputLocation)
                    url = normcase(join(outputLocation, str(filename)))
                    try:
                        # catch any bad file names ahead of saving to the database
                        url = str(url).replace('\\', '/')
                    except:
                        # filename should be fine
                        pass
                    if isfile(url):
                        print("overwriting file at:", url)
                        # overwriteFlag = True
                    with open(url, 'wb+') as f:
                        f.write(file_content)
                else:
                    url = boto3Upload3(file_content, company.slug, key, is_bytes=True, fileName=filename)
            else:
                raise ValidationError('Invalid format')
            print(url)
            # update company profile
            if url:
                # square and resize the image
                img = load_image(url)
                img = Image.open(io.BytesIO(img))
                PROFILEPIC_FORMAT = img.format
                imageEditor = ManipulateImage(img)
                params = {'square': {'fill_color': 'replicate_border'},
                          'resize': {'height': 250,
                                     'width': 250}}
                profilePic, _ = imageEditor.manipulate(params)
                del img
                del imageEditor
                if USE_LOCAL_STORAGE:
                    with open(url, 'wb+') as f:
                        f.write(profilePic.read())
                else:
                    in_mem_file = io.BytesIO()
                    profilePic.save(in_mem_file, format=PROFILEPIC_FORMAT)
                    in_mem_file.seek(0)
                    boto3Upload3(in_mem_file, company.slug, key, is_bytes=True, fileName=filename)
                if USE_LOCAL_STORAGE:
                    url = os.path.join(LOCAL_STORAGE_URL,
                                       os.path.relpath(url,
                                                       start=LOCAL_STORAGE_LOCATION)).replace('\\', '/')
                company.companyLogoURL = url
                company.save()
                print("saved the updated url to the company profile")
            else:
                raise ValidationError('Invalid format')
        return url


class SignUpSerializer2(serializers.ModelSerializer):
    """
    This function is called when creating an account during signup, and sends out the original email
    """
    email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    def create(self, validated_data):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     SignUpSerializer2.create !!!!!!!!!!!!!!!!!!!!!!!!!!!")
        try:
            print("creating user")
            randomPassword = str(random.random())
            user = User.objects.create_user(email=validated_data['email'],
                                            password=randomPassword,
                                            username=validated_data['username'],
                                            first_name=validated_data['first_name'],
                                            last_name=validated_data['last_name'])

            user.is_active = False
            print("saving user")
            user.save()
            print("user created")
            # If Signup Token under main account, add to Company.
            inviteToken = self.context.get("signupToken")

            host = self.context.get("host")
            protocol = self.context.get("protocol")

            print("made it to invite token")
            if inviteToken:
                try:
                    print("made it inside the invite token")
                    inviteObj = Invitation.objects.get(uniqueToken=inviteToken)
                    company = Company.objects.get(pk=inviteObj.company_id)
                    print("made company and invite objects")
                    company.users.add(user)
                    company.save()
                    print("updated company object")
                    profile_obj = Profile.objects.get(user=user.id)
                    profile_obj.companyProfile = company
                    profile_obj.email = validated_data['email']

                    profile_obj.save()
                    user.save()
                    print("updated profile and user objects")
                except Exception as e:
                    print(e)
            else:
                print("Root Account Created")

            print("made it to email creation")
            mail_subject = 'XSPACE | Account Activation'  # '+str(current_site)+'
            uuid = str(urlsafe_base64_encode(force_bytes(user.pk)))
            print("applying token")
            userToken = account_activation_token.make_token(user)
            print("setting up message")
            # print userToken
            # message = '<b>Hello '+user.first_name+" "+user.last_name+'</b><br> Please activate your XSPACE account by
            # clicking the link below.'+'<br><a href="http://app.xspaceapp.com/#/useractivate/'
            # +uuid+str(user.pk)+'/'+str(userToken)+'">Activation Link</a>'
            to_email = str(validated_data['email'])
            ctx = {
                'subject': 'XSPACE | Account Activation',
                'first_name': user.first_name,
                'last_name': user.last_name,
                'activation_link': protocol + host + '/#/useractivate/' + uuid + str(user.pk) + '/' + str(userToken)
            }

            BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

            TEMPLATE_DIR = BASE_DIR + "/core/templates"

            emailTemplate = TEMPLATE_DIR + '/email.html'
            print("message set up")
            print("begin writing message")
            message = get_template(emailTemplate).render(ctx)
            msg = EmailMessage(mail_subject, message, to=[to_email])
            msg.content_subtype = 'html'
            msg.send()
            print("message sent")
            # EmailThread(mail_subject, message, to_email).start()
            # user.password =''

            return user
        except(User.DoesNotExist):
            return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class SignUpSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    def create(self, validated_data):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     SignUpSerializer.create !!!!!!!!!!!!!!!!!!!!!!!!!!")

        try:

            user = User.objects.create_user(email=validated_data['email'],
                                            password=validated_data['password'],
                                            username=validated_data['username'],
                                            first_name=validated_data['first_name'],
                                            last_name=validated_data['last_name'])
            # user = User(email=validated_data['email'], username=validated_data['username'],first_name = validated_data['first_name'],last_name = validated_data['last_name'])
            # user.set_password(validated_data['password'])
            user.is_active = False
            user.save()
            # print user

            profile = Profile.objects.get(user=user.id)
            profile.industry = self.context.get("industry")
            profile.companyName = self.context.get("companyName")
            profile.companyRole = self.context.get("companyRole")
            profile.email = validated_data['email']
            profile.save()

            # If Signup Token under main account, add to Company.
            inviteToken = self.context.get("signupToken")

            host = self.context.get("host")

            if inviteToken:
                try:
                    inviteObj = Invitation.objects.get(uniqueToken=inviteToken)
                    company = Company.objects.get(pk=inviteObj.company_id)

                    company.users.add(user)
                    company.save()

                    user.profile.companyProfile = company
                    user.profile.save()
                    user.save()

                except Exception as e:
                    print(e)
            else:
                print("Test Prod")

            mail_subject = 'XSPACE | Account Activation'  # '+str(current_site)+'
            uuid = str(urlsafe_base64_encode(force_bytes(user.pk)))

            userToken = account_activation_token.make_token(user)
            # print userToken
            # message = '<b>Hello '+user.first_name+" "+user.last_name+'</b><br> Please activate your XSPACE account by clicking the link below.'+'<br><a href="http://app.xspaceapp.com/#/useractivate/'+uuid+str(user.pk)+'/'+str(userToken)+'">Activation Link</a>'
            to_email = str(validated_data['email'])
            ctx = {
                'subject': 'XSPACE | Account Activation',
                'first_name': user.first_name,
                'last_name': user.last_name,
                'activation_link': 'http://' + host + '/#/useractivate/' + uuid + str(user.pk) + '/' + str(userToken)
            }
            message = get_template('email.html').render(ctx)
            msg = EmailMessage(mail_subject, message, to=[to_email])
            msg.content_subtype = 'html'
            msg.send()

            # EmailThread(mail_subject, message, to_email).start()

            user.password = ''
            return user
        except(User.DoesNotExist):
            return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')


class SendInvitationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    def create(self, validated_data):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     SendInvitationSerializer.create !!!!!!!!!!!!!!!!!!!!!!!!!!")

        try:
            print((validated_data['first_name']))
            print((validated_data['last_name']))
            print((validated_data['email']))
            return Invitation
        except:
            print('error')
            return Invitation

    class Meta:
        model = Invitation
        fields = ('firstName', 'lastName', 'emailId', 'senderEmail')


class InvitationSerializer(serializers.ModelSerializer):
    newCompanyName = serializers.SerializerMethodField('get_parent_name')

    def get_parent_name(self, obj):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     get_parent_name.create !!!!!!!!!!!!!!!!!!!!!!!!!!")

        parent = Company.objects.get(id=obj.company.id)

        return parent.companyName

    class Meta:
        model = Invitation
        fields = ('firstName', 'lastName', 'emailId', 'senderEmail', 'newCompanyName')


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email')


class CompanyPreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('id', 'uniqueID', 'companyName')


class CompanyDetailSerializer(serializers.ModelSerializer):
    # companyEmail = UserEmailSerializer(read_only=True)
    users = UserDetailsSerializer(read_only=True, many=True)
    mainAddress = AddressSerializer(read_only=True, many=False)

    class Meta:
        model = Company
        fields = ('id', 'uniqueID', 'createdDate', 'companyName', 'companyEmail', 'companyPhoneNumber',
                  'companyLogoURL', 'companyWebsiteURL', 'mainAddress', 'industry', 'users', 'products', 'orders',
                  'addresses', 'max_users_allowed', 'max_storage_size', 'current_storage_size', 'subscription_id')

        def get_company_object(self, companyID):
            print(
                "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     CompanyDetailSerializer.get_company_object !!!!!!!!!!!!!!!!!!!!!!!!!!")
            try:
                return Company.objects.get(id=companyID)
            except Company.DoesNotExist:
                return ""


class CompanyUpdateSerializer(serializers.ModelSerializer):
    companyName = serializers.CharField(required=False, allow_blank=False, allow_null=True)
    companyEmail = serializers.CharField(required=False, allow_blank=False, allow_null=True)
    companyLogoURL = serializers.CharField(required=False, allow_blank=False, allow_null=True)
    companyWebsiteURL = serializers.CharField(required=False, allow_blank=False, allow_null=True)
    companyPhoneNumber = serializers.CharField(required=False, allow_blank=False, allow_null=True)
    industry = serializers.CharField(required=False, allow_blank=False, allow_null=True)
    mainAddress = AddressSerializer(many=False, required=False)

    def update(self, instance, validated_data):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     CompanyUpdateSerializer.update !!!!!!!!!!!!!!!!!!!!!!!!!!")
        if validated_data["companyName"] != "No Company Name" and validated_data["companyName"] is not None and validated_data["companyName"] != '':
            instance.companyName = validated_data["companyName"]
        if validated_data["companyEmail"] != "No Company Email" and validated_data["companyEmail"] is not None and validated_data["companyEmail"] != '':
            instance.companyEmail = validated_data["companyEmail"]
        if validated_data["companyWebsiteURL"] != "No Company Website" and validated_data["companyWebsiteURL"] is not None and validated_data["companyWebsiteURL"] != '':
            instance.companyWebsiteURL = validated_data["companyWebsiteURL"]
        if validated_data["companyPhoneNumber"] != 'No Company Phone Number' and validated_data["companyPhoneNumber"] is not None and validated_data["companyPhoneNumber"] != '':
            instance.companyPhoneNumber = validated_data["companyPhoneNumber"]
        if validated_data["industry"] != "No Company Industry" and validated_data["industry"] is not None and validated_data["industry"] != '':
            instance.industry = validated_data["industry"]

        instance.save()
        print("instance.mainAddress", instance.mainAddress)

        # check if the address exists if not, then we'll go ahead and create a new one that we'll throw all the
        # info into
        try:
            address_object = Address.objects.get(id=instance.mainAddress)
            existingAddress = True
        except:
            existingAddress = False

        if validated_data["mainAddress"]["address1"] != 'No Address 1' and\
                validated_data["mainAddress"]["address1"] is not None and\
                validated_data["mainAddress"]["address1"] != '':
            address1 = validated_data["mainAddress"]["address1"]
            if existingAddress:
                address_object.address1 = address1
        else:
            address1 = validated_data["mainAddress"]["address1"]
        if validated_data["mainAddress"]["address2"] != 'No Address 2' and\
                validated_data["mainAddress"]["address2"] is not None and\
                validated_data["mainAddress"]["address2"] != '':
            address2 = validated_data["mainAddress"]["address2"]
            if existingAddress:
                address_object.address2 = address2
        else:
            address2 = validated_data["mainAddress"]["address2"]
        if validated_data["mainAddress"]["poBoxNum"] != 'No PO Box Num' and\
                validated_data["mainAddress"]["poBoxNum"] is not None and\
                validated_data["mainAddress"]["poBoxNum"] != '':
            poBoxNum = validated_data["mainAddress"]["poBoxNum"]
            if existingAddress:
                address_object.poBoxNum = poBoxNum
        else:
            poBoxNum = validated_data["mainAddress"]["poBoxNum"]
        if validated_data["mainAddress"]["city"] != 'No City' and\
                validated_data["mainAddress"]["city"] is not None and\
                validated_data["mainAddress"]["city"] != '':
            city = validated_data["mainAddress"]["city"]
            if existingAddress:
                address_object.city = city
        else:
            city = validated_data["mainAddress"]["city"]
        if validated_data["mainAddress"]["state"] != 'No State' and\
                validated_data["mainAddress"]["state"] is not None and\
                validated_data["mainAddress"]["state"] != '':
            state = validated_data["mainAddress"]["state"]
            if existingAddress:
                address_object.state = state
        else:
            state = validated_data["mainAddress"]["state"]
        if validated_data["mainAddress"]["zipcode"] != 'No Zip Code' and\
                validated_data["mainAddress"]["zipcode"] is not None and\
                validated_data["mainAddress"]["zipcode"] != '':
            zipcode = validated_data["mainAddress"]["zipcode"]
            if existingAddress:
                address_object.zipcode = zipcode
        else:
            zipcode = validated_data["mainAddress"]["zipcode"]
        if validated_data["mainAddress"]["country"] != 'No Country' and\
                validated_data["mainAddress"]["country"] is not None and\
                validated_data["mainAddress"]["country"] != '':
            country = validated_data["mainAddress"]["country"]
            if existingAddress:
                address_object.country = country
        else:
            country = validated_data["mainAddress"]["country"]

        if existingAddress:
            address_object.save()
        else:
            instance.mainAddress = Address.objects.create(address1=address1, address2=address2, poBoxNum=poBoxNum,
                                                          city=city, state=state, zipcode=zipcode, country=country)
            instance.save()

        return instance

    class Meta:
        model = Company
        fields = ('companyName', 'companyEmail', 'companyLogoURL', 'companyWebsiteURL', 'companyPhoneNumber',
                  'industry', 'mainAddress')


class UserProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(required=True)
    userPosition = serializers.CharField(required=False)
    companyProfile = serializers.SerializerMethodField('get_company_object')
    companyName = serializers.CharField(required=False)
    companyRole = serializers.CharField(required=False)
    phoneNum = serializers.CharField(required=False)
    addresses = serializers.SerializerMethodField('get_address_object')
    industry = serializers.CharField(required=False)

    def create_profile(self, validated_data):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     UserProfileSerializer.create_profile !!!!!!!!!!!!!!!!!!!!!!!!!!")
        try:
            print(validated_data)
            profile = Profile.objects.get(user_id=validated_data['user_id'])
            step = validated_data.pop('step')
            if step == 2:
                profile.industry = validated_data['industry'] if 'industry' in validated_data else 'None'
                profile.companyName = validated_data[
                    'companyName'] if 'last_name' in validated_data else 'No Company Name'
                profile.companyRole = validated_data[
                    'companyRole'] if 'companyRole' in validated_data else 'No Company Role'
                profile.save()
        except:
            profile = None
        return profile

    def get_address_object(self, obj):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     UserProfileSerializer.get_address_object !!!!!!!!!!!!!!!!!!!!!!!!!!")

        try:
            return obj.addresses
        except Address.DoesNotExist:
            return ""

    def get_company_object(self, obj):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     UserProfileSerializer.get_company_object !!!!!!!!!!!!!!!!!!!!!!!!!!")

        try:
            return obj.companyProfile
        except Company.DoesNotExist:
            return ""

    class Meta:
        model = Profile
        fields = ('user_id', 'userPosition', 'companyProfile', 'companyName', 'companyRole', 'phoneNum',
                  'addresses', 'industry')


'''
class ResetPasswordSerializer(serializers.ModelSerializer):

    def create_reset_password(self, validated_data):
        try:
            email = self.context.get("email")
            user = User.objects.get(email=email)
            if user is not None:
                return user
            else:
                raise ValidationError("No such user exists.")
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
            raise ValidationError("No such user exists.")

    class Meta:
        model = User
        fields = ('id','email')
        read_only_fields = ['email']
'''


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ('user', 'perm', 'company', 'created')

    def get_permission_objects(self, pid):
        print(
            "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     PermissionSerializer.get_permission_objects !!!!!!!!!!!!!!!!!!!!!!!!!!")
        try:
            return Permission.objects.filter(user=pid)
        except Permission.DoesNotExist:
            return ""


class AssignPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionAssignment
        fields = ('assigner', 'permission')

    def create(self, validated_data):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     AssignPermissionSerializer.create !!!!!!!!!!!!!!!!!!!!!!!!!!")

        data = self.context.get("data")
        print(data)
        permission = Permission.objects.create(user=User.objects.get(pk=data['user']), perm=data['perm'],
                                               company=Company.objects.get(pk=data['company']))
        return PermissionAssignment.objects.create(assigner=validated_data['assigner'], permission=permission)

    def get_assignment_object(self, pid):
        print(
            "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     AssignPermissionSerializer.get_assignment_object !!!!!!!!!!!!!!!!!!!!!!!!!!")

        try:
            return PermissionAssignment.objects.get(permission=pid)
        except PermissionAssignment.DoesNotExist:
            return ""


class UserActivateSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     UserActivateSerializer.create !!!!!!!!!!!!!!!!!!!!!!!!!!")

        try:
            uid = self.context.get("uid")
            # print("=========>UID", uid)
            user = User.objects.get(pk=uid)
            # print("==============>>USER", user)
            token = self.context.get("token")
            print("============>>Token", token)
            request = self.context.get("request")
            profile = Profile.objects.get(user=user.id)

            if user is not None:
                if account_activation_token.check_token(user, token):

                    # Mark User As Active If Token Valid
                    user.is_active = True
                    user.save()

                    # TODO: [BACKEND][Dom] Add password and confirm check for backend. Front end validation for now.
                    pw = request.data['password']
                    # cpw = request.data['confirmPassword']
                    companyName = request.data['companyName']
                    companySubDomain = request.data['companySubDomain']
                    email = user.email

                    # Set New User Password
                    user.set_password(str(pw))
                    user.save()

                    OnBoarding.objects.create(user=user)

                    # Invited User
                    # If Company profile is present, mark user as a member of a preexisiting,
                    #    otherwise, make the user's company.
                    if profile.companyProfile is not None:
                        # TODO: if the company does not match the company that invited the user, then the user is a
                        #  contractor need one more piece of information from the frontend on which type of user we are bringing in
                        # Added Profile Flag
                        existingCompanyNewUserPermissions = [P.GENERIC,
                                                             P.CREATE_ORDER, P.UPDATE_ORDER, P.DELETE_ORDER,
                                                             P.CREATE_PRODUCT, P.UPDATE_PRODUCT, P.DELETE_PRODUCT,
                                                             P.CREATE_PRODUCTASSET, P.UPDATE_PRODUCTASSET,
                                                             P.DELETE_PRODUCTASSET, P.VIEW_ORG_PRODUCT_LIST]

                        company = Company.objects.get(companyName=str(companyName))

                        profile.isCompanyAdmin = False
                        for p in existingCompanyNewUserPermissions:
                            permission = Permission.objects.create(user=user,
                                                                   perm=p,
                                                                   company=company)
                            permission.save()
                            print("applied ", p, "permission")

                    # New Company and New User
                    else:
                        newCompanyNewUserPermissions = [P.ALL, P.GENERIC, P.CREATE_ORDER, P.UPDATE_ORDER,
                                                        P.DELETE_ORDER, P.CREATE_CATEGORY, P.UPDATE_CATEGORY,
                                                        P.DELETE_CATEGORY, P.CREATE_TAG, P.UPDATE_TAG, P.DELETE_TAG,
                                                        P.CREATE_PRODUCT, P.UPDATE_PRODUCT, P.DELETE_PRODUCT,
                                                        P.CREATE_PRODUCTASSET, P.UPDATE_PRODUCTASSET,
                                                        P.DELETE_PRODUCTASSET, P.CREATE_APPLICATION,
                                                        P.UPDATE_APPLICATION, P.DELETE_APPLICATION, P.CHANGE_API_KEY,
                                                        P.VIEW_ORG_PRODUCT_LIST, P.CREATE_A_SHIPPING_METHOD,
                                                        P.UPDATE_A_SHIPPING_METHOD]

                        # Added Profile Flag
                        profile.isCompanyAdmin = True
                        profile.save()
                        print("made it to the user creation")
                        # Company Creation
                        company = Company.objects.create(companyName=str(companyName), companyEmail=user.email)
                        company.users.add(user)

                        # let's get a valid slug
                        while True:
                            random_string = lambda n: ''.join(
                                [random.choice(string.ascii_lowercase + string.digits) for i in range(n)])
                            random_string_slug = random_string(10)
                            try:
                                # test if this slug exists
                                temp_object = Product.objects.get(slug=random_string_slug)
                                # print("slug exists", random_string_slug)
                                continue
                            except:
                                # print("slug does not exist, let's use it")
                                break

                        company.slug = random_string_slug
                        company.save()
                        print("created company")
                        for p in newCompanyNewUserPermissions:
                            permission = Permission.objects.create(user=user,
                                                                   perm=p,
                                                                   company=company)
                            permission.save()
                            print("applied ", p, "permission")
                        # print(company.users)
                        print("applied permissions")
                        profile.companyProfile = company
                        profile.email = email
                        profile.save()
                        print("created profile")
                        try:
                            print("creating chargebee")
                            chargebee_obj = ChargebeeAPI(request)
                            chargebee_obj.migrateExisting(request, user, company)
                            try:
                                zendesk_obj = ZendeskAPI(request)
                                zendesk_obj.createZendeskOrganization(company, user)
                                zendesk_obj.createZendeskUser(user)
                            except:
                                print("did not create zendeskID for user")

                            chargebee_obj.create_customer(request, user, company)
                            chargebee_obj.create_Subscription(request, company)
                            print("created chargebee")
                        except:
                            print("chargebee not created")

                else:
                    # new_token = account_activation_token.make_token(user)
                    # check_new_token = account_activation_token.check_token(user,str(new_token));
                    raise ValidationError("It appears you have an invalid token.")  # str(token)+" "+str(new_token)
            else:
                raise ValidationError("Fail to activate your account.")

            return User.objects.get(pk=uid)
        except Exception as e:
            print(e)
            return User.objects.get(pk=uid)

    class Meta:
        model = User
        fields = ('id', 'is_active')


class WhiteLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhiteLabel
        fields = ('id', 'name', 'company', 'logoUrl', 'backgroundColor', 'foregroundColor1', 'foregroundColor2',
                  'buttonColor1', 'buttonColor2')


class OnBoardSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField('calculateProgress')

    def calculateProgress(self, obj):
        dictfilt = lambda x, y: dict([(i, x[i]) for i in x if i in set(y)])

        wanted_keys = dictfilt(obj.as_json(), ('create_product_man', 'create_product_excel', 'create_product_3rd_party',
                                               'create_standard', 'create_order', 'create_qr', 'create_tracking',
                                               'download_images', 'upload_images', 'create_comment', 'share_file',
                                               'add_phone', 'add_team', 'share_team', 'add_billing', 'add_address'))
        i = 0
        for value in wanted_keys.values():
            i = i + (0, 1)[value]
        wanted_keysA = dictfilt(obj.as_json(), ('create_product_man', 'create_product_excel',
                                                'create_product_3rd_party'))
        wanted_keysB = dictfilt(obj.as_json(), ('create_standard', 'create_order', 'create_qr', 'create_tracking'))
        wanted_keysC = dictfilt(obj.as_json(), ('download_images', 'upload_images', 'share_file'))
        wanted_keysD = dictfilt(obj.as_json(), ('create_comment', 'add_phone', 'add_team', 'share_team'))

        A = any(value is True for value in wanted_keysA.values())
        B = all(value is True for value in wanted_keysB.values())
        C = all(value is True for value in wanted_keysC.values())
        D = all(value is True for value in wanted_keysD.values())

        Sum = int(A) + int(B) + int(C) + int(D)

        print((i / len(wanted_keys)))
        print(Sum / 4)

        return {"percent": int((((i / len(wanted_keys)) + (Sum / 4)) / 2) * 100), "enabled": [A, B, C, D]}

    class Meta:
        model = OnBoarding
        fields = ('id', 'user', 'create_product_man', 'create_product_excel', 'create_product_3rd_party',
                  'create_standard', 'create_order', 'create_qr', 'create_tracking', 'download_images',
                  'upload_images', 'create_comment', 'share_file', 'add_phone', 'add_team', 'share_team',
                  'add_billing', 'add_address', 'skip', 'progress')


def get_all_prods_for_sub_companies(company):
    firstProds = list(Product.objects.filter(company=company))
    subComp = Company.objects.filter(parentCompany=company)
    all_prods = []
    all_prods = firstProds
    try:
        for comp in subComp:
            if comp.id == company.id:
                continue
            else:
                all_prods = all_prods + get_all_prods_for_sub_companies(comp)
    except:
        return all_prods
    return all_prods


class UploadProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'uniqueID', 'name', 'upccode', 'SKU', 'slug')


class UserDetailSerializer(serializers.ModelSerializer):
    userid = serializers.SerializerMethodField('get_user_id')
    email = serializers.SerializerMethodField('get_user_email')
    firstname = serializers.SerializerMethodField('get_fname')
    lastname = serializers.SerializerMethodField('get_lname')
    fullName = serializers.SerializerMethodField('get_full_name')
    userName = serializers.SerializerMethodField('get_username')
    companyRole = serializers.SerializerMethodField('get_role')
    companyName = serializers.CharField(read_only=True)
    companySlug = serializers.SerializerMethodField('get_company_slug')
    companyProfile = CompanySerializer(read_only=True)
    phoneNum = serializers.SerializerMethodField('get_phone_num')
    # companyProfile = serializers.SerializerMethodField('get_company_object')
    profileURL = serializers.SerializerMethodField('get_profilepic')
    # addresses = serializers.SerializerMethodField('get_address_object')
    addresses = AddressSerializer(read_only=True)
    productCount = serializers.SerializerMethodField('get_user_product_count')
    permissions = serializers.SerializerMethodField('get_user_permissions')
    whitelabel = serializers.SerializerMethodField('get_user_whitelabel')
    onboarding = serializers.SerializerMethodField('get_user_onboard')
    notifs = serializers.SerializerMethodField('get_notifications')
    compliance = serializers.SerializerMethodField('get_user_product_compliance')

    def get_notifications(self, obj):
        # Get All Notifications for User
        # request = self.context.get("request")
        user = obj
        try:

            notifs = Notification.objects.filter(recipient=user)
            unreadNotifs = Notification.objects.filter(recipient=user, unread=True)
            unreadCount = user.notifications.unread().count()

            data = {'unreadCount': unreadCount, 'notifications': list(notifs.values()),
                    'unread_notifications': list(unreadNotifs.values())}

            return data
        except:
            return {}

    def get_user_onboard(self, obj):
        try:
            onboard = OnBoarding.objects.get(user=obj.pk)
            serializer = OnBoardSerializer(onboard, many=False)
            data = serializer.data
            return data
        except OnBoarding.DoesNotExist:
            onboard = OnBoarding.objects.create(user=obj)
            serializer = OnBoardSerializer(onboard, many=False)
            data = serializer.data
            return data
        except:
            return {}

    def get_user_whitelabel(self, obj):

        prof = Profile.objects.get(user=obj)
        # print (prof.companyProfile_id)
        company = Company.objects.get(pk=prof.companyProfile.id)

        print(company.id)

        try:

            w = WhiteLabel.objects.get(company_id=company.id)
            if ((isinstance(w, WhiteLabel))):
                data = {"name": w.name, "logo": w.logoUrl, "backgroundColor": w.backgroundColor,
                        "foreground1": w.foregroundColor1, "foreground2": w.foregroundColor2,
                        "buttonColor1": w.buttonColor1, "buttonColor2": w.buttonColor2}
                return data
            else:
                return {}
        except:
            return {}

    def get_user_permissions(self, obj):
        p = Permission.objects.filter(user_id=obj.id)
        x = []
        for i in p:
            x.append(i.perm)
        return x

    def get_user_id(self, obj):
        return obj.id

    def get_user_email(self, obj):
        return obj.email

    def get_fname(self, obj):
        return obj.first_name

    def get_username(self, obj):
        return obj.username

    def get_lname(self, obj):
        return obj.last_name

    def get_profilepic(self, obj):
        prof = Profile.objects.get(user=obj)
        return prof.profileURL

    def get_phone_num(self, obj):
        prof = Profile.objects.get(user=obj)
        return prof.phoneNum

    def get_role(self, obj):
        prof = Profile.objects.get(user=obj)
        return prof.companyRole

    def get_full_name(self, obj):
        return str(obj.first_name) + ' ' + str(obj.last_name)

    def get_user_product_count(self, obj):
        try:
            prof = Profile.objects.get(user=obj)
            comp = prof.companyProfile
            prodList = get_all_prods_for_sub_companies(comp)
            return len(prodList)
        except Exception as e:
            print(e)
            return "0"

    def get_user_product_compliance(self, obj):
        try:
            prof = Profile.objects.get(user=obj)
            comp = prof.companyProfile
            prodList = get_all_prods_for_sub_companies(comp)
            total = len(prodList)
            violations = 0
            standard = ContentStandard.objects.get(name="Default")
            for prod in prodList:
                if prod.get2DassetCompliance(standard) == []:
                    continue
                else:
                    violations = violations + 1

            return ((total - violations) / total) * 100
        except Exception as e:
            print(e)
            return "0"

    def get_address_object(self, obj):
        try:
            prof = Profile.objects.get(user=obj)
            return prof.addresses
        except Address.DoesNotExist:
            return "No Addresses Found"

    def get_company_object(self, obj):
        try:
            prof = Profile.objects.get(user=obj)
            return prof.companyProfile
        except Company.DoesNotExist:
            return ""

    def get_company_slug(self, obj):
        try:
            prof = Profile.objects.get(user=obj)
            return prof.companyProfile.slug
        except Company.DoesNotExist:
            return ""

    class Meta:
        model = Profile
        fields = ['userid', 'email', 'firstname', 'lastname', 'fullName', 'userName', 'profileURL', 'phoneNum',
                  'companyProfile', 'companyName', 'companySlug', 'companyRole', 'addresses', 'productCount',
                  'permissions', 'whitelabel', 'notifs', 'onboarding', 'compliance']


class UserDetailInternalSerializer(serializers.ModelSerializer):
    userid = serializers.SerializerMethodField('get_user_id')
    email = serializers.SerializerMethodField('get_user_email')
    firstname = serializers.SerializerMethodField('get_fname')
    lastname = serializers.SerializerMethodField('get_lname')
    fullName = serializers.SerializerMethodField('get_full_name')
    userName = serializers.SerializerMethodField('get_username')
    phoneNum = serializers.CharField(read_only=True)
    companyRole = serializers.CharField(read_only=True)
    # companyProfile = CompanySerializer(read_only=True)
    companyProfile = serializers.SerializerMethodField('get_company_object')
    profileURL = serializers.CharField(read_only=True)

    # addresses = serializers.SerializerMethodField('get_address_object')

    def get_user_id(self, obj):
        return obj.id

    def get_user_email(self, obj):
        return obj.email

    def get_fname(self, obj):
        return obj.first_name

    def get_username(self, obj):
        return obj.username

    def get_lname(self, obj):
        return obj.last_name

    def get_full_name(self, obj):
        return str(obj.first_name) + ' ' + str(obj.last_name)

    def get_user_product_count(self, obj):
        try:
            return Product.objects.filter(profile=obj).count()
        except:
            return "0"

    def get_address_object(self, obj):
        try:
            return obj.addresses
        except Address.DoesNotExist:
            return ""

    def get_company_object(self, obj):
        try:
            return obj.companyProfile
        except Company.DoesNotExist:
            return ""

    class Meta:
        model = Profile
        fields = ['userid', 'email', 'firstname', 'lastname', 'fullName', 'userName', 'profileURL', 'phoneNum',
                  'companyProfile', 'companyName', 'companyRole', ]


class UserDetailOrderSerializer(serializers.Serializer):
    userid = serializers.SerializerMethodField('get_user_id')
    email = serializers.SerializerMethodField('get_user_email')
    firstname = serializers.SerializerMethodField('get_fname')
    lastname = serializers.SerializerMethodField('get_lname')
    fullName = serializers.SerializerMethodField('get_full_name')
    userName = serializers.SerializerMethodField('get_username')
    companySlug = serializers.SerializerMethodField('get_companyslug')

    def get_user_id(self, obj):
        return obj.id

    def get_user_email(self, obj):
        return obj.email

    def get_fname(self, obj):
        return obj.first_name

    def get_username(self, obj):
        return obj.username

    def get_lname(self, obj):
        return obj.last_name

    def get_full_name(self, obj):
        return str(obj.first_name) + ' ' + str(obj.last_name)

    def get_companyslug(self, obj):
        try:
            profile = Profile.objects.get(user=obj)
            companyslug = profile.companyProfile.slug
            return companyslug
        except:
            return None

    class Meta:
        model = Profile
        fields = ['userid', 'email', 'firstname', 'lastname', 'fullName', 'userName', 'profileURL', 'companySlug']


class PasswordTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordToken
        fields = ['user', 'token', 'date', 'time', 'active_status']


class GenericNotificationRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        if isinstance(value, User):
            serializer = UserDetailSerializer(value)
            return serializer.data


class NotificationSerializer(serializers.Serializer):
    id = serializers.IntegerField(label='ID', read_only=True)
    recipient = UserDetailSerializer(User, read_only=True)
    verb = serializers.CharField(read_only=True, required=False)
    unread = serializers.BooleanField(read_only=True)
    target = GenericNotificationRelatedField(read_only=True)
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", required=False, read_only=True)
    actor_object_id = serializers.CharField(read_only=True, required=False)
    actor_content_type = serializers.PrimaryKeyRelatedField(queryset=ContentType.objects.all())

    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'verb', 'unread', 'target', 'timestamp', 'actor_object_id', 'actor_content_type', ]
