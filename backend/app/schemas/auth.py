from pydantic import BaseModel, EmailStr, Field, ConfigDict

class RegisterBase(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=8, max_length=30)
    password: str = Field(min_length=8, max_length=100)

class BuyerRegister(RegisterBase):
    company_name: str = Field(min_length=2, max_length=500)
    industry: str = Field(min_length=2, max_length=2000)
    registered_address: str = Field(min_length=5, max_length=1000)
    plant_location: str = Field(min_length=2, max_length=1000)
    gst_number: str = Field(min_length=5, max_length=50)
    website: str | None = Field(default=None, max_length=50)

    head_office_contact: str | None = Field(default=None, max_length=20)
    ehs_contact: str | None = Field(default=None, max_length=20)
    director_email: EmailStr | None = None

# ============================================================
# PASSWORD RESET
# ============================================================

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(min_length=8)
    

class VendorRegister(RegisterBase):
    company_name: str = Field(min_length=2, max_length=100)
    industry_type: str = Field(min_length=2, max_length=1000)
    industrial_verticals: str = Field(min_length=2, max_length=2000)
    address: str = Field(min_length=5, max_length=1000)
    area_of_work: str = Field(min_length=2, max_length=1000)
    experience_years: int = Field(ge=0, le=100)
    capacity: str | None = Field(default=None, max_length=1000)
    specialization: str = Field(min_length=5, max_length=1000)
    gst_number: str = Field(min_length=5, max_length=50)
    msme_number: str | None = Field(default=None, max_length=100)
    website: str | None = Field(default=None, max_length=50)
    domains: list[str] = Field(min_length=1)

    director_email: EmailStr | None = None
    contact_2: str | None = Field(default=None, max_length=20)

    
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6)

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    full_name: str
    email: EmailStr
    phone: str
    role: str
    status: str
    email_verified: bool

