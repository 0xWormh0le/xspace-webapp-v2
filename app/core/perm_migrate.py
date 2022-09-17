from app.accounts.models import User, Permission, PermissionAssignment, Profile
from app.accounts.serializers import AssignPermissionSerializer


def run():
    for user in User.objects.all():
        try:
            prof = Profile.objects.get(user=user)

            if user.profile.get().companyProfile is not None:
                request = {
                    'permission': {'user': user.pk, 'company': user.profile.get().companyProfile.id, 'perm': "ALL"},
                    'assigner': {'assigner': 1}}
                serializer = AssignPermissionSerializer(data=request['assigner'],
                                                        context={'data': request['permission']}, partial=True)
                if serializer.is_valid():
                    serializer.save()

        except (Profile.DoesNotExist):
            Profile.objects.create(user=user,)

