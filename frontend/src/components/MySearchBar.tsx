import { Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import Paper from "@mui/material/Paper";
import SearchBar from "material-ui-search-bar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiStats } from "../services/Api/Api";
import { User } from "../services/Interface/Interface";
import { useStyles } from "../styles/Styles";

export default function MySearchBar(props : {users: User[]}) {
	const { users } = props;
	const [searched, setSearched] = useState<string>("");
	const classes = useStyles();
	const [rows, setRows] = useState<User[]>([]);
	const navigate = useNavigate();

	const requestSearch = (searchedVal: string) => {
		if (searchedVal === "") {
			setRows([]);
		}
		else {
			const filteredResults = users.filter((row) =>
				((row.login).toLowerCase()).startsWith(searchedVal.toLowerCase()));
			setRows(filteredResults);
		}
	};

	const cancelSearch = () => {
		setSearched("");
		requestSearch(searched);
	};
	
	function handleClickCell(username: string) {
		navigate(`${apiStats}/${username}`);
	}

	return (
		<Paper className={classes.paper}>
			<SearchBar className={classes.searchBar}
				placeholder="Search users..."
				value={searched}
				onChange={(searchVal) => requestSearch(searchVal)}
				onCancelSearch={() => cancelSearch()}
				cancelOnEscape={true}
			/>
			<Paper className={classes.paper} style={{top: '14%', position: 'absolute'}}>
				<TableContainer sx={{maxHeight: 200}}>
					<Table>
						<TableBody>
							{rows.map((row) => (
							<TableRow key={row.login} hover>
								<TableCell component="th" scope="row" onClick={() => handleClickCell(row.login)}>
									{row.login}
								</TableCell>
							</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</Paper>
	);
}