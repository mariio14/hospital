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

    return (
         <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Lista de Personal</h2>
            {users && users.length > 0 ? (
                <div className="space-y-4">
                    {users.map((user, index) => (
                        <div key={index} className="p-4 rounded-xl shadow-lg border bg-gray-100 flex justify-between items-center">
                            <input
                                type="text"
                                value={user.name}
                                onChange={(e) => handleNameChange(user.id, e.target.value)}
                                className="border rounded px-2 py-1 w-40"
                            />
                            <span className="text-sm font-medium text-gray-700">Nivel: {user.level}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No hay usuarios disponibles.</p>
            )}
            {backendErrors ? <p style={{ color: 'red', textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>{backendErrors}</p> : null}
        </div>
    );
};
export default StaffList;
