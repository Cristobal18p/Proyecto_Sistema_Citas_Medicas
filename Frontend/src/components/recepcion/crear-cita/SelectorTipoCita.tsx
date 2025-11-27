import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface SelectorTipoCitaProps {
  value: "nueva" | "control";
  onChange: (value: "nueva" | "control") => void;
}

export function SelectorTipoCita({ value, onChange }: SelectorTipoCitaProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="tipo">Tipo de Cita</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="tipo">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nueva">Nueva</SelectItem>
          <SelectItem value="control">Control</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
