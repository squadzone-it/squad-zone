import React, { useState, useRef } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Image,
	TouchableOpacity,
	Modal,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import { ColorPicker } from "react-native-color-picker";
import Ionic from "react-native-vector-icons/Ionicons";
import BackgroundNoScroll from "../components/BackgroundNoScroll";
import Button from "../components/Button";
import { shieldShapes } from "../assets/badges/shieldShapes";
import { backgroundDesigns } from "../assets/badges/backgroundDesigns";
import { overlayDesigns } from "../assets/badges/overlayDesigns";
import { theme } from "../core/theme";

const CreateSquadBadge = ({ navigation }) => {
	const [shieldShape, setShieldShape] = useState(
		Object.values(shieldShapes)[0]
	);
	const [backgroundDesign, setBackgroundDesign] = useState(null);
	const [overlayDesign, setOverlayDesign] = useState(null);
	const [fill1, setFill1] = useState("#70e9ff");
	const [fill2, setFill2] = useState("#ff5790");
	const [colorPickerModalVisible, setColorPickerModalVisible] = useState(false);
	const [activeColorPicker, setActiveColorPicker] = useState(null);

	const viewRef = useRef();
	const renderImageItem = (Item, index, setItem) => (
		<TouchableOpacity key={index} onPress={() => setItem(() => Item)}>
			<View style={styles.roundedSvgContainer}>
				{typeof Item === "function" ? (
					<Item width={50} height={50} fill1={fill1} fill2={fill2} />
				) : (
					<Image
						source={Item}
						style={[styles.image, { resizeMode: "cover" }]}
					/>
				)}
			</View>
		</TouchableOpacity>
	);

	const handleCapture = async () => {
		try {
			const uri = await captureRef(viewRef, {
				format: "png",
				quality: 0.8,
				result: "base64",
			});
			console.log("Captura realizada. URI:", uri);
		} catch (error) {
			console.error("Error al capturar vista:", error);
		}
	};

	const openColorPicker = (activeColor) => {
		setActiveColorPicker(activeColor);
		setColorPickerModalVisible(true);
	};

	return (
		<BackgroundNoScroll>
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
				<Text style={styles.headerText}>CREADOR DE ESCUDO</Text>

				<TouchableOpacity onPress={() => {}} style={styles.headerButtonRight}>
					<Ionic
						name="menu-sharp"
						style={{ fontSize: 25, color: "transparent" }}
					/>
				</TouchableOpacity>
			</View>
			<View style={styles.container}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={colorPickerModalVisible}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>
								{activeColorPicker === "fill1"
									? "Selecciona el color 1"
									: "Selecciona el color 2"}
							</Text>
							<ColorPicker
								defaultColor={activeColorPicker === "fill1" ? fill1 : fill2}
								onColorSelected={(color) => {
									if (activeColorPicker === "fill1") setFill1(color);
									else if (activeColorPicker === "fill2") setFill2(color);
									setColorPickerModalVisible(false);
								}}
								style={{ width: "90%", height: "70%" }}
							/>
							<TouchableOpacity
								style={styles.closeButton}
								onPress={() => setColorPickerModalVisible(false)}
							>
								<Text style={styles.textStyle}>Cerrar</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
				<View
					style={{
						borderWidth: 1,
						borderColor: theme.colors.secondary,
						marginHorizontal: 40,
						paddingVertical: 10,
						borderRadius: 10,
					}}
				>
					<View ref={viewRef} style={styles.previewContainer}>
						<View style={styles.finalShield}>
							<View style={styles.roundedSvgContainer2}>
								{backgroundDesign &&
									React.createElement(backgroundDesign, {
										style: styles.layer,
										fill1: fill1,
										fill2: fill2,
									})}
							</View>
							{shieldShape && (
								<Image source={shieldShape} style={styles.layer} />
							)}
							{overlayDesign && (
								<Image source={overlayDesign} style={styles.layer} />
							)}
						</View>
					</View>
				</View>
				<ScrollView style={styles.selectionsContainer}>
					<View style={styles.section}>
						<ScrollView horizontal>
							{Object.values(shieldShapes).map((img, index) =>
								renderImageItem(img, index, setShieldShape)
							)}
						</ScrollView>
					</View>

					<View style={styles.section}>
						<ScrollView horizontal>
							{Object.values(backgroundDesigns).map((Img, index) =>
								renderImageItem(Img, index, setBackgroundDesign)
							)}
						</ScrollView>
					</View>

					<View style={styles.section}>
						<ScrollView horizontal>
							{Object.values(overlayDesigns).map((img, index) =>
								renderImageItem(img, index, setOverlayDesign)
							)}
						</ScrollView>
					</View>

					<View style={styles.colorPickerContainer}>
						<TouchableOpacity
							onPress={() => openColorPicker("fill1")}
							style={{ backgroundColor: fill1, ...styles.colorSample }}
						/>
						<TouchableOpacity
							onPress={() => openColorPicker("fill2")}
							style={{ backgroundColor: fill2, ...styles.colorSample }}
						/>
					</View>
				</ScrollView>
				<View style={{ marginBottom: 20 }}>
					<Button
						mode="contained"
						onPress={handleCapture}
						style={{ marginTop: 10 }}
					>
						ACEPTAR
					</Button>
				</View>
			</View>
		</BackgroundNoScroll>
	);
};

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
	container: {
		padding: 20,
	},
	selectionsContainer: {
		marginVertical: 20,
	},
	section: {
		marginBottom: 30,
	},
	sectionTitle: {
		fontSize: 18,
		marginBottom: 10,
		fontFamily: "SF-Pro",
		color: theme.colors.text,
	},
	previewContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	preview: {
		width: 200,
		height: 200,
	},
	image: {
		width: 50,
		height: 50,
		marginRight: 10,
	},
	finalShield: {
		position: "relative",
		width: 200,
		height: 200,
	},
	layer: {
		position: "absolute",
		width: "100%",
		height: "100%",
	},
	colorSample: {
		width: 30,
		height: 30,
		borderRadius: 10,
	},
	colorPickerContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
	},
	colorPicker: {
		flex: 1,
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalView: {
		width: "80%",
		height: "50%",
		backgroundColor: theme.colors.secondaryBackground,
		borderRadius: 10,
		paddingTop: 30,
		alignItems: "center",
		justifyContent: "space-between",
	},

	modalText: {
		marginBottom: 20,
		textAlign: "center",
		fontWeight: "500",
		fontSize: 18,
		color: theme.colors.text,
		fontFamily: "SF-Pro-Bold",
	},
	colorPicker: {
		width: "70%",
		height: 300, // Tamaño adecuado para el color picker
		marginBottom: 20,
	},
	closeButton: {
		width: "100%", // Un botón más ancho
		borderRadius: 10,
		padding: 15,
		backgroundColor: theme.colors.secondaryBackground,
		justifyContent: "center",
		marginTop: 20,
		borderColor: theme.colors.primary,
		borderWidth: 2,
	},
	textStyle: {
		color: theme.colors.text,
		textAlign: "center",
		fontFamily: "SF-Pro-Semibold",
	},
	roundedSvgContainer: {
		borderRadius: 5, // Elige el valor de radio que prefieras
		overflow: "hidden",
		backgroundColor: theme.colors.text,
		marginHorizontal: 5,
		width: 50,
		height: 50,
	},
	roundedSvgContainer2: {
		borderRadius: 5, // Elige el valor de radio que prefieras
		overflow: "hidden",
	},
});

export default CreateSquadBadge;
