import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Si usas Redux:
// import { useDispatch, useSelector } from "react-redux";
// import * as actions from "../actions";
// import * as selectors from "../selectors";

const MonthlyPlanning = () => {
  // Si usas Redux, puedes descomentar e implementar lo que necesites
  // const dispatch = useDispatch();
  // const monthlyPlanningFromStore = useSelector(selectors.getMonthlyPlanning);

  // Para este ejemplo, definimos localmente las personas y la estructura de datos.
  // Ajusta el número de filas y la lógica a tu gusto.
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

  // Creamos una estructura de ejemplo con 31 días y asignaciones iniciales nulas.
  const emptyPlanning = personas.map((name) => ({
    name,
    // Por si quieres usar un "nivel" o cualquier otro dato adicional.
    level: "R1",
    // Creamos 31 días para el mes (podrías ajustarlo dinámicamente).
    assignations: Array(31).fill(null),
  }));

  // Manejamos el estado de la planificación. Si tuvieras un store, podrías
  // inicializar con monthlyPlanningFromStore en lugar de emptyPlanning.
  const [planningData, setPlanningData] = useState(emptyPlanning);

  // Controla la expansión/colapso de la sección
  const [isExpanded, setIsExpanded] = useState(false);

  // Manejamos mensajes de error y de carga
  const [backendErrors, setBackendErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  // Días del mes (1..31). Si quieres ajustar el número de días,
  // puedes generar dinámicamente según el mes y el año.
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

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

  // Función para cambiar el nombre de una persona (blur del input)
  const handleNameChange = (oldName, newName) => {
    const updatedPlanning = planningData.map((person) =>
      person.name === oldName ? { ...person, name: newName } : person
    );
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

    // Aquí podrías preparar la data para enviarla a tu backend
    // const convertedPlanningData = planningData.map((person) => ({
    //   ...person,
    //   assignations: person.assignations, // o un .filter o transform si lo necesitas
    // }));

    // Simulación de una llamada asíncrona
    setTimeout(() => {
      // Si hubiera error:
      // setBackendErrors("No se ha encontrado una solución");
      setIsLoading(false);

      // Si usas Redux, podrías despachar una acción:
      // dispatch(actions.getMonthlyPlanning(
      //   convertedPlanningData,
      //   () => setBackendErrors("No se encontró solución")
      // ));
    }, 1500);
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

  // Funciones auxiliares para manejo de colores
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const getContrastYIQ = (r, g, b) => {
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Función para limpiar la planificación y dejar todo vacío
  const handleClearPlanning = () => {
    setBackendErrors(null);
    setPlanningData(emptyPlanning);
    // Si usas Redux:
    // dispatch(actions.clearMonthlyPlanning());
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
              {/* Lista de Personal y Nivel */}
              <div
                style={{
                  width: "15%",
                  paddingRight: "10px",
                  border: "1px solid #ddd",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h3>Lista de Personal</h3>
                {planningData.map((person) => (
                  <div
                    key={person.name}
                    style={{
                      marginBottom: "5px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      value={localValues[person.name]}
                      onChange={(e) => {
                        setLocalValues({
                          ...localValues,
                          [person.name]: e.target.value,
                        });
                      }}
                      onBlur={() => {
                        handleNameChange(person.name, localValues[person.name]);
                      }}
                      style={{
                        padding: "5px",
                        marginBottom: "5px",
                        width: "90px",
                        fontSize: "12px",
                        height: "30px",
                      }}
                    />
                    <p
                      style={{
                        marginLeft: "10px",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      {person.level}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tabla de asignaciones */}
              <div style={{ width: "80%", overflowX: "auto" }}>
                <table
                  style={{ width: "100%", tableLayout: "fixed", fontSize: "12px" }}
                >
                  <thead>
                    <tr>
                      <th>Persona</th>
                      {daysInMonth.map((day) => (
                        <th key={day}>{day}</th>
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
