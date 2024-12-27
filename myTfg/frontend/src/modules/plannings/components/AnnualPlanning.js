import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as actions from "../actions";
import * as selectors from "../selectors";
import "../../../styles/AnnualPlanning.css";

const AnnualPlanning = () => {
    const dispatch = useDispatch();
    const annualPlanning = useSelector(selectors.getAnnualPlanning);

    const emptyPlanning = Array.from({ length: 15 }, (_, index) => ({
        name: `Persona ${String(index + 1).padStart(2, '0')}`,
        assignations: Array(12).fill(null)
    }));

    const [planningData, setPlanningData] = useState(emptyPlanning);
    const [isExpanded, setIsExpanded] = useState(false);
    const [backendErrors, setBackendErrors] = useState(null);

    const handleGeneratePlanning = () => {
        dispatch(actions.getAnnualPlanning(
            planningData,
            () => setBackendErrors('Sin solucion')));
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
                        months[index] === month ? (value === "-" ? null : value) : activity
                    )
                };
            }
            return person;
        });
        setPlanningData(updatedPlanning);
    };

    const exportToPDF = () => {
        const doc = new jsPDF({ orientation: "landscape" });
        doc.text("Planificación Anual", 10, 10);

        const tableData = (annualPlanning ? annualPlanning : planningData).map((person) => {
            const assignations = person.assignations || {};
            const assignationsList = months.map((_, index) => {
                const value = assignations[index.toString()];
                return value || "Sin asignación";
            });

            return [
                person.name,
                ...assignationsList
            ];
        });

        // Generar la tabla con colores y texto visible
        doc.autoTable({
            head: [["Personas", ...months]],
            body: tableData,
            styles: { fontSize: 8, cellPadding: 1 },
            startY: 20,
            didDrawCell: (data) => {
                if (data.section === 'body' && data.column.index > 0) {
                    const activity = data.cell.raw;
                    const bgColor = colorMap[activity] || "#FFFFFF";
                    const [r, g, b] = hexToRgb(bgColor);

                    // Establecer el color de fondo
                    doc.setFillColor(r, g, b);
                    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');

                    // Establecer el color del texto según la luminosidad
                    const textColor = getContrastYIQ(r, g, b) > 128 ? "#000000" : "#FFFFFF";
                    doc.setTextColor(textColor);
                    doc.text(
                        activity || "Sin asignación",
                        data.cell.x + data.cell.width / 2,
                        data.cell.y + data.cell.height / 2,
                        { align: "center", baseline: "middle" }
                    );
                }
            },
            headStyles: {
                halign: 'center',  // Centra el texto del encabezado (meses)
            },
        });

        doc.save("planificacion_anual.pdf");
    };


    // Función para convertir colores HEX a RGB
    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.replace("#", ""), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };

    // Función para calcular el contraste YIQ
    const getContrastYIQ = (r, g, b) => {
        return (r * 299 + g * 587 + b * 114) / 1000;
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
                    <button
                        onClick={exportToPDF}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginBottom: "20px",
                            marginLeft: "10px"
                        }}
                    >
                        Exportar a PDF
                    </button>
                    {backendErrors ? <p style={{ color: 'red', textAlign: 'center', marginTop: '30px',
                        marginBottom: '20px' }}>{backendErrors}</p> : null}
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
                                                        <option value="-">-</option>
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
