"""Team endpoints — create team, invite members, manage team."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.team import Team, TeamInvitation
from app.models.user import User
from app.schemas.auth import (
    BulkInviteRequest,
    CreateTeamRequest,
    InviteMemberRequest,
    TeamInvitationResponse,
    TeamMemberResponse,
    TeamResponse,
    UserResponse,
)

router = APIRouter(prefix="/teams", tags=["teams"])


# ── Helpers ──

def _require_team_admin(user: User) -> None:
    """Raise 403 if user is not owner or admin of their team."""
    if user.role not in ("owner", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only team owners and admins can perform this action",
        )


# ── Create team ──


@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    body: CreateTeamRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new team workspace. The creator becomes the owner."""
    # Check if user already owns a team
    if current_user.owned_teams:
        raise HTTPException(status_code=409, detail="You already own a team")

    team = Team(
        name=body.name,
        company_name=body.company_name,
        industry=body.industry,
        owner_id=current_user.id,
    )
    db.add(team)
    await db.flush()

    # Update the creator
    current_user.account_type = "team"
    current_user.role = "owner"
    current_user.team_id = team.id
    if body.industry:
        current_user.industry = body.industry

    await db.commit()
    await db.refresh(team)
    return team


# ── Get my team ──


@router.get("/me", response_model=TeamResponse)
async def get_my_team(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get the team the current user belongs to."""
    if not current_user.team_id:
        raise HTTPException(status_code=404, detail="You are not part of any team")

    result = await db.execute(select(Team).where(Team.id == current_user.team_id))
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


# ── List team members ──


@router.get("/members", response_model=list[TeamMemberResponse])
async def list_members(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all members in the current user's team."""
    if not current_user.team_id:
        raise HTTPException(status_code=404, detail="You are not part of any team")

    result = await db.execute(
        select(User).where(User.team_id == current_user.team_id).order_by(User.created_at)
    )
    return result.scalars().all()


# ── Invite a member ──


@router.post("/invite", response_model=TeamInvitationResponse, status_code=status.HTTP_201_CREATED)
async def invite_member(
    body: InviteMemberRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Invite someone to the team by email. Only owners/admins."""
    _require_team_admin(current_user)

    if not current_user.team_id:
        raise HTTPException(status_code=400, detail="Create a team first")

    # Check if already a member
    existing_member = await db.execute(
        select(User).where(User.email == body.email, User.team_id == current_user.team_id)
    )
    if existing_member.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="User is already a team member")

    # Check for duplicate pending invitation
    existing_invite = await db.execute(
        select(TeamInvitation).where(
            TeamInvitation.team_id == current_user.team_id,
            TeamInvitation.email == body.email,
            TeamInvitation.status == "pending",
        )
    )
    if existing_invite.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Invitation already pending for this email")

    invitation = TeamInvitation(
        team_id=current_user.team_id,
        email=body.email,
        role=body.role,
        invited_by=current_user.id,
    )
    db.add(invitation)
    await db.commit()
    await db.refresh(invitation)
    return invitation


# ── Bulk invite (onboarding) ──


@router.post("/invite/bulk", response_model=list[TeamInvitationResponse], status_code=status.HTTP_201_CREATED)
async def bulk_invite(
    body: BulkInviteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Invite multiple members at once — used during team onboarding."""
    _require_team_admin(current_user)

    if not current_user.team_id:
        raise HTTPException(status_code=400, detail="Create a team first")

    created: list[TeamInvitation] = []
    for invite in body.invites:
        # Skip if already member or already invited
        existing = await db.execute(
            select(User).where(User.email == invite.email, User.team_id == current_user.team_id)
        )
        if existing.scalar_one_or_none():
            continue

        dup_invite = await db.execute(
            select(TeamInvitation).where(
                TeamInvitation.team_id == current_user.team_id,
                TeamInvitation.email == invite.email,
                TeamInvitation.status == "pending",
            )
        )
        if dup_invite.scalar_one_or_none():
            continue

        invitation = TeamInvitation(
            team_id=current_user.team_id,
            email=invite.email,
            role=invite.role,
            invited_by=current_user.id,
        )
        db.add(invitation)
        created.append(invitation)

    await db.commit()
    for inv in created:
        await db.refresh(inv)
    return created


# ── List pending invitations ──


@router.get("/invitations", response_model=list[TeamInvitationResponse])
async def list_invitations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all invitations for the current user's team."""
    if not current_user.team_id:
        raise HTTPException(status_code=404, detail="You are not part of any team")

    _require_team_admin(current_user)

    result = await db.execute(
        select(TeamInvitation)
        .where(TeamInvitation.team_id == current_user.team_id)
        .order_by(TeamInvitation.created_at.desc())
    )
    return result.scalars().all()


# ── Accept invitation ──


@router.post("/invitations/{invitation_id}/accept", response_model=UserResponse)
async def accept_invitation(
    invitation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Accept a team invitation. The invitation must match the current user's email."""
    result = await db.execute(
        select(TeamInvitation).where(
            TeamInvitation.id == invitation_id,
            TeamInvitation.status == "pending",
        )
    )
    invitation = result.scalar_one_or_none()
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found or already used")

    if invitation.email != current_user.email:
        raise HTTPException(status_code=403, detail="This invitation is not for your email")

    # Join the team
    current_user.team_id = invitation.team_id
    current_user.account_type = "team"
    current_user.role = invitation.role
    invitation.status = "accepted"

    await db.commit()
    await db.refresh(current_user)
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        account_type=current_user.account_type,
        role=current_user.role,
        industry=current_user.industry,
        job_title=current_user.job_title,
        avatar_url=current_user.avatar_url,
        onboarding_completed=current_user.onboarding_completed,
        team_id=str(current_user.team_id) if current_user.team_id else None,
        created_at=current_user.created_at,
    )


# ── My invitations (as invitee) ──


@router.get("/invitations/mine", response_model=list[TeamInvitationResponse])
async def my_invitations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List pending invitations for the current user (by their email)."""
    result = await db.execute(
        select(TeamInvitation).where(
            TeamInvitation.email == current_user.email,
            TeamInvitation.status == "pending",
        )
    )
    return result.scalars().all()


# ── Remove a member ──


@router.delete("/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_member(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove a member from the team. Only owners/admins can do this."""
    _require_team_admin(current_user)

    if str(current_user.id) == user_id:
        raise HTTPException(status_code=400, detail="You cannot remove yourself")

    result = await db.execute(
        select(User).where(
            User.id == user_id,
            User.team_id == current_user.team_id,
        )
    )
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found in your team")

    # Cannot remove the team owner
    if member.role == "owner":
        raise HTTPException(status_code=403, detail="Cannot remove the team owner")

    member.team_id = None
    member.account_type = "individual"
    member.role = "owner"

    await db.commit()


# ── Update member role ──


@router.patch("/members/{user_id}/role", response_model=TeamMemberResponse)
async def update_member_role(
    user_id: str,
    body: InviteMemberRequest,  # reuse — only `role` field matters
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Change a member's role. Only owners can do this."""
    if current_user.role != "owner":
        raise HTTPException(status_code=403, detail="Only team owners can change roles")

    result = await db.execute(
        select(User).where(
            User.id == user_id,
            User.team_id == current_user.team_id,
        )
    )
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found in your team")

    member.role = body.role
    await db.commit()
    await db.refresh(member)
    return member


# ── Revoke invitation ──


@router.delete("/invitations/{invitation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_invitation(
    invitation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cancel a pending invitation."""
    _require_team_admin(current_user)

    result = await db.execute(
        select(TeamInvitation).where(
            TeamInvitation.id == invitation_id,
            TeamInvitation.team_id == current_user.team_id,
            TeamInvitation.status == "pending",
        )
    )
    invitation = result.scalar_one_or_none()
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")

    await db.delete(invitation)
    await db.commit()
