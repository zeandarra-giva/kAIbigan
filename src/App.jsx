import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   THEME DEFINITIONS
   ═══════════════════════════════════════════ */
const THEMES = {
    dark: {
        bg: "#1a1a2e",
        bgSecondary: "#16213e",
        surface: "rgba(255,255,255,0.04)",
        surfaceHover: "rgba(255,255,255,0.08)",
        border: "rgba(255,255,255,0.06)",
        text: "#ffffff",
        textSecondary: "rgba(255,255,255,0.5)",
        textTertiary: "rgba(255,255,255,0.3)",
        textMuted: "rgba(255,255,255,0.2)",
        chatBubbleAI: "rgba(255,255,255,0.08)",
        chatTextAI: "#e0e0e0",
        navBg: "rgba(26,26,46,0.95)",
        cardBorder: "rgba(255,255,255,0.06)",
        pillBg: "rgba(255,255,255,0.06)",
        pillBorder: "rgba(255,255,255,0.15)",
        pillText: "rgba(255,255,255,0.6)",
        inputBg: "rgba(255,255,255,0.06)",
        statusBar: "#ffffff",
        profileIcon: "rgba(255,255,255,0.06)",
    },
    light: {
        bg: "#F8F7F4",
        bgSecondary: "#FFFFFF",
        surface: "rgba(0,0,0,0.03)",
        surfaceHover: "rgba(0,0,0,0.06)",
        border: "rgba(0,0,0,0.07)",
        text: "#1a1a2e",
        textSecondary: "rgba(0,0,0,0.5)",
        textTertiary: "rgba(0,0,0,0.35)",
        textMuted: "rgba(0,0,0,0.15)",
        chatBubbleAI: "rgba(0,0,0,0.05)",
        chatTextAI: "#333333",
        navBg: "rgba(255,255,255,0.95)",
        cardBorder: "rgba(0,0,0,0.08)",
        pillBg: "rgba(0,0,0,0.04)",
        pillBorder: "rgba(0,0,0,0.12)",
        pillText: "rgba(0,0,0,0.55)",
        inputBg: "rgba(0,0,0,0.04)",
        statusBar: "#1a1a2e",
        profileIcon: "rgba(0,0,0,0.05)",
    },
};

const MOODS = [
    { name: "Joyful", color: "#FFD93D", blob: "#FFD93D" },
    { name: "Cheerful", color: "#FF9A76", blob: "#FF9A76" },
    { name: "Calm", color: "#7ED6A2", blob: "#7ED6A2" },
    { name: "Anxious", color: "#B39DDB", blob: "#B39DDB" },
    { name: "Sad", color: "#81D4FA", blob: "#81D4FA" },
    { name: "Angry", color: "#FF8A80", blob: "#FF8A80" },
];

const SCREENS = {
    SPLASH: "splash", WELCOME: "welcome", ONBOARD_MOOD: "onboard_mood",
    HOME: "home", MOOD_CHECK: "mood_check", AI_CHAT: "ai_chat",
    COACH_DIR: "coach_dir", MOOD_CALENDAR: "mood_calendar",
    RESOURCES: "resources", PROFILE: "profile",
};

/* ═══════════════════════════════════════════
   BLOB COMPONENTS
   ═══════════════════════════════════════════ */
function Blob({ mood, size = 120, face = "happy", animate = true }) {
    const color = mood?.blob || "#FFD93D";
    const fc = "#333";
    const faces = {
        happy: <><ellipse cx="38" cy="42" rx="5" ry="6" fill={fc} /><ellipse cx="62" cy="42" rx="5" ry="6" fill={fc} /><path d="M35 56 Q50 70 65 56" stroke={fc} strokeWidth="3" fill="none" strokeLinecap="round" /></>,
        sad: <><ellipse cx="38" cy="45" rx="5" ry="6" fill={fc} /><ellipse cx="62" cy="45" rx="5" ry="6" fill={fc} /><path d="M35 62 Q50 52 65 62" stroke={fc} strokeWidth="3" fill="none" strokeLinecap="round" /></>,
        angry: <><line x1="30" y1="35" x2="42" y2="40" stroke={fc} strokeWidth="2.5" strokeLinecap="round" /><line x1="70" y1="35" x2="58" y2="40" stroke={fc} strokeWidth="2.5" strokeLinecap="round" /><ellipse cx="38" cy="46" rx="4.5" ry="5.5" fill={fc} /><ellipse cx="62" cy="46" rx="4.5" ry="5.5" fill={fc} /><path d="M38 60 Q50 55 62 60" stroke={fc} strokeWidth="3" fill="none" strokeLinecap="round" /></>,
        calm: <><path d="M33 44 Q38 40 43 44" stroke={fc} strokeWidth="2.5" fill="none" strokeLinecap="round" /><path d="M57 44 Q62 40 67 44" stroke={fc} strokeWidth="2.5" fill="none" strokeLinecap="round" /><path d="M40 58 Q50 63 60 58" stroke={fc} strokeWidth="2.5" fill="none" strokeLinecap="round" /></>,
        anxious: <><ellipse cx="38" cy="42" rx="6" ry="7" fill="white" /><ellipse cx="62" cy="42" rx="6" ry="7" fill="white" /><ellipse cx="39" cy="43" rx="3" ry="3.5" fill={fc} /><ellipse cx="63" cy="43" rx="3" ry="3.5" fill={fc} /><ellipse cx="50" cy="62" rx="6" ry="5" fill={fc} /></>,
        cheerful: <><path d="M32 42 Q38 36 44 42" stroke={fc} strokeWidth="2.5" fill="none" strokeLinecap="round" /><path d="M56 42 Q62 36 68 42" stroke={fc} strokeWidth="2.5" fill="none" strokeLinecap="round" /><path d="M34 55 Q50 72 66 55" stroke={fc} strokeWidth="3" fill={fc} strokeLinecap="round" /></>,
    };
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={animate ? { animation: "blobFloat 3s ease-in-out infinite" } : {}}>
            <defs><filter id={`sh-${color.replace('#', '')}`}><feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={color} floodOpacity="0.3" /></filter></defs>
            <path d="M50 8 C72 8 90 20 92 42 C94 64 78 90 50 92 C22 90 6 64 8 42 C10 20 28 8 50 8Z" fill={color} filter={`url(#sh-${color.replace('#', '')})`} />
            {faces[face] || faces.happy}
        </svg>
    );
}

