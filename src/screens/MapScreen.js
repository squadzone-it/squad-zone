import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import MapView, { Marker, PROVIDER_OPENSTREETMAP } from "react-native-maps";
import Ionic from "react-native-vector-icons/Ionicons";
import { theme } from "../core/theme";
import marker1 from "../assets/marker1.png";
import pistasData from "../assets/pistas.json";

const MapScreen = ({ navigation }) => {
	const [region, setRegion] = useState({
		latitude: 43.44440871616114,
		longitude: -3.9272193385454273,
		latitudeDelta: 0.1,
		longitudeDelta: 0.05,
	});

	// Define un umbral de zoom después del cual los marcadores dejarán de renderizarse
	const zoomThreshold = 0.1;

	// Esta es la nueva función que se ejecutará cuando presiones el callout
	const handleCalloutPress = (latitude, longitude) => {
		console.log(`Latitud: ${latitude}, Longitud: ${longitude}`);
	};

	// Esta función filtra los marcadores que están dentro de la región actual del mapa
	const markers =
		region.latitudeDelta < zoomThreshold
			? pistasData.features.filter(
					(field) =>
						field.geometry.coordinates[1] >=
							region.latitude - region.latitudeDelta / 2 &&
						field.geometry.coordinates[1] <=
							region.latitude + region.latitudeDelta / 2 &&
						field.geometry.coordinates[0] >=
							region.longitude - region.longitudeDelta / 2 &&
						field.geometry.coordinates[0] <=
							region.longitude + region.longitudeDelta / 2
			  )
			: [];

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.headerButtonLeft}
					onPress={() => navigation.goBack()}
				>
					<Ionic
						name="arrow-back"
						style={{ fontSize: 32, color: theme.colors.text }}
					/>
				</TouchableOpacity>
				<Text style={styles.headerText}>
					SQUAD Z
					<Ionic name="football-outline" style={{ fontSize: 23 }} />
					NE
				</Text>
				<TouchableOpacity style={styles.headerButtonRight}>
					<Ionic
						name="menu-sharp"
						style={{ fontSize: 25, color: "transparent" }}
					/>
				</TouchableOpacity>
			</View>

			{/* Mapa */}
			<MapView
				provider={PROVIDER_OPENSTREETMAP}
				mapType="satellite"
				style={{ flex: 1 }}
				initialRegion={region}
				onRegionChangeComplete={setRegion}
			>
				{markers.map((field, index) => (
					<Marker
						key={index}
						coordinate={{
							latitude: field.geometry.coordinates[1],
							longitude: field.geometry.coordinates[0],
						}}
						title={`Campo de fútbol ${index + 1}`}
						description={`ID: ${field.properties["@id"]}`}
						onCalloutPress={() =>
							handleCalloutPress(
								field.geometry.coordinates[1],
								field.geometry.coordinates[0]
							)
						}
					>
						<Image
							source={marker1}
							style={{ width: 30, height: 40, resizeMode: "contain" }}
						/>
					</Marker>
				))}
			</MapView>
		</View>
	);
};

export default MapScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 0,
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
});
