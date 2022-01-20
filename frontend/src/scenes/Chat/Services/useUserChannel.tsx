import { User } from "../../../services/Interface/Interface";
import { Channel } from "./interface";
import useUsersChannel from "./useUsersChannel";

function useUserChannel(channel: Channel, me: User) {
	const usersChannel = useUsersChannel(channel);

	const res = (usersChannel.filter(user => user.login === me.login))
	return (res.length !== 0);
}

export default useUserChannel;