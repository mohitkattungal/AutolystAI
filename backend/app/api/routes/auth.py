"""Auth endpoints — signup, login, profile, onboarding, change password."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    OnboardingRequest,
    SignupRequest,
    TokenResponse,
    UpdateProfileRequest,
    UserResponse,
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


# ── Helpers ──


def _user_response(user: User) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        account_type=user.account_type,
        role=user.role,
        industry=user.industry,
        job_title=user.job_title,
        avatar_url=user.avatar_url,
        onboarding_completed=user.onboarding_completed,
        team_id=str(user.team_id) if user.team_id else None,
        created_at=user.created_at,
    )


def _token(user: User) -> TokenResponse:
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=_user_response(user),
    )


# ── Signup ──


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(body: SignupRequest, db: AsyncSession = Depends(get_db)):
    """Create a new user account and return a JWT."""
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        full_name=body.full_name,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return _token(user)


# ── Login ──


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate with email + password, return JWT."""
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")

    return _token(user)


# ── Me ──


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    """Return the authenticated user's profile."""
    return _user_response(current_user)


# ── Update profile ──


@router.patch("/profile", response_model=UserResponse)
async def update_profile(
    body: UpdateProfileRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update name, industry, job_title, avatar."""
    if body.full_name is not None:
        current_user.full_name = body.full_name
    if body.industry is not None:
        current_user.industry = body.industry
    if body.job_title is not None:
        current_user.job_title = body.job_title
    if body.avatar_url is not None:
        current_user.avatar_url = body.avatar_url

    await db.commit()
    await db.refresh(current_user)
    return _user_response(current_user)


# ── Complete onboarding ──


@router.post("/onboarding", response_model=UserResponse)
async def complete_onboarding(
    body: OnboardingRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Set industry, job_title, finalize account_type, mark onboarding done."""
    if body.industry is not None:
        current_user.industry = body.industry
    if body.job_title is not None:
        current_user.job_title = body.job_title
    if body.account_type is not None:
        current_user.account_type = body.account_type

    current_user.onboarding_completed = True
    await db.commit()
    await db.refresh(current_user)
    return _user_response(current_user)


# ── Change password ──


@router.post("/change-password")
async def change_password(
    body: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Change the authenticated user's password."""
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    current_user.hashed_password = hash_password(body.new_password)
    await db.commit()
    return {"message": "Password updated"}
