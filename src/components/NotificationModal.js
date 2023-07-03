import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../core/theme";

const NotificationModal = ({ visible, onConfirm, title, message }) => {
	return (
		<Modal animationType="slide" transparent={true} visible={visible}>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text style={styles.modalText}>{title}</Text>
					<Text style={styles.modalMessage}>{message}</Text>
					<TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
						<Text style={styles.textStyle}>OK</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)", // Semi transparent background
	},
	modalView: {
		width: "80%", // Take up 80% of screen width
		backgroundColor: theme.colors.secondaryBackground,
		borderRadius: 10,
		paddingTop: 20,
		alignItems: "center",
	},
	modalText: {
		marginBottom: 20,
		textAlign: "center",
		fontWeight: "500", // Semi-bold
		fontSize: 18,
		color: theme.colors.text,
		fontFamily: "SF-Pro-Bold",
	},
	modalMessage: {
		marginBottom: 20,
		textAlign: "center",
		fontSize: 16,
		color: theme.colors.text,
		fontFamily: "SF-Pro",
		padding: 10,
	},
	confirmButton: {
		borderRadius: 10,
		padding: 15,
		backgroundColor: theme.colors.primary, // Blue background
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	textStyle: {
		color: theme.colors.text,
		textAlign: "center",
		fontFamily: "SF-Pro-Semibold",
	},
});

export default NotificationModal;
