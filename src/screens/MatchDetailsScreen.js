import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionic from "react-native-vector-icons/Ionicons";
import { theme } from "../core/theme";
import BackgroundTabs from "../components/BackgroundTabs";
import { getMatchData } from "../components/ApiService";

const MatchDetailsScreen = ({ navigation, route }) => {
	// Extract the 'match' object from the route parameters
	const { match } = route.params;
	const [partidoData, setPartidoData] = useState(null);

	/*
	const partidoData = {
		escudo1:
			"https://firebasestorage.googleapis.com/v0/b/squadzoneapp.appspot.com/o/squad_prS6rA4BO9CpjvC4jfx9_20230704T190025669Z.png?alt=media&token=2bcf69f5-9373-44d1-8973-0f97d9e07cb7",
		escudo2:
			"https://firebasestorage.googleapis.com/v0/b/squadzoneapp.appspot.com/o/squad_prS6rA4BO9CpjvC4jfx9_20230704T190025669Z.png?alt=media&token=2bcf69f5-9373-44d1-8973-0f97d9e07cb7",
		nombre1: "Team A",
		nombre2: "Team B",
		status: "In-Progress",
		marcador: "0 - 0",
		fechaHora: "7 de Julio 2023 17:00",
		ubicacion: "Mortera",
		jugadores1: ["Jugador 1", "Jugador 2", "Jugador 3"],
		jugadores2: ["Jugador 1", "Jugador 2", "Jugador 3"],
	};*/
	useEffect(() => {
		// Supongamos que 'matchId' es una prop pasada a este componente
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
					{partidoData.mode} {partidoData.gameData.rules}
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
					{partidoData.teams.teamA && (
						<View style={styles.team}>
							<Image
								source={{ uri: partidoData.teams.teamA.teamBadgeUrl }}
								style={styles.shield}
							/>
							<Text style={styles.teamName}>
								{partidoData.teams.teamA.teamDisplayName}
							</Text>
						</View>
					)}
					<View style={styles.score}>
						<Text style={styles.scoreText}>0-0</Text>
						<Text style={styles.statusText}>{partidoData.status}</Text>
					</View>
					{partidoData.teams.teamB ? (
						<View style={styles.team}>
							<Image
								source={{ uri: partidoData.teams.teamB.teamBadgeUrl }}
								style={styles.shield}
							/>
							<Text style={styles.teamName}>
								{partidoData.teams.teamB.teamDisplayName}
							</Text>
						</View>
					) : (
						<View style={styles.team}>
							<Image
								source={{
									uri: "https://firebasestorage.googleapis.com/v0/b/squadzoneapp.appspot.com/o/defaultSquadP_transparent.png?alt=media&token=a1272439-9a60-4047-872f-fbd040f6907a",
								}}
								style={styles.shield}
							/>
							<Text style={styles.teamName}>Espacio disponible</Text>
						</View>
					)}
				</View>
				<Text style={styles.location}>
					Location{/*{partidoData.gameData.location}*/}
				</Text>
				<Text style={styles.dateTime}>{partidoData.gameData.startTime}</Text>
				<View style={styles.playerListContainer}>
					{partidoData.teams.teamA && (
						<View style={styles.playerList && { alignItems: "flex-start" }}>
							<Text
								style={{
									fontFamily: "SF-Pro-Semibold",
									fontSize: 14,
									paddingBottom: 10,
									alignSelf: "center",
								}}
							>
								{partidoData.teams.teamA.teamDisplayName}
							</Text>
							{partidoData.teams.teamA.teamPlayers.map((player, index) => (
								<View style={styles.userContainer} key={index}>
									<Image
										source={{
											uri: player.photoUrl,
										}}
										style={styles.userImageL}
									/>
									<View style={styles.userSubContainer}>
										<View style={styles.usernameContainerL}>
											<Text style={styles.usernameText}>{player.username}</Text>
										</View>
									</View>
								</View>
							))}
						</View>
					)}
					{partidoData.teams.teamB && (
						<View style={styles.playerList && { alignItems: "flex-end" }}>
							<Text
								style={{
									fontFamily: "SF-Pro-Semibold",
									fontSize: 14,
									paddingBottom: 10,
									alignSelf: "center",
								}}
							>
								{partidoData.teams.teamB.teamDisplayName}
							</Text>
							{partidoData.teams.teamB.teamPlayers.map((player, index) => (
								<View style={styles.userContainer} key={index}>
									<View style={styles.userSubContainer}>
										<View style={styles.usernameContainerR}>
											<Text style={styles.usernameText}>{player.username}</Text>
										</View>
									</View>
									<Image
										source={{
											uri: player.photoUrl,
										}}
										style={styles.userImageR}
									/>
								</View>
							))}
						</View>
					)}
				</View>
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.startGameButton} onPress={tempButton}>
					<Text style={styles.startGameText}>Empezar Partido</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.menuButton} onPress={tempButton}>
					<Ionic name="ellipsis-vertical" style={styles.menuIcon} />
				</TouchableOpacity>
			</View>
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
		marginTop: 30,
	},
	playerList: {
		width: "48%",
	},
	userContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	userImageL: {
		width: 50,
		height: 50,
		borderRadius: 25, // Hace la imagen circular
		borderWidth: 2, // Tamaño del borde
		borderColor: theme.colors.primary, // Color del borde
		marginRight: 10, // Espacio a la derecha de la imagen
	},
	userImageR: {
		width: 50,
		height: 50,
		borderRadius: 25, // Hace la imagen circular
		borderWidth: 2, // Tamaño del borde
		borderColor: theme.colors.primary, // Color del borde
		marginLeft: 10, // Espacio a la derecha de la imagen
	},
	usernameContainerL: {
		flexDirection: "column",
		alignItems: "flex-start",
	},
	usernameContainerR: {
		flexDirection: "column",
		alignItems: "flex-end",
	},
	usernameText: {
		fontFamily: "SF-Pro",
		fontSize: 16,
		color: theme.colors.text,
	},
	nameText: {
		fontFamily: "SF-Pro",
		fontSize: 14,
		color: theme.colors.secondary,
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
});

export default MatchDetailsScreen;
