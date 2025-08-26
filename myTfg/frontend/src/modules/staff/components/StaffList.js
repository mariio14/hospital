import { useDispatch, useSelector } from "react-redux";
import * as actions from "../actions";
import * as selectors from "../selectors";
import React, { useState, useEffect, useRef } from "react";

const StaffList = () => {

    const dispatch = useDispatch();
    const initialUsers = useSelector(selectors.getStaffList);
    const [users, setUsers] = useState(initialUsers);
    const [backendErrors, setBackendErrors] = useState(null);
    const usersRef = useRef(users);

    useEffect(() => {
        dispatch(actions.getStaff(
            () => setBackendErrors('No se ha podido obtener la lista de usuarios')
        ));
    }, [dispatch]);

    useEffect(() => {
        usersRef.current = users;
    }, [users]);

    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    useEffect(() => {
        return () => {
            dispatch(actions.modifyStaff(
                usersRef.current,
                () => setBackendErrors('Ha ocurrido un error al modificar usuarios')
            ));
        };
    }, []);

    const handleNameChange = (userId, newName) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, name: newName } : user
            )
        );
    };

    const handleLevelChange = (userId, change) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId
                    ? { ...user, level: Math.min(5, Math.max(1, user.level + change)) }
                    : user
            )
        );
    };

    return (
         <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Lista de Personal</h2>
            {users && users.length > 0 ? (
                <div className="space-y-3">
                    {users.map((user, index) => (
                        <div 
                            key={index} 
                            className="p-4 rounded-lg shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '16px',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                            }}
                        >
                            {/* Name input */}
                            <div className="flex-1 min-w-0">
                                <input
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => handleNameChange(user.id, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    style={{
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        color: '#374151'
                                    }}
                                    placeholder="Nombre del residente"
                                />
                            </div>
                            
                            {/* Level controls */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => handleLevelChange(user.id, -1)}
                                    disabled={user.level === 1}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                                        user.level === 1 
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95 shadow-sm'
                                    }`}
                                >
                                    ◀
                                </button>
                                
                                <div 
                                    className="px-3 py-1 rounded-full text-sm font-bold text-white min-w-20 text-center"
                                    style={{
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                        boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                                    }}
                                >
                                    Nivel {user.level}
                                </div>
                                
                                <button
                                    onClick={() => handleLevelChange(user.id, 1)}
                                    disabled={user.level === 5}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                                        user.level === 5 
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95 shadow-sm'
                                    }`}
                                >
                                    ▶
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-8">No hay usuarios disponibles.</p>
            )}
            {backendErrors ? <p style={{ color: 'red', textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>{backendErrors}</p> : null}
        </div>
    );
};
export default StaffList;
