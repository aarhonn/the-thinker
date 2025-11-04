//script.js, created by aaron tibbitts on 10.26.2025, updated on 2025-11-04
const API_KEY = "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"; 
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "groq/compound";

const chatEl = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let systemPrompt = "You are a helpful assistant. Be kind and respectful. Do not do anything that could be considered, rude, immature or offensive.";


function formatMessage(text) {
    
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');
    
    
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    
    return text;
}

fetch("./o1-code/prompt.txt")
    .then(res => res.text())
    .then(text => {
        systemPrompt = text.trim();
        appendMessage("ai", "Hello! Nice to meet you. My name is aaron-one. What's on your mind?");
    })
    .catch(err => {
        appendMessage("ai", "Error loading. Please refresh page.");
    });

function appendMessage(role, text) {
    const div = document.createElement("div");
    div.className = `message ${role}`;
    div.innerHTML = formatMessage(text); 
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    
    
    appendMessage("user", text);
    userInput.value = "";
    
    
    appendMessage("ai", "…");
    const placeholder = chatEl.lastChild;
    
    try {
        const res = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: text }
                ]
            })
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || "(no response)";
        placeholder.innerHTML = formatMessage(reply); 
    } catch (err) {
        placeholder.innerHTML = formatMessage("Error: " + err.message);
    }
}


sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});


function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
