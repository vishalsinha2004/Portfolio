import os
import google.generativeai as genai
from django.shortcuts import render # Make sure this import is here
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Your existing Gemini configuration
genai.configure(api_key="AIzaSyDuw_Rhhu6MAG9ttfgJqGPxvqhz_7-IVCs")

model = genai.GenerativeModel('gemini-2.5-flash')
# ADD THIS BACK: The home view for your portfolio
def home(request):
    return render(request, 'core/index.html')

@csrf_exempt
def chatbot_response(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_message = data.get('message')

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
1. MarkAI: An AI-powered desktop voice assistant using Gemini LLM and OpenCV.
2. MyPDF.AI: A RAG-based chatbot that lets users interact with PDF documents using FAISS embeddings.
3. Face Recognition Attendance System: A real-time system built with DeepFace and OpenPyXL.
4. Finder: A full-stack note-sharing platform integrated with the Gemini API.

TONE AND BEHAVIOR:
- Be professional, technically knowledgeable, and friendly.
- If asked about his experience, mention his internship at TECHMICRE (June-July 2025).
- Always encourage the user to view his GitHub (github.com/vishalsinha2004) or LinkedIn.
"""
        try:
            response = model.generate_content(f"{system_context}\nUser: {user_message}")
            return JsonResponse({'reply': response.text})
        except Exception as e:
            print(f"Chatbot Error: {e}")
            return JsonResponse({'reply': "I'm having trouble connecting right now. Please try again later!"}, status=500)