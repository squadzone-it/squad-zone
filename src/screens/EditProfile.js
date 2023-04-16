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
import TextInput from "../components/TextInput";

import { useNavigation } from "@react-navigation/native";

const Header = ({}) => {
	const navigation = useNavigation();

	const crossPress = () => {
		navigation.navigate("Profile");
	};

	const tickPress = () => {
		navigation.navigate("Profile");
	};
	return (
		<View style={styles.header}>
			<TouchableOpacity style={styles.headerButtonLeft} onPress={crossPress}>
				<Ionic
					name="close-sharp"
					style={{ fontSize: 32, color: theme.colors.text }}
				/>
			</TouchableOpacity>
			<Text style={styles.headerText}>Editar perfil</Text>
			<TouchableOpacity onPress={tickPress} style={styles.headerButtonRight}>
				<Ionic
					name="checkmark-sharp"
					style={{ fontSize: 32, color: theme.colors.text }}
				/>
			</TouchableOpacity>
		</View>
	);
};

const EditPicture = () => {
	return (
		<View style={{ alignItems: "center" }}>
			<Image
				source={require("../assets/logo.png")}
				style={{
					height: 80,
					width: 80,
					borderRadius: 500,
					borderWidth: 1,
					padding: 5,
					borderColor: theme.colors.primary,
				}}
			/>
			<TouchableOpacity>
				<Text style={{ marginTop: 10, color: theme.colors.primary }}>
					Cambiar foto de perfil
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const BasicFields = () => {
	const [name, setName] = useState({ value: "", error: "" });
	const [lastName, setLastName] = useState({ value: "", error: "" });
	const [status, setStatus] = useState({ value: "", error: "" });
	const [gender, setGender] = useState("");
	return (
		<View style={{ paddingTop: 10 }}>
			<Text style={{ color: theme.colors.secondary }}> Campos basicos: </Text>
			<TextInput
				label="Nombre"
				returnKeyType="next"
				value={name.value}
				onChangeText={(text) => setName({ value: text, error: "" })}
				error={!!name.error}
				errorText={name.error}
			/>
			<TextInput
				label="Apellidos"
				returnKeyType="next"
				value={lastName.value}
				onChangeText={(text) => setLastName({ value: text, error: "" })}
				error={!!lastName.error}
				errorText={lastName.error}
			/>
			<TextInput
				label="Estado"
				returnKeyType="next"
				value={status.value}
				onChangeText={(text) => setStatus({ value: text, error: "" })}
				error={!!status.error}
				errorText={status.error}
			/>
			<View
				style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}
			>
				<Text style={{ color: theme.colors.secondary }}>Género:</Text>
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						onPress={() => setGender("male")}
						style={{ marginLeft: 30 }}
					>
						<Ionic
							name="male-sharp"
							style={{ fontSize: 32, color: theme.colors.primary }}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setGender("female")}
						style={{ marginLeft: 30 }}
					>
						<Ionic
							name="female-sharp"
							style={{ fontSize: 32, color: theme.colors.primary }}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setGender("other")}
						style={{ marginLeft: 30 }}
					>
						<Ionic
							name="car-sport-sharp"
							style={{ fontSize: 32, color: theme.colors.primary }}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const Body = () => {
	return (
		<View
			style={{
				backgroundColor: theme.colors.surface,
				height: "100%",
				width: "100%",
			}}
		>
			<View
				style={{
					flex: 1,
					paddingHorizontal: 10,
					justifyContent: "flex-start",
				}}
			>
				<EditPicture />
				<BasicFields />
			</View>
		</View>
	);
};

const ProfileScreen = () => {
	return (
		<BackgroundTabs>
			<Header />
			<Body />
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
		fontFamily: "SF-Pro-Bold",
		fontSize: 20,
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
});
