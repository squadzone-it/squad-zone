// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.saveUserData = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { userId, name, lastName, email, username } = req.body;

		const defaultPhotoUrl =
			"https://firebasestorage.googleapis.com/v0/b/squadzoneapp.appspot.com/o/defaultPP.png?alt=media&token=7f90b50b-6321-484a-9d14-295fbfcfc32f";

		try {
			await db.collection("users").doc(userId).set({
				name,
				lastName,
				email,
				username,
				photoUrl: defaultPhotoUrl, // Establece el valor por defecto para photoUrl
			});
			console.log("User data saved to Firestore successfully:", userId);
			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error saving user data to Firestore:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.getUserData = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		console.log("Request received:", req.body);

		const { userId } = req.body;
		if (!userId) {
			res.status(400).send("Error: El userId es requerido");
			return;
		}

		try {
			const db = admin.firestore();
			const userRef = db.collection("users").doc(userId);
			const userDoc = await userRef.get();

			if (!userDoc.exists) {
				res.status(404).send("Error: Usuario no encontrado");
				return;
			}

			let userData = userDoc.data();
			const squadRef = db.collection("squads");
			const squadsData = [];

			// Obtiene los datos de cada squad
			for (let squadId of userData.squadInvitations) {
				const squadDoc = await squadRef.doc(squadId).get();

				if (squadDoc.exists) {
					let squadData = squadDoc.data();
					squadData.id = squadDoc.id; // Añade el ID del squad al principio del objeto
					squadsData.push(squadData);
				}
			}

			userData.squadInvitations = squadsData; // Reemplaza las ID de los squads con los datos de los squads

			console.log("User data found:", userData);
			res.status(200).json({ result: "success", data: userData });
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.send("Error: No se pudo obtener la información del usuario");
		}
	});

exports.updateUserData = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "PUT") {
			res.set("Allow", "PUT");
			res.status(405).send("Method not allowed. Please use PUT.");
			return;
		}

		const { userId, userData } = req.body;

		if (!userId || !userData) {
			res.status(400).send("Error: El userId y userData son requeridos");
			return;
		}

		try {
			await db.collection("users").doc(userId).update(userData);
			console.log("User data updated successfully:", userId);
			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error updating user data:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
	projectId: "squadzoneapp",
	keyFilename: "./squadzoneapp-firebase-adminsdk-fo8g5-bb77a364f6.json",
});
const bucketName = "squadzoneapp.appspot.com";

exports.uploadPhotos = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { id, photo } = req.body;

		if (!id) {
			return res.status(400).send("Falta el id para actualizar el usuario");
		}

		if (!photo) {
			return res.status(400).send("No se proporcionó ninguna foto");
		}

		const base64Regex = /^data:image\/\w+;base64,/;
		if (!base64Regex.test(photo)) {
			return res.status(400).send("El formato de la imagen no es base64");
		}

		const base64Data = photo.replace(base64Regex, "");
		const bufferData = Buffer.from(base64Data, "base64");

		const dateTimeString = new Date().toISOString().replace(/[-:.]/g, "");
		const gcsFileName = `${id}_${dateTimeString}.png`;

		const bucket = storage.bucket(bucketName);
		const file = bucket.file(gcsFileName);

		try {
			await file.save(bufferData, {
				contentType: "image/png",
				metadata: {
					cacheControl: "public, max-age=31536000",
				},
			});

			// Generar URL firmado
			const config = {
				action: "read",
				expires: "03-01-2500", // Puedes establecer tu propia fecha de expiración
			};
			const url = await file.getSignedUrl(config);

			try {
				await db.collection("users").doc(id).update({ photoUrl: url[0] });
				console.log("User photo updated successfully:", id);
				res.status(200).send({ result: "success", photoUrl: url[0] });
			} catch (error) {
				console.error("Error updating user photo in Firestore:", error);
				res.status(500).send({ result: "error", error: error.message });
			}
		} catch (error) {
			console.error("Error uploading photo to storage:", error);
			return res.status(500).send(`Error uploading photo: ${error.message}`);
		}
	});

exports.searchUsers = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		console.log("Request received:", req.body);

		const { username } = req.body;
		if (!username) {
			res.status(400).send("Error: El nombre de usuario es requerido");
			return;
		}

		try {
			// Buscar una coincidencia exacta
			const exactMatchSnapshot = await db
				.collection("users")
				.where("username", "==", username)
				.get();

			// Buscar coincidencias parciales
			const partialMatchesSnapshot = await db
				.collection("users")
				.orderBy("username")
				.startAt(username)
				.endAt(username + "\uf8ff")
				.limit(50) // limitamos a los primeros 50 resultados
				.get();

			const exactMatchUsers = exactMatchSnapshot.docs.map((doc) => {
				const data = doc.data();
				data.userId = doc.id; // Agregar el ID del documento
				return data;
			});

			let partialMatchUsers = partialMatchesSnapshot.docs.map((doc) => {
				const data = doc.data();
				data.userId = doc.id; // Agregar el ID del documento
				return data;
			});
			// Filtrar las coincidencias parciales para eliminar la coincidencia exacta
			let filteredPartialMatchUsers = partialMatchUsers.filter(
				(partialMatchUser) =>
					!exactMatchUsers.find(
						(exactMatchUser) =>
							exactMatchUser.username === partialMatchUser.username
					)
			);

			// Reordena los usuarios parciales, los verificados van primero
			filteredPartialMatchUsers.sort((a, b) => {
				if (a.verified && !b.verified) return -1;
				if (!a.verified && b.verified) return 1;
				return 0;
			});

			// Combinar los resultados
			const users = [...exactMatchUsers, ...filteredPartialMatchUsers];

			console.log("User data found:", users);
			res.status(200).json({ result: "success", data: users });
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.send("Error: No se pudo obtener la información de los usuarios");
		}
	});

