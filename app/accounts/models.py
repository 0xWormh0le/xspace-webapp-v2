from django.db import models
from django.contrib.auth.models import BaseUserManager, Group, Permission, AbstractUser
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.shortcuts import render
from django.conf import settings
from django.utils import timezone
from django.template.defaultfilters import slugify
from django.db.models.signals import post_save
from django.dispatch import receiver
# from autoslug import AutoSlugField
# from app.orders.models import ContentStandard
from rest_framework.authtoken.models import Token
from random import randint
from .get_user import get_user
import uuid
from actstream import action
import os
from app.products.models import Product
from datetime import datetime
from django.utils.translation import ugettext_lazy as _
import ipdb
import random
import string
from app.products.utility import create_url_safe

try:
    import simplejson as json
except ImportError:
    import json

profilepicURL = ''
clientpicURL = ''


def convertdatetime(o):
    if isinstance(o, datetime):
        return o.__str__()


class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        newProfile = Profile.objects.create(user=user)
        newProfile.save()
        newToken = Token.objects.create(user=user)
        newToken.save()
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    # identifier = models.CharField(max_length=40, unique=False)
    # USERNAME_FIELD = 'username'
    # timezone = models.CharField(max_length=50, default='America/Chicago',null=True)
    # username = None
    # email = models.EmailField(('Email Address'), unique=True)
    # USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = ['email']
    zendeskid = models.CharField(max_length=120, blank=True, null=True, unique=True)

    def get_username(self):
        return self.email

    def __str__(self):  # __unicode__ Python 2
        return self.email

    objects = UserManager()

    fields = ('_all_',)

    class Meta:
        unique_together = ('email',)
        app_label = 'app'


# class User(AbstractUser):
#     identifier = models.CharField(max_length=40, unique=True)
#     #USERNAME_FIELD = 'username'
#     timezone = models.CharField(max_length=50, default='America/Chicago',null=True)
#     username = None
#     #email = models.EmailField(('Email Address'), unique=True)
#     #USERNAME_FIELD = 'email'
#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = []
#
#     def get_username(self):
#         return self.email
#
#     objects = UserManager()
#
#     fields = ('_all_',)
#
#     class Meta:
#         unique_together = ('email', )
#         app_label = 'app'

# class User(AbstractBaseUser, PermissionsMixin):
#     email = models.EmailField(unique=True, null=False)
#     username = AutoSlugField(populate_from='email', unique=True, db_index=True, always_update=True, null=True)
#     is_staff = models.BooleanField(
#         _('staff status'),
#         default=False,
#         help_text=_('Designates whether the user can log into this site.'),
#     )
#     is_active = models.BooleanField(
#         _('active'),
#         default=True,
#         help_text=_(
#             'Designates whether this user should be treated as active. '
#             'Unselect this instead of deleting accounts.'
#         ),
#     )
#     USERNAME_FIELD = 'email'
#     objects = UserManager()
#
#     def __str__(self):
#         return self.email
#
#     def get_full_name(self):
#         return self.email
#
#     def get_short_name(self):
#         return self.email
#
#     class Meta:
#         unique_together = ('email', )
#         app_label = 'app'


# ### Get Current User ####
def get_userval():
    user1 = get_user()
    return str(user1.user)


