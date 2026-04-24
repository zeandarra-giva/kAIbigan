import { theme } from "./theme";

function formatDay(offset) {
  const date = new Date(2026, 3, 23 - offset);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function createDailyActive() {
  return Array.from({ length: 90 }, (_, index) => {
    const day = 89 - index;
    const weekday = day % 7;
    const weekendDip = weekday === 0 || weekday === 6 ? -320 : 0;
    const examSpike = index > 54 && index < 66 ? 380 : 0;
    const trend = 3050 + index * 6;
    const pulse = Math.round(Math.sin(index / 4) * 90);

    return {
      label: formatDay(day),
      value: trend + weekendDip + examSpike + pulse,
    };
  });
}

function createSparkline(base, variance) {
  return Array.from({ length: 12 }, (_, index) => ({
    value: Math.round(base + Math.sin(index / 2) * variance + index * 4),
  }));
}

function createHeatmap(rows, cols, formula) {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      value: formula(row, col),
    })),
  );
}

function createRetentionGrid() {
  return Array.from({ length: 8 }, (_, row) => ({
    cohort: `Week ${row + 1}`,
    values: Array.from({ length: 8 }, (_, col) =>
      col < row ? null : Math.max(28, 82 - (col - row) * 9 - row * 2),
    ),
  }));
}

function createTimeOfDayHeatmap() {
  return createHeatmap(7, 24, (row, col) => {
    const lateNightBoost = col >= 22 || col <= 1 ? 80 : 0;
    const midday = col >= 12 && col <= 14 ? 25 : 0;
    const weekdayBoost = row >= 1 && row <= 5 ? 15 : -8;
    return Math.max(8, lateNightBoost + midday + weekdayBoost + ((row + col) % 6) * 9);
  });
}

function createRedFlagHeatmap() {
  return createHeatmap(7, 13, (row, col) => {
    const examWeek = col >= 8 && col <= 10 ? 4 : 0;
    return Math.max(0, ((row + col) % 4) + examWeek);
  });
}

function createCrisisEvents() {
  const triggers = ["AI Chat", "Intake Q5", "SOS Button"];
  const responses = [
    "Hotline surfaced · Guidance notified · Professional escalation",
    "Hotline surfaced · Guidance notified",
    "Professional escalation",
    "Hotline surfaced",
  ];
  const severities = ["High", "Medium"];
  const statuses = ["Closed", "Closed", "Escalated", "Ongoing"];

  return Array.from({ length: 22 }, (_, index) => {
    const day = 18 - index;
    const date = new Date(2026, 3, Math.max(1, day), 23 - (index % 5), 42 - (index % 6) * 4);
    return {
      id: `RF-2026-${String(41 - index).padStart(3, "0")}`,
      trigger: triggers[index % triggers.length],
      severity: severities[index % severities.length],
      dateTime: date.toISOString(),
      response: responses[index % responses.length],
      status: statuses[index % statuses.length],
    };
  });
}

export const mockSession = {
  role: "admin",
};

export const institution = {
  name: "University of Santo Tomas",
  unit: "Office of Student Affairs",
  logoUrl: "/ust-logo.png",
  primaryContact: "Prof. Ana Villanueva",
  totalStudents: 5120,
};

