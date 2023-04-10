import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import React from "react";
import Ionic from "react-native-vector-icons/Ionicons";
import BackgroundTabs from "../components/BackgroundTabs";
import { theme } from "../core/theme";

const messagesButton = () => {};

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
			<TouchableOpacity
				onPress={messagesButton}
				style={styles.headerButtonRight}
			>
				<Ionic
					name="paper-plane-sharp"
					style={{ fontSize: 25, color: theme.colors.text }}
				/>
			</TouchableOpacity>
		</View>
	);
};

const Body = () => {
	return (
		<View style={{ backgroundColor: theme.colors.surface, height: "100%" }}>
			<StatusBar
				backgroundColor={theme.colors.surface}
				barStyle="light-content"
				animated={true}
			/>
		</View>
	);
};

const NewsScreen = () => {
	return (
		<BackgroundTabs>
			<Header />
			<Body />
		</BackgroundTabs>
	);
};

export default NewsScreen;

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