class Address(models.Model):
    # Model Reference Fields
    uniqueID = models.CharField(max_length=120, blank=True, unique=True, default=uuid.uuid4)
    address1 = models.CharField(max_length=150, default='No Address 1', null=True, blank=True)
    address2 = models.CharField(max_length=150, default='No Address 2', null=True, blank=True)
    poBoxNum = models.CharField(max_length=150, default='No PO Box #', null=True, blank=True)
    city = models.CharField(max_length=150, default='No City', null=True, blank=True)
    state = models.CharField(max_length=150, default='No State', null=True, blank=True)
    zipcode = models.CharField(max_length=150, default='No Zipcode', null=True, blank=True)
    country = models.CharField(max_length=150, default='No Country', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        verbose_name = "Address"
        verbose_name_plural = "Addresses"
        app_label = 'app'


class Company(models.Model):
    uniqueID = models.CharField(max_length=120, blank=True, unique=True, default=uuid.uuid4)
    createdDate = models.DateTimeField(auto_now_add=True, null=True)
    url_safe = models.CharField(max_length=120, blank=True)
    slug = models.SlugField(max_length=150, db_index=True, null=True)
    companyName = models.CharField(max_length=50, blank=True, unique=False, default='No Company Name', null=True, )
    companyEmail = models.CharField(max_length=50, blank=True, unique=False, default='No Company Email', null=True, )
    companyWebsiteURL = models.CharField(max_length=50, blank=True, default='No Company Website', null=True, )
    companyPhoneNumber = models.CharField(max_length=50, blank=True, default='No Company Phone Number', null=True, )
    companyLogoURL = models.CharField(max_length=200, blank=True, null=True, )
    industry = models.CharField(max_length=50, default='No Company Industry', null=True, blank=True)
    mainAddress = models.OneToOneField(Address, null=True, related_name='main_company_address', on_delete="PROTECT")
    addresses = models.ManyToManyField(Address, related_name='addresses')
    parentCompany = models.ForeignKey("app.Company", unique=False, null=True, on_delete='PROTECT')
    companyStandards = models.ForeignKey("app.ContentStandard", unique=False, null=True, on_delete='PROTECT')

    # Related
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='company_users')
    products = models.ManyToManyField('app.Product', related_name='company_products', blank=True)
    orders = models.ManyToManyField('app.Order', related_name='company_orders', blank=True)

    # Billing Models
    subscription_id = models.CharField(max_length=200, unique=False, null=True, default=uuid.uuid4)
    max_users_allowed = models.IntegerField(default=1, null=True)

    # Sizes in integers by MB
    max_storage_size = models.IntegerField(default=1, null=True)
    current_storage_size = models.IntegerField(default=0, null=True)

    zendeskid = models.CharField(max_length=120, blank=True, unique=True, default=uuid.uuid1)

    class Meta:
        verbose_name = "Company"
        verbose_name_plural = "Companies"
        app_label = 'app'

    def as_json(self):
        return dict(
            slug=self.slug,
            url_safe=self.url_safe,
        )

    def createSlug(self, request):
        # let's get a slug and test if it already exists, if so, let's grab a new one
        while True:
            random_string = lambda n: ''.join([random.choice(string.ascii_lowercase) for i in range(n)])
            random_string_slug = random_string(10)
            try:
                # test if this slug exists
                temp_object = Company.objects.get(slug=random_string_slug)
                # print("slug exists", random_string_slug)
                continue
            except:
                # print("slug does not exist, let's use it")
                break
        self.update({'slug': random_string_slug})
        self.update({'url_safe': create_url_safe(request.data['companyName'])})

    def update_storage(self):
        from app.products.models import Product, ProductAsset
        total_storage = 0
        products = Product.objects.filter(company=self.id)
        for p in products:
            productassets = ProductAsset.objects.filter(product=p.id, company=self.id)
            for pa in productassets:
                total_storage += pa.size
        # TODO: add in payment cycle if statement... so if they are over for two cycles then make it to where they
        #  cannot see their assets or host
        self.current_storage_size = total_storage

    def __str__(self):
        return self.uniqueID


class WhiteLabel(models.Model):
    name = models.CharField(max_length=50, null=False)
    company = models.ForeignKey(Company, max_length=150, unique=False, on_delete='PROTECT')
    logoUrl = models.URLField(max_length=150, null=False)
    backgroundColor = models.CharField(max_length=8, null=False)
    foregroundColor1 = models.CharField(max_length=8, null=False)
    foregroundColor2 = models.CharField(max_length=8, null=False)
    buttonColor1 = models.CharField(max_length=8, null=False, default="000000")
    buttonColor2 = models.CharField(max_length=8, null=False, default="000000")

    class Meta:
        managed = True
        verbose_name = "whitelabel"
        db_table = "whitelabel"
        ordering = ('name',)
        app_label = 'app'


class Permission(models.Model):
    user = models.ForeignKey(User, related_name='permission_user', on_delete='PROTECT', null=False)
    perm = models.CharField(max_length=150, null=False, default='ALL')
    company = models.ForeignKey(Company, related_name='permission_company', on_delete='PROTECT', null=True)
    created = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        managed = True
        verbose_name = "Permission"
        verbose_name_plural = "Permissions"
        db_table = "permission"
        app_label = 'app'


