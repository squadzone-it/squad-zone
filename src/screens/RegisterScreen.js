import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";

import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
	getFirestore,
	setDoc,
	doc,
	collection,
	query,
	where,
	getDocs,
} from "firebase/firestore";
import { firebaseConfig } from "../../firebase-config";
import { getFunctions, httpsCallable } from "firebase/functions"; // Importa httpsCallable

export default function RegisterScreen({ navigation }) {
	const [name, setName] = useState({ value: "", error: "" });
	const [lastName, setLastName] = useState({ value: "", error: "" });
	const [username, setUsername] = useState({ value: "", error: "" });
	const [email, setEmail] = useState({ value: "", error: "" });
	const [password, setPassword] = useState({ value: "", error: "" });
	const [confirmPassword, setConfirmPassword] = useState({
		value: "",
		error: "",
	});

	const app = initializeApp(firebaseConfig);
	const auth = getAuth(app);
	const db = getFirestore(app);
	const functions = getFunctions(app);

	const saveUserData = async (id, nombre, apellidos, email, nombre_usuario) => {
		try {
			const functionUrl =
				"https://europe-west2-squadzoneapp.cloudfunctions.net/saveUserData"; // Reemplaza esto con la URL de tu función de Cloud
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
				console.error(
					"Error saving user data to Firestore:",
					responseData.error
				);
			}
		} catch (error) {
			console.error("Error saving user data to Firestore:", error);
		}
	};

	const onSignUpPressed = async () => {
		const nameError = nameValidator(name.value);
		const lastNameError = nameValidator(lastName.value);
		const usernameError = nameValidator(username.value);
		const emailError = emailValidator(email.value);
		const passwordError = passwordValidator(password.value);
		const confirmPasswordError =
			password.value !== confirmPassword.value ? "Passwords do not match" : "";

		if (
			emailError ||
			passwordError ||
			nameError ||
			lastNameError ||
			usernameError ||
			confirmPasswordError
		) {
			setName({ ...name, error: nameError });
			setLastName({ ...lastName, error: lastNameError });
			//setUsername({ ...username, error: usernameError });
			setEmail({ ...email, error: emailError });
			setPassword({ ...password, error: passwordError });
			setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
			return;
		}

		const usernameQuery = query(
			collection(db, "users"),
			where("username", "==", username.value)
			//console.log(username.value)
		);
		const querySnapshot = await getDocs(usernameQuery);
		if (!querySnapshot.empty) {
			setUsername({ ...username, error: "Username is already in use." });
			return;
		}

		createUserWithEmailAndPassword(auth, email.value, password.value)
			.then(async (userCredential) => {
				console.log("Account created!");
				const user = userCredential.user;
				updateProfile(auth.currentUser, {
					displayName: username.value,
				});
				try {
					// Call the API to save user data to Firestore
					await saveUserData(
						auth.currentUser.uid,
						name.value,
						lastName.value,
						email.value,
						username.value
					);
				} catch (e) {
					console.error("Error adding document: ", e);
				}
				//console.log(user);

				navigation.reset({
					index: 0,
					routes: [{ name: "Dashboard" }],
				});
				//navigation.navigate("Login");
			})
			.catch((error) => {
				if (error.code === "auth/email-already-in-use") {
					console.log("That email address is already in use!");
				}

				if (error.code === "auth/invalid-email") {
					console.log("That email address is invalid!");
				}

				console.error(error);
			});
	};

	return (
		<Background>
			<BackButton goBack={navigation.goBack} />

			<Header>CREAR CUENTA</Header>
			<TextInput
				label="Nombre"
				returnKeyType="next"
				value={name.value}
				onChangeText={(text) => setName({ value: text, error: "" })}
				error={!!name.error}
				errorText={name.error}
			/>
			<TextInput
				label="Apellidos"
				returnKeyType="next"
				value={lastName.value}
				onChangeText={(text) => setLastName({ value: text, error: "" })}
				error={!!lastName.error}
				errorText={lastName.error}
			/>
			<TextInput
				label="Nombre de usuario"
				returnKeyType="next"
				value={username.value}
				onChangeText={(text) =>
					setUsername({ value: text.toLowerCase(), error: "" })
				}
				error={!!username.error}
				errorText={username.error}
			/>
			<TextInput
				label="Correo Electrónico"
				returnKeyType="next"
				value={email.value}
				onChangeText={(text) => setEmail({ value: text, error: "" })}
				error={!!email.error}
				errorText={email.error}
				autoCapitalize="none"
				autoCompleteType="email"
				textContentType="emailAddress"
				keyboardType="email-address"
			/>
			<TextInput
				label="Contraseña"
				returnKeyType="done"
				value={password.value}
				onChangeText={(text) => setPassword({ value: text, error: "" })}
				error={!!password.error}
				errorText={password.error}
				secureTextEntry
			/>
			<TextInput
				label="Confirmar contraseña"
				returnKeyType="done"
				value={confirmPassword.value}
				onChangeText={(text) => setConfirmPassword({ value: text, error: "" })}
				error={!!confirmPassword.error}
				errorText={confirmPassword.error}
				secureTextEntry
			/>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<View style={styles.HorizontalLine} />
			</View>
			<Button
				mode="contained"
				onPress={onSignUpPressed}
				style={{ marginTop: 10 }}
			>
				REGISTRARSE
			</Button>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<View style={styles.HorizontalLine} />
			</View>
			<View style={styles.row}>
				<Text style={{ fontFamily: "SF-Pro", color: "white" }}>
					¿Ya tienes una cuenta?{" "}
				</Text>
				<TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
					<Text style={styles.link}>Inicia sesion</Text>
				</TouchableOpacity>
			</View>
		</Background>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		marginTop: 4,
	},
	link: {
		//fontWeight: "bold",
		color: theme.colors.primary,
		fontFamily: "SF-Pro",
	},
	HorizontalLine: {
		flex: 1,
		borderTopColor: theme.colors.secondary,
		borderTopWidth: 1,
		borderTopStyle: "solid",
		marginHorizontal: 0,
		marginVertical: 5,
	},
});
