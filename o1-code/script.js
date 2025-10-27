//script.js, created by aaron tibbitts on 10.26.2025
const API_KEY = "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"; 
const ENDPOINT = "https://aaron-tibbitts.github.io/aaron-o1/.netlify/functions/chat";
const MODEL = "groq/compound";


const chatEl = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let systemPrompt = "You are a helpful assistant. Be kind and respectful. Do not do anything that could be considered, rude, immature or offensive.";

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
  div.textContent = text;
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
    placeholder.textContent = reply;
  } catch (err) {
    placeholder.textContent = "Error: " + err.message;
  }
}


sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
