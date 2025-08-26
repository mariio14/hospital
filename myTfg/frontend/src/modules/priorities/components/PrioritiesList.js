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
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Costes y preferencias</h2>
            {priorities && priorities.length > 0 ? (
                <div className="space-y-4">
                    {priorities.map((priorityGroup, index) => (
                        <div key={index} className="p-4 rounded-xl shadow-lg border bg-gray-100">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">{priorityGroup.type.toUpperCase()}</h3>
                                <button
                                    onClick={() => handlePutOriginal(priorityGroup.type)}
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: "#007BFF",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        transition: "all 0.2s ease"
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = "#0056b3";
                                        e.target.style.transform = "translateY(-1px)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = "#007BFF";
                                        e.target.style.transform = "translateY(0)";
                                    }}
                                >
                                    🧹 Valores originales
                                </button>
                            </div>
                            <ul className="mt-3">
                                {priorityGroup.priorities.map((priority, pIndex) => (
                                    <li key={pIndex} className="grid grid-cols-[1fr_auto] gap-4 items-center py-2">
                                        <span className="text-sm font-medium text-gray-700">{priority.title}</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={priority.cost}
                                            onChange={(e) => handleCostChange(priority.id, Number(e.target.value))}
                                            style={{
                                                padding: "6px 12px",
                                                border: "2px solid #e2e8f0",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                textAlign: "center",
                                                width: "80px",
                                                transition: "all 0.2s ease",
                                                outline: "none"
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                                            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No priorities available.</p>
            )}
            {backendErrors ? <p style={{ color: 'red', textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>{backendErrors}</p> : null}
        </div>
    );
};

export default PrioritiesList;
