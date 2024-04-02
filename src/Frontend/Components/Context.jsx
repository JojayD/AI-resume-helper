import React, { createContext, useState, useContext } from "react";

const UserContext = createContext("");

export function UserProvider({ children }) {
	const [document, setDocument] = useState(null);

	// Update user function
	const updateDocument = (userData) => {
		setDocument(userData);
	};

	return (
		<UserContext.Provider value={{ document, setDocument }}>
			{children}
		</UserContext.Provider>
	);
}

// Custom hook for using context
export function useDocument() {
	return useContext(UserContext);
}
