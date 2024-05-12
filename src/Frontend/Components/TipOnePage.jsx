import React from "react";
import { Link } from "react-router-dom";

function TipOnePage() {
	return (
		<>
			<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute left-1'>
				<Link to='/'>Back</Link>
			</button>
			<div className='text-white'>
				<div className='text-white font-bold flex flex-col justify-center items-center gap-5'>
					<h1 className='text-3xl'>So you're trying to land job?</h1>
					<p className='text-lg'>Here are some tips to help you get started:</p>
					<div className='w-5/12 my-10'>
						<img
							src='/example-resume.jpg'
							alt='Resume Example 1'
							className='object-contain'
						/>
					</div>
				</div>
				<div className='flex flex-col gap-3'>
					<div>
						<h2 className='text-2xl text-left'>Tip 1</h2>
						<p className='text-lg text-left'>
							Have your name and your relevant contact information on the top
						</p>
					</div>
					<div>
						<h2 className='text-2xl text-left'>Tip 2</h2>
						<p className='text-lg text-left'>
							You can have your education and work experience in a column after
						</p>
					</div>
					<div>
						<h2 className='text-2xl text-left'>Tip 3</h2>
						<p className='text-lg text-left'>
							Experience is key, so make sure to list your most recent experience
							first. Experience could be things like a hackathon, internship, or job.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

export default TipOnePage;
