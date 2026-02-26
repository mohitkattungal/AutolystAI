"""Auth-related request/response schemas."""

from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    account_type: str = "individual"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    account_type: str
    industry: str | None = None
    job_title: str | None = None
    onboarding_completed: bool

    model_config = {"from_attributes": True}
