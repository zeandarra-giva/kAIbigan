import { useEffect, useMemo, useRef, useState } from "react";

import {
    ACCOUNT_TIERS,
    CULTURAL_PREFERENCES,
    LIKERT_OPTIONS,
    STORAGE_KEYS,
    TRIAGE_QUESTIONS,
    computeTriageResult,
    getSupportAccess,
    mockAIReply,
    pickAlias,
    translateDemoString,
} from "./demoLogic";

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
        success: "#7ED6A2",
        danger: "#FF5252",
        warning: "#FFB84D",
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
        success: "#4CAF50",
        danger: "#FF5252",
        warning: "#FFB84D",
    },
};

const MOODS = [
    { name: "Joyful", color: "#FFD93D", blob: "#FFD93D", face: "happy" },
    { name: "Cheerful", color: "#FF9A76", blob: "#FF9A76", face: "cheerful" },
    { name: "Calm", color: "#7ED6A2", blob: "#7ED6A2", face: "calm" },
    { name: "Anxious", color: "#B39DDB", blob: "#B39DDB", face: "anxious" },
    { name: "Sad", color: "#81D4FA", blob: "#81D4FA", face: "sad" },
    { name: "Angry", color: "#FF8A80", blob: "#FF8A80", face: "angry" },
];

const SCREENS = {
    SPLASH: "splash",
    WELCOME: "welcome",
    ANON_SIGNIN: "anon_signin",
    INTAKE_TRIAGE: "intake_triage",
    TRIAGE_RESULT: "triage_result",
    ONBOARD_MOOD: "onboard_mood",
    HOME: "home",
    MOOD_CHECK: "mood_check",
    AI_CHAT: "ai_chat",
    COACH_DIR: "coach_dir",
    COACH_BOOKING_CONFIRM: "coach_booking_confirm",
    PSYCHIATRIST_DIR: "psychiatrist_dir",
    PSYCHIATRIST_BOOKING_CONFIRM: "psychiatrist_booking_confirm",
    MOOD_CALENDAR: "mood_calendar",
    RESOURCES: "resources",
    RESOURCE_DETAIL: "resource_detail",
    PROFILE: "profile",
    RED_FLAG_MODAL: "red_flag_modal",
};

const OPENING_MESSAGE = {
    role: "ai",
    text: "Hey, I'm your kAIbigan companion. How are you feeling right now?",
    ts: "opener",
};

const COACHES = [
    { name: "Coach Ria", specialties: ["Academic", "Self-esteem"], rating: 4.9, available: true, color: "#B39DDB" },
    { name: "Coach Marco", specialties: ["Career", "Relationships"], rating: 4.7, available: true, color: "#81D4FA" },
    { name: "Coach Ana", specialties: ["Family", "Sleep"], rating: 4.8, available: false, color: "#FF9A76" },
];

const PSYCHIATRISTS = [
    { name: "Dr. Liwanag Reyes, MD", specialty: "Anxiety & Depression", nextSlot: "Thu 3:00 PM", color: "#B39DDB" },
    { name: "Dr. Martin Guzman, MD", specialty: "Adolescent Psychiatry", nextSlot: "Fri 10:00 AM", color: "#81D4FA" },
    { name: "Dr. Sofia Mendoza, MD", specialty: "Trauma & PTSD", nextSlot: "Mon 2:00 PM", color: "#FF9A76" },
];

const RESOURCES = [
    {
        id: "academic-pressure",
        title: "Managing Academic Pressure",
        category: "Academic",
        duration: "5 min read",
        gradient: "linear-gradient(135deg, #667eea, #764ba2)",
        author: "Written with Dr. Liwanag Reyes",
        content: [
            "When deadlines pile up, it can feel like every quiz, recitation, and requirement is measuring your worth all at once. Many Filipino students carry that weight quietly because they do not want to worry their family or disappoint the people cheering them on.",
            "Try shrinking the problem back down to one next step. Pick the single task that will make tomorrow feel less heavy, then give it a short timer. Ten honest minutes of focus is often more helpful than waiting for the perfect wave of motivation.",
            "If the pressure keeps spilling into sleep, appetite, or panic, that is not weakness. It is a signal that support would help. A coach, a counselor, or even one grounding check-in can give your body enough room to reset.",
        ],
    },
    {
        id: "breathing-for-calm",
        title: "Breathing for Calm",
        category: "Exercise",
        duration: "3 min",
        gradient: "linear-gradient(135deg, #43e97b, #38f9d7)",
        author: "Written with Dr. Liwanag Reyes",
        content: [
            "Fast breathing tells your body there is danger, even when the danger is really a crowded mind. Slowing your breath is one of the quickest ways to tell your nervous system that you are safe enough to stay present.",
            "Try this rhythm: inhale for four, hold for four, exhale for six. If six feels too long, shorten it and stay gentle. The goal is not perfection. The goal is giving your body one clear instruction: soften.",
            "Students often use this before presentations, oral exams, and difficult conversations at home. Repetition matters more than intensity. A small calming ritual practiced often becomes easier to trust when stress spikes.",
        ],
    },
    {
        id: "understanding-anxiety",
        title: "Understanding Your Anxiety",
        category: "Self-Help",
        duration: "7 min read",
        gradient: "linear-gradient(135deg, #fa709a, #fee140)",
        author: "Written with Dr. Liwanag Reyes",
        content: [
            "Anxiety is often your mind trying too hard to protect you. It scans for what might go wrong, then mistakes possibility for certainty. That can make school, family, and even rest feel tense before anything has actually happened.",
            "One way to interrupt that spiral is to separate facts from fears. Facts are what is happening now. Fears are the stories your mind is adding. Naming the difference can reduce the feeling that everything is urgent.",
            "If anxiety keeps narrowing your world, reach for support early. Talking to someone before things feel unmanageable is a strength, not an overreaction.",
        ],
    },
    {
        id: "better-sleep-tonight",
        title: "Better Sleep Tonight",
        category: "Sleep",
        duration: "10 min",
        gradient: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
        author: "Written with Dr. Liwanag Reyes",
        content: [
            "Sleep is often the first thing students trade away when life gets packed, but poor sleep makes emotions louder and concentration harder. What feels like a discipline problem is sometimes just an exhausted brain asking for recovery.",
            "Create a short shutdown routine that tells your body school is over for the day. Dim the lights, put your charger away from your pillow, and write down tomorrow's top three tasks so your mind is not forced to rehearse them all night.",
            "If sleep feels impossible because your thoughts race as soon as the room gets quiet, that is a good moment to use breathing, journaling, or guided support instead of fighting yourself for rest.",
        ],
    },
    {
        id: "thought-reframing",
        title: "Thought Reframing 101",
        category: "CBT",
        duration: "4 min read",
        gradient: "linear-gradient(135deg, #ffecd2, #fcb69f)",
        author: "Written with Dr. Liwanag Reyes",
        content: [
            "Reframing is not pretending everything is fine. It is choosing a thought that is more balanced and more useful than the harshest version your mind produced in a stressed moment.",
            "For example, 'I'm going to fail everything' can become 'I am overwhelmed, but I can still finish one requirement tonight.' The second thought does not erase the difficulty. It simply gives you somewhere to move.",
            "Balanced thoughts are often the bridge between feeling frozen and feeling capable again. If you cannot find one on your own, that is exactly the kind of work a coach can help you practice.",
        ],
    },
];

function safeRead(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function safeWrite(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // no-op for demo
    }
}

function todayIso() {
    return new Date().toISOString().slice(0, 10);
}

function createSeedMoodHistory() {
    const sequence = ["Calm", "Cheerful", "Calm", "Anxious", "Sad", "Calm", "Joyful", "Cheerful", "Calm", "Angry"];

    return Array.from({ length: 18 }, (_, index) => {
        const d = new Date();
        d.setDate(d.getDate() - (17 - index));
        return {
            date: d.toISOString().slice(0, 10),
            mood: sequence[index % sequence.length],
            note: "",
        };
    });
}

function getMoodByName(name) {
    return MOODS.find((mood) => mood.name === name) || MOODS[2];
}

function getSchoolName(email, code) {
    const emailText = (email || "").toLowerCase();
    const codeText = (code || "").toUpperCase();

    if (emailText.includes("@ust.edu.ph") || codeText.includes("UST")) return "University of Santo Tomas";
    if (emailText.includes("@dlsu.edu.ph") || codeText.includes("DLSU")) return "De La Salle University";
    if (emailText.includes("@addu.edu.ph") || codeText.includes("ADDU")) return "Ateneo de Davao University";
    if (emailText.includes("@up.edu.ph") || codeText.includes("UP")) return "University of the Philippines";

    return code ? `${code.trim()} Campus` : "Your school";
}

function getGuidanceContact(school) {
    if (school === "University of Santo Tomas") {
        return { label: "University of Santo Tomas Guidance Office", number: "+63 2 8406 1611" };
    }

    return { label: `${school || "Your school"} guidance office`, number: "+63 2 8555 0101" };
}

