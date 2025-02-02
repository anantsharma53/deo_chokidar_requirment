from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import ( SignUpView, SignInView, JobApplicationAPIView, UploadFilesAPIView,ApplicantByPostAPIView,
                    UserInformationAPIView,SearchAdmitCardView,JobApplicationCountAPIView,ApplicantInformationView,CSVUploadView)


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='signin'),
    path('job-application/', JobApplicationAPIView.as_view(), name='job-application'),
    path('applicant-information/', ApplicantInformationView.as_view(), name='applicant-information'),
    path('upload-files/', UploadFilesAPIView.as_view(), name='upload-files'),
    path('applicants/by_post/<str:post>/', ApplicantByPostAPIView.as_view(), name='applicant_by_post_api'),
    path('user-information/', UserInformationAPIView.as_view(), name='applicant-information-detail'),
    path('searchAdmitCard/', SearchAdmitCardView.as_view(), name='search_admit_card'),
    path('job-applications/count/', JobApplicationCountAPIView.as_view(), name='job-application-count'),
    path('csv-upload/', CSVUploadView.as_view(), name='csv-upload'),
    # Add other URL patterns as needed
  
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
