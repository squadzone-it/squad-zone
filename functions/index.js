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

		try {
			await db.collection("users").doc(userId).set({
				name,
				lastName,
				email,
				username,
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
		console.log("Request received:", req.body); // Agrega esta línea

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

			console.log("User data found:", userDoc.data()); // Agrega esta línea
			res.status(200).json({ result: "success", data: userDoc.data() }); // Agrega el objeto "result"
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
  .region('europe-west2')
  .https.onRequest(async (req, res) => {
    console.log("Request received:", req.body); // Agrega esta línea

    const { username } = req.body;
    if (!username) {
      res.status(400).send("Error: El nombre de usuario es requerido");
      return;
    }

    try {
      // Buscar una coincidencia exacta
      const exactMatchSnapshot = await db.collection('users')
        .where('username', '==', username)
        .get();

      // Buscar coincidencias parciales
      const partialMatchesSnapshot = await db.collection('users')
        .orderBy('username')
        .startAt(username)
        .endAt(username + '\uf8ff')
        .limit(50) // limitamos a los primeros 50 resultados
        .get();

      const exactMatchUsers = exactMatchSnapshot.docs.map(doc => doc.data());
      const partialMatchUsers = partialMatchesSnapshot.docs.map(doc => doc.data());

      // Filtrar las coincidencias parciales para eliminar la coincidencia exacta
      const filteredPartialMatchUsers = partialMatchUsers.filter(
        partialMatchUser => !exactMatchUsers.find(
          exactMatchUser => exactMatchUser.username === partialMatchUser.username
        )
      );

      // Combinar los resultados
      const users = [...exactMatchUsers, ...filteredPartialMatchUsers];

      console.log("User data found:", users); // Agrega esta línea
      res.status(200).json({ result: "success", data: users }); // Agrega el objeto "result"
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: No se pudo obtener la información de los usuarios");
    }
  });
  
  
  
  
