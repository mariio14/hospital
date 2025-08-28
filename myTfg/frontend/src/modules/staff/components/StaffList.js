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
                background: 'var(--background-gradient)'
            }}
        >
            {/* Modern Header */}
            <div 
                style={{
                    textAlign: 'center',
                    marginBottom: '3rem'
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
                        color: 'var(--text-secondary)',
                        fontWeight: '500'
                    }}
                >
                    Administra los niveles del personal sanitario
                </p>
            </div>

            {users && users.length > 0 ? (
                <div 
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '1.5rem',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}
                >
                    {users.map((user, index) => (
                        <div 
                            key={index}
                            className="card-modern"
                            style={{
                                padding: '2rem',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Decorative gradient bar */}
                            <div 
                                style={{
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    right: '0',
                                    height: '4px',
                                    background: 'var(--primary-gradient)'
                                }}
                            />
                            
                            {/* Staff member icon and basic info */}
                            <div 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '1.5rem',
                                    gap: '1rem'
                                }}
                            >
                                <div 
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        background: 'var(--primary-gradient)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        boxShadow: 'var(--shadow-md)'
                                    }}
                                >
                                    👨‍⚕️
                                </div>
                                <div style={{ flex: '1' }}>
                                    <h3 
                                        style={{
                                            fontSize: '1.125rem',
                                            fontWeight: '600',
                                            color: 'var(--text-primary)',
                                            marginBottom: '0.25rem'
                                        }}
                                    >
                                        Personal Sanitario
                                    </h3>
                                    <p 
                                        style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)',
                                            margin: '0'
                                        }}
                                    >
                                        ID: {user.id}
                                    </p>
                                </div>
                            </div>

                            {/* Name input with modern styling */}
                            <div className="form-modern">
                                <input
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => handleNameChange(user.id, e.target.value)}
                                    placeholder="Introduce el nombre completo..."
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        border: '2px solid var(--border-color)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        color: 'var(--text-primary)',
                                        background: 'var(--surface-color)',
                                        transition: 'var(--transition)'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--primary-color)';
                                        e.target.style.boxShadow = '0 0 0 3px rgb(59 130 246 / 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--border-color)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                            
                            {/* Level controls with modern design */}
                            <div 
                                style={{
                                    marginTop: '1.5rem'
                                }}
                            >
                                <label 
                                    style={{
                                        display: 'block',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                        marginBottom: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}
                                >
                                    Nivel de Experiencia
                                </label>
                                
                                <div 
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--border-color)'
                                    }}
                                >
                                    {/* Decrease button */}
                                    <button
                                        onClick={() => handleLevelChange(user.id, -1)}
                                        disabled={user.level === 1}
                                        className="btn-modern"
                                        style={{
                                            width: '3rem',
                                            height: '3rem',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem',
                                            fontWeight: 'bold',
                                            border: 'none',
                                            cursor: user.level === 1 ? 'not-allowed' : 'pointer',
                                            background: user.level === 1 
                                                ? 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' 
                                                : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                            color: user.level === 1 ? 'var(--text-secondary)' : 'white',
                                            boxShadow: user.level === 1 ? 'none' : 'var(--shadow-sm)',
                                            transition: 'var(--transition)',
                                            opacity: user.level === 1 ? '0.6' : '1'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (user.level !== 1) {
                                                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                                                e.target.style.boxShadow = 'var(--shadow-lg)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (user.level !== 1) {
                                                e.target.style.transform = 'translateY(0) scale(1)';
                                                e.target.style.boxShadow = 'var(--shadow-sm)';
                                            }
                                        }}
                                    >
                                        −
                                    </button>
                                    
                                    {/* Level indicator */}
                                    <div 
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <div 
                                            style={{
                                                background: 'var(--primary-gradient)',
                                                color: 'white',
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: 'var(--radius-xl)',
                                                fontSize: '1.25rem',
                                                fontWeight: '700',
                                                boxShadow: 'var(--shadow-md)',
                                                minWidth: '5rem',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {user.level}
                                        </div>
                                        <div 
                                            style={{
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                color: 'var(--text-secondary)',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {user.level === 1 && 'Interno'}
                                            {user.level === 2 && 'R1'}
                                            {user.level === 3 && 'R2'}
                                            {user.level === 4 && 'R3'}
                                            {user.level === 5 && 'Especialista'}
                                        </div>
                                    </div>
                                    
                                    {/* Increase button */}
                                    <button
                                        onClick={() => handleLevelChange(user.id, 1)}
                                        disabled={user.level === 5}
                                        className="btn-modern"
                                        style={{
                                            width: '3rem',
                                            height: '3rem',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem',
                                            fontWeight: 'bold',
                                            border: 'none',
                                            cursor: user.level === 5 ? 'not-allowed' : 'pointer',
                                            background: user.level === 5 
                                                ? 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' 
                                                : 'linear-gradient(135deg, var(--accent-color), #059669)',
                                            color: user.level === 5 ? 'var(--text-secondary)' : 'white',
                                            boxShadow: user.level === 5 ? 'none' : 'var(--shadow-sm)',
                                            transition: 'var(--transition)',
                                            opacity: user.level === 5 ? '0.6' : '1'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (user.level !== 5) {
                                                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                                                e.target.style.boxShadow = 'var(--shadow-lg)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (user.level !== 5) {
                                                e.target.style.transform = 'translateY(0) scale(1)';
                                                e.target.style.boxShadow = 'var(--shadow-sm)';
                                            }
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                                
                                {/* Progress bar showing level */}
                                <div 
                                    style={{
                                        marginTop: '1rem',
                                        height: '8px',
                                        background: 'var(--border-color)',
                                        borderRadius: 'var(--radius-sm)',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div 
                                        style={{
                                            height: '100%',
                                            width: `${(user.level / 5) * 100}%`,
                                            background: 'var(--primary-gradient)',
                                            transition: 'var(--transition)',
                                            borderRadius: 'var(--radius-sm)'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div 
                    style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'var(--surface-color)',
                        borderRadius: 'var(--radius-xl)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        boxShadow: 'var(--shadow-md)'
                    }}
                >
                    <div 
                        style={{
                            fontSize: '4rem',
                            marginBottom: '1rem'
                        }}
                    >
                        👥
                    </div>
                    <h3 
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '0.5rem'
                        }}
                    >
                        No hay personal disponible
                    </h3>
                    <p 
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: '1rem'
                        }}
                    >
                        Actualmente no existen registros de personal en el sistema.
                    </p>
                </div>
            )}
            
            {backendErrors && (
                <div 
                    style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                        border: '1px solid #fecaca',
                        borderRadius: 'var(--radius-md)',
                        color: '#dc2626',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        maxWidth: '600px',
                        margin: '2rem auto 0'
                    }}
                >
                    ⚠️ {backendErrors}
                </div>
            )}
        </div>
    );
};
export default StaffList;
