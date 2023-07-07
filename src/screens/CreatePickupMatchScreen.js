import React, { useState } from "react";
import { View, Alert, StyleSheet, TouchableOpacity, Text } from "react-native";
import BackgroundMore from "../components/BackgroundMore";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionic from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";

import { createMatch } from "../components/ApiService";

const CreatePickupMatchScreen = ({ navigation, route }) => {
	const userData = route.params.userData;
	const [latitude, setLatitude] = useState({ value: "", error: "" });
	const [longitude, setLongitude] = useState({ value: "", error: "" });
	const [rules, setRules] = useState("5v5");
	const [date, setDate] = useState(new Date());
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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
				<Text style={styles.headerText}>Pickup {rules}</Text>
				<TouchableOpacity onPress={tempButton} style={styles.headerButtonRight}>
					<Ionic
						name="menu-sharp"
						style={{ fontSize: 25, color: "transparent" }}
					/>
				</TouchableOpacity>
			</View>
			{/*      Body        */}
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
					<View style={{ width: "100%", marginBottom: 50 }}>
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
				</View>

				<DateTimePickerModal
					isVisible={isDatePickerVisible}
					mode="datetime"
					onConfirm={handleConfirm}
					onCancel={hideDatePicker}
				/>

				<Button
					mode="contained"
					onPress={onCreatePressed}
					style={{ marginTop: 20 }}
				>
					Crear Partido
				</Button>
			</View>
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
});

export default CreatePickupMatchScreen;
