function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
];
let roleIndex = 0;
let charIndex = 0;
const textEl = document.getElementById("animated-text");

function typeEffect() {
  if (charIndex <= roles[roleIndex].length) {
    textEl.textContent = roles[roleIndex].substring(0, charIndex++);
    setTimeout(typeEffect, 100);
  } else {
    setTimeout(eraseEffect, 2000);
  }
}

function eraseEffect() {
  if (charIndex >= 0) {
    textEl.textContent = roles[roleIndex].substring(0, charIndex--);
    setTimeout(eraseEffect, 60);
  } else {
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeEffect, 200);
  }
}

document.addEventListener("DOMContentLoaded", typeEffect);

// Dark / light mode
const btn = document.getElementById("modeToggle");
const btn2 = document.getElementById("modeToggle2");
const themeIcons = document.querySelectorAll(".icon");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
  setDarkMode();
}

btn.addEventListener("click", function () {
  setTheme();
});

btn2.addEventListener("click", function () {
  setTheme();
});

function setTheme() {
  let currentTheme = document.body.getAttribute("theme");
  if (currentTheme === "dark") {
    setLightMode();
  } else {
    setDarkMode();
  }
}

function setDarkMode() {
  document.body.setAttribute("theme", "dark");
  localStorage.setItem("theme", "dark");
  themeIcons.forEach((icon) => {
    icon.src = icon.getAttribute("src-dark");
  });
}

