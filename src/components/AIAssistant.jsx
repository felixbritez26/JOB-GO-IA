import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("aiChatHistory");

    if (!savedMessages) return [];

    try {
      return JSON.parse(savedMessages);
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("aiChatHistory", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (customMessage = null) => {
    const skills = JSON.parse(localStorage.getItem("skills")) || [];
    const textToSend =
      typeof customMessage === "string" ? customMessage : message;

    if (!textToSend.trim() || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: textToSend,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          skills: skills,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get assistant response");
      }

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: "I couldn't connect to the AI assistant. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setMessage("");
  };

  return (
    <section className="career-ai">
      <div className="career-ai-glow career-ai-glow-one"></div>
      <div className="career-ai-glow career-ai-glow-two"></div>

      <div className="career-ai-header">
        <div className="career-ai-brand">
          <div className="ai-orb">
            <div className="ai-orb-core"></div>
          </div>

          <div>
            <h2>
              AI Career <span>Assistant</span>
            </h2>
            <p>Your next career move starts here.</p>
          </div>
        </div>

        <div className="career-ai-actions">
          <div className="ai-online">
            <span></span>
            Online
          </div>

          <button
            className="ai-new-chat"
            onClick={startNewChat}
            disabled={loading}
          >
            <span>＋</span>
            New Chat
          </button>
        </div>
      </div>

      {messages.length === 0 && (
        <div className="ai-welcome">
          <h3>Let's find your next opportunity, Felix.</h3>
          <p>I can help you with:</p>

          <div className="ai-options">
            <button
              onClick={() =>
                handleSendMessage(
                  "Find junior full stack developer jobs that match React and Python.",
                )
              }
            >
              <span className="option-icon">⌕</span>

              <span>
                <strong>React + Python roles</strong>
                <small>Find the best full stack opportunities.</small>
              </span>
            </button>

            <button
              onClick={() =>
                handleSendMessage(
                  "Help me find junior full stack jobs in Miami or remote.",
                )
              }
            >
              <span className="option-icon">⌖</span>

              <span>
                <strong>Miami & remote</strong>
                <small>Explore local and remote opportunities.</small>
              </span>
            </button>

            <button
              onClick={() =>
                handleSendMessage(
                  "Help me prepare for a junior full stack developer interview.",
                )
              }
            >
              <span className="option-icon">▥</span>

              <span>
                <strong>Interview preparation</strong>
                <small>Practice questions and improve answers.</small>
              </span>
            </button>
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="ai-chat-messages">
          {messages.map((chatMessage, index) => (
            <div key={index} className={`ai-chat-row ${chatMessage.role}`}>
              <div className="ai-chat-avatar">
                {chatMessage.role === "user" ? "F" : "AI"}
              </div>

              <div className="ai-chat-bubble">
                <ReactMarkdown>{chatMessage.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="ai-chat-row assistant">
              <div className="ai-chat-avatar">AI</div>

              <div className="ai-chat-bubble ai-thinking">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="ai-quick-actions">
        <button
          onClick={() =>
            handleSendMessage("Help me find junior full stack developer jobs.")
          }
        >
          ⌕ Find jobs
        </button>

        <button
          onClick={() =>
            handleSendMessage(
              "Help me improve my resume for a full stack developer position.",
            )
          }
        >
          ▤ Review my resume
        </button>

        <button
          onClick={() =>
            handleSendMessage(
              "Give me a junior full stack developer mock interview.",
            )
          }
        >
          ♙ Practice an interview
        </button>
      </div>

      <div className="ai-input-wrapper">
        <div className="ai-attachment">⌕</div>

        <input
          type="text"
          placeholder="Ask anything about your career..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <button
          className="ai-send"
          onClick={() => handleSendMessage()}
          disabled={loading}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>

      <div className="ai-powered">✦ Powered by AI</div>
    </section>
  );
}

export default AIAssistant;
