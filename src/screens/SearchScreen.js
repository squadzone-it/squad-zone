import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	Image,
	RefreshControl,
} from "react-native";
import React, { useState } from "react";
import Ionic from "react-native-vector-icons/Ionicons";
import BackgroundNoScroll from "../components/BackgroundNoScroll";
import { theme } from "../core/theme";
import { Searchbar } from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import {
	searchUsers,
	searchSquads,
	getSquadData,
} from "../components/ApiService";

const Tab = createMaterialTopTabNavigator();

const SearchScreen = ({ navigation }) => {
	const [searchText, setSearchText] = useState("");
	const [userData, setUserData] = useState(null);
	const [squadsData, setSquadsData] = useState(null);
	const [refreshing, setRefreshing] = useState(false);

	const onSearch = async () => {
		let searchTextToUse = searchText !== "" ? searchText : " ";
		const data = await searchUsers(searchTextToUse);
		const squadsData = await searchSquads(searchTextToUse);
		setUserData(data);
		setSquadsData(squadsData);
	};

	const filterButton = () => {
		// Tu lógica para el botón de filtro
	};

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		// Aquí debes implementar la lógica de recarga
		setTimeout(() => setRefreshing(false), 2000); // esto es solo para simular la recarga
	}, []);

	const Usuarios = ({ userData, setUserData }) => {
		return (
			<View>
				{userData && (
					<FlatList
						keyboardDismissMode="on-drag"
						overScrollMode="never"
						bounces="false"
						data={userData}
						keyExtractor={(item) => item.username}
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
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
												<Image
													source={require("../assets/verified.png")}
													style={{
														width: 16,
														height: 16,
														marginLeft: 5,
													}}
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
				{userData && userData.length > 0 && (
					<TouchableOpacity
						style={styles.clearButton}
						onPress={() => setUserData(null)}
					>
						<Ionic
							name="close-circle"
							style={{ fontSize: 25, color: theme.colors.secondary }}
						/>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	const Equipos = ({ squadsData, setSquadsData }) => {
		return (
			<View>
				{squadsData && (
					<FlatList
						keyboardDismissMode="on-drag"
						overScrollMode="never"
						bounces="false"
						data={squadsData}
						keyExtractor={(item) => item.displayname}
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
						renderItem={({ item }) => (
							<TouchableOpacity
								onPress={() =>
									navigation.navigate("SquadProfileScreen", {
										squadId: item.squadId,
										squadData: item,
									})
								}
							>
								<View style={styles.userContainer}>
									{item.squadBadgeUrl && (
										<Image
											source={{ uri: item.squadBadgeUrl }}
											style={styles.userImage}
										/>
									)}
									<View style={styles.userSubContainer}>
										<View style={styles.usernameContainer}>
											<Text style={styles.usernameText}>
												{item.displayname}
											</Text>
										</View>
										<View style={styles.nameContainer}>
											<Text style={styles.nameText}>{item.description}</Text>
										</View>
									</View>
								</View>
							</TouchableOpacity>
						)}
					/>
				)}
				{squadsData && squadsData.length > 0 && (
					<TouchableOpacity
						style={styles.clearButton}
						onPress={() => setSquadsData(null)}
					>
						<Ionic
							name="close-circle"
							style={{ fontSize: 25, color: theme.colors.secondary }}
						/>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	return (
		<BackgroundNoScroll>
			{/*   Header   */}
			<View style={styles.header}>
				<TouchableOpacity style={styles.headerButtonLeft}>
					<Ionic
						name="add"
						style={{ fontSize: 32, color: theme.colors.text }}
					/>
				</TouchableOpacity>
				<Text style={styles.headerText}>
					SQUAD Z<Ionic name="football-outline" style={{ fontSize: 23 }} />
					NE
				</Text>
				<TouchableOpacity
					onPress={filterButton}
					style={styles.headerButtonRight}
				>
					<Ionic
						name="filter"
						style={{ fontSize: 25, color: theme.colors.text }}
					/>
				</TouchableOpacity>
			</View>

			{/*   Body   */}
			<View
				style={{
					backgroundColor: theme.colors.surface,
					height: "100%",
					width: "100%",
				}}
			>
				<Searchbar
					placeholder="Buscar..."
					onChangeText={setSearchText}
					value={searchText}
					style={styles.searchBar}
					onSubmitEditing={onSearch}
					placeholderTextColor={theme.colors.text}
					iconColor={theme.colors.secondary}
					inputStyle={{ color: theme.colors.text, fontFamily: "SF-Pro" }}
				/>
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
						name="Usuarios"
						options={{
							headerShown: false,
							tabBarIcon: ({ focused, color }) =>
								focused ? (
									<Ionic name="person" color={color} size={25} />
								) : (
									<Ionic name="person-outline" color={color} size={23} />
								),
						}}
					>
						{() => <Usuarios userData={userData} setUserData={setUserData} />}
					</Tab.Screen>
					<Tab.Screen
						name="Equipos"
						options={{
							headerShown: false,
							tabBarIcon: ({ focused, color }) =>
								focused ? (
									<Ionic name="shield" color={color} size={25} />
								) : (
									<Ionic name="ios-shield-outline" color={color} size={23} />
								),
						}}
					>
						{() => (
							<Equipos squadsData={squadsData} setSquadsData={setSquadsData} />
						)}
					</Tab.Screen>
				</Tab.Navigator>
			</View>
		</BackgroundNoScroll>
	);
};

export default SearchScreen;

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
	searchBar: {
		flexDirection: "row",
		marginTop: 5,
		backgroundColor: theme.colors.secondaryBackground,
		borderRadius: 0,
		alignItems: "center",
		width: "100%",
	},
	searchIcon: {
		marginRight: 10,
	},
	searchInput: {
		color: theme.colors.text,
		fontFamily: "SF-Pro",
	},
	clearButton: {
		alignItems: "center",
		marginTop: 20,
		marginBottom: 25,
		backgroundColor: "transparent",
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
		fontFamily: "SF-Pro-Semibold",
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
		fontFamily: "SF-Pro",
	},
	lastnameText: {
		color: theme.colors.secondary,
		marginLeft: 4,
		fontSize: 14,
		fontFamily: "SF-Pro",
	},
});
