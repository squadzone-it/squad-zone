import {
	View,
	Text,
	StatusBar,
	Image,
	TouchableOpacity,
	StyleSheet,
	Modal,
} from "react-native";
import Ionic from "react-native-vector-icons/Ionicons";
import BackgroundTabs from "../components/BackgroundTabs";
import { theme } from "../core/theme";
import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";

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

const settingsButton = () => {};
const follow = () => {};

const Header = ({}) => {
	const navigation = useNavigation();

	const [showModal, setShowModal] = useState(false);

	const onOptionsPressed = () => {
		setShowModal(true);
	};

	const onClosePressed = () => {
		setShowModal(false);
	};

	const onEditProfilePressed = () => {
		setShowModal(false);
		navigation.navigate("EditProfile");
	};

	const onLogoutPressed = () => {
		setShowModal(false);
		navigation.navigate("StartScreen");
	};

	return (
		<View style={styles.header}>
			<TouchableOpacity
				style={styles.headerButtonLeft}
				onPress={settingsButton}
			>
				<Ionic name="add" style={{ fontSize: 32, color: theme.colors.text }} />
			</TouchableOpacity>
			<Text style={styles.headerText}>
				SQUAD Z<Ionic name="football-outline" style={{ fontSize: 23 }} />
				NE
			</Text>
			<TouchableOpacity
				onPress={onOptionsPressed}
				style={styles.headerButtonRight}
			>
				<Ionic
					name="menu-sharp"
					style={{ fontSize: 25, color: theme.colors.text }}
				/>
			</TouchableOpacity>

			<Modal visible={showModal} animationType="slide" transparent={true}>
				<TouchableOpacity
					style={styles.modalBackground}
					onPress={onClosePressed}
				>
					<View style={styles.modalContent}>
						<TouchableOpacity onPress={onEditProfilePressed}>
							<Text style={styles.modalOption}>Editar perfil</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={onLogoutPressed}>
							<Text style={styles.modalOptionR}>Cerrar Sesion</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>
		</View>
	);
};

const ProfileInfo = ({ data }) => {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				width: "100%",
				paddingHorizontal: 15,
				paddingVertical: 15,
				backgroundColor: theme.colors.surface,
			}}
		>
			<Image
				source={require("../assets/logo.png")}
				style={{
					flex: 1,
					maxHeight: 70,
					maxWidth: 70,
					borderRadius: 500,
					marginRight: "auto",
					borderWidth: 1,
					padding: 5,
					borderColor: theme.colors.primary,
				}}
			/>
			<View style={{ flex: 4 }}>
				<Text
					style={{
						fontSize: 16,
						fontWeight: "500",
						marginLeft: 20,
						fontFamily: "SF-Pro-Bold",
						color: theme.colors.text,
					}}
				>
					@{data.nombre_usuario}
					{"   "}
					<Ionic
						name="checkmark-circle-sharp"
						style={{ fontSize: 16, color: "cyan" }}
					/>
				</Text>
				<Text
					style={{
						fontSize: 13,
						fontWeight: "500",
						marginLeft: 20,
						fontFamily: "SF-Pro",
						color: theme.colors.text,
					}}
				>
					{data.nombre} {data.apellidos}
				</Text>
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
			<StatusBar
				backgroundColor={theme.colors.surface}
				barStyle="light-content"
				animated={true}
			/>
			<ProfileInfo data={data} />
			<View style={{ flex: 1, paddingHorizontal: 20 }}>
				<Button mode="contained" onPress={follow}>
					SEGUIR
				</Button>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						width: "100%",
						paddingHorizontal: 0,
						paddingVertical: 15,
					}}
				>
					<Ionic name="mail" style={{ fontSize: 30 }} />
					<Paragraph> {data.email}</Paragraph>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						width: "100%",
						paddingHorizontal: 0,
						paddingVertical: 15,
					}}
				>
					<Ionic name="attach" style={{ fontSize: 30 }} />
					<Paragraph> {data.id}</Paragraph>
				</View>
			</View>
		</View>
	);
};

const ProfileScreen = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		if (uid) {
			async function fetchData() {
				const result = await getUserData(uid);
				setData(result);
			}
			fetchData();
		}
	}, [uid]);

	return (
		<BackgroundTabs>
			<Header />
			<View style={{ alignSelf: "center" }}>
				{data ? <Body data={data} /> : <Paragraph> Cargando... </Paragraph>}
			</View>
		</BackgroundTabs>
	);
};

async function getUserData() {
	try {
		const response = await fetch(
			"https://readdatauser-zvcc2bcxkq-nw.a.run.app",
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
			//setUser(data);
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

export default ProfileScreen;

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		//justifyContent: "space-evenly",
		//paddingHorizontal: 15,
		backgroundColor: theme.colors.surface,
		width: "100%",
		position: "absolute",
		top: 0,
	},
	headerText: {
		fontFamily: "CODE-Bold",
		fontSize: 24,
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
	modalBackground: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		backgroundColor: "#1c1c1c",
		borderRadius: 10,
		padding: 10,
		minWidth: "80%",
		alignItems: "center",
	},
	modalOption: {
		marginVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.secondary,
		width: "100%",
		fontFamily: "SF-Pro",
		fontSize: 18,
		color: theme.colors.text,
	},
	modalOptionR: {
		marginVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.secondary,
		width: "100%",
		fontFamily: "SF-Pro",
		fontSize: 18,
		color: theme.colors.error,
	},
});
