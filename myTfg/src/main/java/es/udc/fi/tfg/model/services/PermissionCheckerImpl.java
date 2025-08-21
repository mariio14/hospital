package es.udc.fi.tfg.model.services;

import es.udc.fi.tfg.model.common.exceptions.InstanceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The Class PermissionCheckerImpl.
 */
@Service
@Transactional(readOnly=true)
public class PermissionCheckerImpl implements PermissionChecker {
	
	@Override
	public void checkUserExists(Long userId) throws InstanceNotFoundException {
		// TODO: Implement user validation without database
		// For now, just return without throwing exception
	}

	@Override
	public boolean checkUser(Long userId) throws InstanceNotFoundException {
		// TODO: Implement user validation without database
		// For now, always return true
		return true;
	}

	@Override
	public boolean checkUserAdmin(Long userId) throws InstanceNotFoundException {
		// TODO: Implement admin validation without database
		// For now, always return true
		return true;
	}

}
