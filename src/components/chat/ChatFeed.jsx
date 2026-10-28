import ChatMessage from "./ChatMessage";

/**
 * Renders the scrollable feed of chat messages and displays a typing indicator when waiting for an AI response.
 */
export default function ChatFeed({
  messages,
  isLoading,
  onApproveMeal,
  onDiscardMeal,
}) {
  return (
    <div className="chat-feed">
      {messages.map((msg, index) => (
        <ChatMessage
          key={index}
          message={msg}
          onApproveMeal={onApproveMeal}
          onDiscardMeal={onDiscardMeal}
        />
      ))}
      {isLoading && (
        <div className="typing-indicator" role="status">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="sr-only">Nourish is thinking...</span>
        </div>
      )}
    </div>
  );
}
