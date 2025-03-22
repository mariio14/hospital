import { useDispatch, useSelector } from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import users from '../../users';
import { Avatar, Drawer, List, ListItem } from '@mui/material';
import Badge from '@mui/material/Badge';
import '../../../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faSignOutAlt,
    faKey,
    faUserEdit,
    faRss,
    faPlusCircle,
    faSignInAlt,
    faHeart
} from '@fortawesome/free-solid-svg-icons';

const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userName = useSelector(users.selectors.getUserName);
    const avatar = useSelector(users.selectors.getAvatar);
    const userId = useSelector(users.selectors.getUserId);
    const [showModal, setShowModal] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
    }, [dispatch, userName]);

    const handleOpenDrawer = () => setDrawerOpen(true);
    const handleCloseDrawer = () => setDrawerOpen(false);

    return (
        <nav className="navbar navbar-expand-lg navbar-light sticky-top bg-white border App-header">
            <div className="logo d-flex align-items-center">
                <button className="menu-button" onClick={handleOpenDrawer}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <Link className="navbar-brand text-light font-weight-bold" to="/">
                    <i className="fas fa-home"></i> MedShift
                </Link>
            </div>
            <button
                className="navbar-toggler ms-auto"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse right" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto">
                    {userName ? (
                        <>
                            <li className="nav-item">
                                <Avatar
                                    alt="User Avatar"
                                    src={`data:image/jpeg;base64,${avatar}`}
                                    sx={{ width: 45, height: 45 }}
                                    className="avatar"
                                    onClick={() => navigate(`/users/${userId}`)}
                                />
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/users/logout">
                                    <i className="fas fa-sign-out-alt"></i> Logout
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li className="nav-item">
                            <Link className="nav-link" to="/users/login">
                                <i className="fas fa-sign-in-alt"></i> Login
                            </Link>
                        </li>
                    )}
                    <li className="nav-item">
                        <Link className="nav-link" to="/priorities">
                            <i className="fas fa-rss"></i> Prioridades
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/staff">
                            <i className="fas fa-rss"></i> Residentes
                        </Link>
                    </li>
                </ul>
            </div>
            <Drawer anchor="left" open={drawerOpen} onClose={handleCloseDrawer}>
                <div className="drawer-content">
                    <List>
                        {userName ? (
                            <>
                                <li className="nav-item d-flex align-items-center">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            alt="User Avatar"
                                            src={`data:image/jpeg;base64,${avatar}`}
                                            sx={{ width: 45, height: 45 }}
                                            className="avatar"
                                            onClick={() => {
                                                navigate(`/users/${userId}`);
                                                handleCloseDrawer();
                                            }}
                                        />
                                        <h5 className="username ms-2">{userName}</h5>
                                    </div>
                                </li>
                                <ListItem button onClick={handleCloseDrawer}>
                                    <Link className="nav-link2" to="/users/update-profile">
                                        <FontAwesomeIcon icon={faUserEdit} className="me-2" />
                                        Actualizar Perfil
                                    </Link>
                                </ListItem>
                                <ListItem button onClick={handleCloseDrawer}>
                                    <Link className="nav-link2" to="/users/change-password">
                                        <FontAwesomeIcon icon={faKey} className="me-2" />
                                        Cambiar Contraseña
                                    </Link>
                                </ListItem>
                            </>
                        ) : (
                              <li className="nav-item">
                                  <Link className="nav-link" to="/users/login">
                                      <i className="fas fa-sign-in-alt"></i> Login
                                  </Link>
                              </li>
                        )}
                        <>
                            <ListItem button onClick={handleCloseDrawer}>
                                <Link className="nav-link2" to="/priorities">
                                    <FontAwesomeIcon icon={faHeart} className="me-2" />
                                    Prioridades
                                </Link>
                            </ListItem>
                        </>
                        <>
                            <ListItem button onClick={handleCloseDrawer}>
                                <Link className="nav-link2" to="/staff">
                                    <FontAwesomeIcon icon={faHeart} className="me-2" />
                                    Residentes
                                </Link>
                            </ListItem>
                        </>
                    </List>
                </div>
            </Drawer>
        </nav>
    );
};

export default Header;
