import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../services/chatApi.js";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition.js";
import { speakText } from "../hooks/useSpeechSynthesis.js";

function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([{ role: "model", text: "Hi! I'm your AI assistant. Ask me anything, by typing or by voice." }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const buildHistory = (msgs) => {
    const firstUserIndex = msgs.findIndex((m) => m.role === "user");
    if (firstUserIndex === -1) return [];
    return msgs.slice(firstUserIndex).map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend ?? input).trim();
    if (!text || isLoading) return;
    const historyBeforeThisMessage = buildHistory(messages);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsLoading(true);
    try {
      const reply = await sendMessage(text, historyBeforeThisMessage);
      setMessages((prev) => [...prev, { role: "model", text: reply }]);
      if (voiceReplyEnabled) speakText(reply);
    } catch {
      setMessages((prev) => [...prev, { role: "model", text: "Sorry, I couldn't reach the server. Is it running?" }]);
    } finally { setIsLoading(false); }
  };

  const { startListening, isListening, isSupported } = useSpeechRecognition((transcript) => {
    setInput(transcript);
    handleSend(transcript);
  });

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="assistant-identity"><span className="assistant-mark">✦</span><span><strong>CampusAI</strong><small>Online · Ready to help</small></span></div>
        <button className="close-btn" onClick={onClose} aria-label="Close chat">×</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, i) => <div key={i} className={`chat-bubble ${msg.role}`}>{msg.text}</div>)}
        {isLoading && <div className="chat-bubble model typing">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-row">
        <button className={`mic-btn ${isListening ? "listening" : ""}`} onClick={startListening} title={isSupported ? "Speak your message" : "Voice input not supported in this browser"} disabled={isLoading}><span aria-hidden="true">🎙</span></button>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder={isListening ? "Listening..." : "Type your message..."} disabled={isLoading} />
        <button className="send-btn" onClick={() => handleSend()} disabled={isLoading}><span aria-hidden="true">↑</span><span className="send-label">Send</span></button>
      </div>
      <label className="voice-toggle"><input type="checkbox" checked={voiceReplyEnabled} onChange={(e) => setVoiceReplyEnabled(e.target.checked)} />Read replies aloud</label>
    </div>
  );
}

export default ChatWindow;
