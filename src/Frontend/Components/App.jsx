import { useEffect, useState } from "react";
import "/src/Frontend/Styles/App.css";
import ChatBotInput from "./ChatBotInput";
import UserConversations from "./UserConversations";
import ChatBotInterface from "./ChatBotInterface";
import { Routes, Route } from "react-router-dom";
import LoginInterface from "./LoginInterface";
import MakeUserInterface from "./MakeUserInterface";
import "../../Backend/axiosConfig.mjs";
import LandingPage from "./LandingPage";
import TipOnePage from "./TipOnePage";

function App() {
	const [authenticated, setAuthenticated] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [userId, setUserId] = useState("");
	useEffect(() => {
		if (authenticated) {
			document.body.classList.add("bg-white");
			document.body.style.backgroundImage = "none";
		} else {
			document.body.classList.remove("bg-white");
			document.body.style.backgroundImage = "";
		}
	}, [authenticated]);
	useEffect(() => {
		console.log("App.jsx", userId);
	}, [userId]);
	return (
		<>
			<div
				className={
					authenticated
						? "bg-white flex justify-center gap-3"
						: "flex gap-3 justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
				}
			>
				<Routes>
					<Route
						path='/'
						element={<LandingPage />}
					/>
					<Route
						path='/TipOne'
						element={<TipOnePage />}
					/>
					<Route
						path='/Login'
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
