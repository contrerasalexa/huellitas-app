import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase'; 
import Icon from 'react-native-vector-icons/FontAwesome'; 

function RegisScreen() {
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    peso: '',
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const { nombre, especie, raza, edad, peso } = formData;

    if (!nombre || !especie || !raza || !edad || !peso) {
      Alert.alert('Error', 'Por favor, llena todos los campos.');
      return;
    }

    try {
      await addDoc(collection(db, 'mascotas'), {
        nombre,
        especie,
        raza,
        edad: parseInt(edad),
        peso: parseFloat(peso),
        fechaRegistro: new Date(),
      });

      Alert.alert('Registro Exitoso', `Mascota ${nombre} registrada correctamente.`);
      setFormData({
        nombre: '',
        especie: '',
        raza: '',
        edad: '',
        peso: '',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la mascota en Firebase.');
      console.error('Error al guardar en Firebase:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Registrar Mascota</Text>
  
      
      <View style={styles.iconContainer}>
        <Icon name="paw" size={90} color="#4ee9e7" />
      </View>
  
      //llenar formulario 
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#666"
        value={formData.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Especie"
        placeholderTextColor="#666"
        value={formData.especie}
        onChangeText={(text) => handleChange('especie', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Raza"
        placeholderTextColor="#666"
        value={formData.raza}
        onChangeText={(text) => handleChange('raza', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        keyboardType="numeric"
        placeholderTextColor="#666"
        value={formData.edad}
        onChangeText={(text) => handleChange('edad', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        keyboardType="numeric"
        placeholderTextColor="#666"
        value={formData.peso}
        onChangeText={(text) => handleChange('peso', text)}
      />
  
     
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Registrar Mascota</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#201b6f',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, 
  },
  buttonContainer: {
    alignItems: 'center', 
    marginTop: 20, 
  },
  button: {
    backgroundColor: '#1F91DC',
    paddingVertical: 15,
    paddingHorizontal: 50, 
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center', 
    marginBottom: 20, 
  },
});

export default RegisScreen;
