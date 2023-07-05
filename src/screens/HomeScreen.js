import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Modal } from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import BackgroundTabs from '../components/BackgroundTabs';
import { theme } from '../core/theme';
import { useNavigation } from "@react-navigation/native";


const HomeScreen = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  // Aquí está la suposición de que tienes userUid definido
  const userUid = "Tu valor real de userUid aquí"; 

  const mapButton = () => {
    const latitude = 43.44461979827975;
    const longitude = -3.9325432027336413;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  const mas = () => setShowModal(true);

  const onCreateMatchPressed = () => {
    setShowModal(false);
    navigation.navigate("CreateMatchScreen");
  };

  const onCreateTeamMatchPressed = () => {
    setShowModal(false);
    console.log('Crear partido con tu equipo');
  };

  const Header = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButtonLeft} onPress={mas}>
          <Ionic
            name="add"
            style={{ fontSize: 32, color: theme.colors.text }}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          SQUAD Z<Ionic name="football-outline" style={{ fontSize: 23 }} />
          NE
        </Text>
        <TouchableOpacity onPress={mapButton} style={styles.headerButtonRight}>
          <Ionic
            name="map-sharp"
            style={{ fontSize: 25, color: theme.colors.text }}
          />
        </TouchableOpacity>

        <Modal visible={showModal} animationType="slide" transparent={true}>
          <TouchableOpacity style={styles.modalBackground} onPress={() => setShowModal(false)}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={onCreateMatchPressed}>
                <Text style={styles.modalOption}>Crear partido</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onCreateTeamMatchPressed}>
                <Text style={styles.modalOption}>Crear partido con tu equipo</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  const Body = () => {
    return (
      <View
        style={{ backgroundColor: theme.colors.surface, height: "100%" }}
      ></View>
    );
  };

  return (
    <BackgroundTabs>
      <Header />
      <Body />
    </BackgroundTabs>
  );
};

export default HomeScreen;



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
		backgroundColor: 'rgba(0,0,0,0.5)', // Un fondo semi-transparente
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: 'white', // El fondo del contenido del modal
		padding: 20, 
		borderRadius: 10, // Hace que las esquinas sean redondeadas
		width: '80%' // Ajusta el ancho del contenido del modal
	},
	modalOption: {
		fontSize: 18, // Tamaño de texto de las opciones
		paddingVertical: 10, // Ajusta el espaciado vertical entre las opciones
	},
	closeModalButton: {
		marginTop: 10, // Añade un pequeño espacio entre el botón de cerrar y el contenido del modal
	},
	closeModalText: {
		fontSize: 18, // Tamaño de texto para "Cerrar"
		color: 'blue', // Cambia el color de "Cerrar" a azul
	}
});
