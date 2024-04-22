import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../../Backend/axiosConfig.mjs";
import "../Styles/UserConversations.css";
import { useDocument } from "./Context";
function UserConversations(props) {
	const [userConversations, setUserConversations] = useState([]);
	const [collection, setCollection] = useState("");
	const [deletedCollectionName, setDeleteCollectionName] = useState("");
	const { document, setDocument } = useDocument();

	function conversationLinkHandler(value) {
		setDocument(value);
	}

	async function deleteCollectionHandler(val) {
		console.log("deleteCollectionHandler clicked!");
		console.log("Here is the value of parameter: ", val);
		setDeleteCollectionName(val);
		console.log(deletedCollectionName);
		axios
			.delete(
				`http://127.0.0.1:3000/delete_collection?deletedCollectionName=${encodeURIComponent(
					val
				)}&
		)}&databaseName=${props.userId}`
			)
			.then((response) => {
				console.log("Collection successfully deleted");
				setUserConversations(response.data);
				window.location.reload(); // Refresh the page
			});
	}

	async function createCollectionHandler(collectionName, databaseName) {
		const url = `http://127.0.0.1:3000/create_collection?collectionName=${encodeURIComponent(
			collection
		)}&databaseName=${props.userId}`;
		const response = await axios.post(url);
		setCollection("");
		setUserConversations(response.data);
	}

	useEffect(() => {
		axios(`http://127.0.0.1:3000/get_conversations?database=${props.userId}`)
			.then((result) => {
				console.log(result.data);
				setUserConversations(result.data);
				if (result.data.length > 0) {
					console.log(`Setting document ${result.data[0]}`);
					setDocument(result.data[0]);
				}
			})
			.catch((error) => console.log(error));
	}, [props.userId, document]);

	const renderConversations = () => {
		return userConversations.map((value, index) => (
			<div
				className='bg-iphone-recieve flex justify-between items-center hover:bg-customColor'
				key={index}
			>
				<div className='flex '>
					<MenuItem
						className='hover:bg-white'
						onClick={() => conversationLinkHandler(value)}
					>
						{value}
					</MenuItem>
				</div>

				<div
					className='flex'
					onClick={() => deleteCollectionHandler(value)}
				>
					<FontAwesomeIcon
						icon={faTrashCan}
						className='cursor-pointer	'
					/>
				</div>
			</div>
		));
	};

	return (
		<div className='h-screen flex flex-col content-center items-center bg-iphone-recieve rounded p-4 shadow-lg'>
			<button
				className='border-black border-2 rounded pr-1 pl-1 w-8 mb-2'
				onClick={() => createCollectionHandler(collection, props.userId)}
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