export const overview = {
  kpisByRange: {
    "7d": {
      activeStudents: { value: 3289, delta: 0.076, trend: "up", sparkline: createSparkline(2900, 90) },
      sessionsThisWeek: { value: 3916, delta: 0.053, trend: "up", sparkline: createSparkline(3200, 120) },
      wellbeingScore: { value: 6.2, delta: 0.2, trend: "up", sparkline: createSparkline(58, 3) },
      redFlagEvents90d: { value: 4, delta: -0.11, trend: "down", sparkline: createSparkline(9, 2) },
    },
    "30d": {
      activeStudents: { value: 3628, delta: 0.104, trend: "up", sparkline: createSparkline(3300, 110) },
      sessionsThisWeek: { value: 10944, delta: 0.074, trend: "up", sparkline: createSparkline(8900, 180) },
      wellbeingScore: { value: 6.3, delta: 0.2, trend: "up", sparkline: createSparkline(61, 4) },
      redFlagEvents90d: { value: 12, delta: -0.14, trend: "down", sparkline: createSparkline(15, 2) },
    },
    "90d": {
      activeStudents: { value: 3847, delta: 0.124, trend: "up", sparkline: createSparkline(3520, 120) },
      sessionsThisWeek: { value: 14226, delta: 0.081, trend: "up", sparkline: createSparkline(11500, 220) },
      wellbeingScore: { value: 6.4, delta: 0.3, trend: "up", sparkline: createSparkline(63, 4) },
      redFlagEvents90d: { value: 23, delta: -0.18, trend: "down", sparkline: createSparkline(28, 3) },
    },
    semester: {
      activeStudents: { value: 4018, delta: 0.137, trend: "up", sparkline: createSparkline(3650, 130) },
      sessionsThisWeek: { value: 18214, delta: 0.089, trend: "up", sparkline: createSparkline(14700, 260) },
      wellbeingScore: { value: 6.5, delta: 0.4, trend: "up", sparkline: createSparkline(64, 4) },
      redFlagEvents90d: { value: 23, delta: -0.18, trend: "down", sparkline: createSparkline(30, 3) },
    },
  },
  dailyActive: createDailyActive(),
  topStressors: [
    { label: "Academic pressure", value: 41 },
    { label: "Family expectations", value: 22 },
    { label: "Financial stress", value: 14 },
    { label: "Sleep", value: 12 },
    { label: "Relationships", value: 11 },
  ],
  triageDistribution: [
    { level: "L1 — AI", value: 62, color: "#7ED6A2" },
    { level: "L2 — Counselor", value: 28, color: "#B39DDB" },
    { level: "L3 — Professional", value: 10, color: "#81D4FA" },
  ],
  totalIntakes: 5120,
  chatTopics: [
    { topic: "Exams", count: 842 },
    { topic: "Sleep", count: 611 },
    { topic: "Family", count: 548 },
    { topic: "Anxiety", count: 479 },
    { topic: "Motivation", count: 401 },
    { topic: "Relationships", count: 318 },
  ],
  counselorActivation: [
    { label: "Active this week", value: "4 of 4 counselors" },
    { label: "Avg response", value: "3h 12m" },
    { label: "Sessions this month", value: "82 booked" },
  ],
  redFlagHeatmap: createRedFlagHeatmap(),
};

export const engagement = {
  kpis: {
    onboarded: { value: 5120, delta: 0.16, trend: "up", sparkline: createSparkline(4280, 140) },
    weeklyActives: { value: 3847, delta: 0.124, trend: "up", sparkline: createSparkline(3420, 110) },
    avgSessionsPerUser: { value: 3.7, delta: 0.09, trend: "up", sparkline: createSparkline(32, 3) },
  },
  retention: createRetentionGrid(),
  funnel: [
    { stage: "Sign-in", value: 5120 },
    { stage: "Intake", value: 4740 },
    { stage: "First mood log", value: 4186 },
    { stage: "First AI chat", value: 3562 },
    { stage: "First counselor booking", value: 1174 },
  ],
  timeOfDay: createTimeOfDayHeatmap(),
};

