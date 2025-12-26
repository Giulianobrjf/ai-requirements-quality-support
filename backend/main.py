from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import RequestPayload, ResponsePayload
from ai_service import call_ai_api
from prompts import get_generation_prompt, get_analysis_prompt
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TCC Prototype API")

# Permitir conexão do React (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process", response_model=ResponsePayload)
async def process_request(payload: RequestPayload):
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="O texto de entrada não pode estar vazio.")

    # 1. Seleciona o prompt baseado no modo (Pattern Strategy simples)
    if payload.mode == "generation":
        final_prompt = get_generation_prompt(payload.text)
    elif payload.mode == "analysis":
        final_prompt = get_analysis_prompt(payload.text)
    else:
        raise HTTPException(status_code=400, detail="Modo inválido.")

    # 2. Chama a IA (Isolado no service)
    try:
        ai_response = await call_ai_api(final_prompt)
        return ResponsePayload(
            result=ai_response,
            mode=payload.mode,
            status="success"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))