import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase'; 

export default function Agenda() {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true); 

  const fetchCitasConMascotas = async () => {
    try {
      // obtener todas las citas
      const citasSnapshot = await getDocs(collection(db, 'citas'));
      const citas = citasSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() })) 
        .filter((cita) => cita.estado === 'Pendiente'); 
        
      const dataCombinada = await Promise.all(
        citas.map(async (cita) => {
          const mascotaRef = doc(db, 'mascotas', cita.mascotaId); 
          const mascotaSnapshot = await getDoc(mascotaRef);

          if (mascotaSnapshot.exists()) {
            const mascotaData = mascotaSnapshot.data();
            return {
              ...cita,
              ...mascotaData,
            };
          }
          return cita; 
        })
      );

      setData(dataCombinada); 
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      Alert.alert('Error', 'No se pudieron cargar las citas.');
    }
  };


  useEffect(() => {
    fetchCitasConMascotas();
  }, []);

  const handleSolicitud = async (item) => {
    try {
      // actualizar el estado en base
      const citaRef = doc(db, 'citas', item.id);
      await updateDoc(citaRef, { estado: 'Iniciar' });

      //Coleccion de cidados 
      const cuidado = {
        mascotaId: item.mascotaId, 
        mascotaNombre: item.nombre, 
        fecha: item.fecha, 
        hora: item.hora, 
        estado: 'Pendiente',
        horaInicio: '', 
        horaFin: '', 
      };

      await addDoc(collection(db, 'cuidados'), cuidado); 
      Alert.alert('Solicitud Registrada', `El cuidado de ${item.nombre} ha sido registrado.`);

      fetchCitasConMascotas();
    } catch (error) {
      console.error('Error al registrar el cuidado:', error);
      Alert.alert('Error', 'No se pudo registrar el cuidado.');
    }
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={require('../assets/mascotas1.png')} 
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>Nombre: {item.nombre}</Text>
        <Text style={styles.text}>Especie: {item.especie}</Text>
        <Text style={styles.text}>Raza: {item.raza}</Text>
        <Text style={styles.text}>Edad: {item.edad}</Text>
        <Text style={styles.text}>Peso: {item.peso} kg</Text>
        <Text style={styles.text}>Fecha: {item.fecha}</Text>
        <Text style={styles.text}>Hora: {item.hora}</Text>
      </View>
      <TouchableOpacity
        style={styles.cardButton}
        onPress={() => handleSolicitud(item)}
      >
        <Text style={styles.cardButtonText}>Solicitar Cuidado</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda de Mascotas</Text>
      {loading ? (
        <Text style={styles.loading}>Cargando datos...</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
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
  },
  title: {
    fontSize: 40,
    color: 'blue',
    textAlign: 'center',
    marginTop:30,
    marginBottom: 20,
  },
  loading: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  card: {
    width: 250,
    height: '70%',
    backgroundColor: '#fff',
    marginTop:30,
    borderRadius: 10,
    marginRight: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 10,
  },
  info: {
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 3,
  },
  cardButton: {
    backgroundColor: '#0056D2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  cardButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
