import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROLE } from "../Services/Api/Role";
import { User } from "../Services/Interface/Interface";
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

export default function MyFooter(props : {me: User}) {
	const { me } = props;
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
			<p>Statistiques</p>
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
							onClick={() => handleLaunchHome()}>
							<Typography
								variant="h6"
								style={{fontFamily: "Myriad Pro"}}
							>
								Home
							</Typography>
						</Button>
						<Button variant="contained" disableElevation
							onClick={() => handleLaunchStats()}>
							<Typography
								variant="h6"
								style={{fontFamily: "Myriad Pro"}}
							>
								Statistiques
							</Typography>
						</Button>
						<Button variant="contained" disableElevation
							onClick={() => handleLaunchClassement()}>
							<Typography
								variant="h6"
								style={{fontFamily: "Myriad Pro"}}
							>
								Classement
							</Typography>
						</Button>
						<Button variant="contained" disableElevation
							onClick={() => handleLaunchParametres()}>
							<Typography
								variant="h6"
								style={{fontFamily: "Myriad Pro"}}
							>
								Paramètres
							</Typography>
						</Button>
						<Button variant="contained" disableElevation
							onClick={() => handleLaunchChat()}>
							<Typography
								variant="h6"
								style={{fontFamily: "Myriad Pro"}}
							>
								Chat
							</Typography>
						</Button>
						<Button variant="contained" disableElevation
							onClick={() => handleLaunchMenuGame()}>
							<Typography
								variant="h6"
								style={{fontFamily: "Myriad Pro"}}
							>
								Game
							</Typography>
						</Button>
						{me?.role === ROLE.ADMIN ?
							<Button variant="contained" disableElevation
								onClick={() => handleLaunchAdminView()}>
							<Typography
								variant="h6"
								style={{fontFamily: "Myriad Pro"}}
							>
								Admin View
							</Typography>
							</Button> : null
						}
					</Box>
					<Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "flex", md: "none", lg: "none" }, justifyContent: 'space-between'}}></Box>
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
