from app.orders.models import Order, ProductOrder

orders = Order.objects.all()
lineOrders = ProductOrder.objects.all()

for obj in orders:
    if(obj.status != "Pending"):
        obj.status = "Pending"
        obj.save()

for obj in lineOrders:
    if (obj.status != "Pending"):
        obj.status = "Pending"
        obj.save()
