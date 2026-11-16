import React, { useState, useRef, useEffect } from 'react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! I'm your restaurant assistant. I can help with menu recommendations, dietary information, and today's specials. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
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
    'default': "I can help with:\n• Menu recommendations\n• Dietary information\n• Today's specials\n\nWhat would you like to know?"
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerInput = input.toLowerCase();
    let response = mockResponses.default;

    for (const [key, value] of Object.entries(mockResponses)) {
      if (lowerInput.includes(key)) {
        response = value;
        break;
      }
    }

    const botMessage = { type: 'bot', text: response };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
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
  );
};

export default ChatInterface;