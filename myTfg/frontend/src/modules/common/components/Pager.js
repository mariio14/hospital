import PropTypes from 'prop-types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from "@mui/material/IconButton";

const Pager = ({ back, next }) => (
	<div className="d-flex justify-content-center mt-4">
		{/* Botón de página anterior */}
		<IconButton
			onClick={back.onClick}
			disabled={!back.enabled}
			style={{
				color: back.enabled ? 'black' : 'gray',
				marginRight: '8px'  // Espacio entre botones
			}}
		>
			<ArrowBackIcon />
		</IconButton>

		{/* Botón de página siguiente */}
		<IconButton
			onClick={next.onClick}
			disabled={!next.enabled}
			style={{
				color: next.enabled ? 'black' : 'gray',
				marginLeft: '8px'  // Espacio entre botones
			}}
		>
			<ArrowForwardIcon />
		</IconButton>
	</div>
);



Pager.propTypes = {
	back: PropTypes.object.isRequired,
	next: PropTypes.object.isRequired
};

export default Pager;