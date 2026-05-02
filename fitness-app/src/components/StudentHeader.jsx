function StudentHeader({ student }) {
  return (
    <header style={styles.header}>
      <div>
        <p style={styles.kicker}>Student Home</p>
        <h1 style={styles.title}>Hi, {student.name}</h1>
        <p style={styles.subtitle}>
          Let’s build strength and confidence this week.
        </p>
      </div>

      <div style={styles.avatarCard}>
        <div style={styles.avatarCircle}>
          <span style={styles.avatarEmoji}>🦁</span>
        </div>
        <p style={styles.avatarName}>
          {student.avatar?.character || "Starter Hero"}
        </p>
        <p style={styles.avatarCosmetic}>
          Cosmetics: {student.avatar?.cosmetics?.join(", ") || "None yet"}
        </p>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: "20px",
    flexWrap: "wrap",
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
  avatarCard: {
    minWidth: "220px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  avatarCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#e5eefc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
  },
  avatarEmoji: {
    fontSize: "36px",
  },
  avatarName: {
    margin: "0 0 6px",
    fontWeight: 700,
  },
  avatarCosmetic: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
  },
};

export default StudentHeader;