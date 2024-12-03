import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase'; 

function ModifScreen() {
  const [mascotas, setMascotas] = useState([]); 
  const [selectedMascota, setSelectedMascota] = useState(null); 
  const [formData, setFormData] = useState({ nombre: '', especie: '', raza: '', edad: '', peso: '' }); 
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
        console.error('Error al escuchar los cambios en tiempo real:', error);
        setLoading(false);
      }
    );

    // Limpiar el componente
    return () => unsubscribe();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  
  const handleSave = async () => {
    if (!formData.nombre || !formData.especie || !formData.raza || !formData.edad || !formData.peso) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      const mascotaRef = doc(db, 'mascotas', selectedMascota.id); // Referencia de la colección
      await updateDoc(mascotaRef, {
        nombre: formData.nombre,
        especie: formData.especie,
        raza: formData.raza,
        edad: parseInt(formData.edad),
        peso: parseFloat(formData.peso),
      });
      Alert.alert('Éxito', 'Datos de la mascota actualizados correctamente.');
      setSelectedMascota(null); // Limpiar selección
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      Alert.alert('Error', 'No se pudo actualizar la mascota.');
    }
  };

  // Eliminar una mascota
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'mascotas', id)); // Eliminar documento en Firebase
      Alert.alert('Éxito', 'La mascota ha sido eliminada.');
    } catch (error) {
      console.error('Error al eliminar la mascota:', error);
      Alert.alert('Error', 'No se pudo eliminar la mascota.');
    }
  };

  // Renderizar cada elemento en la lista
  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>{item.nombre}</Text>

      //modifciar 
      <TouchableOpacity
        style={[styles.button, styles.modifyButton]}
        onPress={() => {
          setSelectedMascota(item); 
          setFormData(item); 
        }}
      >
        <Text style={styles.buttonText}>Modificar</Text>
      </TouchableOpacity>

      //Eliminar 
      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.buttonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modificar Datos de Mascotas</Text>

      
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

      
      {selectedMascota && (
        <View style={styles.form}>
          <Text style={styles.subtitle}>Editar Datos</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={formData.nombre}
            onChangeText={(text) => handleChange('nombre', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Especie"
            value={formData.especie}
            onChangeText={(text) => handleChange('especie', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Raza"
            value={formData.raza}
            onChangeText={(text) => handleChange('raza', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Edad"
            keyboardType="numeric"
            value={formData.edad.toString()}
            onChangeText={(text) => handleChange('edad', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Peso (kg)"
            keyboardType="numeric"
            value={formData.peso.toString()}
            onChangeText={(text) => handleChange('peso', text)}
          />
          <Button title="Guardar Cambios" onPress={handleSave} />
        </View>
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
    loadingText: {
      textAlign: 'center',
      color: '#666',
      marginBottom: 20,
    },
    emptyText: {
      textAlign: 'center',
      color: '#666',
      fontSize: 16,
      marginTop: 20,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      marginBottom: 10,
      borderRadius: 10,
      borderColor: '#ddd',
      borderWidth: 1,
      padding: 10,
      elevation: 2,
    },
    itemText: {
      flex: 1,
      fontSize: 16,
      color: '#333',
    },
    button: {
      padding: 10,
      borderRadius: 5,
      marginLeft: 5,
    },
    modifyButton: {
      backgroundColor: '#1F91DC',
    },
    deleteButton: {
      backgroundColor: '#E53935',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    form: {
      marginTop: 20,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#4caf50',
      marginBottom: 10,
      textAlign: 'center',
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
    },
  });

export default ModifScreen;