function MiniBlob({ color, face = "happy", size = 32 }) {
    const fc = "#333";
    const f = {
        happy: <><circle cx="40" cy="42" r="3" fill={fc} /><circle cx="60" cy="42" r="3" fill={fc} /><path d="M40 55 Q50 62 60 55" stroke={fc} strokeWidth="2.5" fill="none" strokeLinecap="round" /></>,
        sad: <><circle cx="40" cy="42" r="3" fill={fc} /><circle cx="60" cy="42" r="3" fill={fc} /><path d="M40 58 Q50 52 60 58" stroke={fc} strokeWidth="2.5" fill="none" strokeLinecap="round" /></>,
        calm: <><path d="M36 44 Q40 40 44 44" stroke={fc} strokeWidth="2" fill="none" /><path d="M56 44 Q60 40 64 44" stroke={fc} strokeWidth="2" fill="none" /><path d="M42 55 Q50 59 58 55" stroke={fc} strokeWidth="2" fill="none" /></>,
        angry: <><circle cx="40" cy="44" r="3" fill={fc} /><circle cx="60" cy="44" r="3" fill={fc} /><path d="M42 57 Q50 53 58 57" stroke={fc} strokeWidth="2.5" fill="none" /></>,
        anxious: <><circle cx="40" cy="42" r="4" fill="white" /><circle cx="60" cy="42" r="4" fill="white" /><circle cx="41" cy="43" r="2" fill={fc} /><circle cx="61" cy="43" r="2" fill={fc} /><ellipse cx="50" cy="58" rx="4" ry="3" fill={fc} /></>,
        cheerful: <><path d="M36 42 Q40 38 44 42" stroke={fc} strokeWidth="2" fill="none" /><path d="M56 42 Q60 38 64 42" stroke={fc} strokeWidth="2" fill="none" /><path d="M38 53 Q50 65 62 53" stroke={fc} strokeWidth="2" fill={fc} /></>,
    };
    return (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <path d="M50 8 C72 8 90 20 92 42 C94 64 78 90 50 92 C22 90 6 64 8 42 C10 20 28 8 50 8Z" fill={color} />
            {f[face] || f.happy}
        </svg>
    );
}

/* ═══════════════════════════════════════════
   SHARED UI COMPONENTS
   ═══════════════════════════════════════════ */
function GradientCard({ gradient, children, onClick, style = {} }) {
    return (
        <div onClick={onClick} style={{ background: gradient, borderRadius: 20, padding: "16px 20px", cursor: onClick ? "pointer" : "default", transition: "transform 0.2s, box-shadow 0.2s", ...style }}
            onMouseEnter={e => { if (onClick) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)"; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
            {children}
        </div>
    );
}

function ChatBubble({ message, isUser, theme }) {
    const t = THEMES[theme];
    return (
        <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 12, alignItems: "flex-end", gap: 8 }}>
            {!isUser && <MiniBlob color="#7ED6A2" face="calm" size={28} />}
            <div style={{
                background: isUser ? "linear-gradient(135deg, #7ED6A2, #4CAF50)" : t.chatBubbleAI,
                color: isUser ? "#1a1a2e" : t.chatTextAI,
                padding: "12px 16px", borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                maxWidth: "75%", fontSize: 13, lineHeight: 1.5, fontWeight: isUser ? 500 : 400,
            }}>{message}</div>
        </div>
    );
}

function generateMoodHistory() {
    const faces = ["happy", "calm", "sad", "anxious", "cheerful", "angry"];
    const colors = ["#FFD93D", "#7ED6A2", "#81D4FA", "#B39DDB", "#FF9A76", "#FF8A80"];
    const h = {};
    for (let i = 1; i <= 28; i++) if (Math.random() > 0.2) { const idx = Math.floor(Math.random() * 6); h[i] = { face: faces[idx], color: colors[idx] }; }
    return h;
}
const MOOD_HISTORY = generateMoodHistory();

const COACHES = [
    { name: "Coach Ria", specialties: ["Academic Stress", "Self-Esteem"], rating: 4.9, available: true, color: "#B39DDB" },
    { name: "Coach Marco", specialties: ["Career Anxiety", "Relationships"], rating: 4.7, available: true, color: "#81D4FA" },
    { name: "Coach Ana", specialties: ["Family Pressure", "Sleep"], rating: 4.8, available: false, color: "#FF9A76" },
];

