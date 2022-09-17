from app.accounts.models import User, Permission, PermissionAssignment
from app.products.models import Product
from app.core.models import Company
from app.orders.models import Order
from app.accounts.serializers import AssignPermissionSerializer


def run_company_product_merge():
    print("user count: " + str(len(User.objects.all())))
    print("company count: " + str(len(Company.objects.all())))
    print("product count: " + str(len(Product.objects.all())))
    sum = 0
    for user in User.objects.all():
        profile_data = user.profile.get()
        user_pk = user.pk
        profile_pk = profile_data.pk
        company = profile_data.companyProfile
        if user_pk is not None and company is not None:
            prod_list = Product.objects.filter(profile=profile_pk)
            for p in prod_list.iterator():
                sum +=1
                p.company = company
                p.save()
                print(str(user_pk) + " " + p.name + " " + str(company.pk))
    print("Covered products: " + str(sum))


def run_company_order_merge():
    print("user count: " + str(len(User.objects.all())))
    print("company count: " + str(len(Company.objects.all())))
    print("order count: " + str(len(Order.objects.all())))
    sum = 0
    for user in User.objects.all():
        profile_data = user.profile.get()
        user_pk = user.pk
        profile_pk = profile_data.pk
        company = profile_data.companyProfile
        if user_pk is not None and company is not None:
            order_list = Order.objects.filter(profile=profile_pk)
            for o in order_list.iterator():
                print(sum)
                sum += 1
                o.company = company
                o.save()
                print(str(user_pk) + " " + o.orderID + " " + str(company.pk))
    print("Covered orders: " + str(sum))


# def run():
#     for user in User.objects.filter():
#         if user.profile.get().companyProfile.pk is not None:
#             request = {'permission':{'user':user.pk,'company':user.profile.get().companyProfile.pk, 'perm':"ALL"},'assigner':{'assigner':1}}
#             serializer = AssignPermissionSerializer(data=request['assigner'],
#                                                     context={'data': request['permission']}, partial=True)
#             if serializer.is_valid():
#                 serializer.save()
