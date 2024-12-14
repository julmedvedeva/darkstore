import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "@/layouts/dashboard";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/dashboard/orders" replace />} />
    </Routes>
  );
}

export default App;
