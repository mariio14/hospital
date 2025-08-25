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
    const annualPlanningList = useSelector(selectors.getAnnualPlanningList);
    const staffList = useSelector(staffSelectors.getStaffList);

    const emptyPlanning = {
      assignations: staffList.map(person => ({
            name: person.name,
            level: `R${person.level}`,
            assignations: Array(12).fill(null)
          })),
      complete: false
    }

    const [planningData, setPlanningData] = useState(emptyPlanning);
    const [backendErrors, setBackendErrors] = useState(null);
     const [isLoading, setIsLoading] = useState(false);
     const currentYear = new Date().getFullYear();
     const [year, setYear] = useState(currentYear);
     const [activePlanningIndex, setActivePlanningIndex] = useState(0);
     const [draggedCell, setDraggedCell] = useState(null);

    useEffect(() => {
      if (annualPlanningList && annualPlanningList.length > 0) {
        setPlanningData(annualPlanningList[activePlanningIndex] || emptyPlanning);
        setBackendErrors(null);
      }
    }, [activePlanningIndex, annualPlanningList]);

    const goToNextPlanning = () => {
      setActivePlanningIndex((prev) =>
        prev < annualPlanningList.length - 1 ? prev + 1 : 0
      );
    };

    const goToPrevPlanning = () => {
      setActivePlanningIndex((prev) =>
        prev > 0 ? prev - 1 : annualPlanningList.length - 1
      );
    };

    useEffect(() => {
        dispatch(staffActions.getStaff(
            () => setBackendErrors('No se ha podido obtener la lista de usuarios')
        ));
    }, []);

    useEffect(() => {
      if (annualPlanning) {
        const planning = { ...annualPlanning };

        planning.assignations = planning.assignations.map(person => {
          if (!person.assignations || Object.keys(person.assignations).length === 0) {
            return { ...person, assignations: Array(12).fill(null) };
          }
          return person;
        });

        setPlanningData(planning);
      } else {
        setPlanningData(emptyPlanning);
      }

      setIsLoading(false);
    }, [annualPlanning]);

    const handleGeneratePlanning = () => {
        setBackendErrors(null);
        setIsLoading(true);
        const convertedPlanningData = {
            assignations : planningData.assignations.map(person => ({
                ...person,
                assignations: Object.values(person.assignations)
            }))
        }

        dispatch(actions.getAnnualPlanning(
            convertedPlanningData,
            year,
            () => {
                setBackendErrors('Sin solución');
                setIsLoading(false);
            }
        ));
    };

    const handleConfirmPlanning = () => {
      setBackendErrors(null);
      const convertedPlanningData = {
        assignations: planningData.assignations.map(person => ({
          ...person,
          assignations: Object.values(person.assignations)
        })),
        complete: true
      }
      dispatch(actions.saveYearlyPlanning(convertedPlanningData, year,
        (errorPayload) => {
        const message = errorPayload?.globalError || "Ha ocurrido un error";
        setBackendErrors(message);
        setIsLoading(false);
      }));
    };

    const handleDragStart = (personName, monthIndex) => {
      setDraggedCell({ personName, monthIndex });
    };

    const handleDrop = (targetPersonName, targetMonthIndex) => {
      if (!draggedCell) return;

      setPlanningData((prevPlanning) => {
        const updated = {
          ...prevPlanning,
          assignations: prevPlanning.assignations.map((person) => ({
            ...person,
            assignations: {...person.assignations}
          }))
        };

        const sourcePersonIndex = updated.assignations.findIndex(
          (p) => p.name === draggedCell.personName
        );
        const targetPersonIndex = updated.assignations.findIndex(
          (p) => p.name === targetPersonName
        );

        const sourceValue = updated.assignations[sourcePersonIndex].assignations[draggedCell.monthIndex];
        const targetValue = updated.assignations[targetPersonIndex].assignations[targetMonthIndex];

        updated.assignations[sourcePersonIndex].assignations[draggedCell.monthIndex] = targetValue;
        updated.assignations[targetPersonIndex].assignations[targetMonthIndex] = sourceValue;

        if (updated.complete) {
          setIsLoading(true);
          setBackendErrors(null);
          const convertedPlanningData = {
            assignations: updated.assignations.map((person) => ({
              ...person,
              assignations: Object.values(person.assignations)
            })),
            complete: true
          };

          dispatch(
            actions.checkAnnualPlanning(
              convertedPlanningData,
              year,
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
      e.preventDefault(); // Necesario para permitir el drop
    };

    useEffect(() => {
        const convertedPlanningData = {
            assignations: planningData.assignations.map(person => ({
                ...person,
                assignations: Object.values(person.assignations)
            }))
        }
        dispatch(actions.getSavedAnnualPlanning(
            convertedPlanningData,
            year,
            () => setBackendErrors("No se ha podido cargar la planificación guardada."),
            emptyPlanning
        ));
    }, [year]);

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
      setPlanningData((prevPlanning) => {
        const updatedPlanning = {
          ...prevPlanning,
          assignations: prevPlanning.assignations.map((person) => {
            if (person.name === personName) {
              return {
                ...person,
                assignations: Object.keys(person.assignations).reduce((acc, key) => {
                  if (months[key] === month) {
                    acc[key] = value === "-" ? null : value;
                  } else {
                    acc[key] = person.assignations[key];
                  }
                  return acc;
                }, Array.isArray(person.assignations) ? [] : {}), // soporta array u objeto
              };
            }
            return person;
          }),
        };

        if (updatedPlanning.complete) {
            setIsLoading(true);
            setBackendErrors(null);
            const convertedPlanningData = {
                assignations : updatedPlanning.assignations.map(person => ({
                    ...person,
                    assignations: Object.values(person.assignations)
                })),
                complete: true
            }

            dispatch(actions.checkAnnualPlanning(
                convertedPlanningData,
                year,
                () => {
                  setBackendErrors(null);
                  setIsLoading(false);
                }, (errorPayload) => {
                  const message = errorPayload?.globalError || "Ha ocurrido un error";
                  setBackendErrors(message);
                  setIsLoading(false);
                })
            );
        } else {
          setBackendErrors(null);
        }


        return updatedPlanning;
      });
    };

    const exportToPDF = () => {
        const doc = new jsPDF({ orientation: "landscape" });
        doc.text("Planificación Anual", 10, 10);

        const tableData = (annualPlanning ? annualPlanning : planningData).assignations.map((person) => {
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
                <div style={{ 
                    border: '1px solid #e2e8f0', 
                    padding: '24px', 
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
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
                          fontSize: "14px",
                          minWidth: "40px"
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
                                    fontSize: "14px",
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
                                    fontSize: "14px",
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
                                    fontSize: "14px",
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
                    </div>
                    {annualPlanningList.length > 1 && (
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
                          fontSize: "14px"
                        }}>
                          Planning {activePlanningIndex + 1} de {annualPlanningList.length}
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
                            fontSize: "14px",
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
                    {isLoading && <div className="loader"></div>}
                    {backendErrors ? <p style={{ color: 'red', textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>{backendErrors}</p> : null}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        {/* Tabla de asignaciones */}
                        <table style={{ width: '100%', tableLayout: 'fixed', fontSize: '12px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '4px 6px' }}>{year}</th>
                                    {months.map((month) => (
                                        <th key={month} style={{ padding: '4px 6px', whiteSpace: 'nowrap' }}>{month}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {planningData.assignations.map((person) => (
                                    <tr
                                        key={person.name}
                                        style={{
                                            backgroundColor: "#E0E0E0",
                                            color: "#000"
                                        }}
                                    >
                                        <td style={{ padding: '4px 6px', whiteSpace: 'nowrap' }}>{person.name}</td>
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
                                                    cursor: "grab",
                                                    padding: '8px 16px',
                                                    height: '28px',
                                                  }}
                                                  title={activity || "Sin asignación"}
                                                  draggable // Permite arrastrar
                                                  onDragStart={() => handleDragStart(person.name, index)}
                                                  onDrop={() => handleDrop(person.name, index)}
                                                  onDragOver={handleDragOver}
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
            </div>
        </div>
    );
};


export default AnnualPlanning;
