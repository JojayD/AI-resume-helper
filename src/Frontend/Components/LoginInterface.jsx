
import axios from "axios";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

function LoginInterface(props) {
	const [registerUser, setRegisterUser] = useState(false);
	const navigate = useNavigate();
	function containsNumber(str) {
		return /\d/.test(str);
	}
	async function handleSubmit() {
		
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
