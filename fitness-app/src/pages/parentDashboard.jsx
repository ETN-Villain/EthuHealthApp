import React, { useMemo, useState } from "react";

import studentsData from "../data/students.json";
import challengesData from "../data/challenges.json";
import completionsData from "../data/completions.json";
import attendanceData from "../data/attendance.json";
import parentSummariesData from "../data/parentSummaries.json";
import parentsData from "../data/parents.json";

function ParentDashboard() {
  const students = Array.isArray(studentsData) ? studentsData : [];
  const parents = Array.isArray(parentsData) ? parentsData : [];
  const challenges = Array.isArray(challengesData) ? challengesData : [];
  const completions = Array.isArray(completionsData) ? completionsData : [];
  const attendance = Array.isArray(attendanceData) ? attendanceData : [];
  const parentSummaries = Array.isArray(parentSummariesData)
    ? parentSummariesData
    : [];

  const [selectedParentId, setSelectedParentId] = useState("parent_1");
  const [selectedStudentId, setSelectedStudentId] = useState("student_1");

  const selectedParent = parents.find(
    (parent) => parent.id === selectedParentId
  );

  const parentChildren = students.filter((student) =>
    selectedParent?.children?.includes(student.id)
  );

  const student =
    parentChildren.find((item) => item.id === selectedStudentId) ||
    parentChildren[0];

  const studentChallenges = useMemo(() => {
    if (!student) return [];

    return challenges.filter(
      (challenge) =>
        Array.isArray(challenge.assignedTo) &&
        challenge.assignedTo.includes(student.id)
    );
  }, [challenges, student]);

  if (!student) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1>No child found for this parent</h1>
        </div>
      </div>
    );
  }

  const completedCount = studentChallenges.filter((challenge) =>
    completedChallengeIds.has(challenge.id)
  ).length;

  const attendanceCount = attendance.filter(
    (entry) => entry.studentId === student.id && entry.present
  ).length;

  const parentSummary = parentSummaries.find(
    (summary) => summary.studentId === student.id
  );

  const completionPercent =
    studentChallenges.length === 0
      ? 0
      : Math.round((completedCount / studentChallenges.length) * 100);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.selectorSection}>
          <div>
            <label style={styles.label} htmlFor="parent-select">
              Select parent
            </label>
            <select
              id="parent-select"
              value={selectedParentId}
              onChange={(e) => {
                setSelectedParentId(e.target.value);
                const firstChildForParent = students.find(
                  (student) => student.parentId === e.target.value
                );
                if (firstChildForParent) {
                  setSelectedStudentId(firstChildForParent.id);
                }
              }}
              style={styles.select}
            >
            {parents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.name}
              </option>
            ))}
            </select>
          </div>

          <div>
            <label style={styles.label} htmlFor="child-select">
              Select child
            </label>
            <select
              id="child-select"
              value={student.id}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              style={styles.select}
            >
              {parentChildren.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <header style={styles.header}>
          <p style={styles.kicker}>Parent Mode</p>
          <h1 style={styles.title}>{student.name}'s Progress</h1>
          <p style={styles.subtitle}>
            A simple overview of activity, confidence, and healthy habits.
          </p>
        </header>

        <section style={styles.statsGrid}>
          <div style={styles.card}>
            <p style={styles.label}>Level</p>
            <h2 style={styles.value}>{student.level || 1}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.label}>XP</p>
            <h2 style={styles.value}>{student.xp || 0}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.label}>Weekly Challenges</p>
            <h2 style={styles.value}>
              {completedCount}/{studentChallenges.length}
            </h2>
          </div>

          <div style={styles.card}>
            <p style={styles.label}>Attendance</p>
            <h2 style={styles.value}>{attendanceCount}</h2>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Weekly Completion</h2>

          <div style={styles.panel}>
            <div style={styles.progressHeader}>
              <span>{completionPercent}% complete</span>
              <span>
                {completedCount}/{studentChallenges.length} challenges
              </span>
            </div>

            <div style={styles.progressOuter}>
              <div
                style={{
                  ...styles.progressInner,
                  width: `${completionPercent}%`,
                }}
              />
            </div>
          </div>
        </section>

        <section style={styles.twoColumn}>
          <div style={styles.panel}>
            <h2 style={styles.sectionTitle}>Healthy Choices</h2>
            <p style={styles.bigNumber}>
              {parentSummary?.healthyChoiceCount ?? 0}
            </p>
            <p style={styles.muted}>
              Healthy choices logged by {student.name}.
            </p>
          </div>

          <div style={styles.panel}>
            <h2 style={styles.sectionTitle}>Strength Milestone</h2>
            <p style={styles.milestone}>
              {parentSummary?.strengthMilestone || "No milestone added yet."}
            </p>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Challenge Breakdown</h2>

          <div style={styles.challengeList}>
            {studentChallenges.map((challenge) => {
              const isDone = completedChallengeIds.has(challenge.id);

              return (
                <div key={challenge.id} style={styles.challengeRow}>
                  <div>
                    <strong>{challenge.title}</strong>
                    <p style={styles.muted}>{challenge.category}</p>
                  </div>

                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(isDone ? styles.statusDone : styles.statusPending),
                    }}
                  >
                    {isDone ? "Completed" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Private Parent Notes</h2>
          <div style={styles.warningPanel}>
            Height, weight, and sensitive progress tracking should live here
            later. Keep this private from the child view.
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "32px 16px",
    fontFamily: "Arial, sans-serif",
    color: "#1f2937",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  selectorSection: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
    background: "#ffffff",
    padding: "16px",
    borderRadius: "18px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 700,
    color: "#374151",
  },
  select: {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    minWidth: "180px",
  },
  header: {
    marginBottom: "24px",
  },
  kicker: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#6b7280",
  },
  title: {
    margin: "8px 0",
    fontSize: "36px",
  },
  subtitle: {
    margin: 0,
    fontSize: "16px",
    color: "#4b5563",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  value: {
    margin: "8px 0 0",
    fontSize: "28px",
  },
  section: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "24px",
    margin: "0 0 14px",
  },
  panel: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "10px",
    color: "#4b5563",
    flexWrap: "wrap",
  },
  progressOuter: {
    width: "100%",
    height: "14px",
    borderRadius: "999px",
    background: "#e5e7eb",
    overflow: "hidden",
  },
  progressInner: {
    height: "100%",
    borderRadius: "999px",
    background: "#2563eb",
    transition: "width 0.25s ease",
  },
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  bigNumber: {
    margin: 0,
    fontSize: "42px",
    fontWeight: 800,
  },
  milestone: {
    margin: 0,
    fontSize: "18px",
    color: "#374151",
  },
  muted: {
    margin: "4px 0 0",
    color: "#6b7280",
  },
  challengeList: {
    display: "grid",
    gap: "12px",
  },
  challengeRow: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  statusBadge: {
    borderRadius: "999px",
    padding: "6px 12px",
    fontSize: "13px",
    fontWeight: 700,
  },
  statusDone: {
    background: "#dcfce7",
    color: "#166534",
  },
  statusPending: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  warningPanel: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: "18px",
    padding: "18px",
    color: "#9a3412",
  },
};

export default ParentDashboard;