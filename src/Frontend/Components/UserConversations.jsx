//Where we left off: Now trying to call useEffect on DB/
//TODO: add delte function
//TODO: make user conversation bar take up all space on the left
import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "../Styles/UserConversations.css";
import { useDocument } from "./Context";
function UserConversations() {
	const [userConversations, setUserConversations] = useState([]);
	const [collection, setCollection] = useState("");
	const [deletedCollectionName, setDeleteCollectionName] = useState("");
	const { document, setDocument } = useDocument();

	function conversationLinkHandler(value) {
		setDocument(value);
	}

	async function deleteCollectionHandler(deletedCollectionName) {
		axios
			.delete(
				`http://127.0.0.1:3000/delete_collection?deletedCollectionName=${deletedCollectionName}`
			)
			.then((response) => {
				console.log("Collection successfully deleted");
				setUserConversations(response.data);
			});
	}

	async function createCollectionHandler() {
		const response = await axios.post(
			`http://127.0.0.1:3000/create_collection?collection=${collection}`
		);
		setCollection("");
		setUserConversations(response.data);
	}

	useEffect(() => {
		axios("http://127.0.0.1:3000/get_conversations")
			.then((result) => {
				console.log(result.data);
				setUserConversations(result.data);
				if (result.data.length > 0) {
					console.log("Setting document");
					setDocument(result.data[0]);
				}
			})
			.catch((error) => console.log(error));
	}, []);

	const renderConversations = () => {
		return userConversations.map((value, index) => (
			<div
				className='bg-iphone-recieve flex justify-between items-center'
				key={index}
			>
				<div className='flex'>
					<MenuItem onClick={() => conversationLinkHandler(value)}>{value}</MenuItem>
				</div>

				<div className='flex' onClick={()=> deleteCollectionHandler(value)}>
					<FontAwesomeIcon icon={faTrashCan} />
				</div>
			</div>
		));
	};

	return (
		<div className='h-screen flex flex-col content-center items-center bg-iphone-recieve rounded p-4 shadow-lg'>
			<button
				className='border-black border-2 rounded pr-1 pl-1 w-8 mb-2'
				onClick={() => createCollectionHandler()}
			>
				<FontAwesomeIcon icon={faPlus} />
			</button>
			<input
				type='text'
				value={collection}
				onChange={(event) => setCollection(event.target.value)}
				className='block mb-2 text-sm font-medium bg-white'
			/>

			<Sidebar className='bg-iphone-recieve '>
				<Menu>{userConversations.length > 0 && renderConversations()}</Menu>
			</Sidebar>
		</div>
	);
}

export default UserConversations;
