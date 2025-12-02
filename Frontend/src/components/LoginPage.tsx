import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Login } from "../types/login";
import { loginUsuario } from "../services/usuario";

import { AlertCircle, Users } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface LoginPageProps {
  onLogin: (user: Login) => void;
  onPortalPaciente?: () => void;
}
export function LoginPage({ onLogin, onPortalPaciente }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Debe ingresar usuario y contraseña");
      return;
    }

    try {
      const user = await loginUsuario(username, password);

      if (user.estado !== "activo") {
        setError("Usuario inactivo o bloqueado");
        return;
      }

      setUsername("");
      setPassword("");
      onLogin(user);
    } catch (err: any) {
      const message =
        err?.message || "Ocurrió un error al intentar iniciar sesión";
      setError(message);
    }
  };

  return (
    <div
      className="min-h-screen p-4 relative"
      style={{
        backgroundImage: "url(/fondo_clinica.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

      {onPortalPaciente && (
        <div className="relative z-10 mb-4 flex justify-end px-4">
          <Button
            variant="outline"
            onClick={onPortalPaciente}
            className="bg-white hover:bg-blue-50 text-blue-700 font-semibold shadow-md hover:shadow-lg transition-all border-2 border-blue-600"
          >
            <Users className="w-4 h-4 mr-2" />
            Portal de Pacientes
          </Button>
        </div>
      )}

      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] relative z-10">
        <Card className="w-full max-w-md mx-4 shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-4 pt-6">
            <div className="flex justify-center mb-2">
              <img
                src="/logo-clinica.svg"
                alt="Logo Clínica San Osorio"
                className="h-12 w-12"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-900">
              Clínica Santana
            </CardTitle>
            <CardDescription className="text-base text-gray-700">
              Sistema de Gestión de Citas Médicas
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold mt-6"
              >
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
