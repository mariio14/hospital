import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faLock, faUnlockAlt, faCheck, faSave } from '@fortawesome/free-solid-svg-icons';

import * as actions from '../actions';
import * as selectors from '../selectors';

const ChangePassword = () => {

    const user = useSelector(selectors.getUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [backendErrors, setBackendErrors] = useState(null);
    const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);
    let form;
    let confirmNewPasswordInput;

    const handleSubmit = event => {

        event.preventDefault();

        if (form.checkValidity() && checkConfirmNewPassword()) {

            dispatch(actions.changePassword(user.id, oldPassword, newPassword,
                () => navigate('/'),
                errors => setBackendErrors(errors)));

        } else {

            setBackendErrors(null);
            form.classList.add('was-validated');
            
        }

    }

    const checkConfirmNewPassword = () => {

        if (newPassword !== confirmNewPassword) {

            confirmNewPasswordInput.setCustomValidity('error');
            setPasswordsDoNotMatch(true);

            return false;

        } else {
            return true;
        }

    }

    const handleConfirmNewPasswordChange = event => {

        confirmNewPasswordInput.setCustomValidity('');
        setConfirmNewPassword(event.target.value);
        setPasswordsDoNotMatch(false);

    }

	return (
		<div className="container mt-4">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card bg-darkgray rounded-3">
						<h5 className="card-header bg-black text-white">
							<FontAwesomeIcon icon={faUnlockAlt} /> Cambiar Contraseña
						</h5>
						<div className="card-body">
							<form ref={node => form = node} data-testid="changePassword-form"
								  className="needs-validation" noValidate onSubmit={e => handleSubmit(e)}>
								<div className="form-group col">
									<label htmlFor="oldPassword" className="col-md-12 col-form-label">
										<FontAwesomeIcon icon={faKey} /> Antigua contraseña
									</label>
									<div className="col-md-12 input-group">
										<div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faKey} />
                                            </span>
										</div>
										<input type="password" id="oldPassword" className="form-control" data-testid="changePassword-oldPass-input"
											   value={oldPassword}
											   onChange={e => setOldPassword(e.target.value)}
											   autoFocus
											   required />
										<div className="invalid-feedback">
											Campo requerido
										</div>
									</div>
								</div>
								<div className="form-group col">
									<label htmlFor="newPassword" className="col-md-12 col-form-label">
										<FontAwesomeIcon icon={faLock} /> Nueva contraseña
									</label>
									<div className="col-md-12 input-group">
										<div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faLock} />
                                            </span>
										</div>
										<input type="password" id="newPassword" className="form-control" data-testid="changePassword-newPass-input"
											   value={newPassword}
											   onChange={e => setNewPassword(e.target.value)}
											   required />
										<div className="invalid-feedback">
											Campo requerido
										</div>
									</div>
								</div>
								<div className="form-group col">
									<label htmlFor="confirmNewPassword" className="col-md-12 col-form-label">
										<FontAwesomeIcon icon={faCheck} /> Confirme la nueva contraseña
									</label>
									<div className="col-md-12 input-group">
										<div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faCheck} />
                                            </span>
										</div>
										<input ref={node => confirmNewPasswordInput = node}
											   type="password" id="confirmNewPassword" className="form-control" data-testid="changePassword-newPass2-input"
											   value={confirmNewPassword}
											   onChange={e => handleConfirmNewPasswordChange(e)}
											   required />
										<div className="invalid-feedback">
											{passwordsDoNotMatch ? "Las contraseñas no coinciden" : "Campo requerido"}
										</div>
									</div>
								</div>
								<div className="form-group col" style={{ marginTop: '1rem' }}>
									<div className="d-flex justify-content-center">
										<button type="submit" className="btn btn-primary btn-dark" id='changePasswordButton' data-testid="changePassword-submit-button">
											<FontAwesomeIcon icon={faSave} /> Guardar
										</button>
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

export default ChangePassword;