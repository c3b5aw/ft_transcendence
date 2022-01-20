import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import SearchBar from "material-ui-search-bar";
import React from "react";
import { ISearchBar, User } from "../../../Services/Interface/Interface";
import { useStyles } from "../../../styles/Styles";

function MySearchBarChat(props : {users: User[], fSearchBar: ISearchBar, nameBar: string}) {

    const { users, fSearchBar, nameBar } = props;
    const [searched, setSearched] = React.useState<string>("");
	const [rows, setRows] = React.useState<User[]>([]);
	const classes = useStyles();

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

    return (
        <Paper>
            <SearchBar className={classes.searchBar}
                placeholder={`${nameBar}`}
                value={searched}
                onChange={(searchVal) => requestSearch(searchVal)}
                onCancelSearch={() => cancelSearch()}
                cancelOnEscape={true}
            />
            <Paper>
                <TableContainer sx={{maxHeight: 200, width: 400}}>
                    <Table>
                        <TableBody>
                            {rows.map((row) => (
                            <TableRow key={row.login} hover>
                                <TableCell scope="row" onClick={() => fSearchBar.handleClickCell(row)}>
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

export default MySearchBarChat;