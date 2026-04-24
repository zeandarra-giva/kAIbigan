import { useState } from "react";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { counselorWorkspace } from "../mockData";
import { theme } from "../theme";

function CounselorMessages() {
  const [activeThread, setActiveThread] = useState(counselorWorkspace.messages[0]);
  const [replyText, setReplyText] = useState("");
  const [chatHistory, setChatHistory] = useState({
    Moonbeam: [{ sender: "student", text: "I felt the panic again before class.", time: "10:42 AM" }],
    Starling: [{ sender: "student", text: "Can we move tomorrow's slot to 4 PM?", time: "9:15 AM" }],
    Lumen: [{ sender: "student", text: "I tried the breathing script and it helped.", time: "Yesterday" }],
  });

  const handleSend = () => {
    if (!replyText.trim()) return;
    setChatHistory((current) => ({
      ...current,
      [activeThread.alias]: [
        ...(current[activeThread.alias] || []),
        { sender: "counselor", text: replyText, time: "Just now" }
      ]
    }));
    setReplyText("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 24 }}>
      <PageHeader title="Messages" subtitle="Asynchronous counseling threads with anonymous student aliases." />
      
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, flex: 1, minHeight: 500 }}>
        <Card title="Open threads" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", flex: 1 }}>
            {counselorWorkspace.messages.map((thread) => (
              <div 
                key={thread.alias} 
                onClick={() => setActiveThread(thread)}
                style={{ 
                  border: activeThread.alias === thread.alias ? `1px solid ${theme.primary}` : "1px solid rgba(0,0,0,0.07)", 
                  borderRadius: 14, 
                  padding: 14, 
                  background: activeThread.alias === thread.alias ? "rgba(126,214,162,0.1)" : "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{thread.alias}</strong>
                  <span style={{ fontSize: 12, color: "rgba(26,26,46,0.6)" }}>{thread.time}</span>
                </div>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(26,26,46,0.8)" }}>{thread.preview}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title={`Chat with ${activeThread.alias}`} style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", padding: "10px 0", minHeight: 300 }}>
            {(chatHistory[activeThread.alias] || []).map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.sender === "counselor" ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                <div style={{ 
                  background: msg.sender === "counselor" ? theme.primary : "#f1f3f5", 
                  color: msg.sender === "counselor" ? "#1a1a2e" : "inherit",
                  padding: "12px 16px", 
                  borderRadius: 18, 
                  borderBottomRightRadius: msg.sender === "counselor" ? 4 : 18,
                  borderBottomLeftRadius: msg.sender === "student" ? 4 : 18,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.5
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: 11, color: "rgba(26,26,46,0.5)", marginTop: 4, textAlign: msg.sender === "counselor" ? "right" : "left", fontFamily: "'DM Sans', sans-serif" }}>
                  {msg.time}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <input 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your reply to the student..." 
              style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)", outline: "none", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}
            />
            <button 
              onClick={handleSend}
              style={{ padding: "0 24px", borderRadius: 12, border: "none", background: theme.primary, color: "#1a1a2e", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              Send
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CounselorMessages;
