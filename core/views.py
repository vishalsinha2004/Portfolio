import os
import json
import google.generativeai as genai
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv

# Force reload from the .env file
load_dotenv(override=True)

api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    # Using the stable 2025 model
    model = genai.GenerativeModel('gemini-2.5-flash')
else:
    model = None

def home(request):
    return render(request, 'core/index.html')

@csrf_exempt
def chatbot_response(request):
    if not model:
        return JsonResponse({'reply': "System Error: API Key is missing."}, status=500)
        
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')

            system_context = """

           You are the official AI Assistant for Vishal Sinha's Portfolio.

Your goal is to provide accurate information about Vishal to recruiters and collaborators.



VISHAL'S BACKGROUND:

- Education: BCA student at Shreyarth University with a solid SGPA of 7.36.

- Role: Ambitious Full-Stack Developer, AI/ML Enthusiast, and former Data Science Intern at TECHMICRE.

- Contact: vishalsinha6567@gmail.com | Portfolio: vishalsinha.netlify.app.



CORE TECHNICAL SKILLS:

- Languages: Python, JavaScript, PHP, Java.

- Frameworks/Libraries: Django, Node.js, React, OpenCV, Mediapipe, LangChain.

- Tools: Firebase, MySQL, MongoDB, FAISS (Vector Databases).



KEY PROJECTS TO HIGHLIGHT:

1.MarkAI: An AI-powered desktop voice assistant using Gemini LLM and OpenCV.

2.MyPDF.AI: A RAG-based chatbot that lets users interact with PDF documents using FAISS embeddings.

3.Face Recognition Attendance System: A real-time system built with DeepFace and OpenPyXL.

4.Finder: A full-stack note-sharing platform integrated with the Gemini API.



TONE AND BEHAVIOR:

- Be professional, technically knowledgeable, and friendly.

- If asked about his experience, mention his internship at TECHMICRE (June-July 2025).

- Always encourage the user to view his GitHub (github.com/vishalsinha2004) or LinkedIn.

            """ # Your full prompt here

            response = model.generate_content(f"{system_context}\nUser: {user_message}")
            return JsonResponse({'reply': response.text})
            
        except Exception as e:
            # If you still see 'expired', it means your NEW key also has issues
            print(f"Chatbot Error: {e}")
            return JsonResponse({'reply': f"Error: {str(e)}"}, status=500)
    
    return JsonResponse({'error': 'Invalid request'}, status=400)