export const STORAGE_KEYS = {
    session: "kaibigan:session",
    intake: "kaibigan:intake",
    moods: "kaibigan:moods",
    chat: "kaibigan:chat",
    bookings: "kaibigan:bookings",
    lang: "kaibigan:lang",
};

export const ACCOUNT_TIERS = [
    {
        id: "starter",
        label: "Starter",
        summary: "AI-first support with self-guided care tools.",
        liveCoachSessions: 0,
        asyncCoaching: false,
        psychiatristAccess: false,
        liveTherapySessions: 0,
    },
    {
        id: "growth",
        label: "Growth",
        summary: "AI + guidance counselor messaging and unlimited live counselor sessions.",
        liveCoachSessions: Infinity,
        asyncCoaching: true,
        psychiatristAccess: false,
        liveTherapySessions: 0,
    },
    {
        id: "premium",
        label: "Premium",
        summary: "Full stepped-care access, including 2 licensed professional sessions.",
        liveCoachSessions: Infinity,
        asyncCoaching: true,
        psychiatristAccess: true,
        liveTherapySessions: 2,
    },
];

export const CULTURAL_PREFERENCES = [
    { id: "default", label: "No preference" },
    { id: "taglish", label: "Taglish tone" },
    { id: "filipino", label: "Filipino-first" },
    { id: "family", label: "Family-aware framing" },
    { id: "faith", label: "Faith-sensitive support" },
];

export const ALIASES = [
    "Moonbeam",
    "Starling",
    "Kite",
    "Lumen",
    "Willow",
    "Pebble",
    "Finch",
    "Mango",
    "Ember",
    "Cloud",
];

export const TRIAGE_QUESTIONS = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep",
    "Feeling tired or having little energy",
    "Thoughts that you'd be better off not being here",
];

export const LIKERT_OPTIONS = [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half", value: 2 },
    { label: "Nearly every day", value: 3 },
];

export const DEMO_TRANSLATIONS = {
    en: {
        homeHero: "Start your day here!",
        sosLabel: "SOS",
        aiSubtitle: "Online • Level 1 CBT",
        moodPrompt: "Select the blob that matches your mood",
        coachHeading: "Book a Guidance Counselor",
        resourceHeading: "Resource Library",
    },
    fil: {
        homeHero: "Simulan natin ang araw mo.",
        sosLabel: "SAKLOLO",
        aiSubtitle: "Online • Antas 1 CBT",
        moodPrompt: "Piliin ang blob na tugma sa nararamdaman mo",
        coachHeading: "Mag-book ng Guidance Counselor",
        resourceHeading: "Mga Resource",
    },
};

export function pickAlias(randomValue = Math.random()) {
    const normalized = Number.isFinite(randomValue) ? randomValue : Math.random();
    const index = Math.max(0, Math.min(ALIASES.length - 1, Math.floor(normalized * ALIASES.length)));
    return ALIASES[index];
}

export function computeTriageResult(answers = []) {
    const normalizedAnswers = TRIAGE_QUESTIONS.map((_, index) => Number(answers[index] ?? 0));
    const score = normalizedAnswers.reduce((sum, value) => sum + value, 0);
    const redFlag = normalizedAnswers[4] > 0;

    if (redFlag) {
        return {
            level: "RED_FLAG",
            recommendedLevel: 3,
            score,
            answers: normalizedAnswers,
            redFlag,
        };
    }

    if (score <= 4) {
        return { level: 1, recommendedLevel: 1, score, answers: normalizedAnswers, redFlag };
    }

    if (score <= 9) {
        return { level: 2, recommendedLevel: 2, score, answers: normalizedAnswers, redFlag };
    }

    return { level: 3, recommendedLevel: 3, score, answers: normalizedAnswers, redFlag };
}

export function mockAIReply(userText = "") {
    const text = userText.toLowerCase();

    if (/\b(kill|suicide|end it|die|not here)\b/.test(text)) {
        return { redFlag: true };
    }

    if (/\b(exam|exams|final|finals|test|school|grades?)\b/.test(text)) {
        return {
            text: "Exams can feel like the whole world is riding on them. Let's try one grounding breath together — in for 4, hold for 4, out for 6. I'll count with you.",
        };
    }

    if (/\b(anxious|anxiety|panic|worried)\b/.test(text)) {
        return {
            text: "I hear you. Anxiety often pulls us into the future. Can you name 3 things you can see right now in the room with you?",
        };
    }

    if (/\b(family|parents?|mom|dad|lola|tito|tita)\b/.test(text)) {
        return {
            text: "Family can carry a lot of weight — love and pressure at the same time. What part of this feels heaviest today?",
        };
    }

    if (/\b(sad|down|lonely|tired)\b/.test(text)) {
        return {
            text: "Thank you for telling me. That takes courage. Would you rather talk it through, or do something small together to shift the feeling?",
        };
    }

    return { text: "I'm listening. Tell me more about what's on your mind." };
}

export function translateDemoString(lang = "en", key) {
    return DEMO_TRANSLATIONS[lang]?.[key] ?? DEMO_TRANSLATIONS.en[key] ?? key;
}

export function getTierConfig(tierId = "starter") {
    return ACCOUNT_TIERS.find((tier) => tier.id === tierId) || ACCOUNT_TIERS[0];
}

export function countLiveCoachBookings(bookings = []) {
    return bookings.filter((booking) => booking.type === "coach" && booking.mode === "live").length;
}

export function countLiveTherapyBookings(bookings = []) {
    return bookings.filter((booking) => booking.type === "professional" && booking.mode === "live").length;
}

export function getSupportAccess(tierId, bookings = []) {
    const tier = getTierConfig(tierId);
    const usedLiveCoachSessions = countLiveCoachBookings(bookings);
    const usedLiveTherapySessions = countLiveTherapyBookings(bookings);

    return {
        tier,
        asyncCoaching: tier.asyncCoaching,
        psychiatristAccess: tier.psychiatristAccess,
        usedLiveCoachSessions,
        remainingLiveCoachSessions: tier.liveCoachSessions === Infinity ? "Unlimited" : Math.max(0, tier.liveCoachSessions - usedLiveCoachSessions),
        canBookLiveCoach: tier.liveCoachSessions === Infinity || usedLiveCoachSessions < tier.liveCoachSessions,
        usedLiveTherapySessions,
        remainingLiveTherapySessions: Math.max(0, (tier.liveTherapySessions || 0) - usedLiveTherapySessions),
        canBookLiveTherapy: usedLiveTherapySessions < (tier.liveTherapySessions || 0),
    };
}
