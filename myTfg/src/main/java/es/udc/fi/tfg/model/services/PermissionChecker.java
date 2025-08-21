package es.udc.fi.tfg.model.services;

import es.udc.fi.tfg.model.common.exceptions.InstanceNotFoundException;

/**
 * The Interface PermissionChecker.
 */
public interface PermissionChecker {
	
	/**
	 * Check user exists.
	 *
	 * @param userId the user id
	 * @throws InstanceNotFoundException the instance not found exception
	 */
	public void checkUserExists(Long userId) throws InstanceNotFoundException;
	
	/**
	 * Check user.
	 *
	 * @param userId the user id
	 * @return true if user exists
	 * @throws InstanceNotFoundException the instance not found exception
	 */
	public boolean checkUser(Long userId) throws InstanceNotFoundException;

	public boolean checkUserAdmin(Long userId) throws InstanceNotFoundException;
}
