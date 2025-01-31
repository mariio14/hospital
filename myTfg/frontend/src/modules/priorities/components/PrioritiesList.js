import { useDispatch, useSelector } from "react-redux";
import * as actions from "../actions";
import * as selectors from "../selectors";
import React, { useState, useEffect } from "react";


const PrioritiesList = () => {
    const dispatch = useDispatch();
    const priorities = useSelector(selectors.getPrioritiesList);
    const [backendErrors, setBackendErrors] = useState(null);

    useEffect(() => {
        dispatch(actions.getPriorities(
            () => setBackendErrors('No se ha podido devolver la lista de prioridades')
        ));
    }, [dispatch]);

    const handleCostChange = (id, cost) => {
        dispatch(actions.getPriorities(
            {id: id,
            cost: cost},
            () => setBackendErrors('Ha ocurrido un error')
        ));
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Priorities List</h2>
            {priorities && priorities.length > 0 ? (
                <div className="space-y-4">
                    {priorities.map((priorityGroup, index) => (
                        <div key={index} className="border p-3 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">{priorityGroup.type.toUpperCase()}</h3>
                            <ul className="list-disc pl-5 mt-2">
                                {priorityGroup.priorities.map((priority, pIndex) => (
                                    <li key={pIndex} className="flex justify-between">
                                        <span>{priority.title}</span>
                                        <input
                                            type="number"
                                            value={priority.cost}
                                            onChange={(e) => handleCostChange(priority.id, e.target.value)}
                                            className="ml-2 border rounded p-1 w-16 text-right"
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
