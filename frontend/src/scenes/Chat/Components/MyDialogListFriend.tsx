import { Dialog } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { IListUser } from "../Services/interface";
import MyListUser from "./MyListUser";
import MyAppBarClose from "../../../components/MyAppBarClose";

function MyDialogListFriend(props: {setOpen: Dispatch<SetStateAction<boolean>>, myListFriends: IListUser}) {
	const { setOpen, myListFriends } = props;

	const handleClose = () => {
		setOpen(false);
	};

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
			aria-describedby="alert-dialog-description">
			<MyAppBarClose setOpen={setOpen} />
			<MyListUser myList={myListFriends}/>
		</Dialog>
	);
}

export default MyDialogListFriend;