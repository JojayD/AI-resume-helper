import React, { useEffect, useState } from "react";
import { Comment } from "react-loader-spinner";
import "../Styles/ChatMessage.css";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { TypeAnimation } from "react-type-animation";
function ChatMessage({
	system_message,
	user_message,
	index,
	length,
	setLoadLastIndex,
	isLoadingBot,
	setIsLoadingBot,
	isGptCalled,
	setIsGptCalled,
}) {
	const [typingDone, setTypingDone] = useState(false);
	const res = system_message ? true : false;
	const delay = 100;
	//Implementation of Typing animation
	useEffect(() => {
		renderBotMessage();
	}, [isGptCalled, isLoadingBot]);

	// Assuming setIsGptCalled is meant to be used here to toggle the GPT call status.
	function systemMessageAnimation() {
		return (
			<>
			//TODO change this icon
				<FontAwesomeIcon icon={faRobot} />
				<div className='bg-iphone-receive text-left max-w-sm mx-auto rounded p-6 justify-start'>
					<TypeAnimation
						sequence={[
							system_message,
							() => {
								setTypingDone(true); // Ensure this callback works as expected.
								setIsGptCalled(false); // Consider setting isGptCalled here if it signifies the animation's start.
							},
						]}
						speed={50}
						style={{ fontSize: "1em" }}
					/>
				</div>
			</>
		);
	}

	//PROB: Logic calls db setAnimation loading, when done, setTyping
	//
	function renderBotMessage() {
		if (system_message) {
			if (index === length - 1 && !typingDone && isGptCalled) {
				return systemMessageAnimation(); // Show typing animation
			} else {
				return (
					<div className='mr-7 flex items-center gap-2'>
						<FontAwesomeIcon icon={faRobot} />
						<div
							className={`${
								res ? "bg-iphone-recieve text-left" : "bg-iphone-sent text-right"
							} max-w-sm mx-auto rounded p-6`}
						>
							{system_message}
						</div>
					</div>
				);
			}
		}
		if (user_message) {
			return (
				<div className={"mr-7 flex items-center gap-2 "}>
					<div className='bg-iphone-sent text-right max-w-sm mx-auto rounded p-6'>
						{user_message}
					</div>
					<FontAwesomeIcon icon={faUser} />
				</div>
			);
		}
	}

	return (
		<>
			<div
				className={
					res ? "flex grow items-center " : "flex grow items-center justify-end"
				}
			>
				<div>{renderBotMessage()}</div>
			</div>
		</>
	);
}

export default ChatMessage;
