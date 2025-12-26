import google.generativeai as genai
import os

# Configuração simples
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def call_ai_api(prompt_text: str) -> str:
    try:
        model = genai.GenerativeModel('gemini-pro') 
        response = model.generate_content(prompt_text)
        return response.text
    except Exception as e:
        print(f"Erro na API de IA: {e}")
        raise e