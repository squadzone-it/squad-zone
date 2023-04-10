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

import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase-config";

const settingsButton = () => {};
const follow = () => {};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let uid;
auth.onAuthStateChanged(function (user) {
	uid = user.uid;
});

const Header = ({}) => {
	const navigation = useNavigation();

	const onLogoutPressed = () => {
		navigation.navigate("StartScreen");
	};
	return (
		<View style={styles.header}>
			<TouchableOpacity
				style={styles.headerButtonLeft}
				onPress={settingsButton}
			>
				<Ionic
					name="options"
					style={{ fontSize: 32, color: theme.colors.text }}
				/>
			</TouchableOpacity>
			<Text style={styles.headerText}>
				SQUAD Z<Ionic name="football-outline" style={{ fontSize: 23 }} />
				NE
			</Text>
			<TouchableOpacity
				onPress={onLogoutPressed}
				style={styles.headerButtonRight}
			>
				<Ionic
					name="log-out-outline"
					style={{ fontSize: 25, color: theme.colors.error }}
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
				width: "100%",
				paddingHorizontal: 15,
				paddingVertical: 15,
				backgroundColor: theme.colors.surface,
			}}
		>
			<Image
				source={require("../assets/logo.png")}
				style={{
					flex: 1,
					maxHeight: 70,
					maxWidth: 70,
					borderRadius: 500,
					marginRight: "auto",
					borderWidth: 1,
					padding: 5,
					borderColor: theme.colors.primary,
				}}
			/>
			<View style={{ flex: 4 }}>
				<Text
					style={{
						fontSize: 16,
						fontWeight: "500",
						marginLeft: 20,
						fontFamily: "SF-Pro-Bold",
						color: theme.colors.text,
					}}
				>
					@{data.nombre_usuario}
					{"   "}
					<Ionic
						name="checkmark-circle-sharp"
						style={{ fontSize: 16, color: "cyan" }}
					/>
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
	return (
		<View
			style={{
				backgroundColor: theme.colors.surface,
				height: "100%",
				width: "100%",
			}}
		>
			<StatusBar
				backgroundColor={theme.colors.surface}
				barStyle="light-content"
				animated={true}
			/>
			<ProfileInfo data={data} />
			<View style={{ flex: 1, paddingHorizontal: 20 }}>
				<Button mode="contained" onPress={follow}>
					FOLLOW
				</Button>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						width: "100%",
						paddingHorizontal: 0,
						paddingVertical: 15,
					}}
				>
					<Ionic name="mail" style={{ fontSize: 30 }} />
					<Paragraph> {data.email}</Paragraph>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						width: "100%",
						paddingHorizontal: 0,
						paddingVertical: 15,
					}}
				>
					<Ionic name="attach" style={{ fontSize: 30 }} />
					<Paragraph> {data.id}</Paragraph>
				</View>
			</View>
		</View>
	);
};

const ProfileScreen = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		if (uid) {
			// only fetch data when uid is not null
			async function fetchData() {
				const result = await getUserData(uid);
				setData(result);
			}
			fetchData();
		}
	}, [uid]);

	return (
		<BackgroundTabs>
			<Header />
			{data ? <Body data={data} /> : <Paragraph> Loading... </Paragraph>}
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
					id: uid,
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
