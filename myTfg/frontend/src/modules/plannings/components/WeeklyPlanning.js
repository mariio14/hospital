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
  const weeklyPlanningList = useSelector(selectors.getWeeklyPlanningList);

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
    identifier: "",
  });

  const qxColors = {
    amarillo: "#FFD700",
    azul: "#2196F3",
    rojo: "#E57373",
  };

  const colorPersonMap = {
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
  const [activePlanningIndex, setActivePlanningIndex] = useState(0);
  const [draggedCell, setDraggedCell] = useState(null);

  useEffect(() => {
    if (weeklyPlanningList && weeklyPlanningList.length > 0) {
      setPlanningData(weeklyPlanningList[activePlanningIndex] || emptyPlanning);
    }
  }, [activePlanningIndex, weeklyPlanningList]);

  const goToNextPlanning = () => {
    setActivePlanningIndex((prev) =>
      prev < weeklyPlanningList.length - 1 ? prev + 1 : 0
    );
  };

  const goToPrevPlanning = () => {
    setActivePlanningIndex((prev) =>
      prev > 0 ? prev - 1 : weeklyPlanningList.length - 1
    );
  };

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
      color: null,
      assignations: Array(5).fill(null),
      eveningAssignations: Array(5).fill(null),
      notValidAssignations: Array(5).fill([])
    })),
    activities: Array(5).fill(null).map(() => [
      { type: "FLOOR", color: "azul", slots: 0, time: "morning" },
      { type: "FLOOR", color: "amarillo", slots: 0, time: "morning" },
      { type: "FLOOR", color: "rojo", slots: 0, time: "morning" }
    ]),
    complete: false
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
          {days: days.map(d => d.getDate())},
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

  const handleDragStart = (personName, monthIndex) => {
    setDraggedCell({ personName, monthIndex });
  };

  const handleDrop = (targetPersonName, targetMonthIndex) => {
    if (!draggedCell) return;

    setPlanningData((prevPlanning) => {
      console.log(prevPlanning);
      const updated = {
        ...prevPlanning,
        weeklyPlanningDtos: prevPlanning.weeklyPlanningDtos.map((person) => ({
          ...person,
          assignations: [...person.assignations]
        }))
      };

      const sourcePersonIndex = updated.weeklyPlanningDtos.findIndex(
        (p) => p.name === draggedCell.personName
      );
      const targetPersonIndex = updated.weeklyPlanningDtos.findIndex(
        (p) => p.name === targetPersonName
      );

      const sourceValue = updated.weeklyPlanningDtos[sourcePersonIndex].assignations[draggedCell.monthIndex];
      const targetValue = updated.weeklyPlanningDtos[targetPersonIndex].assignations[targetMonthIndex];

      updated.weeklyPlanningDtos[sourcePersonIndex].assignations[draggedCell.monthIndex] = targetValue;
      updated.weeklyPlanningDtos[targetPersonIndex].assignations[targetMonthIndex] = sourceValue;

      console.log(updated);
      if (updated.complete) {
        setIsLoading(true);
        setBackendErrors(null);
        const dataToSend = {
          weeklyPlanningDtos: updated.weeklyPlanningDtos.map((p) => {
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
          activities: updated.activities,
          complete: true
        };

        dispatch(
          actions.checkWeeklyPlanning(
            dataToSend,
            () => {
              setBackendErrors(null);
              setIsLoading(false);
            },
            (errorPayload) => {
              const message = errorPayload?.globalError || "Ha ocurrido un error";
              setBackendErrors(message);
              setIsLoading(false);
            }
          )
        );
      }
      return updated;
    });

    setDraggedCell(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
    setBackendErrors(null);

    const updatedDtos = emptyPlanning.weeklyPlanningDtos.map((emptyPerson) => {
      const currentPerson = planningData.weeklyPlanningDtos.find(
        (p) => p.name === emptyPerson.name
      );
      return {
        ...emptyPerson,
        color: currentPerson?.color || null,
      };
    });

    const updatedData = {
      ...emptyPlanning,
      weeklyPlanningDtos: updatedDtos,
      complete: false,
    };

    setPlanningData(updatedData);

    dispatch(actions.getWeeklyClear(updatedData));
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
    setBackendErrors(null);
    const dataToSend = {
      weeklyPlanningDtos: planningData.weeklyPlanningDtos.map((p) => {
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
      activities: planningData.activities,
      complete: planningData.complete
    };
    dispatch(actions.getWeeklyPlanning(dataToSend, (errorPayload) => {
      const message = errorPayload?.globalError || "Ha ocurrido un error";
      setBackendErrors(message);
      setIsLoading(false);
    }));
  };

  const handleConfirmPlanning = () => {
      setBackendErrors(null);
      const dataToSend = {
        weeklyPlanningDtos: planningData.weeklyPlanningDtos.map((p) => {
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
        activities: planningData.activities,
        complete: planningData.complete
      };
      dispatch(actions.saveWeeklyPlanning(dataToSend, (errorPayload) => {
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
          time: newActivity.time,
          identifier: newActivity.identifier
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
      identifier: "",
    });
  };

  const handleRemoveActivity = (dayIndex, activityIndex) => {
    setPlanningData((prev) => {
      const updatedActivities = [...prev.activities];
      const removedActivity = updatedActivities[dayIndex][activityIndex];

      // Eliminar la actividad de la lista de actividades
      updatedActivities[dayIndex] = updatedActivities[dayIndex].filter((_, i) => i !== activityIndex);

      let valuesToRemove = [];

      // Caso especial: PLANTA/QX (FLOOR amarillo)
      if (removedActivity.type === "FLOOR" && removedActivity.color === "amarillo") {
        valuesToRemove.push("PLANTA/QX");
        // Si hay variantes con identificador, también se añaden
        planningData.activities[dayIndex]
          .filter(a => a.type === "QX" && a.color === "amarillo")
          .forEach(a => {
            valuesToRemove.push(`PLANTA/QX_${a.identifier || ""}`);
          });
      }
      if (removedActivity.type === "QX" && removedActivity.color === "amarillo") {
          valuesToRemove.push(removedActivity.identifier ? `PLANTA/QX_${removedActivity.identifier}` : "PLANTA/QX");
       }
      const generalValue = removedActivity.color
        ? removedActivity.identifier
          ? `${removedActivity.type}_${removedActivity.color}_${removedActivity.identifier}`
          : `${removedActivity.type}_${removedActivity.color}`
        : removedActivity.type;

      valuesToRemove.push(generalValue);

      // Actualizar las asignaciones y eveningAssignations
      const updatedDtos = prev.weeklyPlanningDtos.map(person => {
        let newAssignations = [...person.assignations];
        let newEveningAssignations = [...(person.eveningAssignations || [])];

        if (removedActivity.time === "morning") {
          newAssignations = newAssignations.map((a, idx) =>
            idx === dayIndex && valuesToRemove.includes(a) ? null : a
          );
        }

        if (removedActivity.time === "evening") {
          newEveningAssignations = newEveningAssignations.map((a, idx) =>
            idx === dayIndex && valuesToRemove.includes(a) ? null : a
          );
        }

        return {
          ...person,
          assignations: newAssignations,
          eveningAssignations: newEveningAssignations
        };
      });
      return {
        ...prev,
        activities: updatedActivities,
        weeklyPlanningDtos: updatedDtos
      };
    });
  };

  const assignCreatedActivity = (personName, dayIndex, time, activityType, color, id) => {
    let activityWithColor;
    if (activityType === "PLANTA/QX") {
      activityWithColor = `PLANTA/QX${id ? `_${id}` : ""}`;
    } else {
      activityWithColor = `${activityType}${color ? `_${color}` : "_null"}${id ? `_${id}` : ""}`;
    }

    setPlanningData((prev) => {
      const updatedData = {
        ...prev,
        weeklyPlanningDtos: prev.weeklyPlanningDtos.map((p) =>
          p.name === personName
            ? {
                ...p,
                assignations:
                  time === "morning"
                    ? p.assignations.map((a, i) =>
                        i === dayIndex ? activityWithColor : a
                      )
                    : p.assignations,
                eveningAssignations:
                  time === "evening"
                    ? (p.eveningAssignations || []).map((a, i) =>
                        i === dayIndex ? activityWithColor : a
                      )
                    : p.eveningAssignations || [],
              }
            : p
        ),
      };

      if (updatedData.complete) {
        setIsLoading(true);
        setBackendErrors(null);
        const dataToSend = {
          weeklyPlanningDtos: updatedData.weeklyPlanningDtos.map((p) => {
            const staffMember = staffList.find(
              (staff) => staff.name.toLowerCase() === p.name.toLowerCase()
            );
            return {
              ...p,
              level: staffMember ? staffMember.level : null,
              assignations: [...p.assignations],
            };
          }),
          week: weekInMonth + 1,
          month: months[month],
          year,
          days: days.map((d) => d.getDate()),
          activities: updatedData.activities,
          complete: true,
        };
        dispatch(
          actions.checkWeeklyPlanning(dataToSend,
          () => {
            setBackendErrors(null);
            setIsLoading(false);
          }, (errorPayload) => {
            const message = errorPayload?.globalError || "Ha ocurrido un error";
            setBackendErrors(message);
            setIsLoading(false);
          })
        );
      }

      return updatedData;
    });

    setEditingSlot({ personName: null, dayIndex: null, time: null });
  };

  const getCombinedPlantaQxOptions = (dayActivities, time) => {
    const floorExists = dayActivities.some(
      a => a.type === "FLOOR" && a.color === "amarillo" && a.time === time
    );

    if (!floorExists) return [];

    return dayActivities
      .filter(a => a.type === "QX" && a.color === "amarillo" && a.time === time)
      .map(qx => qx.identifier || "");
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
            {weeklyPlanningList.length > 1 && (
              <div className="flex gap-2 items-center">
                <button
                  onClick={goToPrevPlanning}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  ◀
                </button>
                <span style={{ fontWeight: "bold" }}>
                  Planning {activePlanningIndex + 1} de {weeklyPlanningList.length}
                </span>
                <button
                  onClick={goToNextPlanning}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  ▶
                </button>
                <button
                  onClick={handleConfirmPlanning}
                  style={{
                    padding: "5px 15px",
                    backgroundColor: "#17a2b8",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  Confirmar plan
                </button>
              </div>
            )}

          </div>
          {isLoading && <div className="loader"></div>}
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
                {planningData.weeklyPlanningDtos && planningData.weeklyPlanningDtos.map((person) => {
                  const rowColor = colorPersonMap[person.color] || "#fff";
                  return(
                  <tr key={person.name} style={{ backgroundColor: rowColor }}>
                    <td className="font-medium">{person.name}</td>
                    {person.assignations.map((_, idx) => {
                      const morningActivity = person.assignations[idx];
                      const eveningActivity = person.eveningAssignations?.[idx] || null;
                      const dayActivities = planningData.activities[idx] || [];

                      const filteredMorning = dayActivities.filter((a) => a.time === "morning");
                      const filteredEvening = dayActivities.filter((a) => a.time === "evening");

                      return (
                        <td key={idx} className="p-0 border"
                          draggable
                          onDragStart={() => handleDragStart(person.name, idx)}
                          onDrop={() => handleDrop(person.name, idx)}
                          onDragOver={handleDragOver}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {/* Mañana */}
                            <div style={{ flex: 1, borderBottom: "1px solid #ccc", padding: "2px" }}>
                              <select
                                value={
                                  (morningActivity || "").startsWith("PLANTA/QX")
                                    ? morningActivity || ""
                                    : (morningActivity || "").startsWith("QX_")
                                      ? (morningActivity || "").split("_").slice(0, 2).join("_")
                                      : (morningActivity || "").split("_")[0]
                                }
                                onChange={(e) => {
                                  const selectedActivity = e.target.value;
                                  const [type, id] = selectedActivity.split("_");
                                  let selected;
                                  let typeSelected = type;
                                  let idSelected = id;
                                  let color;

                                  if (type === "QX" && id) {
                                    selected = filteredMorning.find(
                                      (a) => a.type === "QX" && a.identifier === id
                                    );
                                  } else if (type === "PLANTA/QX") {
                                    selected = filteredMorning.find(
                                      (a) => a.type === type
                                    );
                                  } else {
                                    selected = filteredMorning.find((a) => a.type === type);
                                    typeSelected = type;
                                    idSelected = selected?.identifier;
                                  }
                                  assignCreatedActivity(person.name, idx, "morning", typeSelected, selected?.color, idSelected);
                                }}
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
                                <>
                                  {/* Opción combinada PLANTA/QX */}
                                  {getCombinedPlantaQxOptions(dayActivities, "morning").map((id, idx) => {
                                    const value = `PLANTA/QX${id ? `_${id}` : ""}`;
                                    const label = `PLANTA/QX${id ? `_${id}` : ""}`;
                                    return (
                                      <option
                                        key={idx}
                                        value={value}
                                        style={{
                                          backgroundColor: qxColors["amarillo"],
                                          color: "#000",
                                        }}
                                      >
                                        {label}
                                      </option>
                                    );
                                  })}

                                  {/* Opciones normales */}
                                  {filteredMorning.map((act, i) => (
                                    <option
                                      key={i}
                                      value={act.identifier ? `${act.type}_${act.identifier}` : act.type}
                                      style={{
                                        backgroundColor: qxColors[act.color] || "#e0e0e0",
                                        color: "#000",
                                      }}
                                    >
                                      {act.identifier ? `${act.type}_${act.identifier}` : act.type}
                                    </option>
                                  ))}
                                </>
                              </select>
                            </div>

                            {/* Tarde */}
                            <div style={{ flex: 1, padding: "2px" }}>
                              <select
                                value={(eveningActivity || "").split("_")[0]}
                                onChange={(e) => {
                                  const selectedActivity = e.target.value;
                                    const [type, id] = selectedActivity.split("_");
                                    let selected;
                                    let typeSelected = type;
                                    let idSelected = id;

                                    if (type === "QX" && id) {
                                      selected = filteredMorning.find(
                                        (a) => a.type === "QX" && a.identifier === id
                                      );
                                    } else {
                                      selected = filteredMorning.find((a) => a.type === type);
                                      typeSelected = idx;
                                      idSelected = selected?.identifier
                                    }
                                    assignCreatedActivity(person.name, idx, "evening", typeSelected, selected?.color, idSelected);
                                }}
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
                                <>
                                  {/* Opción combinada PLANTA/QX */}
                                  {getCombinedPlantaQxOptions(dayActivities, "morning").map((id, idx) => (
                                    <option
                                      key={idx}
                                      value={`PLANTA/QX${id ? `_${id}` : ""}`}
                                      style={{
                                        backgroundColor: qxColors["amarillo"],
                                        color: "#000",
                                      }}
                                    >
                                      {`PLANTA/QX${id ? `_${id}` : ""}`}
                                    </option>
                                  ))}

                                  {/* Opciones normales */}
                                  {filteredEvening.map((act, i) => (
                                    <option
                                      key={i}
                                      value={act.identifier ? `${act.type}_${act.identifier}` : act.type}
                                      style={{
                                        backgroundColor: qxColors[act.color] || "#e0e0e0",
                                        color: "#000",
                                      }}
                                    >
                                      {act.identifier ? `${act.type}_${act.identifier}` : act.type}
                                    </option>
                                  ))}
                                </>
                              </select>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  )
                })}
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
                            {act.identifier ? `${act.type}_${act.identifier}` : act.type}
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

                {newActivity.type === "QX" && (
                  <label className="text-sm">
                    Identificador:
                    <input
                      type="text"
                      value={newActivity.identifier}
                      onChange={(e) =>
                        setNewActivity((prev) => ({
                          ...prev,
                          identifier: e.target.value,
                        }))
                      }
                      className="ml-2 border p-1 rounded w-24"
                    />
                  </label>
                )}

                {/* Slots */}
                {newActivity.type === "QX" && (
                <label className="text-sm">
                  Residentes:
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
                )}

                {/* Botón crear */}
                <button
                  onClick={handleAddCustomActivity}
                  className="bg-blue-500 text-black px-4 py-1 rounded hover:bg-blue-600 text-sm"
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
