class ApiService {
	async getUserData(uid) {
		try {
			const response = await fetch(
				"https://readdatauser-zvcc2bcxkq-nw.a.run.app/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						id: uid,
					}),
				}
			);

			if (response.ok) {
				const data = await response.json();
				console.log("Datos del usuario obtenidos correctamente:", data);
				return data;
			} else {
				console.error(
					"Error al obtener los datos del usuario:",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Error al obtener los datos del usuario:", error);
		}
	}

	async updateUserData(uid, userData) {
		const requestBody = {
			id: uid,
			userData: userData,
		};

		console.log("JSON enviado:", JSON.stringify(requestBody, null, 2));

		try {
			const response = await fetch(
				"https://updateuserdata-zvcc2bcxkq-nw.a.run.app/updateUserData",
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(requestBody, null, 2),
				}
			);

			if (!response.ok) {
				throw new Error(`Error en la solicitud: ${response.status}`);
			}

			const data = await response;
			console.log("Datos actualizados");
			//console.log("Datos actualizados:", data);
			//navigation.navigate('PerfilScreen', { id });
		} catch (error) {
			//setError(error.message);
			console.log("Error al actualizar los datos:", error);
		}
	}
}

export default ApiService;
