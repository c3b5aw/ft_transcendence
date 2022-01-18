import { Avatar, List, ListItem, Paper, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { api, apiChannel, apiMessages } from "../../../services/Api/Api";
import { Message } from "../Services/interface";

function MyMessages(props: {nameChannel: string}) {
	const { nameChannel } = props;
	const [messages, setMessages] = useState<Message[]>([])
	const messageEl = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchMessagesChannel = async () => {
			try {
				const reponse = await axios.get(`${api}${apiChannel}/${nameChannel}${apiMessages}`);
				setMessages(reponse.data);
			}
			catch (err) {
				console.log(err);
			}
		}
		fetchMessagesChannel();
	}, [nameChannel])

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
									<Stack direction="row">
										<Avatar
											src={`http://127.0.0.1/api/users/${message.login}/avatar`}
											sx={{marginLeft: "10px", marginRight: "10px", width: "40px", height: "40px"}}>
										</Avatar>
									</Stack>
									<Stack direction="column" sx={{width: 0.9, maxWidth: 0.9}} spacing={1}>
										<div style={{fontSize: "18px", fontFamily: "Myriad Pro", color: "white"}}>{message.login}</div>
										<div style={{color: "white"}}>{message.content}</div>
									</Stack>
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