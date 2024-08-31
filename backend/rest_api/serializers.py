from rest_framework import serializers
from .models import User,ApplicantInformation
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            email=validated_data.get('email', ''),
            mobile_number=validated_data.get('mobile_number', ''),
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")

class ApplicantInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicantInformation
        fields = '__all__'

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicantInformation
        exclude = ('image', 'signature', 'declaration') 

class AdmitCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicantInformation
        fields = '__all__'
          