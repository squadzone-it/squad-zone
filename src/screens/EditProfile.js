import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionic from "react-native-vector-icons/Ionicons";
import BackgroundMore from "../components/BackgroundMore";
import { theme } from "../core/theme";
import React, { useState, useEffect, useContext } from "react";
import TextInput from "../components/TextInput";

import { requestGalleryPermission } from "../components/requestPermissions";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import { UserContext } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";

import { updateUserData, uploadPhoto } from "../components/ApiService";

const EditProfileScreen = ({ route }) => {
	const { user } = useContext(UserContext);
	const [data, setData] = useState(route.params.data);

	const navigation = useNavigation();

	const tickPress = async () => {
		try {
			const userData = {
				name: name.value,
				lastName: lastName.value,
			};
			await updateUserData(user.uid, userData);
			navigation.navigate("Profile");
		} catch (error) {
			console.log(error);
		}
	};

	const [name, setName] = useState({ value: "", error: "" });
	const [lastName, setLastName] = useState({ value: "", error: "" });
	const [status, setStatus] = useState({ value: "", error: "" });
	const [gender, setGender] = useState("");

	useEffect(() => {
		if (data) {
			setName({ value: data.name, error: "" });
			setLastName({ value: data.lastName, error: "" });
		}
	}, [data]);

	const selectPhoto = async () => {
		const hasPermission = await requestGalleryPermission();

		if (!hasPermission) {
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 0.5,
		});

		if (!result.canceled) {
			const selectedAsset = result.assets[0];

			const longerSide =
				selectedAsset.width > selectedAsset.height ? "width" : "height";

			const resizeOption =
				longerSide === "width" ? { width: 400 } : { height: 400 };

			const manipResult = await ImageManipulator.manipulateAsync(
				selectedAsset.uri,
				[
					{
						resize: resizeOption,
					},
				],
				{
					compress: 1,
					format: ImageManipulator.SaveFormat.JPEG,
					base64: true,
				}
			);

			const { base64 } = manipResult;

			const base64Image = `data:image/jpeg;base64,${base64}`;

			try {
				await uploadPhoto(user.uid, base64Image);

				if (data) {
					setData({ ...data, photoUrl: base64Image });
				}
			} catch (error) {
				console.error("Error uploading profile picture:", error);
			}
		}
	};

	return (
		<BackgroundMore>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.headerButtonLeft}
					onPress={navigation.goBack}
				>
					<Ionic
						name="close-sharp"
						style={{ fontSize: 32, color: theme.colors.text }}
					/>
				</TouchableOpacity>
				<Text style={styles.headerText}>Editar perfil</Text>
				<TouchableOpacity onPress={tickPress} style={styles.headerButtonRight}>
					<Ionic
						name="checkmark-sharp"
						style={{ fontSize: 32, color: theme.colors.text }}
					/>
				</TouchableOpacity>
			</View>
			{/* Body */}
			<View
				style={{
					backgroundColor: theme.colors.surface,
					height: "100%",
					width: "100%",
				}}
			>
				<View
					style={{
						flex: 1,
						paddingHorizontal: 10,
						justifyContent: "flex-start",
					}}
				>
					{/* EditPicture */}
					<View style={{ alignItems: "center" }}>
						<Image
							source={{ uri: data ? data.photoUrl : " " }}
							style={{
								height: 80,
								width: 80,
								borderRadius: 500,
								borderWidth: 3,
								padding: 5,
								borderColor: theme.colors.primary,
							}}
						/>
						<TouchableOpacity onPress={selectPhoto}>
							<Text style={{ marginTop: 10, color: theme.colors.primary }}>
								Cambiar foto de perfil
							</Text>
						</TouchableOpacity>
					</View>
					{/* BasicFields */}
					<View style={{ paddingTop: 10 }}>
						<Text style={{ color: theme.colors.secondary }}>
							Campos básicos:
						</Text>
						<TextInput
							label="Nombre"
							returnKeyType="next"
							value={name.value}
							onChangeText={(text) => setName({ value: text, error: "" })}
							error={!!name.error}
							errorText={name.error}
						/>
						<TextInput
							label="Apellidos"
							returnKeyType="next"
							value={lastName.value}
							onChangeText={(text) => setLastName({ value: text, error: "" })}
							error={!!lastName.error}
							errorText={lastName.error}
						/>
						<TextInput
							label="Estado"
							returnKeyType="next"
							value={status.value}
							onChangeText={(text) => setStatus({ value: text, error: "" })}
							error={!!status.error}
							errorText={status.error}
						/>
						<View
							style={{
								flexDirection: "row",
								marginTop: 10,
								alignItems: "center",
							}}
						>
							<Text style={{ color: theme.colors.secondary }}>Género:</Text>
							<View style={{ flexDirection: "row" }}>
								<TouchableOpacity
									onPress={() => setGender("male")}
									style={{ marginLeft: 30 }}
								>
									<Ionic
										name="male-sharp"
										style={{ fontSize: 32, color: theme.colors.primary }}
									/>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => setGender("female")}
									style={{ marginLeft: 30 }}
								>
									<Ionic
										name="female-sharp"
										style={{ fontSize: 32, color: theme.colors.primary }}
									/>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => setGender("other")}
									style={{ marginLeft: 30 }}
								>
									<Ionic
										name="car-sport-sharp"
										style={{ fontSize: 32, color: theme.colors.primary }}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</View>
		</BackgroundMore>
	);
};

export default EditProfileScreen;

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 15,
		backgroundColor: theme.colors.surface,
		width: "100%",
		position: "relative",
		top: 0,
	},
	headerText: {
		fontFamily: "SF-Pro-Bold",
		fontSize: 20,
		fontWeight: "500",
		color: theme.colors.text,
	},
	headerButtonRight: {
		padding: 10,
		marginLeft: "auto",
	},
	headerButtonLeft: {
		padding: 10,
		marginRight: "auto",
	},
});
