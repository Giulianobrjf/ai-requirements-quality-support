from pydantic import BaseModel
from typing import Optional

# Modelo para receber dados do front
class RequestPayload(BaseModel):
    text: str
    mode: str  # "generation" ou "analysis"

# Modelo para responder ao front
class ResponsePayload(BaseModel):
    result: str
    mode: str
    status: str