exports.createSquad = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { displayname, captain } = req.body; // Recibimos el nombre del equipo y el capitán

		try {
			const userRef = db.collection("users").doc(captain);
			const user = await userRef.get();

			// Comprobamos si el usuario ya tiene un equipo
			if (user.exists && user.data().team) {
				res
					.status(400)
					.send({ result: "error", error: "User already in a team" });
				return;
			}

			let name = displayname.toLowerCase();

			// Creamos un nuevo equipo
			const squadData = {
				displayname,
				squadBadgeUrl:
					"https://firebasestorage.googleapis.com/v0/b/squadzoneapp.appspot.com/o/defaultSquadP_transparent.png?alt=media&token=a1272439-9a60-4047-872f-fbd040f6907a.png",
				name,
				captain,
				members: [captain], // El capitán es el primer miembro
				invitations: [], // Inicializamos las invitaciones vacías
				requests: [], // Inicializamos las solicitudes vacías
			};

			const squadRef = db.collection("squads").doc();
			await squadRef.set(squadData);

			// Actualizamos el documento del usuario
			await userRef.update({
				team: squadRef.id,
				//squadInvitations: admin.firestore.FieldValue.arrayUnion(squadRef.id)
			});

			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error creating squad or updating user data:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.deleteSquad = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "DELETE") {
			res.status(400).send("Invalid request method. Please use DELETE.");
			return;
		}

		const { userId, squadId } = req.body;

		try {
			// Obtenemos la Squad
			const squadRef = db.collection("squads").doc(squadId);
			const squadDoc = await squadRef.get();
			const squadData = squadDoc.data();

			// Verificamos que el equipo solo tenga un miembro
			if (squadData.members.length > 1) {
				res.status(400).send({
					result: "error",
					error: "You must expel all members before deleting the squad.",
				});
				return;
			}

			// Eliminar la Squad
			await squadRef.delete();

			// Vacia el campo squad del usuario
			await db.collection("users").doc(userId).update({
				team: admin.firestore.FieldValue.delete(),
				//squadInvitations: admin.firestore.FieldValue.arrayRemove(squadId),
				//squadRequests: admin.firestore.FieldValue.arrayRemove(squadId)
			});

			console.log(
				`Squad ${squadId} deleted successfully and user ${userId} squad field cleared.`
			);
			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error(
				"Error deleting squad and clearing user squad field:",
				error
			);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.inviteToSquad = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { squadId, captainId, userId } = req.body;

		try {
			const squadRef = db.collection("squads").doc(squadId);
			const userRef = db.collection("users").doc(userId);

			// Verificar que el capitán es el que hace la invitación
			const squadDoc = await squadRef.get();
			if (!squadDoc.exists || squadDoc.data().captain !== captainId) {
				res.status(400).send({
					result: "error",
					error: "You must be the captain to invite users.",
				});
				return;
			}

			// Verificar que el usuario no pertenece a un equipo
			const userDoc = await userRef.get();
			if (userDoc.exists && userDoc.data().team) {
				res
					.status(400)
					.send({ result: "error", error: "The user is already in a team." });
				return;
			}

			// Verificar que no exista ya una invitación
			if (squadDoc.data().invitations.includes(userId)) {
				res.status(400).send({
					result: "error",
					error: "The user has already been invited.",
				});
				return;
			}

			// Agregar la invitación
			await squadRef.update({
				invitations: admin.firestore.FieldValue.arrayUnion(userId),
			});

			await userRef.update({
				squadInvitations: admin.firestore.FieldValue.arrayUnion(squadId),
			});

			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error inviting user to squad:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.handleInvitation = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "PUT") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { squadId, userId, accept } = req.body;

		try {
			const squadRef = db.collection("squads").doc(squadId);
			const userRef = db.collection("users").doc(userId);

			// Verificar que el usuario fue invitado
			/*const squadDoc = await squadRef.get();
		if (!squadDoc.exists || !squadDoc.data().invitations.includes(userId)) {
			res.status(400).send({ result: "error", error: "The user was not invited to this squad." });
			return;
		}
		*/

			// Remover la invitación sin importar si el usuario acepta o rechaza
			await squadRef.update({
				invitations: admin.firestore.FieldValue.arrayRemove(userId),
			});

			await userRef.update({
				squadInvitations: admin.firestore.FieldValue.arrayRemove(squadId),
			});

			// Si el usuario acepta la invitación
			if (accept) {
				await squadRef.update({
					members: admin.firestore.FieldValue.arrayUnion(userId),
				});

				await userRef.update({
					team: squadId,
				});
			}

			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error handling squad invitation:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.requestToJoinSquad = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { squadId, userId } = req.body;

		try {
			const squadRef = db.collection("squads").doc(squadId);
			const userRef = db.collection("users").doc(userId);

			const userDoc = await userRef.get();
			const squadDoc = await squadRef.get();

			if (!userDoc.exists || !squadDoc.exists) {
				res
					.status(404)
					.send({ result: "error", error: "User or Squad does not exist." });
				return;
			}

			if (
				userDoc.data().team ||
				(userDoc.data().squadRequests &&
					userDoc.data().squadRequests.includes(squadId))
			) {
				res.status(400).send({
					result: "error",
					error:
						"User already has a team or has already requested to join this squad.",
				});
				return;
			}

			// Añade la solicitud en el equipo
			await squadRef.update({
				requests: admin.firestore.FieldValue.arrayUnion(userId),
			});

			// Añade la solicitud en el usuario
			await userRef.update({
				squadRequests: admin.firestore.FieldValue.arrayUnion(squadId),
			});

			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error creating join request:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.handleRequest = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "PUT") {
			res.status(400).send("Invalid request method. Please use PUT.");
			return;
		}

		const { squadId, userId, accept } = req.body;

		try {
			const squadRef = db.collection("squads").doc(squadId);
			const userRef = db.collection("users").doc(userId);

			const userDoc = await userRef.get();
			const squadDoc = await squadRef.get();

			if (
				!squadDoc.data().requests.includes(userId) &&
				userDoc.data().squadRequests.includes(squadId)
			) {
				res.status(400).send({
					result: "error",
					error: "No request from user to join this squad.",
				});
				return;
			}

			// Aceptamos la solicitud
			if (accept) {
				await squadRef.update({
					members: admin.firestore.FieldValue.arrayUnion(userId),
					requests: admin.firestore.FieldValue.arrayRemove(userId),
				});

				await userRef.update({
					team: squadId,
					squadRequests: admin.firestore.FieldValue.arrayRemove(squadId),
				});
			}
			// Rechazamos la solicitud
			else {
				await squadRef.update({
					requests: admin.firestore.FieldValue.arrayRemove(userId),
				});

				await userRef.update({
					squadRequests: admin.firestore.FieldValue.arrayRemove(squadId),
				});
			}

			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error handling request:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.leaveOrKickSquad = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { userId, squadId } = req.body;

		try {
			const squadRef = db.collection("squads").doc(squadId);
			const squadDoc = await squadRef.get();

			if (!squadDoc.exists) {
				res
					.status(404)
					.send({ result: "error", error: "Squad does not exist." });
				return;
			}

			const members = squadDoc.data().members;
			const captain = squadDoc.data().captain;

			// Si el usuario no es miembro del equipo
			if (!members.includes(userId)) {
				res.status(400).send({
					result: "error",
					error: "User is not a member of the squad.",
				});
				return;
			}

			// Si el usuario es el capitán
			if (captain === userId) {
				// Si es el último miembro, elimina el equipo
				if (members.length === 1) {
					await squadRef.delete();
					console.log(
						`Squad ${squadId} deleted as last member (the captain) left.`
					);
				} else {
					// Si no, haz capitán al siguiente miembro
					const nextCaptain = members.find((member) => member !== userId);
					await squadRef.update({
						captain: nextCaptain,
						members: admin.firestore.FieldValue.arrayRemove(userId),
					});
					console.log(
						`User ${userId} left the squad ${squadId}, and user ${nextCaptain} is now the captain.`
					);
				}
			} else {
				// Si el usuario no es el capitán, simplemente lo eliminamos del equipo
				await squadRef.update({
					members: admin.firestore.FieldValue.arrayRemove(userId),
				});
				console.log(`User ${userId} has been kicked out of squad ${squadId}.`);
			}

			// En todos los casos, actualizamos el documento del usuario para remover el equipo
			const userRef = db.collection("users").doc(userId);
			await userRef.update({
				team: admin.firestore.FieldValue.delete(),
				squadInvitations: admin.firestore.FieldValue.arrayRemove(squadId),
				squadRequests: admin.firestore.FieldValue.arrayRemove(squadId),
			});
			console.log(`User ${userId} has left the squad ${squadId}.`);

			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error leaving or kicking squad:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.editSquad = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { squadId, userId, clubBadgeUrl, description, location } = req.body;

		try {
			const squadRef = db.collection("squads").doc(squadId);
			const squadDoc = await squadRef.get();

			if (!squadDoc.exists) {
				res
					.status(404)
					.send({ result: "error", error: "Squad does not exist." });
				return;
			}

			// Comprobar que el usuario es el capitán del equipo
			const captain = squadDoc.data().captain;
			if (captain !== userId) {
				res.status(403).send({
					result: "error",
					error: "Only the captain can edit the squad.",
				});
				return;
			}

			// Actualizar el documento del equipo
			await squadRef.update({
				clubBadgeUrl,
				description,
				location,
			});

			console.log(`Squad ${squadId} edited successfully by captain ${userId}.`);
			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error editing squad:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.changeRole = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "PUT") {
			res.status(400).send("Invalid request method. Please use PUT.");
			return;
		}

		const { squadId, userId, role } = req.body;

		try {
			const squadRef = db.collection("squads").doc(squadId);
			const squadDoc = await squadRef.get();

			if (!squadDoc.exists) {
				res
					.status(404)
					.send({ result: "error", error: "Squad does not exist." });
				return;
			}

			// Si el role es 'captain', cambiamos el capitán actual
			if (role === "captain") {
				await squadRef.update({
					captain: userId,
				});
			}
			// Si el role es 'veteran', añadimos el userId a la lista de veterans
			else if (role === "veteran") {
				await squadRef.update({
					veterans: admin.firestore.FieldValue.arrayUnion(userId),
				});
			}
			// Si el role es 'down', quitamos el userId de la lista de veterans
			else if (role === "down") {
				await squadRef.update({
					veterans: admin.firestore.FieldValue.arrayRemove(userId),
				});
			} else {
				res.status(400).send({ result: "error", error: "Invalid role." });
				return;
			}

			console.log(
				`Role of member ${userId} changed to ${role} in squad ${squadId}.`
			);
			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error changing role:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.getSquadData = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "GET") {
			res.status(400).send("Invalid request method. Please use GET.");
			return;
		}

		const { squadId } = req.query;

		try {
			const squadDoc = await db.collection("squads").doc(squadId).get();
			if (!squadDoc.exists) {
				res
					.status(404)
					.send({ result: "error", error: "No squad found with this id." });
				return;
			}

			const squadData = squadDoc.data();
			squadData.squadId = squadId;

			// Map member ids to their data
			const memberPromises = squadData.members.map((memberId) =>
				db.collection("users").doc(memberId).get()
			);
			const memberDocs = await Promise.all(memberPromises);
			const memberData = memberDocs.map((doc) => {
				let data = doc.data();
				return { userId: doc.id, ...data };
			});

			// Replace member ids with their data
			squadData.members = memberData;

			// Map request ids to their data
			const requestPromises = squadData.requests.map((requestId) =>
				db.collection("users").doc(requestId).get()
			);
			const requestDocs = await Promise.all(requestPromises);
			const requestData = requestDocs.map((doc) => {
				let data = doc.data();
				return { userId: doc.id, ...data };
			});

			// Replace request ids with their data
			squadData.requests = requestData;

			res.status(200).send({ result: "success", data: squadData });
		} catch (error) {
			console.error("Error fetching squad data:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.searchSquads = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		console.log("Request received:", req.body);

		const { name } = req.body;
		if (!name) {
			res.status(400).send("Error: El nombre del escuadrón es requerido");
			return;
		}

		try {
			// Buscar una coincidencia exacta
			const exactMatchSnapshot = await db
				.collection("squads")
				.where("name", "==", name)
				.get();

			// Buscar coincidencias parciales
			const partialMatchesSnapshot = await db
				.collection("squads")
				.orderBy("name")
				.startAt(name)
				.endAt(name + "\uf8ff")
				.limit(50) // limitamos a los primeros 50 resultados
				.get();

			const exactMatchSquads = exactMatchSnapshot.docs.map((doc) => {
				let data = doc.data();
				return { squadId: doc.id, ...data };
			});

			let partialMatchSquads = partialMatchesSnapshot.docs.map((doc) => {
				let data = doc.data();
				return { squadId: doc.id, ...data };
			});

			// Filtrar las coincidencias parciales para eliminar la coincidencia exacta
			let filteredPartialMatchSquads = partialMatchSquads.filter(
				(partialMatchSquad) =>
					!exactMatchSquads.find(
						(exactMatchSquad) => exactMatchSquad.name === partialMatchSquad.name
					)
			);

			// Combinar los resultados
			const squads = [...exactMatchSquads, ...filteredPartialMatchSquads];

			console.log("Squad data found:", squads);
			res.status(200).json({ result: "success", data: squads });
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.send("Error: No se pudo obtener la información de los escuadrones");
		}
	});

exports.uploadSquadBadge = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { squadId, squadBadge } = req.body;

		if (!squadId) {
			return res.status(400).send("Falta el squadId para actualizar el escudo");
		}

		if (!squadBadge) {
			return res.status(400).send("No se proporcionó ningún escudo");
		}

		const base64Regex = /^data:image\/\w+;base64,/;
		if (!base64Regex.test(squadBadge)) {
			return res
				.status(400)
				.send("El formato de la imagen del escudo no es base64");
		}

		const base64Data = squadBadge.replace(base64Regex, "");
		const bufferData = Buffer.from(base64Data, "base64");

		const dateTimeString = new Date().toISOString().replace(/[-:.]/g, "");
		const gcsFileName = `squad_${squadId}_${dateTimeString}.png`;

		const bucket = storage.bucket(bucketName);
		const file = bucket.file(gcsFileName);

		try {
			await file.save(bufferData, {
				contentType: "image/png",
				metadata: {
					cacheControl: "public, max-age=31536000",
				},
			});

			// Generar URL firmado
			const config = {
				action: "read",
				expires: "03-01-2500", // Puedes establecer tu propia fecha de expiración
			};
			const url = await file.getSignedUrl(config);

			try {
				await db
					.collection("squads")
					.doc(squadId)
					.update({ squadBadgeUrl: url[0] });
				console.log("Squad badge updated successfully:", squadId);
				res.status(200).send({ result: "success", squadBadgeUrl: url[0] });
			} catch (error) {
				console.error("Error updating squad badge in Firestore:", error);
				res.status(500).send({ result: "error", error: error.message });
			}
		} catch (error) {
			console.error("Error uploading squad badge to storage:", error);
			return res
				.status(500)
				.send(`Error uploading squad badge: ${error.message}`);
		}
	});

exports.createMatch = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const {
			status = "open",
			mode,
			gameData,
			players,
			creator,
			squad,
		} = req.body; // Recibimos los datos del partido

		try {
			// Creamos un nuevo partido
			const matchData = {
				status,
				mode,
				gameData: { ...gameData, invitations: [], creator: creator }, // Inicializamos las invitaciones vacías
				teams: {}, // Agregamos el objeto "teams"
			};

			let involvedPlayers;

			if (mode === "pickup") {
				matchData.players = [creator];
				involvedPlayers = [creator];
			} else if (mode === "teamMatch") {
				const teamData = {
					teamId: squad.squadId,
					teamDisplayName: squad.displayName,
					teamBadgeUrl: squad.squadBadgeUrl,
					teamPlayers: squad.players.map((player) => player.id),
 // Guarda solo los ID de los jugadores
				};
				matchData.teams.teamA = teamData; // Ahora "teamA" es parte de "teams"

				involvedPlayers = teamData.teamPlayers;

				if (gameData.suplentes) {
					matchData.gameData.maxPlayers =
						matchData.gameData.maxPlayers + 2 * gameData.suplentes;
				}
			} else {
				throw new Error("Invalid mode. It should be 'pickup' or 'teamMatch'.");
			}

			const matchRef = db.collection("matches").doc();
			console.log("Match document reference created with ID:", matchRef.id);
			await matchRef.set(matchData);
			console.log("Match data successfully written to Firestore.");

			// Añade el ID del partido a la lista myMatches de cada jugador involucrado
			const userCollection = db.collection("users");
			for (let playerId of involvedPlayers) {
				const userRef = userCollection.doc(playerId);
				await userRef.update({
					myMatches: admin.firestore.FieldValue.arrayUnion(matchRef.id),
				});
				console.log("Match ID added to user's myMatches array:", playerId);
			}

			res.status(200).send({ result: "success", matchId: matchRef.id });
			console.log("Match created successfully with ID:", matchRef.id);
		} catch (error) {
			console.error("Error creating match:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.startMatch = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { matchId, startType, teams } = req.body; // Recibimos el ID del partido, el tipo de inicio y la estructura de los equipos (si se proporciona)

		try {
			const matchRef = db.collection("matches").doc(matchId);
			const match = await matchRef.get();

			const matchData = match.data();

			if (
				matchData.mode === "pickup" &&
				(startType === "random" || startType === "manual")
			) {
				// Creamos una copia de la lista de jugadores
				let players = [...matchData.players];

				// Creamos los equipos vacíos
				let teamA = [];
				let teamB = [];

				if (startType === "random") {
					// Mientras haya jugadores, vamos seleccionando uno aleatoriamente y lo asignamos a un equipo
					while (players.length > 0) {
						let randomIndex = Math.floor(Math.random() * players.length);
						let player = players[randomIndex];

						// Asignamos el jugador a un equipo, alternando entre el equipo A y el equipo B
						if (teamA.length < teamB.length) {
							teamA.push(player);
						} else {
							teamB.push(player);
						}

						// Eliminamos el jugador de la lista
						players.splice(randomIndex, 1);
					}
				} else if (startType === "manual") {
					// Asignamos los equipos proporcionados
					teamA = teams.teamA;
					teamB = teams.teamB;
				}

				// Actualizamos los equipos en la base de datos
				await matchRef.update({
					"teams.teamA": teamA,
					"teams.teamB": teamB,
					status: "in-progress",
				});

				res.status(200).send({ result: "success" });
			} else if (matchData.mode === "teamMatch") {
				// No es necesario proporcionar los equipos, ya que estos ya están predefinidos

				// Actualizamos el estado del partido en la base de datos
				await matchRef.update({
					status: "in-progress",
				});

				res.status(200).send({ result: "success" });
			} else {
				res.status(400).send({
					result: "error",
					error:
						"Only pickup matches can be started with random or manually selected teams.",
				});
			}
		} catch (error) {
			console.error("Error starting match:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

//despues de aqui hay q hablar mas las apis

exports.joinMatch = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { matchId, playerId } = req.body; // Recibimos el ID del partido y la ID del jugador

		try {
			const matchRef = db.collection("matches").doc(matchId);
			const matchDoc = await matchRef.get();

			if (!matchDoc.exists) {
				res.status(404).send({ result: "error", error: "Match not found." });
				return;
			}

			const matchData = matchDoc.data();

			if (matchData.status !== "open") {
				res.status(400).send({ result: "error", error: "Match is not open." });
				return;
			}

			if (matchData.players.includes(playerId)) {
				res
					.status(400)
					.send({ result: "error", error: "Player is already in the match." });
				return;
			}

			if (matchData.players.length >= matchData.gameData.maxPlayers) {
				res.status(400).send({ result: "error", error: "Match is full." });
				return;
			}

			// Agregamos el jugador al partido
			await matchRef.update({
				players: admin.firestore.FieldValue.arrayUnion(playerId),
			});

			// Agregamos el partido al campo myMatches del jugador
			const userRef = db.collection("users").doc(playerId);
			await userRef.update({
				myMatches: admin.firestore.FieldValue.arrayUnion(matchId),
			});

			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error joining match:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.joinMatchAsTeam = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { matchId, teamId, teamPlayers, teamBadgeUrl, teamDisplayName } =
			req.body;

		try {
			const matchRef = db.collection("matches").doc(matchId);
			const matchDoc = await matchRef.get();

			if (!matchDoc.exists) {
				res.status(404).send({ result: "error", error: "Match not found." });
				return;
			}

			const matchData = matchDoc.data();

			// Si "squads" no existe en matchData, lo establecemos como un objeto vacío
			if (!matchData.hasOwnProperty("teams")) {
				matchData.squads = {};
			}

			if (matchData.status !== "open") {
				res.status(400).send({ result: "error", error: "Match is not open." });
				return;
			}

			if (matchData.mode !== "teamMatch") {
				res
					.status(400)
					.send({ result: "error", error: "Match mode is not 'teamMatch'." });
				return;
			}

			// Agregamos el equipo al partido
			const teamLetter =
				Object.keys(matchData.teams).length === 0 ? "teamA" : "teamB";
			await matchRef.update({
				[`teams.${teamLetter}`]: {
					teamId,
					teamPlayers: teamPlayers,
					teamBadgeUrl,
					teamDisplayName,
				},
			});

			const userRef = db.collection("users");
			const squadRef = db.collection("squads").doc(teamId);
			const batch = db.batch();

			teamPlayers.forEach((playerId) => {
				const ref = userRef.doc(playerId);
				batch.update(ref, {
					myMatches: admin.firestore.FieldValue.arrayUnion(matchId),
				});
			});

			// Agregamos el partido al campo myMatches del equipo
			batch.update(squadRef, {
				myMatches: admin.firestore.FieldValue.arrayUnion(matchId),
			});

			await batch.commit();

			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error joining match as team:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.getMatchData = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "GET") {
			res.status(400).send("Invalid request method. Please use GET.");
			return;
		}

		const { matchId } = req.query;

		try {
			const matchRef = db.collection("matches").doc(matchId);
			const matchDoc = await matchRef.get();

			if (!matchDoc.exists) {
				res.status(404).send({ result: "error", error: "Match not found." });
				return;
			}

			let matchData = matchDoc.data();
			matchData.matchId = matchId;

			// Get player details
			const userCollection = db.collection("users");

			if (matchData.mode === "pickup") {
				const promises = matchData.players.map(async (playerId) => {
					const userRef = userCollection.doc(playerId);
					const userDoc = await userRef.get();
					let userData = userDoc.data();
					userData.id = playerId; // add id to the user data
					return userData;
				});

				matchData.players = await Promise.all(promises);
			} else if (matchData.mode === "teamMatch") {
				if (matchData.teams.teamA) {
					const promisesA = matchData.teams.teamA.teamPlayers.map(
						async (playerId) => {
							const userRef = userCollection.doc(playerId);
							const userDoc = await userRef.get();
							let userData = userDoc.data();
							userData.id = playerId; // add id to the user data
							return userData;
						}
					);
					matchData.teams.teamA.teamPlayers = await Promise.all(promisesA);
				}

				if (matchData.teams.teamB) {
					const promisesB = matchData.teams.teamB.teamPlayers.map(
						async (playerId) => {
							const userRef = userCollection.doc(playerId);
							const userDoc = await userRef.get();
							let userData = userDoc.data();
							userData.id = playerId; // add id to the user data
							return userData;
						}
					);
					matchData.teams.teamB.teamPlayers = await Promise.all(promisesB);
				}
			} else {
				throw new Error("Invalid match mode");
			}

			res.status(200).send({ result: "success", data: matchData });
		} catch (error) {
			console.error("Error getting match data:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

//el admin supongo que sea el que crea el partido
//simplemente el creador del partido(que sera el jugador 0), sera quien pueda echar a la gente (manejo desde el front)
exports.leaveOrKickMatch = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { matchId, playerId } = req.body; // Recibimos el ID del partido, el ID del jugador que quiere abandonar

		try {
			const matchRef = db.collection("matches").doc(matchId);
			const matchDoc = await matchRef.get();

			if (!matchDoc.exists) {
				res.status(404).send({ result: "error", error: "Match not found." });
				return;
			}

			let matchData = matchDoc.data();
			console.log("Match data:", matchData);
			console.log("Player ID:", playerId);

			// Comprobamos si el jugador es miembro del partido
			if (!matchData.players.includes(playerId)) {
				res
					.status(400)
					.send({ result: "error", error: "Player is not part of the match." });
				return;
			}

			// Si el jugador es quien quiere abandonar el partido, lo eliminamos de la lista de jugadores
			if (playerId) {
				// Crear una nueva lista de jugadores sin el jugador que quiere abandonar
				let updatedPlayers = matchData.players.filter(
					(player) => player !== playerId
				);

				// Actualizamos los datos del partido en la base de datos
				await matchRef.update({ players: updatedPlayers });

				// Referencia al jugador en la colección de usuarios
				const userRef = db.collection("users").doc(playerId);

				// Eliminamos el partido de la lista de partidos del jugador
				await userRef.update({
					myMatches: admin.firestore.FieldValue.arrayRemove(matchId),
				});

				res.status(200).send({ result: "success" });
			} else {
				res.status(403).send({
					result: "error",
					error:
						"Only the player themselves can remove themselves from a match.",
				});
			}
		} catch (error) {
			console.error("Error leaving or kicking match:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.getAllMatches = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "GET") {
			res.status(400).send("Invalid request method. Please use GET.");
			return;
		}

		try {
			const matchesRef = db.collection("matches");
			const snapshot = await matchesRef.limit(50).get();

			if (snapshot.empty) {
				res.status(404).send({ result: "error", error: "No matches found." });
				return;
			}

			let matchesData = [];
			snapshot.forEach((doc) => {
				let data = doc.data();
				data.matchId = doc.id;
				matchesData.push(data);
			});

			res.status(200).send({ result: "success", data: matchesData });
		} catch (error) {
			console.error("Error getting matches data:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.getUserMatches = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "GET") {
			res.status(400).send("Invalid request method. Please use GET.");
			return;
		}

		const { userId } = req.query; // Recibimos el ID del usuario

		try {
			const userRef = db.collection("users").doc(userId);
			const userDoc = await userRef.get();

			if (!userDoc.exists) {
				res.status(404).send({ result: "error", error: "User not found." });
				return;
			}

			const userData = userDoc.data();
			const matchesRef = db.collection("matches");

			// Iteramos sobre myMatches del usuario y obtenemos los datos de cada partido
			const matchPromises = userData.myMatches.map(async (matchId) => {
				const matchDoc = await matchesRef.doc(matchId).get();

				if (matchDoc.exists) {
					let matchData = matchDoc.data();
					matchData.matchId = matchId;

					// Añadimos los detalles de los jugadores
					const userCollection = db.collection("users");
					const playerPromises = matchData.players.map(async (playerId) => {
						const userDoc = await userCollection.doc(playerId).get();
						return userDoc.data(); // Este devuelve un objeto con los datos del usuario
					});

					matchData.players = await Promise.all(playerPromises);

					return matchData;
				}

				return null; // Si no se encuentra el partido, se devuelve null
			});

			const userMatches = await Promise.all(matchPromises);
			res.status(200).send({
				result: "success",
				data: userMatches.filter((match) => match),
			}); // Filtramos las posibles respuestas nulas
		} catch (error) {
			console.error("Error getting user matches:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.editSquadMatch = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { matchId, newTeamPlayers, playerId } = req.body;

		try {
			const matchRef = db.collection("matches").doc(matchId);
			const matchDoc = await matchRef.get();

			if (!matchDoc.exists) {
				res.status(404).send({ result: "error", error: "Match not found." });
				return;
			}

			const matchData = matchDoc.data();

			let team;
			if (matchData.teams.teamA.teamPlayers.includes(playerId)) {
				team = "teamA";
			} else if (matchData.teams.teamB.teamPlayers.includes(playerId)) {
				team = "teamB";
			} else {
				throw new Error("Player is not part of this match");
			}

			const currentTeamPlayers = matchData.teams[team].teamPlayers;
			const addedPlayers = newTeamPlayers.filter(
				(player) => !currentTeamPlayers.includes(player)
			);
			const removedPlayers = currentTeamPlayers.filter(
				(player) => !newTeamPlayers.includes(player)
			);

			// Update team players
			await matchRef.update({
				[`teams.${team}.teamPlayers`]: newTeamPlayers,
			});

			const userRef = db.collection("users");
			const batch = db.batch();

			addedPlayers.forEach((playerId) => {
				const ref = userRef.doc(playerId);
				batch.update(ref, {
					myMatches: admin.firestore.FieldValue.arrayUnion(matchId),
				});
			});

			removedPlayers.forEach((playerId) => {
				const ref = userRef.doc(playerId);
				batch.update(ref, {
					myMatches: admin.firestore.FieldValue.arrayRemove(matchId),
				});
			});

			await batch.commit();

			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error editing match:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.leaveAsTeam = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { matchId, teamId } = req.body; // Recibimos el ID del partido y el ID del equipo

		try {
			const matchRef = db.collection("matches").doc(matchId);
			const matchDoc = await matchRef.get();

			if (!matchDoc.exists) {
				res.status(404).send({ result: "error", error: "Match not found." });
				return;
			}

			const matchData = matchDoc.data();

			let teamKey;
			if (matchData.squads?.squadA?.teamId === teamId) {
				teamKey = "squadA";
			} else if (matchData.squads?.squadB?.teamId === teamId) {
				teamKey = "squadB";
			}

			if (!teamKey) {
				res
					.status(400)
					.send({ result: "error", error: "Team is not part of the match." });
				return;
			}

			const teamPlayers = matchData.squads[teamKey].players;

			// Remove the team from the match
			await matchRef.update({
				[`squads.${teamKey}`]: admin.firestore.FieldValue.delete(),
			});

			const userRef = db.collection("users");
			const squadRef = db.collection("squads").doc(teamId);
			const batch = db.batch();

			// Remove match from each player's myMatches array
			teamPlayers.forEach((playerId) => {
				const ref = userRef.doc(playerId);
				batch.update(ref, {
					myMatches: admin.firestore.FieldValue.arrayRemove(matchId),
				});
			});

			// Remove the match from the squad's myMatches
			batch.update(squadRef, {
				myMatches: admin.firestore.FieldValue.arrayRemove(matchId),
			});

			await batch.commit();

			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error when team leaving the match:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.endMatch = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { matchId, playerId, result } = req.body;

		try {
			const matchRef = db.collection("matches").doc(matchId);
			const match = await matchRef.get();

			if (!match.exists) {
				res.status(404).send({ result: "error", error: "Match not found." });
				return;
			}

			const matchData = match.data();
			if (matchData.status !== "in-progress") {
				res
					.status(400)
					.send({ result: "error", error: "Match is not in-progress." });
				return;
			}

			// Check if player is part of the match
			let isPlayerInMatch = false;
			Object.keys(matchData.squads).forEach((squadKey) => {
				if (matchData.squads[squadKey].players.includes(playerId)) {
					isPlayerInMatch = true;
				}
			});
			if (!isPlayerInMatch) {
				res
					.status(400)
					.send({ result: "error", error: "Player is not part of the match." });
				return;
			}

			await matchRef.update({
				status: "awaiting-confirmation",
				resultSuggestion: {
					result,
					suggestedBy: playerId,
				},
			});

			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error ending match:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});

exports.acceptMatchResult = functions
	.region("europe-west2")
	.https.onRequest(async (req, res) => {
		if (req.method !== "POST") {
			res.status(400).send("Invalid request method. Please use POST.");
			return;
		}

		const { matchId, playerId } = req.body;

		try {
			const matchRef = db.collection("matches").doc(matchId);
			const match = await matchRef.get();

			if (!match.exists) {
				res.status(404).send({ result: "error", error: "Match not found." });
				return;
			}

			const matchData = match.data();

			if (matchData.status !== "awaiting-confirmation") {
				res.status(400).send({
					result: "error",
					error: "Match is not awaiting confirmation.",
				});
				return;
			}

			if (matchData.resultSuggestion.suggestedBy === playerId) {
				res.status(400).send({
					result: "error",
					error: "Player cannot accept their own result.",
				});
				return;
			}

			let playerTeam = null;
			let suggesterTeam = null;
			Object.keys(matchData.squads).forEach((squadKey) => {
				if (matchData.squads[squadKey].players.includes(playerId)) {
					playerTeam = squadKey;
				}
				if (
					matchData.squads[squadKey].players.includes(
						matchData.resultSuggestion.suggestedBy
					)
				) {
					suggesterTeam = squadKey;
				}
			});

			if (playerTeam === suggesterTeam) {
				res.status(400).send({
					result: "error",
					error: "Player cannot accept result from the same team.",
				});
				return;
			}

			await matchRef.update({
				status: "completed",
				result: matchData.resultSuggestion.result,
			});

			res.status(200).send({ result: "success" });
		} catch (error) {
			console.error("Error accepting match result:", error);
			res.status(500).send({ result: "error", error: error.message });
		}
	});