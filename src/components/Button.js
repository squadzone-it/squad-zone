import React from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { theme } from "../core/theme";

export default function Button({ mode, style, ...props }) {
	return (
		<PaperButton
			style={[
				styles.button,
				mode === "outlined" && {
					backgroundColor: theme.colors.surface,
					borderColor: theme.colors.primary,
				},
				style,
			]}
			labelStyle={styles.text}
			mode={mode}
			{...props}
		/>
	);
}

const styles = StyleSheet.create({
	button: {
		width: "100%",
		marginVertical: 10,
		paddingVertical: 2,
		borderRadius: 10,
	},
	text: {
		fontFamily: "CODE-Bold",
		//fontWeight: "bold",
		fontSize: 24,
		lineHeight: 26,
	},
});
