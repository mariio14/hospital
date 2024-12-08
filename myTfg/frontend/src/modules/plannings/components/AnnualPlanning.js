import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../actions";
import * as selectors from "../selectors";
import "../../../styles/AnnualPlanning.css"; // Archivo CSS para estilos

const AnnualPlanning = () => {
    const dispatch = useDispatch();
    const annualPlanning = useSelector(selectors.getAnnualPlanning);

    useEffect(() => {
        dispatch(actions.getAnnualPlanning());
    }, [dispatch]);

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
        </div>
    );
};

export default AnnualPlanning;
