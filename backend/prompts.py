# Prompt Engineering: Definindo a Persona e o Formato
SYSTEM_ROLE = "Você é um Engenheiro de Requisitos Sênior especialista em qualidade de software."

def get_generation_prompt(user_story: str) -> str:
    return f"""
    {SYSTEM_ROLE}
    TAREFA: Converta a User Story abaixo em Requisitos Funcionais técnicos.
    
    ENTRADA (User Story):
    "{user_story}"

    SAÍDA ESPERADA:
    1. Lista de Requisitos Funcionais (RFs) com IDs.
    2. Critérios de Aceitação básicos.
    3. Breve justificativa das escolhas.
    
    FORMATO: Markdown.
    """

def get_analysis_prompt(requirements: str) -> str:
    return f"""
    {SYSTEM_ROLE}
    TAREFA: Analise os requisitos abaixo quanto à qualidade (ambiguidade, completude, testabilidade).
    
    ENTRADA (Requisitos):
    "{requirements}"

    SAÍDA ESPERADA:
    1. Diagnóstico de Qualidade.
    2. Lista de problemas encontrados (classificados por tipo).
    3. Sugestão de reescrita para maior clareza.
    
    FORMATO: Markdown.
    """