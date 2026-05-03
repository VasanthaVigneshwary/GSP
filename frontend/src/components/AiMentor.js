import React, { useState, useEffect, useRef } from 'react';
import aiService from '../services/aiService';
import '../styles/aiMentor.css';

const AiMentor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am your GSP AI Mentor. I've analyzed 40+ live events for you. How can I help your career today?", isAI: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, isAI: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiService.askAI(input);
      const aiMsg = { id: Date.now() + 1, text: response.data.answer, isAI: true };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errMsg = { id: Date.now() + 1, text: "I'm experiencing a high load of career queries. Please try again in a moment!", isAI: true };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`ai-mentor-wrapper ${isOpen ? 'open' : ''}`}>
      {/* Floating Toggle Button */}
      <button className="ai-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '🤖'}
        {!isOpen && <span className="notification-dot"></span>}
      </button>

      {/* Chat Window */}
      <div className="ai-chat-window">
        <div className="chat-header">
          <div className="ai-avatar">AI</div>
          <div>
            <h3>GSP Career Mentor</h3>
            <span className="status-indicator">Powered by RAG + Transformer</span>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message-bubble ${msg.isAI ? 'ai' : 'user'}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="message-bubble ai typing">
              <span></span><span></span><span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Ask about hackathons, XP, or career..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={!input.trim()}>🚀</button>
        </form>
      </div>
    </div>
  );
};

export default AiMentor;
