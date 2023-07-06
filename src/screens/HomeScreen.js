import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Linking,
	Modal,
	FlatList,
} from "react-native";
import Ionic from "react-native-vector-icons/Ionicons";
import BackgroundNoScroll from "../components/BackgroundNoScroll";
import { theme } from "../core/theme";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { getAllMatches } from "../components/ApiService"; // Importamos la función getAllMatches

const Tab = createMaterialTopTabNavigator();

const HomeScreen = ({ navigation }) => {
	const [showModal, setShowModal] = useState(false);
	const [matches, setMatches] = useState([]); // Almacenamos los partidos aquí

	/* // Esta es la funcion real, la otra es solo para ver como queda
  useEffect(() => {
    const fetchMatches = async () => {
      const matchesData = await getAllMatches();
      setMatches(matchesData);
    };

    fetchMatches();

    
  }, []);

  */
	//hay q eliminar esta funcion y dejar la primera
	useEffect(() => {
		const fetchMatches = async () => {
			const matchesData = await getAllMatches();

			// Añadimos la ubicación a cada partido
			const updatedMatches = matchesData.map((match, index) => {
				switch (index % 3) {
					case 0:
						return { ...match, location: "Mortera" };
					case 1:
						return { ...match, location: "Santander" };
					case 2:
						return { ...match, location: "Torrelavega" };
					default:
						return match;
				}
			});

			setMatches(updatedMatches);
		};

		fetchMatches();
	}, []);

	// Ir a la pantalla de detalles del partido
	const goToMatchDetails = (match) => {
		navigation.navigate("MatchDetailsScreen", { match });
	};

	// Aquí está la suposición de que tienes userUid definido
	//const userUid = "Tu valor real de userUid aquí";

	const mapButton = () => {
		const latitude = 43.44461979827975;
		const longitude = -3.9325432027336413;
		const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

		Linking.openURL(url).catch((err) =>
			console.error("An error occurred", err)
		);
	};

	const mas = () => setShowModal(true);

	const onCreateMatchPressed = () => {
		setShowModal(false);
		navigation.navigate("CreateMatchScreen");
	};

	const onCreateTeamMatchPressed = () => {
		setShowModal(false);
		console.log("Crear partido con tu equipo");
	};

	function formatDate(dateTimeString) {
		const dateTime = new Date(dateTimeString);
		const options = {
			hour: "2-digit",
			minute: "2-digit",
		};
		return dateTime.toLocaleTimeString(undefined, options);
	}

	const Explorar = ({ matches }) => {
		return (
			<View>
				{matches && (
					<FlatList
						data={matches}
						keyExtractor={(item) => item.matchId}
						renderItem={({ item }) => (
							<TouchableOpacity
								onPress={() => goToMatchDetails(item)}
								style={styles.itemContainer}
							>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										width: "100%",
									}}
								>
									<View>
										{item.mode === "pickup" && (
											<View
												style={{ flexDirection: "row", alignItems: "center" }}
											>
												<Ionic
													name="people-sharp"
													size={24}
													color={theme.colors.text}
													style={{ marginRight: 5 }}
												/>
												<View style={{ flexDirection: "column" }}>
													<Text
														style={styles.mode}
													>{`Pickup ${item.gameData.rules}`}</Text>
													{Array.isArray(item.players) && (
														<Text
															style={styles.players}
														>{`Jugadores: ${item.players.length}`}</Text>
													)}
												</View>
											</View>
										)}
										{item.mode === "teamMatch" && (
											<View>
												<View
													style={{ flexDirection: "row", alignItems: "center" }}
												>
													<Ionic
														name="shield-sharp"
														size={20}
														color={theme.colors.text}
														style={{ marginRight: 6 }}
													/>
													<Text style={styles.mode}>teamA</Text>
												</View>
												<View
													style={{ flexDirection: "row", alignItems: "center" }}
												>
													<Ionic
														name="shield-sharp"
														size={20}
														color={theme.colors.text}
														style={{ marginRight: 6 }}
													/>
													<Text style={styles.mode}>teamB</Text>
												</View>
											</View>
										)}
									</View>
									<View
										style={{
											//justifyContent: "flex-end",
											alignItems: "flex-end",
										}}
									>
										{item.status === "in-progress" ? (
											<Ionic
												name="hourglass-sharp"
												size={24}
												color={theme.colors.error}
											/>
										) : (
											<Text style={styles.startTime}>{`${formatDate(
												item.startTime
											)}`}</Text>
										)}
										<Text style={styles.location}>{`${item.location}`}</Text>
									</View>
								</View>
							</TouchableOpacity>
						)}
					/>
				)}
			</View>
		);
	};

	const MisPartidos = () => {
		return <></>;
	};

	return (
		<BackgroundNoScroll>
			{/*   Header   */}
			<View style={styles.header}>
				<TouchableOpacity style={styles.headerButtonLeft} onPress={mas}>
					<Ionic
						name="add"
						style={{ fontSize: 32, color: theme.colors.text }}
					/>
				</TouchableOpacity>
				<Text style={styles.headerText}>
					SQUAD Z<Ionic name="football-outline" style={{ fontSize: 23 }} />
					NE
				</Text>
				<TouchableOpacity onPress={mapButton} style={styles.headerButtonRight}>
					<Ionic
						name="map-sharp"
						style={{ fontSize: 25, color: theme.colors.text }}
					/>
				</TouchableOpacity>
			</View>
			<Modal visible={showModal} animationType="slide" transparent={true}>
				<TouchableOpacity
					style={styles.modalBackground}
					onPress={() => setShowModal(false)}
				>
					<View style={styles.modalContent}>
						<TouchableOpacity onPress={onCreateMatchPressed}>
							<Text style={styles.modalOption}>Crear partido</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={onCreateTeamMatchPressed}>
							<Text style={styles.modalOption}>
								Crear partido con tu equipo
							</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>

			{/*      Body        */}
			<View
				style={{
					backgroundColor: theme.colors.surface,
					height: "100%",
					width: "100%",
				}}
			>
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
						name="Explorar"
						options={() => ({
							headerShown: false,
							tabBarLabel: "EXPLORAR",
							tabBarShowLabel: true,
							tabBarLabelStyle: {
								fontFamily: "SF-Pro-Semibold",
								fontSize: 16,
							},
						})}
					>
						{() => <Explorar matches={matches} />}
					</Tab.Screen>
					<Tab.Screen
						name="Mis Partidos"
						options={() => ({
							headerShown: false,
							tabBarLabel: "MIS PARTIDOS",
							tabBarShowLabel: true,
							tabBarLabelStyle: {
								fontFamily: "SF-Pro-Semibold",
								fontSize: 16,
							},
						})}
					>
						{() => <MisPartidos />}
					</Tab.Screen>
				</Tab.Navigator>
			</View>
		</BackgroundNoScroll>
	);
};

export default HomeScreen;

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
	itemContainer: {
		flexDirection: "row",
		padding: 10,
		alignItems: "center",
		backgroundColor: theme.colors.surface,
		borderBottomColor: theme.colors.secondaryBackground,
		borderBottomWidth: 1,
	},
	location: {
		fontFamily: "SF-Pro",
		fontSize: 16,
		color: theme.colors.secondary,
	},
	mode: {
		fontFamily: "SF-Pro-Semibold",
		fontSize: 16,
		color: theme.colors.text,
	},
	startTime: {
		fontFamily: "SF-Pro-Semibold",
		fontSize: 14,
		color: theme.colors.text,
	},
	rules: {
		fontFamily: "SF-Pro",
		fontSize: 14,
		color: theme.colors.text,
	},
	players: {
		fontFamily: "SF-Pro",
		fontSize: 14,
		color: theme.colors.secondary,
	},
	modalBackground: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		width: "80%",
	},
	modalOption: {
		fontSize: 18,
		paddingVertical: 10,
	},
	closeModalButton: {
		marginTop: 10,
	},
});
