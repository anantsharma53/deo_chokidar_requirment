from django.views import View
from .serializers import *
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.core.paginator import Paginator
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from decimal import Decimal
import json
from .models import *
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Count
from rest_framework.pagination import PageNumberPagination
import csv
from io import TextIOWrapper
from django.contrib.auth.models import User
from datetime import datetime


class SignUpView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return JsonResponse(
                {"refresh": str(refresh), "access": str(refresh.access_token)},
                status=status.HTTP_201_CREATED,
            )
        return JsonResponse(serializer.error, status.HTTP_400_BAD_REQUEST, safe=False)

class SignInView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        user_data = {}
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "name": user.name,
                "mobile_number": user.mobile_number,
                "is_candiate": user.is_candidate,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
            }
            return JsonResponse(
                {
                    "user": user_data,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_201_CREATED,
            )
        return JsonResponse(serializer.error, status.HTTP_400_BAD_REQUEST, safe=False)

class JobApplicationAPIView(APIView):
    # Only authenticated users can access this view
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Include the 'user' field in the data
        data = request.data.copy()
        data['user'] = request.user.id  # Associate the current user with the application

        # The user must now include 'application_number' in the request data
        serializer = JobApplicationSerializer(data=data)
        if serializer.is_valid():
            job_application = serializer.save()

            return Response({"application_number": job_application.application_number}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class JobApplicationAPIView(APIView):
#     def post(self, request, *args, **kwargs):
#         # Include the 'user' field in the data
#         data = request.data.copy()
#         data['user'] = request.user.id  # Associate the current user with the application

#         serializer = JobApplicationSerializer(data=data)
#         if serializer.is_valid():
#             job_application = serializer.save()

#             # Generate application number based on post name and job application ID (not user ID)
#             application_number = f"{job_application.post}_{job_application.id}"
            
#             # Set the application number for the job application
#             job_application.application_number = application_number
#             job_application.save()

#             return Response({"application_number": application_number}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ApplicantInformationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        roll_number = request.query_params.get('roll_number')
        application_number = request.query_params.get('application_number')

        try:
            if roll_number:
                applicant_info = ApplicantInformation.objects.get(roll_number=roll_number)
            elif application_number:
                applicant_info = ApplicantInformation.objects.get(application_number=application_number)
            else:
                return Response({"detail": "Please provide either roll_number or application_number."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = ApplicantInformationSerializer(applicant_info)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ApplicantInformation.DoesNotExist:
            return Response({"detail": "Applicant information not found."}, status=status.HTTP_404_NOT_FOUND)
       

class UploadFilesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        # Extract the application number from the request data
        application_number = request.data.get('applicationNumber')
        
        # Check if application number is provided
        if not application_number:
            return Response({"detail": "Application number is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Find the job application by application number
        try:
            job_application = ApplicantInformation.objects.get(application_number=application_number)
        except ApplicantInformation.DoesNotExist:
            return Response({"detail": "Job application not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user is the owner of the job application
        if request.user.id != job_application.user.id:
            return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        # Update the job application with the new files
        if 'image' in request.FILES:
            job_application.image = request.FILES['image']

        if 'signature' in request.FILES:
            job_application.signature = request.FILES['signature']

        job_application.save()

        # Serialize the updated job application
        serializer = JobApplicationSerializer(job_application)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ApplicantByPostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post):
        # Create a pagination instance
        paginator = PageNumberPagination()
        paginator.page_size = 5  # Default number of records per page

        # Optionally, adjust the page size if provided in the query parameters
        page_size = request.query_params.get('page_size')
        if page_size is not None:
            paginator.page_size = int(page_size)
        
        # Retrieve applicants filtered by post
        applicants = ApplicantInformation.objects.filter(post=post)
        
        # Paginate the applicants queryset
        page = paginator.paginate_queryset(applicants, request)
        
        if page is None:
            return Response({"detail": "Invalid page."}, status=400)
        
        serializer = ApplicantInformationSerializer(page, many=True)
        
        # Return paginated response with metadata
        return paginator.get_paginated_response(serializer.data)
    
class UserInformationAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        try:
            user_data = {
                'name': user.name,  
                'email': user.email,
                'mobile_number': user.mobile_number,
            }
            return Response(user_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# class ApplicantInformationView(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request):
#         user = request.user
#         try:
#             applicant_info = ApplicantInformation.objects.get(user=user)
#             serializer = ApplicantInformationSerializer(applicant_info)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except ApplicantInformation.DoesNotExist:
#             return Response({"detail": "Applicant information not found."}, status=status.HTTP_404_NOT_FOUND) 
               
class SearchAdmitCardView(APIView):
    def post(self, request):
        applicationNumber = request.data.get('applicationNumber')
        dob = request.data.get('dob')
        print("Request data:", request.data)
        print( applicationNumber)
        print(dob)
        # Validate the input
        if not applicationNumber or not dob:
            return Response({'error': 'Application Number and date of birth are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Find the AdmitCard by application number and dob
        admit_card = get_object_or_404(ApplicantInformation, application_number=applicationNumber, dob=dob)
        # Serialize the AdmitCard data
        serializer = AdmitCardSerializer(admit_card)

        return Response(serializer.data, status=status.HTTP_200_OK)


class JobApplicationCountAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request, *args, **kwargs):
        # Check if the user is a superuser
        if not request.user.is_superuser:
            return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)

        # Get the total number of job applications
        total_applications = ApplicantInformation.objects.count()

        # Get the number of applications per job post
        applications_per_post = ApplicantInformation.objects.values('post').annotate(count=Count('id'))

        # Convert to a dictionary
        applications_per_post_dict = {item['post']: item['count'] for item in applications_per_post}

        # Combine total applications and applications per post in the response
        response_data = {
            "total_applications": total_applications,
            "applications_per_post": applications_per_post_dict
        }

        return Response(response_data, status=status.HTTP_200_OK)
    
# upload the csv file
from io import StringIO
from django.contrib.auth import get_user_model
User = get_user_model()

class CSVUploadView(APIView):
    def post(self, request, *args, **kwargs):
        csv_file = request.FILES['file']
        decoded_file = csv_file.read().decode('utf-8')
        reader = csv.DictReader(StringIO(decoded_file))

        errors = []  # List to accumulate errors
        successful_rows = 0  # Counter for successfully processed rows

        for row in reader:
            try:
                # Convert boolean values from strings to actual booleans
                row['is_ex_serviceman'] = self.convert_to_boolean(row['is_ex_serviceman'])
                row['has_criminal_case'] = self.convert_to_boolean(row['has_criminal_case'])
                row['declaration'] = self.convert_to_boolean(row['declaration'])

                # Ensure the date fields are in the correct format (YYYY-MM-DD)
                row['residential_certificate_date'] = self.format_date(row['residential_certificate_date'])
                row['caste_certificate_date'] = self.format_date(row['caste_certificate_date'])
                row['draft_date'] = self.format_date(row['draft_date'])
                row['exam_date'] = self.format_date(row['exam_date'])
                row['dob'] = self.format_date(row['dob'])

                # Fetch user instance
                user = User.objects.get(id=row['user_id'])

                # Create or update the ApplicantInformation object
                ApplicantInformation.objects.update_or_create(
                    id=row['id'],
                    defaults={
                        'user': user,
                        'post': row['post'],
                        'application_number': row['application_number'],
                        'applicantName': row['applicantName'],
                        'fatherName': row['fatherName'],
                        'gender': row['gender'],
                        'dob': row['dob'],
                        'bit_number': row['bit_number'],
                        'bit_village': row['bit_village'],
                        'village': row['village'],
                        'panchyat': row['panchyat'],
                        'post_office': row['post_office'],
                        'police_station': row['police_station'],
                        'circle': row['circle'],
                        'district': row['district'],
                        'pin_code': row['pin_code'],
                        'correspondentAddress': row['correspondentAddress'],
                        'mobileNumber': row['mobileNumber'],
                        'aadhaar_number': row['aadhaar_number'],
                        'disability_percentage': row['disability_percentage'],
                        'disability_type': row['disability_type'],
                        'education': row['education'],
                        'boardUniversity': row['boardUniversity'],
                        'passingYear': row['passingYear'],
                        'total_marks': row['total_marks'],
                        'obtained_marks': row['obtained_marks'],
                        'percentage': row['percentage'],
                        'residential_certificate_number': row['residential_certificate_number'],
                        'residential_certificate_date': row['residential_certificate_date'],
                        'category': row['category'],
                        'caste_certificate_number': row['caste_certificate_number'],
                        'caste_certificate_date': row['caste_certificate_date'],
                        'draft_number': row['draft_number'],
                        'draft_date': row['draft_date'],
                        'dd_amount': row['dd_amount'],
                        'bank_name': row['bank_name'],
                        'application_status': row['application_status'],
                        'remarks': row['remarks'],
                        'email': row['email'],
                        'roll_number': row['roll_number'],
                        'exp_circle': row['exp_circle'],
                        'exp_police_station': row['exp_police_station'],
                        'exp_bit_number': row['exp_bit_number'],
                        'exp_bit_village': row['exp_bit_village'],
                        'exp_years': row['exp_years'],
                        'exp_remarks': row['exp_remarks'],
                        'is_ex_serviceman': row['is_ex_serviceman'],
                        'has_criminal_case': row['has_criminal_case'],
                        'criminal_case_details': row['criminal_case_details'],
                        'identification_mark_1': row['identification_mark_1'],
                        'identification_mark_2': row['identification_mark_2'],
                        'nationality': row['nationality'],
                        'exam_center_name': row['exam_center_name'],
                        'exam_date': row['exam_date'],
                        'exam_time': row['exam_time'],
                    }
                )
                successful_rows += 1
            except User.DoesNotExist:
                errors.append(f"User with id {row['user_id']} does not exist.")
            except ValueError as ve:
                errors.append(f"Error processing row {row}: {str(ve)}")
            except Exception as e:
                errors.append(f"Error processing row {row}: {str(e)}")

        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"success": f"{successful_rows} rows processed successfully!"}, status=status.HTTP_201_CREATED)
    
    def convert_to_boolean(self, value):
        """ Convert a value to boolean. """
        if value.strip().lower() in ['true', '1', 'yes']:
            return True
        elif value.strip().lower() in ['false', '0', 'no']:
            return False
        else:
            raise ValueError(f"Invalid boolean value: {value}")

    def format_date(self, date_str):
        """ Format date to YYYY-MM-DD. """
        try:
            return datetime.strptime(date_str.strip(), '%d-%m-%Y').strftime('%Y-%m-%d')
        except ValueError:
            raise ValueError(f"Invalid date format: {date_str}")


        
    

    
