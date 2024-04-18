import React from "react";
import UserConversations from "./UserConversations";
import ChatBotInput from "./ChatBotInput";
function ChatBotInterface({
	username,
	password,
	setUsername,
	setPassword,
	userId,
	setUserId,
}) {
	return (
		<>
			<UserConversations
				username={username}
				password={password}
				userId={userId}
				setPassword={setPassword}
				setUsername={setUsername}
				setUserId={setUserId}
			/>
			<ChatBotInput
				username={username}
				password={password}
				userId={userId}
				setPassword={setPassword}
				setUsername={setUsername}
				setUserId={setUserId}
			/>
		</>
	);
}

export default ChatBotInterface;
