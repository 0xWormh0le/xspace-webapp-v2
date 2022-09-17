import ipdb
from zenpy import Zenpy
from zenpy.lib.api_objects import User as ZenUser, Organization as ZenOrganization, OrganizationField, Comment, Ticket
import zenpy.lib.exception
from app.core.utility import ZendeskAPI
from app.accounts.models import Company, User, Profile
class ZendeskAPI(object):

    def __init__(self):


        #VH42QknYkmM2dSv8LTgiWkCseODn1ZES58iLSM52
        # An OAuth token
        self.creds = {
            'email': 'c.richards@xspaceapp.com',
            'token': 'VH42QknYkmM2dSv8LTgiWkCseODn1ZES58iLSM52',
            'subdomain': 'xspaceapp'
        }

        self.zenpy_client = Zenpy(**self.creds)

        # if(request.META.get('HTTP_X_API_SUBDOMAIN')):
        #     self.subdomain = str(request.META['HTTP_X_API_SUBDOMAIN'])
        # else:
        #     self.subdomain = 'localhost:3000'

    def checkUsers(self, user):
        #TODO: [BACKEND][Dom] Add existing user check.

        x = self.zenpy_client.users(user)
        print(x.id)

    def usersOrganization(self, company, user):
            #TODO: [BACKEND][Dom] Add existing user check.
        # for user in zenpy_client.users():
        #     print(user.name)
        name = str(user.first_name)+' '+str(user.last_name)
        org = ZenOrganization(name=company.companyName)
        created_org = self.zenpy_client.organizations.create(org)

    def createZendeskUser(self, user):
        #TODO: [BACKEND][Dom] Add existing user check.
        # for user in zenpy_client.users():
        #     print(user.name)


        name = str(user.first_name)+' '+str(user.last_name)
        user = ZenUser(name=name, email=user.email)
        created_user = self.zenpy_client.users.create(user)

    def userOrgs(user):
        organization = self.zenpy_client.users.organizations(user)
        print(organization.name)

def runCompanyMigrate():
    companies = Company.objects.all()
    z = ZendeskAPI()
    for com in companies:
        if(com.zendeskid is '' or com.zendeskid is None):
                print("Org Not found for "+ com.companyName)
                orgDetails = {"subscription_id": com.subscription_id, "comapny_web_site": com.companyWebsiteURL,
                              "phone_number": com.companyPhoneNumber, "company_slug": com.slug}
                org = ZenOrganization(name=com.companyName, external_id=str(com.pk), shared_comments=True,
                                      shared_tickets=True, organization_fields=orgDetails)
                try:
                    created_org = z.zenpy_client.organizations.create(org)
                    com.zendeskid = created_org.id
                    com.save()
                except zenpy.lib.exception.APIException:
                    continue

def runUsersMigrations():
    users = User.objects.all()
    z = ZendeskAPI()

    userids = [223,222,221,217,207,209,215,202,211,196,206,96,130,30,5,6,9,10,11,25,7]

    ipdb.set_trace()

    # for user in z.zenpy_client.users():
    #     print(user.name)

    for key in userids:

            user = User.objects.get(pk=key)
            profile = Profile.objects.get(user=user)
            company = profile.companyProfile
            print("Org Not found for " + user.first_name + " " + user.last_name)

            try:
                if company:
                    if not(company.zendeskid is None or company.zendeskid is ''):

                        org = z.zenpy_client.organizations(id=int(company.zendeskid))

                        if org is None:
                            raise zenpy.lib.exception.RecordNotFoundException
                        else:
                            print("Org Found on Zendesk")
                            # ipdb.set_trace()
                            org = org

            except zenpy.lib.exception.RecordNotFoundException as e:
                print("Org Not found")
                orgDetails = {"subscription_id":company.subscription_id,"comapny_web_site":company.companyWebsiteURL,"phone_number":company.companyPhoneNumber,"company_slug":company.slug}
                org = ZenOrganization(name=company.companyName, external_id=str(company.pk), shared_comments=True, shared_tickets=True, organization_fields=orgDetails)
                created_org = z.zenpy_client.organizations.create(org)
                org = created_org
                #print(created_org)

            name = str(user.first_name) + ' ' + str(user.last_name)
            try:
                zeuser = ZenUser(name=name, email=user.email, organization_id=org.id)
                created_user = z.zenpy_client.users.create(zeuser)
                user.zendeskid = created_user
                user.save()
            except zenpy.lib.exception.APIException as e:
                print(e)
                continue

            # orgDetails = {"subscription_id": com.subscription_id, "comapny_web_site": com.companyWebsiteURL,
            #               "phone_number": com.companyPhoneNumber, "company_slug": com.slug}
            # org = ZenOrganization(name=com.companyName, external_id=str(com.pk), shared_comments=True,
            #                       shared_tickets=True, organization_fields=orgDetails)
            # try:
            #     created_org = z.zenpy_client.organizations.create(org)
            #     com.zendeskid = created_org.id
            #     com.save()
            # except zenpy.lib.exception.APIException:
            #     continue