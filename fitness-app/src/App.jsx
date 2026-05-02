import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import ChildHome from "./pages/childHome";
import ParentDashboard from "./pages/parentDashboard";
import FranchiseDashboard from "./pages/franchiseDashboard";

function App() {
  return (
    <BrowserRouter>
      <div style={styles.nav}>
        <Link style={styles.link} to="/child">Child Mode</Link>
        <Link style={styles.link} to="/parent">Parent Mode</Link>
        <Link style={styles.link} to="/franchise">Franchise Mode</Link>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/child" replace />} />
        <Route path="/child" element={<ChildHome />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/franchise" element={<FranchiseDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  nav: {
    display: "flex",
    gap: "12px",
    padding: "16px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
  },
  link: {
    textDecoration: "none",
    fontWeight: 700,
    color: "#2563eb",
  },
container: {
  maxWidth: "100%",
  padding: "0 12px"
}
};

export default App;