import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); // Estado para mostrar u ocultar el DatePicker
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !role || !name || !lastName || !birthDate || !address || !phone) {
      alert("Por favor completa todos los campos.");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
  
      const userData = {
        email,
        role: role === 'DUENIO' ? 'PASEADOR' : 'PASEADOR', // Siempre se guarda como 'PASEADOR'
        name,
        lastName,
        birthDate: birthDate.toISOString().split('T')[0], // Formato de fecha: YYYY-MM-DD
        address,
        phone,
      };
  
      // Solo agregar "occupation" si el rol es "PASEADOR"
      if (role === 'PASEADOR') {
        userData.occupation = occupation;
      }
  
      await setDoc(doc(db, 'users', userId), userData);
      alert("Registro exitoso");
      navigation.navigate('Login');
    } catch (error) {
      alert("Error al registrarse: " + error.message);
    }
  };
  

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Oculta el DatePicker después de seleccionar
    if (selectedDate) {
      setBirthDate(selectedDate); // Actualiza la fecha seleccionada
    }
  };

  return (
    <View style={styles.container}>
      {!role ? (
        <>
          <Text style={styles.title}>Ingresa tu Correo y Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Text style={styles.title}>Selecciona tu Rol</Text>
          <View style={styles.rolesContainer}>
            <View style={styles.role}>
              <Image
                source={require('../../assets/paseador.png')}
                style={styles.image}
                onTouchEnd={() => setRole('PASEADOR')}
              />
              <Text style={styles.roleText}>Paseador</Text>
            </View>
            <View style={styles.role}>
              <Image
                source={require('../../assets/dueno.png')}
                style={styles.image}
                onTouchEnd={() => setRole('DUENIO')}
              />
              <Text style={styles.roleText}>Dueño</Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>Completa tu Información</Text>
          <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Apellido Paterno" value={lastName} onChangeText={setLastName} />

          {/* Selector de Fecha */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>
              {`Fecha de Nacimiento: ${birthDate.toLocaleDateString()}`}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()} // No permite fechas futuras
            />
          )}

          <TextInput style={styles.input} placeholder="Dirección" value={address} onChangeText={setAddress} />
          <TextInput style={styles.input} placeholder="Teléfono" value={phone} onChangeText={setPhone} />
          {role === 'PASEADOR' && (
            <TextInput style={styles.input} placeholder="Ocupación" value={occupation} onChangeText={setOccupation} />
          )}
          <Button title="Registrar" onPress={handleRegister} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  rolesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  role: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  roleText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerButton: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
});
