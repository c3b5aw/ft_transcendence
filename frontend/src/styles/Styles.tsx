import { makeStyles } from '@material-ui/core/styles';

export const StyleH1 = makeStyles({
	root: {
		fontSize: "120px",
		fontFamily: "Myriad Pro",
		textAlign: "center",
	},
});

export const boxStyle = {
	display: "flex",
	height: "23vh",
};

export const buttonStyle = {
	background: 'white',
	color: '#000000',
	'&:hover': {
		backgroundColor: '#D5D5D5',
		color: '#000000',
	},
	width: '12%',
	borderRadius: 5,
	border: 5,
	marginRight: {xs: 2, sm: 5, md: 10, lg: 21},
};

export const useStyles = makeStyles({
	stack: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	paper: {
		width: '50%',
		borderRadius: 15,
		// marginTop: "5rem",
	},
	searchBar: {
		borderRadius: 10,
	},
	rootButton: {
		background: "#C70039",
	},
	button: {
		variant: "contained"
	},
	box: {
		component: "span",
		alignItems: "center",
		justifyContent: "center",
	},
});

export const avatarStyle = {
	marginLeft: "10px",
	width: "56px",
	height: "56px",
};

export const avatarStyleIconList = {
	marginLeft: "10px",
	width: "32px",
	height: "32px",
};