from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser


class UserManager(BaseUserManager):
    def create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError("Username should be provided")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)

class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    mobile_number = models.CharField(max_length=15)
    password = models.CharField(max_length=100)
    is_candidate = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    objects = UserManager()

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser


class ApplicantInformation(models.Model):
    # 1. User details
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # 2. Candidate Details
    post = models.CharField(max_length=255)
    application_number = models.CharField(max_length=255, unique=True)
    applicantName = models.CharField(max_length=255)
    fatherName = models.CharField(max_length=255)
    gender = models.CharField(max_length=10)
    dob = models.DateField()
    bit_number = models.CharField(max_length=255)
    bit_village = models.CharField(max_length=255)
    village = models.CharField(max_length=255)
    panchyat = models.CharField(max_length=255)
    post_office = models.CharField(max_length=255)
    police_station = models.CharField(max_length=255)
    circle = models.CharField(max_length=255)
    district = models.CharField(max_length=255)
    pin_code = models.CharField(max_length=6)
    correspondentAddress = models.TextField()
    mobileNumber = models.CharField(max_length=15)
    aadhaar_number = models.CharField(max_length=12)
    disability_percentage = models.FloatField(blank=True, null=True)
    disability_type = models.CharField(max_length=255, blank=True, null=True)
    education = models.CharField(max_length=255)
    boardUniversity = models.CharField(max_length=255)
    passingYear = models.PositiveIntegerField()
    total_marks = models.CharField(max_length=255)
    obtained_marks = models.CharField(max_length=255)
    percentage = models.FloatField()
    residential_certificate_number = models.CharField(max_length=100)
    residential_certificate_date = models.DateField()
    category = models.CharField(max_length=255)
    caste_certificate_number = models.CharField(max_length=100)
    caste_certificate_date = models.DateField()
    draft_number = models.CharField(max_length=100)
    draft_date = models.DateField()
    dd_amount = models.IntegerField()
    bank_name = models.CharField(max_length=255)
    application_status = models.CharField(max_length=255)
    remarks = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    application_date = models.DateField(auto_now_add=True)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    signature = models.ImageField(upload_to='signatures/', blank=True, null=True)
    declaration = models.BooleanField(default=True)
    roll_number = models.CharField(max_length=255, unique=True, default=None)
    # 2. Additional details for Experience
    exp_circle = models.CharField(max_length=255, blank=True, null=True)
    exp_police_station = models.CharField(max_length=255, blank=True, null=True)
    exp_bit_number = models.CharField(max_length=255, blank=True, null=True)
    exp_bit_village = models.CharField(max_length=255, blank=True, null=True)
    exp_years = models.PositiveIntegerField(blank=True, null=True)
    exp_remarks = models.TextField(blank=True, null=True)
    # 3. Additional details of candidate
    is_ex_serviceman = models.BooleanField(default=False)
    has_criminal_case = models.BooleanField(default=False)
    criminal_case_details = models.TextField(blank=True, null=True)
    identification_mark_1 = models.CharField(max_length=255, blank=True)
    identification_mark_2 = models.CharField(max_length=255, blank=True)
    nationality = models.CharField(max_length=255, blank=True)
    # 4. Exam center Details
    exam_center_name = models.CharField(max_length=255, blank=True, null=True)
    exam_date = models.DateField(blank=True,null=True)
    exam_time = models.TextField(blank=True, null=True)

    
    def __str__(self):
        return f"{self.applicantName}'s Application Information"


    # def save(self, *args, **kwargs):
    #     if not self.application_number:
    #         # Generate a unique application number using some logic
    #         # For example: post + user.id + applicantName
    #         self.application_number = f"{self.post}_{self.applicantName}"
    #     super().save(*args, **kwargs)

