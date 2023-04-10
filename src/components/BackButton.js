import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default function BackButton({ goBack }) {
	return (
		<TouchableOpacity onPress={goBack} style={styles.container}>
			<Ionicons name="arrow-back" size={24} color="white" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 10 + getStatusBarHeight(),
		left: 4,
	},
});
