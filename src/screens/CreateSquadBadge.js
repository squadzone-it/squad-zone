import React, { useState, useRef } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Button,
	Image,
	TouchableOpacity,
	Modal,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import { ColorPicker } from "react-native-color-picker";

import BackgroundNoScroll from "../components/BackgroundNoScroll";
import { shieldShapes } from "../assets/badges/shieldShapes";
import { backgroundDesigns } from "../assets/badges/backgroundDesigns";
import { overlayDesigns } from "../assets/badges/overlayDesigns";
import { theme } from "../core/theme";

const CreateSquadBadge = () => {
	const [shieldShape, setShieldShape] = useState(null);
	const [backgroundDesign, setBackgroundDesign] = useState(null);
	const [overlayDesign, setOverlayDesign] = useState(null);
	const [fill1, setFill1] = useState("#ff0000");
	const [fill2, setFill2] = useState("#00ffff");
	const [colorPickerModalVisible, setColorPickerModalVisible] = useState(false);
	const [activeColorPicker, setActiveColorPicker] = useState(null);

	const viewRef = useRef();

	const renderImageItem = (Item, index, setItem) => (
		<TouchableOpacity key={index} onPress={() => setItem(() => Item)}>
			{typeof Item === "function" ? (
				<Item
					width={50}
					height={50}
					fill1={fill1}
					fill2={fill2}
					style={styles.customImage}
				/>
			) : (
				<Image source={Item} style={[styles.image, styles.customImage]} />
			)}
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

	const COLORS_ARRAY = [
		"#FFFFFF",
		"#C0C0C0",
		"#808080",
		"#000000",
		"#FF0000",
		"#800000",
		"#FFFF00",
		"#808000",
		"#00FF00",
		"#008000",
		"#00FFFF",
		"#008080",
		"#0000FF",
		"#000080",
		"#FF00FF",
		"#800080",
	];

	return (
		<BackgroundNoScroll>
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

				<View ref={viewRef} style={styles.previewContainer}>
					<View style={styles.finalShield}>
						{backgroundDesign &&
							React.createElement(backgroundDesign, {
								style: styles.layer,
								fill1: fill1,
								fill2: fill2,
							})}

						{shieldShape && <Image source={shieldShape} style={styles.layer} />}
						{overlayDesign && (
							<Image source={overlayDesign} style={styles.layer} />
						)}
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
				<View>
					<Button title="Aceptar" onPress={handleCapture} />
				</View>
			</View>
		</BackgroundNoScroll>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	section: {
		marginBottom: 20,
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
		marginBottom: 20,
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
	customImage: {
		borderRadius: 10, // por ejemplo, para bordes redondeados
		marginHorizontal: 5, // por ejemplo, para agregar un margen alrededor de la imagen
		backgroundColor: "white",
	},
});

export default CreateSquadBadge;
