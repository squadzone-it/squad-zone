import {
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	Modal,
} from "react-native";
import React, { useState } from "react";
import Ionic from "react-native-vector-icons/Ionicons";
import BackgroundTabs from "../components/BackgroundTabs";
import { theme } from "../core/theme";

const searchButton = () => {};
const filterButton = () => {};

const Header = () => {
	return (
		<View style={styles.header}>
			<TouchableOpacity style={styles.headerButtonLeft}>
				<Ionic name="add" style={{ fontSize: 32, color: theme.colors.text }} />
			</TouchableOpacity>
			<Text style={styles.headerText}>
				SQUAD Z<Ionic name="football-outline" style={{ fontSize: 23 }} />
				NE
			</Text>
			<TouchableOpacity onPress={filterButton} style={styles.headerButtonRight}>
				<Ionic
					name="filter"
					style={{ fontSize: 25, color: theme.colors.text }}
				/>
			</TouchableOpacity>
		</View>
	);
};

const searchBar = () => {
	return (
		<View style={styles.searchBar}>
			<TextInput
				placeholder="Buscar..."
				placeholderTextColor={theme.colors.secondary}
				style={styles.searchInput}
				underlineColorAndroid="transparent"
			/>
			<TouchableOpacity onPress={searchButton}>
				<Ionic
					name="search-outline"
					size={20}
					color={theme.colors.text}
					style={styles.searchIcon}
				/>
			</TouchableOpacity>
		</View>
	);
};

const Body = () => {
	return (
		<View style={{ backgroundColor: theme.colors.surface, height: "100%" }}>
			{searchBar()}
		</View>
	);
};

const SearchScreen = () => {
	const [modalVisible, setModalVisible] = useState(false);

	return (
		<BackgroundTabs>
			<Header />
			<Body />
		</BackgroundTabs>
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
		borderRadius: 1,
		padding: 10,
		alignItems: "center",
		width: "100%",
	},
	searchIcon: {
		marginRight: 10,
	},
	searchInput: {
		flex: 1,
		color: theme.colors.text,
	},
});
