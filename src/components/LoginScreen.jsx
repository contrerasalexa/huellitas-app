import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Recuperar el rol del usuario desde Firestore
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        // Redirigir según el rol
        if (userRole === 'PASEADOR') {
          navigation.navigate('BottomTabs'); // Redirigir al menú del paseador
        } else if (userRole === 'DUENIO') {
          navigation.navigate('Dueño'); // Redirigir al menú del dueño
        } else {
          alert('Rol no reconocido. Comuníquese con el administrador.');
        }
      } else {
        alert('Usuario no registrado.');
      }
    } catch (error) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        alert('Usuario y/o contraseña incorrecta.');
      } else {
        alert('Error al iniciar sesión: ' + error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../../assets/Huellitas.png')} />
      <Text style={styles.title}>Iniciar Sesión</Text>
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
      <View style={styles.buttonContainer}>
        <Button title="Ingresar" onPress={handleLogin} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Registrarse" onPress={() => navigation.navigate('Register')} />
      </View>
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
  image: {
    width: '100%',
    height: '40%',
    marginBottom: 10,
    alignSelf: 'center',
  },
  buttonContainer: {
    marginBottom: 15, // Espaciado entre los botones
  },
});
