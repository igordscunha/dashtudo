import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { LoginForm } from "../components/form/LoginForm";
import { Home } from "../pages/home"
import { RegisterPage } from "../pages/register";
import { DashboardPage } from "../pages/dashboard";
import { ProfilePage } from "../pages/perfil";

function AppRoutes() {
  return(
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/criarconta" element={<RegisterPage/>}/>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default AppRoutes;