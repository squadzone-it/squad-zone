import {
	View,
	Text,
	StatusBar,
	Image,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import Ionic from "react-native-vector-icons/Ionicons";
import BackgroundTabs from "../components/BackgroundTabs";
import { theme } from "../core/theme";
import React, { useState, useEffect } from "react";
import TextInput from "../components/TextInput";
import Paragraph from "../components/Paragraph";
import ApiService from "../components/ApiService";

import { useNavigation } from "@react-navigation/native";

import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase-config";

let uid = null;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.onAuthStateChanged(function (user) {
	if (user) {
		uid = user.uid;
	}
});

const Header = () => {
	const navigation = useNavigation();

	const crossPress = () => {
		navigation.navigate("Profile");
	};

	const tickPress = async () => {
		const apiService = new ApiService(); // Crea una instancia de ApiService
		try {
			const userData = {
				apellidos: "Pérez García",
				email: "juan.perez@example.com",
				nombre: "Juanananan",
				nombre_usuario: "juanperez",
			};
			await apiService.updateUserData(uid, userData);
			navigation.navigate("Profile");
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<View style={styles.header}>
			<TouchableOpacity style={styles.headerButtonLeft} onPress={crossPress}>
				<Ionic
					name="close-sharp"
					style={{ fontSize: 32, color: theme.colors.text }}
				/>
			</TouchableOpacity>
			<Text style={styles.headerText}>Editar perfil</Text>
			<TouchableOpacity onPress={tickPress} style={styles.headerButtonRight}>
				<Ionic
					name="checkmark-sharp"
					style={{ fontSize: 32, color: theme.colors.text }}
				/>
			</TouchableOpacity>
		</View>
	);
};

const EditPicture = () => {
	return (
		<View style={{ alignItems: "center" }}>
			<Image
				source={require("../assets/logo.png")}
				style={{
					height: 80,
					width: 80,
					borderRadius: 500,
					borderWidth: 1,
					padding: 5,
					borderColor: theme.colors.primary,
				}}
			/>
			<TouchableOpacity>
				<Text style={{ marginTop: 10, color: theme.colors.primary }}>
					Cambiar foto de perfil
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const BasicFields = ({ data }) => {
	const [name, setName] = useState({ value: data.nombre || "", error: "" });
	const [lastName, setLastName] = useState({
		value: data.apellidos || "",
		error: "",
	});
	const [status, setStatus] = useState({ value: "", error: "" });
	const [gender, setGender] = useState("");
	return (
		<View style={{ paddingTop: 10 }}>
			<Text style={{ color: theme.colors.secondary }}> Campos basicos: </Text>
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
				label="Estado"
				returnKeyType="next"
				value={status.value}
				onChangeText={(text) => setStatus({ value: text, error: "" })}
				error={!!status.error}
				errorText={status.error}
			/>
			<View
				style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}
			>
				<Text style={{ color: theme.colors.secondary }}>Género:</Text>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						onPress={() => setGender("male")}
						style={{ marginLeft: 30 }}
					>
						<Ionic
							name="male-sharp"
							style={{ fontSize: 32, color: theme.colors.primary }}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setGender("female")}
						style={{ marginLeft: 30 }}
					>
						<Ionic
							name="female-sharp"
							style={{ fontSize: 32, color: theme.colors.primary }}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setGender("other")}
						style={{ marginLeft: 30 }}
					>
						<Ionic
							name="car-sport-sharp"
							style={{ fontSize: 32, color: theme.colors.primary }}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const Body = ({ data }) => {
	return (
		<View
			style={{
				backgroundColor: theme.colors.surface,
				height: "100%",
				width: "100%",
			}}
		>
			<View
				style={{
					flex: 1,
					paddingHorizontal: 10,
					justifyContent: "flex-start",
				}}
			>
				<EditPicture />
				<BasicFields data={data} />
			</View>
		</View>
	);
};

/*async function updateUserData() {
	const requestBody = {
		id: id,
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
		console.log("Datos actualizados:", data);
		//navigation.navigate('PerfilScreen', { id });
	} catch (error) {
		setError(error.message);
		console.log("Error al actualizar los datos:", error);
	}
}*/

const EditProfileScreen = () => {
	const [data, setData] = useState(null);
	const apiService = new ApiService(); // Crea una instancia de ApiService

	useEffect(() => {
		if (uid) {
			async function fetchData() {
				const result = await apiService.getUserData(uid); // Usa la instancia de ApiService
				setData(result);
			}
			fetchData();
		}
	}, [uid]);

	return (
		<BackgroundTabs>
			<Header />
			{data ? <Body data={data} /> : <Paragraph> Cargando... </Paragraph>}
		</BackgroundTabs>
	);
};

export default EditProfileScreen;

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 15,
		backgroundColor: theme.colors.surface,
		width: "100%",
		position: "relative",
		top: 0,
	},
	headerText: {
		fontFamily: "SF-Pro-Bold",
		fontSize: 20,
		fontWeight: "500",
		color: theme.colors.text,
	},
	headerButtonRight: {
		padding: 10,
		marginLeft: "auto",
	},
	headerButtonLeft: {
		padding: 10,
		marginRight: "auto",
	},
});
