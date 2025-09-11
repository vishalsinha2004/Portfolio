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

// AI CHATBOT LOGIC
document.addEventListener("DOMContentLoaded", () => {
  const chatWidgetButton = document.getElementById("chat-widget-button");
  const chatPanel = document.getElementById("chat-widget-panel");
  const closeChatBtn = document.getElementById("close-chat-btn");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatBody = document.querySelector(".chat-body");

  // Toggle chat panel
  chatWidgetButton.addEventListener("click", () => {
    chatPanel.classList.toggle("open");
  });

  closeChatBtn.addEventListener("click", () => {
    chatPanel.classList.remove("open");
  });

  // Handle chat form submission
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Display user message
    addMessage(userMessage, "user-message");
    chatInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    // Get response from AI
    try {
      const botResponse = await getGeminiResponse(userMessage);
      addMessage(botResponse, "bot-message");
    } catch (error) {
      console.error("Error getting response from AI:", error);
      addMessage(
        "Sorry, I'm having trouble connecting. Please try again later.",
        "bot-message"
      );
    }
    chatBody.scrollTop = chatBody.scrollHeight;
  });

  function addMessage(text, type) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", type);
    const p = document.createElement("p");
    p.textContent = text;
    messageElement.appendChild(p);
    chatBody.appendChild(messageElement);
  }

  // Gemini API integration
  async function getGeminiResponse(prompt) {
    const apiKey = "AIzaSyD0MJpiETfLw9nPkxdCEXlZn3i_usJ91Kw"; // <-- IMPORTANT: Replace with your actual API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const headers = {
      "Content-Type": "application/json",
    };

    const data = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.candidates[0].content.parts[0].text;
  }
});
