import { Avatar, Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import MyAppBarClose from "../../../components/MyAppBarClose";
import { ROLE } from "../../../Services/Api/Role";
import { User } from "../../../Services/Interface/Interface";
import { Message } from "../Services/interface";
import MyBarSendMessage from "./MyBarSendMessage";
import MyMessages from "./MyMessages";

function MyInterfaceMessagesSx(props: {setOpen: Dispatch<SetStateAction<boolean>>, setOpenUser: Dispatch<SetStateAction<boolean>>, me: User, messages: Message[], nameChannel: string, usersChannel: User[]}) {
	const { setOpen, setOpenUser, me, messages, nameChannel, usersChannel } = props;

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
			<MyAppBarClose setOpen={setOpen} name={nameChannel.toUpperCase()}/>
			<DialogTitle sx={{padding: "6px"}}>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					sx={{width: 1}}
				>
					<Stack direction="row" alignItems="center">
						<Avatar
							src={`/api/profile/avatar`}
							sx={{
								margin: "10px",
								width: "40px",
								height: "40px"}}
							>
						</Avatar>
						<Typography variant="h5" style={{fontFamily: "Myriad Pro", color: "white"}}>{me.login}</Typography>
					</Stack>
					<Button
							variant="contained"
							onClick={() => setOpenUser(true)}
						>
							<Typography
								variant="subtitle1"
								style={{fontFamily: "Myriad Pro"}}
							>
									Users
							</Typography>
						</Button>
				</Stack>
			</DialogTitle>
			<DialogContent sx={{padding: 0}}>
				<Stack direction="column" sx={{height: 1}}>
					<Stack
						direction="column"
						flexGrow={1}
						sx={{width: 1, height: 1}}
					>
						<Stack
							direction="row"
							sx={{width: 1, height: 0.8, backgroundColor: "#304649"}}
							spacing={2}
							alignItems="flex-start"
							justifyContent="space-between"
						>
							{me !== undefined && me.role !== ROLE.BANNED ?
								<MyMessages messages={messages} /> : 
								<div style={{
									color: "grey",
									textAlign: "center",
									marginTop: "40%",
									fontFamily: "Myriad Pro",
									fontSize: "45px"}}
								>
									You have been banned
								</div>
							}
						</Stack>
						<MyBarSendMessage nameChannel={nameChannel} me={me} usersChannel={usersChannel} />
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

export default MyInterfaceMessagesSx;