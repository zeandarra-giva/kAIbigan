import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import { institution, mockSession } from "./mockData";
import Overview from "./pages/Overview";
import Engagement from "./pages/Engagement";
import Wellbeing from "./pages/Wellbeing";
import Triage from "./pages/Triage";
import Crisis from "./pages/Crisis";
import Resources from "./pages/Resources";
import Coaches from "./pages/Coaches";
import Settings from "./pages/Settings";
import CounselorCaseload from "./pages/CounselorCaseload";
import CounselorMessages from "./pages/CounselorMessages";
import CounselorSchedule from "./pages/CounselorSchedule";
import CounselorHandbook from "./pages/CounselorHandbook";
import CounselorSettings from "./pages/CounselorSettings";

const ADMIN_HOME = "/";
const COUNSELOR_HOME = "/";

function App() {
  const [filters, setFilters] = useState({ dateRange: "semester", cohort: "all" });
  const [toast, setToast] = useState("");
  const [role, setRole] = useState(mockSession.role);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function handleFilterChange(next) {
    setFilters((current) => ({ ...current, ...next }));
  }

  function handleExport() {
    setToast("PDF export generated");
  }

  function handleRoleSwitch(nextRole) {
    setRole(nextRole);
    setToast(nextRole === "admin" ? "Switched to Admin view" : "Switched to Counselor view");
  }

  const roleUser = useMemo(() => (
    role === "admin" ? "Ana Villanueva" : "Ms. Aileen Cruz, RGC"
  ), [role]);

  return (
    <BrowserRouter>
      <AppShell
        role={role}
        institution={institution}
        user={roleUser}
        dateRange={filters.dateRange}
        cohort={filters.cohort}
        onExport={handleExport}
        onFilterChange={handleFilterChange}
        onRoleSwitch={handleRoleSwitch}
        toast={toast}
      >
        <Routes>
          {role === "admin" ? (
            <>
              <Route path="/" element={<Overview dateRange={filters.dateRange} />} />
              <Route path="/engagement" element={<Engagement dateRange={filters.dateRange} cohort={filters.cohort} />} />
              <Route path="/wellbeing" element={<Wellbeing dateRange={filters.dateRange} cohort={filters.cohort} />} />
              <Route path="/triage" element={<Triage dateRange={filters.dateRange} />} />
              <Route path="/crisis" element={<Crisis />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/providers" element={<Coaches />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to={ADMIN_HOME} replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<CounselorCaseload />} />
              <Route path="/messages" element={<CounselorMessages />} />
              <Route path="/schedule" element={<CounselorSchedule />} />
              <Route path="/handbook" element={<CounselorHandbook />} />
              <Route path="/settings" element={<CounselorSettings />} />
              <Route path="*" element={<Navigate to={COUNSELOR_HOME} replace />} />
            </>
          )}
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
