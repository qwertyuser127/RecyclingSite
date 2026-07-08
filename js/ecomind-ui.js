/* ============================================================
   EcoMind-01 — Chatbot UI & Interaction Layer
   Advanced glassmorphism design with accessibility features
   ============================================================ */
(function () {
  document.addEventListener("shellReady", init);

  function init() {
    const chatWindow = document.getElementById("chatWindow");
    if (!chatWindow) return;

    const chatMessage = document.getElementById("chatMessage");
    const chatSend = document.getElementById("chatSend");
    const chatClear = document.getElementById("chatClear");
    const suggestions = document.querySelectorAll(".chat-suggestions button");

    // Ensure EcoMind is loaded
    if (!window.EcoMind) {
      console.error("EcoMind engine not loaded");
      return;
    }

    window.EcoMind.init();

    let isLoading = false;

    function sanitizeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, m => map[m]);
    }

    function createMessageElement(text, isUser, confidence) {
      const msg = document.createElement("div");
      msg.className = `chat-message ${isUser ? 'user' : 'bot'}`;
      
      if (!isUser && confidence !== undefined) {
        const confidenceClass = confidence >= 0.9 ? 'confident' : confidence >= 0.7 ? 'likely' : 'uncertain';
        msg.classList.add(`confidence-${confidenceClass}`);
        
        // Add confidence badge
        const badge = document.createElement('span');
        badge.className = 'confidence-badge';
        const emoji = confidence >= 0.9 ? '✅' : confidence >= 0.7 ? '🤔' : '❓';
        badge.textContent = emoji;
        msg.appendChild(badge);
      }

      const content = document.createElement('div');
      content.className = 'message-content';
      
      // Convert markdown-like formatting to HTML (bold, lists)
      let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
      
      content.innerHTML = sanitizeHtml(formattedText).replace(/<br>/g, '<br>');
      msg.appendChild(content);

      // Add timestamp
      const time = document.createElement('span');
      time.className = 'message-time';
      time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      msg.appendChild(time);

      return msg;
    }

    function botReply(text, confidence) {
      const msg = createMessageElement(text, false, confidence);
      chatWindow.appendChild(msg);
      chatWindow.scrollTop = chatWindow.scrollHeight;
      
      // Add to conversation
      window.EcoMind.addMessage('bot', text);
    }

    function userReply(text) {
      const msg = createMessageElement(text, true);
      chatWindow.appendChild(msg);
      chatWindow.scrollTop = chatWindow.scrollHeight;
      
      // Add to conversation
      window.EcoMind.addMessage('user', text);
    }

    function validateInput(input) {
      if (!input || typeof input !== 'string') return null;
      const sanitized = input.trim().slice(0, 1000);
      if (sanitized.length === 0) return null;
      return sanitized;
    }

    function typingIndicator(show) {
      let el = document.getElementById("chatTyping");
      if (show) {
        if (!el) {
          el = document.createElement("div");
          el.id = "chatTyping";
          el.className = "chat-message bot typing-indicator";
          el.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
          chatWindow.appendChild(el);
          chatWindow.scrollTop = chatWindow.scrollHeight;
        }
      } else if (el) {
        el.remove();
      }
    }

    async function send(text) {
      const validated = validateInput(text);
      if (!validated || isLoading) return;

      userReply(validated);
      chatMessage.value = "";
      chatMessage.focus();

      isLoading = true;
      typingIndicator(true);

      // Simulate slight delay for natural feel
      await new Promise(resolve => setTimeout(resolve, 200));

      try {
        const result = window.EcoMind.query(validated);
        typingIndicator(false);
        isLoading = false;

        botReply(result.reply, result.confidence);

        // Show confidence if uncertain
        if (result.confidence <= 0.5 && result.confidence > 0) {
          setTimeout(() => {
            botReply("💡 Tip: Try asking differently or search for a specific item.", 0.5);
          }, 800);
        }
      } catch (error) {
        console.error("Chat error:", error);
        typingIndicator(false);
        isLoading = false;
        botReply("Sorry, something went wrong. Please try again.", 0);
      }
    }

    // Event listeners
    chatSend.addEventListener("click", () => send(chatMessage.value));
    chatMessage.addEventListener("keypress", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send(chatMessage.value);
      }
    });

    chatClear.addEventListener("click", () => {
      chatWindow.innerHTML = "";
      window.EcoMind.conversation = [];
      window.EcoMind.saveConversation();
      botReply("Chat cleared. Ask me about recycling in Malta!", 1);
    });

    // Suggestion buttons
    suggestions.forEach(btn => {
      btn.addEventListener("click", () => send(btn.textContent));
    });

    // Autocomplete
    chatMessage.addEventListener("input", () => {
      const value = chatMessage.value.toLowerCase();
      if (value.length > 2) {
        const suggestions = window.EcoMind.getAutocomplete(value, 3);
        // Could show autocomplete dropdown here
      }
    });

    // Initial greeting
    botReply("Hi! I'm EcoMind-01, your Smart Recycling assistant. 🌱\n\nAsk me about:\n• Any item (plastic bottle, glass jar, etc.)\n• Collection schedule for Malta\n• Preparation tips\n• Recycling categories\n• Fun facts!\n\nWhat would you like to know?", 1);
  }
})();
