import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../actions";
import * as selectors from "../selectors";
import "../../../styles/AnnualPlanning.css";

const AnnualPlanning = () => {
    const dispatch = useDispatch();
    const annualPlanning = useSelector(selectors.getAnnualPlanning);

    const emptyPlanning = Array.from({ length: 15 }, (_, index) => ({
        name: `Persona ${index + 1}`,
        assignations: Array(12).fill(null)
    }));

    const [planningData, setPlanningData] = useState(emptyPlanning);
    const [isExpanded, setIsExpanded] = useState(false); // Estado para controlar el desplegable

    const handleGeneratePlanning = () => {
        dispatch(actions.getAnnualPlanning());
    };

    const toggleSection = () => {
        setIsExpanded(!isExpanded);
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

    const activities = Object.keys(colorMap);

    const handleSelectChange = (personName, month, value) => {
        const dataToUpdate = planningData && planningData.length > 0 ? planningData : emptyPlanning;
        const updatedPlanning = dataToUpdate.map((person) => {
            if (person.name === personName) {
                return {
                    ...person,
                    assignations: person.assignations.map((activity, index) =>
                        months[index] === month ? value : activity
                    )
                };
            }
            return person;
        });
        setPlanningData(updatedPlanning);
    };

    return (
        <div>
            <h2
                onClick={toggleSection}
                style={{
                    cursor: "pointer",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    textAlign: "center",
                    backgroundColor: "#f9f9f9"
                }}
            >
                Planificación Anual {isExpanded ? "▲" : "▼"}
            </h2>
            {isExpanded && (
                <div>
                    <button
                        onClick={handleGeneratePlanning}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007BFF",
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
                                {(annualPlanning ? annualPlanning : planningData).map((person) => (
                                    <tr
                                        key={person.name}
                                        style={{
                                            backgroundColor: "#E0E0E0",
                                            color: "#000"
                                        }}
                                    >
                                        <td>{person.name}</td>
                                        {months.map((month, index) => {
                                            const activity = person.assignations[index];
                                            return (
                                                <td
                                                    key={`${person.name}-${month}`}
                                                    style={{
                                                        backgroundColor: colorMap[activity] || "#E0E0E0",
                                                        color: "#000",
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                        cursor: activity ? "pointer" : "default"
                                                    }}
                                                    title={activity || "Sin asignación"}
                                                >
                                                    <select
                                                        value={activity || ""}
                                                        onChange={(e) =>
                                                            handleSelectChange(person.name, month, e.target.value)
                                                        }
                                                        style={{
                                                            backgroundColor: "transparent",
                                                            border: "none",
                                                            color: "#000",
                                                            cursor: "pointer",
                                                            width: "100%",
                                                            textAlign: "center",
                                                            fontWeight: "bold",
                                                            appearance: "none"
                                                        }}
                                                    >
                                                        <option value="" disabled>
                                                            Seleccionar
                                                        </option>
                                                        {activities.map((act) => (
                                                            <option
                                                                key={act}
                                                                value={act}
                                                                style={{
                                                                    backgroundColor: colorMap[act],
                                                                    color: "#000"
                                                                }}
                                                            >
                                                                {act}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnualPlanning;
