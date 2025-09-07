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

  const [isLoading, setIsLoading] = useState(false);
  const [planningStatus, setPlanningStatus] = useState(null); // 'valid', 'invalid', or null
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
    amarillo: "rgba(255, 215, 0, 0.6)", // Reduced opacity from solid #FFD700
    azul: "rgba(33, 150, 243, 0.6)", // Reduced opacity from solid #2196F3
    rojo: "rgba(229, 115, 115, 0.6)", // Reduced opacity from solid #E57373
  };

  const colorPersonMap = {
      PARED: "rgba(76, 175, 80, 0.6)", // Reduced opacity from solid #4CAF50
      AMARILLO: "rgba(255, 235, 59, 0.6)", // Reduced opacity from solid #FFEB3B
      COLON: "rgba(33, 150, 243, 0.6)", // Reduced opacity from solid #2196F3
      ROJOS: "rgba(244, 67, 54, 0.6)", // Reduced opacity from solid #F44336
      URGENCIAS: "rgba(156, 39, 176, 0.6)", // Reduced opacity from solid #9C27B0
      PROCTO: "rgba(121, 85, 72, 0.6)", // Reduced opacity from solid #795548
      MAMA: "rgba(244, 143, 177, 0.6)", // Reduced opacity from solid #F48FB1
      NUTRI: "rgba(211, 211, 211, 0.6)", // Reduced opacity from solid #D3D3D3
      RAYOS: "rgba(96, 125, 139, 0.6)", // Reduced opacity from solid #607D8B
      REA: "rgba(63, 81, 181, 0.6)", // Reduced opacity from solid #3F51B5
      TORACICA: "rgba(139, 195, 74, 0.6)", // Reduced opacity from solid #8BC34A
      VASCULAR: "rgba(0, 188, 212, 0.6)", // Reduced opacity from solid #00BCD4
      VALENCIA: "rgba(255, 193, 7, 0.6)", // Reduced opacity from solid #FFC107
      OTRAS: "rgba(245, 245, 245, 0.6)" // Reduced opacity from solid #F5F5F5
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

  // Watch for successful generation
  useEffect(() => {
    if (weeklyPlanning && !isLoading) {
      setIsLoading(false);
    }
  }, [weeklyPlanning, isLoading]);

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
    
    let mondayDate = new Date(y, m, 1);
    
    const dayOfWeek = firstDay.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday-based week
    mondayDate.setDate(1 - daysToSubtract);
    
    mondayDate.setDate(mondayDate.getDate() + weekIndex * 7);
    
    return [...Array(5)].map((_, i) => {
      const d = new Date(mondayDate);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const getValidWeeksForMonth = (y, m) => {
    const validWeeks = [];
    
    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
      const weekDays = getWeekStartDate(y, m, weekIndex);
      const friday = weekDays[4]; // Friday is index 4 (Mon=0, Tue=1, Wed=2, Thu=3, Fri=4)
      
      if (friday.getMonth() === m) {
        validWeeks.push(weekIndex);
      }
    }
    
    return validWeeks;
  };

  const days = getWeekStartDate(year, month, weekInMonth);
  const validWeeks = getValidWeeksForMonth(year, month);

  useEffect(() => {
    if (!validWeeks.includes(weekInMonth) && validWeeks.length > 0) {
      setWeekInMonth(validWeeks[0]);
    }
  }, [month, year, weekInMonth, validWeeks]);

  const getWeekStartDate7 = (y, m, weekIndex) => {
    const firstDay = new Date(y, m, 1);
    let mondayDate = new Date(y, m, 1);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    mondayDate.setDate(1 - daysToSubtract);
    mondayDate.setDate(mondayDate.getDate() + weekIndex * 7);

    return [...Array(7)].map((_, i) => {
      const d = new Date(mondayDate);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  useEffect(() => {
    const today = new Date();
    if (today.getFullYear() === year && today.getMonth() === month) {
      for (let i = 0; i < validWeeks.length; i++) {
        const weekDays = getWeekStartDate7(year, month, validWeeks[i]);
        if (weekDays.some(d =>
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        )) {
          setWeekInMonth(validWeeks[i]);
          break;
        }
      }
    }
  }, [month, year]);


  const colorMap = {
    QX: "#81C784", CONSULTA: "#FF9800", PLANTA: "#E57373", QXROBOT: "#2196F3", CERDO: "#2196F3", CARCA: "#2196F3", V: "#2196F3"
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
      colors: Array(5).fill(null),
      assignations: Array(5).fill(null),
      eveningAssignations: Array(5).fill(null),
      notValidAssignations: Array(5).fill([])
    })),
    activities: Array(5).fill(null).map(() => [
      { type: "PLANTA", color: "azul", slots: 0, time: "morning" },
      { type: "PLANTA", color: "amarillo", slots: 0, time: "morning" },
      { type: "PLANTA", color: "rojo", slots: 0, time: "morning" }
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
    dispatch(staffActions.getStaff(() => {
      // Staff loading error - could show this in UI later if needed
    }));
  }, []);

  useEffect(() => {
      dispatch(actions.getSavedWeeklyPlanning(
          getMonthName(month + 1),
          year,
          weekInMonth + 1,
          {days: days.map(d => d.getDate())},
          () => {
          }
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

        setIsLoading(true);
        
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

        var index = activePlanningIndex;
        const updatedAnnualPlanningList = [...weeklyPlanningList];
          if (updatedAnnualPlanningList.length === 0) {
            updatedAnnualPlanningList.push(dataToSend);
            index = 0
          } else {
            updatedAnnualPlanningList[activePlanningIndex] = dataToSend;
          }

        dispatch(
          actions.checkWeeklyPlanning(
            updatedAnnualPlanningList, index,
            () => {
              setPlanningStatus('valid');
              setIsLoading(false);
            },
            (errorPayload) => {
              setPlanningStatus('invalid');
              setIsLoading(false);
            }
          )
        );
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
    setPlanningStatus(null);

    const updatedDtos = emptyPlanning.weeklyPlanningDtos.map((emptyPerson) => {
      const currentPerson = planningData.weeklyPlanningDtos.find(
        (p) => p.name === emptyPerson.name
      );
      return {
        ...emptyPerson,
        colors: currentPerson?.colors || null,
      };
    });

    const updatedData = {
      ...emptyPlanning,
      weeklyPlanningDtos: updatedDtos,
      complete: false,
    };

    setPlanningData(updatedData);

    dispatch(actions.getSavedWeeklyPlanning(
          getMonthName(month + 1),
          year,
          0,
          {days: days.map(d => d.getDate())},
          () => {
          }
      ));
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
      styles: { fontSize: 10, cellPadding: 1 },
      bodyStyles: { halign: "center" }
    });
    doc.save("planificacion_semanal.pdf");
  };

  const handleGeneratePlanning = () => {
    setIsLoading(true);
    setPlanningStatus(null);
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
      setPlanningStatus('invalid');
      setIsLoading(false);
    }));
  };

  const handleConfirmPlanning = () => {
      
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
        // Save error - could show this in UI later if needed
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

      const updatedData = {
        ...prev,
        activities: updatedActivities,
      };

      setIsLoading(true);
      const dataToSend = {
        weeklyPlanningDtos: updatedData.weeklyPlanningDtos.map((p) => {
          const staffMember = staffList.find(
            (staff) => staff.name.toLowerCase() === p.name.toLowerCase()
          );
          return {
            ...p,
            level: staffMember ? staffMember.level : null,
            assignations: [...p.assignations],
            eveningAssignations: [...(p.eveningAssignations || [])],
          };
        }),
        week: weekInMonth + 1,
        month: months[month],
        year,
        days: days.map((d) => d.getDate()),
        activities: updatedData.activities,
        complete: true,
      };

      var index = activePlanningIndex;
      const updatedAnnualPlanningList = [...weeklyPlanningList];
        if (updatedAnnualPlanningList.length === 0) {
          updatedAnnualPlanningList.push(dataToSend);
          index = 0
        } else {
          updatedAnnualPlanningList[activePlanningIndex] = dataToSend;
        }

      dispatch(
        actions.checkWeeklyPlanning(
          updatedAnnualPlanningList, index,
          () => {
            setPlanningStatus("valid");
            setIsLoading(false);
          },
          (errorPayload) => {
            setPlanningStatus("invalid");
            setIsLoading(false);
          }
        )
      );
      return updatedData;
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
      if (removedActivity.type === "PLANTA" && removedActivity.color === "amarillo") {
        valuesToRemove.push("PLANTA/QX");
        prev.activities[dayIndex]
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

      const updatedData = {
        ...prev,
        activities: updatedActivities,
        weeklyPlanningDtos: updatedDtos
      };

      // Iniciar check de planificación
      setIsLoading(true);
      const dataToSend = {
        weeklyPlanningDtos: updatedData.weeklyPlanningDtos.map((p) => {
          const staffMember = staffList.find(
            (staff) => staff.name.toLowerCase() === p.name.toLowerCase()
          );
          return {
            ...p,
            level: staffMember ? staffMember.level : null,
            assignations: [...p.assignations],
            eveningAssignations: [...(p.eveningAssignations || [])],
          };
        }),
        week: weekInMonth + 1,
        month: months[month],
        year,
        days: days.map((d) => d.getDate()),
        activities: updatedData.activities,
        complete: true,
      };

      var index = activePlanningIndex;
      const updatedAnnualPlanningList = [...weeklyPlanningList];
        if (updatedAnnualPlanningList.length === 0) {
          updatedAnnualPlanningList.push(dataToSend);
          index = 0
        } else {
          updatedAnnualPlanningList[activePlanningIndex] = dataToSend;
        }

      dispatch(
        actions.checkWeeklyPlanning(
          updatedAnnualPlanningList, index,
          () => {
            setPlanningStatus("valid");
            setIsLoading(false);
          },
          () => {
            setPlanningStatus("invalid");
            setIsLoading(false);
          }
        )
      );

      return updatedData;
    });
  };

  const assignCreatedActivity = (personName, dayIndex, time, activityType, color, id) => {
    console.log("Asignando actividad:", { personName, dayIndex, time, activityType, color, id });
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

        setIsLoading(true);
        
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

        var index = activePlanningIndex;
        const updatedAnnualPlanningList = [...weeklyPlanningList];
          if (updatedAnnualPlanningList.length === 0) {
            updatedAnnualPlanningList.push(dataToSend);
            index = 0
          } else {
            updatedAnnualPlanningList[activePlanningIndex] = dataToSend;
          }

        dispatch(
          actions.checkWeeklyPlanning(updatedAnnualPlanningList, index,
          () => {
            setPlanningStatus('valid');
            setIsLoading(false);
          }, (errorPayload) => {
            setPlanningStatus('invalid');
            setIsLoading(false);
          })
        );

      return updatedData;
    });
    setEditingSlot({ personName: null, dayIndex: null, time: null });
  };

  const getCombinedPlantaQxOptions = (dayActivities, time) => {
    const floorExists = dayActivities.some(
      a => a.type === "PLANTA" && a.color === "amarillo" && a.time === time
    );

    if (!floorExists) return [];

    return dayActivities
      .filter(a => a.type === "QX" && a.color === "amarillo" && a.time === time)
      .map(qx => qx.identifier || "");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          border: '1px solid #e2e8f0', 
          padding: '24px', 
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          marginTop: '4px'
        }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              background: '#ffffff',
              padding: '12px 16px',
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0',
              flexWrap: 'wrap'
            }}>
              <label style={{ color: "#374151", fontWeight: "600", fontSize: "16px" }}>Año:</label>
              <input 
                type="number" 
                value={year} 
                min={2000} 
                max={2100} 
                onChange={(e) => setYear(Number(e.target.value))} 
                style={{
                  padding: '8px 12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  width: '80px',
                  background: '#ffffff'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <label style={{ color: "#374151", fontWeight: "600", fontSize: "16px" }}>Mes:</label>
              <select 
                value={month} 
                onChange={(e) => setMonth(Number(e.target.value))} 
                style={{
                  padding: '8px 12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  background: '#ffffff',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              >
                {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <label style={{ color: "#374151", fontWeight: "600", fontSize: "16px" }}>Semana:</label>
              <select 
                value={weekInMonth} 
                onChange={(e) => setWeekInMonth(Number(e.target.value))} 
                style={{
                  padding: '8px 12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  background: '#ffffff',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              >
                {validWeeks.map(i => <option key={i} value={i}>{`Semana ${i + 1}`}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                  onClick={handleGeneratePlanning}
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                    boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 12px -1px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.3)';
                  }}
                >
                  ⚡ Generar Planificación
                </button>
              <button
                onClick={exportToPDF}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                  boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.3)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 12px -1px rgba(16, 185, 129, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(16, 185, 129, 0.3)';
                }}
                >
                📄 Exportar a PDF
                </button>
              <button
                  onClick={handleClearPlanning}
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                    boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.3)",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 12px -1px rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(239, 68, 68, 0.3)';
                  }}
                >
                🗑️ Vaciar Planificación
                </button>
            </div>
            {weeklyPlanningList.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <button
                  onClick={goToPrevPlanning}
                  style={{
                    padding: "10px 14px",
                    background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ◀
                </button>
                <span style={{ 
                  fontWeight: "700", 
                  color: "#374151",
                  background: "#f3f4f6",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}>
                  Planning {activePlanningIndex + 1} de {weeklyPlanningList.length}
                </span>
                <button
                  onClick={goToNextPlanning}
                  style={{
                    padding: "10px 14px",
                    background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ▶
                </button>
                <button
                  onClick={handleConfirmPlanning}
                  style={{
                    padding: "10px 20px",
                    background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "16px",
                    boxShadow: "0 4px 6px -1px rgba(6, 182, 212, 0.3)",
                    transition: "all 0.2s ease",
                    marginLeft: "12px"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 12px -1px rgba(6, 182, 212, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(6, 182, 212, 0.3)';
                  }}
                >
                  ✓ Confirmar plan
                </button>
              </div>
            )}

            {/* Status Icon */}
            {planningStatus && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: planningStatus === 'valid' ? '#10b981' : '#ef4444',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                marginLeft: 'auto'
              }}>
                <span style={{
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  {planningStatus === 'valid' ? '✓' : '✗'}
                </span>
              </div>
            )}

          </div>
          
          {/* Crear nueva actividad section - moved above table */}
          <div style={{ 
            marginTop: '24px', 
            marginBottom: '24px',
            border: '1px solid #e2e8f0', 
            padding: '20px', 
            borderRadius: '12px', 
            background: '#ffffff', 
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <h4 style={{ fontWeight: '700', marginBottom: '16px', color: '#374151', fontSize: '18px' }}>✨ Crear nueva actividad</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
              {/* Día */}
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                Día:
                <select
                  value={newActivity.dayIndex}
                  onChange={(e) =>
                    setNewActivity((prev) => ({
                      ...prev,
                      dayIndex: Number(e.target.value),
                    }))
                  }
                  style={{
                    padding: '8px 12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    background: '#ffffff',
                    cursor: 'pointer',
                    minWidth: '120px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                  {days.map((d, i) => <option key={i} value={i}>{d.toLocaleDateString("es-ES", { weekday: "long" })}</option>)}
                </select>
              </label>

              {/* Turno */}
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                Turno:
                <select
                  value={newActivity.time}
                  onChange={(e) =>
                    setNewActivity((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                  style={{
                    padding: '8px 12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    background: '#ffffff',
                    cursor: 'pointer',
                    minWidth: '120px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                  <option value="morning">Mañana</option>
                  <option value="evening">Tarde</option>
                </select>
              </label>

              {/* Tipo */}
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                Tipo:
                <select
                  value={newActivity.type}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setNewActivity((prev) => ({
                      ...prev,
                      type: selected,
                      color: selected === "QX" ? "amarillo" : null,
                    }));
                  }}
                  style={{
                    padding: '8px 12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    background: '#ffffff',
                    cursor: 'pointer',
                    minWidth: '150px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="QX">QX</option>
                  <option value="CONSULTA">CONSULTA</option>
                  <option value="CARCA">CARCA</option>
                  <option value="PLANTA">PLANTA</option>
                  <option value="CERDO">CERDO</option>
                  <option value="QXROBOT">QXROBOT</option>
                </select>
              </label>

              {/* Color (solo para QX) */}
              {newActivity.type === "QX" && (
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  Color:
                  <select
                    value={newActivity.color}
                    onChange={(e) =>
                      setNewActivity((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    style={{
                      padding: '8px 12px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff',
                      cursor: 'pointer',
                      minWidth: '120px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="amarillo">Amarillo</option>
                    <option value="azul">Azul</option>
                    <option value="rojo">Rojo</option>
                  </select>
                </label>
              )}

              {/* Identificador (solo para QX) */}
              {newActivity.type === "QX" && (
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                    style={{
                      padding: '8px 12px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#ffffff',
                      width: '120px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    placeholder="Opcional"
                  />
                </label>
              )}

              {/* Slots */}
              {newActivity.type === "QX" && (
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                  style={{
                    padding: '8px 12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    background: '#ffffff',
                    width: '80px'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </label>
              )}

              {/* Botón crear */}
              <button
                onClick={handleAddCustomActivity}
                disabled={!newActivity.type}
                style={{
                  padding: "10px 20px",
                  background: !newActivity.type 
                    ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                    : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: !newActivity.type ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s ease",
                  opacity: !newActivity.type ? 0.7 : 1
                }}
                onMouseOver={(e) => {
                  if (newActivity.type) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseOut={(e) => {
                  if (newActivity.type) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                ✨ Crear
              </button>

            </div>
          </div>
          
          {isLoading && <div className="loader"></div>}
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
                  // Use first day color for person's name cell
                  const nameColor = colorPersonMap[person.colors && person.colors[0] ? person.colors[0] : null] || "#fff";
                  return(
                  <tr key={person.name}>
                    <td className="font-medium" style={{ 
                      backgroundColor: nameColor, 
                      width: '120px', 
                      maxWidth: '120px', 
                      minWidth: '80px',
                      whiteSpace: 'nowrap', 
                      fontSize: '1rem',
                      padding: '8px 4px'
                    }}>{person.name}</td>
                    {person.assignations.map((_, idx) => {
                      const morningActivity = person.assignations[idx];
                      const eveningActivity = person.eveningAssignations?.[idx] || null;
                      const dayActivities = planningData.activities[idx] || [];
                      
                      // Use day-specific color for this cell
                      const dayColor = colorPersonMap[person.colors && person.colors[idx] ? person.colors[idx] : null] || "#fff";

                      const filteredMorning = [
                        ...dayActivities.filter((a) => a.time === "morning"),
                        { type: "V", color: null, slots: 0, time: "morning" }
                      ];

                      const filteredEvening = [
                        ...dayActivities.filter((a) => a.time === "evening"),
                        { type: "V", color: null, slots: 0, time: "evening" }
                      ];

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
                                      ? (() => {
                                          const parts = (morningActivity || "").split("_");
                                          return parts.length === 3 ? `${parts[0]}_${parts[2]}` : parts[0];
                                        })()
                                      : (morningActivity || "").split("_")[0]
                                }
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
                                  } else if (type === "QX") {
                                    selected = filteredMorning.find(
                                      (a) => a.type === "QX" && !a.identifier
                                    );
                                  }
                                  else if (type === "PLANTA/QX") {
                                    selected = filteredMorning.find(
                                      (a) => a.type === type
                                    );
                                  }
                                  else if (type === "PLANTA") {
                                    const selectedIndex = e.target.selectedIndex - 1;
                                    selected = filteredMorning[selectedIndex];
                                  } else {
                                    selected = filteredMorning.find((a) => a.type === type);
                                    typeSelected = type;
                                    idSelected = selected?.identifier;
                                  }
                                  console.log({selectedActivity, type, id, selected, typeSelected, idSelected});
                                  assignCreatedActivity(person.name, idx, "morning", typeSelected, selected?.color, idSelected);
                                }}
                                style={{
                                  backgroundColor: dayColor,
                                  border: "none",
                                  width: "100%",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  fontSize: "1rem",
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
                                      typeSelected = type;
                                      idSelected = selected?.identifier
                                    }
                                    assignCreatedActivity(person.name, idx, "evening", typeSelected, selected?.color, idSelected);
                                }}
                                style={{
                                  backgroundColor: dayColor,
                                  border: "none",
                                  width: "100%",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                  cursor: "pointer",
                                }}
                              >
                                <option value="">-</option>
                                <>
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
                              fontSize: "12px",
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
                                fontSize: "12px",
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
          </div>
        </div>
    </div>
  );
};

export default WeeklyPlanning;
