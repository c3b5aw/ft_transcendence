import { Avatar, List, ListItem, Paper, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { api, apiChannel, apiMessages } from "../../../Services/Api/Api";
import { Message } from "../Services/interface";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import React from "react";
import { useSnackbar } from 'notistack'

function MyMessages(props: {nameChannel: string}) {
	const { nameChannel } = props;
	const [messages, setMessages] = useState<Message[]>([])
	const messageEl = useRef<HTMLDivElement>(null);
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		const fetchMessagesChannel = async () => {
			try {
				const reponse = await axios.get(`${api}${apiChannel}/${nameChannel}${apiMessages}`);
				setMessages(reponse.data);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de charger les messages du channel ${nameChannel} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchMessagesChannel();
	}, [enqueueSnackbar, nameChannel])

	useEffect(() => {
		const node = messageEl.current;
		if (node) {
			node.scrollIntoView({
				behavior: "auto",
				block: "end",
			});
		}
	}, [messages])

	return (
		<Stack direction="column" sx={{width: 1, height: 0.91}}>
			<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto', backgroundColor: "#304649"}} elevation={0}>
				{messages.length > 0 ?
				<div ref={messageEl}>
					<List>
						{messages.map(message => (
							<div key={message.id}>
								<ListItem component="div" sx={{marginBottom: 2}}>
									{message.announcement ?
										<React.Fragment>
											<DoubleArrowIcon style={{color: "#008D33", fontSize: "27px", marginRight: "10px"}}/> 
											<Stack direction="column" sx={{width: 0.9, maxWidth: 0.9}} spacing={1}>
												<div style={{fontSize: "18px", fontFamily: "Myriad Pro"}}>{message.login}</div>
												<div style={{color: "#99A3A4"}}>{message.content}</div>
											</Stack>
										</React.Fragment>
										:
										<React.Fragment>
											<Avatar
												src={`http://127.0.0.1/api/users/${message.login}/avatar`}
												sx={{marginLeft: "10px", marginRight: "10px", width: "40px", height: "40px"}}>
											</Avatar>
											<Stack direction="column" sx={{width: 0.9, maxWidth: 0.9}} spacing={1}>
												<div style={{fontSize: "18px", fontFamily: "Myriad Pro", color: "white"}}>{message.login}</div>
												<div style={{color: "white"}}>{message.content}</div>
											</Stack>
										</React.Fragment>
									}
								</ListItem>
							</div>
						))}
					</List>
				</div> : null
				}
			</Paper>
		</Stack>
	);
}

export default MyMessages