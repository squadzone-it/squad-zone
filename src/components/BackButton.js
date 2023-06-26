import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../core/theme";

export default function BackButton({ goBack }) {
	return (
		<TouchableOpacity onPress={goBack} style={styles.container}>
			<Ionicons
				name="arrow-back"
				size={25}
				style={{ color: theme.colors.text }}
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 15,
		left: 15,
	},
});
