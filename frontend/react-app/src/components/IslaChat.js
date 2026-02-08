import React, { useState, useRef, useEffect } from 'react';

const IslaChat = ({ apiUrl, authToken, userEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m Isla, your AI job search assistant. Ask me anything about your applications, job search strategies, or career advice!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const token = await authToken();
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          userEmail: userEmail
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        sources: data.sources 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button className="isla-chat-bubble" onClick={() => setIsOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 13.93 2.6 15.71 3.63 17.19L2.05 21.95L7.08 20.42C8.48 21.29 10.18 21.8 12 21.8C17.52 21.8 22 17.32 22 11.8C22 6.28 17.52 2 12 2Z" fill="white"/>
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="isla-chat-window">
          <div className="isla-chat-header">
            <div className="isla-chat-title">
              <span className="isla-avatar">I</span>
              <div>
                <div className="isla-name">Isla AI</div>
                <div className="isla-status">Online</div>
              </div>
            </div>
            <button className="isla-close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="isla-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`isla-message ${msg.role}`}>
                {msg.role === 'assistant' && <span className="isla-avatar-small">I</span>}
                <div className="isla-message-content">
                  {msg.content}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="isla-sources">
                      <small>Sources: {msg.sources.join(', ')}</small>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="isla-message assistant">
                <span className="isla-avatar-small">I</span>
                <div className="isla-message-content isla-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="isla-chat-input">
            <input
              type="text"
              placeholder="Ask Isla anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default IslaChat;
