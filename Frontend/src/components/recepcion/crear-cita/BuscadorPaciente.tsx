import { useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Paciente } from "../../../types/paciente";

interface BuscadorPacienteProps {
  pacientes: Paciente[];
  onSelectPaciente: (paciente: Paciente) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function BuscadorPaciente({
  pacientes,
  onSelectPaciente,
  searchValue,
  onSearchChange,
}: BuscadorPacienteProps) {
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);

  const handleSearch = (value: string) => {
    onSearchChange(value);
    if (value.length > 1) {
      const results = pacientes.filter((p) =>
        `${p.nombre} ${p.apellido} ${p.cedula}`
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setFilteredPacientes(results);
    } else {
      setFilteredPacientes([]);
    }
  };

  const handleSelect = (paciente: Paciente) => {
    onSelectPaciente(paciente);
    setFilteredPacientes([]);
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="paciente">Paciente *</Label>
      <Input
        id="paciente"
        type="text"
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar paciente por nombre o cédula"
        required
      />
      {filteredPacientes.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded shadow mt-1 max-h-40 overflow-y-auto w-full">
          {filteredPacientes.map((p) => (
            <li
              key={p.id_paciente}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(p)}
            >
              {p.nombre} {p.apellido} - {p.cedula}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
