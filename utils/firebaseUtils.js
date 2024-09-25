import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, query, where, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import * as Contacts from 'expo-contacts';

export const fetchGroups = async (userId) => {
  const q = query(collection(db, 'groups'), where('members', 'array-contains', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchGroupMembers = async (groupId) => {
  const groupDoc = await getDoc(doc(db, 'groups', groupId));
  const memberIds = groupDoc.data().members;
  const memberPromises = memberIds.map(id => getDoc(doc(db, 'users', id)));
  const members = await Promise.all(memberPromises);
  return members.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addExpense = async (expenseData) => {
  const expenseRef = await addDoc(collection(db, 'expenses'), {
    ...expenseData,
    createdAt: serverTimestamp(),
  });
  
  const groupRef = doc(db, 'groups', expenseData.groupId);
  await updateDoc(groupRef, {
    expenses: arrayUnion(expenseRef.id)
  });

  return expenseRef.id;
};

export const createGroup = async (groupData) => {
  const groupRef = await addDoc(collection(db, 'groups'), {
    ...groupData,
    createdAt: serverTimestamp(),
  });
  return groupRef.id;
};

export const fetchContacts = async () => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
      });

      if (data.length > 0) {
        return data.map(contact => ({
          id: contact.id,
          name: contact.name,
          phoneNumber: contact.phoneNumbers && contact.phoneNumbers[0] ? contact.phoneNumbers[0].number : null,
          image: contact.image ? contact.image.uri : 'https://via.placeholder.com/100',
        }));
      }
    }
    throw new Error('Permission to access contacts was denied');
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
};

export const checkUserExists = async (phoneNumber) => {
  const q = query(collection(db, 'users'), where('phoneNumber', '==', phoneNumber));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};