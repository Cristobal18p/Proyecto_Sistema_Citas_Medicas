import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { RecepcionDashboard } from "./components/RecepcionDashboard";
import { MedicoDashboard } from "./components/MedicoDashboard";
import { GerenteDashboard } from "./components/GerenteDashboard";
import { AdministradorDashboard } from "./components/AdministradorDashboard";
import { PortalPaciente } from "./components/PortalPaciente";
import { Toaster } from "sonner";
import { Usuario } from "./types/login";
import { Button } from "./components/ui/button";

type View = "login" | "portal" | "dashboard";

export default function App() {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [currentView, setCurrentView] = useState<View>("login");

  const handleLogin = (user: Usuario) => {
    setCurrentUser(user);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("login");
  };

  const handlePortalPaciente = () => {
    setCurrentView("portal");
  };

  const handleAccessClinica = () => {
    setCurrentView("login");
  };

  if (currentView === "portal") {
    return (
      <>
        <Toaster position="top-right" richColors />
        <PortalPaciente onAccessClinica={handleAccessClinica} />
      </>
    );
  }

  if (!currentUser && currentView === "login") {
    return (
      <>
        <Toaster position="top-right" richColors />
        <LoginPage
          onLogin={handleLogin}
          onPortalPaciente={handlePortalPaciente}
        />
      </>
    );
  }

  if (currentView === "dashboard" && currentUser) {
    switch (currentUser.rol.toLowerCase()) {
      case "recepcionista":
        return (
          <RecepcionDashboard user={currentUser} onLogout={handleLogout} />
        );
      case "medico":
        return <MedicoDashboard user={currentUser} onLogout={handleLogout} />;
      case "gerente":
        return <GerenteDashboard user={currentUser} onLogout={handleLogout} />;
      case "admin":
        return (
          <AdministradorDashboard user={currentUser} onLogout={handleLogout} />
        );
      default:
        return (
          <div className="p-8 text-center">
            <p className="text-red-600 font-semibold">
              Rol no autorizado: {currentUser.rol}
            </p>
            <Button onClick={handleLogout} className="mt-4">
              Cerrar sesión
            </Button>
          </div>
        );
    }
  }
}
