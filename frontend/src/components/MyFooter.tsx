import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROLE } from "../Services/Api/Role";
import { PAGE, User } from "../Services/Interface/Interface";
import { pageAdmin, pageChat, pageClassement, pageGame, pageHome, pageSettings, pageStat } from "../Services/Routes/RoutePage";
import MoreIcon from '@mui/icons-material/MoreVert';
import React from "react";

import ChatIcon from '@mui/icons-material/Chat';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelineIcon from '@mui/icons-material/Timeline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import HomeIcon from '@mui/icons-material/Home';
import MySearchBar from "../scenes/Home/Components/MySearchBar";

export default function MyFooter(props : {me: User, currentPage: PAGE}) {
	const { me, currentPage } = props;
	const navigate = useNavigate();

	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
		React.useState<null | HTMLElement>(null);

	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	function handleLaunchStats() {
		if (me?.login !== undefined)
			navigate(`${pageStat}/${me?.login}`);
	}

	function handleLaunchHome() {
		navigate(`${pageHome}`);
	}

	function handleLaunchClassement() {
		navigate(`${pageClassement}`);
	}

	function handleLaunchParametres() {
		navigate(`${pageSettings}`);
	}

	function handleLaunchChat() {
		navigate(`${pageChat}`);
	}

	function handleLaunchAdminView() {
		navigate(`${pageAdmin}`);
	}

	function handleLaunchMenuGame() {
		navigate(`${pageGame}`);
	}

	const mobileMenuId = 'primary-search-account-menu-mobile';
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
		<MenuItem onClick={handleLaunchHome}>
			<IconButton>
				<HomeIcon />
			</IconButton>
			<p>Home</p>
		</MenuItem>
		<MenuItem onClick={handleLaunchStats}>
			<IconButton>
				<TimelineIcon />
			</IconButton>
			<p>Profile</p>
		</MenuItem>
		<MenuItem onClick={handleLaunchClassement}>
			<IconButton>
				<LeaderboardIcon />
			</IconButton>
			<p>Classement</p>
		</MenuItem>
		<MenuItem onClick={handleLaunchParametres}>
			<IconButton>
				<SettingsIcon />
			</IconButton>
			<p>Paramètres</p>
		</MenuItem>
		<MenuItem onClick={handleLaunchChat}>
			<IconButton>
				<ChatIcon />
			</IconButton>
			<p>Chat</p>
		</MenuItem>
		<MenuItem onClick={handleLaunchMenuGame}>
			<IconButton>
				<SportsEsportsIcon />
			</IconButton>
			<p>Game</p>
		</MenuItem>
		<MenuItem onClick={handleLaunchAdminView}>
			<IconButton>
				<AdminPanelSettingsIcon />
			</IconButton>
			<p>Admin View</p>
		</MenuItem>
		</Menu>
	);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar
				position="sticky"
				sx={{ top: '0', bottom: 'auto' }}
			>
				<Toolbar sx={{justifyContent: 'space-between'}}>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex'}, justifyContent: 'space-between'}}>
						<Button variant="contained" disableElevation
							onClick={() => handleLaunchHome()}
							sx={{backgroundColor: currentPage === PAGE.HOME ? "#0169B0" : null}}>
							<Typography
								variant="h6"
								style={{fontFamily: "Myriad Pro"}}
							>
								Home
							</Typography>
						</Button>
						<Button variant="contained" disableElevation
							onClick={() => handleLaunchStats()}
							sx={{backgroundColor: currentPage === PAGE.STATS ? "#0169B0" : null}}>
							<Typography
								variant="h6"
								style={{fontFamily: "Myriad Pro"}}
							>
								Profile
							</Typography>
						</Button>
						<Button variant="contained" disableElevation
							onClick={() => handleLaunchClassement()}
							sx={{backgroundColor: currentPage === PAGE.CLASSEMENT ? "#0169B0" : null}}>
							<Typography
								variant="h6"
								style={{fontFamily: "Myriad Pro"}}
							>
								Classement
							</Typography>
						</Button>
						<Button variant="contained" disableElevation
							onClick={() => handleLaunchParametres()}
							sx={{backgroundColor: currentPage === PAGE.PARAMETRES ? "#0169B0" : null}}>
							<Typography
								variant="h6"
								style={{fontFamily: "Myriad Pro"}}
							>
								Paramètres
							</Typography>
						</Button>
						<Button variant="contained" disableElevation
							onClick={() => handleLaunchChat()}
							sx={{backgroundColor: currentPage === PAGE.CHAT ? "#0169B0" : null}}>
							<Typography
								variant="h6"
								style={{fontFamily: "Myriad Pro"}}
							>
								Chat
							</Typography>
						</Button>
						<Button variant="contained" disableElevation
							onClick={() => handleLaunchMenuGame()}
							sx={{backgroundColor: currentPage === PAGE.GAME ? "#0169B0" : null}}>
							<Typography
								variant="h6"
								style={{fontFamily: "Myriad Pro"}}
							>
								Game
							</Typography>
						</Button>
						{me?.role === ROLE.ADMIN ?
							<Button variant="contained" disableElevation
								onClick={() => handleLaunchAdminView()}
								sx={{backgroundColor: currentPage === PAGE.ADMINVIEW ? "#0169B0" : null}}>
							<Typography
								variant="h6"
								style={{fontFamily: "Myriad Pro"}}
							>
								Admin View
							</Typography>
							</Button> : null
						}
					</Box>
					<Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "flex", md: "none", lg: "none" }, justifyContent: 'space-between'}}>
						{currentPage === PAGE.STATS ? <MySearchBar /> : null}
					</Box>
					<Box sx={{ display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="show more"
							aria-controls={mobileMenuId}
							aria-haspopup="true"
							onClick={handleMobileMenuOpen}
							color="inherit"
						>
							<MoreIcon />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
			{renderMobileMenu}
		</Box>
	);
};
