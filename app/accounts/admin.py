from django.contrib import admin
from app.accounts.models import Profile, Company
from app.core.models import Snippet


# Register your models here.
# 7 unique profile models disregard user inheritance

admin.site.register(Profile)
admin.site.register(Company)
admin.site.register(Snippet)
