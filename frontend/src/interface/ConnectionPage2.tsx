import * as React from 'react'
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider, styled, Theme } from '@mui/material/styles';
import { orange, green, red } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import ConnectionPage from './ConnectionPage';


const outerTheme = createTheme({
  palette: {
    secondary: {
      main: orange[500],
    },
	primary: {
		main: red[500],
	}
  },
});

export function ThemeNestingExtend() {
  return (
	<Container>
		<ThemeProvider theme={outerTheme}>
    		<Checkbox defaultChecked color="secondary" />
			<Checkbox defaultChecked color="primary"/>
        	<Checkbox defaultChecked color="secondary"/>
    	</ThemeProvider>
		<ConnectionPage />
	</Container>
  );
};

export function ConnectionPage2() {
	return (
		<p>
			Hello tout le monde
		</p>
	);
};