class OnBoarding(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='onboarding_user',
                             on_delete='PROTECT', null=False)
    create_product_man = models.BooleanField(default=False, blank=True)
    create_product_excel = models.BooleanField(default=False, blank=True)
    create_product_3rd_party = models.BooleanField(default=False, blank=True)
    create_standard = models.BooleanField(default=False, blank=True)
    create_order = models.BooleanField(default=False, blank=True)
    create_qr = models.BooleanField(default=False, blank=True)
    create_tracking = models.BooleanField(default=False, blank=True)
    download_images = models.BooleanField(default=False, blank=True)
    upload_images = models.BooleanField(default=False, blank=True)
    create_comment = models.BooleanField(default=False, blank=True)
    share_file = models.BooleanField(default=False, blank=True)
    add_phone = models.BooleanField(default=False, blank=True)
    add_team = models.BooleanField(default=False, blank=True)
    share_team = models.BooleanField(default=False, blank=True)
    add_billing = models.BooleanField(default=False, blank=True)
    add_address = models.BooleanField(default=False, blank=True)
    skip = models.BooleanField(default=False, blank=True)

    class Meta:
        managed = True
        verbose_name = "OnBoard"
        verbose_name_plural = "OnBoards"
        db_table = "onboard"
        app_label = 'app'

    def as_json(self):
        return dict(
            create_product_man=self.create_product_man,
            create_product_excel=self.create_product_excel,
            create_product_3rd_party=self.create_product_3rd_party,
            create_standard=self.create_standard,
            create_order=self.create_order,
            create_qr=self.create_qr,
            create_tracking=self.create_tracking,
            download_images=self.download_images,
            upload_images=self.upload_images,
            create_comment=self.create_comment,
            share_file=self.share_file,
            add_phone=self.add_phone,
            add_team=self.add_team,
            share_team=self.share_team,
            add_billing=self.add_billing,
            add_address=self.add_address,
            skip=self.skip,
        )


class PermissionAssignment(models.Model):
    assigner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='permissionassignment_assigner',
                                 on_delete='PROTECT', null=False)
    permission = models.ForeignKey(Permission, related_name='permissionassignment_permission',
                                   on_delete='PROTECT', null=False)

    class Meta:
        managed = True
        verbose_name = "PermissionAssignment"
        verbose_name_plural = "PermissionAssignments"
        db_table = "permissionassignment"
        app_label = 'app'


