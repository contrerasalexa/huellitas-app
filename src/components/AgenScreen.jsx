import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Alert, Platform } from 'react-native';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';

function AgenScreen() {
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
  });
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [showTimePicker, setShowTimePicker] = useState(false); 

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
        console.error('Error al escuchar los cambios en tiempo real:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const { fecha, hora } = formData;

    if (!fecha || !hora) {
        Alert.alert('Error', 'Por favor, completa todos los campos.');
        return;
    }

    try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            Alert.alert('Error', 'Usuario no autenticado.');
            return;
        }

        await addDoc(collection(db, 'citas'), {
            mascotaId: selectedMascota.id,
            mascotaNombre: selectedMascota.nombre,
            fecha,
            hora,
            estado: 'Pendiente',
            fechaRegistro: new Date(),
            duenioId: userId,
        });

        Alert.alert('Éxito', `Cita agendada para ${selectedMascota.nombre}.`);
        setSelectedMascota(null);
        setFormData({ fecha: '', hora: '' });
    } catch (error) {
        console.error('Error al guardar la cita:', error);
        Alert.alert('Error', 'No se pudo guardar la cita.');
    }
};


  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString(); 
      handleChange('fecha', formattedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, 
      });
      handleChange('hora', formattedTime);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>{item.nombre}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setSelectedMascota(item)}
      >
        <Text style={styles.buttonText}>Agendar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar Citas</Text>

      { }
      {loading ? (
        <Text style={styles.loadingText}>Cargando mascotas...</Text>
      ) : (
        <FlatList
          data={mascotas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No tienes mascotas registradas.</Text>}
        />
      )}

      { }
      {selectedMascota && (
        <View style={styles.form}>
          <Text style={styles.subtitle}>Agendar para {selectedMascota.nombre}</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{formData.fecha || 'Seleccionar Fecha'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimePicker(true)}
          >
            <Text>{formData.hora || 'Seleccionar Hora'}</Text>
          </TouchableOpacity>
          <Button title="Guardar Cita" onPress={handleSave} />
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={false}
          onChange={handleTimeChange}
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
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  form: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default AgenScreen;
