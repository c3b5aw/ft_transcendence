import { Dialog, DialogContent } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import MyAppBarClose from "../../components/MyAppBarClose";

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
				<h1>Matchs en cours :</h1>
			</DialogContent>
		</Dialog>
	);
}

export default MatchMaking;