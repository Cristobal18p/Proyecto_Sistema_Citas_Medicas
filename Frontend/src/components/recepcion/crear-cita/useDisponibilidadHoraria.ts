import { useState, useEffect } from "react";
import { DisponibilidadMedico } from "../../../types/medico";
import { CitaDetalle } from "../../../types/cita";

interface UseDisponibilidadHorariaProps {
    fechaSeleccionada: Date | undefined;
    medicoId: string;
    disponibilidad: DisponibilidadMedico[];
    citasExistentes: CitaDetalle[];
}

export function useDisponibilidadHoraria({
    fechaSeleccionada,
    medicoId,
    disponibilidad,
    citasExistentes,
}: UseDisponibilidadHorariaProps) {
    const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);

    const getDiaSemana = (fecha: Date): DisponibilidadMedico["dia_semana"] => {
        const dias: DisponibilidadMedico["dia_semana"][] = [
            "Domingo",
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
        ];
        return dias[fecha.getDay()];
    };

    const generarFranjasHorarias = (
        horaInicio: string,
        horaFin: string
    ): string[] => {
        const franjas: string[] = [];
        const [horaInicioH, horaInicioM] = horaInicio.split(":").map(Number);
        const [horaFinH, horaFinM] = horaFin.split(":").map(Number);

        let horaActual = horaInicioH * 60 + horaInicioM;
        const horaLimite = horaFinH * 60 + horaFinM;

        while (horaActual < horaLimite) {
            const h = Math.floor(horaActual / 60);
            const m = horaActual % 60;
            franjas.push(
                `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
            );
            horaActual += 60;
        }

        return franjas;
    };

    const horaOcupada = (fecha: Date, hora: string): boolean => {
        const fechaStr = fecha.toISOString().split("T")[0];
        return citasExistentes.some(
            (c) =>
                c.id_medico === medicoId &&
                c.fecha_cita === fechaStr &&
                c.hora_cita === hora &&
                c.estado_cita !== "cancelada"
        );
    };

    useEffect(() => {
        if (fechaSeleccionada && medicoId) {
            const diaSemana = getDiaSemana(fechaSeleccionada);

            const disponibilidadDia = disponibilidad.filter(
                (d) => d.dia_semana === diaSemana
            );


            if (disponibilidadDia.length === 0) {
                setHorasDisponibles([]);
                return;
            }

            let todasLasFranjas: string[] = [];
            disponibilidadDia.forEach((disp) => {
                const franjas = generarFranjasHorarias(disp.hora_inicio, disp.hora_fin);
                todasLasFranjas = [...todasLasFranjas, ...franjas];
            });

            const franjasLibres = todasLasFranjas.filter(
                (hora) => !horaOcupada(fechaSeleccionada, hora)
            );

            setHorasDisponibles(franjasLibres);
        } else {
            setHorasDisponibles([]);
        }
    }, [fechaSeleccionada, medicoId, citasExistentes, disponibilidad]);

    return horasDisponibles;
}
