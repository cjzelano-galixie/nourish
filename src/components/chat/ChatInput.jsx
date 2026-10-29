import { useState } from "react";

/**
 * Renders the chat input form to capture natural-language meal descriptions and optional photo references.
 */
export default function ChatInput({ onSendMessage, isLoading }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe your meal..."
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading || !message.trim()}>
        {isLoading ? "Analyzing..." : "Send"}
      </button>
    </form>
  );
}