class Profile(models.Model):
    # This line is required. Links XSPACE User to a User model instance.
    # Contains email, first name, & credentials reference
    user = models.ForeignKey(User, null=True, related_name='profile', on_delete="PROTECT")
    companyProfile = models.ForeignKey(Company, null=True, related_name='company_profile', on_delete=None)
    first_name = models.CharField(max_length=120, blank=True)
    last_name = models.CharField(max_length=120, blank=True)
    email = models.EmailField(unique=True, null=True)
    # slug = AutoSlugField(populate_from='user', unique=True, db_index=True, always_update=True, null=True)
    uniqueID = models.CharField(max_length=120, blank=True, unique=True, default=uuid.uuid4)

    # USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = ['email']

    isCompanyAdmin = models.BooleanField(default=False, blank=True)

    # Date Time Fields
    timezone = models.CharField(max_length=50, default='America/Chicago', null=True)
    createdDate = models.DateTimeField(auto_now_add=True, null=True)
    industry = models.CharField(max_length=50, default='No Industry', null=True)

    # Profile Fields
    is_active = models.BooleanField(default=True, blank=True)
    profile_image_url = models.CharField(max_length=800, default='', null=True)  # s3 Location URL
    companyRole = models.CharField(max_length=150, default='No Company Role')
    userPosition = models.CharField(max_length=150, default='No Company Position')
    profileURL = models.CharField(max_length=800, default='', null=True)
    phoneNum = models.CharField(max_length=150, default='555-555-5555', null=True)

    # Multiple Address Field Objects.
    addresses = models.ManyToManyField('Address', related_name='profile_addresses')

    # Multiple Product Objects Field
    # userproducts = models.ManyToManyField('Product', related_name='userproducts')

    companyName = models.CharField(max_length=50, unique=False, default='No Company Name', null=True, )
    numOfProducts = models.IntegerField(default=0)
    newsletter = models.BooleanField(default=False, blank=True)

    # Two Factor Auth Settings
    two_factor_auth_enabled = models.BooleanField(default=False, blank=True)

    # Notification Settings
    email_notification_enabled = models.BooleanField(default=True, blank=True)
    sms_notification_enabled = models.BooleanField(default=False, blank=True)
    directMessage_notification_enabled = models.BooleanField(default=True, blank=True)
    catalogEdit_notification_enabled = models.BooleanField(default=False, blank=True)
    catalogReview_notification_enabled = models.BooleanField(default=False, blank=True)
    orderUpdate_notification_enabled = models.BooleanField(default=True, blank=True)

    # Billing Models
    subscription_id = models.CharField(max_length=200, unique=False, null=True)
    max_users_allowed = models.IntegerField(default=1, null=True)

    # Sizes in integers and by MB
    max_storage_size = models.IntegerField(default=1, null=True)
    current_storage_size = models.IntegerField(default=1, null=True)

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"
        app_label = 'app'

    def as_json(self):
        return dict(
            userPosition=self.userPosition,
            industry=self.industry,
            profileURL=self.profileURL,
            companyRole=self.companyRole,
            phoneNum=self.phoneNum,
            addresses=self.addresses,
            numOfProducts=self.numOfProducts,
            companyName=self.companyName
        )

    # Override the __unicode__() method to return out something meaningful!

    def setUserDirectory(self):
        self.rootDir = self.email + '/'

    def getNumOfProducts(self):
        f = Product.objects.all().filter(profile=self)
        f = f.count()
        return f

    def get_profilepic_url(self):
        if self.image:
            return self.image.url
        else:
            return settings.STATIC_URL + "/img/icons/user-plain.png"
        return profilepicURL

    def getCompanyName(self):
        string = str(self.companyName)
        string = slugify(string)
        return string.lower()

    # def get_absolute_url(self):
    # # 'user_profile' is from the code shown by catavaran above
    #     #return reverse('user_profile', args=[self.companyName])

    def getProfileURL(self):
        self.profileURL = self.getCompanyName()
        return self.profileURL

    def setSlug(self):
        self.slug = self.getCompanyName()

    def __str__(self):  # __unicode__ for Python 2
        return self.uniqueID


'''
---- User & Profile DATA MODELS ---- (START)
'''

'''
---- User Permission DATA MODELS ---- (START)
'''
READ = 'RD'
# PRIVATE = 'PR'
VIEW = 'VI'
Product_Permission = (
    # (PUBLIC, 'Public'),
    (READ, 'Read Only'),
    # (PRIVATE, 'Private'),
    (VIEW, 'View Only'),
)

# class UserProductPermission(models.Model):
#     P_product = models.ForeignKey(Product,null=True, unique=False, on_delete=None)
#     P_user = models.EmailField(max_length=70, null=True, blank=True, unique=False)#models.CharField(max_length=20)
#     P_check = models.CharField(max_length=20, null=True, unique=False, default='Leave This Field', editable=False)
#     P_permission = models.CharField(max_length=2, choices=Product_Permission, default=READ)
#
#     def __str__(self):
#         return str(self.P_user)
#
#     def save(self):
#         try:
#             UserProductPermission.objects.get(P_product=self.P_product, P_user=self.P_user)
#             UserProductPermission.objects.filter(P_product=self.P_product, P_user=self.P_user).update(P_permission=self.P_permission)
#
#         except UserProductPermission.DoesNotExist:
#             try:
#                 Chk_email = User.objects.get(email=self.P_user)
#                 self.P_check = 'User Exist'
#                 self.P_user = Chk_email
#                 #self.P_permission =
#                 super(UserProductPermission, self).save()
#             except User.DoesNotExist:
#                 self.P_check = 'User Not Exist'
#                 super(UserProductPermission, self).save()
#
#     class Meta:
#         app_label = 'app'


'''
---- User Permission DATA MODELS ---- (END)
'''


###############################Group User Permission For Product#########################################


