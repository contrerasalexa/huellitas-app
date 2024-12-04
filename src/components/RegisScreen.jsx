import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { auth, db } from '../utils/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function RegisScreen() {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');

  const handleRegistrarMascota = async () => {
    const userId = auth.currentUser.uid;

    if (!nombre || !especie || !raza || !edad || !peso) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      await addDoc(collection(db, 'mascotas'), {
        nombre,
        especie,
        raza,
        edad: parseInt(edad),
        peso: parseFloat(peso),
        id_dueño: `/users/${userId}`,
        fechaRegistro: new Date().toISOString(),
      });
      alert('Mascota registrada exitosamente');
      setNombre('');
      setEspecie('');
      setRaza('');
      setEdad('');
      setPeso('');
    } catch (error) {
      console.error('Error al registrar la mascota:', error);
      alert('Error al registrar la mascota');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Mascota</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Especie"
        value={especie}
        onChangeText={setEspecie}
      />
      <TextInput
        style={styles.input}
        placeholder="Raza"
        value={raza}
        onChangeText={setRaza}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        keyboardType="numeric"
        onChangeText={setEdad}
      />
      <TextInput
        style={styles.input}
        placeholder="Peso"
        value={peso}
        keyboardType="numeric"
        onChangeText={setPeso}
      />
      <Button title="Registrar" onPress={handleRegistrarMascota} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
  