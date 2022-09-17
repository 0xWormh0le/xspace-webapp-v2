from django.conf.urls import url, include, handler404
from django.urls import path
from django.conf.urls.static import static
from xapi.settings import LOCAL_STORAGE_LOCATION, LOCAL_STORAGE_URL, USE_LOCAL_STORAGE
from rest_framework import routers
import app.accounts.views as views
from rest_framework.authtoken import views as rest_framework_views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from rest_framework import routers

urlpatterns = [
    url(r"^userpermissionassignment/$", views.UserPermissionAssignment.as_view(),
        name="api_user_permission_assignment"),
    url(r"^usercheck/$", views.UserCheck.as_view(), name="api_usercheck"),
    url(r"^resetpassword/$", views.ResetPassword.as_view(), name="api_reset_password"),
    url(r"^resetchangepassword/$", views.ResetChangePassword.as_view(), name="api_reset_set_password"),
    url(r"^activatepassword/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[-\w]+)/$", views.ActivateResetPassword.as_view(),
        name="activatepass"),
    url(r"^user_list/$", views.UserList.as_view(), name="api_user"),
    url(r"^password_token/$", views.PasswordTokenView.as_view(), name="api_password_token"),
    url(r"^user_email/$", views.UserDetail.as_view(), name="api_user"),
    url(r"^user_pass/$", views.PassDetail.as_view(), name="api_pass"),
    url(r"^wLabels/$", views.WhiteLabelView.as_view(), name="api_white_label"),
    url(r"^onboard/$", views.OnboardView.as_view(), name="api_onboard"),
    # url(r"^user_fullname/$", views.NameDetail.as_view(), name="api_fullname"),
    # url(r"^user_rolephone/$", views.RolePhoneDetail.as_view(), name="api_rolephone"),
    url(r"^user_profilepic/$", views.ProfilePicUrlDetail.as_view(), name="api_prpfilepic"),
    url(r"^company_profilepic/$", views.CompanyProfilePicUrlDetail.as_view(), name="api_comppfilepic"),
    # # url(r"^user_list/i/$", views.UserDetail.as_view(), name="api_user"),
    url(r"^useractivate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[-\w]+)/$", views.UserActivate.as_view(),
        name="activate"),
    url(r"^company_pw_activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[-\w]+)/$",
        views.UserActivateCompanyAndPassword.as_view(), name="activate_company_password"),
    url(r"^join_account/$", views.JoinInvitation.as_view(), name="join_account"),
    url(r"^join_account_signup/(?P<token>[0-9A-Za-z_\-]+)/$", views.InviteeSignup.as_view(),
        name="join_account_signup"),
    url(r'^companylist/$', views.CompanyListAPIView.as_view(), name='api_company_list'),
    url(r'^companies/$', views.CompanyAPI.as_view(), name='api_company'),
    url(r'^companies/(?P<uidb64>[0-9A-Za-z_\-]+)/$', views.CompanyAPI.as_view(), name='api_company_detail'),
    url(r'^company/$', views.CompanyDetailAPI.as_view(), name='api_company_users'),
    url(r'^address/$', views.AddressAPI.as_view(), name='api_company'),
    url(r'^address/(?P<uidb64>[0-9A-Za-z_\-]+)/$', views.AddressAPI.as_view(), name='api_address_detail'),
    # url(r'^company/$', views.CompanyDetailAPI.as_view(), name='api_company_users'),
    url(r"^billing_summary/$", views.BillingSummaryAPI.as_view(), name="billing_summary"),
    url(r"^billing_portal/$", views.BillingPortalAPI.as_view(), name="billing_upgrade"),
    url(r"^billing_check/$", views.BillingCheck.as_view(), name="billing_check"),
    url(r"^download_invoicepdf/$", views.DownloadInvoicePDf.as_view(), name="billing_invoice"),
    url(r'^account/get_auth_token/$', rest_framework_views.obtain_auth_token, name='get_auth_token'),
    url(r'^auth/token/obtain/$', TokenObtainPairView.as_view(), name='token_obtain'),
    url(r'^auth/token/refresh/$', TokenRefreshView.as_view(), name='token_refresh'),
    url(r'^auth/token/verify/$', TokenVerifyView.as_view(), name='token_verify'),
    url(r"^user/signup/$", views.UserSignupAPI.as_view(), name="user_signup_api"),
    url(r"^user/invitation/$", views.SendInvitation.as_view(), name="user_invitation_api"),
    url(r"^userprofile/$", views.UserProfileViewsSet.as_view(), name="UserProfileViewsSet"),
    # url(r"^profileimage/$",views.ProfileImage.as_view(), name="profileimage_api_view"),
]

if USE_LOCAL_STORAGE:
    # add statics
    urlpatterns += static(LOCAL_STORAGE_URL, document_root=LOCAL_STORAGE_LOCATION)
