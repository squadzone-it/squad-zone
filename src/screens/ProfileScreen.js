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
import Button from "../components/Button";
import { theme } from "../core/theme";
import React, { useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase-config";
import { getUserData, getSquadData } from "../components/ApiService";

let uid = null;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.onAuthStateChanged(function (user) {
	if (user) {
		uid = user.uid;
	}
});

const ProfileScreen = () => {
	const navigation = useNavigation();

	const [showModal, setShowModal] = useState(false);

	const settingsButton = () => {};

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

	const [teamData, setTeamData] = useState(null);
	useEffect(() => {
		if (data && data.team) {
			async function fetchSquadData() {
				try {
					const result = await getSquadData(data.team); // <--- Obtener datos del equipo
					setTeamData(result); // <--- Actualizar el estado con los datos del equipo
				} catch (error) {
					console.error("Error retrieving squad data:", error);
				}
			}
			fetchSquadData();
		}
	}, [data]);

	const DatosPersonales = () => (
		<View>
			<Text style={{ fontFamily: "SF-Pro", color: theme.colors.text }}>
				Datos Personales
			</Text>
		</View>
	);

	const Equipo = () => {
		if (data && data.team && teamData) {
			// Si el usuario ya está en un equipo, muestre la información del equipo
			return (
				<View>
					<View style={styles.teamContainer}>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("SquadProfileScreen", {
									squadData: teamData,
								})
							}
						>
							{data.photoUrl && (
								<Image
									source={{
										uri: teamData.squadBadgeUrl,
									}}
									style={styles.teamImage}
								/>
							)}
						</TouchableOpacity>
						<View style={styles.teamSubContainer}>
							<View style={styles.teamNameContainer}>
								<Text style={styles.teamNameText}>{teamData.displayname}</Text>
							</View>
							<View style={styles.teamStateContainer}>
								<Text style={styles.teamStateText}>{teamData.description}</Text>
							</View>
						</View>
					</View>

					{/* Aquí es donde se mostraría la información del equipo */}
				</View>
			);
		} else {
			// Si el usuario no está en un equipo, muestra las opciones para unirse o crear un equipo
			return (
				<View style={{ alignItems: "center", padding: 30 }}>
					<Text style={styles.teamOptionsText}>¿No tienes equipo?</Text>
					<Button mode="outlined" onPress={() => navigation.navigate("Search")}>
						UNETE A UN SQUAD
					</Button>
					<Text style={styles.teamOptionsText}> ó </Text>
					<Button
						mode="outlined"
						onPress={() =>
							navigation.navigate("CreateSquadScreen", { userUid: uid })
						}
					>
						CREA UN SQUAD
					</Button>
				</View>
			);
		}
	};

	const Partidos = () => (
		<View>
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
							uri: data
								? data.photoUrl
								: "https://firebasestorage.googleapis.com/v0/b/squadzoneapp.appspot.com/o/defaultPP.png?alt=media&token=7f90b50b-6321-484a-9d14-295fbfcfc32f.png",
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
							@{data ? data.username : ""}
							{"  "}
							{data && data.verified && (
								<Ionic
									name="checkmark-circle-sharp"
									style={{ fontSize: 16, color: "#42caff" }}
								/>
							)}
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
							{data ? `${data.name} ${data.lastName}` : ""}
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
	teamContainer: {
		flexDirection: "column",
		padding: 10,
		alignItems: "center",
		marginVertical: 40,
		backgroundColor: theme.colors.surface,
	},
	teamOptionsText: {
		textAlign: "center",
		marginVertical: 5,
		color: theme.colors.text,
		fontSize: 16,
		fontFamily: "SF-Pro",
	},
	teamImage: {
		width: 250,
		height: 250,
		borderRadius: 50, // Hace la imagen circular
		borderWidth: 1, // Tamaño del borde
		borderColor: theme.colors.text, // Color del borde
		marginRight: 10, // Espacio a la derecha de la imagen
	},
	teamSubContainer: {
		flexDirection: "column",
		alignItems: "center",
		marginVertical: 30,
	},
	teamNameContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 5,
	},
	teamNameText: {
		color: theme.colors.text,
		fontSize: 25,
		fontWeight: "bold",
	},
	teamStateContainer: {
		flexDirection: "row",
	},
	teamStateText: {
		color: theme.colors.secondary,
		fontSize: 18,
	},
});