function setLightMode() {
  document.body.removeAttribute("theme");
  localStorage.setItem("theme", "light");
  themeIcons.forEach((icon) => {
    icon.src = icon.getAttribute("src-light");
  });
}
// AI CHATBOT LOGIC - Client-side only version
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isLoading = false;
        
        this.initialMessage = {
            sender: 'bot',
            text: "✨ Hello! I'm Vishal's AI assistant. I'm here to help you learn more about his experience and expertise. What would you like to know?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestions: [
                "What are your technical skills?",
                "Tell me about your projects",
                "What's your educational background?",
                "How can I contact you?"
            ]
        };
        
        this.knowledgeBase = {
            skills: {
                frontend: "HTML, CSS, JavaScript, React - All experienced level",
                backend: "Python, Java (Experienced), Node.js, SQL (Basic)",
                datascience: "Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, Jupyter Notebook",
                tools: "Firebase, Git, GitHub"
            },
            projects: {
                finderai: "FinderAI is a note-sharing platform with AI-powered search and organization. Users can create, share, and find notes easily using advanced AI capabilities.",
                project2: "A full-stack web application showcasing modern UI/UX design and responsive development.",
                project3: "Data science project analyzing datasets and creating predictive models."
            },
            education: "Currently pursuing B.C.A (Bachelor of Computer Applications) with strong focus on full-stack development and data science.",
            experience: "As a fresher, I've built several real-world projects demonstrating my skills in frontend, backend, and data science. I'm eager to apply my knowledge in a professional setting.",
            contact: "You can reach Vishal at vishalsinha6567@gmail.com or connect on LinkedIn. He's open to internship and entry-level opportunities."
        };
        
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.addMessage(this.initialMessage);
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div id="chatbot-root">
                <button class="chatbot-toggle">
                    <img src="ai.png" alt="AI Assistant" class="icon" />
                </button>
                <div class="chatbot-panel">
                    <div class="chatbot-header">
                        <h3>Vishal's AI Assistant</h3>
                        <button class="chatbot-close">&times;</button>
                    </div>
                    <div class="chatbot-messages"></div>
                    <div class="chatbot-input-area">
                        <form class="chatbot-form">
                            <input type="text" class="chatbot-input" placeholder="Ask about Vishal's skills, projects, or experience..." autocomplete="off" />
                            <button type="submit" class="chatbot-send">Send</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        this.messagesContainer = document.querySelector('.chatbot-messages');
        this.panel = document.querySelector('.chatbot-panel');
        this.toggleBtn = document.querySelector('.chatbot-toggle');
        this.closeBtn = document.querySelector('.chatbot-close');
        this.form = document.querySelector('.chatbot-form');
        this.input = document.querySelector('.chatbot-input');
    }

    bindEvents() {
        this.toggleBtn.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.close());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Close chatbot when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#chatbot-root') && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.panel.classList.toggle('open', this.isOpen);
        
        if (this.isOpen) {
            setTimeout(() => this.input.focus(), 300);
        }
    }

    close() {
        this.isOpen = false;
        this.panel.classList.remove('open');
    }

    async handleSubmit(e) {
        e.preventDefault();
        const message = this.input.value.trim();
        if (!message || this.isLoading) return;

        this.addMessage({
            sender: 'user',
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        this.input.value = '';
        this.showTypingIndicator();
        this.isLoading = true;

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = this.generateResponse(message);
            this.hideTypingIndicator();
            this.displayBotResponse(response);
        } catch (error) {
            console.error('Chatbot error:', error);
            this.hideTypingIndicator();
            this.addMessage({
                sender: 'bot',
                text: "⚠ I apologize for the inconvenience. Please feel free to contact Vishal directly at vishalsinha6567@gmail.com",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }
        
        this.isLoading = false;
    }

    generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('skill') || lowerMessage.includes('tech') || lowerMessage.includes('stack')) {
            return `Vishal has strong skills in multiple areas:\n\n🚀 Frontend: ${this.knowledgeBase.skills.frontend}\n🔧 Backend: ${this.knowledgeBase.skills.backend}\n📊 Data Science: ${this.knowledgeBase.skills.datascience}\n🛠️ Tools: ${this.knowledgeBase.skills.tools}\n\nHe's constantly learning and expanding his skill set!|||SUGGESTIONS|||["Tell me about your projects", "What's your experience?", "Show me your education"]`;
        }
        
        if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('work')) {
            return `Here are some of Vishal's key projects:\n\n📝 FinderAI: ${this.knowledgeBase.projects.finderai}\n\n🌐 Project 2: ${this.knowledgeBase.projects.project2}\n\n📈 Project 3: ${this.knowledgeBase.projects.project3}\n\nYou can view these projects in the portfolio section above!|||SUGGESTIONS|||["What technologies did you use?", "Tell me about your skills", "How can I see your code?"]`;
        }
        
        if (lowerMessage.includes('educat') || lowerMessage.includes('degree') || lowerMessage.includes('study')) {
            return `🎓 ${this.knowledgeBase.education}\n\nHe has developed strong foundations in computer science principles while gaining practical experience through projects.|||SUGGESTIONS|||["What are your technical skills?", "Tell me about your projects", "What's your experience level?"]`;
        }
        
        if (lowerMessage.includes('experience') || lowerMessage.includes('fresher') || lowerMessage.includes('job')) {
            return `💼 ${this.knowledgeBase.experience}\n\nDespite being a fresher, he has hands-on experience with real projects and is ready to contribute to professional teams.|||SUGGESTIONS|||["What projects have you built?", "What are your strongest skills?", "How can I contact you?"]`;
        }
        
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('hire') || lowerMessage.includes('reach')) {
            return `📧 ${this.knowledgeBase.contact}\n\nVishal is particularly interested in roles involving full-stack development, data science, and AI integration. He's excited to discuss potential opportunities!|||SUGGESTIONS|||["What are your salary expectations?", "When can you start?", "Tell me about your projects"]`;
        }
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return `👋 Hello! I'm Vishal's AI assistant. I can tell you about his technical skills, projects, education, and experience. What would you like to know?|||SUGGESTIONS|||["What are your skills?", "Tell me about your projects", "What's your background?"]`;
        }
        
        // Default response for unknown questions
        return `I'm here to help you learn about Vishal's professional background! \n\nI can tell you about his technical skills, projects, education, and experience. Try asking about specific areas like:\n\n• "What programming languages do you know?"\n• "Can you show me your projects?"\n• "Tell me about your education"\n• "What's your experience level?"\n\nOr feel free to ask anything else!|||SUGGESTIONS|||["What are your technical skills?", "Tell me about your projects", "What's your educational background?"]`;
    }

    displayBotResponse(response) {
        const suggestionSeparator = '|||SUGGESTIONS|||';
        const suggestionIndex = response.indexOf(suggestionSeparator);
        let textPart = response;
        let suggestions = [];

        if (suggestionIndex !== -1) {
            textPart = response.substring(0, suggestionIndex);
            try {
                suggestions = JSON.parse(response.substring(suggestionIndex + suggestionSeparator.length).trim() || '[]');
            } catch (e) {
                console.error('Error parsing suggestions:', e);
            }
        }

        const messageBubbles = textPart.split('|||MSG|||').map(t => t.trim()).filter(Boolean);
        
        messageBubbles.forEach((text, index) => {
            setTimeout(() => {
                this.addMessage({
                    sender: 'bot',
                    text: text,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    suggestions: index === messageBubbles.length - 1 ? suggestions : []
                });
            }, index * 600);
        });
    }

    addMessage(messageData) {
        this.messages.push(messageData);
        
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${messageData.sender}-message`;
        
        const text = document.createElement('div');
        text.className = 'message-text';
        
        // Convert line breaks to HTML
        const formattedText = messageData.text.replace(/\n/g, '<br>');
        text.innerHTML = formattedText;
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = messageData.time;
        
        messageElement.appendChild(text);
        messageElement.appendChild(time);
        
        if (messageData.suggestions && messageData.suggestions.length > 0) {
            const suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'message-suggestions';
            
            messageData.suggestions.forEach(suggestion => {
                const suggestionBtn = document.createElement('button');
                suggestionBtn.className = 'suggestion-btn';
                suggestionBtn.textContent = suggestion;
                suggestionBtn.addEventListener('click', () => {
                    this.input.value = suggestion;
                    this.form.dispatchEvent(new Event('submit', { cancelable: true }));
                });
                suggestionsContainer.appendChild(suggestionBtn);
            });
            
            messageElement.appendChild(suggestionsContainer);
        }
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        this.typingIndicator = document.createElement('div');
        this.typingIndicator.className = 'typing-indicator';
        this.typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <span>AI is thinking...</span>
        `;
        this.messagesContainer.appendChild(this.typingIndicator);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.remove();
            this.typingIndicator = null;
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Remove any existing chatbot initialization
    setTimeout(() => {
        new Chatbot();
    }, 1000);
});