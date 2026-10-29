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
      {messages.length === 0 && !isLoading && (
        <div className="chat-empty">
          <img
            src={`${import.meta.env.BASE_URL}img/icon-sm.png`}
            alt=""
            width="72"
            height="72"
          />
          <h2>What have you eaten today?</h2>
          <p>
            Type it like you'd say it, like "oats with blueberries for
            breakfast." Add a walk or workout and I'll estimate that too.
          </p>
        </div>
      )}
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
