import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
	const [user, setUser] = useState(null);
	const [userData, setUserData] = useState(null);
	const [squadData, setSquadData] = useState(null);

	return (
		<UserContext.Provider
			value={{ user, setUser, userData, setUserData, squadData, setSquadData }}
		>
			{props.children}
		</UserContext.Provider>
	);
};