function formatCalendarLabel(isoDate) {
    return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMonthLabel() {
    return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function toastStyle(theme) {
    const t = THEMES[theme];

    return {
        position: "absolute",
        left: 20,
        right: 20,
        bottom: 100,
        padding: "14px 16px",
        borderRadius: 16,
        background: theme === "dark" ? "rgba(20,20,32,0.95)" : "rgba(255,255,255,0.96)",
        color: t.text,
        border: `1px solid ${t.border}`,
        boxShadow: "0 14px 32px rgba(0,0,0,0.18)",
        zIndex: 60,
        fontSize: 12,
        fontFamily: "'DM Sans', sans-serif",
        backdropFilter: "blur(18px)",
    };
}

function Blob({ mood, size = 120, face = "happy", animate = true }) {
    const color = mood?.blob || "#FFD93D";
    const fc = "#333";
    const faces = {
        happy: (
            <>
                <ellipse cx="38" cy="42" rx="5" ry="6" fill={fc} />
                <ellipse cx="62" cy="42" rx="5" ry="6" fill={fc} />
                <path d="M35 56 Q50 70 65 56" stroke={fc} strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
        ),
        sad: (
            <>
                <ellipse cx="38" cy="45" rx="5" ry="6" fill={fc} />
                <ellipse cx="62" cy="45" rx="5" ry="6" fill={fc} />
                <path d="M35 62 Q50 52 65 62" stroke={fc} strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
        ),
        angry: (
            <>
                <line x1="30" y1="35" x2="42" y2="40" stroke={fc} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="70" y1="35" x2="58" y2="40" stroke={fc} strokeWidth="2.5" strokeLinecap="round" />
                <ellipse cx="38" cy="46" rx="4.5" ry="5.5" fill={fc} />
                <ellipse cx="62" cy="46" rx="4.5" ry="5.5" fill={fc} />
                <path d="M38 60 Q50 55 62 60" stroke={fc} strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
        ),
        calm: (
            <>
                <path d="M33 44 Q38 40 43 44" stroke={fc} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M57 44 Q62 40 67 44" stroke={fc} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M40 58 Q50 63 60 58" stroke={fc} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
        ),
        anxious: (
            <>
                <ellipse cx="38" cy="42" rx="6" ry="7" fill="white" />
                <ellipse cx="62" cy="42" rx="6" ry="7" fill="white" />
                <ellipse cx="39" cy="43" rx="3" ry="3.5" fill={fc} />
                <ellipse cx="63" cy="43" rx="3" ry="3.5" fill={fc} />
                <ellipse cx="50" cy="62" rx="6" ry="5" fill={fc} />
            </>
        ),
        cheerful: (
            <>
                <path d="M32 42 Q38 36 44 42" stroke={fc} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M56 42 Q62 36 68 42" stroke={fc} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M34 55 Q50 72 66 55" stroke={fc} strokeWidth="3" fill={fc} strokeLinecap="round" />
            </>
        ),
    };

    return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={animate ? { animation: "blobFloat 3s ease-in-out infinite" } : {}}>
            <defs>
                <filter id={`sh-${color.replace("#", "")}`}>
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={color} floodOpacity="0.3" />
                </filter>
            </defs>
            <path d="M50 8 C72 8 90 20 92 42 C94 64 78 90 50 92 C22 90 6 64 8 42 C10 20 28 8 50 8Z" fill={color} filter={`url(#sh-${color.replace("#", "")})`} />
            {faces[face] || faces.happy}
        </svg>
    );
}

function MiniBlob({ color, face = "happy", size = 32 }) {
    const fc = "#333";
    const faces = {
        happy: (
            <>
                <circle cx="40" cy="42" r="3" fill={fc} />
                <circle cx="60" cy="42" r="3" fill={fc} />
                <path d="M40 55 Q50 62 60 55" stroke={fc} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
        ),
        sad: (
            <>
                <circle cx="40" cy="42" r="3" fill={fc} />
                <circle cx="60" cy="42" r="3" fill={fc} />
                <path d="M40 58 Q50 52 60 58" stroke={fc} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
        ),
        calm: (
            <>
                <path d="M36 44 Q40 40 44 44" stroke={fc} strokeWidth="2" fill="none" />
                <path d="M56 44 Q60 40 64 44" stroke={fc} strokeWidth="2" fill="none" />
                <path d="M42 55 Q50 59 58 55" stroke={fc} strokeWidth="2" fill="none" />
            </>
        ),
        angry: (
            <>
                <circle cx="40" cy="44" r="3" fill={fc} />
                <circle cx="60" cy="44" r="3" fill={fc} />
                <path d="M42 57 Q50 53 58 57" stroke={fc} strokeWidth="2.5" fill="none" />
            </>
        ),
        anxious: (
            <>
                <circle cx="40" cy="42" r="4" fill="white" />
                <circle cx="60" cy="42" r="4" fill="white" />
                <circle cx="41" cy="43" r="2" fill={fc} />
                <circle cx="61" cy="43" r="2" fill={fc} />
                <ellipse cx="50" cy="58" rx="4" ry="3" fill={fc} />
            </>
        ),
        cheerful: (
            <>
                <path d="M36 42 Q40 38 44 42" stroke={fc} strokeWidth="2" fill="none" />
                <path d="M56 42 Q60 38 64 42" stroke={fc} strokeWidth="2" fill="none" />
                <path d="M38 53 Q50 65 62 53" stroke={fc} strokeWidth="2" fill={fc} />
            </>
        ),
    };

    return (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <path d="M50 8 C72 8 90 20 92 42 C94 64 78 90 50 92 C22 90 6 64 8 42 C10 20 28 8 50 8Z" fill={color} />
            {faces[face] || faces.happy}
        </svg>
    );
}

function GradientCard({ gradient, children, onClick, style = {} }) {
    return (
        <div
            onClick={onClick}
            style={{
                background: gradient,
                borderRadius: 20,
                padding: "16px 20px",
                cursor: onClick ? "pointer" : "default",
                transition: "transform 0.2s, box-shadow 0.2s",
                ...style,
            }}
            onMouseEnter={(event) => {
                if (onClick) {
                    event.currentTarget.style.transform = "scale(1.02)";
                    event.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)";
                }
            }}
            onMouseLeave={(event) => {
                event.currentTarget.style.transform = "scale(1)";
                event.currentTarget.style.boxShadow = "none";
            }}
        >
            {children}
        </div>
    );
}

function ScreenHeader({ title, subtitle, onBack, rightAction, theme }) {
    const t = THEMES[theme];

    return (
        <div style={{ padding: "8px 20px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={onBack} style={{ background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer" }}>
                {"\u2190"}
            </button>
            <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: t.text }}>{title}</p>
                {subtitle ? <p style={{ color: t.textTertiary, fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{subtitle}</p> : null}
            </div>
            {rightAction}
        </div>
    );
}

function ChatBubble({ message, theme }) {
    const t = THEMES[theme];
    const isUser = message.role === "user";

    return (
        <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 12, alignItems: "flex-end", gap: 8 }}>
            {!isUser && <MiniBlob color="#7ED6A2" face="calm" size={28} />}
            <div
                style={{
                    background: isUser ? "linear-gradient(135deg, #7ED6A2, #4CAF50)" : t.chatBubbleAI,
                    color: isUser ? "#1a1a2e" : t.chatTextAI,
                    padding: "12px 16px",
                    borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    maxWidth: "75%",
                    fontSize: 13,
                    lineHeight: 1.5,
                    fontWeight: isUser ? 500 : 400,
                    fontFamily: "'DM Sans', sans-serif",
                }}
            >
                {message.text}
            </div>
        </div>
    );
}

function IPhoneFrame({ children, theme }) {
    const isDark = theme === "dark";

    return (
        <div style={{ position: "relative", width: 393, height: 852 }}>
            <div
                style={{
                    position: "absolute",
                    inset: -14,
                    borderRadius: 60,
                    background: isDark
                        ? "linear-gradient(165deg, #3a3a3a 0%, #1c1c1c 30%, #252525 60%, #1a1a1a 100%)"
                        : "linear-gradient(165deg, #f0f0f0 0%, #d8d8d8 30%, #e5e5e5 60%, #d0d0d0 100%)",
                    boxShadow: isDark
                        ? "0 50px 100px rgba(0,0,0,0.7), 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)"
                        : "0 50px 100px rgba(0,0,0,0.15), 0 25px 50px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.05)",
                    zIndex: 0,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: -12,
                    borderRadius: 58,
                    border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.5)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            {[{ top: 160, h: 34 }, { top: 220, h: 56 }, { top: 290, h: 56 }].map((button, index) => (
                <div
                    key={`l${index}`}
                    style={{
                        position: "absolute",
                        left: -17,
                        top: button.top,
                        width: 3,
                        height: button.h,
                        borderRadius: "3px 0 0 3px",
                        background: isDark ? "linear-gradient(180deg, #444, #2a2a2a)" : "linear-gradient(180deg, #d5d5d5, #bbb)",
                    }}
                />
            ))}
            <div
                style={{
                    position: "absolute",
                    right: -17,
                    top: 240,
                    width: 3,
                    height: 72,
                    borderRadius: "0 3px 3px 0",
                    background: isDark ? "linear-gradient(180deg, #444, #2a2a2a)" : "linear-gradient(180deg, #d5d5d5, #bbb)",
                }}
            />
            <div style={{ position: "absolute", inset: -4, borderRadius: 52, background: "#000", zIndex: 1 }} />
            <div style={{ position: "relative", width: 393, height: 852, borderRadius: 47, overflow: "hidden", zIndex: 2 }}>{children}</div>
            <div
                style={{
                    position: "absolute",
                    top: 7,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 126,
                    height: 36,
                    borderRadius: 20,
                    background: "#000",
                    zIndex: 3,
                    boxShadow: "inset 0 0 4px rgba(0,0,0,0.5)",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        right: 22,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, #1a1a3e 30%, #0a0a1e 70%)",
                        border: "1px solid #222",
                    }}
                />
            </div>
            <div
                style={{
                    position: "absolute",
                    bottom: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 134,
                    height: 5,
                    borderRadius: 3,
                    background: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)",
                    zIndex: 3,
                }}
            />
        </div>
    );
}

