import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput as Input } from "react-native-paper";
import { theme } from "../core/theme";
import { TextInput as NativeTextInput } from "react-native";

export default function TextInput({ errorText, description, ...props }) {
	const containerStyle =
		errorText || description ? styles.containerError : styles.container;

	return (
		<View style={containerStyle}>
			<Input
				style={styles.input}
				selectionColor={theme.colors.primary}
				underlineColor={theme.colors.secondary}
				mode="flat"
				{...props}
				outlineStyle={{ borderRadius: 10 }}
				theme={{
					fonts: {
						bodyLarge: {
							...theme.fonts.bodyLarge,
							fontFamily: "SF-Pro",
							color: theme.colors.text,
						},
					},
				}}
				render={(
					props // Agrega este bloque de renderizado
				) => (
					<NativeTextInput
						{...props}
						style={[
							props.style,
							styles.nativeInput,
							{ color: theme.colors.text },
						]}
					/>
				)}
			/>

			{description && !errorText ? (
				<Text style={styles.description}>{description}</Text>
			) : null}
			{errorText ? <Text style={styles.error}>{errorText}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		marginTop: 10,
		marginBottom: 15,
	},
	containerError: {
		width: "100%",
		marginTop: 10,
		marginBottom: -10,
	},
	input: {
		backgroundColor: theme.colors.surface,
	},
	description: {
		fontSize: 13,
		color: theme.colors.primary,
		paddingTop: 2,
		fontFamily: "SF-Pro",
		paddingLeft: 5,
	},
	error: {
		fontFamily: "SF-Pro",
		fontSize: 13,
		color: theme.colors.error,
		paddingTop: 2,
		paddingLeft: 5,
	},
	nativeInput: {
		paddingHorizontal: 15,
		paddingVertical: 10,
		fontFamily: "SF-Pro",
	},
});
