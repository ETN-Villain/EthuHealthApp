import React, { useMemo, useState } from "react";

import studentsData from "../data/students.json";
import challengesData from "../data/challenges.json";
import completionsData from "../data/completions.json";
import attendanceData from "../data/attendance.json";
import parentSummariesData from "../data/parentSummaries.json";

import ChallengeList from "../components/ChallengeList";

function ChildHome() {
  const [students, setStudents] = useState(
    Array.isArray(studentsData) ? studentsData : []
  );
  const [challenges] = useState(
    Array.isArray(challengesData) ? challengesData : []
  );
  const [completions, setCompletions] = useState(
    Array.isArray(completionsData) ? completionsData : []
  );
  const [attendance] = useState(
    Array.isArray(attendanceData) ? attendanceData : []
  );
  const [parentSummaries, setParentSummaries] = useState(
    Array.isArray(parentSummariesData) ? parentSummariesData : []
  );

  const [selectedStudentId, setSelectedStudentId] = useState("student_1");

  const student = students.find((item) => item.id === selectedStudentId);

  const studentChallenges = useMemo(() => {
    if (!student) return [];

    return challenges.filter(
      (challenge) =>
        Array.isArray(challenge.assignedTo) &&
        challenge.assignedTo.includes(student.id)
    );
  }, [challenges, student]);

  const completedChallengeIds = useMemo(() => {
    if (!student) return new Set();

    return new Set(
      completions
        .filter((c) => c.studentId === student.id)
        .map((c) => c.challengeId)
    );
  }, [completions, student]);

  const completedCount = studentChallenges.filter((c) =>
    completedChallengeIds.has(c.id)
  ).length;

  const weeklyAttendanceCount = attendance.filter(
    (a) => a.studentId === student?.id && a.present
  ).length;

  const studentParentSummary = parentSummaries.find(
    (s) => s.studentId === student?.id
  );

  function calculateLevel(xp) {
    return Math.floor(xp / 100) + 1;
  }

  function addXpAndUnlocks(item, xpReward) {
    const newXp = Number(item.xp || 0) + xpReward;
    const cosmetics = item.avatar?.cosmetics || [];

    const unlockGoldHeadband =
      newXp >= 150 && !cosmetics.includes("gold-headband");

    return {
      ...item,
      xp: newXp,
      level: calculateLevel(newXp),
      avatar: {
        ...item.avatar,
        cosmetics: unlockGoldHeadband
          ? [...cosmetics, "gold-headband"]
          : cosmetics,
      },
    };
  }

  function handleCompleteChallenge(challenge) {
    if (!student) return;
    if (completedChallengeIds.has(challenge.id)) return;

    const xpReward = Number(challenge.xpReward || 0);

    const newCompletion = {
      id: `completion_${Date.now()}`,
      challengeId: challenge.id,
      studentId: student.id,
      completedAt: new Date().toISOString(),
    };

    const updatedStudents = students.map((item) =>
      item.id === student.id ? addXpAndUnlocks(item, xpReward) : item
    );

    const updatedParentSummaries = parentSummaries.map((summary) => {
      if (summary.studentId !== student.id) return summary;

      return {
        ...summary,
        weeklyChallengesCompleted:
          Number(summary.weeklyChallengesCompleted || 0) + 1,
      };
    });

    setCompletions((prev) => [...prev, newCompletion]);
    setStudents(updatedStudents);
    setParentSummaries(updatedParentSummaries);
  }

  function handleHealthyChoice() {
    if (!student) return;

    const updatedStudents = students.map((item) =>
      item.id === student.id ? addXpAndUnlocks(item, 5) : item
    );

    const updatedParentSummaries = parentSummaries.map((summary) => {
      if (summary.studentId !== student.id) return summary;

      return {
        ...summary,
        healthyChoiceCount: Number(summary.healthyChoiceCount || 0) + 1,
      };
    });

    setStudents(updatedStudents);
    setParentSummaries(updatedParentSummaries);
  }

  if (!student) {
    return (
      <div style={styles.page}>
        <h1>No student found</h1>
      </div>
    );
  }

  const xpProgress = Number(student.xp || 0) % 100;
  const cosmetics = student.avatar?.cosmetics || [];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.selectorSection}>
          <label style={styles.label} htmlFor="student-select">
            👋 Who is playing?
          </label>

          <select
            id="student-select"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            style={styles.select}
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </section>

        <section style={styles.hero}>
          <div>
            <p style={styles.kicker}>🌟 Your Adventure</p>
            <h1 style={styles.title}>Hi {student.name}!</h1>
            <p style={styles.subtitle}>
              Pick one small mission. Try your best. Every win counts.
            </p>
          </div>

          <div style={styles.avatarCard}>
            <div style={styles.avatarBubble}>🦁</div>
            <h2 style={styles.avatarName}>
              {student.avatar?.character || "Hero"}
            </h2>
            <p style={styles.avatarText}>
              {cosmetics.length > 0
                ? `Wearing: ${cosmetics.join(", ")}`
                : "No outfit yet"}
            </p>
          </div>
        </section>

        <section style={styles.bigStats}>
          <div style={styles.statCard}>
            <span style={styles.statEmoji}>⭐</span>
            <p style={styles.statLabel}>Level</p>
            <h2 style={styles.statValue}>{student.level || 1}</h2>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statEmoji}>⚡</span>
            <p style={styles.statLabel}>Power Points</p>
            <h2 style={styles.statValue}>{student.xp || 0}</h2>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statEmoji}>✅</span>
            <p style={styles.statLabel}>Missions Done</p>
            <h2 style={styles.statValue}>
              {completedCount}/{studentChallenges.length}
            </h2>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statEmoji}>🎒</span>
            <p style={styles.statLabel}>Club Visits</p>
            <h2 style={styles.statValue}>{weeklyAttendanceCount}</h2>
          </div>
        </section>

        <section style={styles.progressCard}>
          <div style={styles.progressHeader}>
            <strong>🚀 Next Level</strong>
            <span>{xpProgress}/100</span>
          </div>

          <div style={styles.progressOuter}>
            <div
              style={{
                ...styles.progressInner,
                width: `${xpProgress}%`,
              }}
            />
          </div>

          <p style={styles.helperText}>
            Fill the bar by completing missions and healthy choices.
          </p>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>🎯 Today’s Missions</h2>
            <p style={styles.helperText}>Choose one. You don’t have to do all at once.</p>
          </div>

          <ChallengeList
            studentChallenges={studentChallenges}
            completedChallengeIds={completedChallengeIds}
            onCompleteChallenge={handleCompleteChallenge}
          />
        </section>

        <section style={styles.choiceCard}>
          <div>
            <h2 style={styles.sectionTitle}>🍎 Healthy Choice</h2>
            <p style={styles.choiceText}>
              Did you pick water, fruit, protein, or another smart choice today?
            </p>
          </div>

          <button
            type="button"
            onClick={handleHealthyChoice}
            style={styles.bigButton}
          >
            I did it! +5 ⚡
          </button>
        </section>

        <section style={styles.tipCard}>
          <h2 style={styles.sectionTitle}>💡 Tiny Tip</h2>
          <p style={styles.choiceText}>
            Your body likes fuel. Try a snack with fruit, yoghurt, eggs, chicken,
            beans, or nuts if you can eat them.
          </p>
        </section>

        <section style={styles.rewardCard}>
          <h2 style={styles.sectionTitle}>🎁 Rewards</h2>
          <p style={styles.choiceText}>
            Reach 150 power points to unlock the gold headband.
          </p>
          <div style={styles.rewardPill}>
            {cosmetics.includes("gold-headband")
              ? "🏆 Gold headband unlocked!"
              : "🔒 Gold headband locked"}
          </div>
        </section>

        <section style={styles.parentPreview}>
          <h2 style={styles.sectionTitle}>🧡 Your Wins</h2>
          <p style={styles.choiceText}>
            Healthy choices:{" "}
            <strong>{studentParentSummary?.healthyChoiceCount ?? 0}</strong>
          </p>
          <p style={styles.choiceText}>
            Mission wins: <strong>{completedCount}</strong>
          </p>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #eef7ff 0%, #f7f0ff 45%, #fff8e8 100%)",
    padding: "24px 14px",
    fontFamily:
      "'Trebuchet MS', 'Comic Sans MS', Arial, system-ui, sans-serif",
    color: "#172554",
  },
  container: {
    maxWidth: "1120px",
    margin: "0 auto",
  },
  selectorSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
    background: "#ffffff",
    padding: "16px",
    borderRadius: "24px",
    border: "3px solid #bfdbfe",
    boxShadow: "0 8px 0 #93c5fd",
    flexWrap: "wrap",
  },
  label: {
    fontWeight: 900,
    color: "#1e3a8a",
    fontSize: "18px",
  },
  select: {
    padding: "14px 16px",
    borderRadius: "16px",
    border: "3px solid #93c5fd",
    fontSize: "18px",
    fontWeight: 800,
    background: "#eff6ff",
    color: "#1e3a8a",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "18px",
    alignItems: "stretch",
    marginBottom: "20px",
    background: "#ffffff",
    padding: "26px",
    borderRadius: "32px",
    border: "4px solid #fde68a",
    boxShadow: "0 10px 0 #facc15",
  },
  kicker: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 900,
    color: "#7c3aed",
  },
  title: {
    margin: "8px 0",
    fontSize: "48px",
    lineHeight: 1,
    color: "#1e3a8a",
  },
  subtitle: {
    margin: 0,
    fontSize: "22px",
    lineHeight: 1.35,
    color: "#475569",
    maxWidth: "680px",
  },
  avatarCard: {
    background: "#ecfeff",
    border: "4px solid #67e8f9",
    borderRadius: "28px",
    padding: "18px",
    textAlign: "center",
    boxShadow: "0 8px 0 #22d3ee",
  },
  avatarBubble: {
    width: "110px",
    height: "110px",
    margin: "0 auto 10px",
    borderRadius: "999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fef3c7",
    fontSize: "58px",
    border: "4px solid #f59e0b",
  },
  avatarName: {
    margin: "0 0 6px",
    fontSize: "24px",
    color: "#155e75",
  },
  avatarText: {
    margin: 0,
    color: "#0f766e",
    fontWeight: 800,
  },
  bigStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },
  statCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "20px",
    border: "4px solid #ddd6fe",
    boxShadow: "0 8px 0 #c4b5fd",
    textAlign: "center",
  },
  statEmoji: {
    fontSize: "34px",
    display: "block",
    marginBottom: "8px",
  },
  statLabel: {
    margin: 0,
    fontSize: "17px",
    fontWeight: 900,
    color: "#6d28d9",
  },
  statValue: {
    margin: "8px 0 0",
    fontSize: "38px",
    color: "#312e81",
  },
  progressCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "22px",
    border: "4px solid #bbf7d0",
    boxShadow: "0 8px 0 #86efac",
    marginBottom: "22px",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "20px",
    color: "#166534",
    marginBottom: "12px",
  },
  progressOuter: {
    width: "100%",
    height: "26px",
    borderRadius: "999px",
    background: "#dcfce7",
    overflow: "hidden",
    border: "3px solid #86efac",
  },
  progressInner: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #22c55e, #84cc16)",
    transition: "width 0.25s ease",
  },
  section: {
    marginBottom: "22px",
  },
  sectionHeader: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "18px",
    marginBottom: "14px",
    border: "3px solid #fecaca",
    boxShadow: "0 6px 0 #fca5a5",
  },
  sectionTitle: {
    fontSize: "28px",
    margin: "0 0 8px",
    color: "#1e3a8a",
  },
  helperText: {
    margin: "8px 0 0",
    color: "#475569",
    fontSize: "17px",
    fontWeight: 700,
  },
  choiceCard: {
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    alignItems: "center",
    flexWrap: "wrap",
    background: "#ffffff",
    borderRadius: "28px",
    padding: "22px",
    border: "4px solid #fed7aa",
    boxShadow: "0 8px 0 #fdba74",
    marginBottom: "22px",
  },
  choiceText: {
    margin: 0,
    color: "#475569",
    fontSize: "19px",
    lineHeight: 1.4,
    fontWeight: 700,
  },
  bigButton: {
    border: "none",
    borderRadius: "22px",
    padding: "18px 24px",
    fontSize: "20px",
    fontWeight: 900,
    cursor: "pointer",
    background: "#f97316",
    color: "#ffffff",
    boxShadow: "0 7px 0 #c2410c",
  },
  tipCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "22px",
    border: "4px solid #a7f3d0",
    boxShadow: "0 8px 0 #6ee7b7",
    marginBottom: "22px",
  },
  rewardCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "22px",
    border: "4px solid #fde68a",
    boxShadow: "0 8px 0 #facc15",
    marginBottom: "22px",
  },
  rewardPill: {
    display: "inline-block",
    marginTop: "14px",
    padding: "12px 16px",
    borderRadius: "999px",
    background: "#fef3c7",
    color: "#92400e",
    fontWeight: 900,
    fontSize: "18px",
    border: "3px solid #f59e0b",
  },
  parentPreview: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "22px",
    border: "4px solid #fbcfe8",
    boxShadow: "0 8px 0 #f9a8d4",
    marginBottom: "22px",
  },
};

export default ChildHome;