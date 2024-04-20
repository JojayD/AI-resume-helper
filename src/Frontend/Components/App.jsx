import { useEffect, useState } from "react";
import "/src/Frontend/Styles/App.css";
import ChatBotInput from "./ChatBotInput";
import UserConversations from "./UserConversations";
import ChatBotInterface from "./ChatBotInterface";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import LoginInterface from "./LoginInterface";
import MakeUserInterface from "./MakeUserInterface";

function App() {
	const [authenticated, setAuthenticated] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [userId, setUserId] = useState("");
	useEffect(() => {
		console.log("App.jsx", userId);
	}, [userId]);
	return (
		<>
			<div className='flex gap-3 justify-center'>
				<Routes>
					<Route
						path='/'
						element={
							<LoginInterface
								authenticated={authenticated}
								setAuthenticated={setAuthenticated}
								username={username}
								password={password}
								setUsername={setUsername}
								setPassword={setPassword}
								userId={userId}
								setUserId={setUserId}
							/>
						}
					/>
					<Route
						path='/create'
						element={
							<MakeUserInterface
								authenticated={authenticated}
								setAuthenticated={setAuthenticated}
								username={username}
								password={password}
								setUsername={setUsername}
								setPassword={setPassword}
								setUserId={setUserId}
								userId={userId}
							/>
						}
					/>
					<Route
						path='/Chat'
						element={
							<ChatBotInterface
								authenticated={authenticated}
								setAuthenticated={setAuthenticated}
								username={username}
								password={password}
								setUsername={setUsername}
								setPassword={setPassword}
								userId={userId}
								setUserId={setUserId}
							/>
						}
					/>
					<Route />
				</Routes>
			</div>
		</>
	);
}

export default App;
