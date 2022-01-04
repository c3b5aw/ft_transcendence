import * as React from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

interface Props {
	onSubmit: () => void;
}

export const MyCheckbox = () => {
	const [checked, setChecked] = React.useState(true);
	return (
		<div>
			<Checkbox
				checked={checked}
				onChange={
					(e) => setChecked(e.target.checked)
				}
			/>
		</div>
	);
};

// export const MyBackground = () => {
// 	return (
// 		<Container maxWidth="sm">
// 			{/* <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} /> */}
// 		</Container>
// 	);
// };

export const MyForm: React.FC<Props> = () => {
	return (
    <Stack direction="row" spacing={2}>
		<ButtonGroup variant="contained" color="primary">
			<Button
				startIcon={<DeleteIcon />}
				endIcon={<SendIcon />}
				style = {{
					fontSize: 17
				}}>
				Delete
			</Button>
			<Button endIcon={<SendIcon />}>
				Send
			</Button>
		</ButtonGroup>
    </Stack>
  );
};
