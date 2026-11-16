import React, { useState, useRef, useEffect } from 'react';

const MockAIAssistant = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! I'm your restaurant assistant. I can help with menu recommendations, dietary information, and today's specials. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mockResponses = {
    'specials': "Today's specials include:\n• Chef's Special Pasta - $18\n• Grilled Salmon - $24\n• Seasonal Vegetable Medley - $16",
    'vegetarian': "We have excellent vegetarian options:\n• Margherita Pizza - $16\n• Garden Fresh Salad - $12\n• Vegetable Stir Fry - $15\n• Pasta Primavera - $17",
    'vegan': "Our vegan selections:\n• Vegan Burger - $14\n• Quinoa Salad - $13\n• Roasted Vegetable Plate - $16\n• Lentil Soup - $8",
    'gluten': "Gluten-free options (marked with GF):\n• GF Pizza - $17\n• Grilled Chicken with Rice - $19\n• Fresh Fruit Plate - $10\n• All salads can be made gluten-free",
    'recommend': "Based on popularity:\n1. Chef's Special Pasta\n2. Grilled Salmon\n3. Chocolate Lava Cake\n4. Craft Cocktails",
    'default': "I can help with:\n• Menu recommendations\n• Dietary information\n• Today's specials\n• Reservation details\n\nWhat would you like to know?"
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // This is to simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerInput = input.toLowerCase();
    let response = mockResponses.default;

    for (const [key, value] of Object.entries(mockResponses)) {
      if (lowerInput.includes(key)) {
        response = value;
        break;
      }
    }

    if (lowerInput.includes('menu') || lowerInput.includes('food')) {
      response = mockResponses.recommend;
    }

    const botMessage = { type: 'bot', text: response };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockRecs = [
      "Based on popular items: Try our Chef's Special Pasta",
      "Vegetarian recommendation: Mediterranean Salad with fresh ingredients",
      "Today's special: Grilled Salmon with seasonal vegetables"
    ];
    
    setRecommendations(mockRecs);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="ai-assistant">
      <h3>🤖 AI Restaurant Assistant</h3>
      
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="typing-indicator">AI is thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about menu, dietary info, or specials..."
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading}>
            Send
          </button>
        </div>
      </div>

      <div className="recommendations-section">
        <h4>Personalized Recommendations</h4>
        <button 
          onClick={handleGetRecommendations} 
          className="btn btn-secondary"
          disabled={isLoading}
        >
          Get Recommendations
        </button>
        
        {recommendations.length > 0 && (
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={index} className="recommendation-item">
                {rec}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MockAIAssistant;