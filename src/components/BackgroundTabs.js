import React from "react";
import { ImageBackground, StyleSheet, View, StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../core/theme";

export default function BackgroundNoScroll({ children }) {
	const navigation = useNavigation();
	const route = useRoute().name;

	const onRefresh = () => {
		navigation.reset({
			index: 0,
			routes: [{ name: route }],
		});
	};

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
