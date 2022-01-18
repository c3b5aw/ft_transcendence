import { Avatar, List, ListItem, Paper, Stack } from "@mui/material";
// import { useState } from "react";
// import { Message } from "../../../services/Interface/Interface";

// function MyMessages() {
// 	const [messages, setMessage] = useState<Message[]>([])

// 	return (
// 		<Stack direction="column" sx={{width: 1, height: 0.91}}>
// 			<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto', backgroundColor: "#304649"}} elevation={0}>
// 				{test.length > 0 ?
// 				<List>
// 					{test.map(friend => (
// 						<div key={friend}>
// 							<ListItem component="div" sx={{marginBottom: 2}}>
// 								<Stack direction="row" alignItems="center" sx={{width: 1}}>
// 									<Stack sx={{ width: 1, height: 1}} alignItems="center" direction="row">
// 										<Stack direction="row" sx={{width: 1}}>
// 											<Stack direction="row" sx={{width: 0.05}} justifyContent="center">
// 												<Avatar
// 													src={`http://127.0.0.1/api/profile/avatar`}
// 													sx={{marginLeft: "10px", marginRight: "10px", width: "40px", height: "40px"}}>
// 												</Avatar>
// 											</Stack>
// 											<Stack direction="column" sx={{width: 0.9, maxWidth: 0.9}} spacing={1}>
// 												<div style={{fontSize: "18px", fontFamily: "Myriad Pro", color: "white"}}>{me?.login}</div>
// 												<div style={{color: "white"}}>{friend}</div>
// 											</Stack>
// 										</Stack>
// 									</Stack>
// 								</Stack>
// 							</ListItem>
// 						</div>
// 					))}
// 				</List> : null
// 				}
// 			</Paper>
// 		</Stack>
// 	);
// }

// export default MyMessages