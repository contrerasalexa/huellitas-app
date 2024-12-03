import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase'; 

function ReporScreen() {
  const [mascotas, setMascotas] = useState([]); 
  const [loading, setLoading] = useState(true); 

  
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'mascotas'),
      (snapshot) => {
        const mascotasData = snapshot.docs.map((doc) => ({
          id: doc.id, 
          ...doc.data(),
        }));
        setMascotas(mascotasData);
        setLoading(false);
      },
      (error) => {
        console.error('Error al escuchar cambios en tiempo real:', error);
        setLoading(false);
      }
    );

    
    return () => unsubscribe();
  }, []);

  //tabla
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.nombre}</Text>
      <Text style={styles.cell}>{item.especie}</Text>
      <Text style={styles.cell}>{item.raza}</Text>
      <Text style={styles.cell}>{item.edad} años</Text>
      <Text style={styles.cell}>{item.peso} kg</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reportes de Mascotas</Text>

      {/* Tabla de encabezados */}
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Nombre</Text>
        <Text style={styles.headerCell}>Especie</Text>
        <Text style={styles.headerCell}>Raza</Text>
        <Text style={styles.headerCell}>Edad</Text>
        <Text style={styles.headerCell}>Peso</Text>
      </View>

      {/* Lista de mascotas */}
      {loading ? (
        <Text style={styles.loadingText}>Cargando mascotas...</Text>
      ) : (
        <FlatList
          data={mascotas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay mascotas registradas.</Text>}
        />
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#1F91DC',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ReporScreen;
