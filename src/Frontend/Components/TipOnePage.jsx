import { set } from "mongoose";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { resumeTips } from "../../Backend/data";
function TipOnePage() {
	const [currentTip, setCurrentTip] = useState(0);
	const [isSliding, setSliding] = useState(false);
	const [slideDirection, setSlideDirection] = useState("");
	const handleNext = () => {
		if (currentTip < resumeTips.length - 1) {
			setSliding(true);
			setSlideDirection("right");
			setTimeout(() => {
				setCurrentTip(currentTip + 1);
				setSliding(false);
			}, 500);
		}
	};

	const handleBack = () => {
		if (currentTip > 0) {
			setSliding(true);
			setSlideDirection("left");
			setTimeout(() => {
				setCurrentTip(currentTip - 1);
				setSliding(false);
			}, 500);
		}
	};

	return (
		<>
			<div className='mx-auto h-screen'>
				<button className='bg-cyan-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute left-1'>
					<Link to='/'>Back</Link>
				</button>
				<div className='text-white'>
					<div className='text-white font-bold flex flex-col justify-center items-center gap-5'>
						<h1 className='text-3xl'>So you're trying to land job?</h1>
						<p className='text-lg'>Here are some tips to help you get started:</p>
						<div className='w-4/12 my-10'>
							<img
								src='/example-resume.jpg'
								alt='Resume Example 1'
								className='object-contain'
							/>
						</div>
					</div>
					<div className='flex justify-between'>
						<button
							onClick={handleBack}
							className='py-1 px-2 bg-cyan-500 text-white text-sm font-semibold rounded-md shadow-lg shadow-cyan-500/50 focus:outline-none'
						>
							back
						</button>
						<div
							className={`transition-transform duration-500 transform ${
								isSliding ? "translate-y-[400%]" : "translate-y-0"
							}`}
						>
							<h2 className='underline'>{resumeTips[currentTip].title}</h2>
							<h2>{resumeTips[currentTip].content}</h2>
						</div>
						<button
							onClick={handleNext}
							className='py-1 px-2 bg-cyan-500 text-white text-sm font-semibold rounded-md shadow-lg shadow-cyan-500/50 focus:outline-none'
						>
							next
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default TipOnePage;
