import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	FlatList,
	Image
} from "react-native";
import React, { useState } from "react";
import Ionic from "react-native-vector-icons/Ionicons";
import BackgroundTabs from "../components/BackgroundTabs";
import { theme } from "../core/theme";

const Header = ({ filterButton }) => (
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

const SearchBar = ({ searchText, setSearchText, searchButton }) => (
	<View style={styles.searchBar}>
		<TextInput
			placeholder="Buscar..."
			placeholderTextColor={theme.colors.secondary}
			style={styles.searchInput}
			underlineColorAndroid="transparent"
			value={searchText}
			onChangeText={setSearchText}
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

const Body = ({ searchText, setSearchText, searchButton, userData }) => (
	<View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
	  <SearchBar searchText={searchText} setSearchText={setSearchText} searchButton={searchButton} />
	  {/* Muestra los datos del usuario si están disponibles */}
	  {
		userData && 
		<FlatList
		  data={userData}
		  keyExtractor={item => item.username}
		  renderItem={({ item }) => 
			<View style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
			  {item.photoUrl && 
				<Image 
				  source={{uri: item.photoUrl}} 
				  style={{
					width: 50, 
					height: 50, 
					borderRadius: 25, // Hace la imagen circular
					borderWidth: 2,  // Tamaño del borde
					borderColor: 'white',  // Color del borde
					marginRight: 10, // Espacio a la derecha de la imagen
				  }} 
				/>
			  }
				<View style={{flexDirection: 'column'}}>
					<Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>{item.username}</Text>
					<View style={{flexDirection: 'row'}}>
					<Text style={{color: 'white'}}>{item.name}</Text>
					<Text style={{color: 'white', marginLeft: 5}}>{item.lastName}</Text>
					</View>
			  </View>
			</View>
		  }
		/>
	  }
	</View>
  );
  




const SearchScreen = () => {
	const [searchText, setSearchText] = useState("");
	const [userData, setUserData] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);

const searchButton = async () => {
	try {
		const response = await fetch('https://europe-west2-squadzoneapp.cloudfunctions.net/searchUsers', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: searchText.toLowerCase() }),
		});
		const json = await response.json();
		if (json.result === "success" && Array.isArray(json.data)) {
			setUserData(json.data);
			console.log(json.data)
		} else {
			console.error('Error: data is not an array');
		}
	} catch (error) {
		console.error('Error:', error);
	}
};

	

	const filterButton = () => {
		// Tu lógica para el botón de filtro
	};

	return (
		<BackgroundTabs style={{ flex: 1 }}>
			<Header filterButton={filterButton} />
			<Body searchText={searchText} setSearchText={setSearchText} searchButton={searchButton} userData={userData} />
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
