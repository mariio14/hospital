import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as actions from "../actions";
import * as staffActions from "../../staff/actions"
import * as selectors from "../selectors";
import * as staffSelectors from "../../staff/selectors"
import "../../../styles/AnnualPlanning.css";

const AnnualPlanning = () => {
    const dispatch = useDispatch();
    const annualPlanning = useSelector(selectors.getAnnualPlanning);
    const staffList = useSelector(staffSelectors.getStaffList);

    const emptyPlanning = staffList.map(person => ({
        name: person.name,
        level: `R${person.level}`,
        assignations: Array(12).fill(null)
    }));

    const [planningData, setPlanningData] = useState(annualPlanning ? annualPlanning : emptyPlanning);
    const [isExpanded, setIsExpanded] = useState(false);
    const [backendErrors, setBackendErrors] = useState(null);
     const [isLoading, setIsLoading] = useState(false);
     const currentYear = new Date().getFullYear();
     const [year, setYear] = useState(currentYear);

    useEffect(() => {
        dispatch(staffActions.getStaff(
            () => setBackendErrors('No se ha podido obtener la lista de usuarios')
        ));
    }, []);

    useEffect(() => {
        // Si annualPlanning cambia, actualizamos planningData con el nuevo valor
        setPlanningData(annualPlanning ? annualPlanning : emptyPlanning);
        setIsLoading(false);
    }, [annualPlanning]);

    const handleGeneratePlanning = () => {
        setBackendErrors(null);
        setIsLoading(true);
        const convertedPlanningData = planningData.map(person => ({
            ...person,
            assignations: Object.values(person.assignations)
        }));

        dispatch(actions.getAnnualPlanning(
            convertedPlanningData,
            year,
            () => {
                setBackendErrors('Sin solución');
                setIsLoading(false);
            }
        ));
    };

    useEffect(() => {
        const convertedPlanningData = planningData.map(person => ({
                ...person,
                assignations: Object.values(person.assignations)
            }));
        dispatch(actions.getSavedAnnualPlanning(
            convertedPlanningData,
            year,
            () => setBackendErrors("No se ha podido cargar la planificación guardada."),
            emptyPlanning
        ));
    }, [year]);

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
        const updatedPlanning = planningData.map((person) => {
            if (person.name === personName) {
                return {
                    ...person,
                    assignations: Object.keys(person.assignations).reduce((acc, key) => {
                        // Si la clave corresponde al mes, actualizamos el valor
                        if (months[key] === month) {
                            acc[key] = value === "-" ? null : value;
                        } else {
                            acc[key] = person.assignations[key]; // Mantenemos el valor actual para otras claves
                        }
                        return acc;
                    }, {})
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

                    doc.setFillColor(r, g, b);
                    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');

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
                halign: 'center',
            },
        });

        doc.save("planificacion_anual.pdf");
    };

    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.replace("#", ""), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };

    const getContrastYIQ = (r, g, b) => {
        return (r * 299 + g * 587 + b * 114) / 1000;
    };

    const handleClearPlanning = () => {
        setBackendErrors(null);
        setPlanningData(emptyPlanning);
        dispatch(actions.clearAnnualPlanning());
    };

    const handleYearChange = (event) => {
        const year = parseInt(event.target.value, 10);
        setYear(year);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>

            <div style={{ width: '100%' }}>
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
                    <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                            <label style={{ marginLeft: "10px" }}>Año: </label>
                            <input type="number" value={year} onChange={handleYearChange} min="2000" max="2100" />
                          </div>
                            <button
                                onClick={handleGeneratePlanning}
                                style={{
                                    padding: "5px 15px",
                                    backgroundColor: "#007BFF",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    margin: "0 auto",
                                    display: "block"
                                }}
                            >
                                Generar Planificación
                            </button>
                            <button
                                onClick={exportToPDF}
                                style={{
                                    padding: "5px 15px",
                                    backgroundColor: "#28a745",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    marginLeft: "10px",
                                    alignSelf: "flex-end"
                                }}
                            >
                                Exportar a PDF
                            </button>
                            <button
                                onClick={handleClearPlanning}
                                style={{
                                    padding: "5px 15px",
                                    backgroundColor: "#FF5733",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    marginLeft: "10px",
                                    alignSelf: "flex-end"
                                }}
                            >
                                Vaciar Planificación
                            </button>
                        </div>
                        {isLoading && <div className="loader"></div>}
                        {backendErrors ? <p style={{ color: 'red', textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>{backendErrors}</p> : null}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            {/* Tabla de asignaciones */}
                            <table style={{ width: '100%', tableLayout: 'fixed', fontSize: '12px' }}>
                                <thead>
                                    <tr>
                                        <th>Personas</th>
                                        {months.map((month) => (
                                            <th key={month}>{month}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {planningData.map((person) => (
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
        </div>
    );
};


export default AnnualPlanning;
