import { useState, useEffect } from "react";
import "./Chat.css";
import ChatFeed from "./ChatFeed";
import ChatInput from "./ChatInput";
import { aiChatMessage } from "../../services/aiService";
import { approveLog, deleteLog } from "../../services/logService";
import { useOutletContext } from "react-router-dom";

/**
 * Manages the core conversational chat state, API submissions to Gemini, meal log approvals, loading indicators, and error handling.
 */
export default function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessageText, setLastMessageText] = useState("");
  const { refreshLogs } = useOutletContext();

  const handleSendMessage = async (text) => {
    setError(null);
    setLastMessageText(text);

    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const pendingLog = await aiChatMessage(text);

      const aiMsg = {
        sender: "ai",
        text: `Here is what I found for "${text}":`,
        meal: {
          id: pendingLog.id,
          mealDescription: pendingLog.meal_description || text,
          status: pendingLog.status,
          calories: pendingLog.nutrients?.calories,
          protein: pendingLog.nutrients?.protein,
          carbs: pendingLog.nutrients?.carbs,
          fat: pendingLog.nutrients?.fat,
          fiber: pendingLog.nutrients?.fiber,
          sodium: pendingLog.nutrients?.sodium,
          potassium: pendingLog.nutrients?.potassium,
          caloriesBurned: pendingLog.calories_burned,
        },
        encouragingNote:
          pendingLog.encouragingNote || "Solid choice for your daily energy!",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err.message || "Failed to analyze meal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveMeal = async (meal) => {
    try {
      await approveLog(meal.id);
      await refreshLogs();
      setMessages((prev) =>
        prev.map((msg) =>
          msg.meal && msg.meal.id === meal.id
            ? { ...msg, meal: { ...msg.meal, status: "approved" } }
            : msg,
        ),
      );
    } catch (err) {
      setError(err.message || "Failed to approve meal log.");
    }
  };

  const handleDiscardMeal = async (meal) => {
    try {
      await deleteLog(meal.id);
      setMessages((prev) => prev.filter((m) => m.meal?.id !== meal.id));
    } catch (err) {
      setError(err.message || "Failed to discard meal.");
    }
  };

  const handleRetry = () => {
    if (lastMessageText) {
      handleSendMessage(lastMessageText);
    }
  };

  return (
    <div className="chat-container">
      <ChatFeed
        messages={messages}
        isLoading={isLoading}
        onApproveMeal={handleApproveMeal}
        onDiscardMeal={handleDiscardMeal}
      />
      {error && (
        <div className="chat-error-banner" role="alert">
          <p>{error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      )}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
