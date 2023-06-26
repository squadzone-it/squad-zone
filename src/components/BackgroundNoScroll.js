import { theme } from "../core/theme";
import React from "react";
import { ImageBackground, StyleSheet, View, StatusBar } from "react-native";

export default function BackgroundNoScroll({ children }) {
	return (
		<ImageBackground style={styles.background}>
			<StatusBar
				backgroundColor={theme.colors.surface}
				barStyle="light-content"
				animated={true}
			/>
			<View style={styles.container}>{children}</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		width: "100%",
		backgroundColor: theme.colors.surface,
	},
	container: {
		flex: 1,
		paddingVertical: 20,
		width: "100%",
		alignSelf: "center",
		alignItems: "flex-start",
		justifyContent: "center",
	},
});
