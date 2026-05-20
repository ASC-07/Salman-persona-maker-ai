import { useState, useRef, useEffect } from "react";

const SUGGESTIONS = [
  "Bhai, relationship advice do 🙏",
  "Gym motivation chahiye!",
  "Life me kya important hai?",
  "Shaadi kab karoge? 😂",
  "Tera favourite dialogue kya hai?",
  "Dil saaf kaise rakhe?",
];

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "4px 2px" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7, height: 7,
            borderRadius: "50%",
            background: "#c9a84c",
            opacity: 0.6,
            display: "inline-block",
            animation: `sk-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 10,
        alignItems: "flex-end",
        animation: "fadeUp 0.3s ease forwards",
        opacity: 0,
      }}
    >
      {/* Avatar */}
      {!isUser && (
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #3a2a0a, #1a1200)",
          border: "2px solid #c9a84c",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: "0 0 12px rgba(201,168,76,0.25)",
          marginBottom: 2,
        }}>
          😎
        </div>
      )}

      {/* Bubble */}
      <div style={{
        maxWidth: "72%",
        padding: "11px 15px",
        borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
        background: isUser
          ? "linear-gradient(135deg, #2a2210, #1e1a0c)"
          : "#141210",
        border: isUser ? "1px solid #3a3010" : "1px solid #1e1a10",
        color: isUser ? "#e8dfc0" : "#f0ece0",
        fontSize: 14.5,
        lineHeight: 1.65,
        letterSpacing: 0.2,
        wordBreak: "break-word",
      }}>
        {msg.typing ? <TypingDots /> : msg.content}
      </div>

      {isUser && (
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          background: "#1a1a1a", border: "1.5px solid #2e2e2e",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, marginBottom: 2,
        }}>
          🧑
        </div>
      )}
    </div>
  );
}

export default function SalmanChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  async function send(text) {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = { role: "user", content: msg, id: Date.now() };
    const typingMsg = { role: "bot", content: "", typing: true, id: "typing" };

    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setLoading(true);

    try {
      const res = await fetch("https://salman-khan-persona-maker-ai-ocwu.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
      });
      const data = await res.json();
      const reply = data.reply || "Yaar… kuch error aa gaya.";

      setHistory((h) => [
        ...h,
        { role: "user", content: msg },
        { role: "assistant", content: reply },
      ]);
      setMessages((prev) =>
        prev.filter((m) => m.id !== "typing").concat({
          role: "bot", content: reply, id: Date.now() + 1,
        })
      );
    } catch (err) {
      setMessages((prev) =>
        prev.filter((m) => m.id !== "typing").concat({
          role: "bot",
          content: `Error: ${err.message}. Flask server chal raha hai? (localhost:5000)`,
          id: Date.now() + 1,
        })
      );
    }
    setLoading(false);
    inputRef.current?.focus();
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const showWelcome = messages.length === 0;

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      background: "#090909", color: "#f0ece0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sk-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%            { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        textarea { scrollbar-width: none; }
        textarea::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 24px",
        background: "#0f0f0f",
        borderBottom: "1px solid #1e1e1e",
        flexShrink: 0,
      }}>
        {/* Avatar with glow ring */}
        <div style={{ position: "relative" }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "linear-gradient(135deg, #3a2a0a, #1a1200)",
            border: "2px solid #c9a84c",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24,
            boxShadow: "0 0 0 4px rgba(201,168,76,0.1), 0 0 20px rgba(201,168,76,0.2)",
          }}>😎</div>
          <span style={{
            position: "absolute", bottom: 1, right: 1,
            width: 11, height: 11, borderRadius: "50%",
            background: "#4ade80",
            border: "2px solid #0f0f0f",
            animation: "pulse 2s infinite",
          }} />
        </div>

        <div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 24, letterSpacing: 3,
            color: "#c9a84c", lineHeight: 1, margin: 0,
          }}>Salman Khan</h1>
          <p style={{ fontSize: 12, color: "#5a5040", margin: "3px 0 0", letterSpacing: 0.4 }}>
            Being Human · Bhai is online
          </p>
        </div>

        {/* Gold divider accent */}
        <div style={{
          marginLeft: "auto", height: 32, width: 1,
          background: "linear-gradient(180deg, transparent, #c9a84c40, transparent)",
        }} />
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 11, color: "#3a3020", margin: 0 }}>AI Persona</p>
          <p style={{ fontSize: 11, color: "#3a3020", margin: "2px 0 0" }}>For entertainment</p>
        </div>
      </header>

      {/* ── CHAT AREA ── */}
      <div
        ref={chatRef}
        style={{
          flex: 1, overflowY: "auto",
          padding: "28px 20px",
          display: "flex", flexDirection: "column", gap: 16,
        }}
      >
        {showWelcome ? (
          <div style={{ textAlign: "center", padding: "40px 20px", animation: "fadeUp 0.5s ease forwards" }}>
            {/* Big avatar */}
            <div style={{
              width: 80, height: 80, borderRadius: "50%", margin: "0 auto 20px",
              background: "linear-gradient(135deg, #3a2a0a, #1a1200)",
              border: "3px solid #c9a84c",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 40,
              boxShadow: "0 0 0 8px rgba(201,168,76,0.07), 0 0 40px rgba(201,168,76,0.15)",
            }}>😎</div>

            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 38, letterSpacing: 4,
              color: "#c9a84c", margin: "0 0 10px",
            }}>Bhai se Baat Karo</h2>

            <p style={{ color: "#5a5040", fontSize: 14, maxWidth: 320, margin: "0 auto 32px", lineHeight: 1.7 }}>
              Being Human ke sabse bade bhai se seedhi baat.<br />
              Koi drama nahi, seedha jawab milega. 💯
            </p>

            {/* Suggestion chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 500, margin: "0 auto" }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    background: "#111009",
                    border: "1px solid #2a2215",
                    color: "#9a8050",
                    fontSize: 13, padding: "9px 15px",
                    borderRadius: 20, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.2s",
                    lineHeight: 1.3,
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = "#1a1808";
                    e.target.style.borderColor = "#8a6e2e";
                    e.target.style.color = "#c9a84c";
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = "#111009";
                    e.target.style.borderColor = "#2a2215";
                    e.target.style.color = "#9a8050";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <Message key={msg.id} msg={msg} />
          ))
        )}
      </div>

      {/* ── INPUT BAR ── */}
      <div style={{
        padding: "14px 20px 18px",
        background: "#0f0f0f",
        borderTop: "1px solid #1a1a1a",
        flexShrink: 0,
      }}>
        {/* Gold shimmer line */}
        <div style={{
          height: 1, marginBottom: 14,
          background: "linear-gradient(90deg, transparent 0%, #c9a84c30 40%, #c9a84c50 50%, #c9a84c30 60%, transparent 100%)",
          backgroundSize: "400px 1px",
          animation: "shimmer 3s linear infinite",
        }} />

        <div style={{ display: "flex", gap: 10, maxWidth: 720, margin: "0 auto", alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKey}
            placeholder="Bhai se kuch poochho…"
            maxLength={500}
            rows={1}
            style={{
              flex: 1,
              background: "#111",
              border: "1px solid #252525",
              borderRadius: 12,
              color: "#f0ece0",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14.5,
              padding: "11px 15px",
              resize: "none",
              outline: "none",
              lineHeight: 1.5,
              maxHeight: 120,
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "#8a6e2e"}
            onBlur={e => e.target.style.borderColor = "#252525"}
          />

          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: loading || !input.trim() ? "#1e1a0a" : "#c9a84c",
              border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, transform 0.1s",
            }}
            onMouseEnter={e => { if (!loading && input.trim()) e.currentTarget.style.background = "#d4b060"; }}
            onMouseLeave={e => { if (!loading && input.trim()) e.currentTarget.style.background = "#c9a84c"; }}
            onMouseDown={e => { e.currentTarget.style.transform = "scale(0.94)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={loading || !input.trim() ? "#3a3020" : "#0a0a0a"}>
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#2a2520", marginTop: 10, letterSpacing: 0.3 }}>
          Enter to send · Shift+Enter for new line · AI persona for entertainment only
        </p>
      </div>
    </div>
  );
}
