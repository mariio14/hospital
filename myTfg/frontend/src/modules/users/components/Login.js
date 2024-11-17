import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import * as actions from '../actions';

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [backendErrors, setBackendErrors] = useState(null);
    let form;

    const handleSubmit = event => {

        event.preventDefault();

        if (form.checkValidity()) {

            dispatch(actions.login(
                userName.trim(),
                password,
                () => navigate('/'),
                () => setBackendErrors('Credenciales inválidas'),
                () => {
                    navigate('/users/login');
                    dispatch(actions.logout());
                }
            ));

        } else {
            setBackendErrors(null);
            form.classList.add('was-validated');
        }

    }

	return (
		<div className="container mt-4">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card bg-darkgray rounded-3">
						<h5 className="card-header bg-black text-white">
							<FontAwesomeIcon icon={faSignInAlt} /> Autenticarse
						</h5>
						<div className="card-body">
							<form ref={node => form = node} data-testid="login-form"
								  className="needs-validation" noValidate
								  onSubmit={e => handleSubmit(e)}>
								<div className="form-group col">
									<label htmlFor="userName" className="col-md-12 col-form-label">
										<FontAwesomeIcon icon={faUser} /> Usuario
									</label>
									<div className="col-md-12 input-group">
										<div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faUser} />
                                            </span>
										</div>
										<input type="text" id="userName" className="form-control" data-testid="login-username-input"
											   value={userName}
											   onChange={e => setUserName(e.target.value)}
											   autoFocus
											   required />
										<div className="invalid-feedback" data-testid="login-username-mandatory">
											Campo requerido
										</div>
									</div>
								</div>
								<div className="form-group col">
									<label htmlFor="password" className="col-md-12 col-form-label">
										<FontAwesomeIcon icon={faLock} /> Contraseña
									</label>
									<div className="col-md-12 input-group">
										<div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faLock} />
                                            </span>
										</div>
										<input type="password" id="password" className="form-control" data-testid="login-password-input"
											   value={password}
											   onChange={e => setPassword(e.target.value)}
											   required />
										<div className="invalid-feedback" data-testid="login-password-mandatory">
											Campo requerido
										</div>
									</div>
								</div>
								{backendErrors ? <p style={{ color: 'red', textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>{backendErrors}</p> : null}
								<div className="form-group" style={{ textAlign: 'center' }}>
									<div style={{ margin: '1em auto' }}>
										<button type="submit" className="btn btn-primary btn-dark" id="loginButton" data-testid="login-submit-button">
											<FontAwesomeIcon icon={faSignInAlt} /> Autenticarse
										</button>
									</div>
									<div style={{ fontWeight: 'normal', marginTop: '1rem' }}>
										¿No tienes cuenta? {' '}
										<Link to="/users/signup">
											Regístrate
										</Link>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
