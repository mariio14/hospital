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
    E: "#81C784", G: "#E57373", I: "#FF9800", GP: "#E57373", V: "#2196F3", C: "#FFFFFF"
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
      weeklyAssignationsDtos: planningData.weeklyPlanningDtos.map((p) => ({
        ...p,
        assignations: [...p.assignations],
        notValidAssignations: [...p.notValidAssignations]
      })),
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
                    {person.assignations.map((activity, idx) => (
                      <td key={idx}>
                        <select
                          value={activity || ""}
                          onChange={(e) => handleSelectChange(person.name, idx, e.target.value)}
                          className="w-full text-center bg-transparent"
                        >
                          <option value="-">-</option>
                          {activities_real.map((a) => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      </td>
                    ))}
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
