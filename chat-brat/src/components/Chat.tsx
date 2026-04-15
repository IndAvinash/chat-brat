import { useState, useEffect, useRef } from "react";
import { sendChatMessage } from "../services/api";
import Markdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  time: string;
}

const SUGGESTIONS = [
  "Explain quantum computing simply",
  "Write a cold email that converts",
  "Debug my thinking on a problem",
  "Give me a brutal honest review",
];

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

interface ChatProps {
  userName?: string;
}

export default function Chat({ userName = "You" }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
      time: getTime(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);
    
    try {
      const history = messages.map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));

      const response = await sendChatMessage(trimmed, history);
      
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        text: response.response,
        time: getTime(),
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        text: "Sorry, I encountered an error. Please try again.",
        time: getTime(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>

      <div className="chat-page">
        {/* Messages */}
        {messages.length === 0 && !loading ? (
          <div className="empty-state">
            <div className="empty-title">What's on your mind?</div>
            <div className="empty-sub">Ask anything. No filters, no fluff.</div>
            <div className="empty-suggestions">
              {SUGGESTIONS.map(s => (
                <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`msg-row ${msg.role}`}>
                <span className="msg-sender">{msg.role === "user" ? userName : "chat-brat"}</span>
                <div className="msg-bubble"><Markdown>{msg.text}</Markdown></div>
                <span className="msg-time">{msg.time}</span>
              </div>
            ))}
            {loading && (
              <div className="msg-row ai">
                <span className="msg-sender">chat-brat</span>
                <div className="msg-bubble typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <div className="chat-input-area">
          <div className="chat-input-wrap">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder="Message chat-brat..."
              rows={1}
              value={input}
              onChange={e => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              title="Send"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
          <div className="input-hint">Enter to send · Shift+Enter for new line</div>
        </div>
      </div>
    </>
  );
}