export default function KAIbiganDemo() {
    const [theme, setTheme] = useState("dark");
    const [screen, setScreen] = useState(SCREENS.SPLASH);
    const [fadeIn, setFadeIn] = useState(true);
    const [session, setSession] = useState(null);
    const [intake, setIntake] = useState(null);
    const [moods, setMoods] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [lang, setLang] = useState("en");
    const [chatInput, setChatInput] = useState("");
    const [aiThinking, setAiThinking] = useState(false);
    const [toast, setToast] = useState("");
    const [anonForm, setAnonForm] = useState({ email: "", code: "", tier: "starter", culturalPreference: "default" });
    const [signInAttempts, setSignInAttempts] = useState(0);
    const [signInMessage, setSignInMessage] = useState("");
    const [triageAnswers, setTriageAnswers] = useState(Array(TRIAGE_QUESTIONS.length).fill(null));
    const [triageStep, setTriageStep] = useState(0);
    const [moodNote, setMoodNote] = useState("");
    const [selectedResource, setSelectedResource] = useState(null);
    const [savedResources, setSavedResources] = useState([]);
    const [resourceFilter, setResourceFilter] = useState("All");
    const [coachFilter, setCoachFilter] = useState("All");
    const [privacySheetOpen, setPrivacySheetOpen] = useState(false);
    const [bookingSheet, setBookingSheet] = useState(null);
    const [redFlagState, setRedFlagState] = useState({ open: false, onSafe: null });
    const [confirmation, setConfirmation] = useState(null);
    const chatEndRef = useRef(null);
    const safeButtonRef = useRef(null);
    const t = THEMES[theme];

    const latestMood = useMemo(() => {
        if (!moods.length) return null;
        return getMoodByName(moods[moods.length - 1].mood);
    }, [moods]);

    const filteredResources = useMemo(() => {
        return resourceFilter === "All" ? RESOURCES : RESOURCES.filter((resource) => resource.category === resourceFilter);
    }, [resourceFilter]);

    const supportAccess = useMemo(() => getSupportAccess(session?.tier, bookings), [session?.tier, bookings]);

    const filteredCoaches = useMemo(() => {
        return coachFilter === "All"
            ? COACHES
            : COACHES.filter((coach) => coach.specialties.includes(coachFilter));
    }, [coachFilter]);

    const showNav = [SCREENS.HOME, SCREENS.AI_CHAT, SCREENS.RESOURCES, SCREENS.MOOD_CALENDAR, SCREENS.PROFILE].includes(screen);
    const copy = (key) => translateDemoString(lang, key);

    useEffect(() => {
        setSession(safeRead(STORAGE_KEYS.session, null));
        setIntake(safeRead(STORAGE_KEYS.intake, null));
        setMoods(safeRead(STORAGE_KEYS.moods, createSeedMoodHistory()));
        setChatMessages(safeRead(STORAGE_KEYS.chat, []));
        setBookings(safeRead(STORAGE_KEYS.bookings, []));
        setLang(safeRead(STORAGE_KEYS.lang, "en"));
    }, []);

    useEffect(() => {
        if (screen === SCREENS.SPLASH) {
            const timeoutId = window.setTimeout(() => nav(SCREENS.WELCOME), 2200);
            return () => window.clearTimeout(timeoutId);
        }
        return undefined;
    }, [screen]);

    useEffect(() => {
        if (session) safeWrite(STORAGE_KEYS.session, session);
    }, [session]);

    useEffect(() => {
        if (intake) safeWrite(STORAGE_KEYS.intake, intake);
    }, [intake]);

    useEffect(() => {
        if (moods.length) safeWrite(STORAGE_KEYS.moods, moods);
    }, [moods]);

    useEffect(() => {
        safeWrite(STORAGE_KEYS.chat, chatMessages);
    }, [chatMessages]);

    useEffect(() => {
        safeWrite(STORAGE_KEYS.bookings, bookings);
    }, [bookings]);

    useEffect(() => {
        safeWrite(STORAGE_KEYS.lang, lang);
    }, [lang]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, aiThinking]);

    useEffect(() => {
        if (screen === SCREENS.AI_CHAT && chatMessages.length === 0) {
            setAiThinking(true);
            const timeoutId = window.setTimeout(() => {
                setChatMessages([OPENING_MESSAGE]);
                setAiThinking(false);
            }, 900);
            return () => window.clearTimeout(timeoutId);
        }
        return undefined;
    }, [screen, chatMessages.length]);

    useEffect(() => {
        if (!toast) return undefined;

        const timeoutId = window.setTimeout(() => setToast(""), 2200);
        return () => window.clearTimeout(timeoutId);
    }, [toast]);

    useEffect(() => {
        if (!redFlagState.open) return undefined;

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                setRedFlagState({ open: false, onSafe: null });
            }
        };

        window.addEventListener("keydown", onKeyDown);
        const focusId = window.setTimeout(() => safeButtonRef.current?.focus(), 50);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.clearTimeout(focusId);
        };
    }, [redFlagState.open]);

    function nav(nextScreen) {
        setFadeIn(false);
        window.setTimeout(() => {
            setScreen(nextScreen);
            setFadeIn(true);
        }, 200);
    }

    function openToast(message) {
        setToast(message);
    }

    function openRedFlag(config = {}) {
        setRedFlagState({
            open: true,
            onSafe: config.onSafe || null,
        });
    }

    function closeRedFlag() {
        const callback = redFlagState.onSafe;
        setRedFlagState({ open: false, onSafe: null });
        if (callback) callback();
    }

    function handleAnonymousContinue() {
        const empty = !anonForm.email.trim() || !anonForm.code.trim();

        if (empty && signInAttempts === 0) {
            setSignInAttempts(1);
            setSignInMessage("Add your school email to continue.");
            return;
        }

        const school = getSchoolName(anonForm.email, anonForm.code);
        const nextSession = {
            alias: pickAlias(Math.random()),
            school,
            tier: anonForm.tier,
            culturalPreference: anonForm.culturalPreference,
            createdAt: new Date().toISOString(),
        };

        setSession(nextSession);
        setSignInMessage("");
        setTriageAnswers(Array(TRIAGE_QUESTIONS.length).fill(null));
        setTriageStep(0);
        nav(SCREENS.INTAKE_TRIAGE);
    }

    function submitTriage(answers) {
        const result = computeTriageResult(answers.map((answer) => answer ?? 0));
        const payload = {
            ...result,
            timestamp: new Date().toISOString(),
        };

        setIntake(payload);

        if (result.redFlag) {
            openRedFlag({
                onSafe: () => nav(SCREENS.TRIAGE_RESULT),
            });
            return;
        }

        nav(SCREENS.TRIAGE_RESULT);
    }

    function handleTriageAnswer(value) {
        const nextAnswers = [...triageAnswers];
        nextAnswers[triageStep] = value;
        setTriageAnswers(nextAnswers);

        window.setTimeout(() => {
            if (triageStep === TRIAGE_QUESTIONS.length - 1) {
                submitTriage(nextAnswers);
            } else {
                setTriageStep((current) => current + 1);
            }
        }, 200);
    }

    function handleChatSend() {
        const trimmed = chatInput.trim();
        if (!trimmed) return;

        const nextUserMessage = {
            role: "user",
            text: trimmed,
            ts: new Date().toISOString(),
        };

        setChatMessages((current) => [...current, nextUserMessage]);
        setChatInput("");

        const reply = mockAIReply(trimmed);
        if (reply.redFlag) {
            openRedFlag();
            return;
        }

        setAiThinking(true);
        const delay = 900 + Math.floor(Math.random() * 500);
        window.setTimeout(() => {
            setChatMessages((current) => [
                ...current,
                {
                    role: "ai",
                    text: reply.text,
                    ts: new Date().toISOString(),
                },
            ]);
            setAiThinking(false);
        }, delay);
    }

    function saveMood(mood) {
        const entry = {
            date: todayIso(),
            mood: mood.name,
            note: moodNote,
        };

        setMoods((current) => {
            const withoutToday = current.filter((item) => item.date !== entry.date);
            return [...withoutToday, entry].sort((a, b) => a.date.localeCompare(b.date));
        });
        setMoodNote("");
        openToast(`${mood.name} logged.`);
        nav(SCREENS.HOME);
    }

    function bookProvider(type, provider, slot, mode = "live") {
        const entry = {
            type,
            name: provider.name,
            slot,
            mode,
        };

        setBookings((current) => [...current, entry]);
        setConfirmation(entry);
        setBookingSheet(null);
        nav(type === "coach" ? SCREENS.COACH_BOOKING_CONFIRM : SCREENS.PSYCHIATRIST_BOOKING_CONFIRM);
    }

    function handleSignOut() {
        Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
        setSession(null);
        setIntake(null);
        setMoods(createSeedMoodHistory());
        setChatMessages([]);
        setBookings([]);
        setLang("en");
        setSelectedResource(null);
        setConfirmation(null);
        setAnonForm({ email: "", code: "", tier: "starter", culturalPreference: "default" });
        setSignInAttempts(0);
        setSignInMessage("");
        setCoachFilter("All");
        setResourceFilter("All");
        nav(SCREENS.SPLASH);
    }

    const hr = new Date().getHours();
    const greeting = hr < 12 ? "Good Morning" : hr < 18 ? "Good Afternoon" : "Good Evening";
    const guidanceContact = getGuidanceContact(session?.school);

    function renderTriageResult() {
        const level = intake?.recommendedLevel || 1;
        const copyMap = {
            1: {
                heading: "Let's talk it through",
                body: "Based on what you shared, we recommend starting with your AI kaibigan. Always here, always private.",
                action: "Start chat",
                next: SCREENS.AI_CHAT,
            },
            2: {
                heading: "A coach could help",
                body: supportAccess.asyncCoaching
                    ? `Your plan includes async coaching and ${supportAccess.tier.liveCoachSessions} live coach sessions per year to keep human support prioritized for the moments that matter most.`
                    : "Your current plan stays AI-first. You can continue with your AI kaibigan and school-approved self-help tools while human support is reserved for higher tiers.",
                action: supportAccess.asyncCoaching ? "See coaching options" : "Stay with AI",
                next: supportAccess.asyncCoaching ? SCREENS.COACH_DIR : SCREENS.AI_CHAT,
            },
            3: {
                heading: "Connect with a psychiatrist",
                body: supportAccess.psychiatristAccess
                    ? "For the kind of support you need, a licensed psychiatrist is the right next step. Bookings happen through your school partnership at no cost."
                    : supportAccess.asyncCoaching
                        ? "Your plan routes this level of need through async coaching, limited live coach sessions, and formal school escalation when required. A psychiatrist consult is available on Premium accounts."
                        : "Your plan routes high-acuity needs through crisis support, school guidance escalation, and continued AI support. Psychiatrist tele-consults are reserved for Premium accounts.",
                action: supportAccess.psychiatristAccess ? "Book now" : supportAccess.asyncCoaching ? "See support options" : "Go to Home",
                next: supportAccess.psychiatristAccess ? SCREENS.PSYCHIATRIST_DIR : supportAccess.asyncCoaching ? SCREENS.COACH_DIR : SCREENS.HOME,
            },
        };
        const currentCopy = copyMap[level];

        return (
            <div style={{ flex: 1, background: t.bg, padding: "0 24px 24px", display: "flex", flexDirection: "column" }}>
                <ScreenHeader title="Your Support Path" onBack={() => nav(SCREENS.INTAKE_TRIAGE)} theme={theme} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 24 }}>
                    <Blob mood={MOODS[2]} size={120} face="calm" />
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 30, fontWeight: 700, color: t.text, marginTop: 20, lineHeight: 1.15 }}>{currentCopy.heading}</p>
                    <p style={{ color: t.textSecondary, fontSize: 13, lineHeight: 1.6, marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>{currentCopy.body}</p>
                        <div style={{ width: "100%", marginTop: 24, background: t.surface, borderRadius: 20, border: `1px solid ${t.cardBorder}`, padding: 18 }}>
                        <p style={{ fontSize: 11, color: t.textTertiary, textTransform: "uppercase", letterSpacing: 1.2, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Triage summary</p>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                            <span style={{ color: t.textSecondary, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Score</span>
                            <span style={{ color: t.text, fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{intake?.score ?? 0} / 15</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                            <span style={{ color: t.textSecondary, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Recommended level</span>
                            <span style={{ color: "#7ED6A2", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Level {level}</span>
                        </div>
                        <div style={{ width: "100%", marginTop: 12, background: theme === "dark" ? "rgba(126,214,162,0.08)" : "rgba(126,214,162,0.12)", borderRadius: 16, padding: 14 }}>
                            <p style={{ margin: 0, color: t.text, fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{supportAccess.tier.label} plan</p>
                            <p style={{ margin: "6px 0 0", color: t.textSecondary, fontSize: 12, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{supportAccess.tier.summary}</p>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: "auto", display: "grid", gap: 10 }}>
                    <button
                        onClick={() => nav(currentCopy.next)}
                        style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: 16,
                            border: "none",
                            background: "linear-gradient(135deg, #7ED6A2, #4CAF50)",
                            color: "#1a1a2e",
                            fontSize: 15,
                            fontWeight: 700,
                            fontFamily: "'DM Sans', sans-serif",
                            cursor: "pointer",
                        }}
                    >
                        {currentCopy.action}
                    </button>
                    <button
                        onClick={() => nav(SCREENS.HOME)}
                        style={{
                            width: "100%",
                            padding: "15px",
                            borderRadius: 16,
                            border: `1px solid ${t.pillBorder}`,
                            background: "transparent",
                            color: t.text,
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: "'DM Sans', sans-serif",
                            cursor: "pointer",
                        }}
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    function renderScreen() {
        switch (screen) {
            case SCREENS.SPLASH:
                return (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: theme === "dark" ? "linear-gradient(180deg, #1a1a2e, #16213e)" : "linear-gradient(180deg, #F8F7F4, #EDE9E1)" }}>
                        <div style={{ animation: "breathe 2s ease-in-out infinite" }}>
                            <Blob mood={MOODS[2]} size={100} face="happy" animate={false} />
                        </div>
                        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: t.text, marginTop: 20 }}>kAIbigan</p>
                        <p style={{ color: t.textTertiary, fontSize: 13, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>Your wellness companion</p>
                    </div>
                );

            case SCREENS.WELCOME:
                return (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 24px 28px", background: t.bg }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 34, fontWeight: 800, color: t.text, textAlign: "center", lineHeight: 1.15, animation: "fadeInUp 0.6s ease" }}>Wellness support,<br />quietly by your side.</p>
                            <p style={{ color: t.textSecondary, fontSize: 13, textAlign: "center", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", marginTop: 16, maxWidth: 250 }}>
                                Anonymous school-verified support, from AI check-ins to prioritized human escalation.
                            </p>
                        </div>
                        <div style={{ background: "linear-gradient(180deg, #FFD93D 0%, #FF9A76 100%)", borderRadius: 28, padding: "32px 20px", display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeInUp 1s ease" }}>
                            <Blob mood={MOODS[1]} size={102} face="cheerful" />
                            <button onClick={() => nav(SCREENS.ANON_SIGNIN)} style={{ width: "100%", padding: "16px", borderRadius: 16, border: "none", background: "#1a1a2e", color: "#fff", fontSize: 16, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", marginTop: 16 }}>
                                Get Started
                            </button>
                            <p style={{ color: "rgba(0,0,0,0.55)", fontSize: 13, marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>
                                Already in the demo? <span style={{ textDecoration: "underline", fontWeight: 700, color: "#1a1a2e", cursor: "pointer" }} onClick={() => nav(session ? SCREENS.HOME : SCREENS.ANON_SIGNIN)}>Continue</span>
                            </p>
                        </div>
                    </div>
                );

            case SCREENS.ANON_SIGNIN:
                return (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: t.bg, padding: "0 24px 24px" }}>
                        <div style={{ paddingTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
                            <button onClick={() => nav(SCREENS.WELCOME)} style={{ background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer" }}>
                                {"\u2190"}
                            </button>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <MiniBlob color="#7ED6A2" face="calm" size={30} />
                                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: t.text }}>kAIbigan</span>
                            </div>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Blob mood={MOODS[2]} size={90} face="calm" />
                            </div>
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 700, color: t.text, textAlign: "center", marginTop: 20 }}>Welcome to kAIbigan</p>
                            <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
                                <input
                                    value={anonForm.email}
                                    onChange={(event) => setAnonForm((current) => ({ ...current, email: event.target.value }))}
                                    placeholder="juan.delacruz@ust.edu.ph"
                                    style={{ width: "100%", padding: "16px 18px", borderRadius: 16, border: `1px solid ${t.pillBorder}`, background: t.inputBg, color: t.text, outline: "none", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}
                                />
                                <input
                                    value={anonForm.code}
                                    onChange={(event) => setAnonForm((current) => ({ ...current, code: event.target.value }))}
                                    placeholder="UST-2026"
                                    style={{ width: "100%", padding: "16px 18px", borderRadius: 16, border: `1px solid ${t.pillBorder}`, background: t.inputBg, color: t.text, outline: "none", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}
                                />
                                <div>
                                    <p style={{ color: t.textSecondary, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Demo account type</p>
                                    <div style={{ display: "grid", gap: 8 }}>
                                        {ACCOUNT_TIERS.map((tier) => (
                                            <button
                                                key={tier.id}
                                                onClick={() => setAnonForm((current) => ({ ...current, tier: tier.id }))}
                                                style={{
                                                    width: "100%",
                                                    textAlign: "left",
                                                    padding: "12px 14px",
                                                    borderRadius: 16,
                                                    border: anonForm.tier === tier.id ? "none" : `1px solid ${t.pillBorder}`,
                                                    background: anonForm.tier === tier.id ? "linear-gradient(135deg, #7ED6A2, #4CAF50)" : t.inputBg,
                                                    color: anonForm.tier === tier.id ? "#1a1a2e" : t.text,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{tier.label}</div>
                                                <div style={{ fontSize: 11, lineHeight: 1.5, opacity: 0.82, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{tier.summary}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p style={{ color: t.textSecondary, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Optional cultural preference</p>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        {CULTURAL_PREFERENCES.map((preference) => (
                                            <button
                                                key={preference.id}
                                                onClick={() => setAnonForm((current) => ({ ...current, culturalPreference: preference.id }))}
                                                style={{
                                                    padding: "8px 12px",
                                                    borderRadius: 20,
                                                    border: anonForm.culturalPreference === preference.id ? "none" : `1px solid ${t.pillBorder}`,
                                                    background: anonForm.culturalPreference === preference.id ? "#B39DDB" : "transparent",
                                                    color: anonForm.culturalPreference === preference.id ? "#1a1a2e" : t.pillText,
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    cursor: "pointer",
                                                    fontFamily: "'DM Sans', sans-serif",
                                                }}
                                            >
                                                {preference.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p style={{ color: t.textSecondary, fontSize: 12, marginTop: 12, fontFamily: "'DM Sans', sans-serif", textAlign: "center" }}>We verify your school, never your identity.</p>
                            {signInMessage ? <p style={{ color: "#FF9A76", fontSize: 12, marginTop: 10, fontFamily: "'DM Sans', sans-serif", textAlign: "center" }}>{signInMessage}</p> : null}
                        </div>
                        <div style={{ display: "grid", gap: 12 }}>
                            <button onClick={handleAnonymousContinue} style={{ width: "100%", padding: "16px", borderRadius: 16, border: "none", background: "linear-gradient(135deg, #7ED6A2, #4CAF50)", color: "#1a1a2e", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                                Continue anonymously
                            </button>
                            <button onClick={() => setPrivacySheetOpen(true)} style={{ background: "none", border: "none", color: t.textSecondary, fontSize: 13, fontFamily: "'DM Sans', sans-serif", textDecoration: "underline", cursor: "pointer" }}>
                                Learn how we protect you
                            </button>
                        </div>
                    </div>
                );

            case SCREENS.INTAKE_TRIAGE:
                return (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: t.bg, padding: "0 24px 24px" }}>
                        <div style={{ paddingTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
                            <button onClick={() => nav(SCREENS.ANON_SIGNIN)} style={{ background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer" }}>
                                {"\u2190"}
                            </button>
                            <div style={{ flex: 1 }}>
                                <div style={{ height: 6, background: t.surface, borderRadius: 999, overflow: "hidden" }}>
                                    <div style={{ width: `${((triageStep + 1) / TRIAGE_QUESTIONS.length) * 100}%`, height: "100%", background: "linear-gradient(135deg, #7ED6A2, #4CAF50)", transition: "width 0.2s ease" }} />
                                </div>
                                <p style={{ marginTop: 8, color: t.textSecondary, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>{triageStep + 1} / {TRIAGE_QUESTIONS.length}</p>
                            </div>
                            <button onClick={() => submitTriage([1, 2, 1, 1, 0])} style={{ background: "none", border: "none", color: t.textSecondary, fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                                Skip
                            </button>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <div style={{ background: t.surface, border: `1px solid ${t.cardBorder}`, borderRadius: 28, padding: 24 }}>
                                <p style={{ color: "#7ED6A2", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Quick intake</p>
                                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: t.text, lineHeight: 1.2, marginTop: 14 }}>{TRIAGE_QUESTIONS[triageStep]}</p>
                                <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
                                    {LIKERT_OPTIONS.map((option) => (
                                        <button
                                            key={option.label}
                                            onClick={() => handleTriageAnswer(option.value)}
                                            style={{
                                                width: "100%",
                                                textAlign: "left",
                                                padding: "14px 16px",
                                                borderRadius: 16,
                                                border: `1px solid ${t.pillBorder}`,
                                                background: t.pillBg,
                                                color: t.text,
                                                fontSize: 14,
                                                fontWeight: 600,
                                                fontFamily: "'DM Sans', sans-serif",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case SCREENS.TRIAGE_RESULT:
                return renderTriageResult();

            case SCREENS.ONBOARD_MOOD:
                return (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: latestMood ? `linear-gradient(180deg, ${latestMood.color}22 0%, ${t.bg} 50%)` : t.bg }}>
                        <div style={{ padding: "8px 20px", display: "flex", justifyContent: "space-between" }}>
                            <button onClick={() => nav(SCREENS.WELCOME)} style={{ background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer" }}>
                                {"\u2190"}
                            </button>
                            <button onClick={() => nav(SCREENS.HOME)} style={{ background: t.pillBg, border: "none", color: t.text, padding: "8px 20px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                                Save
                            </button>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
                            <Blob mood={latestMood || MOODS[2]} size={150} face={(latestMood || MOODS[2]).face} />
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 700, color: t.text, textAlign: "center", marginTop: 20, lineHeight: 1.2 }}>Select your<br />today's mood</p>
                            <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
                                {MOODS.map((mood) => (
                                    <button
                                        key={mood.name}
                                        onClick={() => saveMood(mood)}
                                        style={{ padding: "10px 18px", borderRadius: 24, border: `1px solid ${t.pillBorder}`, background: t.pillBg, color: t.text, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                                    >
                                        {mood.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case SCREENS.HOME:
                return (
                    <div style={{ flex: 1, overflow: "auto", padding: "0 20px 24px", background: t.bg }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0 16px" }}>
                            <div>
                                <p style={{ color: t.textSecondary, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>{greeting}, {session?.alias || "friend"}</p>
                                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: t.text, lineHeight: 1.2, marginTop: 2 }}>{copy("homeHero")}</p>
                            </div>
                            <div onClick={() => nav(SCREENS.PROFILE)} style={{ cursor: "pointer" }}>
                                <MiniBlob color={(latestMood || MOODS[2]).color} face={(latestMood || MOODS[2]).face} size={44} />
                            </div>
                        </div>
                        <GradientCard gradient="linear-gradient(135deg, #7ED6A2, #38f9d7)" onClick={() => nav(SCREENS.MOOD_CHECK)} style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "#1a1a2e", fontSize: 15 }}>How are you feeling?</p>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(0,0,0,0.55)", fontSize: 12, marginTop: 4 }}>
                                        {latestMood ? `Today: ${latestMood.name}` : "Tap to log your mood"}
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: 4 }}>{MOODS.slice(0, 4).map((mood) => <MiniBlob key={mood.name} color={mood.color} face={mood.face} size={26} />)}</div>
                            </div>
                        </GradientCard>
                        {session?.tier ? (
                            <div style={{ background: t.surface, borderRadius: 20, border: `1px solid ${t.cardBorder}`, padding: 16, marginBottom: 18 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                                    <div>
                                        <p style={{ color: t.textSecondary, fontSize: 11, letterSpacing: 1.1, textTransform: "uppercase", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{supportAccess.tier.label} account</p>
                                        <p style={{ color: t.text, fontSize: 14, fontWeight: 700, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>{supportAccess.tier.summary}</p>
                                        <p style={{ color: t.textTertiary, fontSize: 11, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>
                                            {supportAccess.asyncCoaching ? `Async coaching on • ${supportAccess.remainingLiveCoachSessions} live coach sessions left this year` : "AI-first only"}
                                        </p>
                                    </div>
                                    <div style={{ padding: "8px 12px", borderRadius: 14, background: theme === "dark" ? "rgba(179,157,219,0.18)" : "rgba(179,157,219,0.14)", fontSize: 11, fontWeight: 700, color: t.text }}>
                                        {session.culturalPreference && session.culturalPreference !== "default" ? session.culturalPreference : "No preference"}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        {intake ? (
                            <div style={{ background: t.surface, borderRadius: 20, border: `1px solid ${t.cardBorder}`, padding: 16, marginBottom: 18 }}>
                                <p style={{ color: t.textSecondary, fontSize: 11, letterSpacing: 1.1, textTransform: "uppercase", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Current support lane</p>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                                    <p style={{ color: t.text, fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Level {intake.recommendedLevel}</p>
                                    <button onClick={() => nav(SCREENS.TRIAGE_RESULT)} style={{ background: "none", border: "none", color: "#7ED6A2", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                                        View recommendation
                                    </button>
                                </div>
                            </div>
                        ) : null}
                        <p style={{ color: t.textSecondary, fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Quick Actions</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                                {[
                                    { label: "AI Companion", icon: "\ud83e\udde0", gradient: "linear-gradient(135deg, #667eea, #764ba2)", next: SCREENS.AI_CHAT },
                                    { label: supportAccess.asyncCoaching ? "Coach Support" : "Coach Locked", icon: "\ud83d\udc64", gradient: supportAccess.asyncCoaching ? "linear-gradient(135deg, #43e97b, #38f9d7)" : "linear-gradient(135deg, #848484, #b5b5b5)", next: supportAccess.asyncCoaching ? SCREENS.COACH_DIR : SCREENS.HOME },
                                    { label: supportAccess.psychiatristAccess ? "Psychiatrist" : "Premium Psychiatry", icon: "\ud83e\ude7a", gradient: supportAccess.psychiatristAccess ? "linear-gradient(135deg, #a18cd1, #7f7fd5)" : "linear-gradient(135deg, #9d8fb1, #bcb5c7)", next: supportAccess.psychiatristAccess ? SCREENS.PSYCHIATRIST_DIR : SCREENS.HOME },
                                    { label: "Resources", icon: "\ud83d\udcda", gradient: "linear-gradient(135deg, #fa709a, #fee140)", next: SCREENS.RESOURCES },
                                ].map((action) => (
                                <GradientCard key={action.label} gradient={action.gradient} onClick={() => {
                                    if (action.label === "Coach Locked") {
                                        openToast("Starter accounts stay AI-first. Switch to Growth for human coaching.");
                                        return;
                                    }
                                    if (action.label === "Premium Psychiatry") {
                                        openToast("Psychiatrist tele-consults unlock on Premium.");
                                        return;
                                    }
                                    nav(action.next);
                                }} style={{ padding: "20px 16px" }}>
                                    <p style={{ fontSize: 22 }}>{action.icon}</p>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#fff", fontSize: 13, marginTop: 8 }}>{action.label}</p>
                                </GradientCard>
                            ))}
                        </div>
                        <p style={{ color: t.textSecondary, fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>For Good Mornings</p>
                        {[
                            { title: "New Day, Fresh Start", time: "4m 30s", gradient: "linear-gradient(90deg, #FFD93D, #FF9A76)" },
                            { title: "Bright Mornings, Bold Beginnings", time: "2m 15s", gradient: "linear-gradient(90deg, #667eea, #764ba2)" },
                            { title: "Awake, Energize, Conquer", time: "4m 20s", gradient: "linear-gradient(90deg, #fa709a, #fee140)" },
                        ].map((item) => (
                            <div key={item.title} onClick={() => nav(SCREENS.AI_CHAT)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: `1px solid ${t.border}`, cursor: "pointer" }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: t.text, fontSize: 14 }}>{item.title}</p>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: t.textTertiary, fontSize: 11, marginTop: 2 }}>{item.time}</p>
                                </div>
                                <div style={{ width: 60, height: 38, borderRadius: 10, background: item.gradient }} />
                                <div style={{ width: 28, height: 28, borderRadius: 8, background: t.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: t.text }}>
                                    {"\u25B6"}
                                </div>
                            </div>
                        ))}
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                            <button
                                onClick={() => openRedFlag()}
                                style={{
                                    width: 62,
                                    height: 62,
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "linear-gradient(135deg, #FF5252, #D32F2F)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 20px rgba(255,82,82,0.4)",
                                    animation: "pulse 2s infinite",
                                }}
                            >
                                <span style={{ color: "#fff", fontSize: lang === "fil" ? 8 : 10, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>{copy("sosLabel")}</span>
                            </button>
                        </div>
                    </div>
                );

            case SCREENS.MOOD_CHECK:
                return (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: t.bg, padding: 20 }}>
                        <button onClick={() => nav(SCREENS.HOME)} style={{ background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer", alignSelf: "flex-start", marginBottom: 16 }}>
                            {"\u2190"}
                        </button>
                        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: t.text, textAlign: "center", marginBottom: 8 }}>How are you feeling?</p>
                        <p style={{ color: t.textSecondary, fontSize: 13, textAlign: "center", fontFamily: "'DM Sans', sans-serif", marginBottom: 28 }}>{copy("moodPrompt")}</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, justifyItems: "center" }}>
                            {MOODS.map((mood) => (
                                <div key={mood.name} onClick={() => saveMood(mood)} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", padding: 12, borderRadius: 20, background: theme === "dark" ? `${mood.color}16` : `${mood.color}12`, border: `2px solid ${mood.color}55`, transition: "all 0.2s" }}>
                                    <Blob mood={mood} size={66} face={mood.face} />
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: t.text, marginTop: 6 }}>{mood.name}</p>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: "auto", paddingTop: 20 }}>
                            <p style={{ color: t.textTertiary, fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Add a note (optional)</p>
                            <textarea
                                value={moodNote}
                                onChange={(event) => setMoodNote(event.target.value)}
                                placeholder="What's on your mind today..."
                                style={{ width: "100%", minHeight: 78, resize: "none", borderRadius: 16, border: `1px solid ${t.pillBorder}`, background: t.inputBg, color: t.text, padding: 14, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                            />
                        </div>
                    </div>
                );

            case SCREENS.AI_CHAT:
                return (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: t.bg }}>
                        <div style={{ padding: "8px 20px 12px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${t.border}` }}>
                            <button onClick={() => nav(SCREENS.HOME)} style={{ background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer" }}>
                                {"\u2190"}
                            </button>
                            <MiniBlob color="#7ED6A2" face="calm" size={36} />
                            <div>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: t.text, fontSize: 15 }}>kAIbigan AI</p>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#7ED6A2", fontSize: 11 }}>{copy("aiSubtitle")}</p>
                            </div>
                        </div>
                        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
                            {chatMessages.map((message, index) => (
                                <div key={`${message.ts}-${index}`} style={{ animation: "fadeInUp 0.4s ease" }}>
                                    <ChatBubble message={message} theme={theme} />
                                </div>
                            ))}
                            {aiThinking ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
                                    <MiniBlob color="#7ED6A2" face="calm" size={28} />
                                    <div style={{ display: "flex", gap: 4 }}>
                                        {[0, 1, 2].map((dot) => (
                                            <div key={dot} style={{ width: 6, height: 6, borderRadius: "50%", background: t.textTertiary, animation: `pulse 1s infinite ${dot * 0.2}s` }} />
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                            <div ref={chatEndRef} />
                        </div>
                        <div style={{ padding: "12px 20px 16px", borderTop: `1px solid ${t.border}` }}>
                            <div style={{ display: "flex", gap: 10, alignItems: "center", background: t.inputBg, borderRadius: 24, padding: "10px 16px" }}>
                                <input
                                    value={chatInput}
                                    onChange={(event) => setChatInput(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") handleChatSend();
                                    }}
                                    placeholder="Type a message..."
                                    style={{ flex: 1, background: "none", border: "none", color: t.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                                />
                                <button onClick={handleChatSend} style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7ED6A2, #4CAF50)", border: "none", color: "#fff", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {"\u2191"}
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case SCREENS.COACH_DIR:
                return (
                    <div style={{ flex: 1, overflow: "auto", background: t.bg, padding: "0 20px 20px" }}>
                        <ScreenHeader title={copy("coachHeading")} subtitle="Async coaching is available on Growth and Premium. Live sessions are capped at 2 per student per year." onBack={() => nav(SCREENS.HOME)} theme={theme} />
                        <div style={{ background: t.surface, borderRadius: 18, border: `1px solid ${t.cardBorder}`, padding: 16, marginBottom: 18 }}>
                            <p style={{ margin: 0, color: t.text, fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{supportAccess.tier.label} access</p>
                            <p style={{ margin: "6px 0 0", color: t.textSecondary, fontSize: 12, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                                {supportAccess.asyncCoaching
                                    ? `Async messaging is on. You have ${supportAccess.remainingLiveCoachSessions} of ${supportAccess.tier.liveCoachSessions} live sessions remaining this year.`
                                    : "Starter accounts are AI-first and do not include human coaching."}
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: 8, overflow: "auto", paddingBottom: 8, marginBottom: 18 }}>
                            {["All", "Academic", "Family", "Career", "Sleep", "Self-esteem"].map((label) => (
                                <button
                                    key={label}
                                    onClick={() => setCoachFilter(label)}
                                    style={{
                                        padding: "8px 14px",
                                        borderRadius: 20,
                                        border: coachFilter === label ? "none" : `1px solid ${t.pillBorder}`,
                                        background: coachFilter === label ? "#7ED6A2" : "transparent",
                                        color: coachFilter === label ? "#1a1a2e" : t.pillText,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        fontFamily: "'DM Sans', sans-serif",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        {filteredCoaches.map((coach) => (
                            <div key={coach.name} style={{ background: t.surface, borderRadius: 20, padding: 18, marginBottom: 14, border: `1px solid ${t.cardBorder}` }}>
                                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                                    <MiniBlob color={coach.color} face="calm" size={48} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: t.text, fontSize: 15 }}>{coach.name}</p>
                                            <div style={{ padding: "3px 10px", borderRadius: 12, background: coach.available ? "rgba(126,214,162,0.15)" : t.surface, border: `1px solid ${coach.available ? "#7ED6A233" : t.cardBorder}` }}>
                                                <p style={{ fontSize: 10, color: coach.available ? "#7ED6A2" : t.textTertiary, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{coach.available ? "Available" : "Offline"}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                                            {coach.specialties.map((specialty) => (
                                                <span key={specialty} style={{ padding: "3px 10px", borderRadius: 10, background: t.pillBg, fontSize: 11, color: t.pillText, fontFamily: "'DM Sans', sans-serif" }}>
                                                    {specialty}
                                                </span>
                                            ))}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                                            <span style={{ color: "#FFD93D", fontSize: 12 }}>{"\u2605"}</span>
                                            <span style={{ color: t.textSecondary, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>{coach.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                {supportAccess.asyncCoaching ? (
                                    <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
                                        <button onClick={() => bookProvider("coach", coach, "Async thread opened · Reply within 6 hrs", "async")} style={{ width: "100%", padding: "12px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #B39DDB, #81D4FA)", color: "#1a1a2e", fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                                            Message Coach
                                        </button>
                                        {coach.available ? (
                                            <button
                                                onClick={() => supportAccess.canBookLiveCoach ? setBookingSheet({ type: "coach", provider: coach }) : openToast("You’ve used your 2 live coach sessions for this year. Async coaching is still available.")}
                                                style={{ width: "100%", padding: "12px", borderRadius: 14, border: "none", background: supportAccess.canBookLiveCoach ? "linear-gradient(135deg, #7ED6A2, #4CAF50)" : "linear-gradient(135deg, #9ea7a1, #bcc5be)", color: "#1a1a2e", fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}
                                            >
                                                {supportAccess.canBookLiveCoach ? `Book Live Session (${supportAccess.remainingLiveCoachSessions} left)` : "Live Session Cap Reached"}
                                            </button>
                                        ) : null}
                                    </div>
                                ) : (
                                    <div style={{ marginTop: 14, padding: 14, borderRadius: 14, background: t.pillBg, color: t.textSecondary, fontSize: 12, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                                        Human coaching unlocks on Growth and Premium accounts. Starter stays AI-first by design.
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );

            case SCREENS.COACH_BOOKING_CONFIRM:
                return (
                    <div style={{ flex: 1, background: t.bg, padding: "0 24px 24px", display: "flex", flexDirection: "column" }}>
                        <ScreenHeader title="Session Confirmed" onBack={() => nav(SCREENS.COACH_DIR)} theme={theme} />
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(126,214,162,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7ED6A2", fontSize: 34 }}>{"\u2713"}</div>
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: t.text, marginTop: 18 }}>{confirmation?.mode === "async" ? `Async coaching opened with ${confirmation?.name}` : `You're booked with ${confirmation?.name}`}</p>
                            <div style={{ width: "100%", marginTop: 20, background: t.surface, borderRadius: 20, border: `1px solid ${t.cardBorder}`, padding: 18, textAlign: "left" }}>
                                {[
                                    { label: confirmation?.mode === "async" ? "Response window" : "Date & time", value: confirmation?.slot },
                                    { label: confirmation?.mode === "async" ? "Format" : "Duration", value: confirmation?.mode === "async" ? "Asynchronous messaging" : "45 min" },
                                    { label: confirmation?.mode === "async" ? "Priority rule" : "Meeting link", value: confirmation?.mode === "async" ? "Live sessions remain limited to 2/year" : "https://zoom.us/j/kaibigan-demo" },
                                ].map((item) => (
                                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "8px 0", borderBottom: item.label === "Meeting link" ? "none" : `1px solid ${t.border}` }}>
                                        <span style={{ color: t.textSecondary, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>{item.label}</span>
                                        <span style={{ color: t.text, fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", textAlign: "right" }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: "grid", gap: 10 }}>
                            <button onClick={() => openToast("Added")} style={{ width: "100%", padding: "16px", borderRadius: 16, border: "none", background: "linear-gradient(135deg, #7ED6A2, #4CAF50)", color: "#1a1a2e", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                                Add to calendar
                            </button>
                            <button onClick={() => nav(SCREENS.HOME)} style={{ width: "100%", padding: "15px", borderRadius: 16, border: `1px solid ${t.pillBorder}`, background: "transparent", color: t.text, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                                Back to Home
                            </button>
                        </div>
                    </div>
                );

            case SCREENS.PSYCHIATRIST_DIR:
                return (
                    <div style={{ flex: 1, overflow: "auto", background: t.bg, padding: "0 20px 20px" }}>
                        <ScreenHeader title="Psychiatrist Tele-consults" subtitle="Level 3 support through your school partnership." onBack={() => nav(SCREENS.HOME)} theme={theme} />
                        <div style={{ background: t.surface, borderRadius: 18, border: `1px solid ${t.cardBorder}`, padding: 16, marginBottom: 18 }}>
                            <p style={{ margin: 0, color: t.text, fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{supportAccess.tier.label} access</p>
                            <p style={{ margin: "6px 0 0", color: t.textSecondary, fontSize: 12, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                                {supportAccess.psychiatristAccess ? "Premium includes psychiatrist tele-consults after triage or Red Flag escalation." : "Psychiatrist tele-consults are reserved for Premium accounts. Growth and Starter routes continue through async coaching, guidance escalation, and crisis resources."}
                            </p>
                        </div>
                        {PSYCHIATRISTS.map((doctor) => (
                            <div key={doctor.name} style={{ background: t.surface, borderRadius: 20, padding: 18, marginBottom: 14, border: `1px solid ${t.cardBorder}` }}>
                                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                                    <MiniBlob color={doctor.color} face="calm" size={48} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: t.text, fontSize: 15 }}>{doctor.name}</p>
                                        <p style={{ color: t.textSecondary, fontSize: 12, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{doctor.specialty}</p>
                                        <p style={{ color: "#7ED6A2", fontSize: 12, marginTop: 8, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Next slot: {doctor.nextSlot}</p>
                                    </div>
                                </div>
                                <button onClick={() => supportAccess.psychiatristAccess ? setBookingSheet({ type: "psychiatrist", provider: doctor }) : openToast("Psychiatrist tele-consults unlock on Premium.")} style={{ width: "100%", marginTop: 14, padding: "12px", borderRadius: 14, border: "none", background: supportAccess.psychiatristAccess ? "linear-gradient(135deg, #B39DDB, #81D4FA)" : "linear-gradient(135deg, #9d8fb1, #bcb5c7)", color: "#1a1a2e", fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                                    {supportAccess.psychiatristAccess ? "Book now" : "Premium only"}
                                </button>
                            </div>
                        ))}
                    </div>
                );

            case SCREENS.PSYCHIATRIST_BOOKING_CONFIRM:
                return (
                    <div style={{ flex: 1, background: t.bg, padding: "0 24px 24px", display: "flex", flexDirection: "column" }}>
                        <ScreenHeader title="Tele-consult Confirmed" onBack={() => nav(SCREENS.PSYCHIATRIST_DIR)} theme={theme} />
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(126,214,162,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#7ED6A2", fontSize: 34 }}>{"\u2713"}</div>
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: t.text, marginTop: 18 }}>You're booked with {confirmation?.name}</p>
                            <p style={{ color: t.textSecondary, fontSize: 13, lineHeight: 1.6, marginTop: 12, fontFamily: "'DM Sans', sans-serif", maxWidth: 260 }}>
                                A secure Zoom link will arrive in your app notifications 30 minutes before your session. Your session is covered by your school partnership.
                            </p>
                            <div style={{ width: "100%", marginTop: 20, background: t.surface, borderRadius: 20, border: `1px solid ${t.cardBorder}`, padding: 18, textAlign: "left" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
                                    <span style={{ color: t.textSecondary, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Date & time</span>
                                    <span style={{ color: t.text, fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{confirmation?.slot}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                                    <span style={{ color: t.textSecondary, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Meeting</span>
                                    <span style={{ color: t.text, fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Secure Zoom consult</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "grid", gap: 10 }}>
                            <button onClick={() => openToast("Added")} style={{ width: "100%", padding: "16px", borderRadius: 16, border: "none", background: "linear-gradient(135deg, #7ED6A2, #4CAF50)", color: "#1a1a2e", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                                Add to calendar
                            </button>
                            <button onClick={() => nav(SCREENS.HOME)} style={{ width: "100%", padding: "15px", borderRadius: 16, border: `1px solid ${t.pillBorder}`, background: "transparent", color: t.text, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                                Back to Home
                            </button>
                        </div>
                    </div>
                );

            case SCREENS.MOOD_CALENDAR: {
                const recentMoods = [...moods].slice(-28);

                return (
                    <div style={{ flex: 1, overflow: "auto", background: t.bg, padding: "0 20px 20px" }}>
                        <ScreenHeader title="Mood Calendar" subtitle={formatMonthLabel()} onBack={() => nav(SCREENS.HOME)} theme={theme} />
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
                            {recentMoods.map((entry) => {
                                const mood = getMoodByName(entry.mood);
                                return (
                                    <div key={entry.date} style={{ padding: "10px 8px", borderRadius: 14, background: theme === "dark" ? `${mood.color}18` : `${mood.color}12`, textAlign: "center" }}>
                                        <MiniBlob color={mood.color} face={mood.face} size={32} />
                                        <p style={{ color: t.text, fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginTop: 6 }}>{formatCalendarLabel(entry.date)}</p>
                                        <p style={{ color: t.textTertiary, fontSize: 10, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{entry.mood}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <GradientCard gradient={theme === "dark" ? "linear-gradient(135deg, #7ED6A244, #7ED6A211)" : "linear-gradient(135deg, #7ED6A233, #7ED6A211)"} style={{ marginBottom: 14 }}>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: t.textSecondary, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>Monthly Summary</p>
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: "#7ED6A2", marginTop: 4 }}>{latestMood?.name || "Calm"}</p>
                            <p style={{ color: t.textSecondary, fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>Your recent check-ins are saved here even after refresh.</p>
                        </GradientCard>
                    </div>
                );
            }

            case SCREENS.RESOURCES:
                return (
                    <div style={{ flex: 1, overflow: "auto", background: t.bg, padding: "0 20px 20px" }}>
                        <ScreenHeader title={copy("resourceHeading")} onBack={() => nav(SCREENS.HOME)} theme={theme} />
                        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflow: "auto", paddingBottom: 4 }}>
                            {["All", "Academic", "CBT", "Sleep", "Exercise", "Self-Help"].map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setResourceFilter(category)}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: 20,
                                        border: resourceFilter === category ? "none" : `1px solid ${t.pillBorder}`,
                                        background: resourceFilter === category ? "#7ED6A2" : "transparent",
                                        color: resourceFilter === category ? "#1a1a2e" : t.pillText,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        fontFamily: "'DM Sans', sans-serif",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        {filteredResources.map((resource) => (
                            <GradientCard key={resource.id} gradient={resource.gradient} onClick={() => { setSelectedResource(resource); nav(SCREENS.RESOURCE_DETAIL); }} style={{ marginBottom: 12, padding: "20px" }}>
                                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{resource.category}</p>
                                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: "#fff", marginTop: 6, lineHeight: 1.3 }}>{resource.title}</p>
                                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>{resource.duration}</p>
                            </GradientCard>
                        ))}
                    </div>
                );

            case SCREENS.RESOURCE_DETAIL:
                return (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: t.bg }}>
                        <div style={{ padding: 20, paddingBottom: 0 }}>
                            <button onClick={() => nav(SCREENS.RESOURCES)} style={{ background: "none", border: "none", color: t.text, fontSize: 20, cursor: "pointer" }}>
                                {"\u2190"}
                            </button>
                        </div>
                        <div style={{ flex: 1, overflow: "auto", padding: "12px 20px 120px" }}>
                            <div style={{ borderRadius: 28, overflow: "hidden", background: selectedResource?.gradient || "linear-gradient(135deg, #667eea, #764ba2)", padding: 24 }}>
                                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{selectedResource?.category}</p>
                                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: "#fff", marginTop: 10, lineHeight: 1.2 }}>{selectedResource?.title}</p>
                            </div>
                            <p style={{ color: t.textSecondary, fontSize: 12, lineHeight: 1.6, marginTop: 16, fontFamily: "'DM Sans', sans-serif" }}>{selectedResource?.author} · {selectedResource?.duration}</p>
                            <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
                                {(selectedResource?.content || []).map((paragraph) => (
                                    <p key={paragraph.slice(0, 24)} style={{ color: t.text, fontSize: 13, lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif" }}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                        <div style={{ position: "absolute", left: 20, right: 20, bottom: showNav ? 96 : 24 }}>
                            <button
                                onClick={() => {
                                    setSavedResources((current) => current.includes(selectedResource?.id) ? current.filter((id) => id !== selectedResource?.id) : [...current, selectedResource?.id]);
                                    openToast(savedResources.includes(selectedResource?.id) ? "Removed from saved." : "Saved for later.");
                                }}
                                style={{ width: "100%", padding: "16px", borderRadius: 18, border: "none", background: "linear-gradient(135deg, #7ED6A2, #4CAF50)", color: "#1a1a2e", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", boxShadow: "0 12px 24px rgba(0,0,0,0.18)" }}
                            >
                                {savedResources.includes(selectedResource?.id) ? "Saved ✓" : "Save for later"}
                            </button>
                        </div>
                    </div>
                );

            case SCREENS.PROFILE:
                return (
                    <div style={{ flex: 1, overflow: "auto", background: t.bg, padding: "0 20px 20px" }}>
                        <ScreenHeader title="Profile" onBack={() => nav(SCREENS.HOME)} theme={theme} />
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0 28px" }}>
                            <Blob mood={latestMood || MOODS[2]} size={90} face={(latestMood || MOODS[2]).face} />
                            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: t.text, marginTop: 12 }}>{session?.alias || "Moonbeam"}</p>
                            <p style={{ color: t.textTertiary, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>{session?.school || "Your school"} · {supportAccess.tier.label} account</p>
                        </div>
                        <div style={{ background: t.surface, borderRadius: 20, border: `1px solid ${t.cardBorder}`, padding: 16, marginBottom: 18 }}>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: t.text, fontSize: 14 }}>Plan & preference</p>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", color: t.textTertiary, fontSize: 11, marginTop: 4 }}>{supportAccess.tier.summary}</p>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                                <span style={{ color: t.textSecondary, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Live coach sessions left</span>
                                <span style={{ color: t.text, fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{supportAccess.remainingLiveCoachSessions}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                                <span style={{ color: t.textSecondary, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Cultural preference</span>
                                <span style={{ color: t.text, fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{CULTURAL_PREFERENCES.find((item) => item.id === session?.culturalPreference)?.label || "No preference"}</span>
                            </div>
                        </div>
                        <div style={{ background: t.surface, borderRadius: 20, border: `1px solid ${t.cardBorder}`, padding: 16, marginBottom: 18 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                                <div>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: t.text, fontSize: 14 }}>Language</p>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: t.textTertiary, fontSize: 11 }}>Demo strings switch instantly</p>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {[
                                        { key: "en", label: "EN" },
                                        { key: "fil", label: "FIL" },
                                    ].map((option) => (
                                        <button
                                            key={option.key}
                                            onClick={() => setLang(option.key)}
                                            style={{
                                                padding: "8px 12px",
                                                borderRadius: 14,
                                                border: lang === option.key ? "none" : `1px solid ${t.pillBorder}`,
                                                background: lang === option.key ? "#7ED6A2" : "transparent",
                                                color: lang === option.key ? "#1a1a2e" : t.text,
                                                fontSize: 12,
                                                fontWeight: 700,
                                                fontFamily: "'DM Sans', sans-serif",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {[
                            { label: "Privacy Settings", value: "Manage your data", icon: "\ud83d\udd12" },
                            { label: "Notifications", value: "Daily reminders", icon: "\ud83d\udd14" },
                            { label: "Help & FAQ", value: "Get support", icon: "\u2753" },
                            { label: "About kAIbigan", value: "Version 1.0", icon: "\u2139\ufe0f" },
                        ].map((item) => (
                            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: `1px solid ${t.border}`, cursor: "pointer" }}>
                                <div style={{ width: 38, height: 38, borderRadius: 12, background: t.profileIcon, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{item.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: t.text, fontSize: 14 }}>{item.label}</p>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: t.textTertiary, fontSize: 11 }}>{item.value}</p>
                                </div>
                                <span style={{ color: t.textMuted, fontSize: 16 }}>{"\u203A"}</span>
                            </div>
                        ))}
                        <button onClick={handleSignOut} style={{ width: "100%", marginTop: 24, padding: "15px", borderRadius: 16, border: `1px solid ${t.pillBorder}`, background: "transparent", color: "#FF8A80", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                            Sign out (demo)
                        </button>
                    </div>
                );

            default:
                return null;
        }
    }

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: theme === "dark"
                    ? "radial-gradient(ellipse at 30% 20%, #1e1e3f 0%, #0d0d1a 50%, #000 100%)"
                    : "radial-gradient(ellipse at 30% 20%, #f0ede6 0%, #e8e4db 50%, #d5d0c5 100%)",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                overflow: "hidden",
                position: "relative",
                transition: "background 0.6s ease",
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ::-webkit-scrollbar { width: 0; }
                button, input, textarea { font: inherit; }
                @keyframes blobFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
                @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.3); opacity: 1; } }
                @keyframes float1 { 0%, 100% { transform: translate(0,0) rotate(0); } 33% { transform: translate(30px,-20px) rotate(5deg); } 66% { transform: translate(-15px,10px) rotate(-3deg); } }
                @keyframes float2 { 0%, 100% { transform: translate(0,0) rotate(0); } 33% { transform: translate(-25px,15px) rotate(-4deg); } 66% { transform: translate(20px,-25px) rotate(6deg); } }
                @keyframes sheetUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>

            <div style={{ position: "absolute", top: "8%", left: "6%", opacity: theme === "dark" ? 0.06 : 0.08, animation: "float1 20s ease-in-out infinite", pointerEvents: "none" }}>
                <Blob mood={MOODS[2]} size={180} face="calm" animate={false} />
            </div>
            <div style={{ position: "absolute", bottom: "10%", right: "5%", opacity: theme === "dark" ? 0.05 : 0.07, animation: "float2 25s ease-in-out infinite", pointerEvents: "none" }}>
                <Blob mood={MOODS[3]} size={140} face="anxious" animate={false} />
            </div>
            <div style={{ position: "absolute", top: "55%", left: "3%", opacity: theme === "dark" ? 0.04 : 0.05, animation: "float2 18s ease-in-out infinite 3s", pointerEvents: "none" }}>
                <Blob mood={MOODS[0]} size={100} face="happy" animate={false} />
            </div>

            <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <MiniBlob color="#7ED6A2" face="happy" size={32} />
                    <div>
                        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: theme === "dark" ? "#fff" : "#1a1a2e", letterSpacing: -0.3 }}>kAIbigan</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: theme === "dark" ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", letterSpacing: 2, textTransform: "uppercase" }}>Interactive Prototype</p>
                    </div>
                </div>
                <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 40, border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`, background: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", cursor: "pointer", transition: "all 0.4s ease" }}>
                    <div style={{ width: 44, height: 24, borderRadius: 12, position: "relative", background: theme === "dark" ? "linear-gradient(135deg, #1a1a2e, #2d2d5e)" : "linear-gradient(135deg, #FFD93D, #FF9A76)", transition: "background 0.4s ease", boxShadow: theme === "dark" ? "inset 0 1px 3px rgba(0,0,0,0.4)" : "inset 0 1px 3px rgba(0,0,0,0.15)" }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: theme === "dark" ? 3 : 23, transition: "left 0.3s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)", minWidth: 32 }}>{theme === "dark" ? "Dark" : "Light"}</span>
                </button>
            </div>

            <div style={{ transform: "scale(0.82)", transformOrigin: "center center" }}>
                <IPhoneFrame theme={theme}>
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', system-ui, sans-serif", overflow: "hidden", transition: "background 0.4s ease", position: "relative" }}>
                        <div style={{ padding: "14px 28px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, fontWeight: 600, color: t.statusBar, fontFamily: "'DM Sans', sans-serif", flexShrink: 0, position: "relative", zIndex: 5 }}>
                            <span>9:41</span>
                            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                                <svg width="16" height="12" viewBox="0 0 16 12" fill={t.statusBar}><rect x="0" y="8" width="3" height="4" rx="0.5" /><rect x="4.5" y="5" width="3" height="7" rx="0.5" /><rect x="9" y="2" width="3" height="10" rx="0.5" /><rect x="13" y="0" width="3" height="12" rx="0.5" /></svg>
                                <svg width="16" height="12" viewBox="0 0 16 12" fill={t.statusBar}><path d="M8 2C5.5 2 3.2 3 1.5 4.7L0 3.2C2.1 1.2 4.9 0 8 0s5.9 1.2 8 3.2l-1.5 1.5C12.8 3 10.5 2 8 2zm0 4c-1.7 0-3.2.7-4.3 1.8L2.2 6.3C3.7 4.9 5.7 4 8 4s4.3.9 5.8 2.3l-1.5 1.5C11.2 6.7 9.7 6 8 6zm0 4c-1 0-1.9.4-2.6 1.1L4 9.7C5 8.6 6.4 8 8 8s3 .6 4 1.7l-1.4 1.4C9.9 10.4 9 10 8 10zm0 2l2-2c-.5-.6-1.2-1-2-1s-1.5.4-2 1l2 2z" /></svg>
                                <svg width="22" height="12" viewBox="0 0 22 12" fill={t.statusBar}><rect x="0" y="1" width="18" height="10" rx="2" stroke={t.statusBar} strokeWidth="1" fill="none" /><rect x="19" y="4" width="2" height="4" rx="1" /><rect x="1.5" y="2.5" width="14" height="7" rx="1" /></svg>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", opacity: fadeIn ? 1 : 0, transition: "opacity 0.2s ease", paddingBottom: showNav ? 82 : 0 }}>
                            {renderScreen()}
                        </div>

                        {showNav ? (
                            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 16px 20px", background: t.navBg, backdropFilter: "blur(12px)", borderTop: `1px solid ${t.border}`, flexShrink: 0, zIndex: 30 }}>
                                {[
                                    { icon: "\ud83c\udfe0", label: "Home", next: SCREENS.HOME },
                                    { icon: "\ud83d\udcac", label: "Chat", next: SCREENS.AI_CHAT },
                                    { icon: "\ud83e\udded", label: "Explore", next: SCREENS.RESOURCES },
                                    { icon: "\ud83d\udcc5", label: "Calendar", next: SCREENS.MOOD_CALENDAR },
                                    { icon: "blob", label: "Profile", next: SCREENS.PROFILE },
                                ].map((item) => {
                                    const active = screen === item.next;

                                    return (
                                        <button key={item.label} onClick={() => nav(item.next)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", color: active ? "#7ED6A2" : t.textTertiary }}>
                                            {item.icon === "blob" ? <MiniBlob color={(latestMood || MOODS[2]).color} face={(latestMood || MOODS[2]).face} size={22} /> : <span style={{ fontSize: 17 }}>{item.icon}</span>}
                                            <span style={{ fontSize: 9, color: active ? "#7ED6A2" : t.text, fontFamily: "'DM Sans', sans-serif", fontWeight: active ? 700 : 400 }}>{item.label}</span>
                                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: active ? "#7ED6A2" : "transparent" }} />
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}

                        {toast ? <div style={toastStyle(theme)}>{toast}</div> : null}

                        {privacySheetOpen ? (
                            <>
                                <div onClick={() => setPrivacySheetOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />
                                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, minHeight: "44%", borderRadius: "24px 24px 0 0", background: t.bg, padding: "24px 20px 28px", zIndex: 41, animation: "sheetUp 0.2s ease" }}>
                                    <div style={{ width: 46, height: 4, borderRadius: 999, background: t.textMuted, margin: "0 auto 18px" }} />
                                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: t.text }}>Privacy first, by design.</p>
                                    <p style={{ color: t.textSecondary, fontSize: 13, lineHeight: 1.7, marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>
                                        kAIbigan verifies your school so your support benefits stay connected to your campus. The demo never asks for your legal identity, and the app only shows your anonymous alias inside the experience.
                                    </p>
                                    <p style={{ color: t.textSecondary, fontSize: 13, lineHeight: 1.7, marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>
                                        Administrators only see aggregated trends, not your chat transcript, mood log, or name. The goal is support without exposing the person asking for help.
                                    </p>
                                    <button onClick={() => setPrivacySheetOpen(false)} style={{ width: "100%", marginTop: 20, padding: "15px", borderRadius: 16, border: "none", background: "linear-gradient(135deg, #7ED6A2, #4CAF50)", color: "#1a1a2e", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                                        I understand
                                    </button>
                                </div>
                            </>
                        ) : null}

                        {bookingSheet ? (
                            <>
                                <div onClick={() => setBookingSheet(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 45 }} />
                                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, minHeight: "42%", borderRadius: "24px 24px 0 0", background: t.bg, padding: "24px 20px 28px", zIndex: 46, animation: "sheetUp 0.2s ease" }}>
                                    <div style={{ width: 46, height: 4, borderRadius: 999, background: t.textMuted, margin: "0 auto 18px" }} />
                                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: t.text }}>Choose a time</p>
                                    <p style={{ color: t.textSecondary, fontSize: 13, marginTop: 8, fontFamily: "'DM Sans', sans-serif" }}>{bookingSheet.provider.name}</p>
                                    <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
                                        {(bookingSheet.type === "coach"
                                            ? ["Tomorrow · 10:00 AM", "Tomorrow · 3:00 PM", "Fri · 1:30 PM", "Sat · 11:00 AM"]
                                            : [bookingSheet.provider.nextSlot, "Sat 11:30 AM", "Mon 2:00 PM", "Tue 4:30 PM"]).map((slot) => (
                                                <button key={slot} onClick={() => bookProvider(bookingSheet.type, bookingSheet.provider, slot)} style={{ width: "100%", textAlign: "left", padding: "14px 16px", borderRadius: 16, border: `1px solid ${t.pillBorder}`, background: t.pillBg, color: t.text, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                                                    {slot}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            </>
                        ) : null}

                        {redFlagState.open ? (
                            <>
                                <div onClick={() => setRedFlagState({ open: false, onSafe: null })} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }} />
                                <div role="dialog" aria-modal="true" style={{ position: "absolute", left: 0, right: 0, bottom: 0, minHeight: "70%", borderRadius: "24px 24px 0 0", background: t.bg, zIndex: 51, animation: "sheetUp 0.2s ease", overflow: "hidden" }}>
                                    <div style={{ height: 4, background: "linear-gradient(135deg, #FF5252, #D32F2F)" }} />
                                    <div style={{ padding: "22px 20px 28px" }}>
                                        <div style={{ width: 46, height: 4, borderRadius: 999, background: t.textMuted, margin: "0 auto 18px" }} />
                                        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: t.text }}>You're not alone right now.</p>
                                        <p style={{ color: t.textSecondary, fontSize: 13, lineHeight: 1.7, marginTop: 10, fontFamily: "'DM Sans', sans-serif" }}>If you're in immediate danger, please reach out — help is one tap away.</p>
                                        {[
                                            { label: "National Center for Mental Health Crisis Hotline", number: "1553 (toll-free, 24/7)" },
                                            { label: "In Touch Community Services", number: "+63 2 8893 7606" },
                                            guidanceContact,
                                        ].map((contact) => (
                                            <a key={contact.label} href={`tel:${contact.number.replace(/[^\d+]/g, "")}`} style={{ display: "flex", gap: 12, alignItems: "center", textDecoration: "none", background: t.surface, border: `1px solid ${t.cardBorder}`, borderRadius: 18, padding: 16, marginTop: 14 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 14, background: "rgba(255,82,82,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5252", fontSize: 18 }}>
                                                    {"\u260E"}
                                                </div>
                                                <div>
                                                    <p style={{ color: t.text, fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{contact.label}</p>
                                                    <p style={{ color: "#FF8A80", fontSize: 12, marginTop: 3, fontFamily: "'DM Sans', sans-serif" }}>{contact.number}</p>
                                                </div>
                                            </a>
                                        ))}
                                        <button ref={safeButtonRef} onClick={closeRedFlag} style={{ width: "100%", marginTop: 18, padding: "15px", borderRadius: 16, border: `1px solid ${t.pillBorder}`, background: "transparent", color: t.text, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                                            I'm safe for now
                                        </button>
                                        <button onClick={() => { setRedFlagState({ open: false, onSafe: null }); nav(SCREENS.PSYCHIATRIST_DIR); }} style={{ background: "none", border: "none", color: "#FF8A80", textDecoration: "underline", fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "block", margin: "16px auto 0" }}>
                                            Talk to a psychiatrist instead
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </IPhoneFrame>
            </div>

            <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)", letterSpacing: 2, textTransform: "uppercase" }}>
                    Tap through screens to explore • Interactive Demo
                </p>
            </div>
        </div>
    );
}
