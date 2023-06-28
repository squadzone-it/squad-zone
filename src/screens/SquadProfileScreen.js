import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	StatusBar,
	TouchableOpacity,
	Modal,
	FlatList,
} from "react-native";
import BackgroundNoScroll from "../components/BackgroundNoScroll";
import { useNavigation } from "@react-navigation/native";

import { theme } from "../core/theme";

import Ionic from "react-native-vector-icons/Ionicons";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const SquadProfileScreen = ({ route }) => {
	const squadData = route.params.squadData;
	const navigation = useNavigation();

	const [showModal, setShowModal] = useState(false);

	const onOptionsPressed = () => {
		setShowModal(true);
	};

	const onClosePressed = () => {
		setShowModal(false);
	};

	const onEditProfilePressed = () => {
		setShowModal(false);
		navigation.navigate("EditProfile");
	};

	const Miembros = () => (
		<View>
			{squadData && (
				<FlatList
					keyboardDismissMode="on-drag"
					overScrollMode="never"
					bounces="false"
					data={squadData.members}
					keyExtractor={(item) => item.username}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("OtherUserProfileScreen", { user: item })
							}
						>
							<View style={styles.userContainer}>
								{item.photoUrl && (
									<Image
										source={{ uri: item.photoUrl }}
										style={styles.userImage}
									/>
								)}
								<View style={styles.userSubContainer}>
									<View style={styles.usernameContainer}>
										<Text style={styles.usernameText}>{item.username}</Text>
										{item.verified && (
											<Ionic
												name="checkmark-circle"
												style={styles.verifiedIcon}
											/>
										)}
									</View>
									<View style={styles.nameContainer}>
										<Text style={styles.nameText}>{item.name}</Text>
										<Text style={styles.lastnameText}>{item.lastName}</Text>
									</View>
								</View>
							</View>
						</TouchableOpacity>
					)}
				/>
			)}
			{/*{userData && userData.length > 0 && (
					<TouchableOpacity
						style={styles.clearButton}
						onPress={() => setUserData(null)}
					>
						<Ionic
							name="close-circle"
							style={{ fontSize: 25, color: theme.colors.secondary }}
						/>
					</TouchableOpacity>
                )}*/}
		</View>
	);

	const Estadisticas = () => (
		<View>
			<Text style={{ fontFamily: "SF-Pro", color: theme.colors.text }}>
				Estadisticas
			</Text>
		</View>
	);

	const Partidos = () => (
		<View>
			<Text style={{ fontFamily: "SF-Pro", color: theme.colors.text }}>
				Datos Personales
			</Text>
		</View>
	);

	const tempButton = () => {};

	const Tab = createMaterialTopTabNavigator();

	return (
		<BackgroundNoScroll>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.headerButtonLeft}
					onPress={navigation.goBack}
				>
					<Ionic
						name="arrow-back"
						style={{ fontSize: 32, color: theme.colors.text }}
					/>
				</TouchableOpacity>
				<Text style={styles.headerText}>
					SQUAD Z<Ionic name="football-outline" style={{ fontSize: 23 }} />
					NE
				</Text>
				<TouchableOpacity
					onPress={onOptionsPressed}
					style={styles.headerButtonRight}
				>
					<Ionic
						name="menu-sharp"
						style={{ fontSize: 25, color: theme.colors.text }}
					/>
				</TouchableOpacity>

				<Modal visible={showModal} animationType="slide" transparent={true}>
					<TouchableOpacity
						style={styles.modalBackground}
						onPress={onClosePressed}
					>
						<View style={styles.modalContent}>
							<TouchableOpacity onPress={tempButton}>
								<Text style={styles.modalOption}>Opcion 1</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={tempButton}>
								<Text style={styles.modalOption}>Opcion 2</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={tempButton}>
								<Text style={styles.modalOption}>Opcion 3</Text>
							</TouchableOpacity>
						</View>
					</TouchableOpacity>
				</Modal>
			</View>

			{/* Body */}
			<View
				style={{
					backgroundColor: theme.colors.surface,
					height: "100%",
					width: "100%",
				}}
			>
				<StatusBar
					backgroundColor={theme.colors.surface}
					barStyle="light-content"
					animated={true}
				/>
				{/* ProfileInfo */}
				<View
					style={{
						flexDirection: "column",
						alignItems: "center",
						width: "100%",
						paddingLeft: 10,
						backgroundColor: theme.colors.surface,
					}}
				>
					<Image
						source={{ uri: squadData.squadBadgeUrl }}
						style={styles.squadImage}
					/>
					<View style={{ alignItems: "center" }}>
						<Text style={styles.squadName}>{squadData.displayname}</Text>
						<Text style={styles.squadDescription}>{squadData.displayname}</Text>
					</View>
				</View>

				{/* Pestañas */}
				<Tab.Navigator
					screenOptions={{
						tabBarActiveTintColor: theme.colors.text,
						tabBarInactiveTintColor: theme.colors.secondary,
						tabBarPressColor: "transparent",
						tabBarShowLabel: false,
						tabBarIndicatorStyle: {
							backgroundColor: theme.colors.primary,
						},
						tabBarStyle: {
							backgroundColor: theme.colors.surface,
							borderBottomWidth: 1,
							borderBottomColor: theme.colors.primary,
							paddingTop: 0,
							height: 50,
							borderColor: theme.colors.primary,
						},
					}}
				>
					<Tab.Screen
						name="Miembros"
						component={Miembros}
						options={{
							headerShown: false,
							tabBarIcon: ({ focused, color, size }) =>
								focused ? (
									<Ionic name="people-sharp" color={color} size={25} />
								) : (
									<Ionic name="people-outline" color={color} size={23} />
								),
						}}
					/>
					<Tab.Screen
						name="Estadisticas"
						component={Estadisticas}
						options={{
							headerShown: false,
							tabBarIcon: ({ focused, color, size }) =>
								focused ? (
									<Ionic name="stats-chart-sharp" color={color} size={25} />
								) : (
									<Ionic name="stats-chart-outline" color={color} size={23} />
								),
						}}
					/>
					<Tab.Screen
						name="Partidos"
						component={Partidos}
						options={{
							headerShown: false,
							tabBarIcon: ({ focused, color, size }) =>
								focused ? (
									<Ionic name="calendar" color={color} size={25} />
								) : (
									<Ionic name="calendar-outline" color={color} size={23} />
								),
						}}
					/>
				</Tab.Navigator>
			</View>
		</BackgroundNoScroll>
	);
};

