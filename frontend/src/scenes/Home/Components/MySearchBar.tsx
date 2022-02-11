import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import Paper from "@mui/material/Paper";
import SearchBar from "material-ui-search-bar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiStats } from "../../../Services/Api/Api";
import useUsers from "../../../Services/Hooks/useUsers";
import { User } from "../../../Services/Interface/Interface";

export default function MySearchBar() {
	const users = useUsers();
	const [searched, setSearched] = useState<string>("");
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
		cancelSearch();
		navigate(`${apiStats}/${username}`);
	}

	if (users === undefined) {
		return (
			<CircularProgress sx={{color: "white"}} />
		);
	}
	return (
		<Paper sx={{width: "50%"}}>
			<SearchBar
				// style={{width: "100%"}}
				placeholder="Search users..."
				value={searched}
				onChange={(searchVal) => requestSearch(searchVal)}
				onCancelSearch={() => cancelSearch()}
				cancelOnEscape={true}
			/>
			<Paper sx={{position: "absolute", width: "30%"}}>
				<TableContainer sx={{maxHeight: 200, width: "100%"}}>
					<Table>
						<TableBody>
							{rows.map((row) => (
							<TableRow key={row.login} hover>
								<TableCell scope="row" onClick={() => handleClickCell(row.login)}>
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