package es.udc.fi.tfg.rest.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * The Class AuthenticatedUserDto.
 */
public class AuthenticatedUserDto {

	/** The service token. */
	private String serviceToken;
	
	/** The user info. */
	private String userInfo; // Changed from UserDto to simple String

	/**
	 * Instantiates a new authenticated user dto.
	 */
	public AuthenticatedUserDto() {
	}

	/**
	 * Instantiates a new authenticated user dto.
	 *
	 * @param serviceToken the service token
	 * @param userInfo the user info
	 */
	public AuthenticatedUserDto(String serviceToken, String userInfo) {

		setServiceToken(serviceToken);
		setUserInfo(userInfo);

	}

	/**
	 * Gets the service token.
	 *
	 * @return the service token
	 */
	public String getServiceToken() {
		return serviceToken;
	}

	/**
	 * Sets the service token.
	 *
	 * @param serviceToken the new service token
	 */
	public void setServiceToken(String serviceToken) {
		this.serviceToken = serviceToken;
	}

	/**
	 * Gets the user info.
	 *
	 * @return the user info
	 */
	@JsonProperty("user")
	public String getUserInfo() {
		return userInfo;
	}

	/**
	 * Sets the user info.
	 *
	 * @param userInfo the new user info
	 */
	public void setUserInfo(String userInfo) {
		this.userInfo = userInfo;
	}

}
