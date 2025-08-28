import { useDispatch, useSelector } from "react-redux";
import * as actions from "../actions";
import * as selectors from "../selectors";
import React, { useState, useEffect, useRef } from "react";

const PrioritiesList = () => {
    const dispatch = useDispatch();
    const initialPriorities = useSelector(selectors.getPrioritiesList);
    const [priorities, setPriorities] = useState(initialPriorities);
    const [backendErrors, setBackendErrors] = useState(null);
    const prioritiesRef = useRef(priorities);

    useEffect(() => {
        dispatch(actions.getPriorities(
            () => setBackendErrors('No se ha podido devolver la lista de prioridades')
        ));
    }, [dispatch]);

    useEffect(() => {
        prioritiesRef.current = priorities;
    }, [priorities]);

    useEffect(() => {
        setPriorities(initialPriorities);
    }, [initialPriorities]);

    useEffect(() => {
        return () => {
            dispatch(actions.modifyPriorities(
                prioritiesRef.current,
                () => setBackendErrors('Ha ocurrido un error')
            ));
        };
    }, []);

    const handleCostChange = (priorityId, newCost) => {
        setPriorities(prevPriorities =>
            prevPriorities.map(group => ({
                ...group,
                priorities: group.priorities.map(priority =>
                    priority.id === priorityId ? { ...priority, cost: newCost } : priority
                )
            }))
        );
    };

    const handlePutOriginal = (groupType) => {
        console.log("Enviando al backend:", groupType);
        dispatch(actions.originalPriorities(
        groupType,
        result => dispatch(actions.getPriorities()),
        () => setBackendErrors('Ha ocurrido un error')
        ));
    };

    return (
        <div 
            style={{
                padding: '2rem',
                minHeight: '100vh',
                backgroundColor: '#f8fafc'
            }}
        >
            {/* Header */}
            <div 
                style={{
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}
            >
                <h1
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center', // centra horizontalmente
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    marginBottom: '0.5rem',
                    gap: '0.5rem', // espacio entre emoji y texto
                    letterSpacing: '-0.025em'
                  }}
                >
                  <span>⚖️</span>
                  <span
                    style={{
                      background: 'var(--primary-gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Costes y Preferencias
                  </span>
                </h1>

                <p 
                    style={{
                        fontSize: '1.125rem',
                        color: '#6b7280',
                        fontWeight: '500'
                    }}
                >
                    Gestiona los costes de prioridades del sistema hospitalario
                </p>
            </div>

            {priorities && priorities.length > 0 ? (
                <div 
                    style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}
                >
                    {priorities.map((priorityGroup, index) => (
                        <div 
                            key={index} 
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                                border: '1px solid #e2e8f0',
                                overflow: 'hidden'
                            }}
                        >
                            <div 
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1.5rem',
                                    borderBottom: '1px solid #e5e7eb',
                                    background: '#f8fafc'
                                }}
                            >
                                <h3 
                                    style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '600',
                                        color: '#1e293b',
                                        margin: '0'
                                    }}
                                >
                                    {priorityGroup.type.toUpperCase()}
                                </h3>
                                <button
                                    onClick={() => handlePutOriginal(priorityGroup.type)}
                                    style={{
                                        padding: "10px 20px",
                                        background: 'var(--primary-gradient)',
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        transition: "all 0.2s ease",
                                        boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.transform = "translateY(-2px)";
                                        e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.transform = "translateY(0)";
                                        e.target.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.2)';
                                    }}
                                >
                                    🧹 Valores originales
                                </button>
                            </div>
                            
                            <div style={{ padding: '1.5rem' }}>
                                {priorityGroup.priorities.map((priority, pIndex) => (
                                    <div 
                                        key={pIndex} 
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0.75rem 0',
                                            borderBottom: pIndex < priorityGroup.priorities.length - 1 ? '1px solid #f1f5f9' : 'none'
                                        }}
                                    >
                                        <span 
                                            style={{
                                                fontSize: '1rem',
                                                fontWeight: '500',
                                                color: '#374151',
                                                flex: 1
                                            }}
                                        >
                                            {priority.title}
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={priority.cost}
                                            onChange={(e) => handleCostChange(priority.id, Number(e.target.value))}
                                            style={{
                                                padding: "8px 12px",
                                                border: "2px solid #e2e8f0",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                textAlign: "center",
                                                width: "90px",
                                                transition: "all 0.2s ease",
                                                outline: "none",
                                                background: '#f8fafc'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = "#3b82f6";
                                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                                e.target.style.background = 'white';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = "#e2e8f0";
                                                e.target.style.boxShadow = 'none';
                                                e.target.style.background = '#f8fafc';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div 
                    style={{
                        textAlign: 'center',
                        padding: '2rem',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                        maxWidth: '800px',
                        margin: '0 auto',
                        color: '#6b7280'
                    }}
                >
                    No hay prioridades disponibles
                </div>
            )}
            
            {backendErrors && (
                <div 
                    style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        color: '#dc2626',
                        textAlign: 'center',
                        maxWidth: '800px',
                        margin: '1rem auto 0'
                    }}
                >
                    {backendErrors}
                </div>
            )}
        </div>
    );
};

export default PrioritiesList;
