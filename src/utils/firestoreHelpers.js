import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase'; 

export const fetchMascotasForDuenio = async (duenioId) => {
  const mascotasRef = collection(db, 'mascotas');
  const q = query(mascotasRef, where('id_dueño', '==', `/users/${duenioId}`));
  const querySnapshot = await getDocs(q);

  const mascotas = [];
  querySnapshot.forEach((doc) => {
    mascotas.push({ id: doc.id, ...doc.data() });
  });

  return mascotas;
};
