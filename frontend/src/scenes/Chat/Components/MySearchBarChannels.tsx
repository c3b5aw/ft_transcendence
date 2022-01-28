import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import SearchBar from "material-ui-search-bar";
import React from "react";
import { ISearchBarChannel } from "../../../Services/Interface/Interface";
import { useStyles } from "../../../styles/Styles";
import { Channel } from "../Services/interface";

function MySearchBarChannels(props : {channels: Channel[], fSearchBarChannel: ISearchBarChannel, nameBar: string}) {

    const { channels, fSearchBarChannel, nameBar } = props;
    const [searched, setSearched] = React.useState<string>("");
	const [rows, setRows] = React.useState<Channel[]>([]);
	const classes = useStyles();

	const requestSearch = (searchedVal: string) => {
		if (searchedVal === "") {
			setRows([]);
		}
		else {
			const filteredResults = channels.filter((row) =>
				((row.name).toLowerCase()).startsWith(searchedVal.toLowerCase()));
			setRows(filteredResults);
		}
	};

	const cancelSearch = () => {
		setSearched("");
		requestSearch(searched);
	};

    const handleClick = (channel: Channel) => {
		fSearchBarChannel.handleClickCell(channel);
		cancelSearch();
	}


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
                            <TableRow
                                key={row.name}
                                hover
                            >
                                <TableCell
                                    scope="row"
                                    onClick={() => handleClick(row)}
                                >
                                    {row.name}
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

export default MySearchBarChannels;