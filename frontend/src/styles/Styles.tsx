import { makeStyles } from "@mui/styles";

export const StyleH1 = makeStyles({
	root: {
		fontSize: "12vw",
		fontFamily: "Myriad Pro",
		textAlign: "center",
	},
});

export const boxStyle = {
	display: "flex",
};

export const buttonStyle = {
	background: 'white',
	color: '#000000',
	'&:hover': {
		backgroundColor: '#D5D5D5',
		color: '#000000',
	},
	"&:disabled": {
		backgroundColor: "grey"
	},
	borderRadius: {xs: 1, sm: 2, md: 3, lg: 4},
	border: {xs: 1, sm: 2, md: 3, lg: 4},
	marginRight: {xs: 2, sm: 5, md: 10, lg: 21},
};

export const useStyles = makeStyles({
	stack: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	paper: {
		width: '90%',
		borderRadius: 15,
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
	width: {xs: "48px", sm: "48px", md: "48px", lg: "64px"},
	height: {xs: "48px", sm: "48px", md: "48px", lg: "64px"},
};

export const avatarStyleIconList = {
	marginLeft: "10px",
	width: "32px",
	height: "32px",
};

export const styleTextField = makeStyles({
	styleTextField: {
		width: "12.%",
		margin: "0 0 0 0",
		float: "right",
		'&:hover': {
			backgroundColor: '#394E51',
		},
		"& .MuiOutlinedInput-root": {
			"& fieldset": { 
				borderRadius: "10px",
				borderColor: "#969696"
			},
		"&.Mui-focused fieldset": {
			borderColor: "#969696",
			borderWidth: "2px"
		}
	}
}
})