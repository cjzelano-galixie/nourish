/**
 * Renders an individual chat message bubble for either the user or the AI, displaying nutrient estimates, encouraging notes, and approval actions.
 */
export default function ChatMessage({ message, onApproveMeal }) {
  const isUser = message.sender === "user";

  return (
    <div className={`chat-message ${isUser ? "user-message" : "ai-message"}`}>
      <div className="message-content">
        {isUser ? (
          <p>{message.text}</p>
        ) : (
          <div className="ai-response-card">
            <p className="ai-text">{message.text}</p>
            {message.meal && (
              <div className="meal-estimate-details">
                <h4>{message.meal.mealDescription}</h4>
                <p className="status-badge">Status: {message.meal.status}</p>
                <ul>
                  <li>Calories: {message.meal.calories} kcal</li>
                  <li>Protein: {message.meal.protein}g</li>
                  <li>Carbs: {message.meal.carbs}g</li>
                  <li>Fat: {message.meal.fat}g</li>
                  <li>Fiber: {message.meal.fiber}g</li>
                  <li>Sodium: {message.meal.sodium}mg</li>
                  <li>Potassium: {message.meal.potassium}mg</li>
                </ul>
                {message.meal.status === "pending" && (
                  <button
                    className="approve-meal-btn"
                    onClick={() => onApproveMeal(message.meal)}
                  >
                    Approve & Log Meal ✓
                  </button>
                )}
              </div>
            )}
            {message.encouragingNote && (
              <p className="encouraging-note">{message.encouragingNote}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