const RESOURCES = [
    { title: "Managing Academic Pressure", category: "Academic", duration: "5 min read", gradient: "linear-gradient(135deg, #667eea, #764ba2)" },
    { title: "Breathing for Calm", category: "Exercise", duration: "3 min", gradient: "linear-gradient(135deg, #43e97b, #38f9d7)" },
    { title: "Understanding Your Anxiety", category: "Self-Help", duration: "7 min read", gradient: "linear-gradient(135deg, #fa709a, #fee140)" },
    { title: "Better Sleep Tonight", category: "Sleep", duration: "10 min", gradient: "linear-gradient(135deg, #a18cd1, #fbc2eb)" },
    { title: "Thought Reframing 101", category: "CBT", duration: "4 min read", gradient: "linear-gradient(135deg, #ffecd2, #fcb69f)" },
];

const AI_MESSAGES = [
    { text: "Hey there! I'm your MindBridge companion. How are you feeling right now?", isUser: false },
    { text: "I've been stressed about exams lately...", isUser: true },
    { text: "I hear you \u2014 exam season can feel really overwhelming. Let's try something together. Can you take a slow, deep breath in for 4 counts?", isUser: false },
    { text: "Okay, I'll try.", isUser: true },
    { text: "Great. Breathe in... 1... 2... 3... 4... Now hold for 4... and slowly exhale for 6. How did that feel?", isUser: false },
    { text: "A little better actually", isUser: true },
    { text: "That's the power of your breath \u2014 it's always with you. When exam stress hits, try naming 3 things you CAN control. Want to try?", isUser: false },
];

/* ═══════════════════════════════════════════
   IPHONE 15 PRO FRAME
   ═══════════════════════════════════════════ */
