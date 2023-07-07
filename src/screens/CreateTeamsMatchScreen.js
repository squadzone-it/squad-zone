import React, { useState, useEffect } from "react";
import {
	View,
	Alert,
	StyleSheet,
	TouchableOpacity,
	Text,
	Modal,
	Image,
	Switch,
} from "react-native";
import BackgroundMore from "../components/BackgroundMore";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionic from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";

import { createMatch, getSquadData } from "../components/ApiService";

const CreateTeamsMatchScreen = ({ navigation, route }) => {
	const userData = route.params.userData;
	const [squadData, setSquadData] = useState(null);
	const [latitude, setLatitude] = useState({ value: "", error: "" });
	const [longitude, setLongitude] = useState({ value: "", error: "" });
	const [rules, setRules] = useState("5v5");
	const [subs, setSubs] = useState(0);
	const [date, setDate] = useState(new Date());
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const [showConvocatoriaModal, setShowConvocatoriaModal] = useState(false);
	const [selectedMembers, setSelectedMembers] = useState([]);

	useEffect(() => {
		const fetchSquadData = async () => {
			const squadData = await getSquadData(userData.team);
			setSquadData(squadData);
		};

		fetchSquadData();
	}, []);

	const showDatePicker = () => {
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const handleConfirm = (date) => {
		setButtonText(date.toLocaleString());
		setDate(date);
		hideDatePicker();
	};

	const handleToggleSwitch = (member) => {
		if (selectedMembers.includes(member)) {
			setSelectedMembers(selectedMembers.filter((m) => m !== member));
		} else {
			setSelectedMembers([...selectedMembers, member]);
		}
	};

	const tempButton = () => {};

	const onCreatePressed = async () => {
		const gameData = {
			location: {
				latitude: parseFloat(latitude.value),
				longitude: parseFloat(longitude.value),
			},
			rules: rules,
		};

		try {
			await createMatch(
				"open",
				"pickup",
				"auto",
				date.toISOString(),
				10,
				gameData,
				["kuzdGikCl7WHGIpXa05mKqXPsuj2"],
				[]
			);
			setLatitude({ value: "", error: "" });
			setLongitude({ value: "", error: "" });
			setRules("4v4");
			setDate(new Date());

			Alert.alert(
				"Partido creado",
				`Se creó un partido en la pista x para esta fecha: ${date.toLocaleString()}`,
				[
					{ text: "OK", onPress: () => navigation.goBack() }, // al presionar OK, se vuelve a la pantalla anterior
				]
			);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<BackgroundMore>
			{/*   Header   */}
			{squadData && (
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
						{squadData.displayname} {rules}
					</Text>
					<TouchableOpacity
						onPress={tempButton}
						style={styles.headerButtonRight}
					>
						<Ionic
							name="menu-sharp"
							style={{ fontSize: 25, color: "transparent" }}
						/>
					</TouchableOpacity>
				</View>
			)}
			{/*      Body        */}
			{squadData && (
				<View
					style={{
						backgroundColor: theme.colors.surface,
						height: "100%",
						width: "100%",
						justifyContent: "space-around",
						padding: 10,
					}}
				>
					<View>
						<View style={{ width: "100%", marginTop: 10 }}>
							<Slider
								style={{ height: 40 }}
								minimumValue={4}
								maximumValue={7}
								step={1}
								value={5} // o el valor inicial para tu estado de `rules`
								onValueChange={(value) => setRules(value + "v" + value)}
								maximumTrackTintColor={theme.colors.text}
								minimumTrackTintColor={theme.colors.text}
								thumbTintColor={theme.colors.primary}
							/>
							<View style={styles.labelsContainer}>
								<Text style={styles.sliderLabel}>4v4</Text>
								<Text style={styles.sliderLabel}>5v5</Text>
								<Text style={styles.sliderLabel}>6v6</Text>
								<Text style={styles.sliderLabel}>7v7</Text>
							</View>
						</View>
						<View style={{ width: "100%", marginTop: 30, marginBottom: 50 }}>
							<Text
								style={{ color: theme.colors.secondary, fontFamily: "SF-Pro" }}
							>
								Suplentes:
							</Text>
							<Slider
								style={{ height: 40 }}
								minimumValue={0}
								maximumValue={3}
								step={1}
								value={0} // o el valor inicial para tu estado de `rules`
								onValueChange={(value) => setSubs(value)}
								maximumTrackTintColor={theme.colors.text}
								minimumTrackTintColor={theme.colors.text}
								thumbTintColor={theme.colors.primary}
							/>
							<View style={styles.labelsContainer}>
								<Text style={styles.sliderLabel}>0</Text>
								<Text style={styles.sliderLabel}>1</Text>
								<Text style={styles.sliderLabel}>2</Text>
								<Text style={styles.sliderLabel}>3</Text>
							</View>
						</View>
						<View style={{ flexDirection: "row", alignSelf: "center" }}>
							<View>
								<TouchableOpacity
									onPress={tempButton}
									style={styles.locationTimeButtons}
								>
									<Ionic
										name="location-sharp"
										style={{ fontSize: 35, color: theme.colors.text }}
									/>
								</TouchableOpacity>
							</View>
							<View>
								<TouchableOpacity
									onPress={showDatePicker}
									style={styles.locationTimeButtons}
								>
									<Ionic
										name="calendar-sharp"
										style={{ fontSize: 35, color: theme.colors.text }}
									/>
								</TouchableOpacity>
							</View>
						</View>
						<View style={{ width: "80%", alignSelf: "center" }}>
							<TouchableOpacity
								onPress={() => setShowConvocatoriaModal(true)}
								style={styles.locationTimeButtons}
							>
								<Text
									style={{
										fontFamily: "SF-Pro-Bold",
										color: theme.colors.text,
										fontSize: 18,
										textAlign: "center",
									}}
								>
									CONVOCA A TU EQUIPO
								</Text>
							</TouchableOpacity>
						</View>
					</View>

					<DateTimePickerModal
						isVisible={isDatePickerVisible}
						mode="datetime"
						onConfirm={handleConfirm}
						onCancel={hideDatePicker}
					/>

					{showConvocatoriaModal && (
						<Modal
							animationType="slide"
							transparent={true}
							visible={showConvocatoriaModal}
							onRequestClose={() => setShowConvocatoriaModal(false)}
						>
							<TouchableOpacity
								style={styles.modalBackground}
								onPress={() => setShowConvocatoriaModal(false)}
							>
								<View style={styles.modalContent}>
									<Text
										style={{
											fontFamily: "SF-Pro-Bold",
											fontSize: 20,
											color: theme.colors.text,
											borderBottomWidth: 1,
											borderBottomColor: theme.colors.secondary,
										}}
									>
										Convocatoria
									</Text>
									{squadData.members.map((member, index) => (
										<View style={styles.convocatoriaContainer} key={index}>
											<TouchableOpacity
												onPress={() =>
													navigation.navigate("OtherUserProfileScreen", {
														user: member,
													})
												}
											>
												<View
													style={{
														flexDirection: "row",
														alignItems: "center",
													}}
												>
													<Image
														source={{
															uri: member.photoUrl,
														}}
														style={styles.convocatoriaBadge}
													/>

													<View style={styles.convocatoriaSubContainer}>
														<View style={styles.convocatoriaNameContainer}>
															<Text style={styles.convocatoriaNameText}>
																{member.username}
															</Text>
														</View>
														<View
															style={styles.convocatoriaDescriptionContainer}
														>
															<Text style={styles.convocatoriaDecriptionText}>
																{member.name} {/*{member.lastName}*/}
															</Text>
														</View>
													</View>
												</View>
											</TouchableOpacity>
											<View
												style={{
													flexDirection: "row",
												}}
											>
												<Switch
													trackColor={{
														false: theme.colors.secondary,
														true: theme.colors.primary,
													}}
													thumbColor={theme.colors.text}
													onValueChange={() => handleToggleSwitch(member)}
													value={selectedMembers.includes(member)}
												/>
											</View>
										</View>
									))}
								</View>
							</TouchableOpacity>
						</Modal>
					)}

					<Button
						mode="contained"
						onPress={onCreatePressed}
						style={{ marginTop: 20 }}
					>
						Crear Partido
					</Button>
				</View>
			)}
		</BackgroundMore>
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
	labelsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: -10,
		marginHorizontal: 5,
	},
	sliderLabel: {
		color: theme.colors.secondary,
	},
	locationTimeButtons: {
		borderRadius: 10,
		borderColor: theme.colors.secondary,
		borderWidth: 1,
		margin: 10,
		marginHorizontal: 30,
		fontSize: 24,
		fontWeight: "500",
		padding: 15,
		alignItems: "center",
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
		width: "80%",
		alignItems: "center",
	},
	convocatoriaContainer: {
		flexDirection: "row",
		padding: 10,
		alignItems: "center",
		borderBottomColor: theme.colors.secondary,
		borderBottomWidth: 1,
		width: "100%",
		justifyContent: "space-between",
	},
	convocatoriaBadge: {
		width: 50,
		height: 50,
		borderRadius: 25, // Hace la imagen circular
		borderWidth: 2, // Tamaño del borde
		borderColor: theme.colors.primary, // Color del borde
		marginRight: 10, // Espacio a la derecha de la imagen
	},
	convocatoriaSubContainer: {
		flexDirection: "column",
	},
	convocatoriaNameContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	convocatoriaNameText: {
		color: theme.colors.text,
		fontSize: 16,
		fontWeight: "bold",
	},
	convocatoriaDescriptionContainer: {
		flexDirection: "row",
	},
	convocatoriaDecriptionText: {
		color: theme.colors.secondary,
		fontSize: 14,
	},
});

export default CreateTeamsMatchScreen;
