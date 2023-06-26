const baseFunctionUrl = "https://europe-west2-squadzoneapp.cloudfunctions.net/";

export const saveUserData = async (
	id,
	nombre,
	apellidos,
	email,
	nombre_usuario
) => {
	try {
		const functionUrl =
			"https://europe-west2-squadzoneapp.cloudfunctions.net/saveUserData";
		const response = await fetch(functionUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId: id,
				name: nombre,
				lastName: apellidos,
				email: email,
				username: nombre_usuario,
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error ${response.status}`);
		}

		const responseData = await response.json();
		if (responseData.result === "success") {
			console.log("User data saved to Firestore successfully");
		} else {
			console.error("Error saving user data to Firestore:", responseData.error);
		}
	} catch (error) {
		console.error("Error saving user data to Firestore:", error);
	}
};

export const updateUserData = async (userId, userData) => {
	try {
		const functionUrl = `${baseFunctionUrl}updateUserData`;
		const response = await fetch(functionUrl, {
			method: "PUT", // Usa PUT en lugar de POST
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId,
				userData,
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error ${response.status}`);
		}

		const responseData = await response.json();

		if (responseData.result === "success") {
			console.log("User data updated successfully");
		} else {
			throw new Error(
				`Error updating user data in Firestore: ${responseData.error}`
			);
		}
	} catch (error) {
		console.error("Error updating user data in Firestore:", error);
		throw error;
	}
};

export const getUserData = async (userId) => {
	try {
		const functionUrl = `${baseFunctionUrl}getUserData`;
		const response = await fetch(functionUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId: userId,
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error ${response.status}`);
		}

		const responseData = await response.json();

		if (responseData.result === "success") {
			console.log("User data retrieved successfully:", responseData.data);
			return responseData.data;
		} else {
			throw new Error(
				`Error retrieving user data from Firestore: ${responseData.error}`
			);
		}
	} catch (error) {
		console.error("Error retrieving user data from Firestore:", error);
		throw error;
	}
};

export const uploadPhoto = async (id, photo) => {
	try {
		const functionUrl = `${baseFunctionUrl}uploadPhotos`;
		const response = await fetch(functionUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id,
				photo,
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error ${response.status}`);
		}

		const responseData = await response.json();

		if (responseData.result === "success") {
			console.log("Profile photo updated successfully");
		} else {
			throw new Error(
				`Error uploading profile photo to Firestore: ${responseData.error}`
			);
		}
	} catch (error) {
		console.error("Error uploading profile photo to Firestore:", error);
		throw error;
	}
};

export const searchUsers = async (username) => {
	try {
		const response = await fetch(
			"https://europe-west2-squadzoneapp.cloudfunctions.net/searchUsers",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username: username.toLowerCase() }),
			}
		);
		const json = await response.json();
		if (json.result === "success" && Array.isArray(json.data)) {
			return json.data;
		} else {
			console.error("Error: data is not an array");
			return null;
		}
	} catch (error) {
		console.error("Error:", error);
		return null;
	}
};
