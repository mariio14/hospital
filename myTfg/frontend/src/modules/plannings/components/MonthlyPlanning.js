import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const MonthlyPlanning = () => {

  const personas = [
    "Aloia",
    "Sergio",
    "Carlota",
    "Lucía",
    "Robla",
    "Esther",
    "Óscar",
    "Wis",
    "Camila",
    "Sierra",
    "Miguel",
    "Patri",
    "Andrea",
    "Javi",
  ];

  const [isExpanded, setIsExpanded] = useState(false);

  const [backendErrors, setBackendErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(month, year));

  const emptyPlanning = personas.map((name) => ({
    name,
    level: "R1",
    assignations: Array(daysInMonth).fill(null),
  }));

  const [planningData, setPlanningData] = useState(emptyPlanning);


  useEffect(() => {
    setDaysInMonth(getDaysInMonth(month, year));
  }, [month, year]);

  useEffect(() => {
      setPlanningData(personas.map((name) => ({
        name,
        level: "R1",
        assignations: Array(daysInMonth).fill(null),
      })));
    }, [daysInMonth]);

  // Valores locales para el input de nombre (similar a tu AnnualPlanning)
  const [localValues, setLocalValues] = useState(
    planningData.reduce((acc, person) => {
      acc[person.name] = person.name;
      return acc;
    }, {})
  );

  // Actualiza localValues si cambia la planificación
  useEffect(() => {
    const updatedLocalValues = planningData.reduce((acc, person) => {
      acc[person.name] = person.name;
      return acc;
    }, {});
    setLocalValues(updatedLocalValues);
  }, [planningData]);

  // Mapa de colores para las distintas actividades/tareas que aparecen en la tabla
  // Ajusta estos colores según tus necesidades.
  const colorMap = {
    E: "#4CAF50",     // Ejemplo: guardia E
    G: "#FF9800",     // Ejemplo: guardia G
    I: "#FFEB3B",     // Ejemplo: incidencia I
    GP: "#F44336",    // Ejemplo: guardia prolongada
    VAC: "#2196F3",   // Ejemplo: vacaciones
    // Añade tantas claves como necesites
  };

  // Lista de actividades que el usuario podrá seleccionar en cada celda
  const activities = Object.keys(colorMap);

  // Función que se llama cuando el usuario cambia el select de una celda
  const handleSelectChange = (personName, dayIndex, value) => {
    const updatedPlanning = planningData.map((person) => {
      if (person.name === personName) {
        // Creamos una copia de las asignaciones
        const newAssignations = [...person.assignations];
        // dayIndex coincide con el índice del array
        newAssignations[dayIndex] = value === "-" ? null : value;
        return { ...person, assignations: newAssignations };
      }
      return person;
    });
    setPlanningData(updatedPlanning);
  };

  // Función para expandir/colapsar la sección
  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  // Función para "Generar" la planificación (simulando una llamada al backend)
  const handleGeneratePlanning = () => {
    setBackendErrors(null);
    setIsLoading(true);

  };

  // Función para exportar a PDF usando jsPDF
  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Planificación Mensual", 10, 10);

    // Preparamos la data para la tabla
    const tableData = planningData.map((person) => {
      // Cada fila: [ NombrePersona, Día1, Día2, ..., Día31 ]
      return [
        person.name,
        ...person.assignations.map((assignation) => assignation || "-"),
      ];
    });

    doc.autoTable({
      head: [["Persona", ...daysInMonth.map((d) => `Día ${d}`)]],
      body: tableData,
      styles: { fontSize: 8, cellPadding: 1 },
      startY: 20,
      didDrawCell: (data) => {
        // Pintamos la celda con el color correspondiente si es una actividad
        if (data.section === "body" && data.column.index > 0) {
          const activity = data.cell.raw;
          if (activity && activity !== "-") {
            const bgColor = colorMap[activity] || "#FFFFFF";
            const [r, g, b] = hexToRgb(bgColor);
            doc.setFillColor(r, g, b);
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "F");
            const textColor = getContrastYIQ(r, g, b) > 128 ? "#000000" : "#FFFFFF";
            doc.setTextColor(textColor);
            doc.text(
              activity,
              data.cell.x + data.cell.width / 2,
              data.cell.y + data.cell.height / 2,
              { align: "center", baseline: "middle" }
            );
          }
        }
      },
      headStyles: {
        halign: "center",
      },
    });

    doc.save("planificacion_mensual.pdf");
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
  };

  const handleMonthChange = (event) => {
    setMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event) => {
    setYear(parseInt(event.target.value));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ width: "100%" }}>
        <h2
          onClick={toggleSection}
          style={{
            cursor: "pointer",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            textAlign: "center",
            backgroundColor: "#f9f9f9",
          }}
        >
          Planificación Mensual {isExpanded ? "▲" : "▼"}
        </h2>

        {isExpanded && (
          <div
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "5px",
            }}
          >
            {/* Botones de acciones */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={handleGeneratePlanning}
                style={{
                  padding: "5px 15px",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Generar Planificación
              </button>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <label>Mes: </label>
                <select value={month} onChange={handleMonthChange}>
                  {[...Array(12).keys()].map((m) => (
                    <option key={m + 1} value={m + 1}>{new Date(0, m).toLocaleString('es-ES', { month: 'long' })}</option>
                  ))}
                </select>
                <label style={{ marginLeft: "10px" }}>Año: </label>
                <input type="number" value={year} onChange={handleYearChange} min="2000" max="2100" />
              </div>

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
                }}
              >
                Vaciar Planificación
              </button>
            </div>

            {isLoading && <div className="loader"></div>}
            {backendErrors && (
              <p
                style={{
                  color: "red",
                  textAlign: "center",
                  marginTop: "30px",
                  marginBottom: "20px",
                }}
              >
                {backendErrors}
              </p>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              {/* Tabla de asignaciones */}
              <div style={{ width: "80%", overflowX: "auto" }}>
                <table
                  style={{ width: "100%", tableLayout: "fixed", fontSize: "12px" }}
                >
                  <thead>
                    <tr>
                      <th>Persona</th>
                      {[...Array(daysInMonth).keys()].map((day) => (
                        <th key={day + 1}>{day + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {planningData.map((person) => (
                      <tr key={person.name}>
                        <td
                          style={{
                            backgroundColor: "#E0E0E0",
                            color: "#000",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {person.name}
                        </td>
                        {person.assignations.map((activity, dayIndex) => {
                          return (
                            <td
                              key={`${person.name}-${dayIndex}`}
                              style={{
                                backgroundColor: colorMap[activity] || "#E0E0E0",
                                color: "#000",
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                              title={activity || "Sin asignación"}
                            >
                              <select
                                value={activity || ""}
                                onChange={(e) =>
                                  handleSelectChange(
                                    person.name,
                                    dayIndex,
                                    e.target.value
                                  )
                                }
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  color: "#000",
                                  cursor: "pointer",
                                  width: "100%",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  appearance: "none",
                                }}
                              >
                                <option value="-">-</option>
                                {activities.map((act) => (
                                  <option
                                    key={act}
                                    value={act}
                                    style={{
                                      backgroundColor: colorMap[act],
                                      color: "#000",
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyPlanning;
