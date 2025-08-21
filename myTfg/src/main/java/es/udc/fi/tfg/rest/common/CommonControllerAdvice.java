package es.udc.fi.tfg.rest.common;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * The Class CommonControllerAdvice.
 */
@ControllerAdvice
public class CommonControllerAdvice {

	/** The message source. */
	@Autowired
	private MessageSource messageSource;

	/**
	 * Handle method argument not valid exception.
	 *
	 * @param exception the exception
	 * @return the errors dto
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	public ErrorsDto handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {

		List<FieldErrorDto> fieldErrors = exception.getBindingResult().getFieldErrors().stream()
				.map(error -> new FieldErrorDto(error.getField(), error.getDefaultMessage()))
				.collect(Collectors.toList());

		return new ErrorsDto(fieldErrors);

	}

	/**
	 * Handle unexpected exception.
	 *
	 * @param exception the exception
	 * @return the errors dto
	 */
	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ResponseBody
	public ErrorsDto handleUnexpectedException(Exception exception) {
		return new ErrorsDto("Ha ocurrido un error");
	}

}
