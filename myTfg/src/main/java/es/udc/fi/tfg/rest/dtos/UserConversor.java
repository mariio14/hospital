package es.udc.fi.tfg.rest.dtos;

import es.udc.fi.tfg.model.entities.Users;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

/**
 * The Class UserConversor.
 */
public class UserConversor {

	/**
	 * Instantiates a new user conversor.
	 */
	private UserConversor() {
	}

	/**
	 * To user dto.
	 *
	 * @param user the user
	 * @return the user dto
	 */
	public static UserDto toUserDto(Users user) {
		return new UserDto(user.getId(), user.getUserName(), user.getFirstName(), user.getLastName(), user.getEmail(),
				user.getRole().toString(),user.getAvatar());
	}

	public static List<UserDto> toUserDtos(List<Users> users) {
		return users.stream().map(UserConversor::toUserDto).collect(Collectors.toList());
	}

	/**
	 * To user.
	 *
	 * @param userDto the user dto
	 * @return the user
	 */
	public static Users toUser(UserDto userDto) {

		return new Users(userDto.getUserName(), userDto.getPassword(), userDto.getFirstName(), userDto.getLastName(),
				userDto.getEmail(),userDto.getAvatar());
	}

	public static Users toUserAvatarAsString(UserAvatarAsStringDto userDto) {

		String image = userDto.getAvatar();
		if (image.contains(",")) {
			image = image.split(",")[1];
		}
		byte[] imageBytes = Base64.getDecoder().decode(image);

		return new Users(userDto.getUserName(), userDto.getPassword(), userDto.getFirstName(), userDto.getLastName(),
				userDto.getEmail(), imageBytes);
	}

	/**
	 * To authenticated user dto.
	 *
	 * @param serviceToken the service token
	 * @param user         the user
	 * @return the authenticated user dto
	 */
	public static AuthenticatedUserDto toAuthenticatedUserDto(String serviceToken, Users user) {

		return new AuthenticatedUserDto(serviceToken, toUserDto(user));

	}

}
