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
    QX: "#81C784", PEONAGE: "#E57373", CONSULTATION: "#FF9800", FLOOR: "#E57373", QXROBOT: "#2196F3"
  };
  const activities = Object.keys(colorMap);
  const activities_real = activities.filter((a) => a !== "GP");

  const emptyPlanning = {
    weeklyPlanningDtos: staffList.map((person) => ({
      name: person.name,
      level: `R${person.level}`,
      assignations: Array(5).fill(null),
      notValidAssignations: Array(5).fill([])
    }))
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
      days: days.map(d => d.getDate())
    };
    dispatch(actions.getWeeklyPlanning(dataToSend, (errorPayload) => {
      const message = errorPayload?.globalError || "Ha ocurrido un error";
      setBackendErrors(message);
      setIsLoading(false);
    }));
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
                    {person.assignations.map((activity, idx) => {
                      const bgColor = activity ? colorMap[activity] || "#f0f0f0" : "#f9f9f9";
                      const isCellEditing = isEditing(person.name, idx);

                      return (
                        <td key={idx}>
                          <select
                            value={activity || ""}
                            onChange={(e) =>
                              handleSelectChange(person.name, idx, e.target.value)
                            }
                            style={{
                              backgroundColor: colorMap[activity] || "#f0f0f0",
                              border: "1px solid #ccc",
                              color: "#000",
                              cursor: "pointer",
                              width: "100%",
                              textAlign: "center",
                              fontWeight: "bold",
                              padding: "8px",
                              appearance: "none", // Oculta la flecha nativa
                              WebkitAppearance: "none",
                              MozAppearance: "none",
                              textAlignLast: "center",
                            }}
                          >
                            <option value="">-</option>
                            {activities_real.map((act) => (
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
      )}
    </div>
  );
};

export default WeeklyPlanning;
