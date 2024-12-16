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
        green: "#4CAF50",
        yellow: "#FFEB3B",
        blue: "#2196F3",
        red: "#F44336",
        purple: "#9C27B0",
        brown: "#795548",
        pink: "#E91E63",
        nutrition: "#FFC107",
        xray: "#607D8B",
        rea: "#3F51B5",
        thoracic: "#8BC34A",
        vascular: "#00BCD4",
        valencia: "#FF5722"
    };

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
            {!isGenerated && <p>Haz clic en el botón para generar la planificación.</p>}
            {isGenerated && annualPlanning && (
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
                            {annualPlanning.map((person) => (
                                <tr key={person.name}
                                    style={{
                                        backgroundColor: "#E0E0E0",
                                        color: "#000"
                                    }}
                                >
                                    <td>{person.name}</td>
                                    {months.map((_, index) => {
                                        const activity = person.assignations[index + 1];
                                        return (
                                            <td
                                                key={`${person.name}-${index}`}
                                                style={{
                                                    backgroundColor: colorMap[activity] || "#E0E0E0",
                                                    color: "#000",
                                                    textAlign: "center",
                                                    fontWeight: "bold",
                                                    cursor: "pointer"
                                                }}
                                                title={activity || "Sin asignación"}
                                                onClick={() =>
                                                    alert(`Persona: ${person.name}\nMes: ${months[index]}\nActividad: ${activity || "Sin asignar"}`)
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
            )}
        </div>
    );
};

export default AnnualPlanning;