export default SquadProfileScreen;

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
		fontFamily: "CODE-Bold",
		fontSize: 24,
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
	modalBackground: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		backgroundColor: theme.colors.secondaryBackground,
		borderRadius: 10,
		padding: 10,
		minWidth: "80%",
		alignItems: "center",
	},
	modalOption: {
		marginVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.secondary,
		width: "100%",
		fontFamily: "SF-Pro",
		fontSize: 20,
		color: theme.colors.text,
	},
	modalOptionR: {
		marginVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.secondary,
		width: "100%",
		fontFamily: "SF-Pro",
		fontSize: 20,
		color: theme.colors.error,
	},
	squadImage: {
		width: 100,
		height: 100,
	},
	squadName: {
		fontSize: 24,
		fontFamily: "SF-Pro-Bold",
		color: theme.colors.text,
	},
	squadDescription: {
		fontSize: 16,
		fontFamily: "SF-Pro",
		color: theme.colors.secondary,
	},
	squadCaptain: {
		fontSize: 16,
		color: theme.colors.text,
		marginBottom: 10,
	},
	squadMembers: {
		fontSize: 16,
		color: theme.colors.text,
	},
	loadingText: {
		fontSize: 18,
		color: theme.colors.text,
	},
	userContainer: {
		flexDirection: "row",
		padding: 10,
		alignItems: "center",
		backgroundColor: theme.colors.surface,
		borderBottomColor: theme.colors.secondaryBackground,
		borderBottomWidth: 1,
	},
	userImage: {
		width: 50,
		height: 50,
		borderRadius: 25, // Hace la imagen circular
		borderWidth: 2, // Tamaño del borde
		borderColor: theme.colors.primary, // Color del borde
		marginRight: 10, // Espacio a la derecha de la imagen
	},
	userSubContainer: {
		flexDirection: "column",
	},
	usernameContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	usernameText: {
		color: theme.colors.text,
		fontSize: 16,
		fontWeight: "bold",
	},
	verifiedIcon: {
		fontSize: 16,
		color: "#42caff",
		marginLeft: 5,
	},
	nameContainer: {
		flexDirection: "row",
	},
	nameText: {
		color: theme.colors.secondary,
		fontSize: 14,
	},
	lastnameText: {
		color: theme.colors.secondary,
		marginLeft: 4,
		fontSize: 14,
	},
});
