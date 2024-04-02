import { useState } from "react";
import "/src/Frontend/Styles/App.css";
import ChatBotInput from "./ChatBotInput";
import UserConversations from "./UserConversations";
import ChatBotInterface from "./ChatBotInterface";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
function App() {
	return (
		<>
			<div className='flex gap-3'>
				<Routes>
					<Route
						path='/'
						element={<ChatBotInterface />}
					/>
					<Route />
				</Routes>
			</div>
		</>
	);
}

export default App;
