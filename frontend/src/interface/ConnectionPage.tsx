import * as React from 'react'
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { StyleH1 } from '../styles/Styles';
import Button from '../components/MyButton';
import Avatar from '@mui/material/Avatar';

function ConnectionPage()
{
	const styleH1 = StyleH1();
	return (
		<Stack>
		<Box sx={{
			height: 500,
			width: 1,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		}}
		>
		<h1 className={styleH1.root}>ft_transcendance</h1>
		</Box>
		<Box sx={{
			height: 300,
			width: 1,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		}}
		>
		<Button 
			border="none"
			borderRadius={20}
			color="white"
			height = "100px"
			onClick={() => console.log("You clicked on the pink circle!")}
			width = "350px"
			children = "OAuth 42"
		/>
		</Box>
		<Box sx={{
			height: 500,
			width: 1,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		}}>
			<Stack direction="row" spacing={3}>
				<Avatar sx={{ width: 64, height: 64, bgcolor: "green" }}>EO</Avatar>
				<Avatar sx={{ width: 64, height: 64, bgcolor: "green" }}>SB</Avatar>
				<Avatar sx={{ width: 64, height: 64, bgcolor: "green" }}>NB</Avatar>
				<Avatar sx={{ width: 64, height: 64, bgcolor: "green" }}>EB</Avatar>
			</Stack>
		</Box>
		</Stack>
	);
}

export default ConnectionPage;

/*
	display: "flex",
    alignItems: 'center',
	justifyContent: 'center',

	fontSize: "4rem",
	color: "#ffffff",
	fontFamily: "Myriad Pro",
	textAlign: "center",
	padding: '60',


	sx={{
		width: 1,
		height: 300,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#000000"
	}}
*/