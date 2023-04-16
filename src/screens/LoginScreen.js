import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons as Ionic } from "@expo/vector-icons";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import ProfileScreen from "./ProfileScreen";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";

import {
	getAuth,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase-config";

export default function LoginScreen({ navigation }) {
	const [email, setEmail] = useState({ value: "", error: "" });
	const [password, setPassword] = useState({ value: "", error: "" });

	const app = initializeApp(firebaseConfig);
	const auth = getAuth(app);

	const onLoginPressed = () => {
		const emailError = emailValidator(email.value);
		const passwordError = passwordValidator(password.value);
		if (emailError || passwordError) {
			setEmail({ ...email, error: emailError });
			setPassword({ ...password, error: passwordError });
			return;
		}
		signInWithEmailAndPassword(auth, email.value, password.value)
			.then((userCredential) => {
				console.log("Signed in!");
				const user = userCredential.user;
				//console.log(user);
				console.log(auth.currentUser.uid);
				//navigation.navigate("Home");
				navigation.reset({
					index: 0,
					routes: [{ name: "Dashboard" }],
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleGoogleLogin = () => {};

	const handleAppleLogin = () => {
		// Perform login with Apple Id
		navigation.reset({
			index: 0,
			routes: [{ name: "Dashboard" }],
		});
	};

	return (
		<Background>
			<BackButton goBack={navigation.goBack} />
			<Logo />
			<Header>QUE DICE LOKO</Header>
			<TextInput
				label="Correo electrónico"
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
			<View style={styles.forgotPassword}>
				<TouchableOpacity
					onPress={() => navigation.navigate("ResetPasswordScreen")}
				>
					<Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
				</TouchableOpacity>
			</View>
			<Button mode="contained" onPress={onLoginPressed}>
				INICIAR SESION
			</Button>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<View style={styles.HorizontalLineR} />
				<Text
					style={{
						marginHorizontal: 8,
						fontFamily: "SF-Pro",
						color: "white",
					}}
				>
					Ó
				</Text>
				<View style={styles.HorizontalLineL} />
			</View>
			<View style={{ flexDirection: "row", alignSelf: "center" }}>
				<View>
					<TouchableOpacity
						onPress={handleGoogleLogin}
						style={styles.otherLoginButton}
					>
						<Ionic
							name="logo-google"
							style={{ fontSize: 50, color: "white" }}
						/>
					</TouchableOpacity>
				</View>
				<View>
					<TouchableOpacity
						onPress={handleAppleLogin}
						style={styles.otherLoginButton}
					>
						<Ionic name="logo-apple" style={{ fontSize: 50, color: "white" }} />
					</TouchableOpacity>
				</View>
			</View>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<View style={styles.HorizontalLine} />
			</View>
			<View style={styles.row}>
				<Text style={{ fontFamily: "SF-Pro", color: "white" }}>
					¿Aún no tienes cuenta?{" "}
				</Text>
				<TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>
					<Text style={styles.link}>Registrate</Text>
				</TouchableOpacity>
			</View>
		</Background>
	);
}

const styles = StyleSheet.create({
	forgotPassword: {
		width: "100%",
		alignItems: "flex-end",
		marginBottom: 24,
	},
	row: {
		flexDirection: "row",
		marginTop: 10,
	},
	forgot: {
		fontFamily: "SF-Pro",
		fontSize: 13,
		color: theme.colors.secondary,
	},
	link: {
		//fontWeight: "bold",
		fontFamily: "SF-Pro",
		color: theme.colors.primary,
	},
	HorizontalLineL: {
		flex: 1,
		borderTopColor: theme.colors.secondary,
		borderTopWidth: 1,
		borderTopStyle: "solid",
		marginLeft: 20,
	},
	HorizontalLineR: {
		flex: 1,
		borderTopColor: theme.colors.secondary,
		borderTopWidth: 1,
		borderTopStyle: "solid",
		marginRight: 20,
	},
	HorizontalLine: {
		flex: 1,
		borderTopColor: theme.colors.secondary,
		borderTopWidth: 1,
		borderTopStyle: "solid",
		marginHorizontal: 0,
		marginVertical: 5,
	},

	otherLoginButton: {
		borderRadius: 10,
		borderColor: "#5EA780",
		borderWidth: 1,
		margin: 10,
		fontSize: 24,
		fontWeight: "500",
		padding: 10,
		alignItems: "center",
	},
});
