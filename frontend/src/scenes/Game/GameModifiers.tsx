import { FormGroup, FormControlLabel, Switch } from '@mui/material';

export default function GameModifiers(props: any) {
	return (
		<FormGroup>
			<FormControlLabel disabled control={
				<Switch onChange={ props.boostCallback }/>
			} label="Boost" />
			<FormControlLabel control={
				<Switch onChange={ props.backgroundCallback }/>
			} label="Random Background" />
		</FormGroup>
	)
}