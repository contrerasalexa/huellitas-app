import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';

const MisMascotasScreen = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth.currentUser?.uid; 
    if (!userId) {
      console.error('Usuario no autenticado.');
      setLoading(false);
      return;
    }

    const mascotasQuery = query(
      collection(db, 'mascotas'),
      where('id_dueño', '==', `/users/${userId}`)
    );

    const unsubscribe = onSnapshot(
      mascotasQuery,
      (snapshot) => {
        const mascotasData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMascotas(mascotasData);
        setLoading(false);
      },
      (error) => {
        console.error('Error al cargar las mascotas en tiempo real:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando mascotas...</Text>
      </View>
    );
  }

  if (mascotas.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No tienes mascotas registradas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={mascotas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>Nombre: {item.nombre}</Text>
            <Text style={styles.text}>Especie: {item.especie}</Text>
            <Text style={styles.text}>Raza: {item.raza}</Text>
            <Text style={styles.text}>Edad: {item.edad}</Text>
            <Text style={styles.text}>Peso: {item.peso} kg</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  text: {
    fontSize: 16,
  },
});

export default MisMascotasScreen;
