function StatsGrid({
  level,
  xp,
  completedCount,
  totalChallenges,
  weeklyAttendanceCount,
}) {
  return (
    <section style={styles.statsGrid}>
      <div style={styles.statCard}>
        <p style={styles.statLabel}>Level</p>
        <h2 style={styles.statValue}>{level || 1}</h2>
      </div>

      <div style={styles.statCard}>
        <p style={styles.statLabel}>XP</p>
        <h2 style={styles.statValue}>{xp || 0}</h2>
      </div>

      <div style={styles.statCard}>
        <p style={styles.statLabel}>Challenges Done</p>
        <h2 style={styles.statValue}>
          {completedCount}/{totalChallenges}
        </h2>
      </div>

      <div style={styles.statCard}>
        <p style={styles.statLabel}>Attendance</p>
        <h2 style={styles.statValue}>{weeklyAttendanceCount}</h2>
      </div>
    </section>
  );
}

const styles = {
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  statLabel: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
  },
  statValue: {
    margin: "8px 0 0",
    fontSize: "28px",
  },
};

export default StatsGrid;