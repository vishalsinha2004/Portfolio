import os
import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv(override=True)

# 1. LLM CONFIGURATION (With Fallback)
primary_llm = ChatGroq(
    model="llama-3.3-70b-versatile", 
    temperature=0.7,
    api_key=os.getenv("GROQ_API_KEY")
)

fallback_llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash", 
    temperature=0.7,
    google_api_key=os.getenv("GOOGLE_API_KEY") 
)

llm_chainable = primary_llm.with_fallbacks([fallback_llm])

# 2. DATA LOADERS
def load_portfolio_data():
    knowledge_path = os.path.join(settings.BASE_DIR, 'core', 'knowledge.txt')
    projects_path = os.path.join(settings.BASE_DIR, 'core', 'projects.json')
    
    with open(knowledge_path, 'r', encoding='utf-8') as f:
        bio = f.read()
    with open(projects_path, 'r', encoding='utf-8') as f:
        projects = json.load(f)
        
    return bio, projects

# 3. VIEWS
def home(request):
    return render(request, 'core/index.html')

@csrf_exempt
def chatbot_response(request):
    if request.method == 'POST':
        try:
            bio, projects = load_portfolio_data()
            data = json.loads(request.body)
            user_input = data.get('message', '')

            # THE FIX: Strict Guardrails in the System Prompt
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are the official Portfolio Assistant for Vishal Sinha.
                
                STRICT LIMITATION:
                1. You ONLY answer questions related to Vishal Sinha, his skills, projects, and background.
                2. If a user asks a general knowledge question (e.g., 'What is Python?', 'Who is the president?', 'How to cook?'), you must politely decline.
                3. Response for off-topic questions: "I am specialized in providing information about Vishal Sinha's career and projects. For general queries, please use a standard search engine."

                VISHAL'S KNOWLEDGE BASE:
                {bio}
                
                VISHAL'S PROJECTS:
                {projects}
                """),
                ("user", "{input}")
            ])

            # Build and invoke the chain
            chain = prompt | llm_chainable | StrOutputParser()
            
            # LangChain handles the variable injection safely
            reply = chain.invoke({
                "input": user_input,
                "bio": bio,
                "projects": json.dumps(projects)
            })
            
            return JsonResponse({'reply': reply})
        except Exception as e:
            print(f"Chatbot Error: {e}")
            return JsonResponse({'reply': "I'm having trouble focusing right now. Please try again later."}, status=500)