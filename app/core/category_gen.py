"""
category generator
"""
from app.core.models import Category
from django.template.defaultfilters import slugify

c = ['Automotive',
     'Beauty',
     'Camera & Photo',
     'Cell Phones',
     'Clothing & Accessories',
     'Collectibles (Books)',
     'Collectibles (Entertainment)',
     'Electronics (Accessories)',
     'Electronics (Consumer)',
     'Food Products',
     'Handmade',
     'Health & Personal Care',
     'Home & Garden',
     'Industrial & Scientific',
     'Luggage & Travel Accessories',
     'Musical Instruments',
     'Office Products',
     'Outdoors',
     'Personal Computers',
     'Software',
     'Sports',
     'Tools & Home Improvement',
     'Toys & Games',
     'Uncategorized']


def run():
    updatedCount = 0
    for cat in range(0, len(c)):
        try:
            string = slugify(c[cat])
            Category.objects.create(name=c[cat], slug=string, publisher='XSPACE', description='')
            print(string)
        except:
            # already exists so lets just ignore it pass
            updatedCount += 1
            pass

    if updatedCount > 0:
        category_objects = Category.objects.all()
        for cat in category_objects:
            if cat.name in c:
                continue
            else:
                # category doesn't exists
                from app.products.models import Product
                products = Product.objects.all().filter(category=cat.id)
                uncategorized = Category.objects.get(name='Uncategorized')
                # change any products that currently follow a deprecated naming schema
                for product in products:
                    product.category = uncategorized
                    product.save()
                # delete the category
                Category.objects.get(name=cat.name).delete()
