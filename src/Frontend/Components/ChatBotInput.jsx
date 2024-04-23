//http://127.0.0.1:3000/hello
//TODO make user based conversations
//To do that we may need to get jwt token or userId
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import ChatMessage from "./ChatMessage";
import { useCookies } from "react-cookie";
import { useDocument } from "./Context";
import axios from "../../Backend/axiosConfig.mjs";
const apiUrl =
	import.meta.env.MODE === "development"
		? "http://localhost:3000"
		: import.meta.env.VITE_API_URL; // Production API URL from environment variables
function ChatBotInput(props) {
	console.log("APIURL", apiUrl);
	const [fetchCounter, setFetchCounter] = useState(0);
	const [loadLastIndex, setloadLastIndex] = useState(false);
	const [cookies, setCookie, removeCookie] = useCookies(["token"]);
	const [input, setInput] = useState("");
	const [isGptCalled, setIsGptCalled] = useState(false);
	const [loadLastIndexUser, setloadLastIndexUser] = useState(false);
	const [recievedData, setRecievedData] = useState("");
	const [activeConversation, setActiveConversation] = useState([]);
	const [isLoadingBot, setIsLoadingBot] = useState(false);
	const { document, setDocument } = useDocument();
	const navigate = useNavigate();
	const wsUrl =
		process.env.NODE_ENV === "development"
			? "ws://localhost:3000" // WebSocket URL for local development
			: "wss:https://ai-resume-helper-a85984fdef49.herokuapp.com/";  // Secure WebSocket URL for production

	useEffect(() => {
		if (props.userId) {
			console.log(
				`Calling getDataBase here are the arguments ${props.userId} ${document}`
			);
			getDataBase(props.userId, document);
		}
	}, [document, fetchCounter]);

	useEffect(() => {
		console.log("Here is the state authenticated", props.authenticated);
	}, []);

	useEffect(() => {
		const ws = new WebSocket(wsUrl);
		ws.onmessage = (event) => {
			const message = JSON.parse(event);
			console.log(`New Data recieved from ai\nFrom websocket\nr${message}`);
			getDataBase(props.userId, document);
		};
		
	}, []);

	const mapConversation = () => {
		console.log("Mapping");

		return activeConversation.map((message, index) => (
			<div
				className=''
				key={index}
			>
				<div className='flex justify-end '>
					<div className='w-1/2'>
						<ChatMessage
							loadLastIndexUser={loadLastIndexUser}
							setloadLastIndexUser={setloadLastIndexUser}
							user_message={message.user_message}
							index={message.index}
							length={activeConversation.length}
							setloadLastIndex={setloadLastIndex}
							set
						/>
					</div>
				</div>
				<div className='flex justify-start '>
					<div className='w-1/2'>
						<ChatMessage
							setIsLoadingBot={setIsLoadingBot}
							isLoadingBot={isLoadingBot}
							setloadLastIndex={setloadLastIndex}
							system_message={message.system_message}
							index={index}
							length={activeConversation.length}
							isGptCalled={isGptCalled}
							setIsGptCalled={setIsGptCalled}
						/>
					</div>
				</div>
			</div>
		));
	};

	function addToConversation() {
		setFetchCounter((prev) => prev + 1);
	}

	//ASYNC FUNCTIONS
	async function getRes(event) {
		event.preventDefault();
		try {
			console.log("Input before sending: ", input);
			const response = await axios.post(`${apiUrl}/ai`, {
				userMessage: input,
				dataBaseName: props.userId,
				collectionName: document,
			});
			console.log("Recieved data: ", response);
			console.log("GPT data: ", response.data.system_message);
			setloadLastIndex((prev) => !prev);
			setRecievedData(response.data.system_message);
			setIsGptCalled((prev) => !prev);
			addToConversation();
		} catch (error) {
			console.error("Error catching", error);
		}
		setInput("");
	}

	//TODO make sure the database gets called as a
	async function getDataBase(databaseName, collectionName) {
		console.log("Called getDataBase", databaseName);
		const url = `${apiUrl}/get_db?databaseName=${encodeURIComponent(
			databaseName
		)}&collectionName=${encodeURIComponent(collectionName)}`;

		try {
			const response = await axios.get(url);
			console.log(response.data);
			setActiveConversation(response.data);
		} catch (error) {
			console.log(error);
		}
	}

	async function logoutHandler() {
		try {
			const response = await axios.get(`${apiUrl}/logout`, {
				withCredentials: true,
			});
			console.log(response);
			removeCookie("token");
			localStorage.removeItem("token"); // Removing the token from storage
			props.setAuthenticated(false);
			navigate("/");
			console.log("Logged out successfully");
		} catch (error) {
			console.error("Failed to logout", error);
		}
	}

	function handleBackToLogin() {
		navigate("/");
	}
	return (
		<div className='container'>
			{props.authenticated ? (
				<>
					<div className='flex justify-end'>
						<button
							onClick={() => logoutHandler()}
							className='py-2 px-3 bg-cyan-500 text-white text-sm font-semibold rounded-md shadow-lg shadow-cyan-500/50 focus:outline-none'
						>
							Logout
						</button>
					</div>
					<div className='container__input'>
						<form className='flex flex-col justify-center content-center'>
							<label>Enhance Your Resume</label>
							<input
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								id='username'
								type='text'
								placeholder='word'
								value={input}
								onChange={(event) => {
									setInput(event.target.value);
								}}
							/>
							<div className='max-w-24 mx-auto m-2'>
								<button
									onClick={(event) => getRes(event)}
									className='py-2 px-3 bg-cyan-500 text-white text-sm font-semibold rounded-md shadow-lg shadow-cyan-500/50 focus:outline-none w-full'
								>
									Send
								</button>
							</div>
						</form>
						<div className='w-1000 mt-8'>
							<div className='w--full'>{mapConversation()}</div>
						</div>
					</div>
				</>
			) : (
				<div>
					<div>Login to the main menu</div>
					<button onClick={handleBackToLogin}></button>
				</div>
			)}
		</div>
	);
}

export default ChatBotInput;
