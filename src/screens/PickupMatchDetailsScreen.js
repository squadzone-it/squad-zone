import React, { useState, useEffect, useContext } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Linking,
	Modal,
} from "react-native";
import { UserContext } from "../contexts/UserContext";
import Ionic from "react-native-vector-icons/Ionicons";
import { theme } from "../core/theme";
import BackgroundTabs from "../components/BackgroundTabs";
import { getMatchData } from "../components/ApiService";

const PickupMatchDetailsScreen = ({ navigation, route }) => {
	const { user } = useContext(UserContext);
	const uid = user ? user.uid : null;
	const { match } = route.params;
	const [partidoData, setPartidoData] = useState(null);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const fetchMatchData = async () => {
			try {
				console.log(match);
				const data = await getMatchData(match.matchId);
				console.log(data);
				setPartidoData(data);
			} catch (error) {
				console.error("Error:", error);
			}
		};
		fetchMatchData();
	}, []);

	function formatDate(dateTimeString) {
		const dateTime = new Date(dateTimeString);
		const options = {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		};
		return dateTime.toLocaleString("es-ES", options);
	}

	const locationButton = (latitude, longitude) => {
		const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

		Linking.openURL(url).catch((err) =>
			console.error("An error occurred", err)
		);
	};

	const leaveMatch = () => {
		/*api salirse de partido*/
	};

	const tempButton = () => {};

	return partidoData ? (
		<BackgroundTabs>
			{/*   Header   */}
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
					Pickup {partidoData.gameData.rules}
				</Text>
				<TouchableOpacity onPress={tempButton} style={styles.headerButtonRight}>
					<Ionic
						name="chatbubble-ellipses-outline"
						style={{ fontSize: 25, color: theme.colors.text }}
					/>
				</TouchableOpacity>
			</View>
			{/*   Match info header   */}
			<View style={styles.container}>
				<View style={styles.matchHeader}>
					<View style={styles.team}>
						<Ionic
							name="people-sharp"
							style={{ fontSize: 50, color: theme.colors.text }}
						/>

						<Text style={styles.availableTeamName}>Squad A</Text>
					</View>
					<View style={styles.score}>
						<Text style={styles.scoreText}>0-0</Text>
						<Text style={styles.statusText}>{partidoData.status}</Text>
					</View>
					<View style={styles.team}>
						<Ionic
							name="people-sharp"
							style={{ fontSize: 50, color: theme.colors.text }}
						/>

						<Text style={styles.availableTeamName}>Squad B</Text>
					</View>
				</View>
				<TouchableOpacity
					onPress={() =>
						locationButton(
							partidoData.gameData.location.latitude,
							partidoData.gameData.location.longitude
						)
					}
				>
					<Text style={styles.location}>
						Location{/*{partidoData.gameData.location}*/}
					</Text>
				</TouchableOpacity>
				<Text style={styles.dateTime}>
					{formatDate(partidoData.gameData.startTime)}
				</Text>
				<View style={styles.playerListContainer}>
					<View style={{ flex: 1, marginTop: 10 }}>
						<Text
							style={{
								fontFamily: "SF-Pro-Semibold",
								fontSize: 14,
								paddingBottom: 10,
								alignSelf: "center",
								color: theme.colors.text,
							}}
						>
							Jugadores
						</Text>
						{partidoData.players.map((player, index) => (
							<TouchableOpacity
								key={index}
								onPress={() =>
									navigation.navigate("OtherUserProfileScreen", {
										user: player,
									})
								}
							>
								<View style={styles.userContainer}>
									<Image
										source={{
											uri: player.photoUrl,
										}}
										style={styles.userImage}
									/>
									<View style={styles.userSubContainer}>
										<View style={styles.usernameContainer}>
											<Text style={styles.usernameText}>{player.username}</Text>
											{player.verified && (
												<Image
													source={require("../assets/verified.png")}
													style={{
														width: 16,
														height: 16,
														marginLeft: 5,
													}}
												/>
											)}
										</View>
										<View style={styles.nameContainer}>
											<Text style={styles.nameText}>
												{player.name} {player.lastName}
											</Text>
										</View>
									</View>
								</View>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</View>

			<View style={styles.buttonContainer}>
				{uid === partidoData.gameData.creator && (
					<TouchableOpacity style={styles.startGameButton} onPress={tempButton}>
						<Text style={styles.startGameText}>Empezar Partido</Text>
					</TouchableOpacity>
				)}

				<TouchableOpacity
					style={styles.menuButton}
					onPress={() => setShowModal(true)}
				>
					<Ionic name="ellipsis-vertical" style={styles.menuIcon} />
				</TouchableOpacity>
			</View>
			<Modal visible={showModal} animationType="slide" transparent={true}>
				<TouchableOpacity
					style={styles.modalBackground}
					onPress={() => setShowModal(false)}
					activeOpacity={1}
				>
					<TouchableWithoutFeedback>
						<View style={styles.modalContent}>
							<TouchableOpacity>
								<Text style={styles.modalOption}>Opcion 1</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={leaveMatch}>
								<Text style={styles.modalOptionR}>Salir del partido</Text>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
				</TouchableOpacity>
			</Modal>
		</BackgroundTabs>
	) : (
		<></>
	);
};

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
	container: {
		height: "100%",
		width: "100%",
		padding: 20,
		backgroundColor: theme.colors.surface,
	},
	matchHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	team: {
		flex: 1,
		alignItems: "center",
	},
	shield: {
		width: 80,
		height: 80,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: theme.colors.secondaryBackground,
	},
	teamName: {
		color: theme.colors.text,
		fontFamily: "SF-Pro-Semibold",
		textAlign: "center",
	},
	availableTeamName: {
		color: theme.colors.secondary,
		fontFamily: "SF-Pro-Medium",
		textAlign: "center",
	},
	score: {
		flex: 1,
	},
	scoreText: {
		fontSize: 20,
		color: theme.colors.text,
		textAlign: "center",
	},
	statusText: {
		fontSize: 12,
		color: theme.colors.secondary,
		textAlign: "center",
		marginTop: 5,
	},
	dateTime: {
		fontSize: 14,
		color: theme.colors.secondary,
		textAlign: "center",
	},
	location: {
		fontSize: 16,
		color: theme.colors.secondary,
		textAlign: "center",
		marginTop: 10,
		fontFamily: "SF-Pro-Semibold",
	},
	playerListContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10,
	},
	userContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
		borderBottomColor: theme.colors.secondaryBackground,
		borderBottomWidth: 1,
		paddingVertical: 10,
	},
	userImage: {
		width: 50,
		height: 50,
		borderRadius: 25, // Hace la imagen circular
		borderWidth: 2, // Tamaño del borde
		borderColor: theme.colors.primary, // Color del borde
		marginRight: 10, // Espacio a la derecha de la imagen
	},
	userSubContainer: {
		flexDirection: "column",
	},
	usernameContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	usernameText: {
		color: theme.colors.text,
		fontSize: 16,
		fontFamily: "SF-Pro-Semibold",
	},
	verifiedIcon: {
		fontSize: 16,
		color: "#42caff",
		marginLeft: 5,
	},
	nameContainer: {
		flexDirection: "row",
	},
	nameText: {
		color: theme.colors.secondary,
		fontSize: 14,
		fontFamily: "SF-Pro",
	},
	buttonContainer: {
		flexDirection: "row",
		position: "absolute",
		bottom: 20,
		alignSelf: "center",
	},
	startGameButton: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: theme.colors.primary,
		borderRadius: 25,
		marginRight: 10, // Separación entre los botones
		alignSelf: "center",
	},
	startGameText: {
		color: theme.colors.text,
		fontSize: 22,
		textAlign: "center",
		fontFamily: "CODE-Bold",
	},
	menuButton: {
		justifyContent: "center",
		padding: 10,
		borderWidth: 2,
		borderColor: theme.colors.secondary,
		borderRadius: 25,
	},
	menuIcon: {
		fontSize: 22,
		color: theme.colors.text,
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
	modalOptionR: {
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.secondary,
		width: "100%",
		fontFamily: "SF-Pro",
		fontSize: 18,
		color: theme.colors.error,
	},
});

export default PickupMatchDetailsScreen;
