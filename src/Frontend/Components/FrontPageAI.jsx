//http://127.0.0.1:3000/hello
import React, { useEffect, useState } from "react";
import axios from "axios";
function FrontPageAI() {
	const [input, setInput] = useState("");
	const [recievedData, setRecievedData] = useState("");
	const handleInputState = () => {};
	useEffect(() => {
		console.log(recievedData);
	}, [recievedData]);


	async function getRes(event) {
		event.preventDefault();
		try {
			console.log("Input before sending: ", input);
			const response = await axios.post("http://127.0.0.1:3000/ai", {message: input});
			setRecievedData(response.data);
			console.log("Recieved data: ", recievedData);
		} catch (error) {
			console.error("Error catching", error);
		}
	}
	return (
		<div className='container'>
			<div className='container__input'>
				<form className='flex flex-col justify-center content-center'>
					<label>Input resume</label>
					<label>Can you make enhance this bullet point for my resume: </label>
					<label>Created web scraping website using Node.js and React </label>
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
							onClick={getRes}
							className='py-2 px-3 bg-cyan-500 text-white text-sm font-semibold rounded-md shadow-lg shadow-cyan-500/50 focus:outline-none w-full'
						>
							Button
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default FrontPageAI;
