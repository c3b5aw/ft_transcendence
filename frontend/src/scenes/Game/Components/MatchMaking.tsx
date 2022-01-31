import { Dialog, DialogContent, Stack, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import MyAppBarClose from "../../../components/MyAppBarClose";

function MatchMaking(props: {setOpen: Dispatch<SetStateAction<boolean>>}) {
	const { setOpen } = props;

	const handleClose = () => {
		setOpen(false);
	}

	return (
		<Dialog
			open={true}
			fullScreen
			onClose={handleClose}
			PaperProps={{
				style: {
				  backgroundColor: '#1d3033',
				  color:'white'
				},
			}}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
            <MyAppBarClose setOpen={setOpen} />
			<DialogContent>
				<Stack sx={{height: 1, alignItems: "center", justifyContent: "center"}}>
					<Typography
						variant="h3"
						style={{color: 'grey', fontFamily: "Myriad Pro"}}
					>
						Veuillez patienter, nous recherchons un joueur...
					</Typography>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

export default MatchMaking;