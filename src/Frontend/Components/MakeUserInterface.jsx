import axios from "../../Backend/axiosConfig.mjs";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const apiUrl =
	process.env.NODE_ENV === "development"
		? "http://localhost:3000" // Local API for development
		: process.env.REACT_APP_API_URL; // Production API URL from environment variables
console.log("MakeUserInterface", apiUrl);
function MakeUserInterface(props) {
	const navigate = useNavigate();
	useEffect(() => {
		console.log("User id has changed", props.userId);
	}, [props.userId]);
	async function handleSubmit(event) {
		event.preventDefault();

		try {
			const response = await axios.post(`${apiUrl}/register`, {
				username: props.username,
				password: props.password,
			});
			props.setUsername("");
			props.setPassword("");
			if (response.status === 201) {
				const res = response.data;
				console.log("Here is the response", res);
				console.log("set res: ", res.user._id);
				if (response.data.token) {
					localStorage.setItem("token", response.data.token);
				} else {
					console.error("No token received");
				}
				props.setUserId(res.user._id);
				props.setAuthenticated(true);
				navigate("/Chat");
			} else {
				alert("Failed to register. Please try again.");
			}
		} catch (error) {
			console.error("Registration error:", error);
			alert("An error occurred during registration.");
		}
	}

	return (
		<>
			<div className='h-lvh flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-md w-full space-y-8'>
					<div>
						<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
							Create your account
						</h2>
					</div>
					<form
						className='mt-8 space-y-6'
						onSubmit={handleSubmit}
					>
						<input
							type='hidden'
							name='remember'
							defaultValue='true'
						/>
						<div className='rounded-md shadow-sm -space-y-px'>
							<div>
								<label
									htmlFor='email-address'
									className='sr-only'
								>
									username
								</label>
								<input
									id='username'
									name='username'
									type='text'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
									placeholder='Set or type username'
									value={props.username}
									onChange={(e) => props.setUsername(e.target.value)}
								/>
							</div>
							<div>
								<label
									htmlFor='password'
									className='sr-only'
								>
									Password
								</label>
								<input
									id='password'
									name='password'
									type='password'
									autoComplete='current-password'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
									placeholder='Password'
									value={props.password}
									onChange={(e) => props.setPassword(e.target.value)}
								/>
							</div>
						</div>

						<div>
							<button
								type='submit'
								className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
							>
								Register
							</button>
						</div>
						<div className='flex gap-4 justify-center items-center'>
							<Link to={`/`}>
								<button className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 gap-4 align-middle'>
									<FontAwesomeIcon icon={faArrowLeft} />
								</button>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default MakeUserInterface;
