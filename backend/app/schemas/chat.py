"""Chat schemas."""

from datetime import datetime
from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    dataset_id: str | None = None


class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    chart_config: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    messages: list[MessageResponse] = []

    model_config = {"from_attributes": True}


class ChatResponse(BaseModel):
    message: MessageResponse
    conversation_id: str