export const wellbeing = {
  averageScore: { value: 6.4, delta: 0.3, trend: "up", sparkline: createSparkline(61, 4) },
  scoreTrend: Array.from({ length: 12 }, (_, index) => ({
    label: `W${index + 1}`,
    Overall: 5.7 + index * 0.06 + (index % 3) * 0.08,
    SHS: 5.5 + index * 0.05,
    Undergrad: 5.8 + index * 0.07 + (index % 2) * 0.05,
    Grad: 6.0 + index * 0.04,
  })),
  moodDistribution: Array.from({ length: 10 }, (_, index) => ({
    label: `W${index + 1}`,
    Joyful: 14 + (index % 3),
    Cheerful: 16 + ((index + 1) % 3),
    Calm: 24 + (index % 4),
    Anxious: 22 - (index % 3) + (index > 6 ? 3 : 0),
    Sad: 15 - (index % 2),
    Angry: 9 + (index % 2),
  })),
  phqByCollege: [
    { college: "Engineering", negative: -3.8, positive: 2.1 },
    { college: "Arts", negative: -3.2, positive: 2.6 },
    { college: "Business", negative: -2.9, positive: 2.9 },
    { college: "Medicine", negative: -4.4, positive: 1.7 },
    { college: "Education", negative: -2.6, positive: 3.1 },
  ],
  insights: [
    "Academic anxiety spikes 3x on the week before midterms. Consider targeted messaging to high-load colleges.",
    "Undergraduate wellbeing improves fastest after students complete a first counselor session.",
    "Late-night usage and sleep-related distress move together, especially from 10 PM to 1 AM.",
  ],
};

export const triage = {
  stages: [
    { name: "Intake", value: 5120, color: theme.chart[0] },
    { name: "Level 1 AI", value: 3174, color: theme.chart[1] },
    { name: "Level 2 Counselor", value: 1432, color: theme.chart[2] },
    { name: "Level 3 Professional", value: 514, color: theme.chart[3] },
  ],
  kpis: {
    l1ToL2: { label: "AI→counselor escalation", value: "28.4%" },
    l2ToL3: { label: "Counselor→professional escalation", value: "35.9%" },
    timeToFirstSession: { label: "Median time-to-first-session", value: "17 hrs" },
  },
  completion: [
    { label: "Level 1 completion", value: 0.83, color: theme.chart[0] },
    { label: "Level 2 completion", value: 0.74, color: theme.chart[1] },
    { label: "Level 3 completion", value: 0.68, color: theme.chart[2] },
  ],
  explanation: {
    title: "How triage routes your students",
    body: "Students begin with a short five-question check-in. Lower scores stay with the AI for immediate self-guided support, moderate scores are routed first to guidance counselor support, and higher-acuity cases or red-flag signals are escalated to licensed professionals and crisis response contacts.",
  },
};

export const crisis = {
  kpis: { events90d: 23, avgResponseSec: 38, closedWithoutEscalationPct: 0.78 },
  events: createCrisisEvents(),
  protocol: [
    "Trigger detected by AI chat, intake screener, or SOS.",
    "Hotline surfaced immediately inside the student app.",
    "Guidance office notified per partner protocol.",
    "Licensed professional escalation initiated when indicated.",
  ],
};

export const resources = {
  items: [
    { title: "Managing Academic Pressure", category: "Academic", views: 1240, completionRate: 0.71, avgSessionLength: "4m 48s", saveRate: 0.24 },
    { title: "Breathing for Calm", category: "Exercise", views: 980, completionRate: 0.84, avgSessionLength: "2m 51s", saveRate: 0.19 },
    { title: "Understanding Your Anxiety", category: "Self-Help", views: 1115, completionRate: 0.68, avgSessionLength: "6m 02s", saveRate: 0.28 },
    { title: "Better Sleep Tonight", category: "Sleep", views: 860, completionRate: 0.79, avgSessionLength: "5m 19s", saveRate: 0.22 },
    { title: "Thought Reframing 101", category: "CBT", views: 720, completionRate: 0.64, avgSessionLength: "3m 44s", saveRate: 0.16 },
  ],
  categoryEngagement: [
    { name: "Academic", value: 41, fill: theme.chart[0] },
    { name: "Sleep", value: 18, fill: theme.chart[2] },
    { name: "Self-Help", value: 16, fill: theme.chart[1] },
    { name: "Exercise", value: 14, fill: theme.chart[3] },
    { name: "CBT", value: 11, fill: theme.chart[4] },
  ],
};

