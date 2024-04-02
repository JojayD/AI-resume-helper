//http://127.0.0.1:3000/hello
import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatMessage from "./ChatMessage";
import { useDocument } from "./Context";
function ChatBotInput() {
	const [fetchCounter, setFetchCounter] = useState(0);
	const [loadLastIndex, setloadLastIndex] = useState(false);
	const [input, setInput] = useState("");
	const [isGptCalled, setIsGptCalled] = useState(false);
	const [loadLastIndexUser, setloadLastIndexUser] = useState(false);
	const [recievedData, setRecievedData] = useState("");
	const [activeConversation, setActiveConversation] = useState([]);
	const [isLoadingBot, setIsLoadingBot] = useState(false);
	const { document, setDocument } = useDocument();

	useEffect(() => {
		if (document) {
			getDataBase(document);
		}
	}, [document, fetchCounter]);

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:3001");
		ws.onmessage = (event) => {
			const message = JSON.parse(event);
			console.log(`New Data recieved from ai\nFrom websocket\nr${message}`);
			getDataBase(document);
		};
		return () => ws.close();
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
			const response = await axios.post("http://127.0.0.1:3000/ai", {
				user_message: input,
				document: document,
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
	async function getDataBase(databaseName = "user_conversations") {
		console.log("Called getDataBase", databaseName);
		try {
			const response = await axios.get(
				`http://127.0.0.1:3000/get_db?databaseName=${databaseName}`
			);
			console.log(response.data);
			setActiveConversation(response.data);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className='container'>
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
		</div>
	);
}

export default ChatBotInput;
