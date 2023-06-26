import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	Image,
} from "react-native";
import React, { useState } from "react";
import Ionic from "react-native-vector-icons/Ionicons";
import BackgroundNoScroll from "../components/BackgroundNoScroll";
import { theme } from "../core/theme";
import { Searchbar } from "react-native-paper";

import { searchUsers } from "../components/ApiService";

const SearchScreen = ({ navigation }) => {
	const [searchText, setSearchText] = useState("");
	const [userData, setUserData] = useState(null);

	const onSearch = async () => {
		const data = await searchUsers(searchText);
		setUserData(data);
	};

	const filterButton = () => {
		// Tu lógica para el botón de filtro
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
			<View style={{ backgroundColor: theme.colors.surface, height: "100%" }}>
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
				{/* Muestra los datos del usuario si están disponibles */}
				{userData && (
					<FlatList
						keyboardDismissMode="on-drag"
						overScrollMode="never"
						bounces="false"
						data={userData}
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
	},
	clearButton: {
		alignItems: "center",
		marginTop: 10,
		marginBottom: 25,
		backgroundColor: theme.colors.surface,
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
