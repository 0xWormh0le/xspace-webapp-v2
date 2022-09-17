from rest_framework import serializers
from app.accounts.models import User
from notifications.models import Notification
from app.core.models import Application


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField()


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'


# class GenericNotificationRelatedField(serializers.RelatedField):
#
#     def to_representation(self, value):
#         if isinstance(value, User):
#             serializer = UserDetailSerializer(value)
#
#         return serializer.data


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = (
            "id", "level", "recipient_id", "unread", "actor_content_type_id", "actor_object_id", "verb", "description",
            "target_content_type_id", "target_object_id", "action_object_content_type_id", "action_object_object_id",
            "timestamp", "public", "deleted", "emailed", "data")


class CreateNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "recipient_id", "actor_object_id", "verb", "description", "public", "data")
