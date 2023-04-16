import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BackButton({ goBack }) {
	return (
		<TouchableOpacity onPress={goBack} style={styles.container}>
			<Ionicons name="arrow-back" size={25} color="white" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 10,
		left: 10,
	},
});
