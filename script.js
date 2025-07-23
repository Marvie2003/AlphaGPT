const chatForm = document.getElementById("chatForm");
const chatBox = document.getElementById("chatBox");
const submitBtn = document.getElementById("submitBtn");
const overlay = document.getElementById("overlay");



// Display the welcome message as the first AI response
window.addEventListener("DOMContentLoaded", () => {
  presentAI(welcomeMsg);
});

chatBox.addEventListener("input", enableOrDisableBtn);

chatForm.addEventListener("submit", handleSubmit);

function enableOrDisableBtn() {
  const userInput = chatBox.value.trim();
  submitBtn.disabled = userInput === "";
}

function handleSubmit(event) {
  event.preventDefault();
  const userInput = chatBox.value.trim();
  if (!userInput) return;

  presentUSER(userInput);
  chatBox.value = "";
  enableOrDisableBtn();
  commenceLoading();

  // Prepare the data to send to the API
  const formData = new FormData();
  formData.append("prompt", userInput);

  const API_URL = "https://zalphagpt-api.vercel.app/api";

  // Send request to the server
  fetch(API_URL, {
    method: "POST",
    body: formData,
  })
    .then(async (res) => {
      if (res.ok === true) {
        console.log("successful");
        const result = await res.text();

const cleanResult = result.replace(/<\/?p>/gi, "").trim();

presentAI(cleanResult);

      } else {
        presentAI("⚠️ Error getting response from AlphaGPT.");
        enableOrDisableBtn();
        console.log("Error!");
      }
    })
    .catch((error) => {
      console.error("Server error:", error);
      presentAI("❌ Server error. Please try again later.");
    });
}




function presentUSER(prompt) {
  const userBubble = document.createElement("div");
  userBubble.className = "user_prompt";
  userBubble.textContent = prompt;
  overlay.appendChild(userBubble);
  scrollToBottom();
}

function commenceLoading() {
  const loadingBubble = document.createElement("div");
  loadingBubble.className = "ai_res";
  loadingBubble.id = "loadingBubble";

  const loadingDiv = document.createElement("div");
  loadingDiv.className = "loading";
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    loadingDiv.appendChild(dot);
  }

  loadingBubble.appendChild(loadingDiv);
  overlay.appendChild(loadingBubble);
  scrollToBottom();
}

function presentAI(response) {
  const loadingBubble = document.getElementById("loadingBubble");
  if (loadingBubble) {
    loadingBubble.remove();
  }

  const aiBubble = document.createElement("div");
  aiBubble.className = "ai_res";
  aiBubble.textContent = response;
  overlay.appendChild(aiBubble);
  scrollToBottom();
}

function scrollToBottom() {
  overlay.scrollTop = overlay.scrollHeight;
}

