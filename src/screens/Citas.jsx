import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { collection, doc, updateDoc, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../utils/firebase'; 

export default function Citas() {
  const [cuidados, setCuidados] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const auth = getAuth(); 
  const currentUser = auth.currentUser; 

  const listenToCuidados = () => {
    if (!currentUser) {
      Alert.alert('Error', 'No se pudo identificar al usuario en sesión.');
      return;
    }

    try {
      const cuidadosQuery = query(
        collection(db, 'cuidados'),
        where('usuarioId', '==', currentUser.uid) 
      );

      
      const unsubscribe = onSnapshot(cuidadosQuery, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCuidados(data);
        setLoading(false);
      });

      return unsubscribe; 
    } catch (error) {
      console.error('Error al configurar el listener:', error);
      Alert.alert('Error', 'No se pudo configurar la actualización en tiempo real.');
    }
  };

  
  useEffect(() => {
    const unsubscribe = listenToCuidados(); 
    return () => {
      if (unsubscribe) {
        unsubscribe(); 
      }
    };
  }, []);

  const actualizarCuidado = async (id, cambios, mensaje) => {
    try {
      const cuidadoRef = doc(db, 'cuidados', id); 
      await updateDoc(cuidadoRef, cambios); 
      Alert.alert('Actualización Exitosa', mensaje);
    } catch (error) {
      console.error('Error al actualizar el cuidado:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del cuidado.');
    }
  };

  const renderCuidado = ({ item }) => {
    const backgroundColor =
      item.estado === 'Cancelado'
        ? '#F8D7DA' 
        : item.estado === 'Finalizado'
        ? '#D4EDDA' 
        : item.estado === 'Iniciado'
        ? '#FFF3CD' 
        : '#FFFFFF';

    return (
      <View style={[styles.card, { backgroundColor }]}>
        <View style={styles.info}>
          <Text style={styles.name}>Mascota: {item.mascotaNombre}</Text>
          <Text style={styles.text}>Especie: {item.especie}</Text>
          <Text style={styles.text}>Raza: {item.raza}</Text>
          <Text style={styles.text}>Fecha: {item.fecha}</Text>
          <Text style={styles.text}>Hora: {item.hora}</Text>
          <Text style={styles.text}>Estado: {item.estado}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() =>
              actualizarCuidado(item.id, { estado: 'Cancelado' }, 'El cuidado ha sido cancelado.')
            }
            disabled={item.estado !== 'Pendiente'}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={() =>
              actualizarCuidado(
                item.id,
                { estado: 'Iniciado', horaInicio: new Date().toLocaleTimeString() },
                'El cuidado ha sido iniciado.'
              )
            }
            disabled={item.estado !== 'Pendiente'}
          >
            <Text style={styles.buttonText}>Iniciar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.finishButton]}
            onPress={() =>
              actualizarCuidado(
                item.id,
                { estado: 'Finalizado', horaFin: new Date().toLocaleTimeString() },
                'El cuidado ha sido finalizado.'
              )
            }
            disabled={item.estado !== 'Iniciado'}
          >
            <Text style={styles.buttonText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Citas Actuales</Text>
      {loading ? (
        <Text style={styles.loading}>Cargando datos...</Text>
      ) : (
        <FlatList
          data={cuidados}
          renderItem={renderCuidado}
          keyExtractor={(item) => item.id}
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '90%',
    alignSelf: 'center',
  },
  info: {
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 18,
    color: '#555',
    marginBottom: 3,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF5C5C',
  },
  startButton: {
    backgroundColor: '#FFC107',
  },
  finishButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});