# class AddGroup(models.Model):
#     #owner = models.ForeignKey(Profile, unique=False, on_delete=None)
#     group_name = models.CharField(max_length=40, null=False, unique=True)
#     permission = models.CharField(max_length=2, choices=Product_Permission, default=READ)
#     #product1 = models.ManyToManyField('Product', related_name='productche', blank=True)
#     #product = models.ForeignKey(Product, null=True, unique=False, on_delete=None) #.CharField(max_length=50, null=True, blank=True, unique=False)
#
#     def __str__(self):
#         if not self.product:
#             self.product = "None"
#             value = str(self.group_name) + " [ " + str(self.product) + " ]"
#         else:
#             value = str(self.group_name) + " [ " + str(self.product) + " ]"
#         return value
#
#     def save(self):
#         try:
#             AddGroup.objects.get(group_name=self.group_name)
#             AddGroup.objects.filter(group_name=self.group_name).update(permission=self.permission, product=self.product)
#         except AddGroup.DoesNotExist:
#             super(AddGroup, self).save()


# class AddUserToGroup(models.Model):
#     #group_name = models.ForeignKey(AddGroup, null=True, unique=False, on_delete=None)
#     user_name = models.EmailField(max_length=70, null=False, unique=False)
#
#     def __str__(self):
#         return str(self.user_name) + " / " + str(self.group_name)
#
#     def save(self):
#         try:
#             AddUserToGroup.objects.get(group_name=self.group_name, user_name=self.user_name)
#             error = "user already exist"
#             return error
#         except AddUserToGroup.DoesNotExist:
#             try:
#                 User.objects.get(email=self.user_name)
#                 try:
#                     UserProductPermission.objects.get(P_user=self.user_name,P_product=self.group_name.product)
#                     UserProductPermission.objects.filter(P_user=self.user_name,P_product=self.group_name.product).delete()
#                     super(AddUserToGroup, self).save()
#                 except UserProductPermission.DoesNotExist:
#                     super(AddUserToGroup, self).save()
#                     error = ""
#                     return error
#             except User.DoesNotExist:
#                 email = EmailMessage('Xspace User Error', 'You are not a Registered user. Please register', to=[self.user_name])
#                 email.send()
#                 error = "NO such user Exist"
#                 return error


# unique token , recipients first name , recipients last name , email address , senders email address ,
# company foreign key , date sent
class Invitation(models.Model):
    uniqueToken = models.CharField(max_length=120, blank=True, unique=True, default=uuid.uuid4)
    firstName = models.CharField(max_length=120, blank=True, default="None")
    lastName = models.CharField(max_length=120, blank=True, default="None")
    emailId = models.EmailField(max_length=70, null=True, blank=True, default="None", unique=False)
    senderEmail = models.EmailField(max_length=70, null=True, blank=True, default="None", unique=False)
    company = models.ForeignKey(Company, null=True, unique=False, on_delete="PROTECT")
    parent = models.ForeignKey(Company, related_name='parent', null=True, unique=False,
                               on_delete="PROTECT")

    dateTime = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        verbose_name = "Invite"
        verbose_name_plural = "Invitations"
        app_label = 'app'


# class SubContractorInvitation(models.Model):
#     uniqueToken = models.CharField(max_length=120, blank=True, unique=True, default=uuid.uuid4)
#     firstName = models.CharField(max_length=120, blank=True, default="None")
#     lastName = models.CharField(max_length=120, blank=True, default="None")
#     emailId = models.EmailField(max_length=70, null=True, blank=True, default="None", unique=False)
#     senderEmail = models.EmailField(max_length=70, null=True, blank=True, default="None", unique=False)
#     company = models.ForeignKey(Company, null=True, unique=False, on_delete="PROTECT")
#     parentCompany = models.ForeignKey(Company, related_name='parentCompany',null=True, unique=False, on_delete="PROTECT")
#     dateTime = models.DateTimeField(auto_now_add=True, null=True)
#
#     class Meta:
#         verbose_name = "Invite"
#         verbose_name_plural = "Invitations"
#         app_label = 'app'

class PasswordToken(models.Model):
    user = models.ForeignKey(User, null=True, unique=False, on_delete="PROTECT")
    token = models.CharField(blank=False, max_length=200)
    date = models.DateField(blank=False)
    time = models.TimeField(blank=False)
    active_status = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Password Token"
        verbose_name_plural = "Password Tokens"
        app_label = 'app'
