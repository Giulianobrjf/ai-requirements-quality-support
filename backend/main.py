from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# IMPORTS DOS SEUS ARQUIVOS (Agora eles vão funcionar)
from models import RequestPayload, ResponsePayload
from ai_service import call_ai_api
from prompts import get_generation_prompt, get_analysis_prompt

load_dotenv()

app = FastAPI(title="Prototype API")

# Permitir conexão do React (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process", response_model=ResponsePayload)
async def process_request(payload: RequestPayload):
    # --- DEBUG 1: Chegada da requisição ---
    print(f"\n--> DEBUG: Recebi pedido no modo: {payload.mode}")
    
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="O texto de entrada não pode estar vazio.")

    # 1. Seleciona o prompt
    final_prompt = ""
    if payload.mode == "generation":
        final_prompt = get_generation_prompt(payload.text)
    elif payload.mode == "analysis":
        final_prompt = get_analysis_prompt(payload.text)
    else:
        raise HTTPException(status_code=400, detail="Modo inválido.")
    
    # --- DEBUG 2: Prompt montado ---
    print("--> DEBUG: Prompt selecionado e montado com sucesso.")

    # 2. Chama a IA
    try:
        print("--> DEBUG: Chamando ai_service...")
        
        # Await funciona agora porque o service também é async
        ai_response = await call_ai_api(final_prompt) 
        
        # --- DEBUG 3: Sucesso ---
        print("--> DEBUG: Resposta recebida da IA! Devolvendo para o front.")

        return ResponsePayload(
            result=ai_response,
            mode=payload.mode,
            status="success"
        )
        
    except Exception as e:
        # --- DEBUG 4: Erro ---
        print(f"--> DEBUG: ERRO CRÍTICO NO MAIN: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))