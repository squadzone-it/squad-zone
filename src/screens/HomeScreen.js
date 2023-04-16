import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
	Linking,
} from "react-native";
import React from "react";
import Ionic from "react-native-vector-icons/Ionicons";
import BackgroundTabs from "../components/BackgroundTabs";
import { theme } from "../core/theme";

const mapButton = () => {
	const latitude = 43.44461979827975;
	const longitude = -3.9325432027336413;
	const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

	Linking.openURL(url).catch((err) => console.error("An error occurred", err));
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
			<TouchableOpacity onPress={mapButton} style={styles.headerButtonRight}>
				<Ionic
					name="map-sharp"
					style={{ fontSize: 25, color: theme.colors.text }}
				/>
			</TouchableOpacity>
		</View>
	);
};

const Body = () => {
	return (
		<View
			style={{ backgroundColor: theme.colors.surface, height: "100%" }}
		></View>
	);
};

const HomeScreen = () => {
	return (
		<BackgroundTabs>
			<Header />
			<Body />
		</BackgroundTabs>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		//justifyContent: "space-evenly",
		//paddingHorizontal: 15,
		backgroundColor: theme.colors.surface,
		width: "100%",
		position: "absolute",
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
