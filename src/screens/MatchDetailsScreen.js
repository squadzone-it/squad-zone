import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MatchDetailsScreen = ({ route }) => {
    // Extraer el objeto 'match' de los parámetros de la ruta
    const { match } = route.params;
  
    // Generar un array de componentes Text para cada propiedad de match
    const matchDetails = Object.keys(match).map((key) => {
      let value = match[key];
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      }
      return <Text key={key} style={styles.detail}>{`${key}: ${value}`}</Text>;
    });
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Detalles del partido</Text>
        {matchDetails}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#000', // Background color del contenedor es negro
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff', // Color del título es blanco
    },
    detail: {
      fontSize: 16,
      color: '#fff', // Color de los detalles es blanco
      marginVertical: 4, // Agrega un margen vertical para separar los elementos de texto
    },
  });
  

export default MatchDetailsScreen;
