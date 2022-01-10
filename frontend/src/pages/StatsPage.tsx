import { Avatar, CircularProgress, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MatchsPropsTest, MessageProps, UserListProps, AchievementsPropsTmp, UserProps } from '../utils/Interface';
import MyHistory from '../components/MyHistory';
import MyAchievements from '../components/MyAchievements';
import MyChat from '../components/MyChat';
import { usersApi } from '../utils/Api';

const StatsPage = (props: UserListProps ) => {
	const { login } = useParams();
	const user = (props.items).find(e => e.login === login);
	const connected = true;

	const [matchs, setMatchs] = useState<MatchsPropsTest[]>([]);
	const [achievements, setAchievements] = useState<AchievementsPropsTmp[]>([]);

	const testMessageList: MessageProps[] = [
		{ message: "Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas", to:"tom" },
		{ message: "12", to:"tom" },
		{ message: "elie1", to:"elie" },
		{ message: "14", to:"tom"},
		{ message: "15", to:"tom" },
		{ message: "elie2", to:"elie" },
		{ message: "elie3", to:"elie" },
		{ message: "elie4", to:"elie" },
		{ message: "1u", to:"tom" },
		{ message: "17u", to:"tom" },
		{ message: "elie", to:"elie" },
		{ message: "17grg", to:"tom" },
		{ message: "elie6", to:"elie" },
		{ message: "17qew", to:"tom" },
		{ message: "Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas", to:"elie" },
		{ message: "18de", to:"tom" },
		{ message: "elie8", to:"elie" },
		{ message: "elie9", to:"elie" },
		{ message: "1rgffr", to:"tom" },
		{ message: "17hhgrg", to:"tom" },
		{ message: "elie10", to:"elie" },
		{ message: "elie11", to:"elie" },
	];

	const [messages] = useState<MessageProps[]>(testMessageList);

	useEffect(() => {
		const fetchAchievements = async () => {
			try {
				if (user)
				{
					const len = user.login.length + 39;
					const following_url = user.following_url.substring(0, len);
					const reponse = await axios.get(`${following_url}`);
					setAchievements(reponse.data);
				}
			} catch (err) {
				console.log(err);
			}
		}
		fetchAchievements();
	}, [user])

	useEffect(() => {
		const fetchMatchs = async () => {
			try {
				if (user)
				{
					const len = user.login.length + 39;
					const following_url = user.following_url.substring(0, len);
					const reponse = await axios.get(`${following_url}`);
					setMatchs(reponse.data);
				}
			} catch (err) {
				console.log(err);
			}
		}
		fetchMatchs();
	}, [user])

	// eslint-disable-next-line eqeqeq
	if (user == undefined) {
		return (
			<Stack sx={{width: 1, height: "100vh"}} direction="row" alignItems="center" justifyContent="center">
				<CircularProgress sx={{color: "white"}} />
			</Stack>
		);
	}
	return (
		<Stack sx={{width: 1, height: 1}} direction="row">
			<Stack sx={{ width: 0.2, height: "100vh" }} direction="column" alignItems="center">
				<Stack sx={{ width: 1, height: 1/4 }} direction="column" alignItems="center" justifyContent="center" spacing={3}>
					<Avatar
						src={user?.avatar_url}
						sx={{ width: "126px", height: "126px" }}>
					</Avatar>
					<h2>{user?.login}</h2>
					<h3 style={{ color: 'grey' }}>Join le 03/01/2022</h3>
				</Stack>
				<Stack sx={{ width: 1, height: 1/4, marginLeft: "30%" }} direction="column" justifyContent="center" spacing={4}>
					<h2>Matchs joués : {user?.login}</h2>
					<h2>Classement : {user?.login}</h2>
					<h2 style={{color: '#079200'}}>Victoires : {user?.login}</h2>
					<h2 style={{color: '#C70039'}}>Défaites : {user?.login}</h2>
				</Stack>
				{MyAchievements(achievements)}
			</Stack>
			<Stack sx={{width: 0.6, height: "100vh"}} direction="column">
				{MyHistory(matchs)}
			</Stack>
			{MyChat(user, connected, messages)}
		</Stack>
	);
}

export default StatsPage;
