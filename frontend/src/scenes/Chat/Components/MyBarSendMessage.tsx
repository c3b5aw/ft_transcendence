import { FormControl, IconButton, Stack, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { isMuteSendMessage } from "../Services/utils";
import { channelSend } from "../Services/wsChat";
import { styleTextField } from "../../../styles/Styles";
import { SetStateAction, useState } from "react";
import { User } from "../../../Services/Interface/Interface";

function MyBarSendMessage(props: {nameChannel: string, me: User, usersChannel: User[]}) {
	const {nameChannel, me, usersChannel } = props;
	const classes = styleTextField();
	const [messageTmp, setMessageTmp] = useState<string>("");

	const  handleTextInputChange = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setMessageTmp(event.target.value);
	};

	function handleSendMessage() {
		channelSend(nameChannel, messageTmp);
		setMessageTmp("");
	}

	return (
		<Stack
			direction="row"
			sx={{width: 1, height: 0.125, backgroundColor: "#304649"}}
			spacing={2}
			alignItems="center"
			justifyContent="space-between"
		>
			<Stack
				direction="row"
				sx={{width: 1}}
			>
				<FormControl sx={{ width: 0.95, marginLeft: 1}}>
					<TextField
						disabled={me !== undefined && isMuteSendMessage(usersChannel, me, messageTmp) ? true : false}
						className={classes.styleTextField}
						placeholder="Message"
						variant="outlined"
						fullWidth
						maxRows={2}
						value={messageTmp}
						onChange={handleTextInputChange}
						InputProps={{
							style: {
								backgroundColor: "#737373",
								color: "white",
							}
						}}
						onKeyPress= {(e) => {
							if (e.key === 'Enter') {
								handleSendMessage();
							}
						}}
					/>
				</FormControl>
				<IconButton
					aria-label="send"
					size="large"
					sx={{color: "white"}}
					onClick={() => handleSendMessage()}
				>
					<SendIcon fontSize="large" />
				</IconButton>
			</Stack>
		</Stack>
	);
}

export default MyBarSendMessage;