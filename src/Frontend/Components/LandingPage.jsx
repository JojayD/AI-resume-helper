import React, { useState } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
	// State to track the currently active slide index
	const [activeIndex, setActiveIndex] = useState(0);

	// Array of images to display in the carousel
	const images = ["/resume1.jpg", "/resume2.jpg", "/resume3.jpg"];

	// Function to change the current slide
	const goToSlide = (index) => {
		setActiveIndex(index);
	};

	return (
		<div className='flex flex-col h-screen w-full'>
			<div className='flex flex-col flex-grow'>
				<div className='h-1/3 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
					<div className='flex items-center justify-between w-full flex-grow px-10 py-5'>
						<h1 className='text-5xl font-bold text-white transition-all duration-300 hover:scale-110'>
							GeekResume
						</h1>
						<div className='flex justify-center items-center text-center gap-2'>
							<div className='transition-all duration-300 hover:scale-110'>
								<Link
									to='/TipOne'
									className='text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded'
								>
									Get Tips
								</Link>
							</div>
							<div className='transition-all duration-300 hover:scale-110'>
								<Link
									to='/login'
									className='text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded'
								>
									Login
								</Link>
							</div>
						</div>
					</div>
					<div className='my-4 px-10'>
						<h2 className='text-2xl font-bold text-white text-center'>
							Geek Your Resume, Your Way
						</h2>
						<p className='text-white text-center'>
							Create a resume that stands out from the crowd.
						</p>
					</div>
				</div>
				<div
					id='default-carousel'
					className='relative w-full p-10 flex-grow'
				>
					<div className='relative w-full h-full overflow-hidden rounded-lg'>
						{images.map((src, index) => (
							<div
								key={index}
								className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
									index === activeIndex ? "opacity-100" : "opacity-0 hidden"
								}`}
							>
								<img
									src={src}
									alt={`Slide ${index + 1}`}
									className='w-full h-full object-contain transition-all duration-300 hover:scale-90'
								/>
							</div>
						))}
					</div>
					<div className='absolute z-20 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse transform '>
						{images.map((_, index) => (
							<button
								key={index}
								type='button'
								className={`w-3 h-3 rounded-full ${
									index === activeIndex ? "bg-white" : "bg-gray-500"
								}`}
								aria-label={`Slide ${index + 1}`}
								onClick={() => goToSlide(index)}
							></button>
						))}
					</div>
				</div>
			</div>
			<div className='w-full p-10 text-left text-white flex justify-between'>
				<div>
					<h3 className='text-3xl font-bold'>Use our AI content generator</h3>
					<h3 className='text-3xl font-bold transition-all duration-300 hover:scale-110'>
						<Link to='/login'>Sign Up by</Link>
					</h3>
				</div>

				<div className='flex justify-center items-center'>
					<img
						src='/rocket-solid.svg'
						alt='resume'
						className='w-auto h-12 fill-current text-white'
					/>
				</div>
			</div>
		</div>
	);
}

export default LandingPage;
