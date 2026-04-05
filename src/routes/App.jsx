import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home.jsx";
import TreeDetail from "../pages/TreeDetail.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/:id" element={<TreeDetail />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
