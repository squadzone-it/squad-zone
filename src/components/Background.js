import React from "react";
import { ImageBackground, StyleSheet, View, StatusBar } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { theme } from "../core/theme";

export default function Background({ children }) {
	return (
		<ImageBackground
			/*source={require("../assets/background_dot.png")}
			resizeMode="repeat"*/

			style={styles.background}
		>
			<StatusBar
				backgroundColor={theme.colors.surface}
				barStyle="light-content"
				animated={true}
			/>
			<KeyboardAwareScrollView
				behavior="padding"
				contentContainerStyle={styles.scrollViewContent}
			>
				<View style={styles.container}>{children}</View>
			</KeyboardAwareScrollView>
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
		padding: 20,
		paddingVertical: 20,
		width: "100%",
		//maxWidth: 360,
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
	},
	scrollViewContent: {
		flexGrow: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
