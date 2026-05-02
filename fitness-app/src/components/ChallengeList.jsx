function ChallengeList({
  studentChallenges,
  completedChallengeIds,
  onCompleteChallenge,
}) {
  function getCategoryEmoji(category) {
    const value = String(category || "").toLowerCase();

    if (value.includes("strength")) return "💪";
    if (value.includes("food")) return "🍎";
    if (value.includes("confidence")) return "🌟";
    if (value.includes("water")) return "💧";
    if (value.includes("movement")) return "🏃";

    return "🎯";
  }

  return (
    <div style={styles.challengeList}>
      {studentChallenges.map((challenge) => {
        const isDone = completedChallengeIds.has(challenge.id);
        const emoji = getCategoryEmoji(challenge.category);

        return (
          <div
            key={challenge.id}
            style={{
              ...styles.challengeCard,
              ...(isDone ? styles.challengeCardDone : {}),
            }}
          >
            <div style={styles.iconBubble}>{isDone ? "✅" : emoji}</div>

            <div style={styles.challengeText}>
              <p style={styles.challengeCategory}>
                {challenge.category || "Mission"}
              </p>

              <h3 style={styles.challengeTitle}>{challenge.title}</h3>

              <p style={styles.challengeDescription}>
                {challenge.description}
              </p>

              <p style={styles.challengeReward}>
                ⚡ Win {challenge.xpReward} power points
              </p>
            </div>

            <button
              type="button"
              onClick={() => onCompleteChallenge(challenge)}
              disabled={isDone}
              style={{
                ...styles.button,
                ...(isDone ? styles.buttonDone : styles.buttonActive),
              }}
            >
              {isDone ? "Great job!" : "I did it!"}
            </button>
          </div>
        );
      })}

      {studentChallenges.length === 0 && (
        <div style={styles.emptyCard}>
          <div style={styles.emptyEmoji}>🌈</div>
          <h3 style={styles.emptyTitle}>No missions yet</h3>
          <p style={styles.emptyText}>
            Your coach will add fun missions for you soon.
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  challengeList: {
    display: "grid",
    gap: "18px",
  },
  challengeCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "20px",
    border: "4px solid #c7d2fe",
    boxShadow: "0 8px 0 #a5b4fc",
    display: "grid",
    gridTemplateColumns: "1fr",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",    gap: "18px",
  },
  challengeCardDone: {
    background: "#f0fdf4",
    border: "4px solid #86efac",
    boxShadow: "0 8px 0 #4ade80",
  },
  iconBubble: {
    width: "76px",
    height: "76px",
    borderRadius: "999px",
    background: "#fef3c7",
    border: "4px solid #f59e0b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "38px",
  },
  challengeText: {
    minWidth: "220px",
  },
  challengeCategory: {
    margin: "0 0 6px",
    fontSize: "15px",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "#7c3aed",
  },
  challengeTitle: {
    margin: "0 0 8px",
    fontSize: "26px",
    lineHeight: 1.1,
    color: "#1e3a8a",
  },
  challengeDescription: {
    margin: "0 0 10px",
    color: "#475569",
    fontSize: "18px",
    lineHeight: 1.35,
    fontWeight: 700,
  },
  challengeReward: {
    margin: 0,
    fontWeight: 900,
    color: "#ea580c",
    fontSize: "17px",
  },
  button: {
    border: "none",
    borderRadius: "22px",
    padding: "18px 22px",
    fontSize: "19px",
    fontWeight: 900,
    cursor: "pointer",
    minWidth: "135px",
    whiteSpace: "nowrap",
  },
  buttonActive: {
    background: "#8b5cf6",
    color: "#ffffff",
    boxShadow: "0 7px 0 #6d28d9",
  },
  buttonDone: {
    background: "#22c55e",
    color: "#ffffff",
    boxShadow: "0 7px 0 #15803d",
    cursor: "not-allowed",
  },
  emptyCard: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "24px",
    border: "4px solid #fbcfe8",
    boxShadow: "0 8px 0 #f9a8d4",
    textAlign: "center",
  },
  emptyEmoji: {
    fontSize: "48px",
    marginBottom: "8px",
  },
  emptyTitle: {
    margin: "0 0 8px",
    color: "#1e3a8a",
    fontSize: "26px",
  },
  emptyText: {
    margin: 0,
    color: "#475569",
    fontSize: "18px",
    fontWeight: 700,
  },
};

export default ChallengeList;