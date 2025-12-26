import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    api_key = "AIzaSyDsT7X_MNAVpTSdovo_tEOoe8ldlilvOpw" 

genai.configure(api_key=api_key)

async def call_ai_api(prompt_text: str) -> str:
    # Modelos exatamente da sua lista, ordenados por estabilidade/cota
    models_to_try = [
   #     'gemini-2.5-flash',    
    #    'gemini-3-flash',    
        'gemma-3-27b-it'      
    ]
    for model_name in models_to_try:
        try:
            print(f"--> DEBUG (Service): Tentando modelo {model_name}...")
            model = genai.GenerativeModel(model_name)
            
            # Chamada assíncrona
            response = await model.generate_content_async(prompt_text)
            
            if response and response.text:
                return response.text
            
        except ResourceExhausted:
            print(f"--> LIMITE (429) no {model_name}. Tentando o próximo...")
            continue 
            
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "quota" in error_msg.lower():
                print(f"--> COTAS ESGOTADAS no {model_name}. Pulando...")
                continue
            
            print(f"--> ERRO no {model_name}: {e}")
            continue

    # Se todos da sua lista falharem
    return """
> 🛑 **Serviço Temporariamente Indisponível**
> 
> Todos os modelos disponíveis (`2.0` e `2.5`) atingiram o limite de uso gratuito do Google para sua chave.
>
> **Sugestões:**
> 1. Aguarde 2 minutos para o Google resetar seu contador.
"""