"""Auth-related request/response schemas — custom JWT auth."""

import re
from datetime import datetime

from pydantic import BaseModel, EmailStr, field_validator


# ─── Auth Requests ───


def _validate_password(v: str) -> str:
    if len(v) < 8:
        raise ValueError("Password must be at least 8 characters")
    if not re.search(r"[A-Za-z]", v):
        raise ValueError("Password must contain at least one letter")
    if not re.search(r"\d", v):
        raise ValueError("Password must contain at least one number")
    return v


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str

    @field_validator("password")
    @classmethod
    def strong_password(cls, v: str) -> str:
        return _validate_password(v)

    @field_validator("full_name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Full name must be at least 2 characters")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def strong_password(cls, v: str) -> str:
        return _validate_password(v)


# ─── Requests ───


class UpdateProfileRequest(BaseModel):
    full_name: str | None = None
    industry: str | None = None
    job_title: str | None = None
    avatar_url: str | None = None

    @field_validator("full_name")
    @classmethod
    def name_not_empty(cls, v: str | None) -> str | None:
        if v is not None:
            v = v.strip()
            if len(v) < 2:
                raise ValueError("Full name must be at least 2 characters")
        return v


class OnboardingRequest(BaseModel):
    """Complete onboarding — sets industry, job_title, marks onboarding done."""

    industry: str | None = None
    job_title: str | None = None
    account_type: str | None = None  # can finalize account_type here

    @field_validator("account_type")
    @classmethod
    def valid_account_type(cls, v: str | None) -> str | None:
        if v is not None and v not in ("individual", "team"):
            raise ValueError("account_type must be 'individual' or 'team'")
        return v


# ─── Responses ───


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    account_type: str
    role: str
    industry: str | None = None
    job_title: str | None = None
    avatar_url: str | None = None
    onboarding_completed: bool
    team_id: str | None = None
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ─── Team schemas ───


class CreateTeamRequest(BaseModel):
    name: str
    company_name: str | None = None
    industry: str | None = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Team name must be at least 2 characters")
        return v


class InviteMemberRequest(BaseModel):
    email: EmailStr
    role: str = "analyst"  # admin | analyst | viewer

    @field_validator("role")
    @classmethod
    def valid_role(cls, v: str) -> str:
        if v not in ("admin", "analyst", "viewer"):
            raise ValueError("role must be 'admin', 'analyst', or 'viewer'")
        return v


class TeamResponse(BaseModel):
    id: str
    name: str
    company_name: str | None = None
    industry: str | None = None
    owner_id: str
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class TeamMemberResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool

    model_config = {"from_attributes": True}


class TeamInvitationResponse(BaseModel):
    id: str
    email: str
    role: str
    status: str
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class BulkInviteRequest(BaseModel):
    """Invite multiple members at once (used by team onboarding)."""

    invites: list[InviteMemberRequest]
