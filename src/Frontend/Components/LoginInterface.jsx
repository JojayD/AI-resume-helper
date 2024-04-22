import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "../../Backend/axiosConfig.mjs";

function LoginInterface(props) {
	const navigate = useNavigate();
	const apiUrl =
		process.env.NODE_ENV === "development"
			? "http://localhost:3000" // Local API for development
			: process.env.REACT_APP_API_URL; // Production API URL from environment variables

	console.log("Final API URL:", apiUrl);

	async function handleSubmit(event) {
		event.preventDefault();
		try {
			const response = await axios.post(`${apiUrl}/login`, {
				username: props.username,
				password: props.password,
			});

			if (response.status === 201) {
				localStorage.setItem("token", response.data.token); // Store the token
				props.setUserId(response.data.user._id);
				props.setAuthenticated(true);
				navigate("/Chat");
			} else {
				alert("Failed to login. Please try again.");
			}
		} catch (error) {
			console.error("Login error:", error);
			alert("An error occurred during login.");
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Sign in to your account
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
								id='user'
								name='user'
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

					<div className='flex gap-2 max-h-12 justify-center'>
						<button
							type='submit'
							className='group py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
						>
							Sign in
						</button>
						<Link to='/create'>
							<button className='group  py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
								Create an account
							</button>
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

export default LoginInterface;
