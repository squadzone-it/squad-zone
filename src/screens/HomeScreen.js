import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Modal, FlatList } from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import BackgroundNoScroll from '../components/BackgroundNoScroll';
import { theme } from '../core/theme';
import { useNavigation } from "@react-navigation/native";
import { getAllMatches } from "../components/ApiService"; // Importamos la función getAllMatches


const HomeScreen = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [matches, setMatches] = useState([]); // Almacenamos los partidos aquí

  /* // Esta es la funcion real, la otra es solo para ver como queda
  useEffect(() => {
    const fetchMatches = async () => {
      const matchesData = await getAllMatches();
      setMatches(matchesData);
    };

    fetchMatches();

    
  }, []);

  */
  //hay q eliminar esta funcion y dejar la primera
  useEffect(() => {
    const fetchMatches = async () => {
      const matchesData = await getAllMatches();
  
      // Añadimos la ubicación a cada partido
      const updatedMatches = matchesData.map((match, index) => {
        switch (index % 3) {
          case 0:
            return { ...match, location: 'Mortera' };
          case 1:
            return { ...match, location: 'Santander' };
          case 2:
            return { ...match, location: 'Torrelavega' };
          default:
            return match;
        }
      });
  
      setMatches(updatedMatches);
    };
  
    fetchMatches();
  }, []);

  // Ir a la pantalla de detalles del partido
  const goToMatchDetails = (match) => {
    navigation.navigate("MatchDetailsScreen", { match });
  };
  

  // Aquí está la suposición de que tienes userUid definido
  //const userUid = "Tu valor real de userUid aquí"; 

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

  function formatDate(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return dateTime.toLocaleDateString(undefined, options);
  }

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
      <View style={styles.container}>
        <FlatList
          data={matches}
          keyExtractor={(item) => item.matchId}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => goToMatchDetails(item)}
              style={styles.itemContainer}
            >
              <Text style={styles.location}>{` ${item.location}                                                 `}</Text>
              <Text style={styles.mode}>{`Modo: ${item.mode}`}</Text>
              <Text style={styles.startTime}>{`Empieza el ${formatDate(item.startTime)}`}</Text>
              <Text style={styles.rules}>{`Reglas: ${item.gameData.rules}`}</Text>
              {Array.isArray(item.players) && (
                <Text style={styles.players}>{`Jugadores: ${item.players.length}`}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };


  return (
    <BackgroundNoScroll>
      <Header />
      <Body />
    </BackgroundNoScroll>
  );
};

export default HomeScreen;



const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    height: '100%',
  },
  itemContainer: {
    backgroundColor: 'white',
    margin: 10,
    padding: 10,
  },
  location: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mode: {
    fontSize: 14,
    color: 'gray',
  },
  startTime: {
    fontSize: 14,
    color: 'gray',
  },
  rules: {
    fontSize: 14,
  },
  players: {
    fontSize: 14,
    color: 'gray',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    backgroundColor: theme.colors.surface,
    width: '100%',
    position: 'relative',
    top: 0,
  },
  headerText: {
    fontFamily: 'CODE-Bold',
    fontSize: 24,
    fontWeight: '500',
    color: theme.colors.text,
  },
  headerButtonRight: {
    padding: 10,
    marginLeft: 'auto',
  },
  headerButtonLeft: {
    padding: 10,
    marginRight: 'auto',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalOption: {
    fontSize: 18,
    paddingVertical: 10,
  },
  closeModalButton: {
    marginTop: 10,
  },
  closeModalText: {
    fontSize: 18,
    color: 'blue',
  },
});

