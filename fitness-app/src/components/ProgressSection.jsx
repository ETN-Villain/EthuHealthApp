function ProgressSection({ xp }) {
  const progress = xp % 100;

  return (
    <section style={styles.progressSection}>
      <div style={styles.progressHeader}>
        <span style={styles.progressText}>Progress to next level</span>
        <span style={styles.progressText}>{progress}/100 XP</span>
      </div>

      <div style={styles.progressBarOuter}>
        <div
          style={{
            ...styles.progressBarInner,
            width: `${progress}%`,
          }}
        />
      </div>
    </section>
  );
}

const styles = {
  progressSection: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    marginBottom: "24px",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },
  progressText: {
    fontSize: "14px",
    color: "#4b5563",
  },
  progressBarOuter: {
    width: "100%",
    height: "14px",
    borderRadius: "999px",
    background: "#e5e7eb",
    overflow: "hidden",
  },
  progressBarInner: {
    height: "100%",
    borderRadius: "999px",
    background: "#2563eb",
    transition: "width 0.25s ease",
  },
};

export default ProgressSection;