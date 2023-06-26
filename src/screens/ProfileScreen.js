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
//import ApiService from "../components/ApiService";

import { useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase-config";
import { getFunctions, httpsCallable } from "firebase/functions"; // Importa httpsCallable

let uid = null;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.onAuthStateChanged(function (user) {
	if (user) {
		uid = user.uid;
	}
});
const functions = getFunctions(app);

const ProfileScreen = () => {
	const navigation = useNavigation();

	const [showModal, setShowModal] = useState(false);

	const settingsButton = () => {};
	const follow = () => {};

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

	const [data, setData] = useState(null);
	//const apiService = new ApiService(); // Crea una instancia de ApiService

	const getUserData = async (userId) => {
		try {
			const functionUrl =
				"https://europe-west2-squadzoneapp.cloudfunctions.net/getUserData";
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

	const tempData = {
		lastName: " ",
		email: " ",
		id: " ",
		name: " ",
		username: " ",
		photoUrl: " ",
	};

	useEffect(() => {
		if (uid) {
			async function fetchData() {
				try {
					const result = await getUserData(uid);
					setData(result);
				} catch (error) {
					console.error("Error retrieving user data from Firestore:", error);
				}
			}
			fetchData();
		}
	}, [uid]);

	const DatosPersonales = () => (
		<View style={{ margin: 15 }}>
			<Text style={{ fontFamily: "SF-Pro", color: theme.colors.text }}>
				Datos Personales
			</Text>
		</View>
	);

	const Equipo = () => (
		<View style={{ margin: 15 }}>
			<Text style={{ fontFamily: "SF-Pro", color: theme.colors.text }}>
				Equipo
			</Text>
		</View>
	);

	const Partidos = () => (
		<View style={{ margin: 15 }}>
			<Text style={{ fontFamily: "SF-Pro", color: theme.colors.text }}>
				Partidos
			</Text>
		</View>
	);

	const Tab = createMaterialTopTabNavigator();

	return (
		<BackgroundTabs>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.headerButtonLeft}
					onPress={settingsButton}
				>
					<Ionic
						name="add"
						style={{ fontSize: 32, color: theme.colors.text }}
					/>
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

			{/* Body */}
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
				{/* ProfileInfo */}
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						width: "100%",
						paddingLeft: 10,
						paddingVertical: 5,
						backgroundColor: theme.colors.surface,
					}}
				>
					<Image
						source={{
							uri: data ? data.photoUrl : tempData.photoUrl,
						}}
						style={{
							height: 70,
							width: 70,
							borderRadius: 500,
							marginRight: "auto",
							borderWidth: 3,
							padding: 5,
							borderColor: theme.colors.primary,
						}}
						resizeMode="cover"
					/>
					<View style={{ flex: 3 }}>
						<Text
							style={{
								fontSize: 16,
								fontWeight: "500",
								marginLeft: 10,
								fontFamily: "SF-Pro-Bold",
								color: theme.colors.text,
							}}
						>
							@{data ? data.username : tempData.username}
							{"  "}
							<Ionic
								name="checkmark-circle-sharp"
								style={{ fontSize: 16, color: "#42caff" }}
							/>
						</Text>
						<Text
							style={{
								fontSize: 13,
								fontWeight: "500",
								marginLeft: 10,
								fontFamily: "SF-Pro",
								color: theme.colors.text,
							}}
						>
							{data
								? `${data.name} ${data.lastName}`
								: `${tempData.name} ${tempData.lastName}`}
						</Text>
					</View>
					<View style={{ flex: 1 }}>
						<Ionic name="medal" style={{ fontSize: 50, color: "#d9b00f" }} />
					</View>
				</View>

				{/* Pestañas */}
				<Tab.Navigator
					screenOptions={{
						tabBarActiveTintColor: theme.colors.text,
						tabBarInactiveTintColor: theme.colors.secondary,
						tabBarPressColor: "transparent",
						tabBarShowLabel: false,
						tabBarIndicatorStyle: {
							backgroundColor: theme.colors.primary,
						},
						tabBarStyle: {
							backgroundColor: theme.colors.surface,
							borderBottomWidth: 1,
							borderBottomColor: theme.colors.primary,
							paddingTop: 0,
							height: 50,
							borderColor: theme.colors.primary,
						},
					}}
				>
					<Tab.Screen
						name="Datos Personales"
						component={DatosPersonales}
						options={{
							headerShown: false,
							tabBarIcon: ({ focused, color, size }) =>
								focused ? (
									<Ionic name="person" color={color} size={25} />
								) : (
									<Ionic name="person-outline" color={color} size={23} />
								),
						}}
					/>
					<Tab.Screen
						name="Equipo"
						component={Equipo}
						options={{
							headerShown: false,
							tabBarIcon: ({ focused, color, size }) =>
								focused ? (
									<Ionic name="football" color={color} size={25} />
								) : (
									<Ionic name="football-outline" color={color} size={23} />
								),
						}}
					/>
					<Tab.Screen
						name="Partidos"
						component={Partidos}
						options={{
							headerShown: false,
							tabBarIcon: ({ focused, color, size }) =>
								focused ? (
									<Ionic name="calendar" color={color} size={25} />
								) : (
									<Ionic name="calendar-outline" color={color} size={23} />
								),
						}}
					/>
				</Tab.Navigator>
			</View>
		</BackgroundTabs>
	);
};
export default ProfileScreen;

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
		backgroundColor: theme.colors.secondaryBackground,
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
		fontSize: 20,
		color: theme.colors.text,
	},
	modalOptionR: {
		marginVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.secondary,
		width: "100%",
		fontFamily: "SF-Pro",
		fontSize: 20,
		color: theme.colors.error,
	},
});