export const coaches = {
  policy: {
    liveSessionCap: "2 live sessions / student / year",
    asyncResponse: "< 6 hours",
    liveSessionUtilization: "81% of annual live-session capacity used",
    asyncThreads: "2,184 counselor threads this quarter",
  },
  tabs: {
    counselors: [
      {
        Provider: "Ms. Ria Santos, RGC",
        "Sessions this month": 118,
        "Async handled": 412,
        "Avg response": "3h 05m",
        Caseload: 84,
        "No-show": "8%",
      },
      {
        Provider: "Mr. Marco Dela Cruz, RGC",
        "Sessions this month": 96,
        "Async handled": 351,
        "Avg response": "3h 42m",
        Caseload: 76,
        "No-show": "11%",
      },
    ],
    professionals: [
      {
        Provider: "Dr. Martin Guzman, Psychiatrist",
        "Sessions this month": 44,
        "Premium-covered": 30,
        "Avg wait": "2.1 days",
        Rating: 4.9,
        "No-show": "6%",
      },
      {
        Provider: "Dr. Liwanag Reyes, Psychologist",
        "Sessions this month": 38,
        "Premium-covered": 27,
        "Avg wait": "2.5 days",
        Rating: 4.8,
        "No-show": "8%",
      },
    ],
    poolHealth: [
      { Metric: "Total professionals in pool", Value: "20" },
      { Metric: "Credentialing audits (30d)", Value: "12 completed" },
      { Metric: "Scope-of-practice flags", Value: "0 open" },
    ],
  },
  bookingHeatmap: createHeatmap(7, 8, (row, col) => Math.max(5, ((row + col) % 5) * 12 + (col > 4 ? 18 : 0))),
  underutilized: ["Tuesday · 2:00 PM", "Thursday · 11:00 AM", "Friday · 4:30 PM"],
};

export const counselorWorkspace = {
  kpis: {
    caseload: 84,
    unread: 12,
    sessionsToday: 6,
    highPriority: 4,
  },
  caseload: [
    { alias: "Moonbeam", lane: "Level 2", lastActivity: "1h ago", risk: "Medium", nextStep: "Reply to async thread" },
    { alias: "Starling", lane: "Level 3", lastActivity: "3h ago", risk: "High", nextStep: "Confirm professional referral" },
    { alias: "Kite", lane: "Level 2", lastActivity: "Today", risk: "Low", nextStep: "Session at 2:00 PM" },
  ],
  messages: [
    { alias: "Moonbeam", preview: "I felt the panic again before class.", time: "10:42 AM" },
    { alias: "Starling", preview: "Can we move tomorrow's slot to 4 PM?", time: "9:15 AM" },
    { alias: "Lumen", preview: "I tried the breathing script and it helped.", time: "Yesterday" },
  ],
  schedule: [
    { alias: "Kite", type: "Live counselor session", time: "2:00 PM", status: "Confirmed" },
    { alias: "Pebble", type: "Live counselor session", time: "3:30 PM", status: "Awaiting check-in" },
    { alias: "Starling", type: "Professional handoff review", time: "5:00 PM", status: "Needs notes" },
  ],
  handbook: [
    "Review intake summary and recent messages before each session.",
    "If Red Flag language appears, trigger hotline surfacing and follow school protocol immediately.",
    "Escalate to licensed professionals for sustained high-acuity signals.",
    "Document actions using aliases only; never record real identities.",
  ],
};

export const settings = {
  institutionProfile: {
    name: "University of Santo Tomas",
    logo: "/ust-logo.png",
    contact: "Prof. Ana Villanueva",
    admins: ["Prof. Ana Villanueva", "Miguel Santos", "Leah Ramos"],
  },
  privacy: {
    doesNotShare: [
      "Individual student identities",
      "Chat transcripts",
      "Personal mood logs",
    ],
    researchEnabled: false,
  },
  integration: {
    sso: "Connected",
    crisisContacts: ["Guidance office hotline", "School physician", "Partnered professional roster"],
    dpaLink: "#",
  },
};