function IPhoneFrame({ children, theme }) {
    const isDark = theme === "dark";
    return (
        <div style={{ position: "relative", width: 393, height: 852 }}>
            {/* Outer titanium shell */}
            <div style={{
                position: "absolute", inset: -14,
                borderRadius: 60,
                background: isDark
                    ? "linear-gradient(165deg, #3a3a3a 0%, #1c1c1c 30%, #252525 60%, #1a1a1a 100%)"
                    : "linear-gradient(165deg, #f0f0f0 0%, #d8d8d8 30%, #e5e5e5 60%, #d0d0d0 100%)",
                boxShadow: isDark
                    ? "0 50px 100px rgba(0,0,0,0.7), 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)"
                    : "0 50px 100px rgba(0,0,0,0.15), 0 25px 50px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.05)",
                zIndex: 0,
            }} />
            {/* Titanium edge highlight */}
            <div style={{
                position: "absolute", inset: -12,
                borderRadius: 58,
                border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.5)",
                zIndex: 0,
                pointerEvents: "none",
            }} />
            {/* Side buttons */}
            {[{ top: 160, h: 34 }, { top: 220, h: 56 }, { top: 290, h: 56 }].map((b, i) => (
                <div key={`l${i}`} style={{
                    position: "absolute", left: -17, top: b.top, width: 3, height: b.h,
                    borderRadius: "3px 0 0 3px",
                    background: isDark ? "linear-gradient(180deg, #444, #2a2a2a)" : "linear-gradient(180deg, #d5d5d5, #bbb)",
                }} />
            ))}
            <div style={{
                position: "absolute", right: -17, top: 240, width: 3, height: 72,
                borderRadius: "0 3px 3px 0",
                background: isDark ? "linear-gradient(180deg, #444, #2a2a2a)" : "linear-gradient(180deg, #d5d5d5, #bbb)",
            }} />
            {/* Inner bezel */}
            <div style={{
                position: "absolute", inset: -4,
                borderRadius: 52,
                background: "#000",
                zIndex: 1,
            }} />
            {/* Screen */}
            <div style={{
                position: "relative",
                width: 393, height: 852,
                borderRadius: 47,
                overflow: "hidden",
                zIndex: 2,
            }}>
                {children}
            </div>
            {/* Dynamic Island */}
            <div style={{
                position: "absolute",
                top: 7, left: "50%", transform: "translateX(-50%)",
                width: 126, height: 36,
                borderRadius: 20,
                background: "#000",
                zIndex: 3,
                boxShadow: "inset 0 0 4px rgba(0,0,0,0.5)",
            }}>
                {/* Camera lens */}
                <div style={{
                    position: "absolute", right: 22, top: "50%", transform: "translateY(-50%)",
                    width: 10, height: 10, borderRadius: "50%",
                    background: "radial-gradient(circle, #1a1a3e 30%, #0a0a1e 70%)",
                    border: "1px solid #222",
                }} />
            </div>
            {/* Home indicator */}
            <div style={{
                position: "absolute",
                bottom: 10, left: "50%", transform: "translateX(-50%)",
                width: 134, height: 5,
                borderRadius: 3,
                background: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)",
                zIndex: 3,
            }} />
        </div>
    );
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function MindBridgeDemo() {
    const [theme, setTheme] = useState("dark");
    const [screen, setScreen] = useState(SCREENS.SPLASH);
    const [selectedMood, setSelectedMood] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [chatMsgIndex, setChatMsgIndex] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);
    const [moodLogged, setMoodLogged] = useState(false);
    const chatEndRef = useRef(null);
    const t = THEMES[theme];

    useEffect(() => { if (screen === SCREENS.SPLASH) { const x = setTimeout(() => nav(SCREENS.WELCOME), 2200); return () => clearTimeout(x); } }, [screen]);
    useEffect(() => {
        if (screen === SCREENS.AI_CHAT && chatMsgIndex < AI_MESSAGES.length) {
            const delay = AI_MESSAGES[chatMsgIndex].isUser ? 1200 : 1800;
            const x = setTimeout(() => { setChatMessages(p => [...p, AI_MESSAGES[chatMsgIndex]]); setChatMsgIndex(p => p + 1); }, delay);
            return () => clearTimeout(x);
        }
    }, [screen, chatMsgIndex]);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

    function nav(s) {
        setFadeIn(false);
        setTimeout(() => { setScreen(s); setFadeIn(true); if (s === SCREENS.AI_CHAT) { setChatMessages([]); setChatMsgIndex(0); } }, 200);
    }

    const hr = new Date().getHours();
    const greeting = hr < 12 ? "Good Morning" : hr < 18 ? "Good Afternoon" : "Good Evening";
    const faceMap = { Joyful: "happy", Cheerful: "cheerful", Calm: "calm", Anxious: "anxious", Sad: "sad", Angry: "angry" };

    function renderScreen() {
        switch (screen) {
            case SCREENS.SPLASH:
                return (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: theme === "dark" ? "linear-gradient(180deg, #1a1a2e, #16213e)" : "linear-gradient(180deg, #F8F7F4, #EDE9E1)" }}>
                        <div style={{ animation: "breathe 2s ease-in-out infinite" }}><Blob mood={MOODS[0]} size={100} face="happy" animate={false} /></div>
                        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: t.text, marginTop: 20 }}>MindBridge</p>
                        <p style={{ color: t.textTertiary, fontSize: 13, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>Your wellness companion</p>
                    </div>
                );

            case SCREENS.WELCOME:
                return (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 24px", background: t.bg }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 34, fontWeight: 800, color: t.text, textAlign: "center", lineHeight: 1.15, animation: "fadeInUp 0.6s ease" }}>How are you<br />feeling today?</p>
                            <div style={{ display: "flex", gap: 10, marginTop: 24, animation: "fadeInUp 0.8s ease" }}>
                                {["Joyful", "Cheerful", "Calm"].map((m, i) => (
                                    <button key={m} onClick={() => { setSelectedMood(MOODS[i]); nav(SCREENS.ONBOARD_MOOD); }}
                                        style={{ padding: "10px 20px", borderRadius: 24, border: `1px solid ${t.pillBorder}`, background: t.pillBg, color: t.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}
                                        onMouseEnter={e => { e.target.style.background = MOODS[i].color; e.target.style.color = "#1a1a2e"; }}
                                        onMouseLeave={e => { e.target.style.background = t.pillBg; e.target.style.color = t.text; }}
                                    >{m}</button>
                                ))}
                            </div>
                            <p style={{ color: t.textTertiary, fontSize: 12, marginTop: 16, fontFamily: "'DM Sans', sans-serif" }}>Swipe to learn more</p>
                        </div>
                        <div style={{ background: MOODS[0].color, borderRadius: 28, padding: "32px 20px", display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeInUp 1s ease" }}>
                            <Blob mood={MOODS[0]} size={100} face="cheerful" />
                            <button onClick={() => nav(SCREENS.HOME)} style={{ width: "100%", padding: "16px", borderRadius: 16, border: "none", background: "#1a1a2e", color: "#fff", fontSize: 16, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", marginTop: 16 }}>Get Started</button>
                            <p style={{ color: "rgba(0,0,0,0.5)", fontSize: 13, marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>Already have an account? <span style={{ textDecoration: "underline", fontWeight: 600, color: "#1a1a2e", cursor: "pointer" }}>Log in</span></p>
                        </div>
                    </div>
                );

            case SCREENS.ONBOARD_MOOD:
                return (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: selectedMood ? (theme === "dark" ? `linear-gradient(180deg, ${selectedMood.color}33 0%, ${t.bg} 50%)` : `linear-gradient(180deg, ${selectedMood.color}22 0%, ${t.bg} 50%)`) : t.bg }}>
                        <div style={{ padding: "8px 20px", display: "flex", justifyContent: "space-between" }}>
                            <button onClick={() => nav(SCREENS.WELCOME)} style={{ background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer" }}>{"\u2190"}</button>
                            <button onClick={() => nav(SCREENS.HOME)} style={{ background: t.pillBg, border: "none", color: t.text, padding: "8px 20px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Save</button>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
                            <div style={{ animation: "fadeInUp 0.5s ease" }}><Blob mood={selectedMood || MOODS[5]} size={150} face={selectedMood ? faceMap[selectedMood.name] : "angry"} /></div>
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 700, color: t.text, textAlign: "center", marginTop: 20, lineHeight: 1.2 }}>Select your<br />today's mood</p>
                            <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
                                {MOODS.map(m => (
                                    <button key={m.name} onClick={() => { setSelectedMood(m); setTimeout(() => nav(SCREENS.HOME), 500); }}
                                        style={{ padding: "10px 18px", borderRadius: 24, border: selectedMood?.name === m.name ? `2px solid ${m.color}` : `1px solid ${t.pillBorder}`, background: selectedMood?.name === m.name ? m.color : t.pillBg, color: selectedMood?.name === m.name ? "#1a1a2e" : t.text, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                                    >{m.name}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ height: 40, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2, padding: "0 40px 20px", opacity: 0.3 }}>
                            {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ width: 3, height: 4 + Math.sin(i * 0.5) * 16 + Math.random() * 8, background: selectedMood?.color || t.textTertiary, borderRadius: 2 }} />)}
                        </div>
                    </div>
                );

            case SCREENS.HOME:
                return (
                    <div style={{ flex: 1, overflow: "auto", padding: "0 20px 20px", background: t.bg }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0 16px" }}>
                            <div>
                                <p style={{ color: t.textSecondary, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>{greeting}</p>
                                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: t.text, lineHeight: 1.2, marginTop: 2 }}>Start your<br />day here!</p>
                            </div>
                            <div onClick={() => nav(SCREENS.PROFILE)} style={{ cursor: "pointer" }}><MiniBlob color={selectedMood?.color || "#7ED6A2"} face="happy" size={44} /></div>
                        </div>
                        {!moodLogged ? (
                            <GradientCard gradient="linear-gradient(135deg, #7ED6A2, #38f9d7)" onClick={() => nav(SCREENS.MOOD_CHECK)} style={{ marginBottom: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "#1a1a2e", fontSize: 15 }}>How are you feeling?</p>
                                        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(0,0,0,0.5)", fontSize: 12, marginTop: 4 }}>Tap to log your mood</p>
                                    </div>
                                    <div style={{ display: "flex", gap: 4 }}>{MOODS.slice(0, 4).map(m => <MiniBlob key={m.name} color={m.color} face={faceMap[m.name]} size={26} />)}</div>
                                </div>
                            </GradientCard>
                        ) : (
                            <GradientCard gradient={`linear-gradient(135deg, ${selectedMood?.color || '#7ED6A2'}88, ${selectedMood?.color || '#7ED6A2'}44)`} style={{ marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <MiniBlob color={selectedMood?.color} face="happy" size={36} />
                                    <div>
                                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#fff", fontSize: 14 }}>Today: {selectedMood?.name || "Calm"}</p>
                                        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Logged {"\u2022"} Tap to update</p>
                                    </div>
                                </div>
                            </GradientCard>
                        )}
                        <p style={{ color: t.textSecondary, fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Quick Actions</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                            {[
                                { label: "AI Companion", icon: "\ud83e\udde0", gradient: "linear-gradient(135deg, #667eea, #764ba2)", s: SCREENS.AI_CHAT },
                                { label: "Book Coach", icon: "\ud83d\udc64", gradient: "linear-gradient(135deg, #43e97b, #38f9d7)", s: SCREENS.COACH_DIR },
                                { label: "Resources", icon: "\ud83d\udcda", gradient: "linear-gradient(135deg, #fa709a, #fee140)", s: SCREENS.RESOURCES },
                                { label: "Mood Calendar", icon: "\ud83d\udcc5", gradient: "linear-gradient(135deg, #a18cd1, #fbc2eb)", s: SCREENS.MOOD_CALENDAR },
                            ].map(a => (
                                <GradientCard key={a.label} gradient={a.gradient} onClick={() => nav(a.s)} style={{ padding: "20px 16px" }}>
                                    <p style={{ fontSize: 22 }}>{a.icon}</p>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#fff", fontSize: 13, marginTop: 8 }}>{a.label}</p>
                                </GradientCard>
                            ))}
                        </div>
                        <p style={{ color: t.textSecondary, fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>For Good Mornings</p>
                        {[
                            { title: "New Day, Fresh Start", time: "4m 30s", gradient: "linear-gradient(90deg, #FFD93D, #FF9A76)" },
                            { title: "Bright Mornings, Bold Beginnings", time: "2m 15s", gradient: "linear-gradient(90deg, #667eea, #764ba2)" },
                            { title: "Awake, Energize, Conquer", time: "4m 20s", gradient: "linear-gradient(90deg, #fa709a, #fee140)" },
                        ].map((s, i) => (
                            <div key={i} onClick={() => nav(SCREENS.AI_CHAT)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: `1px solid ${t.border}`, cursor: "pointer" }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: t.text, fontSize: 14 }}>{s.title}</p>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: t.textTertiary, fontSize: 11, marginTop: 2 }}>{s.time}</p>
                                </div>
                                <div style={{ width: 60, height: 38, borderRadius: 10, background: s.gradient }} />
                                <div style={{ width: 28, height: 28, borderRadius: 8, background: t.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: t.text }}>{"\u25B6"}</div>
                            </div>
                        ))}
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #FF5252, #D32F2F)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 20px rgba(255,82,82,0.4)", animation: "pulse 2s infinite" }}>
                                <span style={{ color: "#fff", fontSize: 10, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>SOS</span>
                            </div>
                        </div>
                    </div>
                );

            case SCREENS.MOOD_CHECK:
                return (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: t.bg, padding: 20 }}>
                        <button onClick={() => nav(SCREENS.HOME)} style={{ background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer", alignSelf: "flex-start", marginBottom: 16 }}>{"\u2190"}</button>
                        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: t.text, textAlign: "center", marginBottom: 8 }}>How are you feeling?</p>
                        <p style={{ color: t.textSecondary, fontSize: 13, textAlign: "center", fontFamily: "'DM Sans', sans-serif", marginBottom: 28 }}>Select the blob that matches your mood</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, justifyItems: "center" }}>
                            {MOODS.map(m => (
                                <div key={m.name} onClick={() => { setSelectedMood(m); setMoodLogged(true); setTimeout(() => nav(SCREENS.HOME), 600); }}
                                    style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", padding: 12, borderRadius: 20, background: selectedMood?.name === m.name ? (theme === "dark" ? `${m.color}22` : `${m.color}18`) : "transparent", border: selectedMood?.name === m.name ? `2px solid ${m.color}` : "2px solid transparent", transition: "all 0.2s" }}>
                                    <Blob mood={m} size={66} face={faceMap[m.name]} />
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: t.text, marginTop: 6 }}>{m.name}</p>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: "auto", paddingTop: 20 }}>
                            <p style={{ color: t.textTertiary, fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Add a note (optional)</p>
                            <div style={{ background: t.inputBg, borderRadius: 16, padding: 14, minHeight: 56 }}>
                                <p style={{ color: t.textMuted, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>What's on your mind today...</p>
                            </div>
                        </div>
                    </div>
                );

            case SCREENS.AI_CHAT:
                return (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: t.bg }}>
                        <div style={{ padding: "8px 20px 12px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${t.border}` }}>
                            <button onClick={() => nav(SCREENS.HOME)} style={{ background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer" }}>{"\u2190"}</button>
                            <MiniBlob color="#7ED6A2" face="calm" size={36} />
                            <div>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: t.text, fontSize: 15 }}>MindBridge AI</p>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#7ED6A2", fontSize: 11 }}>Online {"\u2022"} Level 1 CBT</p>
                            </div>
                        </div>
                        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
                            {chatMessages.map((msg, i) => <div key={i} style={{ animation: "fadeInUp 0.4s ease" }}><ChatBubble message={msg.text} isUser={msg.isUser} theme={theme} /></div>)}
                            {chatMsgIndex < AI_MESSAGES.length && !AI_MESSAGES[chatMsgIndex]?.isUser && (
                                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
                                    <MiniBlob color="#7ED6A2" face="calm" size={28} />
                                    <div style={{ display: "flex", gap: 4 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: t.textTertiary, animation: `pulse 1s infinite ${i * 0.2}s` }} />)}</div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <div style={{ padding: "12px 20px 16px", borderTop: `1px solid ${t.border}` }}>
                            <div style={{ display: "flex", gap: 10, alignItems: "center", background: t.inputBg, borderRadius: 24, padding: "10px 16px" }}>
                                <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1, background: "none", border: "none", color: t.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                                <button style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7ED6A2, #4CAF50)", border: "none", color: "#fff", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{"\u2191"}</button>
                            </div>
                        </div>
                    </div>
                );

            case SCREENS.COACH_DIR:
                return (
                    <div style={{ flex: 1, overflow: "auto", background: t.bg, padding: "0 20px 20px" }}>
                        <div style={{ padding: "8px 0 16px", display: "flex", alignItems: "center", gap: 12 }}>
                            <button onClick={() => nav(SCREENS.HOME)} style={{ background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer" }}>{"\u2190"}</button>
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: t.text }}>Book a Coach</p>
                        </div>
                        <p style={{ color: t.textSecondary, fontSize: 13, fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>Level 2 Wellness Coaches {"\u2014"} trained psychology graduates.</p>
                        {COACHES.map((c, i) => (
                            <div key={i} style={{ background: t.surface, borderRadius: 20, padding: 18, marginBottom: 14, border: `1px solid ${t.cardBorder}` }}>
                                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                                    <MiniBlob color={c.color} face="calm" size={48} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: t.text, fontSize: 15 }}>{c.name}</p>
                                            <div style={{ padding: "3px 10px", borderRadius: 12, background: c.available ? "rgba(126,214,162,0.15)" : t.surface, border: `1px solid ${c.available ? "#7ED6A233" : t.cardBorder}` }}>
                                                <p style={{ fontSize: 10, color: c.available ? "#7ED6A2" : t.textTertiary, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{c.available ? "Available" : "Offline"}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                                            {c.specialties.map(s => <span key={s} style={{ padding: "3px 10px", borderRadius: 10, background: t.pillBg, fontSize: 11, color: t.pillText, fontFamily: "'DM Sans', sans-serif" }}>{s}</span>)}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                                            <span style={{ color: "#FFD93D", fontSize: 12 }}>{"\u2605"}</span>
                                            <span style={{ color: t.textSecondary, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>{c.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                {c.available && <button style={{ width: "100%", marginTop: 14, padding: "12px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #7ED6A2, #4CAF50)", color: "#1a1a2e", fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>Book Session</button>}
                            </div>
                        ))}
                    </div>
                );

            case SCREENS.MOOD_CALENDAR:
                return (
                    <div style={{ flex: 1, overflow: "auto", background: t.bg, padding: "0 20px 20px" }}>
                        <div style={{ padding: "8px 0 16px", display: "flex", alignItems: "center", gap: 12 }}>
                            <button onClick={() => nav(SCREENS.HOME)} style={{ background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer" }}>{"\u2190"}</button>
                            <div>
                                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: t.text }}>Mood Calendar</p>
                                <p style={{ color: t.textTertiary, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>March, 2026</p>
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 20 }}>
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <p key={d} style={{ textAlign: "center", color: t.textTertiary, fontSize: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, padding: "6px 0" }}>{d}</p>)}
                            {Array.from({ length: 28 }, (_, i) => {
                                const day = i + 1; const mood = MOOD_HISTORY[day];
                                return (
                                    <div key={day} style={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: mood ? (theme === "dark" ? `${mood.color}22` : `${mood.color}18`) : t.surface }}>
                                        {mood ? <MiniBlob color={mood.color} face={mood.face} size={30} /> : <p style={{ color: t.textMuted, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>{day}</p>}
                                    </div>
                                );
                            })}
                        </div>
                        <GradientCard gradient={theme === "dark" ? "linear-gradient(135deg, #7ED6A244, #7ED6A211)" : "linear-gradient(135deg, #7ED6A233, #7ED6A211)"} style={{ marginBottom: 14 }}>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: t.textSecondary, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>Monthly Summary</p>
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: "#7ED6A2", marginTop: 4 }}>{selectedMood?.name || "Calm"}</p>
                            <p style={{ color: t.textSecondary, fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>You're feeling balanced. Keep it up!</p>
                        </GradientCard>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                            {[{ label: "Activity", value: "12,450", sub: "Steps" }, { label: "Sessions", value: "8/30", sub: "Done" }, { label: "Streak", value: "14", sub: "Days" }].map(s => (
                                <div key={s.label} style={{ background: t.surface, borderRadius: 16, padding: 14, textAlign: "center" }}>
                                    <p style={{ color: t.textSecondary, fontSize: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{s.label}</p>
                                    <p style={{ color: t.text, fontSize: 18, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>{s.value}</p>
                                    <p style={{ color: t.textTertiary, fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}>{s.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case SCREENS.RESOURCES:
                return (
                    <div style={{ flex: 1, overflow: "auto", background: t.bg, padding: "0 20px 20px" }}>
                        <div style={{ padding: "8px 0 16px", display: "flex", alignItems: "center", gap: 12 }}>
                            <button onClick={() => nav(SCREENS.HOME)} style={{ background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer" }}>{"\u2190"}</button>
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: t.text }}>Resource Library</p>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflow: "auto", paddingBottom: 4 }}>
                            {["All", "Academic", "CBT", "Sleep", "Exercise"].map((c, i) => (
                                <button key={c} style={{ padding: "8px 16px", borderRadius: 20, border: i === 0 ? "none" : `1px solid ${t.pillBorder}`, background: i === 0 ? "#7ED6A2" : "transparent", color: i === 0 ? "#1a1a2e" : t.pillText, fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", whiteSpace: "nowrap" }}>{c}</button>
                            ))}
                        </div>
                        {RESOURCES.map((r, i) => (
                            <GradientCard key={i} gradient={r.gradient} onClick={() => { }} style={{ marginBottom: 12, padding: "20px" }}>
                                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{r.category}</p>
                                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: "#fff", marginTop: 6, lineHeight: 1.3 }}>{r.title}</p>
                                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>{r.duration}</p>
                            </GradientCard>
                        ))}
                    </div>
                );

            case SCREENS.PROFILE:
                return (
                    <div style={{ flex: 1, overflow: "auto", background: t.bg, padding: "0 20px 20px" }}>
                        <div style={{ padding: "8px 0 16px", display: "flex", alignItems: "center", gap: 12 }}>
                            <button onClick={() => nav(SCREENS.HOME)} style={{ background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer" }}>{"\u2190"}</button>
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: t.text }}>Profile</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0 28px" }}>
                            <Blob mood={selectedMood || MOODS[2]} size={90} face="happy" />
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: t.text, marginTop: 12 }}>Moonbeam</p>
                            <p style={{ color: t.textTertiary, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Anonymous Profile {"\u2022"} Level 1</p>
                        </div>
                        {[
                            { label: "Language", value: "English / Filipino", icon: "\ud83c\udf10" },
                            { label: "Privacy Settings", value: "Manage your data", icon: "\ud83d\udd12" },
                            { label: "Notifications", value: "Daily reminders", icon: "\ud83d\udd14" },
                            { label: "Help & FAQ", value: "Get support", icon: "\u2753" },
                            { label: "About MindBridge", value: "Version 1.0", icon: "\u2139\ufe0f" },
                        ].map((item, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: `1px solid ${t.border}`, cursor: "pointer" }}>
                                <div style={{ width: 38, height: 38, borderRadius: 12, background: t.profileIcon, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{item.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: t.text, fontSize: 14 }}>{item.label}</p>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: t.textTertiary, fontSize: 11 }}>{item.value}</p>
                                </div>
                                <span style={{ color: t.textMuted, fontSize: 16 }}>{"\u203A"}</span>
                            </div>
                        ))}
                    </div>
                );

            default: return null;
        }
    }

    const showNav = [SCREENS.HOME, SCREENS.COACH_DIR, SCREENS.MOOD_CALENDAR, SCREENS.RESOURCES, SCREENS.PROFILE, SCREENS.MOOD_CHECK].includes(screen);

    return (
        <div style={{
            width: "100vw", height: "100vh",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: theme === "dark"
                ? "radial-gradient(ellipse at 30% 20%, #1e1e3f 0%, #0d0d1a 50%, #000 100%)"
                : "radial-gradient(ellipse at 30% 20%, #f0ede6 0%, #e8e4db 50%, #d5d0c5 100%)",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            overflow: "hidden", position: "relative", transition: "background 0.6s ease",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 0; }
        @keyframes blobFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.3); opacity: 1; } }
        @keyframes float1 { 0%, 100% { transform: translate(0,0) rotate(0); } 33% { transform: translate(30px,-20px) rotate(5deg); } 66% { transform: translate(-15px,10px) rotate(-3deg); } }
        @keyframes float2 { 0%, 100% { transform: translate(0,0) rotate(0); } 33% { transform: translate(-25px,15px) rotate(-4deg); } 66% { transform: translate(20px,-25px) rotate(6deg); } }
      `}</style>

            {/* Background floating blobs */}
            <div style={{ position: "absolute", top: "8%", left: "6%", opacity: theme === "dark" ? 0.06 : 0.08, animation: "float1 20s ease-in-out infinite", pointerEvents: "none" }}><Blob mood={MOODS[2]} size={180} face="calm" animate={false} /></div>
            <div style={{ position: "absolute", bottom: "10%", right: "5%", opacity: theme === "dark" ? 0.05 : 0.07, animation: "float2 25s ease-in-out infinite", pointerEvents: "none" }}><Blob mood={MOODS[3]} size={140} face="anxious" animate={false} /></div>
            <div style={{ position: "absolute", top: "55%", left: "3%", opacity: theme === "dark" ? 0.04 : 0.05, animation: "float2 18s ease-in-out infinite 3s", pointerEvents: "none" }}><Blob mood={MOODS[0]} size={100} face="happy" animate={false} /></div>

            {/* Top bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <MiniBlob color="#7ED6A2" face="happy" size={32} />
                    <div>
                        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: theme === "dark" ? "#fff" : "#1a1a2e", letterSpacing: -0.3 }}>MindBridge</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: theme === "dark" ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", letterSpacing: 2, textTransform: "uppercase" }}>Interactive Prototype</p>
                    </div>
                </div>
                {/* Theme toggle */}
                <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 40, border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`, background: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", cursor: "pointer", transition: "all 0.4s ease" }}>
                    <div style={{ width: 44, height: 24, borderRadius: 12, position: "relative", background: theme === "dark" ? "linear-gradient(135deg, #1a1a2e, #2d2d5e)" : "linear-gradient(135deg, #FFD93D, #FF9A76)", transition: "background 0.4s ease", boxShadow: theme === "dark" ? "inset 0 1px 3px rgba(0,0,0,0.4)" : "inset 0 1px 3px rgba(0,0,0,0.15)" }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: theme === "dark" ? 3 : 23, transition: "left 0.3s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)", minWidth: 32 }}>{theme === "dark" ? "Dark" : "Light"}</span>
                </button>
            </div>

            {/* Phone frame */}
            <div style={{ transform: "scale(0.82)", transformOrigin: "center center" }}>
                <IPhoneFrame theme={theme}>
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', system-ui, sans-serif", overflow: "hidden", transition: "background 0.4s ease" }}>
                        {/* Status bar */}
                        <div style={{ padding: "14px 28px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, fontWeight: 600, color: t.statusBar, fontFamily: "'DM Sans', sans-serif", flexShrink: 0, position: "relative", zIndex: 5 }}>
                            <span>9:41</span>
                            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                                <svg width="16" height="12" viewBox="0 0 16 12" fill={t.statusBar}><rect x="0" y="8" width="3" height="4" rx="0.5" /><rect x="4.5" y="5" width="3" height="7" rx="0.5" /><rect x="9" y="2" width="3" height="10" rx="0.5" /><rect x="13" y="0" width="3" height="12" rx="0.5" /></svg>
                                <svg width="16" height="12" viewBox="0 0 16 12" fill={t.statusBar}><path d="M8 2C5.5 2 3.2 3 1.5 4.7L0 3.2C2.1 1.2 4.9 0 8 0s5.9 1.2 8 3.2l-1.5 1.5C12.8 3 10.5 2 8 2zm0 4c-1.7 0-3.2.7-4.3 1.8L2.2 6.3C3.7 4.9 5.7 4 8 4s4.3.9 5.8 2.3l-1.5 1.5C11.2 6.7 9.7 6 8 6zm0 4c-1 0-1.9.4-2.6 1.1L4 9.7C5 8.6 6.4 8 8 8s3 .6 4 1.7l-1.4 1.4C9.9 10.4 9 10 8 10zm0 2l2-2c-.5-.6-1.2-1-2-1s-1.5.4-2 1l2 2z" /></svg>
                                <svg width="22" height="12" viewBox="0 0 22 12" fill={t.statusBar}><rect x="0" y="1" width="18" height="10" rx="2" stroke={t.statusBar} strokeWidth="1" fill="none" /><rect x="19" y="4" width="2" height="4" rx="1" /><rect x="1.5" y="2.5" width="14" height="7" rx="1" /></svg>
                            </div>
                        </div>
                        {/* Screen */}
                        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", opacity: fadeIn ? 1 : 0, transition: "opacity 0.2s ease" }}>
                            {renderScreen()}
                        </div>
                        {/* Nav */}
                        {showNav && (
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 16px 20px", background: t.navBg, backdropFilter: "blur(20px)", borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
                                {[
                                    { icon: "\ud83c\udfe0", label: "Home", s: SCREENS.HOME },
                                    { icon: "\ud83d\udd0d", label: "Explore", s: SCREENS.RESOURCES },
                                    { icon: "\ud83d\udcac", label: "Chat", s: SCREENS.AI_CHAT },
                                    { icon: "\ud83d\udcc5", label: "Calendar", s: SCREENS.MOOD_CALENDAR },
                                    { icon: "\ud83d\udc64", label: "Profile", s: SCREENS.PROFILE },
                                ].map(n => (
                                    <button key={n.label} onClick={() => nav(n.s)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", opacity: screen === n.s ? 1 : 0.4, transition: "opacity 0.2s" }}>
                                        <span style={{ fontSize: 17 }}>{n.icon}</span>
                                        <span style={{ fontSize: 9, color: t.text, fontFamily: "'DM Sans', sans-serif", fontWeight: screen === n.s ? 700 : 400 }}>{n.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </IPhoneFrame>
            </div>

            {/* Bottom hint */}
            <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)", letterSpacing: 2, textTransform: "uppercase" }}>
                    Tap through screens to explore {"\u2022"} Interactive Demo
                </p>
            </div>
        </div>
    );
}