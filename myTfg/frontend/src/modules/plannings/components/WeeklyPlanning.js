import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as actions from "../actions";
import * as staffActions from "../../staff/actions";
import * as selectors from "../selectors";
import * as staffSelectors from "../../staff/selectors";

const WeeklyPlanning = () => {
  const dispatch = useDispatch();
  const staffList = useSelector(staffSelectors.getStaffList);
  const weeklyPlanning = useSelector(selectors.getWeeklyPlanning);

  const [isExpanded, setIsExpanded] = useState(true);
  const [backendErrors, setBackendErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rightClickData, setRightClickData] = useState(null);
  const prohibitedMenuRef = useRef(null);
  const [editingCell, setEditingCell] = useState({ personName: null, dayIndex: null });
  const selectRef = useRef(null);
    const [newActivity, setNewActivity] = useState({
      dayIndex: 0,
      type: "",
      color: null,
      slots: 1,
      time: "morning",
    });
  const qxColors = {
    amarillo: "#FFD700",
    azul: "#2196F3",
    rojo: "#E57373",
  };

  const [editingSlot, setEditingSlot] = useState({
    personName: null,
    dayIndex: null,
    time: null,
  });

  const isEditing = (personName, dayIndex) =>
    editingCell.personName === personName && editingCell.dayIndex === dayIndex;

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [weekInMonth, setWeekInMonth] = useState(0);

  const getWeekStartDate = (y, m, weekIndex) => {
    const firstDay = new Date(y, m, 1);
    const startOffset = (8 - firstDay.getDay()) % 7;
    const startDate = new Date(y, m, 1 + startOffset + weekIndex * 7);
    return [...Array(5)].map((_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const days = getWeekStartDate(year, month, weekInMonth);

  const colorMap = {
    QX: "#81C784", PEONAGE: "#E57373", CONSULTATION: "#FF9800", FLOOR: "#E57373", QXROBOT: "#2196F3", CERDO: "#2196F3", CARCA: "#2196F3"
  };
  const activities = Object.keys(colorMap);
  const activities_real = activities.filter((a) => a !== "GP");

    const getMonthName = (month) => {
      const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      return months[month - 1];
    };

  const emptyPlanning = {
    weeklyPlanningDtos: staffList.map((person) => ({
      name: person.name,
      level: `R${person.level}`,
      assignations: Array(5).fill(null),
      eveningAssignations: Array(5).fill(null),
      notValidAssignations: Array(5).fill([])
    })),
    activities: Array(5).fill([])
  };

  const [planningData, setPlanningData] = useState(emptyPlanning);

     useEffect(() => {
       if (editingCell.personName !== null && editingCell.dayIndex !== null) {
         // Delay para evitar loop infinito
         setTimeout(() => {
           if (selectRef.current) {
             selectRef.current.focus();
             selectRef.current.click();
           }
         }, 0);
       }
     }, [editingCell]);


  useEffect(() => {
    dispatch(staffActions.getStaff(() =>
      setBackendErrors("No se ha podido obtener la lista de usuarios")
    ));
  }, []);

  useEffect(() => {
      dispatch(actions.getSavedWeeklyPlanning(
          getMonthName(month + 1),
          year,
          weekInMonth + 1,
          () => setBackendErrors("No se ha podido cargar la planificación guardada.")
      ));
    }, [weekInMonth, month, year]);

  useEffect(() => {
    setPlanningData(weeklyPlanning || emptyPlanning);
    setIsLoading(false);
  }, [weeklyPlanning]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (prohibitedMenuRef.current && !prohibitedMenuRef.current.contains(event.target)) {
        setRightClickData(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectChange = (personName, dayIndex, value) => {
    setPlanningData((prev) => ({
      ...prev,
      weeklyPlanningDtos: prev.weeklyPlanningDtos.map((p) =>
        p.name === personName
          ? { ...p, assignations: p.assignations.map((a, i) => i === dayIndex ? (value === "-" ? null : value) : a) }
          : p
      )
    }));
  };

  const toggleNotValidActivity = (personName, dayIndex, activity) => {
    setPlanningData((prev) => ({
      ...prev,
      weeklyPlanningDtos: prev.weeklyPlanningDtos.map((p) => {
        if (p.name !== personName) return p;
        const current = p.notValidAssignations[dayIndex] || [];
        const updated = current.includes(activity)
          ? current.filter((a) => a !== activity)
          : [...current, activity];
        const list = [...p.notValidAssignations];
        list[dayIndex] = updated;
        return { ...p, notValidAssignations: list };
      })
    }));
  };

  const handleClearPlanning = () => {
    setPlanningData(emptyPlanning);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Planificación Semanal", 10, 10);
    const tableData = planningData.weeklyPlanningDtos.map((p) => [
      p.name,
      ...p.assignations.map((a) => a || "-")
    ]);
    doc.autoTable({
      head: [["Persona", ...days.map(d => `${d.toLocaleDateString("es-ES", { weekday: "long" })} ${d.getDate()}`)]],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8, cellPadding: 1 },
      bodyStyles: { halign: "center" }
    });
    doc.save("planificacion_semanal.pdf");
  };

  const handleGeneratePlanning = () => {
    setIsLoading(true);
    const dataToSend = {
      weeklyAssignationsDtos: planningData.weeklyPlanningDtos.map((p) => {
        const staffMember = staffList.find(staff => staff.name.toLowerCase() === p.name.toLowerCase());
        return {
          ...p,
          level: staffMember ? staffMember.level : null,
          assignations: [...p.assignations]
        };
      }),
      week: weekInMonth + 1,
      month: months[month],
      year,
      days: days.map(d => d.getDate()),
      activities: planningData.activities
    };
    dispatch(actions.getWeeklyPlanning(dataToSend, (errorPayload) => {
      const message = errorPayload?.globalError || "Ha ocurrido un error";
      setBackendErrors(message);
      setIsLoading(false);
    }));
  };

  const handleAddCustomActivity = () => {
    setPlanningData((prev) => {
      const updatedActivities = [...prev.activities];
      updatedActivities[newActivity.dayIndex] = [
        ...(updatedActivities[newActivity.dayIndex] || []),
        {
          type: newActivity.type,
          color: newActivity.color,
          slots: newActivity.slots,
          time: newActivity.time
        }
      ];

      return {
        ...prev,
        activities: updatedActivities
      };
    });

    setNewActivity({
      dayIndex: 0,
      type: "",
      color: null,
      slots: 1,
      time: "morning",
    });
  };

  const handleRemoveActivity = (dayIndex, activityIndex) => {
    setPlanningData((prev) => {
      const updated = [...prev.activities];
      updated[dayIndex] = updated[dayIndex].filter((_, i) => i !== activityIndex);
      return { ...prev, activities: updated };
    });
  };

  const assignCreatedActivity = (personName, dayIndex, time, activityType) => {
    setPlanningData((prev) => ({
      ...prev,
      weeklyPlanningDtos: prev.weeklyPlanningDtos.map((p) =>
        p.name === personName
          ? {
              ...p,
              assignations: time === "morning"
                ? p.assignations.map((a, i) => i === dayIndex ? activityType : a)
                : p.assignations,
              eveningAssignations: time === "evening"
                ? (p.eveningAssignations || []).map((a, i) => i === dayIndex ? activityType : a)
                : p.eveningAssignations || [],
            }
          : p
      ),
    }));
    setEditingSlot({ personName: null, dayIndex: null, time: null });
  };

  return (
    <div className="my-6">
      <h2
        onClick={() => setIsExpanded((prev) => !prev)}
        className="cursor-pointer text-center text-lg font-bold border p-2 rounded bg-blue-50"
      >
        Planificación Semanal {isExpanded ? "▲" : "▼"}
      </h2>
      {isExpanded && (
        <div className="p-4 border rounded mt-4">
          <div className="flex gap-4 flex-wrap justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <label>Año:</label>
              <input type="number" value={year} min={2000} max={2100} onChange={(e) => setYear(Number(e.target.value))} className="border p-1 rounded" />
              <label>Mes:</label>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="border p-1 rounded">
                {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <label>Semana:</label>
              <select value={weekInMonth} onChange={(e) => setWeekInMonth(Number(e.target.value))} className="border p-1 rounded">
                {[0, 1, 2, 3, 4].map(i => <option key={i} value={i}>{`Semana ${i + 1}`}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                  onClick={handleGeneratePlanning}
                  style={{padding: "5px 15px",backgroundColor: "#007BFF",color: "#fff",border: "none",borderRadius: "5px",cursor: "pointer",}}
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
          </div>
          {backendErrors ? <p style={{ color: 'red', textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>{backendErrors}</p> : null}
          <div className="overflow-auto">
            <table className="w-full text-sm text-center border">
              <thead>
                <tr>
                  <th className="bg-gray-100 p-2">{months[month]}</th>
                  {days.map((d, idx) => (
                    <th key={idx} className="bg-gray-100 p-2">
                      {d.toLocaleDateString("es-ES", { weekday: "long" })} {d.getDate()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {planningData.weeklyPlanningDtos.map((person) => (
                  <tr key={person.name}>
                    <td className="bg-gray-50 font-medium">{person.name}</td>
                    {person.assignations.map((_, idx) => {
                      const morningActivity = person.assignations[idx];
                      const eveningActivity = person.eveningAssignations?.[idx] || null;
                      const dayActivities = planningData.activities[idx] || [];

                      const filteredMorning = dayActivities.filter((a) => a.time === "morning");
                      const filteredEvening = dayActivities.filter((a) => a.time === "evening");

                      return (
                        <td key={idx} className="p-0 border">
                          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {/* Mañana */}
                            <div style={{ flex: 1, borderBottom: "1px solid #ccc", padding: "2px" }}>
                              <select
                                value={morningActivity || ""}
                                onChange={(e) =>
                                  assignCreatedActivity(person.name, idx, "morning", e.target.value)
                                }
                                style={{
                                  backgroundColor: colorMap[morningActivity] || "#f9f9f9",
                                  border: "none",
                                  width: "100%",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  fontSize: "0.75rem",
                                  cursor: "pointer",
                                }}
                              >
                                <option value="">-</option>
                                {filteredMorning.map((act, i) => (
                                  <option
                                    key={i}
                                    value={act.type}
                                    style={{
                                      backgroundColor: qxColors[act.color] || "#e0e0e0",
                                      color: "#000",
                                    }}
                                  >
                                    {act.type}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Tarde */}
                            <div style={{ flex: 1, padding: "2px" }}>
                              <select
                                value={eveningActivity || ""}
                                onChange={(e) =>
                                  assignCreatedActivity(person.name, idx, "evening", e.target.value)
                                }
                                style={{
                                  backgroundColor: colorMap[eveningActivity] || "#f9f9f9",
                                  border: "none",
                                  width: "100%",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  fontSize: "0.75rem",
                                  cursor: "pointer",
                                }}
                              >
                                <option value="">-</option>
                                {filteredEvening.map((act, i) => (
                                  <option
                                    key={i}
                                    value={act.type}
                                    style={{
                                      backgroundColor: qxColors[act.color] || "#e0e0e0",
                                      color: "#000",
                                    }}
                                  >
                                    {act.type}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="bg-gray-100 font-semibold text-xs text-left pl-2">
                    Actividades creadas
                  </td>
                  {planningData.activities && planningData.activities.map((activities, idx) => (
                    <td key={idx}>
                      <div
                        className="flex flex-wrap justify-center gap-1 p-1"
                        style={{ minHeight: "30px" }}
                      >
                        {activities && activities.map((act, i) => (
                          <div
                            key={i}
                            title={`${act.type} (${act.slots} slot${act.slots > 1 ? "s" : ""})`}
                            style={{
                              backgroundColor: qxColors[act.color] || "#e0e0e0",
                              padding: "4px 6px",
                              fontSize: "10px",
                              color: "#000",
                              borderRadius: "4px",
                              fontWeight: "bold",
                              minWidth: "40px",
                              textAlign: "center",
                              position: "relative",
                            }}
                          >
                            {act.type}
                            <button
                              onClick={() => handleRemoveActivity(idx, i)}
                              style={{
                                position: "absolute",
                                top: "-4px",
                                right: "-4px",
                                background: "#f44336",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50%",
                                width: "16px",
                                height: "16px",
                                fontSize: "10px",
                                cursor: "pointer",
                                lineHeight: "16px",
                                textAlign: "center",
                                padding: 0,
                              }}
                              title="Eliminar"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <div className="mt-4 border p-3 rounded bg-white shadow w-full max-w-xl mx-auto">
              <h4 className="font-semibold mb-2">Crear nueva actividad</h4>
              <div className="flex flex-wrap items-center gap-3">
                {/* Día */}
                <label className="text-sm">
                  Día:
                  <select
                    value={newActivity.dayIndex}
                    onChange={(e) =>
                      setNewActivity((prev) => ({
                        ...prev,
                        dayIndex: Number(e.target.value),
                      }))
                    }
                    className="ml-2 border p-1 rounded"
                  >
                    {days.map((d, idx) => (
                      <option key={idx} value={idx}>
                        {d.toLocaleDateString("es-ES", { weekday: "long" })}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Turno (mañana/tarde) */}
                <label className="text-sm">
                  Turno:
                  <select
                    value={newActivity.time}
                    onChange={(e) =>
                      setNewActivity((prev) => ({ ...prev, time: e.target.value }))
                    }
                    className="ml-2 border p-1 rounded"
                  >
                    <option value="morning">Mañana</option>
                    <option value="evening">Tarde</option>
                  </select>
                </label>

                {/* Tipo de actividad */}
                <label className="text-sm">
                  Actividad:
                  <select
                    value={newActivity.type}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setNewActivity((prev) => ({
                        ...prev,
                        type: selected,
                        color: selected === "QX" ? "amarillo" : null, // default color or null
                      }));
                    }}
                    className="ml-2 border p-1 rounded"
                  >
                    <option value="">-- Seleccionar --</option>
                    <option value="QX">QX</option>
                    <option value="CONSULTATION">CONSULTATION</option>
                    <option value="CARCA">CARCA</option>
                    <option value="CERDO">CERDO</option>
                    <option value="QXROBOT">QXROBOT</option>
                  </select>
                </label>

                {/* Color solo si es QX */}
                <label className="text-sm">
                  Color:
                  <select
                    value={newActivity.color || ""}
                    onChange={(e) =>
                      setNewActivity((prev) => ({ ...prev, color: e.target.value }))
                    }
                    disabled={newActivity.type !== "QX"}
                    className="ml-2 border p-1 rounded"
                  >
                    <option value="amarillo">Amarillo</option>
                    <option value="azul">Azul</option>
                    <option value="rojo">Rojo</option>
                  </select>
                </label>

                {/* Slots */}
                <label className="text-sm">
                  Slots:
                  <input
                    type="number"
                    value={newActivity.slots}
                    min={1}
                    max={10}
                    onChange={(e) =>
                      setNewActivity((prev) => ({
                        ...prev,
                        slots: Number(e.target.value),
                      }))
                    }
                    className="ml-2 border p-1 rounded w-16"
                  />
                </label>

                {/* Botón crear */}
                <button
                  onClick={handleAddCustomActivity}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm"
                  disabled={!newActivity.type}
                >
                  Crear
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlanning;
