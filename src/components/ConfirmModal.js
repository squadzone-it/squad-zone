import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../core/theme";

const ConfirmModal = ({ visible, onConfirm, onCancel, title, message }) => {
	return (
		<Modal animationType="slide" transparent={true} visible={visible}>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text style={styles.modalText}>{title}</Text>
					<Text style={styles.modalMessage}>{message}</Text>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
							<Text style={styles.textStyle}>Cancelar</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
							<Text style={styles.textStyle}>Confirmar</Text>
						</TouchableOpacity>
					</View>
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
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	cancelButton: {
		flex: 1, // Take up equal amount of space
		borderRadius: 10,
		padding: 15,
		backgroundColor: theme.colors.secondary, // Grey background
		justifyContent: "center",
	},
	confirmButton: {
		flex: 1, // Take up equal amount of space
		borderRadius: 10,
		padding: 15,
		backgroundColor: theme.colors.primary, // Blue background
		justifyContent: "center",
	},
	textStyle: {
		color: theme.colors.text,

		textAlign: "center",
		fontFamily: "SF-Pro-Semibold",
	},
});

export default ConfirmModal;
