import { useState } from "react";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);

    const messageToSend = message;
    setMessage("");

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
        }),
      });

      if (!response.ok) {
        console.error("Failed to get assistant response");
        return;
      }

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);
    }
  };

  return (
    <div className="ai-assistant">
      <h2>AI Career Assistant</h2>
      <p>Ask questions about jobs, skills, and your career.</p>

      <div className="ai-messages">
        {messages.map((chatMessage, index) => (
          <div className={`ai-message ${chatMessage.role}`} key={index}>
            {chatMessage.content}
          </div>
        ))}
      </div>

      <div className="ai-input-container">
        <input
          type="text"
          placeholder="Ask your AI career assistant..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />

        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default AIAssistant;
