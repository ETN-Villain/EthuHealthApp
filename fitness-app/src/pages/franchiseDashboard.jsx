import React, { useMemo } from "react";

import organisationsData from "../data/organisations.json";
import schoolsData from "../data/schools.json";
import clubsData from "../data/clubs.json";
import studentsData from "../data/students.json";
import challengesData from "../data/challenges.json";
import completionsData from "../data/completions.json";
import attendanceData from "../data/attendance.json";
import parentSummariesData from "../data/parentSummaries.json";
import coachesData from "../data/coaches.json";

function FranchiseDashboard() {
  const organisations = Array.isArray(organisationsData) ? organisationsData : [];
  const schools = Array.isArray(schoolsData) ? schoolsData : [];
  const clubs = Array.isArray(clubsData) ? clubsData : [];
  const students = Array.isArray(studentsData) ? studentsData : [];
  const challenges = Array.isArray(challengesData) ? challengesData : [];
  const completions = Array.isArray(completionsData) ? completionsData : [];
  const attendance = Array.isArray(attendanceData) ? attendanceData : [];
  const parentSummaries = Array.isArray(parentSummariesData)
    ? parentSummariesData
    : [];
  const coaches = Array.isArray(coachesData) ? coachesData : [];

  const metrics = useMemo(() => {
    const possibleCompletions = students.reduce((total, student) => {
      const assigned = challenges.filter(
        (challenge) =>
          Array.isArray(challenge.assignedTo) &&
          challenge.assignedTo.includes(student.id)
      );

      return total + assigned.length;
    }, 0);

    const completionRate =
      possibleCompletions === 0
        ? 0
        : Math.round((completions.length / possibleCompletions) * 100);

    const totalHealthyChoices = parentSummaries.reduce(
      (total, summary) => total + Number(summary.healthyChoiceCount || 0),
      0
    );

    const averageXp =
      students.length === 0
        ? 0
        : Math.round(
            students.reduce(
              (total, student) => total + Number(student.xp || 0),
              0
            ) / students.length
          );

    return {
      totalOrganisations: organisations.length,
      totalSchools: schools.length,
      totalClubs: clubs.length,
      totalStudents: students.length,
      completionRate,
      totalCompletions: completions.length,
      totalAttendance: attendance.filter((entry) => entry.present).length,
      totalHealthyChoices,
      averageXp,
    };
  }, [
    organisations,
    schools,
    clubs,
    students,
    challenges,
    completions,
    attendance,
    parentSummaries,
  ]);

  const organisationRows = organisations.map((organisation) => {
    const orgSchools = schools.filter(
      (school) => school.organisationId === organisation.id
    );

    const orgSchoolIds = orgSchools.map((school) => school.id);

    const orgClubs = clubs.filter((club) =>
      orgSchoolIds.includes(club.schoolId)
    );

    const orgClubIds = orgClubs.map((club) => club.id);

    const orgStudents = students.filter((student) =>
      orgClubIds.includes(student.clubId)
    );

    const orgStudentIds = orgStudents.map((student) => student.id);

    const orgCompletions = completions.filter((completion) =>
      orgStudentIds.includes(completion.studentId)
    );

    const orgAttendance = attendance.filter(
      (entry) => orgStudentIds.includes(entry.studentId) && entry.present
    );

    const orgHealthyChoices = parentSummaries
      .filter((summary) => orgStudentIds.includes(summary.studentId))
      .reduce(
        (total, summary) => total + Number(summary.healthyChoiceCount || 0),
        0
      );

    return {
      ...organisation,
      schoolCount: orgSchools.length,
      clubCount: orgClubs.length,
      studentCount: orgStudents.length,
      completionCount: orgCompletions.length,
      attendanceCount: orgAttendance.length,
      healthyChoiceCount: orgHealthyChoices,
    };
  });

const clubRows = clubs.map((club) => {
  const school = schools.find((item) => item.id === club.schoolId);

  const organisation = organisations.find(
    (item) => item.id === school?.organisationId
  );

  const coach = coaches.find((item) => item.id === club.coachId);

  const clubStudents = students.filter(
    (student) => student.clubId === club.id
  );

    const clubStudentIds = clubStudents.map((student) => student.id);

    const clubCompletions = completions.filter((completion) =>
      clubStudentIds.includes(completion.studentId)
    );

    const clubAttendance = attendance.filter(
      (entry) => clubStudentIds.includes(entry.studentId) && entry.present
    );

    const possibleCompletions = clubStudents.reduce((total, student) => {
      const assigned = challenges.filter(
        (challenge) =>
          Array.isArray(challenge.assignedTo) &&
          challenge.assignedTo.includes(student.id)
      );

      return total + assigned.length;
    }, 0);

    const completionRate =
      possibleCompletions === 0
        ? 0
        : Math.round((clubCompletions.length / possibleCompletions) * 100);

  return {
    ...club,
    schoolName: school?.name || "Unknown school",
    organisationName: organisation?.name || "Unknown organisation",
    coachName: coach?.name || "Unassigned",
    studentCount: clubStudents.length,
    completionCount: clubCompletions.length,
    attendanceCount: clubAttendance.length,
    completionRate,
  };
});

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <p style={styles.kicker}>Franchise Mode</p>
          <h1 style={styles.title}>Franchise Overview</h1>
          <p style={styles.subtitle}>
            Monitor organisations, schools, clubs, engagement, attendance, and
            student habit-building across the platform.
          </p>
        </header>

        <section style={styles.metricsGrid}>
          <MetricCard label="Organisations" value={metrics.totalOrganisations} />
          <MetricCard label="Schools" value={metrics.totalSchools} />
          <MetricCard label="Clubs" value={metrics.totalClubs} />
          <MetricCard label="Students" value={metrics.totalStudents} />
          <MetricCard label="Completion Rate" value={`${metrics.completionRate}%`} />
          <MetricCard label="Average XP" value={metrics.averageXp} />
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Platform Engagement</h2>

          <div style={styles.panel}>
            <div style={styles.progressHeader}>
              <span>Overall assigned challenge completion</span>
              <strong>{metrics.completionRate}%</strong>
            </div>

            <div style={styles.progressOuter}>
              <div
                style={{
                  ...styles.progressInner,
                  width: `${metrics.completionRate}%`,
                }}
              />
            </div>

            <p style={styles.panelNote}>
              Based on completed challenges compared with all assigned
              challenges across all students.
            </p>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Organisation Performance</h2>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Organisation</th>
                  <th style={styles.th}>Region</th>
                  <th style={styles.th}>Schools</th>
                  <th style={styles.th}>Clubs</th>
                  <th style={styles.th}>Students</th>
                  <th style={styles.th}>Completions</th>
                  <th style={styles.th}>Attendance</th>
                  <th style={styles.th}>Healthy Choices</th>
                </tr>
              </thead>

              <tbody>
                {organisationRows.map((org) => (
                  <tr key={org.id}>
                    <td style={styles.td}>
                      <strong>{org.name}</strong>
                      <p style={styles.muted}>{org.type}</p>
                    </td>
                    <td style={styles.td}>{org.region}</td>
                    <td style={styles.td}>{org.schoolCount}</td>
                    <td style={styles.td}>{org.clubCount}</td>
                    <td style={styles.td}>{org.studentCount}</td>
                    <td style={styles.td}>{org.completionCount}</td>
                    <td style={styles.td}>{org.attendanceCount}</td>
                    <td style={styles.td}>{org.healthyChoiceCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Club Activity</h2>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Club</th>
                  <th style={styles.th}>School</th>
                  <th style={styles.th}>Organisation</th>
                  <th style={styles.th}>Coach</th>
                  <th style={styles.th}>Age Group</th>
                  <th style={styles.th}>Students</th>
                  <th style={styles.th}>Completion</th>
                  <th style={styles.th}>Attendance</th>
                </tr>
              </thead>

              <tbody>
                {clubRows.map((club) => (
                  <tr key={club.id}>
                    <td style={styles.td}>
                      <strong>{club.name}</strong>
                    </td>
                    <td style={styles.td}>{club.schoolName}</td>
                    <td style={styles.td}>{club.organisationName}</td>
                    <td style={styles.td}>{club.coachName}</td>
                    <td style={styles.td}>{club.ageGroup}</td>
                    <td style={styles.td}>{club.studentCount}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          ...(club.completionRate >= 70
                            ? styles.badgeGood
                            : styles.badgeWarning),
                        }}
                      >
                        {club.completionRate}%
                      </span>
                    </td>
                    <td style={styles.td}>{club.attendanceCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={styles.twoColumn}>
          <div style={styles.panel}>
            <h2 style={styles.sectionTitle}>Franchise Readiness</h2>
            <ul style={styles.list}>
              <li>Organisations can contain many schools</li>
              <li>Schools can contain many clubs</li>
              <li>Clubs can contain many children</li>
              <li>Dashboards can roll up performance by level</li>
            </ul>
          </div>

          <div style={styles.panel}>
            <h2 style={styles.sectionTitle}>Next Admin Features</h2>
            <ul style={styles.list}>
              <li>Create organisation</li>
              <li>Add school</li>
              <li>Add club and coach</li>
              <li>Assign students to clubs</li>
              <li>Export school report</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div style={styles.metricCard}>
      <p style={styles.metricLabel}>{label}</p>
      <h2 style={styles.metricValue}>{value}</h2>
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
    maxWidth: "1200px",
    margin: "0 auto",
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
    maxWidth: "760px",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  metricCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  metricLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },
  metricValue: {
    margin: "8px 0 0",
    fontSize: "32px",
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
    marginBottom: "10px",
    color: "#4b5563",
    gap: "12px",
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
  panelNote: {
    margin: "12px 0 0",
    color: "#6b7280",
  },
  tableWrapper: {
    background: "#ffffff",
    borderRadius: "18px",
    overflowX: "auto",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },
  th: {
    textAlign: "left",
    padding: "14px 16px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#6b7280",
  },
  td: {
    padding: "14px 16px",
    borderBottom: "1px solid #f3f4f6",
    verticalAlign: "top",
  },
  muted: {
    margin: "4px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },
  badge: {
    display: "inline-block",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "13px",
    fontWeight: 700,
  },
  badgeGood: {
    background: "#dcfce7",
    color: "#166534",
  },
  badgeWarning: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
    color: "#4b5563",
    lineHeight: 1.8,
  },
};

export default FranchiseDashboard;