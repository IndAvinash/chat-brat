import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #16161f;
    --border: rgba(255,255,255,0.08);
    --accent: #ff3cac;
    --text: #f0eeff;
    --muted: rgba(240,238,255,0.38);
    --user-bubble: #1e1328;
    --ai-bubble: #111118;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .chat-page {
    font-family: 'Syne', sans-serif;
    height: 90vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: var(--text);
  }

  /* ── HEADER ── */
  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 56px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .chat-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .chat-brand {
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
  }

  .chat-status {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00f5d4;
    box-shadow: 0 0 6px #00f5d4;
    animation: blink 2.5s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .chat-header-right {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .icon-btn {
    width: 32px;
    height: 32px;
    border-radius: 7px;
    background: none;
    border: 1px solid transparent;
    color: var(--muted);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
  }
  .icon-btn:hover {
    background: var(--surface);
    border-color: var(--border);
    color: var(--text);
  }

  /* ── MESSAGES ── */
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
    scroll-behavior: smooth;
  }

  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .msg-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 20px;
    max-width: 720px;
    width: 100%;
    margin: 0 auto;
  }

  .msg-row.user { align-items: flex-end; }
  .msg-row.ai   { align-items: flex-start; }

  .msg-sender {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 0 2px;
  }

  .msg-bubble {
    padding: 11px 15px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.65;
    max-width: 82%;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .msg-row.user .msg-bubble {
    background: var(--user-bubble);
    border: 1px solid rgba(255,60,172,0.15);
    border-bottom-right-radius: 4px;
    color: var(--text);
  }

  .msg-row.ai .msg-bubble {
    background: var(--ai-bubble);
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
    color: var(--text);
  }

  .msg-time {
    font-size: 10px;
    font-weight: 500;
    color: var(--muted);
    padding: 0 2px;
  }

  /* Typing indicator */
  .typing-bubble {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 13px 16px;
  }

  .typing-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--muted);
    animation: typingBounce 1.2s ease-in-out infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.18s; }
  .typing-dot:nth-child(3) { animation-delay: 0.36s; }

  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-5px); opacity: 1; }
  }

  /* Empty state */
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 40px 20px;
    text-align: center;
  }

  .empty-title {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
  }

  .empty-sub {
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    max-width: 260px;
    line-height: 1.6;
  }

  .empty-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-top: 16px;
    max-width: 480px;
  }

  .suggestion-chip {
    padding: 8px 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
  }
  .suggestion-chip:hover {
    border-color: rgba(255,60,172,0.3);
    color: var(--text);
    background: var(--surface2);
  }

  /* ── INPUT ── */
  .chat-input-area {
    border-top: 1px solid var(--border);
    padding: 14px 20px;
    flex-shrink: 0;
  }

  .chat-input-wrap {
    max-width: 720px;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    gap: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px 12px;
    transition: border-color 0.15s;
  }

  .chat-input-wrap:focus-within {
    border-color: rgba(255,255,255,0.16);
  }

  .chat-textarea {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    resize: none;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    caret-color: var(--accent);
    line-height: 1.55;
    max-height: 140px;
    overflow-y: auto;
  }

  .chat-textarea::placeholder { color: var(--muted); }
  .chat-textarea::-webkit-scrollbar { width: 3px; }
  .chat-textarea::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  .send-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: var(--accent);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: opacity 0.15s, transform 0.15s;
  }
  .send-btn:hover:not(:disabled) { opacity: 0.85; transform: scale(1.05); }
  .send-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  .input-hint {
    text-align: center;
    font-size: 11px;
    font-weight: 500;
    color: var(--muted);
    margin-top: 8px;
    max-width: 720px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 600px) {
    .msg-bubble { max-width: 92%; }
  }
`;

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
  apiKey?: string;
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
      const history = [...messages, userMsg].map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are chat-brat — a sharp, witty, and direct AI assistant. You give honest, no-fluff answers. Be concise but thorough. No corporate speak.",
          messages: history,
        }),
      });

      const data = await res.json();
      const aiText =
        data?.content?.map((b: { type: string; text?: string }) => b.type === "text" ? b.text : "").join("") ||
        "Something went wrong. Try again.";

      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: "ai", text: aiText, time: getTime() },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: "ai", text: "Connection error. Try again.", time: getTime() },
      ]);
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

  const handleNewChat = () => {
    if (loading) return;
    setMessages([]);
    setInput("");
  };

  return (
    <>
      <style>{styles}</style>

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
                <div className="msg-bubble">{msg.text}</div>
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