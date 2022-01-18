import { User } from "../../../services/Interface/Interface";
import { Channel } from "./interface";
import useUsersChannel from "./useUsersChannel";

function useUserChannel(channel: Channel, me: User) {
	const usersChannel = useUsersChannel(channel);

	return (usersChannel.includes(me));
}

export default useUserChannel;