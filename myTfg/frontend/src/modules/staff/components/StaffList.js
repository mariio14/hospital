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
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        background: 'var(--primary-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.025em'
                    }}
                >
                    📋 Gestión de Personal
                </h1>
                <p 
                    style={{
                        fontSize: '1.125rem',
                        color: '#6b7280',
                        fontWeight: '500'
                    }}
                >
                    Administra los niveles del personal sanitario
                </p>
            </div>

            {users && users.length > 0 ? (
                <div 
                    style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden'
                    }}
                >
                    {users.map((user, index) => (
                        <div 
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem 1.5rem',
                                borderBottom: index < users.length - 1 ? '1px solid #e5e7eb' : 'none',
                                gap: '1rem'
                            }}
                        >
                            {/* Name input */}
                            <div style={{ flex: '1' }}>
                                <input
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => handleNameChange(user.id, e.target.value)}
                                    placeholder="Nombre completo"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                            
                            {/* Level controls */}
                            <div 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <button
                                    onClick={() => handleLevelChange(user.id, -1)}
                                    disabled={user.level === 1}
                                    style={{
                                        width: '2rem',
                                        height: '2rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        background: user.level === 1 ? '#f3f4f6' : 'white',
                                        cursor: user.level === 1 ? 'not-allowed' : 'pointer',
                                        fontSize: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    −
                                </button>
                                
                                <span 
                                    style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        minWidth: '2rem',
                                        textAlign: 'center',
                                        color: '#374151'
                                    }}
                                >
                                    {user.level}
                                </span>
                                
                                <button
                                    onClick={() => handleLevelChange(user.id, 1)}
                                    disabled={user.level === 5}
                                    style={{
                                        width: '2rem',
                                        height: '2rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        background: user.level === 5 ? '#f3f4f6' : 'white',
                                        cursor: user.level === 5 ? 'not-allowed' : 'pointer',
                                        fontSize: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    +
                                </button>
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
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        maxWidth: '800px',
                        margin: '0 auto',
                        color: '#6b7280'
                    }}
                >
                    No hay personal disponible
                </div>
            )}
            
            {backendErrors && (
                <div 
                    style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
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
export default StaffList;
