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
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import Logo from "../components/Logo";

import { useNavigation } from "@react-navigation/native";

const settingsButton = () => {};

const handlePress = async () => {
	const data = await getUserData();
};

const Header = () => {
	return (
		<View style={styles.header}>
			<TouchableOpacity style={styles.headerButtonLeft}>
				<Ionic name="add" style={{ fontSize: 32, color: theme.colors.text }} />
			</TouchableOpacity>
			<Text style={styles.headerText}>
				SQUAD Z<Ionic name="football-outline" style={{ fontSize: 23 }} />
				NE
			</Text>
			<TouchableOpacity onPress={handlePress} style={styles.headerButtonRight}>
				<Ionic
					name="options"
					style={{ fontSize: 25, color: theme.colors.text }}
				/>
			</TouchableOpacity>
		</View>
	);
};

const ProfileInfo = ({ data }) => {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				//width: "100%",
				paddingHorizontal: 15,
				paddingTop: 15,
				backgroundColor: theme.colors.surface,
			}}
		>
			<Image
				source={require("../assets/logo.png")}
				style={{
					width: 70,
					height: 70,
					borderRadius: 50,
					marginRight: "auto",
					borderWidth: 1,
					borderColor: theme.colors.primary,
				}}
			/>
			<View>
				<Text
					style={{
						fontSize: 13,
						fontWeight: "500",
						marginLeft: 20,
						fontFamily: "SF-Pro-Bold",
						color: theme.colors.text,
					}}
				>
					@{data.nombre_usuario}
				</Text>
				<Text
					style={{
						fontSize: 13,
						fontWeight: "500",
						marginLeft: 20,
						fontFamily: "SF-Pro",
						color: theme.colors.text,
					}}
				>
					{data.nombre} {data.apellidos}
				</Text>
			</View>
		</View>
	);
};

const Body = ({ data }) => {
	const navigation = useNavigation();

	const onLogoutPressed = () => {
		navigation.navigate("StartScreen");
	};
	return (
		<View style={{ backgroundColor: theme.colors.surface, height: "100%" }}>
			<StatusBar
				backgroundColor={theme.colors.surface}
				barStyle="light-content"
				animated={true}
			/>
			<ProfileInfo data={data} />
			<Button mode="contained" onPress={onLogoutPressed}>
				LOGOUT
			</Button>
			<Paragraph></Paragraph>
		</View>
	);
};

const ProfileScreen = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		async function fetchData() {
			const result = await getUserData();
			setData(result);
		}
		fetchData();
	}, []);

	return (
		<BackgroundTabs>
			<Header />
			{data ? <Body data={data} /> : <Logo />}
		</BackgroundTabs>
	);
};

async function getUserData() {
	try {
		const response = await fetch(
			"https://readdatauser-zvcc2bcxkq-nw.a.run.app",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: "rDhKT0cFAlOgZvXdEX9CFriwnpp2",
				}),
			}
		);

		if (response.ok) {
			const data = await response.json();
			console.log("Datos del usuario obtenidos correctamente:", data);
			return data;
			//setUser(data);
		} else {
			console.error(
				"Error al obtener los datos del usuario:",
				response.statusText
			);
		}
	} catch (error) {
		console.error("Error al obtener los datos del usuario:", error);
	}
}

export default ProfileScreen;

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		//justifyContent: "space-evenly",
		//paddingHorizontal: 15,
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
});
