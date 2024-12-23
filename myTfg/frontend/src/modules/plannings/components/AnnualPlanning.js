import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../actions";
import * as selectors from "../selectors";
import "../../../styles/AnnualPlanning.css";

const AnnualPlanning = () => {
    const dispatch = useDispatch();
    const annualPlanning = useSelector(selectors.getAnnualPlanning);

    const [isGenerated, setIsGenerated] = useState(false);

    const handleGeneratePlanning = () => {
        dispatch(actions.getAnnualPlanning());
        setIsGenerated(true);
    };

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const colorMap = {
        PARED: "#4CAF50",
        AMARILLO: "#FFEB3B",
        COLON: "#2196F3",
        ROJOS: "#F44336",
        URGENCIAS: "#9C27B0",
        PROCTO: "#795548",
        MAMA: "#F48FB1",
        NUTRI: "#D3D3D3",
        RAYOS: "#607D8B",
        REA: "#3F51B5",
        TORACICA: "#8BC34A",
        VASCULAR: "#00BCD4",
        VALENCIA: "#FFC107",
        OTRAS: "#F5F5F5"
    };

    const emptyPlanning = Array.from({ length: 15 }, (_, index) => ({
        name: `Persona ${index + 1}`,
        assignations: Array(12).fill(null)
    }));

    return (
        <div>
            <h2>Planificación Anual</h2>
            <button
                onClick={handleGeneratePlanning}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginBottom: "20px"
                }}
            >
                Generar Planificación
            </button>
            <div className="annual-planning-table">
                <table>
                    <thead>
                        <tr>
                            <th>Personas</th>
                            {months.map((month) => (
                                <th key={month}>{month}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(isGenerated && annualPlanning ? annualPlanning : emptyPlanning).map((person) => (
                            <tr key={person.name}
                                style={{
                                    backgroundColor: "#E0E0E0",
                                    color: "#000"
                                }}
                            >
                                <td>{person.name}</td>
                                {months.map((_, index) => {
                                    const activity = person.assignations[index+1];
                                    return (
                                        <td
                                            key={`${person.name}-${index}`}
                                            style={{
                                                backgroundColor: colorMap[activity] || "#E0E0E0",
                                                color: "#000",
                                                textAlign: "center",
                                                fontWeight: "bold",
                                                cursor: activity ? "pointer" : "default"
                                            }}
                                            title={activity || "Sin asignación"}
                                            onClick={() =>
                                                activity && alert(`Persona: ${person.name}\nMes: ${months[index]}\nActividad: ${activity}`)
                                            }
                                        >
                                            {activity || "-"}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnnualPlanning;
