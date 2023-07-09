import React, { useState, useEffect, useContext, useRef } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Linking,
	Modal,
	FlatList,
	Image,
	ScrollView,
	RefreshControl,
} from "react-native";
import Ionic from "react-native-vector-icons/Ionicons";
import BackgroundNoScroll from "../components/BackgroundNoScroll";
import { theme } from "../core/theme";
import { UserContext } from "../contexts/UserContext";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { getAllMatches, getUserData } from "../components/ApiService"; // Importamos la función getAllMatches

const Tab = createMaterialTopTabNavigator();

const HomeScreen = ({ navigation }) => {
	const { user } = useContext(UserContext);
	const uid = user ? user.uid : null;

	const [showModal, setShowModal] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [matches, setMatches] = useState([]); // Almacenamos los partidos aquí
	const [userData, setUserData] = useState([]); // Almacenamos los partidos aquí

	const [selectedDay, setSelectedDay] = useState(
		new Date().toISOString().slice(0, 10)
	);

	const generateDays = (start, daysBefore, daysAfter) => {
		const arr = [];
		for (let i = -daysBefore; i <= daysAfter; i++) {
			const day = new Date(start.getTime());
			day.setDate(day.getDate() + i);
			arr.push(day.toISOString().slice(0, 10));
		}
		return arr;
	};

	const days = generateDays(new Date(), 10, 10);
	const scrollViewRef = useRef();

	useEffect(() => {
		const position = (50 * 21) / 3; // button width * number of buttons /3
		console.log(userData);
		scrollViewRef.current.scrollTo({ x: position, animated: false });
	}, []);

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
			console.log(matches);

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
		const fetchUserData = async () => {
			const userData = await getUserData(uid);
			setUserData(userData);
		};

		fetchUserData();
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
		navigation.navigate("CreatePickupMatchScreen", { userData: userData });
	};

	const onCreateTeamMatchPressed = () => {
		setShowModal(false);
		navigation.navigate("CreateTeamsMatchScreen", { userData: userData });
	};

	function formatDate(dateTimeString) {
		const dateTime = new Date(dateTimeString);
		const options = {
			hour: "2-digit",
			minute: "2-digit",
		};
		return dateTime.toLocaleTimeString(undefined, options);
	}

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		// Aquí debes implementar la lógica de recarga
		setTimeout(() => setRefreshing(false), 2000); // esto es solo para simular la recarga
	}, []);

	const Explorar = ({ matches }) => {
		const filteredMatches = matches.filter(
			(match) =>
				new Date(match.gameData.startTime).toDateString() ===
				new Date(selectedDay).toDateString()
		);

		return (
			<View>
				{filteredMatches && (
					<FlatList
						data={filteredMatches}
						overScrollMode="never"
						bounces="false"
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
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
													{item.players && (
														<Text style={styles.players}>{`Jugadores: ${
															Object.keys(item.players).length
														}`}</Text>
													)}
												</View>
											</View>
										)}
										{item.mode === "teamMatch" && (
											<View>
												<View
													style={{ flexDirection: "row", alignItems: "center" }}
												>
													<Image
														source={{
															uri: item.teams.teamA.teamBadgeUrl,
														}}
														style={styles.teamBadge}
													/>
													<Text style={styles.mode}>
														{item.teams.teamA.teamDisplayName}
													</Text>
												</View>
												<View
													style={{ flexDirection: "row", alignItems: "center" }}
												>
													<Image
														source={{
															uri: item.teams.teamB.teamBadgeUrl,
														}}
														style={styles.teamBadge}
													/>
													<Text style={styles.mode}>
														{item.teams.teamB.teamDisplayName}
													</Text>
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
												size={15}
												color={theme.colors.error}
											/>
										) : (
											<Text style={styles.startTime}>{`${formatDate(
												item.gameData.startTime
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

	const MisPartidos = ({ matches }) => {
		const filteredMatches = matches.filter((match) => {
			const matchDate = new Date(match.gameData?.startTime).toDateString();
			const selectedDate = new Date(selectedDay).toDateString();

			if (matchDate !== selectedDate) {
				return false;
			}

			if (match.mode === "pickup") {
				if (match.players && uid) {
					return uid in match.players;
				} else {
					return false;
				}
			} else if (match.mode === "teamMatch") {
				if (userData && userData.team) {
					const userTeamId = userData.team;
					return (
						match.teams?.teamA?.teamId === userTeamId ||
						match.teams?.teamB?.teamId === userTeamId
					);
				} else {
					return false;
				}
			}

			return false;
		});

		return (
			<View>
				{filteredMatches && (
					<FlatList
						data={filteredMatches}
						overScrollMode="never"
						bounces="false"
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
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
													{item.players && (
														<Text style={styles.players}>{`Jugadores: ${
															Object.keys(item.players).length
														}`}</Text>
													)}
												</View>
											</View>
										)}
										{item.mode === "teamMatch" && (
											<View>
												<View
													style={{ flexDirection: "row", alignItems: "center" }}
												>
													<Image
														source={{
															uri: item.teams.teamA.teamBadgeUrl,
														}}
														style={styles.teamBadge}
													/>
													<Text style={styles.mode}>
														{item.teams.teamA.teamDisplayName}
													</Text>
												</View>
												<View
													style={{ flexDirection: "row", alignItems: "center" }}
												>
													<Image
														source={{
															uri: item.teams.teamB.teamBadgeUrl,
														}}
														style={styles.teamBadge}
													/>
													<Text style={styles.mode}>
														{item.teams.teamB.teamDisplayName}
													</Text>
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
												size={15}
												color={theme.colors.error}
											/>
										) : (
											<Text style={styles.startTime}>{`${formatDate(
												item.gameData.startTime
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
						{userData && userData.team ? (
							<TouchableOpacity onPress={onCreateTeamMatchPressed}>
								<Text style={styles.modalOption}>
									Crear partido con tu equipo
								</Text>
							</TouchableOpacity>
						) : (
							<TouchableOpacity onPress={() => {}}>
								<Text style={styles.modalOptionBlocked}>
									Crear partido con tu equipo{"   "}
									<Ionic
										name="lock-closed-sharp"
										size={24}
										color={theme.colors.secondary}
									/>
								</Text>
							</TouchableOpacity>
						)}
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
				{/* Date Selector */}
				<ScrollView
					ref={scrollViewRef}
					horizontal
					style={{ flex: 1 }}
					contentContainerStyle={{
						paddingStart: 5,
						paddingEnd: 5,
					}}
				>
					{days.map((day, index) => (
						<TouchableOpacity
							key={index}
							onPress={() => setSelectedDay(day)}
							style={[
								{
									backgroundColor:
										selectedDay === day
											? theme.colors.primary
											: theme.colors.surface,

									width: 50,
									height: 50,
									justifyContent: "center",
									alignItems: "center",
									alignSelf: "center",
								},
								styles.dayButton,
							]}
						>
							<Text
								style={{
									color: theme.colors.text,
									textAlign: "center",
									fontFamily: "SF-Pro-Semibold",
									fontSize: 20,
								}}
							>
								{new Date(day).getDate()} {/* Only the number of the day */}
							</Text>
							<Text
								style={{
									color: theme.colors.text,
									textAlign: "center",
									fontFamily: "SF-Pro-Semibold",
									fontSize: 10,
								}}
							>
								{new Date(day)
									.toLocaleString("es-ES", { month: "short" })
									.toUpperCase()}
								{/* Month in short format */}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>

				<View style={{ flex: 14 }}>
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
							{() => <Explorar matches={matches} selectedDay={selectedDay} />}
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
							{() => (
								<MisPartidos
									matches={matches}
									selectedDay={selectedDay}
									user={user}
									uid={uid}
								/>
							)}
						</Tab.Screen>
					</Tab.Navigator>
				</View>
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
		marginBottom: 15,
		marginVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.secondary,
		width: "100%",
		fontFamily: "SF-Pro",
		fontSize: 18,
		color: theme.colors.text,
	},
	modalOptionBlocked: {
		marginBottom: 15,
		marginVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.secondary,
		width: "100%",
		fontFamily: "SF-Pro",
		fontSize: 18,
		color: theme.colors.secondary,
	},
	closeModalButton: {
		marginTop: 10,
	},
	teamBadge: {
		width: 20,
		height: 20,
		borderRadius: 2, // Hace la imagen circular
		marginRight: 8, // Espacio a la derecha de la imagen
	},
	dayButton: {
		borderRightWidth: 1,
		borderLeftWidth: 1,
		borderColor: theme.colors.secondaryBackground,
	},
});
