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

import { useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getUserData, getSquadData } from "../components/ApiService";

const OtherUserProfileScreen = ({ route }) => {
	const navigation = useNavigation();
	const [user, setUser] = useState(route.params.user);

	const [teamData, setTeamData] = useState(null);
	useEffect(() => {
		if (user && user.team) {
			if (route.params.squadData) {
				setTeamData(route.params.squadData);
			} else if (user && user.team) {
				fetchSquadData();
			}
		}
	}, [user]);

	const fetchSquadData = async () => {
		if (user && user.team) {
			try {
				const result = await getSquadData(user.team);
				setTeamData(result);
			} catch (error) {
				console.error("Error retrieving squad data:", error);
			}
		}
	};

	const fetchUserData = async () => {
		if (user && user.userId) {
			try {
				const result = await getUserData(user.userId);
				setUser((prevUser) => ({
					...result,
					userId: prevUser.userId,
				}));
			} catch (error) {
				console.error("Error retrieving user data:", error);
			}
		}
	};

	const settingsButton = () => {};

	const onRefresh = async () => {
		if (user && user.userId) {
			await fetchUserData();
			await fetchSquadData();
		}
	};

	const DatosPersonales = () => (
		<View>
			<Text style={{ fontFamily: "SF-Pro", color: theme.colors.text }}>
				Datos Personales
			</Text>
		</View>
	);

	const Equipo = () => {
		if (user && user.team && teamData) {
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
							{user.photoUrl && (
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
		} else if (user && !user.team) {
			// Si el usuario no está en un equipo, muestra las opciones para unirse o crear un equipo
			return (
				<View style={{ alignItems: "center", paddingTop: "30%" }}>
					<Text style={styles.teamOptionsText}>
						Este jugador no tiene Squad...
					</Text>

					<TouchableOpacity>
						<View
							style={{
								flexDirection: "column",
								alignItems: "center",
								paddingTop: "5%",
								borderWidth: 1,
								borderRadius: 50,
								borderColor: theme.colors.primary,
								padding: 20,
							}}
						>
							<Ionic
								name="person-add-outline"
								style={{
									fontSize: 50,
									color: theme.colors.text,
									textAlign: "center",
								}}
							/>
						</View>
					</TouchableOpacity>
					<Text
						style={{
							fontFamily: "CODE-Bold",
							fontSize: 30,
							padding: 10,
							color: theme.colors.text,
						}}
					>
						INVITAR A SQUAD
					</Text>
				</View>
			);
		} else {
			<></>;
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
		<BackgroundTabs onRefresh={onRefresh}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.headerButtonLeft}
					onPress={() => navigation.goBack()}
				>
					<Ionic
						name="arrow-back"
						style={{ fontSize: 32, color: theme.colors.text }}
					/>
				</TouchableOpacity>
				<Text style={styles.headerText}>
					SQUAD Z<Ionic name="football-outline" style={{ fontSize: 23 }} />
					NE
				</Text>
				<TouchableOpacity
					onPress={settingsButton}
					style={styles.headerButtonRight}
				>
					<Ionic
						name="paper-plane-sharp"
						style={{ fontSize: 25, color: theme.colors.text }}
					/>
				</TouchableOpacity>
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
							uri: user.photoUrl,
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
							@{user.username}
							{"  "}
							{user && user.verified && (
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
							{`${user.name} ${user.lastName}`}
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
export default OtherUserProfileScreen;

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
		color: theme.colors.secondary,
		fontSize: 16,
		fontFamily: "SF-Pro",
		paddingBottom: "10%",
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
		textAlign: "center",
	},
});
