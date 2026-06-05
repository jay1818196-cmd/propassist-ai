import { useState, useRef, useEffect } from "react";
const API_KEY = "YOUR_ANTHROPIC_API_KEY_HERE";
const SYSTEM_PROMPT = `You are PropAssist, a professional real estate customer support AI for premium Indian real estate companies. Reply to customer inquiries in a warm, confident, and professional tone. Rules: Keep replies under 120 words. Always address the customer's concern clearly. If asking about pricing, say prices vary by unit type and offer to schedule a site visit. If asking about availability, mention units are limited and encourage prompt action. If asking about location/amenities, highlight key value points. End every reply by offering a site visit or callback. Sign off as: "— Team PropAssist 🏠". Never make up specific prices or exact addresses.`;
const EXAMPLES = [
  { icon: "💰", label: "Pricing", text: "What is the price of a 2BHK flat?" },
  { icon: "✅", label: "RERA", text: "Is this project RERA approved?" },
  { icon: "🏊", label: "Amenities", text: "What amenities does the society have?" },
  { icon: "🚇", label: "Location", text: "How far is it from the metro station?" },
  { icon: "🔑", label: "Ready Units", text: "Are there any ready-to-move-in flats?" },
  { icon: "🅿️", label: "Parking", text: "Is covered parking included?" },
];
export default function App() {
  const [screen, setScreen] = useState("home");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  function now() { return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
  async function sendMessage(text) {
    const q = text || query;
    if (!q.trim()) return;
    setQuery(""); setScreen("chat");
    setMessages((prev) => [...prev, { role: "user", text: q, time: now() }]);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 300, system: SYSTEM_PROMPT, messages: [{ role: "user", content: q }] }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, try again.";
      setMessages((prev) => [...prev, { role: "ai", text: reply, time: now() }]);
    } catch { setMessages((prev) => [...prev, { role: "ai", text: "Connection error. Check API key.", time: now() }]); }
    setLoading(false);
  }
  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh", background:"#1a1a2e", fontFamily:"'Segoe UI',sans-serif" }}>
      <div style={{ width:"390px", height:"844px", background:"#0f0f0f", borderRadius:"44px", overflow:"hidden", boxShadow:"0 40px 80px rgba(0,0,0,0.6)", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"14px 24px 0", display:"flex", justifyContent:"space-between", flexShrink:0 }}>
          <span style={{ fontSize:"13px", fontWeight:"600", color:"#fff" }}>9:41</span>
          <div style={{ width:"120px", height:"30px", background:"#000", borderRadius:"20px" }} />
          <span style={{ fontSize:"11px", color:"#fff" }}>●●●</span>
        </div>
        <div style={{ padding:"12px 20px 14px", borderBottom:"1px solid #1a1a1a", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            {screen !== "home" && <button onClick={() => setScreen("home")} style={{ background:"none", border:"none", color:"#c9a84c", fontSize:"20px", cursor:"pointer" }}>‹</button>}
            <div style={{ width:"34px", height:"34px", background:"linear-gradient(135deg,#c9a84c,#f0d060)", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>🏠</div>
            <div>
              <div style={{ fontSize:"15px", fontWeight:"700", color:"#fff" }}>PropAssist AI</div>
              <div style={{ fontSize:"10px", color:"#4caf77" }}>● Always Online</div>
            </div>
          </div>
          {messages.length > 0 && <button onClick={() => { setMessages([]); setScreen("home"); }} style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:"8px", color:"#888", fontSize:"11px", padding:"5px 10px", cursor:"pointer" }}>New Chat</button>}
        </div>
        {screen === "home" && (
          <div style={{ flex:1, overflowY:"auto", padding:"20px" }}>
            <div style={{ background:"linear-gradient(135deg,#1a1200,#2a1e00)", border:"1px solid #3a2a00", borderRadius:"16px", padding:"20px", marginBottom:"20px" }}>
              <div style={{ fontSize:"28px", marginBottom:"8px" }}>👋</div>
              <div style={{ fontSize:"17px", fontWeight:"700", color:"#f0d060", marginBottom:"6px" }}>Hello! I'm PropAssist</div>
              <div style={{ fontSize:"13px", color:"#aaa", lineHeight:"1.6" }}>Your AI-powered real estate support agent. Ask me anything!</div>
            </div>
            <div style={{ fontSize:"11px", letterSpacing:"0.12em", textTransform:"uppercase", color:"#555", marginBottom:"12px" }}>Quick Questions</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"24px" }}>
              {EXAMPLES.map((ex) => (
                <button key={ex.label} onClick={() => sendMessage(ex.text)} style={{ background:"#151515", border:"1px solid #222", borderRadius:"12px", padding:"14px 12px", textAlign:"left", cursor:"pointer", display:"flex", flexDirection:"column", gap:"6px" }}>
                  <span style={{ fontSize:"20px" }}>{ex.icon}</span>
                  <span style={{ fontSize:"12px", fontWeight:"600", color:"#ddd" }}>{ex.label}</span>
                  <span style={{ fontSize:"10px", color:"#666", lineHeight:"1.4" }}>{ex.text}</span>
                </button>
              ))}
            </div>
            <div style={{ background:"#111", border:"1px solid #1a1a1a", borderRadius:"14px", padding:"16px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", textAlign:"center" }}>
              {[["24/7","Available"],["< 3s","Response"],["100%","Professional"]].map(([v,l]) => (
                <div key={l}><div style={{ fontSize:"16px", fontWeight:"700", color:"#c9a84c" }}>{v}</div><div style={{ fontSize:"10px", color:"#555" }}>{l}</div></div>
              ))}
            </div>
          </div>
        )}
        {screen === "chat" && (
          <div style={{ flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:"12px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display:"flex", flexDirection:msg.role==="user"?"row-reverse":"row", alignItems:"flex-end", gap:"8px" }}>
                {msg.role === "ai" && <div style={{ width:"28px", height:"28px", background:"linear-gradient(135deg,#c9a84c,#f0d060)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0 }}>🏠</div>}
                <div style={{ maxWidth:"78%" }}>
                  <div style={{ background:msg.role==="user"?"linear-gradient(135deg,#c9a84c,#e8b84c)":"#1a1a1a", color:msg.role==="user"?"#0a0a0a":"#ddd", borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"12px 14px", fontSize:"13px", lineHeight:"1.6", border:msg.role==="ai"?"1px solid #2a2a2a":"none" }}>{msg.text}</div>
                  <div style={{ fontSize:"10px", color:"#444", marginTop:"4px", textAlign:msg.role==="user"?"right":"left" }}>{msg.time}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", alignItems:"flex-end", gap:"8px" }}>
                <div style={{ width:"28px", height:"28px", background:"linear-gradient(135deg,#c9a84c,#f0d060)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>🏠</div>
                <div style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:"18px 18px 18px 4px", padding:"14px 18px", display:"flex", gap:"5px" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#c9a84c", animation:"bounce 1.2s ease infinite", animationDelay:`${i*0.2}s` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
        <div style={{ padding:"12px 16px 24px", background:"#0f0f0f", borderTop:"1px solid #1a1a1a", flexShrink:0 }}>
          <div style={{ display:"flex", gap:"10px", alignItems:"flex-end" }}>
            <div style={{ flex:1, background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:"22px", padding:"10px 16px" }}>
              <textarea value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}} placeholder="Ask about any property..." rows={1} style={{ width:"100%", background:"none", border:"none", outline:"none", color:"#eee", fontSize:"14px", resize:"none", fontFamily:"inherit" }} />
            </div>
            <button onClick={() => sendMessage()} disabled={loading||!query.trim()} style={{ width:"44px", height:"44px", background:loading||!query.trim()?"#1a1a1a":"linear-gradient(135deg,#c9a84c,#f0d060)", border:"none", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", cursor:loading||!query.trim()?"not-allowed":"pointer", fontSize:"18px", flexShrink:0 }}>
              {loading?"⏳":"↑"}
            </button>
          </div>
          <div style={{ fontSize:"10px", color:"#333", textAlign:"center", marginTop:"8px" }}>PropAssist AI · Powered by Claude</div>
        </div>
      </div>
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}*{box-sizing:border-box}::-webkit-scrollbar{width:0}`}</style>
    </div>
  );
  }
