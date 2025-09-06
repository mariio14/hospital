import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as actions from "../actions";
import * as staffActions from "../../staff/actions"
import * as selectors from "../selectors";
import * as staffSelectors from "../../staff/selectors"
import "../../../styles/MonthlyPlanning.css";

const MonthlyPlanning = () => {

  const dispatch = useDispatch();
  const staffList = useSelector(staffSelectors.getStaffList);
  const monthlyPlanning = useSelector(selectors.getMonthlyPlanning);
  const monthlyPlanningList = useSelector(selectors.getMonthlyPlanningList);

  const [isLoading, setIsLoading] = useState(false);
  const [planningStatus, setPlanningStatus] = useState(null); // 'valid', 'invalid', or null

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(month, year));

  const getPreviousMonthDays = (month, year) => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    return new Date(prevYear, prevMonth, 0).getDate();
  };
  const [daysInPrevMonth, setDaysInPrevMonth] = useState(getPreviousMonthDays(month, year));

  const [rightClickData, setRightClickData] = useState(null);
  const prohibitedMenuRef = useRef(null);
  const [activePlanningIndex, setActivePlanningIndex] = useState(0);
  const [draggedCell, setDraggedCell] = useState(null);


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
      assignations: Array(daysInMonth).fill(null),
      notValidAssignations: Array(daysInMonth).fill([])
    })),
    complete: false
  };

  useEffect(() => {
    if (monthlyPlanningList && monthlyPlanningList.length > 0) {
      setPlanningData(monthlyPlanningList[activePlanningIndex] || emptyPlanning);
      
      setIsLoading(false);
      setPlanningStatus(null); // Reset status when changing planning
    }
  }, [activePlanningIndex, monthlyPlanningList]);

  // Watch for successful generation
  useEffect(() => {
    if (monthlyPlanning && !isLoading) {
      setIsLoading(false);
    }
  }, [monthlyPlanning, isLoading]);

  const goToNextPlanning = () => {
      setActivePlanningIndex((prev) =>
        prev < monthlyPlanningList.length - 1 ? prev + 1 : 0
      );
    };

    const goToPrevPlanning = () => {
      setActivePlanningIndex((prev) =>
        prev > 0 ? prev - 1 : monthlyPlanningList.length - 1
      );
    };

  const [planningData, setPlanningData] = useState(emptyPlanning);

  useEffect(() => {
      dispatch(staffActions.getStaff(() => {
        // Staff loading error - could show this in UI later if needed
      }));
  }, []);

  useEffect(() => {
    const numDays = getDaysInMonth(month, year);
    setDaysInMonth(numDays);

    dispatch(actions.getSavedMonthlyPlanning(
        getMonthName(month),
        year,
        numDays,
        () => {
          // Loading error - could show this in UI later if needed
        }
    ));
  }, [month, year]);

  useEffect(() => {
      setPlanningData(monthlyPlanning ? monthlyPlanning : emptyPlanning);
      setIsLoading(false);
  }, [monthlyPlanning]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (prohibitedMenuRef.current && !prohibitedMenuRef.current.contains(event.target)) {
          setRightClickData(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

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

  const activities_real = activities;

  const handleSelectChange = (personName, dayIndex, value) => {
    setPlanningData((prevPlanning) => {
      const updatedData = {
        ...prevPlanning,
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
      };

        setIsLoading(true);
        
        let firstFriday = 1;
        while (new Date(year, month - 1, firstFriday).getDay() !== 5) {
            firstFriday++;
        }

        const convertedPlanningData = {
            monthlyPlanningDtos: updatedData.monthlyPlanningDtos.map(person => {
                const staffMember = staffList.find(staff => staff.name.toLowerCase() === person.name.toLowerCase());

                return {
                    ...person,
                    assignations: Object.values(person.assignations),
                    notValidAssignations: Object.values(person.notValidAssignations),
                    level: staffMember ? staffMember.level : null
                };
            }),
            numberOfDays: daysInMonth,
            numberOfDaysPrevMonth: daysInPrevMonth,
            month: getMonthName(month),
            year: year,
            firstDay: getDayOfWeek(1,month,year),
            firstFriday: firstFriday,
            weekends: [],
            festivos: [],
            complete: true
        }

        dispatch(actions.checkMonthlyPlanning(convertedPlanningData,
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
  };

  const handleDragStart = (personName, monthIndex) => {
    setDraggedCell({ personName, monthIndex });
  };

  const handleDrop = (targetPersonName, targetMonthIndex) => {
    if (!draggedCell) return;

    setPlanningData((prevPlanning) => {
      const updated = {
        ...prevPlanning,
        monthlyPlanningDtos: prevPlanning.monthlyPlanningDtos.map((person) => ({
          ...person,
          notValidAssignations: {...person.notValidAssignations},
          assignations: {...person.assignations}
        })),
      };

      const sourcePersonIndex = updated.monthlyPlanningDtos.findIndex(
        (p) => p.name === draggedCell.personName
      );
      const targetPersonIndex = updated.monthlyPlanningDtos.findIndex(
        (p) => p.name === targetPersonName
      );

      const sourceValue = updated.monthlyPlanningDtos[sourcePersonIndex].assignations[draggedCell.monthIndex];
      const targetValue = updated.monthlyPlanningDtos[targetPersonIndex].assignations[targetMonthIndex];

      updated.monthlyPlanningDtos[sourcePersonIndex].assignations[draggedCell.monthIndex] = targetValue;
      updated.monthlyPlanningDtos[targetPersonIndex].assignations[targetMonthIndex] = sourceValue;

      setIsLoading(true);
      
      let firstFriday = 1;
      while (new Date(year, month - 1, firstFriday).getDay() !== 5) {
          firstFriday++;
      }

      const convertedPlanningData = {
          monthlyPlanningDtos: updated.monthlyPlanningDtos.map(person => {
              const staffMember = staffList.find(staff => staff.name.toLowerCase() === person.name.toLowerCase());

              return {
                  ...person,
                  assignations: Object.values(person.assignations),
                  notValidAssignations: Object.values(person.notValidAssignations),
                  level: staffMember ? staffMember.level : null
              };
          }),
          numberOfDays: daysInMonth,
          numberOfDaysPrevMonth: daysInPrevMonth,
          month: getMonthName(month),
          year: year,
          firstDay: getDayOfWeek(1,month,year),
          firstFriday: firstFriday,
          weekends: [],
          festivos: [],
          complete: true
      }

      dispatch(actions.checkMonthlyPlanning(convertedPlanningData,
          () => {
            setPlanningStatus('valid');
            setIsLoading(false);
          }, (errorPayload) => {
            setPlanningStatus('invalid');
            setIsLoading(false);
          })
        );

      return updated;
    });

    setDraggedCell(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necesario para permitir el drop
  };

  const toggleNotValidActivity = (personName, dayIndex, activity) => {
    setPlanningData(prev => ({
      ...prev,
      monthlyPlanningDtos: prev.monthlyPlanningDtos.map(person => {
        if (person.name !== personName) return person;
        const currentProhibited = person.notValidAssignations[dayIndex] || [];
        const updatedProhibited = currentProhibited.includes(activity)
          ? currentProhibited.filter(act => act !== activity)
          : [...currentProhibited, activity];
        const newNotValidAssignations = [...person.notValidAssignations];
        newNotValidAssignations[dayIndex] = updatedProhibited;
        return { ...person, notValidAssignations: newNotValidAssignations };
      })
    }));
  };

    const prohibitAllActivities = (personName, dayIndex) => {
      setPlanningData((prev) => ({
        ...prev,
        monthlyPlanningDtos: prev.monthlyPlanningDtos.map((person) => {
          if (person.name !== personName) return person;
          const allActivities = activities.filter(activity => activity !== "GP");
          const updatedProhibited = [...allActivities];
          const newNotValidAssignations = [...person.notValidAssignations];
          newNotValidAssignations[dayIndex] = updatedProhibited;
          return { ...person, notValidAssignations: newNotValidAssignations };
        }),
      }));
    };

    const toggleProhibitAll = (personName, dayIndex) => {
      const currentPerson = planningData.monthlyPlanningDtos.find(
        (person) => person.name === personName
      );

      // Comprobamos si todas las actividades (excepto "GP") están prohibidas
      const isAllProhibited =
        activities.filter((activity) => activity !== "GP").every((activity) =>
          currentPerson.notValidAssignations[dayIndex]?.includes(activity)
        );

      // Si todas las actividades están prohibidas, las desmarcamos
      if (isAllProhibited) {
        setPlanningData((prev) => ({
          ...prev,
          monthlyPlanningDtos: prev.monthlyPlanningDtos.map((person) => {
            if (person.name !== personName) return person;
            const newNotValidAssignations = [...person.notValidAssignations];
            newNotValidAssignations[dayIndex] = []; // Desmarcamos todas las actividades
            return {
              ...person,
              notValidAssignations: newNotValidAssignations,
            };
          }),
        }));
      } else {
        // Si no todas las actividades están prohibidas, las marcamos como prohibidas
        setPlanningData((prev) => ({
          ...prev,
          monthlyPlanningDtos: prev.monthlyPlanningDtos.map((person) => {
            if (person.name !== personName) return person;
            const newNotValidAssignations = [...person.notValidAssignations];
            newNotValidAssignations[dayIndex] = activities.filter(
              (activity) => activity !== "GP"
            ); // Marcamos todas las actividades como prohibidas (excepto "GP")
            return {
              ...person,
              notValidAssignations: newNotValidAssignations,
            };
          }),
        }));
      }
    };

    const isActivityFullyProhibitedInMonth = (personName, activity) => {
      const person = planningData.monthlyPlanningDtos.find(p => p.name === personName);
      if (!person) return false;
      return person.notValidAssignations.every(dayList => dayList.includes(activity));
    };

    const isAllActivitiesProhibitedInMonth = (personName) => {
      const person = planningData.monthlyPlanningDtos.find(p => p.name === personName);
      if (!person) return false;
      return person.notValidAssignations.every(
        (dayList) =>
          activities_real.every((act) => dayList.includes(act))
      );
    };

    const toggleActivityForFullMonth = (personName, activity) => {
      const person = planningData.monthlyPlanningDtos.find(p => p.name === personName);
      if (!person) return;

      const currentlyProhibited = isActivityFullyProhibitedInMonth(personName, activity);

      setPlanningData(prev => ({
        ...prev,
        monthlyPlanningDtos: prev.monthlyPlanningDtos.map(p => {
          if (p.name !== personName) return p;
          const newNotValidAssignations = p.notValidAssignations.map(dayList => {
            const filtered = currentlyProhibited
              ? dayList.filter(a => a !== activity) // desmarcar
              : [...new Set([...dayList, activity])]; // marcar
            return filtered;
          });
          return { ...p, notValidAssignations: newNotValidAssignations };
        })
      }));
    };

    const toggleProhibitAllMonth = (personName) => {
      const currentlyAllProhibited = isAllActivitiesProhibitedInMonth(personName);

      setPlanningData(prev => ({
        ...prev,
        monthlyPlanningDtos: prev.monthlyPlanningDtos.map(person => {
          if (person.name !== personName) return person;

          const newNotValidAssignations = person.notValidAssignations.map(() =>
            currentlyAllProhibited ? [] : [...activities_real]
          );

          return {
            ...person,
            notValidAssignations: newNotValidAssignations
          };
        })
      }));
    };

  const handleGeneratePlanning = () => {
    
    setPlanningStatus(null);
    setIsLoading(true);

    let firstFriday = 1;
    while (new Date(year, month - 1, firstFriday).getDay() !== 5) {
        firstFriday++;
    }

    const convertedPlanningData = {
        monthlyPlanningDtos: planningData.monthlyPlanningDtos.map(person => {
            const staffMember = staffList.find(staff => staff.name.toLowerCase() === person.name.toLowerCase());

            return {
                ...person,
                assignations: Object.values(person.assignations),
                notValidAssignations: Object.values(person.notValidAssignations),
                level: staffMember ? staffMember.level : null
            };
        }),
        numberOfDays: daysInMonth,
        numberOfDaysPrevMonth: daysInPrevMonth,
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
            setPlanningStatus('invalid');
            setIsLoading(false);
        }
    ));

  };

  const handleConfirmPlanning = () => {
    
    setPlanningStatus(null);
    let firstFriday = 1;
    while (new Date(year, month - 1, firstFriday).getDay() !== 5) {
        firstFriday++;
    }

    const convertedPlanningData = {
        monthlyPlanningDtos: planningData.monthlyPlanningDtos.map(person => {
            const staffMember = staffList.find(staff => staff.name.toLowerCase() === person.name.toLowerCase());

            return {
                ...person,
                assignations: Object.values(person.assignations),
                notValidAssignations: Object.values(person.notValidAssignations),
                level: staffMember ? staffMember.level : null
            };
        }),
        numberOfDays: daysInMonth,
        numberOfDaysPrevMonth: daysInPrevMonth,
        month: getMonthName(month),
        year: year,
        firstDay: getDayOfWeek(1,month,year),
        firstFriday: firstFriday,
        weekends: [],
        festivos: [],
        complete: true
    }
    dispatch(actions.saveMonthlyPlanning(convertedPlanningData, (errorPayload) => {
      // Save error - could show this in UI later if needed
      setIsLoading(false);
    }));
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
      styles: { fontSize: 10, cellPadding: 1 },
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
    
    setIsLoading(false);
    setPlanningData(emptyPlanning);
    dispatch(actions.getMonthlyClear(emptyPlanning));
  };

  const handleMonthChange = (event) => {
    setMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event) => {
    setYear(parseInt(event.target.value));
  };

  const handleRightClick = (e, personName, dayIndex) => {
    e.preventDefault();
    setRightClickData({ x: e.pageX, y: e.pageY, personName, dayIndex });
  };

  const isAllProhibited = (personName, dayIndex) => {
    const currentPerson = planningData.monthlyPlanningDtos.find(
      (person) => person.name === personName
    );
    return (
      currentPerson &&
      activities.filter((activity) => activity !== "GP").every((activity) =>
        currentPerson.notValidAssignations[dayIndex]?.includes(activity)
      )
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ width: "100%" }}>
          <div
            style={{
              border: "1px solid #e2e8f0",
              padding: "24px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}
          >
            {/* Botones de acciones */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "16px"
              }}
            >
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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

              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px",
                background: '#ffffff',
                padding: '12px 16px',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0'
              }}>
                <label style={{ 
                  color: "#374151", 
                  fontWeight: "600", 
                  fontSize: "16px"
                }}>Mes:</label>
                <select 
                  value={month} 
                  onChange={handleMonthChange}
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
                  {[...Array(12).keys()].map((m) => (
                    <option key={m + 1} value={m + 1}>{new Date(0, m).toLocaleString('es-ES', { month: 'long' })}</option>
                  ))}
                </select>
                <label style={{ 
                  color: "#374151", 
                  fontWeight: "600", 
                  fontSize: "16px"
                }}>Año:</label>
                <input 
                  type="number" 
                  value={year} 
                  onChange={handleYearChange} 
                  min="2000" 
                  max="2100"
                  style={{
                    padding: '8px 12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    width: '100px',
                    background: '#ffffff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>
            {monthlyPlanningList.length > 1 && (
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
                  Planning {activePlanningIndex + 1} de {monthlyPlanningList.length}
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

            {isLoading && <div className="loader"></div>}

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
                  style={{ width: "100%", tableLayout: "fixed", fontSize: "14px" }}
                >
                  <thead>
                      <tr>
                        <th style={{ width: "150px", minWidth: "150px" }}></th>
                        {[...Array(daysInMonth).keys()].map((day) => (
                          <th key={day + 1}>{getDayOfWeek(day + 1, month, year)}</th>
                        ))}
                      </tr>
                      <tr>
                        <th style={{ width: "150px", minWidth: "150px" }}>{getMonthName(month)}</th>
                        {[...Array(daysInMonth).keys()].map((day) => (
                          <th key={day + 1}>{day + 1}</th>
                        ))}
                      </tr>
                    </thead>
                  <tbody>
                    {planningData.monthlyPlanningDtos.map((person) => (
                      <tr key={person.name}>
                        <td
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setRightClickData({ x: e.pageX, y: e.pageY, personName: person.name, isRow: true });
                          }}
                          style={{
                            backgroundColor: "#E0E0E0",
                            color: "#000",
                            textAlign: "center",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {person.name}
                        </td>
                        {Object.entries(person.assignations).map(([dayIndex, activity]) => {
                          const prohibitedActivities = person.notValidAssignations[dayIndex] || [];
                          const availableActivities = activities.filter(
                            (activity) => !prohibitedActivities.includes(activity)
                          );
                          return (
                            <td
                              key={`${person.name}-${dayIndex}`}
                              style={{
                                backgroundColor: colorMap[activity] || "#E0E0E0",
                                color: "#000",
                                textAlign: "center",
                                fontWeight: "bold",
                                cursor: "grab",
                              }}
                              onContextMenu={(e) => handleRightClick(e, person.name, Number(dayIndex))}
                              title={activity || "Sin asignación"}
                              draggable
                              onDragStart={() => handleDragStart(person.name, dayIndex)}
                              onDrop={() => handleDrop(person.name, dayIndex)}
                              onDragOver={handleDragOver}
                            >
                              {rightClickData && (
                                <div
                                  ref={prohibitedMenuRef}
                                  style={{
                                    position: "absolute",
                                    top: rightClickData.y,
                                    left: rightClickData.x,
                                    backgroundColor: "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    padding: "10px",
                                    zIndex: 1000,
                                  }}
                                >
                                  {activities_real.map((activity) => (
                                    <div key={activity}>
                                      <input
                                        type="checkbox"
                                        checked={
                                          rightClickData.isRow
                                            ? isActivityFullyProhibitedInMonth(rightClickData.personName, activity)
                                            : planningData.monthlyPlanningDtos
                                                .find(p => p.name === rightClickData.personName)
                                                ?.notValidAssignations[rightClickData.dayIndex]
                                                ?.includes(activity)
                                        }
                                        onChange={() => {
                                          if (rightClickData.isRow) {
                                            toggleActivityForFullMonth(rightClickData.personName, activity);
                                          } else {
                                            toggleNotValidActivity(
                                              rightClickData.personName,
                                              rightClickData.dayIndex,
                                              activity
                                            );
                                          }
                                        }}
                                      />
                                      <label style={{ marginLeft: "5px" }}>{activity}</label>
                                    </div>
                                  ))}
                                    <div>
                                      {rightClickData.isRow ? (
                                        <>
                                          <input
                                            type="checkbox"
                                            checked={isAllActivitiesProhibitedInMonth(rightClickData.personName)}
                                            onChange={() =>
                                              toggleProhibitAllMonth(rightClickData.personName)
                                            }
                                          />
                                          <label style={{ marginLeft: "5px" }}>Prohibir todas</label>
                                        </>
                                      ) : (
                                        <>
                                          <input
                                            type="checkbox"
                                            checked={isAllProhibited(rightClickData.personName, rightClickData.dayIndex)}
                                            onChange={() =>
                                              toggleProhibitAll(rightClickData.personName, rightClickData.dayIndex)
                                            }
                                          />
                                          <label style={{ marginLeft: "5px" }}>Prohibir todas</label>
                                        </>
                                      )}
                                    </div>
                                  <button onClick={() => setRightClickData(null)}>Cerrar</button>
                                </div>
                              )}
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
                                {availableActivities.map((act) => (
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
      </div>
    </div>
  );
};

export default MonthlyPlanning;
