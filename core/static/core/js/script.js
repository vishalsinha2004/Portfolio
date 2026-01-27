/* ============================================================
   1. NAVIGATION & UI EFFECTS
   ============================================================ */

function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// Typing Effect for Profile Section
const roles = [
    "Frontend Developer",
    "Full Stack Developer",
    "Python Developer",
    "AI Integrator",
    "BCA Student @ Shreyarth"
];

let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
    const textElement = document.getElementById("animated-text");
    if (!textElement) return;

    const currentRole = roles[roleIndex];
    const displayText = isDeleting
        ? currentRole.substring(0, charIndex - 1)
        : currentRole.substring(0, charIndex + 1);

    textElement.textContent = displayText;
    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeEffect, 500);
    } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
}

/* ============================================================
   2. THEME MANAGEMENT (DARK/LIGHT MODE)
   ============================================================ */

const modeButtons = [document.getElementById("modeToggle"), document.getElementById("modeToggle2")];
const themeIcons = document.querySelectorAll(".icon");

function setTheme(theme) {
    if (theme === "dark") {
        document.body.setAttribute("theme", "dark");
        localStorage.setItem("theme", "dark");
        themeIcons.forEach(icon => {
            const darkSrc = icon.getAttribute("src-dark");
            if (darkSrc) icon.src = darkSrc;
        });
    } else {
        document.body.removeAttribute("theme");
        localStorage.setItem("theme", "light");
        themeIcons.forEach(icon => {
            const lightSrc = icon.getAttribute("src-light");
            if (lightSrc) icon.src = lightSrc;
        });
    }
}

// Initialize Theme
if (localStorage.getItem("theme") === "dark") setTheme("dark");

modeButtons.forEach(btn => {
    if (btn) btn.addEventListener("click", () => {
        const isDark = document.body.getAttribute("theme") === "dark";
        setTheme(isDark ? "light" : "dark");
    });
});

/* ============================================================
   3. PROFESSIONAL AI CHATBOT (DJANGO + LANGCHAIN)
   ============================================================ */

class PortfolioChatbot {
    constructor() {
        this.isOpen = false;
        this.isLoading = false;
        this.history = []; // Conversation Memory
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        // Welcome Message
        this.addMessage({
            sender: 'bot',
            text: "👋 **Hi, I'm Vishal's AI Assistant!** I can tell you about his projects, skills, or internship at TECHMICRE. How can I help you today?",
            suggestions: ["Tell me about your projects", "What are your skills?", "Contact Info"]
        });
    }

    createChatbotHTML() {
        const html = `
            <div id="chatbot-root">
                <button class="chatbot-toggle" aria-label="Open Chat">
                    <img src="/static/core/images/ai.png" alt="AI" class="icon" />
                </button>
                <div class="chatbot-panel">
                    <div class="chatbot-header">
                        <h3>Vishal AI Assistant</h3>
                        <button class="chatbot-close">&times;</button>
                    </div>
                    <div class="chatbot-messages"></div>
                    <div class="chatbot-input-area">
                        <form class="chatbot-form">
                            <input type="text" class="chatbot-input" placeholder="Type a message..." autocomplete="off" />
                            <button type="submit" class="chatbot-send">Send</button>
                        </form>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        this.messagesContainer = document.querySelector('.chatbot-messages');
        this.panel = document.querySelector('.chatbot-panel');
        this.input = document.querySelector('.chatbot-input');
    }

    bindEvents() {
        document.querySelector('.chatbot-toggle').addEventListener('click', () => this.toggle());
        document.querySelector('.chatbot-close').addEventListener('click', () => this.toggle());
        document.querySelector('.chatbot-form').addEventListener('submit', (e) => this.handleSubmit(e));
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.panel.classList.toggle('open', this.isOpen);
        if (this.isOpen) this.input.focus();
    }

    async handleSubmit(e) {
        e.preventDefault();
        const text = this.input.value.trim();
        if (!text || this.isLoading) return;

        this.input.value = '';
        this.addMessage({ sender: 'user', text });
        this.showTypingIndicator();
        this.isLoading = true;

        try {
            const response = await fetch('/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: this.history
                })
            });
            const data = await response.json();

            this.hideTypingIndicator();
            this.addMessage({ sender: 'bot', text: data.reply });

            // Update History for Memory
            this.history.push({ role: "user", content: text });
            this.history.push({ role: "assistant", content: data.reply });

        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage({ sender: 'bot', text: "❌ Sorry, I'm having trouble connecting to the server." });
        } finally {
            this.isLoading = false;
        }
    }

    addMessage({ sender, text, suggestions = [] }) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-text';

        // Check if marked is available before using it
        if (sender === 'bot') {
            if (typeof marked !== 'undefined') {
                contentDiv.innerHTML = marked.parse(text);
            } else {
                // Fallback to plain text if library didn't load
                contentDiv.textContent = text;
            }
        } else {
            contentDiv.textContent = text;
        }

        msgDiv.appendChild(contentDiv);

        if (suggestions.length > 0) {
            const sugCont = document.createElement('div');
            sugCont.className = 'message-suggestions';
            suggestions.forEach(s => {
                const btn = document.createElement('button');
                btn.className = 'suggestion-btn';
                btn.textContent = s;
                btn.onclick = () => {
                    this.input.value = s;
                    document.querySelector('.chatbot-form').dispatchEvent(new Event('submit'));
                };
                sugCont.appendChild(btn);
            });
            msgDiv.appendChild(sugCont);
        }

        this.messagesContainer.appendChild(msgDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        this.typingIndicator = document.createElement('div');
        this.typingIndicator.className = 'typing-indicator';
        this.typingIndicator.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        this.messagesContainer.appendChild(this.typingIndicator);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        if (this.typingIndicator) this.typingIndicator.remove();
    }
}

/* ============================================================
   4. INITIALIZATION
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    typeEffect();
    new PortfolioChatbot();
});