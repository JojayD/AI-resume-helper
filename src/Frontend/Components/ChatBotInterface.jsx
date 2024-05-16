import React from "react";
import UserConversations from "./UserConversations";
import { useEffect } from "react";
import ChatBotInput from "./ChatBotInput";
function ChatBotInterface({
	username,
	password,
	setUsername,
	setPassword,
	userId,
	setUserId,
	authenticated,
	setAuthenticated,
}) {
  useEffect(() => {
			if (authenticated) {
				document.body.classList.add("authenticated");
			} else {
				document.body.classList.remove("authenticated");
			}
		}, [authenticated]);
	return (
		<>
			<UserConversations
				authenticated={authenticated}
				setAuthenticated={setAuthenticated}
				username={username}
				password={password}
				userId={userId}
				setPassword={setPassword}
				setUsername={setUsername}
				setUserId={setUserId}
			/>
			<ChatBotInput
				authenticated={authenticated}
				setAuthenticated={setAuthenticated}
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
