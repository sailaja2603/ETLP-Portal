import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import API from '../services/api';

const AITutorWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hello! I am your AI Learning Assistant. How can I help you with your studies today?' }
  ]);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const query = message.trim();
    if (!query || chatLoading) return;

    const userMsg = { sender: 'user', text: query };
    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');
    setChatLoading(true);

    try {
      const response = await API.post("/ai/chatbot", {
        message: query,
        context: {
          courseTitle: "Emerging Technologies Learning Portal"
        }
      });

      const replyText = response.data?.reply || "I'm sorry, I couldn't process that.";
      setChatHistory(prev => [...prev, { sender: 'bot', text: replyText }]);
    } catch (error) {
      console.error("AI Chatbot error:", error);
      setChatHistory(prev => [...prev, { 
        sender: 'bot', 
        text: "Sorry, I am having trouble connecting to the AI service right now. Please make sure the backend is running." 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const renderFormattedText = (text) => {
    if (!text) return null;

    // Split by code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        // Extract code and optional language
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const code = match ? match[2] : part.slice(3, -3);

        return (
          <pre key={index} style={{
            background: "rgba(0, 0, 0, 0.3)",
            padding: "10px",
            borderRadius: "6px",
            overflowX: "auto",
            fontSize: "11px",
            fontFamily: "Courier New, monospace",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            color: "#bae6fd",
            margin: "8px 0"
          }}>
            <code>{code}</code>
          </pre>
        );
      }

      // Process inline elements like headings, bold, bullet points
      const lines = part.split("\n");
      return (
        <div key={index}>
          {lines.map((line, lIdx) => {
            let content = line;
            
            // Headings
            if (content.startsWith("### ")) {
              return <h6 key={lIdx} style={{ color: "#818cf8", marginTop: "8px", marginBottom: "4px", fontWeight: "bold", fontSize: "13px" }}>{content.slice(4)}</h6>;
            }
            if (content.startsWith("## ")) {
              return <h5 key={lIdx} style={{ color: "#818cf8", marginTop: "8px", marginBottom: "4px", fontWeight: "bold", fontSize: "14px" }}>{content.slice(3)}</h5>;
            }
            
            // Bullet point
            const isBullet = content.startsWith("* ") || content.startsWith("- ");
            if (isBullet) {
              content = content.slice(2);
            }

            // Bold processing (**text**)
            const boldParts = content.split(/(\*\*.*?\*\*)/g);
            const formattedLine = boldParts.map((bp, bpIdx) => {
              if (bp.startsWith("**") && bp.endsWith("**")) {
                return <strong key={bpIdx} style={{ color: "#fff", fontWeight: "600" }}>{bp.slice(2, -2)}</strong>;
              }
              return bp;
            });

            if (isBullet) {
              return (
                <ul key={lIdx} style={{ margin: "2px 0", paddingLeft: "15px", listStyleType: "disc" }}>
                  <li style={{ fontSize: "13px", lineHeight: "1.4" }}>{formattedLine}</li>
                </ul>
              );
            }

            return line.trim() === "" ? null : (
              <p key={lIdx} style={{ margin: "4px 0", fontSize: "13px", lineHeight: "1.4" }}>
                {formattedLine}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="ai-widget-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="ai-chat-box"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="ai-chat-header">
              <h6><FaRobot /> AI Learning Assistant</h6>
              <button className="btn btn-sm btn-link text-white" onClick={() => setIsOpen(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="ai-chat-body">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`ai-msg ${msg.sender === 'bot' ? 'ai-msg-bot' : 'ai-msg-user'}`}>
                  {msg.sender === 'bot' ? renderFormattedText(msg.text) : msg.text}
                </div>
              ))}
              {chatLoading && (
                <div className="ai-msg ai-msg-bot" style={{ fontStyle: 'italic', opacity: 0.8 }}>
                  Thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <form onSubmit={handleSend} className="ai-chat-input">
              <input 
                type="text" 
                placeholder="Ask your AI tutor..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={chatLoading}
              />
              <button type="submit" className="btn btn-premium-indigo btn-sm" style={{borderRadius: '50%'}} disabled={chatLoading || !message.trim()}>
                <FaPaperPlane />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button className="ai-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>
    </div>
  );
};

export default AITutorWidget;
