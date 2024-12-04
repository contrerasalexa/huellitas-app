import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../utils/firebase'; 

export default function Historial() {
  const [citas, setCitas] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const auth = getAuth();
  const currentUser = auth.currentUser;
  useEffect(() => {
    if (!currentUser) {
      Alert.alert('Error', 'No se pudo identificar al usuario en sesión.');
      setLoading(false);
      return;
    }
    const citasQuery = query(
      collection(db, 'cuidados'),
      where('estado', '==', 'Finalizado'), 
      where('usuarioId', '==', currentUser.uid) 
    );

    const unsubscribe = onSnapshot(
      citasQuery,
      (snapshot) => {
        const citasFinalizadas = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCitas(citasFinalizadas); 
        setLoading(false);
      },
      (error) => {
        console.error('Error al escuchar los cambios en tiempo real:', error);
        Alert.alert('Error', 'No se pudieron cargar las citas finalizadas.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const renderCita = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Mascota: {item.mascotaNombre}</Text>
      <Text style={styles.text}>Especie: {item.especie}</Text>
      <Text style={styles.text}>Raza: {item.raza}</Text>
      <Text style={styles.text}>Fecha: {item.fecha}</Text>
      <Text style={styles.text}>Hora: {item.hora}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Citas</Text>

      {loading ? (
        <Text style={styles.loading}>Cargando datos...</Text>
      ) : citas.length > 0 ? (
        <FlatList
          data={citas}
          renderItem={renderCita}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noCitas}>No hay citas finalizadas.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0056D2',
    textAlign: 'center',
    marginBottom: 20,
  },
  loading: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#D4EDDA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '90%',
    alignSelf: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  text: {
    fontSize: 18,
    color: '#555',
    marginBottom: 3,
  },
  noCitas: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
});