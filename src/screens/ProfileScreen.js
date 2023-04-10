import {
	View,
	Text,
	StatusBar,
	Image,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import React from "react";
import Ionic from "react-native-vector-icons/Ionicons";
import BackgroundTabs from "../components/BackgroundTabs";
import { theme } from "../core/theme";

const settingsButton = () => {};

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
				onPress={settingsButton}
				style={styles.headerButtonRight}
			>
				<Ionic
					name="options"
					style={{ fontSize: 25, color: theme.colors.text }}
				/>
			</TouchableOpacity>
		</View>
	);
};

const ProfileInfo = () => {
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
					@username
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
					Guzmán G. Riancho
				</Text>
			</View>
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
			<ProfileInfo />
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
