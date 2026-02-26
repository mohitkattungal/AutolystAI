"""Chat endpoints — send message, list conversations."""

import json
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.conversation import Conversation, Message
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse, ConversationResponse, MessageResponse

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/send", response_model=ChatResponse)
async def send_message(
    body: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Get or create conversation
    if body.conversation_id:
        result = await db.execute(
            select(Conversation).where(
                Conversation.id == body.conversation_id,
                Conversation.owner_id == current_user.id,
            )
        )
        conversation = result.scalar_one_or_none()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conversation = Conversation(
            owner_id=current_user.id,
            dataset_id=body.dataset_id,
            title=body.message[:80],
        )
        db.add(conversation)
        await db.flush()

    # Save user message
    user_msg = Message(
        conversation_id=conversation.id,
        role="user",
        content=body.message,
    )
    db.add(user_msg)

    # Generate AI response (placeholder — will be replaced with LangGraph agent)
    ai_content = _placeholder_response(body.message)
    chart_config = _detect_chart(body.message)

    assistant_msg = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=ai_content,
        chart_config=json.dumps(chart_config) if chart_config else None,
    )
    db.add(assistant_msg)
    await db.commit()
    await db.refresh(assistant_msg)

    return ChatResponse(
        message=MessageResponse(
            id=str(assistant_msg.id),
            role=assistant_msg.role,
            content=assistant_msg.content,
            chart_config=assistant_msg.chart_config,
            created_at=assistant_msg.created_at,
        ),
        conversation_id=str(conversation.id),
    )


@router.get("/conversations", response_model=list[ConversationResponse])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Conversation)
        .where(Conversation.owner_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
    )
    return result.scalars().all()


@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.owner_id == current_user.id,
        )
    )
    conv = result.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv


# ── Placeholder helpers (will be swapped with real AI pipeline) ──

def _placeholder_response(user_msg: str) -> str:
    lower = user_msg.lower()
    if any(w in lower for w in ["revenue", "trend", "sales"]):
        return (
            "Based on the data analysis, revenue shows a strong upward trend. "
            "Key highlights:\n"
            "• Total Revenue: $1.42M (+23.4% YoY)\n"
            "• Best Month: November ($152,300)\n"
            "• Enterprise segment drives 42% of revenue\n\n"
            "Would you like me to drill deeper into any segment?"
        )
    if any(w in lower for w in ["churn", "attrition", "retention"]):
        return (
            "The churn analysis reveals that customers with tenure < 12 months "
            "and monthly charges > $70 are at highest risk. The top predictive "
            "features are: Contract Type, Tenure, and Support Tickets.\n\n"
            "Want me to build a prediction model for at-risk customers?"
        )
    return (
        "I've analyzed your request. Here are the key findings from the dataset. "
        "Would you like me to generate a chart or explore a specific aspect in more detail?"
    )


def _detect_chart(user_msg: str) -> dict | None:
    lower = user_msg.lower()
    if any(w in lower for w in ["chart", "graph", "plot", "trend", "distribution"]):
        return {"type": "bar", "title": "Generated Chart", "dataKey": "value"}
    return None
