import React, { useState } from "react";
import { View, Alert, StyleSheet, Image, Platform, Text } from "react-native";
import Background from "../components/Background";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { createMatch } from "../components/ApiService";
import { white } from "color-name";

const CreateMatchScreen = ({ navigation }) => {
	const [latitude, setLatitude] = useState({ value: "", error: "" });
	const [longitude, setLongitude] = useState({ value: "", error: "" });
	const [rules, setRules] = useState("4v4");
	const [date, setDate] = useState(new Date());
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const [buttonText, setButtonText] = useState("Selecciona el día y la hora");

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
		<Background>
			<BackButton goBack={navigation.goBack} />

			<Header>Crear Partido</Header>

			<TextInput
				label="Latitud"
				returnKeyType="next"
				value={latitude.value}
				onChangeText={(text) => setLatitude({ value: text, error: "" })}
				error={!!latitude.error}
				errorText={latitude.error}
				keyboardType="numeric"
			/>

			<TextInput
				label="Longitud"
				returnKeyType="next"
				value={longitude.value}
				onChangeText={(text) => setLongitude({ value: text, error: "" })}
				error={!!longitude.error}
				errorText={longitude.error}
				keyboardType="numeric"
			/>

			<View style={{ borderWidth: 1, borderColor: "#000", marginTop: 10 }}>
				<Picker
					selectedValue={rules}
					onValueChange={(itemValue) => setRules(itemValue)}
					style={{ color: white }}
				>
					<Picker.Item label="4v4" value="4v4" />
					<Picker.Item label="5v5" value="5v5" />
					<Picker.Item label="6v6" value="6v6" />
					<Picker.Item label="7v7" value="7v7" />
				</Picker>
			</View>

			<Button
				onPress={showDatePicker}
				mode="outlined"
				style={{ marginTop: 16 }}
			>
				<Text style={{ fontSize: 12 }}>{buttonText}</Text>
			</Button>

			<DateTimePickerModal
				isVisible={isDatePickerVisible}
				mode="datetime"
				onConfirm={handleConfirm}
				onCancel={hideDatePicker}
			/>

			<Button
				mode="contained"
				onPress={onCreatePressed}
				style={{ marginTop: 10 }}
			>
				Crear Partido
			</Button>
		</Background>
	);
};

export default CreateMatchScreen;
