function ParentSummaryPreview({ studentParentSummary, completedCount }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>Parent Summary Preview</h2>

      <div style={styles.summaryCard}>
        <p>
          Weekly challenges completed:{" "}
          <strong>
            {studentParentSummary?.weeklyChallengesCompleted ?? completedCount}
          </strong>
        </p>
        <p>
          Healthy choices:{" "}
          <strong>{studentParentSummary?.healthyChoiceCount ?? 0}</strong>
        </p>
        <p>
          Strength milestone:{" "}
          <strong>
            {studentParentSummary?.strengthMilestone ?? "Keep going!"}
          </strong>
        </p>
      </div>
    </section>
  );
}

const styles = {
  section: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "24px",
    marginBottom: "14px",
  },
  summaryCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    lineHeight: 1.8,
  },
};

export default ParentSummaryPreview;