import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<HomePage />} path="/" />
        </Route>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
      </Routes>
    </BrowserRouter>
  );
}
