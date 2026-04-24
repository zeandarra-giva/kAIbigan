import test from "node:test";
import assert from "node:assert/strict";

import {
    countLiveCoachBookings,
    computeTriageResult,
    getSupportAccess,
    getTierConfig,
    mockAIReply,
    pickAlias,
    translateDemoString,
} from "./demoLogic.js";

test("pickAlias maps deterministic random values into the alias list", () => {
    assert.equal(pickAlias(0), "Moonbeam");
    assert.equal(pickAlias(0.31), "Lumen");
    assert.equal(pickAlias(0.99), "Cloud");
});

test("computeTriageResult returns level 1 for low scores", () => {
    const result = computeTriageResult([0, 1, 1, 0, 0]);

    assert.equal(result.level, 1);
    assert.equal(result.recommendedLevel, 1);
    assert.equal(result.score, 2);
    assert.equal(result.redFlag, false);
});

test("computeTriageResult returns level 2 for moderate scores", () => {
    const result = computeTriageResult([1, 2, 2, 1, 0]);

    assert.equal(result.level, 2);
    assert.equal(result.recommendedLevel, 2);
    assert.equal(result.score, 6);
});

test("computeTriageResult escalates red-flag answers regardless of score", () => {
    const result = computeTriageResult([0, 0, 0, 0, 1]);

    assert.equal(result.level, "RED_FLAG");
    assert.equal(result.recommendedLevel, 3);
    assert.equal(result.redFlag, true);
});

test("mockAIReply detects crisis language", () => {
    assert.deepEqual(mockAIReply("sometimes I feel like I should die"), { redFlag: true });
});

test("mockAIReply returns topic-aware scripted support", () => {
    assert.match(mockAIReply("I am stressed about exams").text, /Exams can feel like the whole world/i);
    assert.match(mockAIReply("family problems").text, /Family can carry a lot of weight/i);
});

test("translateDemoString falls back to English", () => {
    assert.equal(translateDemoString("fil", "coachHeading"), "Mag-book ng Guidance Counselor");
    assert.equal(translateDemoString("x", "coachHeading"), "Book a Guidance Counselor");
});

test("tier config exposes async and psychiatrist access by plan", () => {
    assert.equal(getTierConfig("starter").asyncCoaching, false);
    assert.equal(getTierConfig("growth").liveCoachSessions, 2);
    assert.equal(getTierConfig("premium").psychiatristAccess, true);
});

test("support access tracks annual live session caps", () => {
    const bookings = [
        { type: "coach", mode: "live" },
        { type: "coach", mode: "async" },
        { type: "coach", mode: "live" },
    ];

    assert.equal(countLiveCoachBookings(bookings), 2);
    assert.equal(getSupportAccess("growth", bookings).canBookLiveCoach, false);
    assert.equal(getSupportAccess("growth", bookings).remainingLiveCoachSessions, 0);
    assert.equal(getSupportAccess("premium", bookings).psychiatristAccess, true);
});
