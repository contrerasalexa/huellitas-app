import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Linking } from 'react-native'; 
import { db } from '../utils/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export default function CitasAsignadasScreen({ route }) {
    const duenioId = route.params?.duenioId; 

    const [citasConPaseadores, setCitasConPaseadores] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCitasYCuidados = async () => {
        try {
            const citasQuery = query(collection(db, 'citas'), where('duenioId', '==', duenioId));
            const citasSnapshot = await getDocs(citasQuery);

            const citas = citasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            const dataCombinada = await Promise.all(
                citas.map(async (cita) => {
                    const cuidadosSnapshot = await getDocs(collection(db, 'cuidados'));
                    const cuidadoRelacionado = cuidadosSnapshot.docs
                        .map((doc) => ({ id: doc.id, ...doc.data() }))
                        .find((cuidado) => cuidado.citaId === cita.id);

                    let paseadorData = {};
                    if (cuidadoRelacionado) {
                        const paseadorRef = doc(db, 'users', cuidadoRelacionado.usuarioId);
                        const paseadorSnapshot = await getDoc(paseadorRef);

                        if (paseadorSnapshot.exists()) {
                            paseadorData = paseadorSnapshot.data();
                        }
                    }

                    return {
                        ...cita,
                        paseador: paseadorData,
                    };
                })
            );

            setCitasConPaseadores(dataCombinada);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar citas y paseadores:', error);
            Alert.alert('Error', 'No se pudieron cargar las citas.');
        }
    };

    useEffect(() => {
        if (duenioId) {
            fetchCitasYCuidados();
        } else {
            Alert.alert('Error', 'No se encontró el ID del dueño.');
        }
    }, [duenioId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Citas con Paseadores</Text>
            {loading ? (
                <Text style={styles.loading}>Cargando datos...</Text>
            ) : (
                <FlatList
                    data={citasConPaseadores}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.text}>Mascota: {item.mascotaNombre}</Text>
                            <Text style={styles.text}>Fecha: {item.fecha}</Text>
                            <Text style={styles.text}>Hora: {item.hora}</Text>
                            {item.paseador.name ? (
                                <>
                                    <Text style={styles.text}>
                                        Paseador: {item.paseador.name} {item.paseador.lastName}
                                    </Text>
                                    <Text style={styles.text}>Dirección: {item.paseador.address}</Text>
                                    <Text style={styles.text}>Correo: {item.paseador.email}</Text>
                                    <TouchableOpacity
                                        onPress={() => Linking.openURL(`tel:${item.paseador.phone}`)}
                                    >
                                        <Text style={[styles.text, { color: 'blue' }]}>
                                            Teléfono: {item.paseador.phone}
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <Text style={styles.text}>No hay paseador asignado aún.</Text>
                            )}
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    loading: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
        marginTop: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
});