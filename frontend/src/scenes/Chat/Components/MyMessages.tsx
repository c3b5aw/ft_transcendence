import { Avatar, List, ListItem, Paper, Stack } from "@mui/material";
import { useEffect, useRef } from "react";
import { Message } from "../Services/interface";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import React from "react";
import { useNavigate } from "react-router-dom";
import { apiStats } from "../../../Services/Api/Api";

function MyMessages(props: { messages: Message[]}) {
	const { messages } = props;
	const messageEl = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const node = messageEl.current;
		if (node) {
			node.scrollIntoView({
				behavior: "auto",
				block: "end",
			});
		}
	}, [messages])

	const handleClick = (login: string) => {
		navigate(`${apiStats}/${login}`)
	}

	return (
		<Stack direction="column" sx={{width: 1, height: 1}} alignItems="center">
			<Stack direction="column" sx={{width: 1, height: 1}}>
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
											</React.Fragment> :
											<React.Fragment>
												<Avatar
													src={`http://127.0.0.1/api/users/${message.login}/avatar`}
													sx={{marginLeft: "10px", marginRight: "10px", width: "40px", height: "40px"}}
													onClick={() => handleClick(message.login)}
													>
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
					</div> : <div style={{color: "grey", textAlign: "center", marginTop: "10%", fontFamily: "Myriad Pro", fontSize: "45px"}}>No message</div>
					}
				</Paper>
			</Stack>
		</Stack>
	);
}

export default MyMessages