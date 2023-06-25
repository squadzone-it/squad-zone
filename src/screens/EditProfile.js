import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionic from "react-native-vector-icons/Ionicons";
import BackgroundMore from "../components/BackgroundMore";
import { theme } from "../core/theme";
import React, { useState, useEffect } from "react";
import TextInput from "../components/TextInput";

import { requestGalleryPermission } from "../components/requestPermissions";
import * as ImagePicker from "expo-image-picker";

import { useNavigation } from "@react-navigation/native";

import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase-config";

let uid = null;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.onAuthStateChanged(function (user) {
	if (user) {
		uid = user.uid;
	}
});

const EditProfileScreen = () => {
	const [data, setData] = useState(null);
	const updateUserData = async (userId, userData) => {
		try {
			const functionUrl =
				"https://europe-west2-squadzoneapp.cloudfunctions.net/updateUserData";
			const response = await fetch(functionUrl, {
				method: "PUT", // Usa PUT en lugar de POST
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId,
					userData,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error ${response.status}`);
			}

			const responseData = await response.json();

			if (responseData.result === "success") {
				console.log("User data updated successfully");
			} else {
				throw new Error(
					`Error updating user data in Firestore: ${responseData.error}`
				);
			}
		} catch (error) {
			console.error("Error updating user data in Firestore:", error);
			throw error;
		}
	};

	const getUserData = async (userId) => {
		try {
			const functionUrl =
				"https://europe-west2-squadzoneapp.cloudfunctions.net/getUserData";
			const response = await fetch(functionUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: userId,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error ${response.status}`);
			}

			const responseData = await response.json();

			if (responseData.result === "success") {
				console.log("User data retrieved successfully:", responseData.data);
				return responseData.data;
			} else {
				throw new Error(
					`Error retrieving user data from Firestore: ${responseData.error}`
				);
			}
		} catch (error) {
			console.error("Error retrieving user data from Firestore:", error);
			throw error;
		}
	};

	const tempData = {
		lastName: " ",
		email: " ",
		id: " ",
		name: " ",
		username: " ",
		photoUrl: " ",
	};

	const uploadPhoto = async (id, photo) => {
		try {
			const functionUrl =
				"https://europe-west2-squadzoneapp.cloudfunctions.net/uploadPhotos";
			const response = await fetch(functionUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
					photo,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error ${response.status}`);
			}

			const responseData = await response.json();

			if (responseData.result === "success") {
				console.log("Profile photo updated successfully");
			} else {
				throw new Error(
					`Error uploading profile photo to Firestore: ${responseData.error}`
				);
			}
		} catch (error) {
			console.error("Error uploading profile photo to Firestore:", error);
			throw error;
		}
	};

	const navigation = useNavigation();

	const crossPress = () => {
		navigation.navigate("Profile");
	};

	useEffect(() => {
		if (uid) {
			async function fetchData() {
				try {
					const result = await getUserData(uid);
					setData(result);
				} catch (error) {
					console.error("Error retrieving user data from Firestore:", error);
				}
			}
			fetchData();
		}
	}, [uid]);

	const tickPress = async () => {
		try {
			const userData = {
				name: name.value,
				lastName: lastName.value,
			};
			await updateUserData(uid, userData);
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
			quality: 1,
			base64: true,
		});

		if (!result.canceled) {
			const { base64 } = result.assets[0];
			const base64Image = `data:image/jpeg;base64,${base64}`;
			try {
				await uploadPhoto(uid, base64Image);

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
				<TouchableOpacity style={styles.headerButtonLeft} onPress={crossPress}>
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
