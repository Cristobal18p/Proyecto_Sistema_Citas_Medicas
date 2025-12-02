import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { RecepcionDashboard } from "./components/RecepcionDashboard";
import { MedicoDashboard } from "./components/MedicoDashboard";
import { GerenteDashboard } from "./components/GerenteDashboard";
import { AdministradorDashboard } from "./components/AdministradorDashboard";
import { PortalPaciente } from "./components/PortalPaciente";
import { Toaster } from "sonner";
import { Login } from "./types/login";
import { Button } from "./components/ui/button";

type View = "login" | "portal" | "dashboard";

const SESSION_STORAGE_KEY = "clinic_session";
const VIEW_STORAGE_KEY = "clinic_view";

export default function App() {
  const [currentUser, setCurrentUser] = useState<Login | null>(null);
  const [currentView, setCurrentView] = useState<View>("login");
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión desde localStorage al iniciar
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      const savedView = localStorage.getItem(VIEW_STORAGE_KEY);

      if (savedSession) {
        const user = JSON.parse(savedSession) as Login;
        setCurrentUser(user);
      }

      if (
        savedView &&
        (savedView === "login" ||
          savedView === "portal" ||
          savedView === "dashboard")
      ) {
        setCurrentView(savedView as View);
      }
    } catch (error) {
      console.error("Error al cargar sesión:", error);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(VIEW_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (user: Login) => {
    setCurrentUser(user);
    setCurrentView("dashboard");
    // Guardar en localStorage
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(VIEW_STORAGE_KEY, "dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("login");
    // Limpiar localStorage
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(VIEW_STORAGE_KEY);
  };

  const handlePortalPaciente = () => {
    setCurrentView("portal");
    localStorage.setItem(VIEW_STORAGE_KEY, "portal");
  };

  const handleAccessClinica = () => {
    setCurrentView("login");
    localStorage.setItem(VIEW_STORAGE_KEY, "login");
  };

  // Mostrar loader mientras carga la sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

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
          <>
            <Toaster position="top-right" richColors />
            <RecepcionDashboard user={currentUser} onLogout={handleLogout} />
          </>
        );
      case "medico":
        return (
          <>
            <Toaster position="top-right" richColors />
            <MedicoDashboard user={currentUser} onLogout={handleLogout} />
          </>
        );
      case "gerente":
        return (
          <>
            <Toaster position="top-right" richColors />
            <GerenteDashboard user={currentUser} onLogout={handleLogout} />
          </>
        );
      case "admin":
        return (
          <>
            <Toaster position="top-right" richColors />
            <AdministradorDashboard
              user={currentUser}
              onLogout={handleLogout}
            />
          </>
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
