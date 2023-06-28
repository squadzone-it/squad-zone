import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import Background from "../components/Background";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { nameValidator } from "../helpers/nameValidator";

import { createSquad } from "../components/ApiService";

const CreateSquadScreen = ({ navigation, route }) => {
	const [teamName, setTeamName] = useState({ value: "", error: "" });
	const { userUid } = route.params;

	const onCreatePressed = async () => {
		console.log(userUid);
		const teamNameError = nameValidator(teamName.value);

		if (teamNameError) {
			setTeamName({ ...teamName, error: teamNameError });
			return;
		}

		try {
			// Crear el equipo con el nombre ingresado
			await createSquad(teamName.value, userUid);
			// Navegar a otra pantalla o mostrar un mensaje de éxito
		} catch (error) {
			// Manejo de errores, por ejemplo, mostrar un mensaje de error
		}
	};

	return (
		<Background>
			<BackButton goBack={navigation.goBack} />

			<Header>¡Crear tu propio Equipo!</Header>
			<Image
				source={require("../assets/newTeamBadge.png")}
				style={styles.image}
			/>

			<TextInput
				label="Nombre del Equipo"
				returnKeyType="done"
				value={teamName.value}
				onChangeText={(text) => setTeamName({ value: text, error: "" })}
				error={!!teamName.error}
				errorText={teamName.error}
			/>

			<View
				style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
			>
				<View style={styles.HorizontalLine} />
			</View>

			<Button
				mode="contained"
				onPress={onCreatePressed}
				style={{ marginTop: 10 }}
			>
				CREAR
			</Button>

			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<View style={styles.HorizontalLine} />
			</View>
		</Background>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		marginTop: 4,
	},
	link: {
		color: theme.colors.primary,
		fontFamily: "SF-Pro",
	},
	HorizontalLine: {
		flex: 1,
		borderTopColor: theme.colors.secondary,
		borderTopWidth: 1,
		borderTopStyle: "solid",
		marginHorizontal: 0,
		marginVertical: 5,
	},
	image: {
		width: 250,
		height: 250,
		marginBottom: 8,
	},
});

export default CreateSquadScreen;
