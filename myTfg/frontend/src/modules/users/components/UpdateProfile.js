import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser, faEnvelope, faSave, faImage, faIdCard, faUserPlus} from '@fortawesome/free-solid-svg-icons';

import * as actions from '../actions';
import * as selectors from '../selectors';
import {Avatar} from "@mui/material";

const UpdateProfile = () => {

    const user = useSelector(selectors.getUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail]  = useState(user.email);
    const [avatar, setAvatar]  = useState(user.avatar);
	const [backendErrors, setBackendErrors] = useState(null);
	let form;

    const handleFileRead =  async (event) => {
        const file = event.target.files;
        const base64 = [];
        for(let i=0; i<file.length; i++){
            base64.push(await convertBase64(file[i]));

        }
        const combinedBase64 = base64.join('');

        setAvatar(combinedBase64);
    }

    let convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    const handleSubmit = event => {

        event.preventDefault();

        if (form.checkValidity()) {

            dispatch(actions.updateProfile(
                {id: user.id,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    avatar: avatar},
                () => navigate('/'),
                errors => setBackendErrors(errors)));

        } else {

            setBackendErrors(null);
            form.classList.add('was-validated');

        }

    }
    //<Errors errors={backendErrors} onClose={() => setBackendErrors(null)}/>
	return (
		<div className="container mt-4">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="card bg-darkgray rounded-3">
						<h5 className="card-header bg-black text-white">
							<FontAwesomeIcon icon={faUser} /> Actualizar Perfil
						</h5>
						<div className="card-body">
							<form ref={node => form = node} data-testid="updateProfile-form"
								  className="needs-validation" noValidate onSubmit={e => handleSubmit(e)}>
								<div className="form-group col">
									<label htmlFor="firstName" className="col-md-12 col-form-label">
										<FontAwesomeIcon icon={faUser}/> Nombre
									</label>
									<div className="col-md-6 input-group">
										<div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faUser}/>
                                            </span>
										</div>
										<input type="text" id="firstName" className="form-control"
											   data-testid="updateProfile-name-input"
											   value={firstName}
											   onChange={e => setFirstName(e.target.value)}
											   autoFocus
											   required/>
										<div className="invalid-feedback" data-testid="updateProfile-name-mandatory">
											Campo requerido
										</div>
									</div>
								</div>
								<div className="form-group col">
									<label htmlFor="lastName" className="col-md-12 col-form-label">
										<FontAwesomeIcon icon={faIdCard}/> Apellido
									</label>
									<div className="col-md-6 input-group">
										<div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faIdCard}/>
                                            </span>
										</div>
										<input type="text" id="lastName" className="form-control"
											   data-testid="updateProfile-surname-input"
											   value={lastName}
											   onChange={e => setLastName(e.target.value)}
											   required/>
										<div className="invalid-feedback" data-testid="updateProfile-surname-mandatory">
											Campo requerido
										</div>
									</div>
								</div>
								<div className="form-group col">
									<label htmlFor="email" className="col-md-12 col-form-label">
										<FontAwesomeIcon icon={faEnvelope}/> Email
									</label>
									<div className="col-md-6 input-group">
										<div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faEnvelope}/>
                                            </span>
										</div>
										<input type="email" id="email" className="form-control"
											   data-testid="updateProfile-email-input"
											   value={email}
											   onChange={e => setEmail(e.target.value)}
											   required/>
										<div className="invalid-feedback" data-testid="updateProfile-email-mandatory">
											Email requerido
										</div>
									</div>
								</div>
								<div className="form-group col">
									<label htmlFor="avatar" className="col-md-12 col-form-label">
										<FontAwesomeIcon icon={faImage}/> Avatar
									</label>
									<div className="d-flex flex-column align-items-center">
										<Avatar alt="Avatar" src={avatar} sx={{width: 100, height: 100}}/>
										<input
											data-testid="signUp-avatar-input"
											type="file"
											id="avatar"
											className="form-control mt-3"
											accept="image/*"
											onChange={handleFileRead}
										/>
									</div>
								</div>
								<div className="form-group col">
									<div className="d-flex justify-content-center">
										<button type="submit" className="btn btn-primary btn-dark" id="signUpButton"
												data-testid="signUp-submit-button">
											<FontAwesomeIcon icon={faUserPlus}/> Guardar
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

export default UpdateProfile;