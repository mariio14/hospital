import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as actions from "../actions";
import * as staffActions from "../../staff/actions"
import * as selectors from "../selectors";
import * as staffSelectors from "../../staff/selectors"

const MonthlyPlanning = () => {

  const dispatch = useDispatch();
  const staffList = useSelector(staffSelectors.getStaffList);
  const monthlyPlanning = useSelector(selectors.getMonthlyPlanning);

  const [isExpanded, setIsExpanded] = useState(false);

  const [backendErrors, setBackendErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(month, year));

  const getMonthName = (month) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months[month - 1];
  };

  const emptyPlanning = {
    month: getMonthName(month),
    monthlyPlanningDtos: staffList.map(person => ({
      name: person.name,
      level: `R${person.level}`,
      assignations: Array(daysInMonth).fill(null)
    }))
  };

  const [planningData, setPlanningData] = useState(emptyPlanning);

  useEffect(() => {
      dispatch(staffActions.getStaff(
          () => setBackendErrors('No se ha podido obtener la lista de usuarios')
      ));
  }, []);

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(month, year));
  }, [month, year]);

  useEffect(() => {
      const emptyPlanning = staffList.map(person => ({
          name: person.name,
          level: `R${person.level}`,
          assignations: Array(daysInMonth).fill(null)
      }));
    }, [daysInMonth]);

  useEffect(() => {
      setPlanningData(monthlyPlanning ? monthlyPlanning : emptyPlanning);
      setIsLoading(false);
  }, [monthlyPlanning]);

  const getDayOfWeek = (day, month, year) => {
    const daysOfWeek = ["D", "L", "M", "X", "J", "V", "S"];
    return daysOfWeek[new Date(year, month - 1, day).getDay()];
  };

  const colorMap = {
    E: "#81C784",
    G: "#E57373",
    I: "#FF9800",
    GP: "#E57373",
    V: "#2196F3",
    C: "#FFFFFF"
  };

  const activities = Object.keys(colorMap);

  const handleSelectChange = (personName, dayIndex, value) => {
    console.log(personName)
    console.log(dayIndex)
    console.log(value)
    setPlanningData((prevPlanning) => ({
      ...month,
      monthlyPlanningDtos: prevPlanning.monthlyPlanningDtos.map((person) =>
        person.name === personName
          ? {
              ...person,
              assignations: person.assignations.map((shift, index) =>
                index === dayIndex ? (value === "-" ? null : value) : shift
              ),
            }
          : person
      ),
    }));
  };

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  // Función para "Generar" la planificación (simulando una llamada al backend)
  const handleGeneratePlanning = () => {
    setBackendErrors(null);
    setIsLoading(true);

    let firstFriday = 1;
    while (new Date(year, month - 1, firstFriday).getDay() !== 5) {
        firstFriday++;
    }

    const convertedPlanningData = {
        monthlyAssignationsDtos: planningData.monthlyPlanningDtos.map(person => {
            const staffMember = staffList.find(staff => staff.name.toLowerCase() === person.name.toLowerCase());

            return {
                ...person,
                assignations: Object.values(person.assignations),
                level: staffMember ? staffMember.level : null
            };
        }),
        numberOfDays: daysInMonth,
        month: getMonthName(month),
        year: year,
        firstDay: getDayOfWeek(1,month,year),
        firstFriday: firstFriday,
        weekends: [],
        festivos: []
    }

    dispatch(actions.getMonthlyPlanning(
        convertedPlanningData,
        () => {
            setBackendErrors('Sin solución');
            setIsLoading(false);
        }
    ));

  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Planificación Mensual", 10, 10);

    const tableData = monthlyPlanning.monthlyPlanningDtos.map((person) => {
      return [
        person.name,
        ...person.assignations.map((assignation) => assignation || "-"),
      ];
    });

    doc.autoTable({
      head: [["Persona", ...Array.from({ length: daysInMonth }, (_, i) => `Día ${i + 1}`)]],
      body: tableData,
      styles: { fontSize: 8, cellPadding: 1 },
      startY: 20,
      bodyStyles: { halign: "center" },
      didDrawCell: (data) => {
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <table
                  style={{ width: "100%", tableLayout: "fixed", fontSize: "12px" }}
                >
                  <thead>
                      <tr>
                        <th></th>
                        {[...Array(daysInMonth).keys()].map((day) => (
                          <th key={day + 1}>{getDayOfWeek(day + 1, month, year)}</th>
                        ))}
                      </tr>
                      <tr>
                        <th>{getMonthName(month)}</th>
                        {[...Array(daysInMonth).keys()].map((day) => (
                          <th key={day + 1}>{day + 1}</th>
                        ))}
                      </tr>
                    </thead>
                  <tbody>
                    {planningData.monthlyPlanningDtos.map((person) => (
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
                        {Object.entries(person.assignations).map(([dayIndex, activity]) => {
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
                                    Number(dayIndex),
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
